// routes/dashboardRoutes.ts
import express from 'express';
import { getUserDashboard } from '../controllers/userDashboardController';
import  authenticateToken  from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/authMiddleware';
import { getOrganizerDashboard } from '../controllers/organizerdashboardController';
import { getAdminDashboard } from '../controllers/adminDashboardController';


const router = express.Router();

router.get('/user', authenticateToken, authorizeRoles('user'), getUserDashboard);
router.get('/organizer', authenticateToken, authorizeRoles('organizer'), getOrganizerDashboard);
router.get('/admin', authenticateToken, authorizeRoles('admin'), getAdminDashboard);

export default router;

