// const express = require('express');

// const orderController = require('../controllers/orderController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// router.use(authController.protect);

// router.post('/:orderId/pay', orderController.createPayment);

// module.exports = router;

const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/paymob-webhook', orderController.paymobWebhook);

router.use(authController.protect);

router.post('/:orderId/pay', orderController.createPayment);

module.exports = router;