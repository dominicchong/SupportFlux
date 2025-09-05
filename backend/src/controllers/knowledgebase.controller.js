import KnowledgeItem from "../models/knowledgeItem.model.js";
import {generateEmbedding} from "../lib/embedding.js";

// Get all KB items
export const getAllKnowledge = async (_, res) => {
  const items = await KnowledgeItem.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email") // populate user info
    .populate("updatedBy", "name email");
  res.json(items);
};

export const createKnowledge = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const embeddingGenerated = await generateEmbedding(title + " " + description);

    const newItem = await KnowledgeItem.create({
      title,
      description,
      category,
      createdBy: req.user._id,
      embedding: embeddingGenerated,
    });

    const populatedItem = await newItem.populate("createdBy", "name email");
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
    const newEmbeddingGenerated = await generateEmbedding(title + " " + description);

    const updated = await KnowledgeItem.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        updatedBy: req.user._id,
        embedding: newEmbeddingGenerated,
      },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update knowledge base item" });
  }
};

export const deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deleted = await KnowledgeItem.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.json({ _id: deleted._id, message: "Article deleted successfully" });
  } catch (err) {
    console.error("Delete KB error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const queryRAG = async (req, res) => {
  const { vector, k } = req.body;

  try {
    const results = await KnowledgeItem.aggregate([
      {
        $search: {
          index: "kb_vector_index",
          knnBeta: {
            vector,
            path: "embedding",
            k: k || 1,
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          score: { $meta: "searchScore" },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to query knowledge base" });
  }
};

