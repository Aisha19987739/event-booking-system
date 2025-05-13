import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel'; // تأكد من المسار الصحيح إلى موديل المستخدم
import dotenv from 'dotenv';
import Booking from '@/models/Booking';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET!; // تأكد من إعداد هذا في .env

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // تحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // تحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    // إنشاء JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, username } = req.body;  // إضافة username هنا

    // تحقق من وجود المستخدم مسبقًا باستخدام البريد الإلكتروني أو الاسم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // تحقق من وجود username مستخدم مسبقًا
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      username, // إضافة username
    });

    await newUser.save();

    // إنشاء JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        username: newUser.username, // إضافة username هنا
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};


