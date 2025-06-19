import mongoose from "mongoose";

const knowledgeItemSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, trim: true },
    description:{ type: String, required: true, trim: true },
    category:  { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("KnowledgeItem", knowledgeItemSchema);
