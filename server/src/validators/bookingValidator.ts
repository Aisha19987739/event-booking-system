import { body } from 'express-validator';

export const createBookingValidator = [
  body('eventId')
    .notEmpty().withMessage('Event ID is required')
    .isMongoId().withMessage('Invalid Event ID'),

  body('ticketCount')
    .notEmpty().withMessage('Ticket count is required')
    .isInt({ min: 1 }).withMessage('Ticket count must be at least 1'),
];
