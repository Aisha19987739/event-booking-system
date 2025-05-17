import { Request, Response } from 'express';
import User from '../models/userModel';
import Event from '../models/Event';
import Booking from '../models/Booking';
import Complaint from '../models/Complaint';
import Review from '../models/Review';

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const totalReviews = await Review.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title date createdAt');

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title');

    res.status(200).json({
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalBookings,
      totalComplaints,
      totalReviews,
      recentUsers,
      recentEvents,
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin dashboard data', error });
  }
};
