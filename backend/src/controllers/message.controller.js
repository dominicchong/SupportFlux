import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })

    // Mark as read all messages sent to me that are unread
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );

    // Notify sender (userToChatId) their messages are read
    const senderSocketId = getReceiverSocketId(userToChatId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { readerId: myId });
    }

    res.status(200).json(messages)
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isRead: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // only sending message to the receiver because it is private chat
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Group all unread messages where the logged-in user is the receiver
    const unreadCounts = await Message.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    // Otherwise, return normal unread count array
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
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId"
            ]
          },
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