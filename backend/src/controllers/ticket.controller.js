import Ticket from "../models/ticket.model.js";

// Get all tickets (for staff view)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "fullName email role profilePic")
      .populate("staffId", "fullName email role profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("getAllTickets Error:", error);
    res.status(500).json({ error: "Failed to fetch all tickets" });
  }
};

// Get own tickets
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    const tickets = await Ticket.find({ userId })
      .populate("userId", "fullName email role profilePic")
      .populate("staffId", "fullName email role profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("getUserTickets Error:", error);
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
};

export const getByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      return res.status(403).json({ message: "No ticket id found" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("userId", "fullName email role profilePic")
      .populate("staffId", "fullName email role profilePic")
      .sort({ updatedAt: -1 });
    
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json(ticket);
  } catch (error) {
    console.error("getByTicketId Error:", error);
    res.status(500).json({ error: "Failed to fetch ticket chat" });
  }
};


// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, level } = req.body;

    const newTicket = await Ticket.create({
      userId,
      category,
      level,
      status: "New",
    });

    console.log("New Ticket: ", newTicket)

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("createTicket Error:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// Update ticket status
export const updateStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("updateStatus Error:", error);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
};

// Assign staff
export const updateStaffId = async (req, res) => {
  try {
    const { ticketId, staffId } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { staffId },
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("updateStaffId Error:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const deleteAllTickets = async (req, res) => {
  try {
    await Ticket.deleteMany();

    res.status(200).json({ message: "All tickets deleted sucessfully"});
  } catch (error) {
    console.error("deleteAllTickets Error:", error);
    res.status(500).json({ error: "Failed to delete tickets" });
  }
};
