import PurchaseRequest from '../models/PurchaseRequest.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { generateCSV } from '../utils/csvGenerator.js';

export const generateRequestReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, department } = req.query;

  let query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (status) query.status = status;
  if (department) query.department = department;

  const requests = await PurchaseRequest.find(query)
    .populate('employee')
    .sort({ createdAt: -1 });

  const totalAmount = requests.reduce((sum, req) => sum + req.totalAmount, 0);
  const averageAmount = requests.length > 0 ? totalAmount / requests.length : 0;

  const statusSummary = {};
  requests.forEach(req => {
    statusSummary[req.status] = (statusSummary[req.status] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    data: {
      totalRequests: requests.length,
      totalAmount,
      averageAmount: averageAmount.toFixed(2),
      statusSummary,
      requests
    }
  });
});

export const generateVendorReport = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor', isActive: true });

  const vendorStats = await Promise.all(
    vendors.map(async (vendor) => {
      const orders = await PurchaseOrder.find({ vendor: vendor._id });
      const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

      return {
        vendor: vendor.companyName,
        totalOrders: orders.length,
        totalValue,
        deliveryRate: orders.length > 0 ? ((deliveredOrders / orders.length) * 100).toFixed(2) : 0
      };
    })
  );

  res.status(200).json({
    success: true,
    data: vendorStats
  });
});

export const generateSpendAnalysis = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const requests = await PurchaseRequest.find(query);

  const spendByDepartment = await PurchaseRequest.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$department',
        totalSpend: { $sum: '$totalAmount' },
        requestCount: { $sum: 1 }
      }
    },
    { $sort: { totalSpend: -1 } }
  ]);

  const spendByPriority = await PurchaseRequest.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$priority',
        totalSpend: { $sum: '$totalAmount' },
        requestCount: { $sum: 1 }
      }
    }
  ]);

  const totalSpend = spendByDepartment.reduce((sum, item) => sum + item.totalSpend, 0);

  res.status(200).json({
    success: true,
    data: {
      totalSpend,
      spendByDepartment,
      spendByPriority
    }
  });
});

export const exportToCSV = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;

  let data = [];
  let fileName = '';

  if (type === 'requests') {
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    data = await PurchaseRequest.find(query).populate('employee');
    fileName = 'purchase_requests.csv';
  } else if (type === 'orders') {
    data = await PurchaseOrder.find().populate('vendor').populate('purchaseRequest');
    fileName = 'purchase_orders.csv';
  }

  const csv = generateCSV(data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(csv);
});

export const exportToPDF = asyncHandler(async (req, res) => {
  const { type } = req.params;

  let data = [];
  let fileName = '';

  if (type === 'requests') {
    data = await PurchaseRequest.find().populate('employee');
    fileName = 'purchase_requests.pdf';
  } else if (type === 'orders') {
    data = await PurchaseOrder.find().populate('vendor');
    fileName = 'purchase_orders.pdf';
  }

  const pdf = await generatePDF(data, type);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(pdf);
});

export const getReportHistory = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});
