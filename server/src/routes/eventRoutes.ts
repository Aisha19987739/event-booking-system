import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventWithBookings, updateEvent,  } from '../controllers/eventController';
import {authenticateToken} from '../middleware/authenticateToken';
import {authorizeRoles}   from '../middleware/authMiddleware';

const router = express.Router();


router.get('/', getAllEvents); // Get all events
router.get('/:eventId', getEventById); // Get event by ID
router.post('/', authenticateToken, authorizeRoles('organizer'), createEvent);
router.get(
  '/:eventId/bookings',
  authenticateToken,
  authorizeRoles('organizer'),
  getEventWithBookings
);
router.put('/:eventId', authenticateToken, updateEvent);
router.delete('/:eventId', authenticateToken, deleteEvent);




export default router;
