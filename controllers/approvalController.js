import Approval from '../models/Approval.js';
import PurchaseRequest from '../models/PurchaseRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendNotification } from '../utils/notificationService.js';
import User from '../models/User.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import mongoose from 'mongoose';

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
  
  // Find the approval and populate the purchase request
  let approval = await Approval.findById(req.params.id)
    .populate('purchaseRequest');

  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  if (approval.status !== 'pending') {
    return res.status(400).json({ message: 'Approval already processed' });
  }

  // Update approval status
  approval.status = 'approved';
  approval.comment = comment;
  approval.approvalDate = new Date();
  await approval.save();

  // Get the purchase request
  const request = await PurchaseRequest.findById(approval.purchaseRequest._id);
  
  // Update request status
  request.status = 'approved';
  request.approvedAt = new Date();
  request.approvalHistory.push({
    approver: req.user._id,
    status: 'approved',
    comment,
    timestamp: new Date()
  });
  await request.save();

  // ===== AUTO-CREATE PURCHASE ORDER =====
  try {
    // Find vendors - either from preferredVendors or all vendors
    let vendors = [];
    
    if (request.preferredVendors && request.preferredVendors.length > 0) {
      // Use preferred vendors
      vendors = await User.find({ 
        _id: { $in: request.preferredVendors },
        role: 'vendor' 
      });
    } else {
      // If no preferred vendors, assign to all vendors or a default one
      vendors = await User.find({ role: 'vendor' }).limit(1);
    }
    
    if (vendors.length === 0) {
      console.log('⚠️ No vendors found to assign order');
    } else {
      // Create an order for each vendor
      for (const vendor of vendors) {
        // Generate order number
        const orderCount = await PurchaseOrder.countDocuments();
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const orderNumber = `PO-${year}${month}${day}-${String(orderCount + 1).padStart(4, '0')}`;
        
        // Format items
        const items = request.items.map(item => ({
          description: item.description || item.name || 'Item',
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.price || 0,
          totalPrice: item.total || (item.quantity * (item.unitPrice || item.price || 0)),
          _id: item._id || new mongoose.Types.ObjectId()
        }));
        
        // Create the purchase order
        const purchaseOrder = await PurchaseOrder.create({
          orderNumber,
          purchaseRequest: request._id,
          vendor: vendor._id,
          items,
          totalAmount: request.totalAmount,
          status: 'pending',
          expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          notes: `Auto-generated from approved request: ${request.requestNumber}`,
          createdAt: new Date()
        });
        
        console.log(`✅ PurchaseOrder created: ${orderNumber} for vendor ${vendor.companyName || vendor.email}`);
        
        // Send notification to vendor
        await sendNotification({
          type: 'new_order',
          title: 'New Purchase Order',
          message: `You have a new purchase order ${orderNumber} for $${request.totalAmount}`,
          recipient: vendor._id,
          orderId: purchaseOrder._id
        });
      }
    }
  } catch (error) {
    console.error('❌ Error creating purchase order:', error);
    // Don't fail the approval if order creation fails, but log it
  }
  // ===== END OF AUTO-CREATE ORDER =====

  // Send notification to employee
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
