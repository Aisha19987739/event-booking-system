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
import { createEventValidator } from '../validators/eventValidator';
import { validateRequest } from '../middleware/validateRequest';
import { updateReviewValidator } from '../validators/reviewValidators';
import { updateReview } from '../controllers/reviewController';

const router = express.Router();

// ✅ يدعم البحث + الترتيب + التصفح + الفلاتر
router.get('/', getAllEvents);

// أحداث فردية
router.get('/:eventId', getEventById);
router.post(
  '/',
  authenticateToken, // إن كنت تتطلب التحقق من التوكن
  authorizeRoles('organizer'), // إن كانت الصلاحية مطلوبة
  createEventValidator,
  validateRequest,
  createEvent
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('user'),
  updateReviewValidator,
  validateRequest,
  updateReview
);

router.delete('/:eventId', authenticateToken, authorizeRoles('organizer'), deleteEvent);

// حجوزات الحدث
router.get(
  '/:eventId/bookings',
  authenticateToken,
  authorizeRoles('organizer'),
  getEventWithBookings
);


export default router;
