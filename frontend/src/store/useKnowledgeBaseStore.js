// /store/useKnowledgeBaseStore.js
import { create } from "zustand";
import { axiosInstance } from '../lib/axios.js';
import toast from "react-hot-toast";

export const useKnowledgeBaseStore = create((set, get) => ({
  knowledgeData: [],
  isLoading: false,
  error: null,

  // CRUD operations
  fetchKnowledge: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/knowledge-base");
      set({ knowledgeData: Array.isArray(data) ? data : [], isLoading: false });
      if (!data.length) toast("Knowledge base is currently empty.", { icon: "📭" });
    } catch (error) {
      set({
        error: error.message || "Failed to load knowledge base",
        isLoading: false,
        knowledgeData: [],
      });
      toast.error("Failed to load knowledge base");
    }
  },

  createKnowledge: async (item) => {
    try {
      const { data } = await axiosInstance.post("/knowledge-base/create", item);
      set((s) => ({ knowledgeData: [data, ...s.knowledgeData] }));
      toast.success("Article created");
    } catch (error) {
      toast.error("Create failed");
      throw error;
    }
  },

  updateKnowledge: async (id, item) => {
    try {
      const { data } = await axiosInstance.put(`/knowledge-base/update/${id}`, item);
      set((s) => ({
        knowledgeData: s.knowledgeData.map((k) => (k._id === id ? data : k)),
      }));
      toast.success("Article updated");
    } catch (error) {
      toast.error("Update failed");
      throw error;
    }
  },

  deleteKnowledge: async (id) => {
    try {
      await axios.delete(`/knowledge-base/delete/${id}`);
      set((s) => ({ knowledgeData: s.knowledgeData.filter((k) => k._id !== id) }));
      toast.success("Article deleted");
    } catch (error) {
      toast.error("Delete failed");
      throw error;
    }
  },

  // helper methods
  getCategories: () => {
    const data = get().knowledgeData;
    return [
      ...new Set(
        data
          .map((i) => i.category)
          .filter((c) => typeof c === "string" && c.trim())
      ),
    ];
  },
}));

