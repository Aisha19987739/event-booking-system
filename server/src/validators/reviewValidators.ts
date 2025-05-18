import { body } from 'express-validator';

export const createReviewValidator = [
  body('event')
    .notEmpty()
    .withMessage('Event ID is required.')
    .isMongoId()
    .withMessage('Invalid Event ID.'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5.'),

  body('comment')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters.'),
];
export const updateReviewValidator = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
    .toInt(),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Comment must be a string with max 500 characters'),
];

import { param } from 'express-validator';

export const deleteReviewValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review ID'),
];


