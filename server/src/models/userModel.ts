import mongoose, { Schema } from "mongoose";

// 1. تحديد الواجهة TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  username: string;  // تأكد من إضافة هذا الحقل
  password: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: Date;
}

// 2. إنشاء مخطط Mongoose
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {  // إضافة التحقق من unique و required هنا
    type: String,
    required: true,
    unique: true,  // هذا يجعل الاسم فريدًا
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
