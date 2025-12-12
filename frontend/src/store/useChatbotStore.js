import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { formatBotMessage } from "../lib/formatBotMessage.js";

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
      text: "Sorry, I couldn't process your request.",
    };

    // Add user message and set loading state
    set({
      messages: [...get().messages, userMessage],
      isLoading: true,
      isSending: true,
      error: null,
    });

    try {
      // RAG endpoint
      const { data } = await axiosInstance.post("/chatbot/rag", { prompt });
      const matches = data.matches || [];
      let botMessage;

      if (matches.length > 0) {
        const kbBest = matches.reduce((max, item) => {
          return item.score > max.score ? item : max;
        }, matches[0]);

        botMessage = {
          type: "bot",
          text: formatBotMessage({
            title: kbBest.title,
            category: kbBest.category,
            description: kbBest.description,
            score: kbBest.score,
          }),
        };
      } else {
        const { data: kbItems } = await axiosInstance.get("/knowledge-base");

        // Simple keyword search
        const lowerPrompt = prompt.toLowerCase();
        const kbMatch = kbItems.find(
          (item) =>
            item.title.toLowerCase().includes(lowerPrompt) ||
            item.description.toLowerCase().includes(lowerPrompt)
        );

        if (kbMatch) {
          // Return KB item if match found
          botMessage = {
            type: "bot",
            text: `From Knowledge Base:\n\n**${kbMatch.title}**\n\n${kbMatch.description}`,
          };
        }
      }
      // else {
      //   // 4️⃣ Otherwise call Gemini API
      //   const { data } = await axiosInstance.post("/chatbot/generate-response", { prompt });
      //   botMessage = { type: "bot", text: data.response };
      // }

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
