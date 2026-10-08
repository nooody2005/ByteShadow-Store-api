const Painting = require('../models/paintingModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Bid = require('../models/bidModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


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


// ===================================================================================================================
// ====================================== render Paintings pages for admin ============================================
// ====================================================================================================================
// get the paintinds dashboard
exports.getPaintingsDashboard = catchAsync(async (req, res, next) => {
  const [
    totalPaintings,
    soldPaintings,
    reservedPaintings,
    activePaintings,
    endedPaintings,
    paintings
  ] = await Promise.all([
    Painting.countDocuments(),

    Painting.countDocuments({
      status: 'sold'
    }),

    Painting.countDocuments({
      status: 'reserved'
    }),

    Painting.countDocuments({
      status: 'active'
    }),

    Painting.countDocuments({
      status: 'ended'
    }),

    Painting.find().sort('-createdAt')
  ]);

    // res.status(200).render('admin/paintings/paintingsDashboard', {
    // title: 'Paintings Dashboard',
    // totalPaintings,
    // soldPaintings,
    // reservedPaintings,
    // activePaintings,
    // endedPaintings,
    // paintings,
    // message: req.query.message
    // });

    res.status(200).render('admin/paintings/paintingsDashboard', {
      title: 'Paintings Dashboard',
      totalPaintings,
      soldPaintings,
      reservedPaintings,
      activePaintings,
      endedPaintings,
      paintings,
      message: req.query.message
    });
});

// add paintings
exports.getAddPainting = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/paintings/addPainting', {
    title: 'Add New Painting'
  });
});


//ُ Edit paintings
exports.getEditPainting = catchAsync(async (req, res, next) => {
  const painting = await Painting.findById(req.params.id);

  res.status(200).render('admin/paintings/editPainting', {
    title: 'Edit Painting',
    painting
  });
});


// ===================================================================================================================
// ====================================== render Users pages for admin ============================================
// ====================================================================================================================

//get all users
// exports.getUsersDashboard = catchAsync(async (req, res, next) => {
//   res.status(200).render('admin/users/usersDashboard', {
//     title: 'Users Dashboard'
//   });
// });

exports.getUsersDashboard = catchAsync(async (req, res, next) => {
  const [
    totalUsers,
    customers,
    admins,
    blockedUsers,
    users
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ status: 'blocked' }),
    User.find().sort('-createdAt')
  ]);

//   res.status(200).render('admin/users/usersDashboard', {
//     title: 'Users Dashboard',
//     totalUsers,
//     customers,
//     admins,
//     blockedUsers,
//     users
//   });

  res.status(200).render('admin/users/usersDashboard', {
    title: 'Users Dashboard',
    totalUsers,
    customers,
    admins,
    blockedUsers,
    users,
    message: req.query.message
  });
});


//show user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const [bids, participatedAuctions, wonPaintings, orders] = await Promise.all([
    Bid.find({ user: user._id }).populate('painting'),

    Bid.distinct('painting', {
      user: user._id
    }),

    Painting.find({
      winner: user._id
    }),

    Order.find({
      user: user._id
    }).populate('painting')
  ]);

  const totalSpent = orders.reduce(
    (total, order) => total + (order.amount || 0),
    0
  );

  res.status(200).render('admin/users/showUser', {
    title: `${user.name} - User Details`,
    user,
    bids,
    participatedAuctions,
    wonPaintings,
    orders,
    totalSpent
  });
});


// add user
// exports.getAddUser = catchAsync(async (req, res, next) => {
//   res.status(200).render('admin/users/addUser', {
//     title: 'Add New User'
//   });
// });

// add user

exports.getAddUser = catchAsync(async (req, res, next) => {

    res.status(200).render('admin/users/addUser', {
        title: 'Add New User',
        // message: 'User added successfully'
    });

});


// add user

// exports.addUser = catchAsync(async (req, res, next) => {

//     await User.create(req.body);

//     res.redirect('/admin/users?message=User added successfully');

// });

exports.addUser = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }

  await User.create(req.body);

  res.redirect('/admin/users?message=User added successfully');
});

// Edit user
exports.getEditUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).render('admin/users/editUser', {
    title: `Edit ${user.name}`,
    user
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.redirect(`/admin/users/${user._id}?message=User updated successfully`);
});