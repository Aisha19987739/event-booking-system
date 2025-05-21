import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
