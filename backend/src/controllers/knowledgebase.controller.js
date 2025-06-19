import KnowledgeItem from "../models/knowledgeItem.model.js";

export const getAllKnowledge = async (_, res) => {
  const items = await KnowledgeItem.find().sort({ createdAt: -1 });
  res.json(items);
};

export const createKnowledge = async (req, res) => {
  const { title, description, category } = req.body;
  const newItem = await KnowledgeItem.create({ title, description, category });
  res.status(201).json(newItem);
};

export const updateKnowledge = async (req, res) => {
  const updated = await KnowledgeItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Item not found" });
  res.json(updated);
};

export const deleteKnowledge = async (req, res) => {
  const deleted = await KnowledgeItem.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Item not found" });
  res.json({ _id: deleted._id });
};
