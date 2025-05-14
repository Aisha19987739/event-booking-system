import { Schema, model, Document } from 'mongoose';

// تعريف واجهة الحجز
interface IBooking extends Document {
  event: Schema.Types.ObjectId; // معرف الحدث
  user: Schema.Types.ObjectId;  // معرف المستخدم
  status: 'pending' | 'confirmed' | 'cancelled'; // حالة الحجز
  bookingDate: Date; // تاريخ الحجز
  ticketCount: number; // عدد التذاكر
}

// تعريف مخطط الحجز
const BookingSchema = new Schema<IBooking>({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  bookingDate: { type: Date, default: Date.now },
  ticketCount: { type: Number, required: true }
});




// إنشاء نموذج الحجز
const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
