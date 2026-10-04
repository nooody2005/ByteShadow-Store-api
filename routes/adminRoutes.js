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

module.exports = router;
