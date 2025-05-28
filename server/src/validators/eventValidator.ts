import { body, param } from 'express-validator';

// ✅ إنشاء حدث جديد


export const createEventValidator = [
  body('title').notEmpty().withMessage('Event title is required'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('capacity must be at least 1'),
];


// ✅ تحديث حدث (للمستقبل، إن كان هناك دعم لتحديث الحدث نفسه)
export const updateEventValidator = [
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('date').optional().isISO8601().withMessage('Invalid date'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('totalTickets').optional().isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
];

// ✅ حذف حدث
export const deleteEventValidator = [
  param('eventId').isMongoId().withMessage('Invalid event ID'),
];

// ✅ الحصول على حجوزات الحدث
export const getEventBookingsValidator = [
  param('eventId').isMongoId().withMessage('Invalid event ID'),
];
