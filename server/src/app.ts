// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const app = express();


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes


app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});


export default app;
