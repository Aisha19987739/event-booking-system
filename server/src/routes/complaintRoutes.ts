import express from 'express';
import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  respondToComplaint,
} from '../controllers/complaintController';
import authenticateToken, { authorizeRoles }  from '../middleware/authMiddleware';


const router = express.Router();

// مستخدم مسجل يمكنه إنشاء شكوى وعرض شكاويه
router.post('/', authenticateToken, authorizeRoles('user'), createComplaint);
router.get('/my', authenticateToken, authorizeRoles('user'), getUserComplaints);

// مشرف فقط يمكنه مشاهدة كل الشكاوى والرد عليها
router.get('/', authenticateToken, authorizeRoles('admin'), getAllComplaints);

router.put('/:complaintId/reply', authenticateToken, authorizeRoles('admin'), respondToComplaint);

export default router;
