import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const sortCategories = (list) => {
  return [...list].sort((a, b) => 
    a.category.localeCompare(b.category, undefined, { sensitivity: 'base' })
  );
};

export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,

  // Fetch all categories
  getCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/category");
      set({ categories: sortCategories(res.data) });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new category
  createCategory: async (data) => {
    const { categories } = get(); // Access the current state
    const newCategory = data.category.trim();

    // Duplicate check (case-insensitive)
    const isDuplicate = categories.some(
      (cat) => cat.category.toLowerCase() === newCategory.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("This category already exists!");
      return false; // Exit early without calling the API
    }

    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/category", { ...data, category: newCategory });
      set((state) => ({ categories: sortCategories([...state.categories, res.data]) }));
      toast.success("Category created");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing category
  updateCategory: async (id, data) => {
    const { categories } = get();
    const updatedCategory = data.category.trim();

    // Check if the new category is already taken by other category
    const isDuplicate = categories.some(
      (cat) => cat.category.toLowerCase() === updatedCategory.toLowerCase() && cat._id !== id
    );

    if (isDuplicate) {
      toast.error("Category already exists!");
      return false;
    }

    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/category/${id}`, { ...data, category: updatedCategory });
      set((state) => ({
        categories: sortCategories(
          state.categories.map((cat) => (cat._id === id ? res.data : cat))
        ),
      }));
      toast.success("Category updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a category
  deleteCategory: async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/category/${id}`);
      set((state) => ({
        categories: sortCategories(
          state.categories.filter((cat) => cat._id !== id)
        ),
      }));
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));