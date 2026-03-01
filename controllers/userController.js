import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  if (role) query.role = role;

  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pages: Math.ceil(total / limit),
    data: users
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, department, companyName } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  user = new User({
    firstName,
    lastName,
    email,
    password,
    role,
    department,
    companyName,
    createdBy: req.user._id
  });

  await user.save();

  res.status(201).json({
    success: true,
    data: user.toJSON()
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, department, designation, phoneNumber, budgetLimit, approvalLevel } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.department = department || user.department;
  user.designation = designation || user.designation;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.budgetLimit = budgetLimit || user.budgetLimit;
  user.approvalLevel = approvalLevel || user.approvalLevel;

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.isActive = true;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

export const getBudgetInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const requests = await User.findById(req.params.id).populate('requests');

  res.status(200).json({
    success: true,
    data: {
      budgetLimit: user.budgetLimit,
      budgetUsed: 0,
      budgetRemaining: user.budgetLimit
    }
  });
});

export const updateBudget = asyncHandler(async (req, res) => {
  const { budgetLimit } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.budgetLimit = budgetLimit;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});
