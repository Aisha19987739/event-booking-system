
import Event from '../models/Event';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '@/types/AuthenticatedRequest';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string; role: string };

    if (user.role !== 'organizer') {
      res.status(403).json({ message: 'Only organizers can create events' });
      return;
    }

   const { title, description, date, location, capacity, category } = req.body;

if (!title || !date || !location || !capacity || !category) {
  res.status(400).json({ message: 'Missing required event fields' });
  return;
}


   const newEvent = new Event({
  title,
  description,
  date,
  location,
  capacity,
  category,  // تم إضافته هنا
  organizer: user.userId,
});

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

 // تأكد من أنك استوردته في الأعلى

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'Invalid Event ID' });
      return;
    }

    const event = await Event.findById(eventId).populate('organizer', 'name email');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

import { Request, Response } from 'express';



export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      location,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const filters: any = {};

    if (search && typeof search === 'string') {
      filters.title = { $regex: search, $options: 'i' };
    }

    if (category && typeof category === 'string' && mongoose.Types.ObjectId.isValid(category)) {
  filters.category = category;
}


    if (location && typeof location === 'string') {
      filters.location = { $regex: location, $options: 'i' };
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const sort: any = {
      [sortBy as string]: order === 'asc' ? 1 : -1,
    };

    const totalEvents = await Event.countDocuments(filters);

    const events = await Event.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('organizer', 'name email')
      .populate('category', 'name');

    res.status(200).json({
      total: totalEvents,
      page: pageNumber,
      limit: pageSize,
      events,
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getEventWithBookings = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };

  if (!user || !user.userId || !user.role) {
     res.status(401).json({ message: 'Unauthorized' });
      return
  }

  const { userId, role } = user;
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId)
      .populate('organizer', 'name email _id')
      .populate({
        path: 'bookings',
        populate: { path: 'user', select: 'name email' }
      });

    if (!event) {
       res.status(404).json({ message: 'Event not found' });
       return
    }

    if (role !== 'organizer' || event.organizer._id.toString() !== userId) {
       res.status(403).json({ message: 'Access denied: insufficient role' });
       return
       
    }

     res.status(200).json({ event });
     return
       
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'Server error' });
     return
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: 'Invalid Event ID' });
    return;
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (user.role !== 'organizer' || event.organizer.toString() !== user.userId) {
      res.status(403).json({ message: 'Access denied: insufficient role or not the owner' });
      return;
    }

    // check if the event has bookings
    if (event.bookings && event.bookings.length > 0) {
      res.status(400).json({ message: 'Cannot update event with existing bookings' });
      return;
    }

    // update fields
    const updated = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.status(200).json({ message: 'Event updated', event: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: 'Invalid Event ID' });
    return;
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (user.role !== 'organizer' || event.organizer.toString() !== user.userId) {
      res.status(403).json({ message: 'Access denied: insufficient role or not the owner' });
      return;
    }

    if (event.bookings && event.bookings.length > 0) {
      res.status(400).json({ message: 'Cannot delete event with existing bookings' });
      return;
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};





