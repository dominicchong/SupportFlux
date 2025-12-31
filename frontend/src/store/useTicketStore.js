import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useTicketStore = create((set, get) => ({
  tickets: [],
  myTickets: [],
  selectedTicket: null,
  filter: "All",
  unreadCount: {},
  statusList: ["All", "New", "In Progress", "Resolved"],
  levelList: ["Undergraduate", "Postgraduate"],
  isLoadingTickets: false,

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  resetTicketStore: () => set({
    myTickets: [],
    selectedTicket: null,
  }),

  // Fetch all tickets
  fetchAllTickets: async () => {
    set({ isLoadingTickets: true });
    try {
      const res = await axiosInstance.get("/ticket/all");
      set({ tickets: res.data });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Error fetching all tickets");
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  // Fetch my tickets
  fetchMyTickets: async () => {
    set({ isLoadingTickets: true });
    try {
      const res = await axiosInstance.get(`/ticket/my-tickets`);
      set({ myTickets: res.data });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Error fetching own tickets");
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  fetchTicketById: async (ticketId) => {
    try {
      const res = await axiosInstance.get(`/ticket/${ticketId}`);
      set({ selectedTicket: res.data });
    } catch (error) {
      console.error("Error fetching ticket by id:", error);
      toast.error(error.response?.data?.message || "Error fetching ticket by id");
    }
  },

  searchTicket: async () => {

  },

  // Create new ticket
  createTicket: async (item) => {
    try {
      const { data } = await axiosInstance.post("/ticket/create", item);
      set((s) => ({ tickets: [data, ...s.tickets] }));
      toast.success("Chat created");
    } catch (error) {
      console.error("Error creating new ticket: ", error)
      toast.error("Failed to create new ticket");
    } finally {
      get().fetchMyTickets();
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

  // Assign staff to ticket
  updateTicketStaff: async (ticketId, assignedStaffId) => {
    try {
      await axiosInstance.put(`/ticket/assign-staff`, { ticketId, staffId: assignedStaffId });
      toast.success(`Ticket assigned successfully`);
    } catch (error) {
      console.error("Error assigning staff to ticket:", error);
      toast.error("Failed to assign staff to ticket");
    } finally {
      get().fetchAllTickets();
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

  getTicketCountByStatus: (status) => {
    const { tickets } = get();
    if (status.toLowerCase() === "all") {
      return tickets.length;
    }
    return tickets.filter((t) => t.status === status).length;
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
      toast.success("All tickets is deleted!");
    } catch (error) {
      toast.error("Error deleting all tickets");
      console.error("Error in deleteAllTickets: ", error);
    }
  },

  isTicketCreator: (ticket, authUser) => {
    return ticket.userId._id === authUser._id;
  },

  // Unread message utilities
  setUnreadCount: (newUnread) => set({ unreadCount: newUnread }),

  incrementUnread: (fromTicketId) =>
    set((state) => ({
      unreadCount: {
        ...state.unreadCount,
        [fromTicketId]: (state.unreadCount[fromTicketId] || 0) + 1,
      },
    })),

  clearUnread: (ticketId) =>
    set((state) => {
      const { [ticketId]: _, ...rest } = state.unreadCount;
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
      console.error("Error loading unread count: ", error);
      toast.error("Failed loading unread count");
    }
  },
}));
