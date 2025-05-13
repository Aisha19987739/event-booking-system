import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET);

// الاتصال بقاعدة البيانات
connectDB();

// تعريف المسارات
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes); // تأكدي أن الملف موجود ومصنوع بشكل صحيح

// نقطة بداية للتأكد من أن السيرفر شغال
app.get('/', (_req, res) => {
  res.send('Server is running');
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
