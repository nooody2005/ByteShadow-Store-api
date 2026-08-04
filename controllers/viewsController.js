// const Tour = require('../models/tourModel');
// const catchAsync = require('../utils/catchAsync'); 
// const AppError = require('../utils/appError');
// const User = require('../models/userModel');
// const Booking = require('../models/bookingModel');
// const Review = require('../models/reviewModel');

// exports.getOverview = catchAsync(async(req, res, next) => {
//   // 1) get tour data from collection

//   // const tours = await Tour.find();
//   const tours = await Tour.find().lean();
//   // console.log(tours[0]);

//   // 2) Build Templates
//   // 3) Render the template using data from 1)

//   res.status(200).render('overview', {
//     title: 'All tours',
//     tours
//   });

// });


// exports.getTour = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested tour (including reviews and guides)
  
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'review rating user'
//   });
  
//   console.log(req.params.slug);

//   if (!tour) {
//     return next(new AppError('There is no tour with that name:)', 404));
//   }

//   // 2) Build template
//   // 3) Render template using data from 1)
//   res.status(200).render('tour', {
//     title: `${tour.name} Tour`,
//     tour
//   });
// });

// exports.getLoginForm = (req, res) => {
//   res.status(200).render('login', {
//     title: 'Log into your account'
//   });
// };

// exports.getAccount = (req,res) => {
//    res.status(200).render('account', {
//      title: 'Your account :)'
//    });
// }

// // update without API
// exports.updateUserData = catchAsync(async(req, res ,next) => {
//   const updateUser = await User.findByIdAndUpdate(req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email
//     },
//     {
//       new : true,
//       runValidators: true
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updateUser    //update user in db 
//   });
// });

// exports.getMyTours = catchAsync(async(req, res ,next) => {
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


// exports.getSignupForm = (req, res) => {
//   res.status(200).render('signup', {
//     title: 'signup'
//   });
// };


// // ========================================================== ADMIN ===============================================================

// exports.getManageTours = catchAsync(async (req, res, next) => {
//   const tours = await Tour.find();

//   res.status(200).render('admin/manageTours', {
//     title: 'Manage Tours',
//     tours
//   });
// });

// exports.getManageUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).render('admin/manageUsers', {
//     title: 'Manage Users',
//     users
//   });
// });

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