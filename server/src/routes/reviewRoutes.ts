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


const router = express.Router();

// 👤 المستخدم يضيف مراجعة
router.post('/', authenticateToken, createReview);

// ✏️ المستخدم يعدل مراجعته
router.put('/:reviewId', authenticateToken, updateReview);

// ❌ المستخدم يحذف مراجعته
router.delete('/:reviewId', authenticateToken, deleteReview);

// 🌐 الكل يستطيع عرض مراجعات حدث معين
router.get('/event/:eventId', getEventReviews);
router.get('/reviews/average', getAverageRatingByEvent);
// 🔥 حذف تقييم
router.delete('/:reviewId', authenticateToken, deleteReview);


export default router;
