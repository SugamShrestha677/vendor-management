import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  globalSearch,
  searchRequests,
  searchVendors,
  searchOrders,
  getSearchSuggestions
} from '../controllers/searchController.js';

const router = express.Router();

router.get('/', protect, globalSearch);
router.get('/requests', protect, searchRequests);
router.get('/vendors', protect, searchVendors);
router.get('/orders', protect, searchOrders);
router.get('/suggestions', protect, getSearchSuggestions);

export default router;
