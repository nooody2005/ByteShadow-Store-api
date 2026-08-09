// const Booking = require('../models/bookingModel');
// const Review = require('../models/reviewModel');

const Painting = require('../models/paintingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

//==================================== OVERVIEW PAGE =============================

exports.getOverview = catchAsync(async (req, res, next) => {
  const paintings = await Painting.find().lean();

  res.status(200).render('overview', {
    title: 'All Paintings',
    paintings
  });
});

//==================================== DETAILS PAGE =============================

exports.getPainting = catchAsync(async (req, res, next) => {
  const painting = await Painting.findOne({
    slug: req.params.slug
  }).populate({
    path: 'bids',
    fields: 'bids on..'
  });

  if (!painting) {
    return next(new AppError('There is no painting with that name :)', 404));
  }

  res.status(200).render('painting', {
    title: `${painting.name} Painting`,
    painting
  });
});

//==================================== LOGIN FORM =============================

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

//==================================== SIGNUP FORM =============================

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  });
};

//==================================== ACCOUNT PAGE =============================

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
    user: req.user
  });
});

//==================================== UPDATE USER DATA =============================

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
});







// exports.getMyPaintings = catchAsync(async(req, res ,next) => {
//   // 1) Find all bookings    
//   const bookings = await Booking.find({ user: req.user.id});

//   // 2) Find tours with the returned IDs
//   const tourIDs = bookings.map(el => el.tour);
//   const tours = await Tour.find({ _id: { $in : tourIDs } });

//   res.status(200).render('overview', {
//     title: 'My Tours',    
//     tours
//   });
// });


// ======================================= ADMIN =========================================
//========================================================================================

// ========================================= TOURS =======================================

// exports.getManageTours = catchAsync(async (req, res, next) => {
//   const tours = await Tour.find();

//   res.status(200).render('admin/manageTours', {
//     title: 'Manage Tours',
//     tours
//   });
// });



// exports.getEditTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }

//   res.status(200).render('admin/editTour', {
//     title: 'Edit Tour',
//     tour
//   });
// });


// ========================================= USERS =======================================
// exports.getManageUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).render('admin/manageUsers', {
//     title: 'Manage Users',
//     users
//   });
// });


// ========================================= REVIEWS =======================================
// exports.getManageReviews = catchAsync(async (req, res, next) => {
//   // const reviews = await Review.find();
//   const reviews = await Review.find();
//     // .populate('user')
//     // .populate('tour');


//   res.status(200).render('admin/manageReviews', {
//     title: 'Manage reviews',
//     reviews
//   });
// });


// ========================================= BOOKINGS =======================================
// exports.getManageBookings = catchAsync(async (req, res, next) => {
//   // const bookings = await Booking.find();
//   const bookings = await Booking.find()
//     .populate('user')
//     .populate('tour');

//   res.status(200).render('admin/manageBookings', {
//     title: 'Manage Bookings',
//     bookings
//   });
// });


// // =============== TOURS =================





//__________________________ For Show User Page __________________________
// exports.getUserProfile = catchAsync(async (req, res, next) => {
//   // 1) بيانات اليوزر
//   const user = await User.findById(req.params.id);

//   // 2) عدد الـ bids
//   const totalBids = await Bid.countDocuments({
//     user: req.params.id,
//   });

//   // 3) المزادات اللي شارك فيها
//   const participatedAuctions = await Bid.distinct("painting", {
//     user: req.params.id,
//   });

//   // 4) اللوحات اللي كسبها
//   const wonPaintings = await Painting.find({
//     winner: req.params.id,
//   });

//   // 5) إجمالي المبلغ المصروف
//   const totalSpent = await Painting.aggregate([
//     {
//       $match: {
//         winner: user._id,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: {
//           $sum: "$finalPrice",
//         },
//       },
//     },
//   ]);

//   // 6) المزادات النشطة
//   const activeAuctions = await Painting.find({
//     status: "active",
//     highestBidder: req.params.id,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//       totalBids,
//       participatedAuctions: participatedAuctions.length,
//       wonPaintings,
//       totalSpent: totalSpent.length ? totalSpent[0].total : 0,
//       activeAuctions,
//     },
//   });
// });
