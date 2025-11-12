import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useTicketStore = create((set, get) => ({
  tickets: [],
  filter: "all", // "all", "pending", "resolved"
  isLoading: false,

  // Fetch all tickets
  fetchAllTickets: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/ticket/all-tickets"); 
      set({ tickets: res.data });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Error fetching tickets");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new ticket
  createTicket: async (item) => {
    try {
      const { data } = await axiosInstance.post("/ticket/create", item);
      set((s) => ({ tickets: [data, ...s.tickets] }));
      toast.success("Ticket created");
    } catch (error) {
      console.log("Error creating new ticket: ", error)
      toast.error("Failed to create new ticket");
    }
  },

  // Mark a ticket as resolved
  markAsResolved: async (ticketId) => {
    try {
      await axiosInstance.put(`/ticket/${ticketId}/resolve`);
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t._id === ticketId ? { ...t, status: "resolved" } : t
        ),
      }));
      toast.success("Ticket marked as resolved");
    } catch (error) {
      console.error("Error marking resolved:", error);
      toast.error(error.response?.data?.message || "Failed to mark resolved");
    }
  },

  // Mark a ticket as In Progress
  markAsInProgress: async (ticketId) => {
    try {
      await axiosInstance.put(`/ticket/${ticketId}/in-progress`);
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t._id === ticketId ? { ...t, status: "in progress" } : t
        ),
      }));
      toast.success("Ticket marked as In Progress");
    } catch (error) {
      console.error("Error marking In Progress:", error);
      toast.error(error.response?.data?.message || "Failed to mark In Progress");
    }
  },

  // Set current filter tab
  setFilter: (filter) => set({ filter }),

  // Filter tickets
  filteredTickets: () => {
    const { tickets, filter } = get();
    if (filter === "new") return tickets.filter((t) => t.status === "new");
    if (filter === "in progress") return tickets.filter((t) => t.status === "in progress");
    if (filter === "resolved") return tickets.filter((t) => t.status === "resolved");
    return tickets;
  },
}));
