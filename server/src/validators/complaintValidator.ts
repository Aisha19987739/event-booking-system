import { body } from 'express-validator';

export const createComplaintValidator = [
  body('event')
    .notEmpty().withMessage('Event ID is required')
    .isMongoId().withMessage('Invalid Event ID'),

  body('message')
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
];
