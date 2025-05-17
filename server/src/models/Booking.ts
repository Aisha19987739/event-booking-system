import mongoose, { Schema, model, Document } from 'mongoose';

// تعريف واجهة الحجز
interface IBooking extends Document {
  event: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  bookingDate: Date;
  ticketCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// تعريف مخطط الحجز
const BookingSchema = new Schema<IBooking>(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    bookingDate: { type: Date, default: Date.now },
    ticketCount: { type: Number, required: true },
  },
  {
    timestamps: true, // لإضافة createdAt و updatedAt تلقائياً
  }
);

// إنشاء نموذج الحجز
const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
