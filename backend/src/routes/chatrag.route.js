import express from "express";
import KnowledgeItem from "../models/knowledgeItem.model.js";
import { pipeline } from "@xenova/transformers";

const router = express.Router();

// Load once
let embedder;
(async () => {
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
})();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    // 1) Embed the question
    const q = await embedder(message, { pooling: "mean", normalize: true });
    const queryVector = Array.from(q);

    // 2) Retrieve top KB passages
    const kbResults = await KnowledgeItem.aggregate([
      {
        $vectorSearch: {
          index: "kb_vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 200,
          limit: 5
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    // 3) Build grounded prompt
    const context = kbResults
      .map((d, i) => `(${i + 1}) [${d.category}] ${d.title}: ${d.description}`)
      .join("\n\n");

    const systemInstructions = `
You are UM's helpful assistant. Use the Knowledge Base first.
- If the KB contains the answer, answer from it concisely.
- If the KB is silent, say you couldn't find policy-specific info and then give a general tip.
- When using KB, include a "Sources" section listing the titles you used.
`;

    const prompt = `${systemInstructions}

Knowledge Base:
${context || "(no matching KB found)"}

Student question: ${message}

Answer:`;

    // 4) Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    ).then(r => r.json());

    const reply =
      geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // 5) Return model answer + sources
    res.json({
      reply,
      sources: kbResults.map((d) => ({ title: d.title, category: d.category }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "RAG chat error" });
  }
});

export default router;
