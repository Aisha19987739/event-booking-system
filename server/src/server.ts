import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-booking')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// بدء الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
