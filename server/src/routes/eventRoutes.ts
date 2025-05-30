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
import {upload} from "../middleware/multer";

const router = express.Router();

// جلب كل الفعاليات مع دعم الفلاتر، التصفح والترتيب
router.get('/', getAllEvents);

// جلب فعالية واحدة بالـ ID
// router.get('/:eventId', getEventById);
router.get('/:id', getEventById);


// إنشاء فعالية (منظم فقط)
router.post(
  '/',
  authenticateToken,          // تحقق من توكن المستخدم أولاً
  authorizeRoles('organizer'), // تحقق من صلاحية المستخدم
  upload.single('image'),     // تحليل ملف الصورة بعد التحقق
  createEventValidator,       // تحقق من صحة البيانات
  validateRequest,
  createEvent                 // الدالة التي تنشئ الحدث
);






// تعديل فعالية (منظم فقط)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('organizer'),
  updateEvent,
  upload.single('image'),
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
