import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getBudgetInfo,
  updateBudget
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, authorize('manager'), getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, authorize('manager'), createUser);
router.put('/:id', protect, authorize('manager'), updateUser);
router.delete('/:id', protect, authorize('manager'), deleteUser);
router.post('/:id/deactivate', protect, authorize('manager'), deactivateUser);
router.post('/:id/activate', protect, authorize('manager'), activateUser);
router.get('/:id/budget', protect, getBudgetInfo);
router.put('/:id/budget', protect, authorize('manager'), updateBudget);

export default router;
