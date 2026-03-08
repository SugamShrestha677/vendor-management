import mongoose from 'mongoose';

const purchaseRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        description: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        estimatedUnitPrice: {
          type: Number,
          required: true,
          min: 0
        },
        category: String,
        specifications: String,
        deliveryDate: Date,
        _id: mongoose.Schema.Types.ObjectId
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    department: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    preferredVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'submitted','pending', 'approved', 'rejected', 'purchased', 'delivered', 'completed'],
      default: 'draft'
    },
    rejectionReason: String,
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date
      }
    ],
    notes: String,
    budgetCode: String,
    costCenter: String,
    estimatedDeliveryDate: Date,
    approvalHistory: [
      {
        approver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['approved', 'rejected', 'pending']
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: Date,
    rejectedAt: Date
  },
  { timestamps: true }
);

// Index for better query performance
purchaseRequestSchema.index({ employee: 1, status: 1 });
purchaseRequestSchema.index({ department: 1, createdAt: -1 });
purchaseRequestSchema.index({ requestNumber: 1 });

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);
export default PurchaseRequest;
