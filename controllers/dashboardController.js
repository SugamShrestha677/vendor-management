import PurchaseRequest from '../models/PurchaseRequest.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import ActivityLog from '../models/ActivityLog.js';
import Approval from '../models/Approval.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  let stats = {};

  if (req.user.role === 'employee') {
    stats = await getEmployeeDashboard(req);
  } else if (req.user.role === 'manager') {
    stats = await getManagerDashboard(req);
  } else if (req.user.role === 'vendor') {
    stats = await getVendorDashboard(req);
  }

  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalRequests = await PurchaseRequest.countDocuments({ employee: userId });
  const draftRequests = await PurchaseRequest.countDocuments({
    employee: userId,
    status: 'draft'
  });
  const approvedRequests = await PurchaseRequest.countDocuments({
    employee: userId,
    status: 'approved'
  });
  const rejectedRequests = await PurchaseRequest.countDocuments({
    employee: userId,
    status: 'rejected'
  });

  const recentRequests = await PurchaseRequest.find({ employee: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('employee');

  const statusBreakdown = await PurchaseRequest.aggregate([
    { $match: { employee: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalRequests,
    draftRequests,
    approvedRequests,
    rejectedRequests,
    recentRequests,
    statusBreakdown
  };
});

export const getManagerDashboard = asyncHandler(async (req, res) => {
  const pendingApprovals = await Approval.countDocuments({
    manager: req.user._id,
    status: 'pending'
  });

  const totalRequests = await PurchaseRequest.countDocuments();
  const approvedRequests = await PurchaseRequest.countDocuments({ status: 'approved' });
  const rejectedRequests = await PurchaseRequest.countDocuments({ status: 'rejected' });

  const recentApprovals = await Approval.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('purchaseRequest')
    .populate('manager');

  const departmentStats = await PurchaseRequest.aggregate([
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  const totalSpend = await PurchaseRequest.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  return {
    pendingApprovals,
    totalRequests,
    approvedRequests,
    rejectedRequests,
    recentApprovals,
    departmentStats,
    totalSpend: totalSpend[0]?.total || 0
  };
});

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const totalOrders = await PurchaseOrder.countDocuments({ vendor: vendorId });
  const pendingOrders = await PurchaseOrder.countDocuments({
    vendor: vendorId,
    status: { $in: ['pending', 'acknowledged'] }
  });
  const deliveredOrders = await PurchaseOrder.countDocuments({
    vendor: vendorId,
    status: 'delivered'
  });

  const recentOrders = await PurchaseOrder.find({ vendor: vendorId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('purchaseRequest');

  const revenue = await PurchaseOrder.aggregate([
    { $match: { vendor: vendorId } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const statusBreakdown = await PurchaseOrder.aggregate([
    { $match: { vendor: vendorId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    recentOrders,
    revenue: revenue[0]?.total || 0,
    statusBreakdown
  };
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activities = await ActivityLog.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user');

  res.status(200).json({
    success: true,
    data: activities
  });
});

export const getChartData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  let data = [];

  if (type === 'requests-by-status') {
    data = await PurchaseRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  } else if (type === 'spending-by-month') {
    data = await PurchaseRequest.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  } else if (type === 'requests-by-priority') {
    data = await PurchaseRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  res.status(200).json({
    success: true,
    data
  });
});
