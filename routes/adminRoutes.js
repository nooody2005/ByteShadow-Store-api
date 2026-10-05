const express = require('express');

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAdminDashboard
);

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

// router.post(
//   '/paintings/add',
//   authController.protect,
//   authController.restrictTo('admin'),
//   adminController.createPainting
// );


module.exports = router;
