const express = require('express');
// const bookingController = require('../controllers/bookingController');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// ========================= PUBLIC ROUTES =========================

// Overview
router.get('/', viewsController.getOverview);

// Login page
router.get('/login', viewsController.getLoginForm);

// Signup page
router.get('/signup', viewsController.getSignupForm);

// ========================= PAINTING ROUTES =========================

// Painting details
router.get('/painting/:slug', viewsController.getPainting);

// ========================= PROTECTED ROUTES =========================

// Account page
router.get('/account', authController.protect, viewsController.getAccount);

// Update account data
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;




// =============================================================================== ADMIN ===================================================================
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

//====================================================================
// router.get('/', (req ,res ) => {
//   res.status(200).render('base', {
//     //get in base file that existed in views folder
//     tour: 'The Forest Hiker',
//     user: 'Nada'
//   });    
// });