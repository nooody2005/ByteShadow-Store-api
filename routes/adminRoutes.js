const express = require('express');

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAdminDashboard
);

// =========================== paintings dashboard ===========================
router.get(
  '/paintings',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getPaintingsDashboard
);

// Add painting
router.get(
  '/paintings/add',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAddPainting
);

router.get(
  '/paintings/:id/edit',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getEditPainting
);

// router.post(
//   '/paintings/add',
//   authController.protect,
//   authController.restrictTo('admin'),
//   adminController.createPainting
// );

// ========================================= usres dashboard ===========================================
//get all users
router.get(
  '/users',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getUsersDashboard
);


// add user
router.get(
  '/users/add',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAddUser
);

// router.post(
//   '/users/add',
//   authController.protect,
//   authController.restrictTo('admin'),
//   adminController.addUser
// );

router.post(
  '/users/add',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  adminController.addUser
);


// Edit User page
router.get(
    '/users/:id/edit',
    authController.protect,
    authController.restrictTo('admin'),
    adminController.getEditUser
);

// Update User
router.patch(
  '/users/:id/edit',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  adminController.updateUser
);


// Delete user
router.delete(
  '/users/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.deleteUser
);


// Block User || un block
router.patch(
  '/users/:id/status',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.toggleUserStatus
);


// show user
router.get(
    '/users/:id',
    authController.protect,
    authController.restrictTo('admin'),
    adminController.getUser
);






module.exports = router;
