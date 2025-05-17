import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Review from '../models/Review';
import Event from '../models/Event';
import { handleError } from '../utils/errorHandler';

// ➕ إنشاء تقييم جديد
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };
    const { event, rating, comment } = req.body;

    if (!event || !rating) {
      res.status(400).json({ message: 'Event and rating are required' });
      return;
    }

    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const review = await Review.create({
      user: user.userId,
      event,
      rating,
      comment,
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    handleError(res, error, 'Failed to create review');
  }
};

// 📝 تحديث تقييم
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: user.userId },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      res.status(404).json({ message: 'Review not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Review updated', review });
  } catch (error) {
    handleError(res, error, 'Failed to update review');
  }
};

// ❌ حذف تقييم
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: user.userId });

    if (!review) {
      res.status(404).json({ message: 'Review not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    handleError(res, error, 'Failed to delete review');
  }
};

// 📄 جلب تقييمات حدث
export const getEventReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const reviews = await Review.find({ event: eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    handleError(res, error, 'Failed to get event reviews');
  }
};
 export const getAverageRatingByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const averageRatings = await Review.aggregate([
      {
        $group: {
          _id: '$event',              // تجميع حسب معرف الحدث
          averageRating: { $avg: '$rating' },  // حساب متوسط التقييم
          count: { $sum: 1 }          // عدد التقييمات لكل حدث (اختياري)
        }
      },
      {
        $project: {
          _id: 0,
          event: '$_id',
          averageRating: { $round: ['$averageRating', 2] }, // تقريب المتوسط لرقمين عشريين
          count: 1
        }
      }
    ]);

    res.status(200).json(averageRatings);
  } catch (error) {
    handleError(res, error, 'Failed to get average ratings');
  }
};


