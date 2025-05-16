import { Schema, model, Document } from 'mongoose';

export interface IComplaint extends Document {
  user: Schema.Types.ObjectId;
  event?: Schema.Types.ObjectId;
  message: string;
  reply?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event' }, // Optional
    message: { type: String, required: true },
    reply: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Complaint = model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
