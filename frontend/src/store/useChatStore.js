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
  isSendMessageLoading: false,
  unreadCount: {}, // { userId: count }
  latestMessages: {},
  activeDate: null,

  setActiveDate: (date) => set ({activeDate: date}),
  resetActiveDate: () => set({ activeDate: null }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Fetch users
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
      const messages = res.data;
      const messageLength = res.data.length;

      if (messageLength > 0) {
        const lastMessage = messages[messageLength- 1];
        get().setLatestMessage(userId, lastMessage);
      }

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
    set({ isSendMessageLoading: true });
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const newMessage = res.data;

      // Add message to sender’s chat immediately
      set({ messages: [...messages, newMessage] });

      get().setLatestMessage(selectedUser._id, newMessage);

      // Emit socket event so receiver sees it instantly
      if (socket) {
        socket.emit("sendMessage", {
          ...newMessage,
          receiverId: selectedUser._id,
          senderId: authUser._id,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
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
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (!socket || !authUser) return;

    socket.off("newMessage"); // avoid duplicate listeners
    socket.on("newMessage", (newMessage) => {
      const { senderId, receiverId } = newMessage;
      const currentSelectedUser = get().selectedUser;

      // Only increment unread if message is FOR this user (receiver)
      if (receiverId === authUser._id) {
        get().setLatestMessage(senderId, newMessage);

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

      if (senderId === authUser._id) {
        get().setLatestMessage(receiverId, newMessage);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  // Unread message utilities
  setUnreadCount: (newUnread) => set({ unreadCount: newUnread }),

  incrementUnread: (fromUserId) =>
    set((state) => ({
      unreadCount: {
        ...state.unreadCount,
        [fromUserId]: (state.unreadCount[fromUserId] || 0) + 1,
      },
    })),

  clearUnread: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.unreadCount;
      return { unreadCount: rest };
    }),
  
  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-counts");
      const unreadMap = {};

      if (Array.isArray(res.data)) {
        res.data.forEach((item) => {
          // Skip invalid entries (no _id or count)
          if (!item?._id || typeof item.count !== "number") return;
          unreadMap[item._id] = item.count;
        });
      }

      set({ unreadCount: unreadMap });
    } catch (error) {
      console.warn("Error: ", error)
      console.warn("Skipped unread count fetch due to network or format issue.");
    }
  },

  getLatestMessages: async (userId) => {
    try {
      const res = await axiosInstance.get("/messages/latest-messages");
      
      if (!Array.isArray(res.data)) {
        console.warn("Unexpected latest-messages response:", res.data);
        return;
      }

      const latestMap = {};
      res.data.forEach((msg) => {
        latestMap[msg._id] = {
          text: msg.text,
          image: msg.image,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          createdAt: msg.createdAt,
        };
      });
      set({ latestMessages: latestMap });
    } catch (error) {
      console.error("Error fetching latest messages:", error);
      set({ latestMessages: {} });
    }
  },

  setLatestMessage: (userId, message) => {
    set((state) => ({
      latestMessages: {
        ...state.latestMessages,
        [userId]: message,
      },
    }))
  },

  // Need to change implementation
  getFirstUnreadIndex: () => {
    const { selectedUser, messages, authUser } = get();
    if (!selectedUser || !messages?.length || !authUser) return -1;
    const lastReadTime = selectedUser.lastRead 
      ? new Date(selectedUser.lastRead).getTime() : null;

    return messages.findIndex(
      (msg) => 
        msg.senderId !== authUser._id && 
        (!lastReadTime || new Date(msg.createdAt).getTime() > lastReadTime)
    );
  },

  hasUnread: () => {
    const index = get().getFirstUnreadIndex();
    return index !== -1;
  }

}));