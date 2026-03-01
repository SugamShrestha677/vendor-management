import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const sendNotification = async (options) => {
  const { type, title, message, recipient, actionUrl, priority = 'medium', data } = options;

  try {
    let recipientIds = [];

    if (recipient === 'manager') {
      const managers = await User.find({ role: 'manager' });
      recipientIds = managers.map(m => m._id);
    } else if (recipient === 'vendor') {
      const vendors = await User.find({ role: 'vendor' });
      recipientIds = vendors.map(v => v._id);
    } else if (Array.isArray(recipient)) {
      recipientIds = recipient;
    } else {
      recipientIds = [recipient];
    }

    const notifications = recipientIds.map(id => ({
      recipient: id,
      type,
      title,
      message,
      actionUrl,
      priority,
      data,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }));

    await Notification.insertMany(notifications);

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

export const sendMultipleNotifications = async (notificationsList) => {
  try {
    await Notification.insertMany(notificationsList);
    return true;
  } catch (error) {
    console.error('Error sending multiple notifications:', error);
    return false;
  }
};
