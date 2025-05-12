import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async() => {
    try {
      const res = await axiosInstance.get('/auth/check-auth');

      set({ authUser: res.data });

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
      toast.success('Account created successfully');
      set({ authUser: res.data });
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
    } catch (error) {
      toast.error(error.response.data.message || 'Error logging out');
    } finally {
      set({ isLoggingOut: false });
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
      toast.error(error.response.data.message || 'Error updating profile');
      return null;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

}));
