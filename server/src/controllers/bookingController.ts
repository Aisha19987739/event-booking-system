// src/controllers/bookingController.ts

import { Request, Response } from 'express';



import Booking from '../models/Booking';
import { ExtendedJwtPayload } from '../types/jwt';  // استيراد النوع المخصص
import { JwtPayload } from 'jsonwebtoken';
import Event from '../models/Event'; // استيراد موديل الحدث من الـ MongoDB
import mongoose from 'mongoose';
function isValidUser(user: any): user is JwtPayload & { userId: string; role: string } {
  return user && typeof user === 'object' && 'userId' in user && 'role' in user;
}

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isValidUser(req.user)) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user.userId;

    const bookings = await Booking.find({ user: userId });

    if (bookings.length === 0) {
      res.status(404).json({ message: 'No bookings found for this user' });
      return;
    }

    res.status(200).json({bookings});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { eventId, ticketCount } = req.body;
    
    
if (!req.user || typeof req.user === 'string' || !req.user.userId) {
   res.status(401).json({ message: 'Unauthorized' });
    return;
}



    // تحقق من وجود user و userId
   

    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
       res.status(404).json({ message: 'Event not found' });
         return;
    }

    // منع المنظم من حجز الحدث الخاص به
    if (event.organizer.toString() === userId) {
       res.status(403).json({ message: 'Organizers cannot book their own events.' });
         return;
    }

    // منع الحجز للفعاليات المنتهية
    if (new Date(event.date) < new Date()) {
       res.status(400).json({ message: 'Cannot book an event in the past.' });
         return;
    }

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      ticketCount,
    });

     res.status(201).json({ booking });
  } catch (error) {
    console.error('createBooking error:', error);
     res.status(500).json({ message: 'Server error' });
     return
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



export const getOrganizerBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user info found' });
      return;
    }

    const user = req.user as JwtPayload & { userId: string; role: string };

    if (user.role !== 'organizer') {
      res.status(403).json({ message: 'Forbidden: User is not organizer' });
      return;
    }

    const { eventId } = req.query;

    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      if (event.organizer.toString() !== user.userId) {
        res.status(403).json({ message: 'Forbidden: You do not own this event' });
        return;
      }

      const bookingsRaw = await Booking.find({ event: eventId })
        .populate('user', 'name email')
        .populate('event', 'title date');

      // نطابق event إلى ال_id string
      const bookings = bookingsRaw.map(b => {
        let eventIdStr = '';

        if (typeof b.event === 'object' && b.event !== null && '_id' in b.event) {
          eventIdStr = (b.event as any)._id.toString();
        } else if (typeof b.event === 'string') {
          eventIdStr = b.event;
        } else {
          eventIdStr = b.event.toString();
        }

        return {
          ...b.toObject(),
          event: eventIdStr,
        };
      });

      res.status(200).json({ bookings });
      return;
    }

    const events = await Event.find({ organizer: user.userId }).select('_id');
    const eventIds = events.map(event => event._id);

    const bookingsRaw = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email')
      .populate('event', 'title date');

    const bookings = bookingsRaw.map(b => {
      let eventIdStr = '';

      if (typeof b.event === 'object' && b.event !== null && '_id' in b.event) {
        eventIdStr = (b.event as any)._id.toString();
      } else if (typeof b.event === 'string') {
        eventIdStr = b.event;
      } else {
        eventIdStr = b.event.toString();
      }

      return {
        ...b.toObject(),
        event: eventIdStr,
      };
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
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


export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };
  const { bookingId } = req.params;
  const { ticketCount, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    res.status(400).json({ message: 'Invalid booking ID' });
    return;
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // تحقق من الصلاحيات
    if (booking.user.toString() !== user.userId && user.role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized to update this booking' });
      return;
    }

    // تحديث البيانات
    if (ticketCount !== undefined) booking.ticketCount = ticketCount;
    if (status !== undefined) booking.status = status;

    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const user = req.user! as JwtPayload & { userId: string; role: string };
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    res.status(400).json({ message: 'Invalid booking ID' });
    return;
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // تحقق من الصلاحيات
    if (booking.user.toString() !== user.userId && user.role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized to delete this booking' });
      return;
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};


export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = req.user as JwtPayload & { userId: string; role: string };
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    // التحقق من الدور: المنظم أو الأدمن فقط
    if (user.role !== 'organizer' && user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden: Not authorized' });
      return;
    }

    // جلب الحجز مع الحدث والمنظم
    const booking = await Booking.findById(bookingId).populate({
      path: 'event',
      populate: {
        path: 'organizer',
        model: 'User',
      },
    });

    if (!booking || !booking.event) {
      res.status(404).json({ message: 'Booking or event not found' });
      return;
    }

    // لو المستخدم منظم، نتحقق من ملكية الحدث
    if (user.role === 'organizer') {
      const organizerId = (booking.event as any).organizer?._id?.toString();
      if (organizerId !== user.userId) {
        res.status(403).json({ message: 'Forbidden: You do not own this event' });
        return;
      }
    }

    // تحديث الحالة وحفظ الحجز
    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Booking status updated', booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

