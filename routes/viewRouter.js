// const express = require('express');
// const viewsController = require('../controllers/viewsController');
// const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

// const router = express.Router();
// // router.use(authController.isLoggedIn);

// router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview);
// // router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get('/me',authController.protect,viewsController.getAccount);

// router.get('/my-tours',authController.protect, viewsController.getMyTours);


// router.post('/submit-user-data',authController.protect, viewsController.updateUserData);

// router.get('/signup', viewsController.getSignupForm);

// // =============================================================================== ADMIN ===================================================================
// router.get(
//   '/manage-tours',
//   authController.protect,
//   authController.restrictTo('admin'),
//   viewsController.getManageTours
// );

// router.get(
//   '/manage-users',
//   authController.protect,
//   authController.restrictTo('admin'),
//   viewsController.getManageUsers
// );

// router.get(
//   '/manage-reviews',
//   authController.protect,
//   authController.restrictTo('admin'),
//   viewsController.getManageReviews
// );

// router.get(
//   '/manage-bookings',
//   authController.protect,
//   authController.restrictTo('admin'),
//   viewsController.getManageBookings
// );

// // ======================= TOURS ======================
// router.get(
//   '/admin/tours/:id/edit',
//   authController.protect,
//   authController.restrictTo('admin'),
//   viewsController.getEditTour
// );


// module.exports = router;













































//====================================================================
// router.get('/', (req ,res ) => {
//   res.status(200).render('base', {
//     //get in base file that existed in views folder
//     tour: 'The Forest Hiker',
//     user: 'Nada'
//   });    
// });