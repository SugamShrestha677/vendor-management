import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    purchaseRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseRequest',
      required: true
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comment: String,
    rejectionReason: String,
    approvalDate: Date,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    dueDate: Date,
    attachments: [{
      fileName: String,
      fileUrl: String
    }]
  },
  { timestamps: true }
);

approvalSchema.index({ purchaseRequest: 1, manager: 1 });
approvalSchema.index({ status: 1, manager: 1 });

const Approval = mongoose.model('Approval', approvalSchema);
export default Approval;
