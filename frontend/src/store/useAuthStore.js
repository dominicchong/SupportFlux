import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isSendingReset: false,
  users: [],
  
  checkAuth: async() => {
    try {
      const res = await axiosInstance.get('/auth/check-auth');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error('Error checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message || 'Error creating account');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message || 'Error logging in');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message || 'Error logging out');
    } finally {
      set({ isLoggingOut: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingReset: true });
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      toast.success('A reset link has been sent to your email');
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Failed to send reset email';
      toast.error(msg);
    } finally {
      set({ isSendingReset: false });
    }
  },

  updateProfile: async(data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
      return res.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error?.response?.data?.message ||        // server‑sent msg
        (error?.response?.status === 413 ? 'Image is too large' : null) ||
        error?.message || 'Error updating profile';  // fallback msg
      toast.error(message);
      return null;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  fetchUsers: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/users/get-all");
      set({ users: data });
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to fetch users");
    }
  },

  // Create or update a user
  saveUser: async (id, userData) => {
    try {
      if (id) {
        await axiosInstance.put(`/auth/users/update/${id}`, userData);
        toast.success("User updated");
      } else {
        await axiosInstance.post("/auth/users/create", userData);
        toast.success("User created");
      }
      await get().fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Failed to save user", error);
      toast.error("Failed to save user");
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(`/auth/users/delete/${id}`);
      await get().fetchUsers();
      toast.success("User deleted");
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
      throw error;
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    })
    socket.connect();

    set({ socket: socket});
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();

  },

}));
