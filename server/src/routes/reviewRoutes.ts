import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getEventReviews,
  getAverageRatingByEvent,
} from '../controllers/reviewController';
import {authenticateToken} from '../middleware/authenticateToken';
import {authorizeRoles}   from '../middleware/authMiddleware';
import { createReviewValidator, deleteReviewValidator, updateReviewValidator } from '../validators/reviewValidators';
import { validateRequest } from '../middleware/validateRequest';


const router = express.Router();

// 👤 المستخدم يضيف مراجعة
router.post(
  '/',
  authenticateToken,
  authorizeRoles('user'),
  createReviewValidator,
  validateRequest,
  createReview
);


// ✏️ المستخدم يعدل مراجعته

router.put('/:reviewId', authenticateToken, updateReviewValidator, validateRequest, updateReview);


// ❌ المستخدم يحذف مراجعته
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('user', 'admin'), // يسمح للمستخدم أو المشرف بالحذف
  deleteReviewValidator,
  validateRequest,
  deleteReview
);


// 🌐 الكل يستطيع عرض مراجعات حدث معين
router.get('/event/:eventId', getEventReviews);
router.get('/reviews/average', getAverageRatingByEvent);
// 🔥 حذف تقييم
router.delete('/:reviewId', authenticateToken, deleteReview);


export default router;
