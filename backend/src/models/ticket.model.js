import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
  },
  level: {
    type: String,
  },
  status: {
    type: String,
  },
},
{ timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;