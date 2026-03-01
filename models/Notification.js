import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: [
        'request_submitted',
        'request_approved',
        'request_rejected',
        'approval_required',
        'order_created',
        'order_shipped',
        'order_delivered',
        'payment_due',
        'document_uploaded',
        'meeting_scheduled'
      ]
    },
    title: String,
    message: String,
    data: mongoose.Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    readAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

// TTL index to auto-delete old notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
