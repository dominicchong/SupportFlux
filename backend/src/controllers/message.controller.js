import Message from "../models/message.model.js";
import Ticket from "../models/ticket.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const getAllMessages = async (_, res) => {
  try {
    const allMessages = await Message.find().sort({ createdAt: -1 })
    res.status(200).json(allMessages);
  } catch (err) {
    console.error(" error:", err);
    res.status(500).json({ message: "Failed to fetch knowledge base items" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const myId = req.user._id;
    const role = req.user.role;

    // Only staff or the ticket owner can view
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isStaff = role !== "student";
    const isCreator = ticket.userId._id.toString() === myId.toString();

    if (!isStaff && !isCreator) {
      return res.status(403).json({ message: "You do not have permission to view this ticket" });
    }

    await Message.updateMany(
      { ticketId, senderId: { $ne: myId }, readBy: { $ne: myId } },
      { $addToSet: { readBy: myId } }
    );

    io.to(ticketId).emit("messagesRead", {
      ticketId,
      userId: myId,
    });

    // Messages belong ONLY to the ticket now
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { ticketId, text, image } = req.body;
    const senderId = req.user._id;
    const role = req.user.role;

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isPrivilegedUser = ["staff", "admin"].includes(role.toLowerCase());
    const isCreator = ticket.userId._id.toString() === senderId.toString();

    if (!isPrivilegedUser && !isCreator) {
      return res.status(403).json({ message: "Unauthorized: You cannot send messages to this ticket" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      ticketId,
      senderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    io.to(ticketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          readBy: { $ne: userId },     // user have not read it
          senderId: { $ne: userId }    // user is not sender
        }
      },
      { $group: { _id: "$ticketId", count: { $sum: 1 } } },
    ]);

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error in getUnreadCounts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLatestMessages = async (req, res) => {
  try {
    // Aggregate messages by ticket id
    const latestMessages = await Message.aggregate([
      // Sort by newest first
      { $sort: { createdAt: -1 } },
      // Group to get the latest message per conversation partner
      {
        $group: {
          _id: "$ticketId",
          text: { $first: "$text" },
          image: { $first: "$image" },
          senderId: { $first: "$senderId" },
          readBy: { $first: "$readBy" },
          createdAt: { $first: "$createdAt" },
        }
      }
    ]);

    if (!Array.isArray(latestMessages)) {
      return res.status(200).json([]);
    }

    res.status(200).json(latestMessages);
  } catch (error) {
    console.error("Error in getLatestMessages controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany();

    res.status(200).json({ message: "All messages deleted sucessfully" });
  } catch (error) {
    console.error("Error in deleteAllMessages controller:", error);
    res.status(500).json({ message: error.message });
  }
}