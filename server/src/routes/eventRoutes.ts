import express from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventWithBookings,
  updateEvent,
} from '../controllers/eventController';
import { authenticateToken } from '../middleware/authenticateToken';
import { authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// ✅ يدعم البحث + الترتيب + التصفح + الفلاتر
router.get('/', getAllEvents);

// أحداث فردية
router.get('/:eventId', getEventById);
router.post('/', authenticateToken, authorizeRoles('organizer'), createEvent);
router.put('/:eventId', authenticateToken, updateEvent);
router.delete('/:eventId', authenticateToken, authorizeRoles('organizer'), deleteEvent);

// حجوزات الحدث
router.get(
  '/:eventId/bookings',
  authenticateToken,
  authorizeRoles('organizer'),
  getEventWithBookings
);

export default router;
