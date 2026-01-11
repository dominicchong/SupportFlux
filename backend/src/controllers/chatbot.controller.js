import { GoogleGenerativeAI } from "@google/generative-ai";
import KnowledgeItem from "../models/knowledgeItem.model.js";
import { generateEmbedding } from "../lib/embedding.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateChatbotResponse = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export const ragSearch = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const queryVector = await generateEmbedding(prompt);

    // Vector Search in MongoDB
    const results = await KnowledgeItem.aggregate([
      {
        $vectorSearch: {
          index: "kb_vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit: 5,
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

    // Return results with score
    res.json({
      success: true,
      matches: results
    });

  } catch (err) {
    console.error("RAG Search Error:", err);
    res.status(500).json({ error: "Failed to perform vector search" });
  }
};

