import PurchaseRequest from '../models/PurchaseRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendNotification } from '../utils/notificationService.js';
import { generateUniqueNumber } from '../utils/generateId.js';

export const createRequest = asyncHandler(async (req, res) => {
  const { items, department, purpose, priority, preferredVendors, budgetCode, costCenter, notes } = req.body;

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.estimatedUnitPrice), 0);

  const requestNumber = await generateUniqueNumber('REQ');

  const request = new PurchaseRequest({
    requestNumber,
    employee: req.user._id,
    items,
    totalAmount,
    department,
    purpose,
    priority,
    preferredVendors,
    budgetCode,
    costCenter,
    notes,
    status: 'draft'
  });

  await request.save();
  await request.populate('employee preferredVendors');

  res.status(201).json({
    success: true,
    data: request
  });
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (req.user.role === 'employee') {
    query.employee = req.user._id;
  }

  const requests = await PurchaseRequest.find(query)
    .populate('employee preferredVendors')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);

  const total = await PurchaseRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    pages: Math.ceil(total / limit),
    data: requests
  });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.id)
    .populate('employee preferredVendors')
    .populate('approvalHistory.approver');

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

export const updateRequest = asyncHandler(async (req, res) => {
  let request = await PurchaseRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (request.employee.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this request' });
  }

  if (request.status !== 'draft' && request.status !== 'submitted') {
    return res.status(400).json({ message: 'Cannot update request in current status' });
  }

  const { items, department, purpose, priority, preferredVendors, notes } = req.body;

  request.items = items;
  request.department = department;
  request.purpose = purpose;
  request.priority = priority;
  request.preferredVendors = preferredVendors;
  request.notes = notes;
  request.totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.estimatedUnitPrice), 0);

  await request.save();

  res.status(200).json({
    success: true,
    data: request
  });
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (request.employee.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this request' });
  }

  if (request.status !== 'draft') {
    return res.status(400).json({ message: 'Cannot delete request in current status' });
  }

  await PurchaseRequest.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Request deleted successfully'
  });
});

export const submitRequest = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (request.status !== 'draft') {
    return res.status(400).json({ message: 'Only draft requests can be submitted' });
  }

  request.status = 'submitted';
  await request.save();

  await sendNotification({
    type: 'request_submitted',
    title: 'New Purchase Request',
    message: `New request ${request.requestNumber} submitted for approval`,
    recipient: 'manager'
  });

  res.status(200).json({
    success: true,
    data: request
  });
});

export const getRequestsByEmployee = asyncHandler(async (req, res) => {
  const requests = await PurchaseRequest.find({ employee: req.params.employeeId })
    .populate('employee')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

export const getRequestsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const requests = await PurchaseRequest.find({ status })
    .populate('employee')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);

  const total = await PurchaseRequest.countDocuments({ status });

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    pages: Math.ceil(total / limit),
    data: requests
  });
});

export const addAttachment = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const attachment = {
    fileName: req.body.fileName,
    fileUrl: req.body.fileUrl,
    uploadedAt: new Date()
  };

  request.attachments.push(attachment);
  await request.save();

  res.status(200).json({
    success: true,
    data: request
  });
});

export const removeAttachment = asyncHandler(async (req, res) => {
  const request = await PurchaseRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  request.attachments = request.attachments.filter(
    att => att._id.toString() !== req.params.attachmentId
  );

  await request.save();

  res.status(200).json({
    success: true,
    data: request
  });
});
