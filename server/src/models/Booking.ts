// models/Booking.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  ticketCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const bookingSchema = new Schema<IBooking>({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 👈 هذا مهم
  ticketCount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
