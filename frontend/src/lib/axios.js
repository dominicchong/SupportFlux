import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Dynamic import 
      const { useAuthStore } = await import("../store/useAuthStore");
      const store = useAuthStore.getState();

      if (store.authUser) {
        // Only trigger logout if the user was actually logged in
        store.handleExternalLogout();
      }
    }
    return Promise.reject(error);
  }
);