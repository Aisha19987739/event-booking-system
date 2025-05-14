import { Request, Response } from 'express';
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

    if (!title || !date || !location || !capacity) {
      res.status(400).json({ message: 'Missing required event fields' });
      return;
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      category,
      organizer: user.userId, // Organizer ID from token
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

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};
// controllers/eventController.ts
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


