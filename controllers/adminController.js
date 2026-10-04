const Painting = require('../models/paintingModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

const catchAsync = require('../utils/catchAsync');

exports.getAdminDashboard = catchAsync(async (req, res, next) => {
  const [
    totalPaintings,
    activePaintings,
    soldPaintings,
    reservedPaintings,
    endedPaintings,

    totalAuctions,
    activeAuctions,
    endedAuctions,

    totalUsers,
    customers,
    admins,
    blockedUsers,

    totalOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders
  ] = await Promise.all([
    // =========================
    // Paintings
    // =========================

    Painting.countDocuments(),

    Painting.countDocuments({
      status: 'active'
    }),

    Painting.countDocuments({
      status: 'sold'
    }),

    Painting.countDocuments({
      status: 'reserved'
    }),

    Painting.countDocuments({
      status: 'ended'
    }),

    // =========================
    // Auctions
    // =========================

    Painting.countDocuments({
      auctionStart: { $ne: null },
      auctionEnd: { $ne: null }
    }),

    Painting.countDocuments({
      status: 'active'
    }),

    Painting.countDocuments({
      status: 'ended'
    }),

    // =========================
    // Users
    // =========================

    User.countDocuments(),

    User.countDocuments({
      role: 'user'
    }),

    User.countDocuments({
      role: 'admin'
    }),

    User.countDocuments({
      status: 'blocked'
    }),

    // =========================
    // Orders
    // =========================

    Order.countDocuments(),

    Order.countDocuments({
      shippingStatus: 'processing'
    }),

    Order.countDocuments({
      shippingStatus: 'shipped'
    }),

    Order.countDocuments({
      shippingStatus: 'delivered'
    })
  ]);

  res.status(200).render('admin/mainAdminDashboard', {
    title: 'Admin Dashboard',

    // Paintings
    totalPaintings,
    activePaintings,
    soldPaintings,
    reservedPaintings,
    endedPaintings,

    // Auctions
    totalAuctions,
    activeAuctions,
    endedAuctions,

    // Users
    totalUsers,
    customers,
    admins,
    blockedUsers,

    // Orders
    totalOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders
  });
});
