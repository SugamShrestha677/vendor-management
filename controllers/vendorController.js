import User from "../models/User.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const { category, limit = 50, search } = req.query;

    // Build query to get only vendors
    let query = { role: "vendor" };

    // Filter by category if provided
    if (category) {
      query.vendorCategories = category;
    }

    // Search by company name or email
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const vendors = await User.find(query)
      .select("-password -passwordResetToken -verificationToken")
      .limit(parseInt(limit))
      .sort("-createdAt");

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendors",
    });
  }
});

export const getVendorById = asyncHandler(async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "vendor",
    }).select("-password -passwordResetToken -verificationToken");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor",
    });
  }
});

export const updateVendorProfile = asyncHandler(async (req, res) => {
  const { companyName, vendorCategories, bankDetails, contactPerson } =
    req.body;

  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  if (
    vendor._id.toString() !== req.user._id.toString() &&
    req.user.role !== "manager"
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this vendor" });
  }

  vendor.companyName = companyName || vendor.companyName;
  vendor.vendorCategories = vendorCategories || vendor.vendorCategories;
  vendor.bankDetails = bankDetails || vendor.bankDetails;
  vendor.firstName = contactPerson?.firstName || vendor.firstName;
  vendor.lastName = contactPerson?.lastName || vendor.lastName;
  vendor.phoneNumber = contactPerson?.phoneNumber || vendor.phoneNumber;

  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor,
  });
});

export const getVendorOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let query = { vendor: req.params.id };

  if (status) {
    query.status = status;
  }

  const orders = await PurchaseOrder.find(query)
    .populate("purchaseRequest")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);

  const total = await PurchaseOrder.countDocuments(query);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pages: Math.ceil(total / limit),
    data: orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;

  const order = await PurchaseOrder.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.vendor.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this order" });
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (notes) order.notes = notes;

  if (status === "delivered") {
    order.actualDeliveryDate = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const uploadDocument = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  const document = {
    name: req.body.name,
    url: req.body.url,
    type: req.body.type,
    uploadedAt: new Date(),
  };

  vendor.documents.push(document);
  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor,
  });
});

export const getVendorAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;

  const totalOrders = await PurchaseOrder.countDocuments({ vendor: vendorId });
  const deliveredOrders = await PurchaseOrder.countDocuments({
    vendor: vendorId,
    status: "delivered",
  });
  const pendingOrders = await PurchaseOrder.countDocuments({
    vendor: vendorId,
    status: { $in: ["pending", "processing"] },
  });

  const totalRevenue = await PurchaseOrder.aggregate([
    { $match: { vendor: { $oid: vendorId } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      deliveryRate: ((deliveredOrders / totalOrders) * 100).toFixed(2),
    },
  });
});

export const searchVendors = asyncHandler(async (req, res) => {
  const { keyword, category } = req.query;

  let query = { role: "vendor", isActive: true };

  if (keyword) {
    query.$or = [
      { companyName: { $regex: keyword, $options: "i" } },
      { firstName: { $regex: keyword, $options: "i" } },
      { lastName: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) {
    query.vendorCategories = { $in: [category] };
  }

  const vendors = await User.find(query).select("-password").limit(20);

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors,
  });
});

export const getRatingAndReview = asyncHandler(async (req, res) => {
  const orders = await PurchaseOrder.find({
    vendor: req.params.id,
    status: "delivered",
  });

  const totalOrders = orders.length;
  const onTimeDeliveries = orders.filter(
    (order) => order.actualDeliveryDate <= order.expectedDeliveryDate,
  ).length;

  const rating =
    totalOrders > 0 ? ((onTimeDeliveries / totalOrders) * 5).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    data: {
      rating,
      totalOrders,
      onTimeDeliveries,
      deliveryRate: ((onTimeDeliveries / totalOrders) * 100).toFixed(2),
    },
  });
});
