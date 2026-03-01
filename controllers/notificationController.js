import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;
  const skip = (page - 1) * limit;

  let query = { recipient: req.user._id };

  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const notifications = await Notification.find(query)
    .populate('sender')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    pages: Math.ceil(total / limit),
    data: notifications
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });

  res.status(200).json({
    success: true,
    message: 'All notifications deleted'
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    unreadCount
  });
});

export const sendNotification = asyncHandler(async (req, res) => {
  const { recipient, type, title, message, actionUrl, priority = 'medium' } = req.body;

  const notification = new Notification({
    recipient,
    sender: req.user._id,
    type,
    title,
    message,
    actionUrl,
    priority
  });

  await notification.save();
  await notification.populate('sender');

  res.status(201).json({
    success: true,
    data: notification
  });
});
