import PurchaseRequest from '../models/PurchaseRequest.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({ message: 'Search query must be at least 2 characters' });
  }

  const searchRegex = { $regex: q, $options: 'i' };

  const [requests, orders, vendors] = await Promise.all([
    PurchaseRequest.find({
      $or: [
        { requestNumber: searchRegex },
        { purpose: searchRegex },
        { department: searchRegex }
      ]
    }).limit(5),
    PurchaseOrder.find({
      $or: [
        { orderNumber: searchRegex },
        { 'deliveryAddress.city': searchRegex }
      ]
    }).limit(5),
    User.find({
      $or: [
        { companyName: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ],
      role: 'vendor'
    }).limit(5)
  ]);

  res.status(200).json({
    success: true,
    data: {
      requests,
      orders,
      vendors
    }
  });
});

export const searchRequests = asyncHandler(async (req, res) => {
  const { q, status, priority } = req.query;

  let query = {};

  if (q) {
    query.$or = [
      { requestNumber: { $regex: q, $options: 'i' } },
      { purpose: { $regex: q, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const requests = await PurchaseRequest.find(query)
    .populate('employee')
    .limit(20)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

export const searchVendors = asyncHandler(async (req, res) => {
  const { q, category } = req.query;

  let query = { role: 'vendor', isActive: true };

  if (q) {
    query.$or = [
      { companyName: { $regex: q, $options: 'i' } },
      { firstName: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) {
    query.vendorCategories = { $in: [category] };
  }

  const vendors = await User.find(query)
    .select('-password')
    .limit(20);

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

export const searchOrders = asyncHandler(async (req, res) => {
  const { q, status } = req.query;

  let query = {};

  if (q) {
    query.$or = [
      { orderNumber: { $regex: q, $options: 'i' } },
      { trackingNumber: { $regex: q, $options: 'i' } }
    ];
  }

  if (status) query.status = status;

  const orders = await PurchaseOrder.find(query)
    .populate('vendor')
    .limit(20)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ data: [] });
  }

  const searchRegex = { $regex: q, $options: 'i' };

  const [requests, vendors] = await Promise.all([
    PurchaseRequest.find({ requestNumber: searchRegex }).select('requestNumber').limit(5),
    User.find({ companyName: searchRegex, role: 'vendor' }).select('companyName').limit(5)
  ]);

  const suggestions = [
    ...requests.map(r => ({ type: 'request', value: r.requestNumber })),
    ...vendors.map(v => ({ type: 'vendor', value: v.companyName }))
  ];

  res.status(200).json({
    success: true,
    data: suggestions
  });
});
