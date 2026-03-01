import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllVendors,
  getVendorById,
  updateVendorProfile,
  getVendorOrders,
  updateOrderStatus,
  uploadDocument,
  getVendorAnalytics,
  searchVendors,
  getRatingAndReview
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/', protect, authorize('manager', 'employee'), getAllVendors);
router.get('/search', protect, searchVendors);
router.get('/:id', protect, getVendorById);
router.put('/:id', protect, authorize('vendor'), updateVendorProfile);
router.get('/:id/orders', protect, authorize('vendor', 'manager'), getVendorOrders);
router.post('/:id/orders/:orderId/status', protect, authorize('vendor'), updateOrderStatus);
router.post('/:id/documents', protect, authorize('vendor'), uploadDocument);
router.get('/:id/analytics', protect, authorize('vendor', 'manager'), getVendorAnalytics);
router.get('/:id/rating', protect, getRatingAndReview);

export default router;
