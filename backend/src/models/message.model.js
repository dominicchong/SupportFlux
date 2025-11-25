import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false, // newly sent messages are unread by default
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
},
{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;