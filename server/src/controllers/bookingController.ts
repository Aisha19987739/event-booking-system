// src/controllers/bookingController.ts

import { Request, Response } from 'express';


import Booking from '../models/Booking';
import { ExtendedJwtPayload } from '../types/jwt';  // استيراد النوع المخصص
import { JwtPayload } from 'jsonwebtoken';
import Event from '../models/Event'; // استيراد موديل الحدث من الـ MongoDB
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    // التأكد من أن هناك userId في request
    const userId = (req.user as JwtPayload & { userId: string }).userId;  // التأكد من أن req.user هو من النوع الصحيح

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    // استرجاع جميع الحجوزات الخاصة بالمستخدم من قاعدة البيانات
    const bookings = await Booking.find({ user: userId });

    // إذا لم يكن هناك حجوزات
    if (bookings.length === 0) {
      res.status(404).json({ message: 'No bookings found for this user' });
      return;
    }

    // إرجاع الحجوزات
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};



export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, userId, ticketCount, status, bookingDate } = req.body;

    if (!eventId || !userId || !ticketCount) {
      res.status(400).json({ message: 'Event ID, User ID, and Ticket Count are required' });
      return;
    }

    // إنشاء حجز جديد
    const booking = new Booking({
      event: eventId,
      user: userId,
      ticketCount,
      status,
      bookingDate,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};
  export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params; // الحصول على bookingId من المعاملات

    // العثور على الحجز باستخدام bookingId
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // إذا كانت حالة الحجز ليست "معلق" لا يمكن إلغاؤه
    if (booking.status !== 'pending') {
      res.status(400).json({ message: 'Booking cannot be cancelled' });
      return;
    }

    // تحديث حالة الحجز إلى "ملغى"
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { ticketCount, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // تحقق من نوع req.user قبل الوصول إلى userId
    const user = req.user as JwtPayload;

    if (!user || user.userId !== booking.user.toString()) {
      res.status(403).json({ message: 'You are not authorized to update this booking' });
      return;
    }

    // تحديث الحجز
    if (ticketCount) {
      booking.ticketCount = ticketCount;
    }
    if (status) {
      booking.status = status;
    }

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};


export const getOrganizerBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string; role: string };

    if (!user || user.role !== 'Organizer') {
      res.status(403).json({ message: 'Access denied. Only organizers can access this endpoint.' });
      return;
    }

    // جلب الأحداث التي يملكها المنظم
    const events = await Event.find({ organizer: user.userId }).select('_id');
    const eventIds = events.map(event => event._id);

    // جلب الحجوزات المرتبطة بهذه الأحداث
    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email')  // يمكنك تخصيص الحقول هنا
      .populate('event', 'title date');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizer bookings', error });
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string; role: string };

    // التأكد من أن المستخدم لديه صلاحية مشرف
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admins only.' });
      return;
    }

    // استرجاع جميع الحجوزات من قاعدة البيانات وربط الحدث والمستخدم (populate)
    const bookings = await Booking.find()
      .populate('event', 'title date location') // عرض معلومات الحدث الأساسية
      .populate('user', 'name email'); // عرض معلومات المستخدم

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error });
  }
};
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;   // الحصول على bookingId من المعاملات
    const { status } = req.body;        // الحصول على الحالة الجديدة (قبول أو رفض)

    // تحقق من أن الحالة هي "accepted" أو "rejected"
    if (status !== 'accepted' && status !== 'rejected') {
      res.status(400).json({ message: 'Invalid status. It must be either "accepted" or "rejected".' });
      return;
    }

    // العثور على الحجز باستخدام bookingId
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // تحقق من أن المستخدم الذي يقوم بقبول أو رفض الحجز هو المنظم الذي يمتلك الحدث
    const user = req.user as JwtPayload & { userId: string; role: string };
    const event = await Event.findById(booking.event);  // الحصول على الحدث المرتبط بالحجز

    // إذا كان المنظم ليس هو من يمتلك الحدث
    if (user.role !== 'Organizer' || event?.organizer.toString() !== user.userId) {
      res.status(403).json({ message: 'You are not authorized to accept or reject this booking' });
      return;
    }

    // تحديث حالة الحجز
    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
};


