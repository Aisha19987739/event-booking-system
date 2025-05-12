import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; // تأكد من المسار الصحيح إلى موديل المستخدم

const JWT_SECRET = process.env.JWT_SECRET || '9sD!a8T$kf@3gR1#qPz^Wm2Uo%XeLb7H'; // تأكد من إعداد هذا في .env

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
    const { name, email, password, role } = req.body;

    // تحقق من وجود المستخدم مسبقًا
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // "user" أو "organizer" مثلاً
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
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
