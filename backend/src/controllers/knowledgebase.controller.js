import KnowledgeItem from "../models/knowledgeItem.model.js";
import {generateEmbedding} from "../lib/embedding.js";

// Get all KB items
export const getAllKnowledge = async (_, res) => {
  try {
    const items = await KnowledgeItem.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email")
      .populate("updatedBy", "fullName email");

    res.status(200).json(items);
  } catch (err) {
    console.error("Get all knowledge error:", err);
    res.status(500).json({ message: "Failed to fetch knowledge base items" });
  }
};

export const createKnowledge = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" }); // ✅ CHANGE: Basic validation
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const embeddingGenerated = await generateEmbedding(title + " " + description);

    const newItem = await KnowledgeItem.create({
      title,
      description,
      category,
      createdBy: req.user._id,
      embedding: embeddingGenerated,
    });

    const savedItem = await newItem.save();
    const populatedItem = await savedItem.populate("createdBy", "fullName email");
    res.status(201).json(populatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create knowledge base item" });
  }
};

// Update existing knowledge item
export const updateKnowledge = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const existingItem = await KnowledgeItem.findById(req.params.id);
    if (!existingItem) return res.status(404).json({ message: "Item not found" });

    // Generate new embedding only if content changed
    let newEmbedding = existingItem.embedding;
    if (title !== existingItem.title || description !== existingItem.description) {
      newEmbedding = await generateEmbedding(title + " " + description);
    }

    existingItem.title = title || existingItem.title;
    existingItem.description = description || existingItem.description;
    existingItem.category = category || existingItem.category;
    existingItem.updatedBy = req.user._id;
    existingItem.embedding = newEmbedding;

    const updated = await existingItem.save();

    const populated = await updated
      .populate("createdBy", "fullName email")
      .populate("updatedBy", "fullName email");

    res.json(populated);
  } catch (err) {
    console.error("Update KB error:", err);
    res.status(500).json({ message: "Failed to update knowledge base item" });
  }
};

export const deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await KnowledgeItem.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.json({ _id: deleted._id, message: "Article deleted successfully" });
  } catch (err) {
    console.error("Delete KB error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const queryRAG = async (req, res) => {
  const { query, k = 3 } = req.body;
  try {
    const vector = await generateEmbedding(query);

    const results = await KnowledgeItem.aggregate([
      {
        $vectorSearch: {
          index: "kb_vector_index",
          path: "embedding",
          queryVector: vector,
          numCandidates: 100,
          limit: k,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Query RAG error:", err);
    res.status(500).json({ message: "Failed to query knowledge base" });
  }
};
