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
import { validateRequest } from '../middleware/validateRequest';
import {
  createEventValidator,
  updateEventValidator,
  deleteEventValidator,
  getEventBookingsValidator,
} from '../validators/eventValidator';

const router = express.Router();

// جلب كل الفعاليات مع دعم الفلاتر، التصفح والترتيب
router.get('/', getAllEvents);

// جلب فعالية واحدة بالـ ID
router.get('/:eventId', getEventById);

// إنشاء فعالية (منظم فقط)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('organizer'),
  createEventValidator,
  validateRequest,
  createEvent
);

// تعديل فعالية (منظم فقط)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('organizer'),
  updateEvent,
  updateEventValidator
);

// حذف فعالية (منظم فقط)
router.delete(
  '/:eventId',
  authenticateToken,
  authorizeRoles('organizer'),
  deleteEvent,
  deleteEventValidator
);

// جلب الحجوزات المرتبطة بفعالية (منظم فقط)
router.get(
  '/:eventId/bookings',
  authenticateToken,
  authorizeRoles('organizer'),
  getEventWithBookings,
  getEventBookingsValidator
);

export default router;
