// src/app.ts
import express from 'express';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import eventRoutes from './routes/eventRoutes';
import categoryRoutes from './routes/categoryRoutes';
import complaintRoutes from './routes/complaintRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import reviewRoutes from './routes/reviewRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import cors from 'cors';

const dotenv = require('dotenv');
dotenv.config();

dotenv.config();
const app = express();
// السماح لـ frontend على هذا origin فقط
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // إذا كنت تستخدم ملفات تعريف الارتباط (Cookies)
}));

app.use(express.json());


// ... بقية الـ middleware والروترات

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.use(errorHandler);

export default app;
