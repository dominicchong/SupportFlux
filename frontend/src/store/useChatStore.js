import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {}, // { userId: count }

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  // 🔹 Fetch users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages for selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // Fetch all messages (and backend will auto-mark as read)
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // Clear unread for this user in local store
      get().clearUnread(userId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Add message to sender’s chat immediately
      set({ messages: [...messages, res.data] });

      // Emit socket event so receiver sees it instantly
      if (socket) {
        socket.emit("sendMessage", {
          ...res.data,
          receiverId: selectedUser._id,
          senderId: authUser._id,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
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

  // 🔹 Subscribe to incoming messages (receiver’s side)
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (!socket || !authUser) return;

    socket.off("newMessage"); // avoid duplicate listeners
    socket.on("newMessage", (newMessage) => {
      const { senderId, receiverId } = newMessage;
      const currentSelectedUser = get().selectedUser;

      // ✅ Only increment unread if message is FOR this user (receiver)
      if (receiverId === authUser._id) {
        // If chat with sender is NOT currently open → increment unread
        if (!currentSelectedUser || currentSelectedUser._id !== senderId) {
          get().incrementUnread(senderId);
        } else {
          // If open chat → directly append message
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  // 🔹 Unread message utilities
  setUnreadMessages: (newUnread) => set({ unreadMessages: newUnread }),

  incrementUnread: (fromUserId) =>
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [fromUserId]: (state.unreadMessages[fromUserId] || 0) + 1,
      },
    })),

  clearUnread: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.unreadMessages;
      return { unreadMessages: rest };
    }),
  
  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-counts");
      const unreadMap = {};
      res.data.forEach((item) => {
        unreadMap[item._id] = item.count;
      });
      set({ unreadMessages: unreadMap });
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  },

}));