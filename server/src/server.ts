// src/server.ts
import app from './app';
import connectDB from './config/db';

import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5175', // ← بدل المنفذ ليتطابق مع منفذ Vite
  credentials: true,
}));


const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
  
   await connectDB();

  console.log(`Server running on http://localhost:${PORT}`);
});

