import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast"; // ✅ Use react-hot-toast

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useChatbotStore = create((set, get) => ({
  isLoading: false,
  isSending: false,
  messages: [], // [{ type: 'user' | 'bot', text }]
  error: null,

  addMessage: async (message) => {
    try {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    } catch (error) {
      console.error("Error adding message:", error);
      toast.error("Failed to add message");
    }
  },

  sendPrompt: async (prompt) => {
    if (get().isSending || !prompt.trim()) return;

    const userMessage = { type: "user", text: prompt };
    const botErrorMessage = {
      type: "bot",
      text: "Sorry, I couldn't process that request.",
    };

    set({
      messages: [...get().messages, userMessage],
      isLoading: true,
      isSending: true,
      error: null,
    });

    try {
      const { data } = await axiosInstance.post(
        "/chatbot/generate-response",
        { prompt }
      );

      const botMessage = { type: "bot", text: data.response };

      set({
        messages: [...get().messages, botMessage],
        isLoading: false,
        isSending: false,
      });
    } catch (err) {
      console.error("Chatbot error:", err);

      const errorMessage =
        err?.response?.data?.error || err.message || "Chatbot request failed";

      set({
        messages: [...get().messages, botErrorMessage],
        isLoading: false,
        isSending: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  newChat: () => {
    try {
      set({
        messages: [],
        isLoading: false,
        isSending: false,
        error: null,
      });
    } catch (error) {
      console.error("Error resetting chat:", error);
      toast.error("Failed to reset chat");
    }
  },
}));
