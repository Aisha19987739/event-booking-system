// models/Event.ts

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // باقي الحقول...
});

export default mongoose.model('Event', eventSchema);
