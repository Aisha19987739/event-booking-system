// models/favorite.model.ts
import mongoose, { Schema } from 'mongoose';

const favoriteSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
