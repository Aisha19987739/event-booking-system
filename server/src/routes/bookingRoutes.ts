import express from 'express';
import {
  getUserBookings,
  getOrganizerBookings,
  createBooking,
  cancelBooking,
  updateBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController';
import  authenticateToken  from '../middleware/authenticateToken';

const router = express.Router();

router.post('/', authenticateToken, createBooking); // Create a new booking
router.get('/user', authenticateToken, getUserBookings); // Get bookings for a user
router.get('/organizer', authenticateToken, getOrganizerBookings);  // Get bookings for an organizer
router.patch('/:bookingId', authenticateToken, updateBooking); // Update a booking
router.patch('/:bookingId/cancel', authenticateToken, cancelBooking); // Cancel a booking
router.get('/all', authenticateToken, getAllBookings); // Get all bookings
router.patch('/:bookingId/status', authenticateToken, updateBookingStatus); // Update booking status (for admin)
router.delete('/:bookingId', authenticateToken, deleteBooking);
router.patch('/:bookingId/status', authenticateToken, updateBookingStatus);

export default router;
