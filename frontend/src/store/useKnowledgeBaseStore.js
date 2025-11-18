import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
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
      toast.error("Failed to create new article");
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
      toast.error("Failed to update article");
      throw error;
    }
  },

  deleteKnowledge: async (id) => {
    try {
      await axiosInstance.delete(`/knowledge-base/delete/${id}`);
      set((s) => {
        const index = s.knowledgeData.findIndex(
          (k) => k._id.toString() === id.toString()
        );
        if (index === -1) return s; // item not found, do nothing

        const newData = [
          ...s.knowledgeData.slice(0, index),
          ...s.knowledgeData.slice(index + 1),
        ];

        return { knowledgeData: newData };
      });

      toast.success("Article deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete article");
      throw error;
    }
  },


  // Search helper
  searchKnowledge: async (query) => {
    if (!query) return [];
    try {
      const { data } = await axiosInstance.post("/knowledge-base/search", { query });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      toast.error("Search failed");
      return [];
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
