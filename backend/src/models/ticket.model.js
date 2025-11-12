import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    default: "new",
  },
},
{ timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;