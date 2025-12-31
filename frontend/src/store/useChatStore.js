import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { useTicketStore } from './useTicketStore';

export const useChatStore = create((set, get) => ({
  allMessages: [],
  messages: [],
  isMessagesLoading: false,
  isSendMessageLoading: false,
  latestMessages: {},
  activeDate: null,
  commonWords: [],

  setActiveDate: (date) => set({ activeDate: date }),
  resetActiveDate: () => set({ activeDate: null }),

  // Get all messages for dashboard
  getAllMessages: async () => {
    try {
      // Fetch all messages (and backend will auto-mark as read)
      const res = await axiosInstance.get(`/messages/all-messages`);
      const messagesData = res.data;
      set({ allMessages: messagesData });

    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching all messages");
    }
  },

  // Fetch messages for selected ticket
  getMessages: async (ticketId) => {
    set({ isMessagesLoading: true });
    try {
      // Fetch all messages (and backend will auto-mark as read)
      const res = await axiosInstance.get(`/messages/${ticketId}`);
      useTicketStore.getState().clearUnread(ticketId);
      
      const messagesData = res.data;
      const messageLength = messagesData.length;
      set({ messages: messagesData });

      if (messageLength > 0) {
        const lastMessage = messagesData[messageLength - 1];
        get().setLatestMessage(ticketId, lastMessage);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    set({ isSendMessageLoading: true });
    const { messages } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;
    const selectedTicket = useTicketStore.getState().selectedTicket;
    const senderId = authUser._id;
    const ticketId = selectedTicket._id;

    try {
      const res = await axiosInstance.post(`/messages/${selectedTicket._id}/send`, { ...messageData, ticketId: selectedTicket._id });
      const newMessage = res.data;

      // Add message to sender’s chat immediately
      set({ messages: [...messages, newMessage] });

      get().setLatestMessage(ticketId, newMessage);

      // Emit socket event so receiver sees it instantly
      if (socket) {
        socket.emit("sendMessage", {
          ticketId,
          senderId,
          ...newMessage,
          readBy: [senderId],
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
      console.error("sendMessage useChatStore Error:", error)
    } finally {
      set({ isSendMessageLoading: false });
    }
  },

  // Grouped messages by date
  getGroupedMessages: () => {
    const messages = get().messages;
    const grouped = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString("en-MY");
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });

    return grouped;
  },

  // Subscribe to incoming messages (receiver’s side)
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (!socket || !authUser) return;

    socket.off("newMessage"); // avoid duplicate listeners
    socket.on("newMessage", (newMessage) => {
      const selectedTicket = useTicketStore.getState().selectedTicket;

      // If ticket is NOT open → unread
      if (!selectedTicket || selectedTicket._id !== newMessage.ticketId) {
        useTicketStore.getState().incrementUnread(newMessage.ticketId);
        return;
      }

      // Append message to current chat
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      get().setLatestMessage(selectedTicket._id, newMessage);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },


  getLatestMessages: async () => {
    try {
      const res = await axiosInstance.get("/messages/latest-messages");

      if (!Array.isArray(res.data)) {
        console.warn("Unexpected latest-messages response:", res.data);
        return;
      }

      const latestMap = {};
      res.data.forEach((msg) => {
        const ticketId = msg._id;
        latestMap[ticketId] = {
          text: msg.text,
          image: msg.image,
          senderId: msg.senderId,
          readBy: msg.readBy,
          createdAt: msg.createdAt,
        };
      });
      set({ latestMessages: latestMap });
    } catch (error) {
      console.error("Error fetching latest messages:", error);
      set({ latestMessages: {} });
    }
  },

  setLatestMessage: (ticketId, message) => {
    set((state) => ({
      latestMessages: {
        ...state.latestMessages,
        [ticketId]: message,
      },
    }))
  },

  formatLatestMessages: (ticketId, authUserId) => {
    const { latestMessages } = get();
    const noMessage = "(No messages yet)";

    const msg = latestMessages?.[ticketId];
    if (!msg) return noMessage;

    const isYou = msg.senderId === authUserId;

    let content = "";
    if (msg.text) {
      content = msg.text;
    } else if (msg.image) {
      content = "🖼️ Image";
    } else {
      return noMessage;
    }

    return isYou ? `You: ${content}` : content;
  },


  // TO-DO: Need to change implementation
  getFirstUnreadIndex: () => {
    const { selectedTicket, messages, authUser } = get();
    if (!selectedTicket || !messages?.length || !authUser) return -1;
    const lastReadTime = selectedTicket.lastRead
      ? new Date(selectedTicket.lastRead).getTime() : null;

    return messages.findIndex(
      (msg) =>
        msg.senderId !== authUser._id &&
        (!lastReadTime || new Date(msg.createdAt).getTime() > lastReadTime)
    );
  },

  hasUnread: () => {
    const index = get().getFirstUnreadIndex();
    return index !== -1;
  },

  // TODO: add the method to the controller backend to link with database
  deleteMessagesByTicketId: async (ticketId) => {
    try {
      await axiosInstance.delete(`/messages/${ticketId}/delete-ticket`);
      toast.success("All messages is deleted!");
    } catch (error) {
      toast.error("Error deleting all messages");
      console.error("Error in deleteAllMessages: ", error);
    }
  },

  deleteAllMessages: async () => {
    try {
      await axiosInstance.delete(`/messages/delete-all`);
      toast.success("All messages is deleted!");
    } catch (error) {
      toast.error("Error deleting all messages");
      console.error("Error in deleteAllMessages: ", error);
    }
  },

  getCommonWords: () => {
    const allMessages = get().allMessages;

    // Normalize to flat array
    const messages = Array.isArray(allMessages)
      ? allMessages
      : Object.values(allMessages || {}).flat();

    const stopWords = new Set([
      "the", "is", "and", "to", "a", "of", "in", "on",
      "for", "with", "that", "this", "it", "i", "you",
      "we", "they", "he", "she", "please", "hi", "hello",
      "thanks", "thank"
    ]);

    const wordCount = {};

    messages.forEach(msg => {
      const text = msg?.text || msg?.message;
      if (!text) return;

      text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")   // remove punctuation
        .split(/\s+/)
        .forEach(word => {
          if (word.length > 2 && !stopWords.has(word)) {
            wordCount[word] = (wordCount[word] || 0) + 1;
          }
        });
    });

    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  },

  fetchAllMessages: () => {
    const messages = get().getAllMessages();
    set({ allMessages: messages });
  },

}));