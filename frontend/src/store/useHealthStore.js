import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useHealthStore = create((set) => ({
  systemStatus: "loading",
  
  checkHealth: async () => {
    try {
      await axiosInstance.get("/health/check");
      set({ systemStatus: "online" });
    } catch (error) {
      set({ systemStatus: "offline" });
      console.error("Health check Failed", error);
    }
  }
}));