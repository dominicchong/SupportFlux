import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useTicketStore = create((set, get) => ({
  tickets: [],
  filter: "All",
  isLoadingTickets: false,

  // Fetch all tickets
  fetchAllTickets: async () => {
    set({ isLoadingTickets: true });
    try {
      const res = await axiosInstance.get("/ticket/all-tickets"); 
      set({ tickets: res.data });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Error fetching tickets");
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  // Create new ticket
  createTicket: async (item) => {
    try {
      const { data } = await axiosInstance.post("/ticket/create", item);
      set((s) => ({ tickets: [data, ...s.tickets] }));
      await get().fetchAllTickets();
      toast.success("Ticket created");
    } catch (error) {
      console.error("Error creating new ticket: ", error)
      toast.error("Failed to create new ticket");
    }
  },

  // Update ticket status
  updateTicketStatus: async (ticketId, newStatus) => {
    try {
      await axiosInstance.put(`/ticket/${ticketId}/update-status`, { status: newStatus });
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t._id === ticketId ? { ...t, status: newStatus } : t
        ),
      }));
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  },

  // Set current filter tab
  setFilter: (filter) => set({ filter }),

  // Filter tickets
  filteredTickets: () => {
    const { tickets, filter } = get();
    if (filter === "New") return tickets.filter((t) => t.status === "New");
    if (filter === "In Progress") return tickets.filter((t) => t.status === "In Progress");
    if (filter === "Resolved") return tickets.filter((t) => t.status === "Resolved");
    return tickets;
  },

  getCategories: () => {
    const data = get().tickets;
    return [
      ...new Set(
        data
          .map((i) => i.category)
          .filter((c) => typeof c === "string" && c.trim())
      ),
    ];
  },

  deleteAllTickets: async () => {
    try {
      await axiosInstance.delete(`/ticket/delete-all`);
      await get().fetchAllTickets();
      toast.success("All tickets is deleted!");
    } catch (error) {
      toast.error("Error deleting all tickets");
      console.error("Error in deleteAllTickets: ", error);
    }
  }
}));
