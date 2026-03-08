import Approval from '../models/Approval.js';
import PurchaseRequest from '../models/PurchaseRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendNotification } from '../utils/notificationService.js';
import User from '../models/User.js';

export const getPendingApprovals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  console.log('Getting pending approvals for manager:', req.user._id);

  const approvals = await Approval.find({
    manager: req.user._id,
    status: 'pending'
  })
    .populate('purchaseRequest')
    .populate('manager')
    .sort({ requestedAt: -1 })
    .limit(limit * 1)
    .skip(skip);

  console.log('Found approvals:', approvals.length);
  console.log('Approvals data:', JSON.stringify(approvals, null, 2));

  const total = await Approval.countDocuments({
    manager: req.user._id,
    status: 'pending'
  });

  console.log('Total pending:', total);

  res.status(200).json({
    success: true,
    count: approvals.length,
    total,
    pages: Math.ceil(total / limit),
    data: approvals
  });
});

export const getApprovalById = asyncHandler(async (req, res) => {
  const approval = await Approval.findById(req.params.id)
    .populate('purchaseRequest')
    .populate('manager');

  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  res.status(200).json({
    success: true,
    data: approval
  });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  let approval = await Approval.findById(req.params.id);

  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  if (approval.status !== 'pending') {
    return res.status(400).json({ message: 'Approval already processed' });
  }

  approval.status = 'approved';
  approval.comment = comment;
  approval.approvalDate = new Date();
  await approval.save();

  const request = await PurchaseRequest.findById(approval.purchaseRequest);
  request.status = 'approved';
  request.approvedAt = new Date();
  request.approvalHistory.push({
    approver: req.user._id,
    status: 'approved',
    comment,
    timestamp: new Date()
  });
  await request.save();

  await sendNotification({
    type: 'request_approved',
    title: 'Request Approved',
    message: `Your purchase request ${request.requestNumber} has been approved`,
    recipient: request.employee
  });

  res.status(200).json({
    success: true,
    data: approval
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  let approval = await Approval.findById(req.params.id);

  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  if (approval.status !== 'pending') {
    return res.status(400).json({ message: 'Approval already processed' });
  }

  approval.status = 'rejected';
  approval.rejectionReason = rejectionReason;
  approval.approvalDate = new Date();
  await approval.save();

  const request = await PurchaseRequest.findById(approval.purchaseRequest);
  request.status = 'rejected';
  request.rejectionReason = rejectionReason;
  request.rejectedAt = new Date();
  request.approvalHistory.push({
    approver: req.user._id,
    status: 'rejected',
    comment: rejectionReason,
    timestamp: new Date()
  });
  await request.save();

  await sendNotification({
    type: 'request_rejected',
    title: 'Request Rejected',
    message: `Your purchase request ${request.requestNumber} has been rejected`,
    recipient: request.employee
  });

  res.status(200).json({
    success: true,
    data: approval
  });
});

export const getApprovalHistory = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.requestId)
    .populate('approvalHistory.approver');

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.status(200).json({
    success: true,
    data: request.approvalHistory
  });
});

export const bulkApprove = asyncHandler(async (req, res) => {
  const { approvalIds } = req.body;

  const approvals = await Approval.updateMany(
    { _id: { $in: approvalIds }, status: 'pending' },
    {
      $set: {
        status: 'approved',
        approvalDate: new Date()
      }
    }
  );

  res.status(200).json({
    success: true,
    message: `${approvals.modifiedCount} approvals completed`,
    data: approvals
  });
});

export const delegateApproval = asyncHandler(async (req, res) => {
  const { delegateToUserId } = req.body;

  const delegateUser = await User.findById(delegateToUserId);

  if (!delegateUser || delegateUser.role !== 'manager') {
    return res.status(400).json({ message: 'Invalid delegate user' });
  }

  const approval = await Approval.findById(req.params.id);

  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  approval.manager = delegateToUserId;
  await approval.save();

  res.status(200).json({
    success: true,
    data: approval
  });
});
