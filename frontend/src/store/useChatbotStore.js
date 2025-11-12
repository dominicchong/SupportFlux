import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast"; 

export const useChatbotStore = create((set, get) => ({
  isLoading: false,
  isSending: false,
  messages: [], 
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

    // Add user message and set loading state
    set({
      messages: [...get().messages, userMessage],
      isLoading: true,
      isSending: true,
      error: null,
    });

    try {
      // 1️⃣ Fetch Knowledge Base items
      const { data: kbItems } = await axiosInstance.get("/knowledge-base");


      // 2️⃣ Find KB match (simple keyword search)
      const lowerPrompt = prompt.toLowerCase();
      const kbMatch = kbItems.find(
        (item) =>
          item.title.toLowerCase().includes(lowerPrompt) ||
          item.description.toLowerCase().includes(lowerPrompt)
      );

      let botMessage;
      if (kbMatch) {
        // 3️⃣ Return KB item if match found
        botMessage = {
          type: "bot",
          text: `From Knowledge Base:\n\n**${kbMatch.title}**\n\n${kbMatch.description}`,
        };
      } else {
        // 4️⃣ Otherwise call Gemini API
        const { data } = await axiosInstance.post("/chatbot/generate-response", { prompt });
        botMessage = { type: "bot", text: data.response };
      }

      // 5️⃣ Update messages
      set({
        messages: [...get().messages, botMessage],
        isLoading: false,
        isSending: false,
      });
    } catch (err) {
      console.error("Chatbot error:", err);

      const errorMessage = err?.response?.data?.error || err.message || "Chatbot request failed";

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
