import Ticket from "../models/ticket.model.js";

// Get all tickets (for staff view)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("studentId", "fullName email role")
      .populate("staffId", "fullName email role")
      .sort({ updatedAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("getAllTickets Error:", error);
    res.status(500).json({ error: "Failed to fetch all tickets" });
  }
};

// Get tickets for a specific student
export const getStudentTickets = async (req, res) => {
  try {
    const studentId = req.user._id;

    const tickets = await Ticket.find({ studentId })
      .populate("staffId", "fullName email role")
      .sort({ updatedAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("getStudentTickets Error:", error);
    res.status(500).json({ error: "Failed to fetch student tickets" });
  }
};

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const { staffId } = req.body;
    const studentId = req.user._id;

    const newTicket = await Ticket.create({
      studentId,
      staffId,
      status: "pending",
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("createTicket Error:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// Mark ticket as resolved
export const markAsResolved = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status: "resolved" },
      { new: true }
    );

    res.status(200).json(ticket);
  } catch (error) {
    console.error("markAsResolved Error:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

// Mark ticket as In Progress
export const markAsInProgress = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status: "in progress" },
      { new: true }
    );

    res.status(200).json(ticket);
  } catch (error) {
    console.error("markAsInProgress Error:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};
