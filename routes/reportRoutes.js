import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  generateRequestReport,
  generateVendorReport,
  generateSpendAnalysis,
  exportToCSV,
  exportToPDF,
  getReportHistory
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/requests', protect, authorize('manager', 'employee'), generateRequestReport);
router.get('/vendors', protect, authorize('manager'), generateVendorReport);
router.get('/spend-analysis', protect, authorize('manager'), generateSpendAnalysis);
router.get('/export/csv/:type', protect, exportToCSV);
router.get('/export/pdf/:type', protect, exportToPDF);
router.get('/history', protect, getReportHistory);

export default router;
