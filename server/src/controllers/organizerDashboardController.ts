import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Event from '../models/Event';
import Booking from '../models/Booking';
import Complaint from '../models/Complaint';
import Review from '../models/Review';
import { handleError } from '../utils/errorHandler';
import mongoose from 'mongoose';

export const getOrganizerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };

    // إجمالي الأحداث التي أنشأها المنظم
    const totalEvents = await Event.countDocuments({ organizer: user.userId });

    // جلب معرفات الأحداث الخاصة بالمنظم
    const organizerEvents = await Event.find({ organizer: user.userId }, '_id');
    const eventIds = organizerEvents.map((event) => event._id);

    // إجمالي الحجوزات على أحداثه
    const totalBookings = await Booking.countDocuments({ event: { $in: eventIds } });

    // أحدث 5 أحداث
    const recentEvents = await Event.find({ organizer: user.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // الشكاوى المرتبطة بأحداثه
    const complaints = await Complaint.find({ event: { $in: eventIds } })
      .populate('event', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // حساب متوسط تقييم جميع الأحداث الخاصة بالمنظم
    const averageRatingData = await Review.aggregate([
      { $match: { event: { $in: eventIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);
    const averageRating = averageRatingData[0]?.averageRating || 0;

    res.status(200).json({
      totalEvents,
      totalBookings,
      averageRating,
      recentEvents,
      complaints,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch organizer dashboard');
  }
};
