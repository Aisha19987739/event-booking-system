import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: false },
    capacity: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    latitude: { type: Number },    // أضف هذا
    longitude: { type: Number }, 

    // ✅ الحقل المطلوب لربط Firebase Image URL
   image: { type: String, required: false },

  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
