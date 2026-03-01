import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPendingApprovals,
  getApprovalById,
  approveRequest,
  rejectRequest,
  getApprovalHistory,
  bulkApprove,
  delegateApproval
} from '../controllers/approvalController.js';

const router = express.Router();

router.get('/pending', protect, authorize('manager'), getPendingApprovals);
router.get('/:id', protect, authorize('manager'), getApprovalById);
router.post('/:id/approve', protect, authorize('manager'), approveRequest);
router.post('/:id/reject', protect, authorize('manager'), rejectRequest);
router.get('/:requestId/history', protect, getApprovalHistory);
router.post('/bulk/approve', protect, authorize('manager'), bulkApprove);
router.post('/:id/delegate', protect, authorize('manager'), delegateApproval);

export default router;
