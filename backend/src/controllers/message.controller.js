import Message from "../models/message.model.js";
import Ticket from "../models/ticket.model.js";

import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const getTicketsForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const role = req.user.role;

    let tickets;

    if (role === "staff") {
      tickets = await Ticket.find().populate("userId");
    } else {
      tickets = await Ticket.find({ userId: loggedInUserId }).populate("userId");
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error in getTicketsForSidebar:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const myId = req.user._id;
    const role = req.user.role;

    // ACCESS RULE: only staff or the ticket owner
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isStaff = role !== "student";  
    const isCreator = ticket.userId._id.toString() === myId.toString();

    if (!isStaff && !isCreator) {
      return res.status(403).json({ message: "Unauthorized: You cannot view this ticket" });
    }

    // Messages belong ONLY to the ticket now
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });

    await Message.updateMany(
      { ticketId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

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

    const isStaff = role !== "student";
    const isCreator = ticket.userId._id.toString() === senderId.toString();

    if (!isStaff && !isCreator) {
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
      isRead: false,
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
      { $match: { readBy: { $ne: userId } } },
      { $group: { _id: "$ticketId", count: { $sum: 1 }}},
    ]);

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error in getUnreadCounts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLatestMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Aggregate messages where the logged-in user is either sender or receiver
    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      // Sort by newest first
      { $sort: { createdAt: -1 } },
      // Group to get the latest message per conversation partner
      {
        $group: {
          _id: "$ticketId",
          text: { $first: "$text" },
          image: { $first: "$image" },
          senderId: { $first: "$senderId" },
          receiverId: { $first: "$receiverId" },
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

    res.status(200).json({ message: "All messages deleted sucessfully"});
  } catch (error) {
    console.error("Error in deleteAllMessages controller:", error);
    res.status(500).json({ message: error.message });
  }
}