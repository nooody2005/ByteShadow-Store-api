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
router.get(
  '/users',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getUsersDashboard
);


module.exports = router;
