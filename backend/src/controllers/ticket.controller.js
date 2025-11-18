import Ticket from "../models/ticket.model.js";

// Get all tickets (for staff view)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "fullName email role")
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
    const userId = req.user._id;

    const tickets = await Ticket.find({ userId })
      .populate("userId", "fullName email role")
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
    const userId = req.user._id;
    const { category } = req.body;

    const newTicket = await Ticket.create({
      userId,
      category,
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
    console.error("markAsInProgress Error:", error);
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
