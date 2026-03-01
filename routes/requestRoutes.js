import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  submitRequest,
  getRequestsByEmployee,
  getRequestsByStatus,
  addAttachment,
  removeAttachment
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/', protect, authorize('employee'), createRequest);
router.get('/', protect, getAllRequests);
router.get('/employee/:employeeId', protect, getRequestsByEmployee);
router.get('/status/:status', protect, getRequestsByStatus);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, authorize('employee'), updateRequest);
router.delete('/:id', protect, authorize('employee'), deleteRequest);
router.post('/:id/submit', protect, authorize('employee'), submitRequest);
router.post('/:id/attachment', protect, authorize('employee'), addAttachment);
router.delete('/:id/attachment/:attachmentId', protect, authorize('employee'), removeAttachment);

export default router;
