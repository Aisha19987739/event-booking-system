import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Booking from '../models/Booking';
import Review from '../models/Review';
import { handleError } from '../utils/errorHandler';

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload & { userId: string };

    // عدد الحجوزات الكلي
    const totalBookings = await Booking.countDocuments({ user: user.userId });

    // عدد الفعاليات القادمة
    const upcomingEvents = await Booking.countDocuments({
      user: user.userId,
      date: { $gte: new Date() },
    });

    // آخر 5 حجوزات
  const recentBookings = (await Booking.find({ user: user.userId })
  .populate('event', 'title date location')
  .sort({ createdAt: -1 })
  .limit(5)).filter(booking => booking.event !== null);


    // آخر 5 تقييمات
    const recentReviews = await Review.find({ user: user.userId })
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalBookings,
      upcomingEvents,
      recentBookings,
      recentReviews,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user dashboard');
  }
};
