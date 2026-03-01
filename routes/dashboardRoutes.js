import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDashboardStats,
  getEmployeeDashboard,
  getManagerDashboard,
  getVendorDashboard,
  getRecentActivity,
  getChartData
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', protect, getDashboardStats);
router.get('/employee', protect, getEmployeeDashboard);
router.get('/manager', protect, getManagerDashboard);
router.get('/vendor', protect, getVendorDashboard);
router.get('/activity', protect, getRecentActivity);
router.get('/chart/:type', protect, getChartData);

export default router;
