const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Painting = require('../models/paintingModel');
// const { createPaymentIntention } = require('../utils/paymob');
const { createPaymentIntention, verifyPaymobHmac } = require('../utils/paymob');

exports.createPayment = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id
  })
    .populate('user')
    .populate('painting');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  if (order.paymentStatus === 'paid') {
    return next(new AppError('This order has already been paid', 400));
  }

  if (order.status === 'cancelled') {
    return next(new AppError('This order has been cancelled', 400));
  }

  const payment = await createPaymentIntention({
    amount: order.amount,
    user: order.user,
    orderId: order._id,
    paintingName: order.painting.name
  });

  order.paymobOrderId = payment.intention_order_id;
  await order.save();

//   res.status(200).json({
//     status: 'success',
//     data: {
//       clientSecret: payment.client_secret
//     }
//   });

  const checkoutUrl =
    `https://accept.paymob.com/unifiedcheckout/` +
    `?publicKey=${process.env.PAYMOB_PUBLIC_KEY}` +
    `&clientSecret=${payment.client_secret}`;

  res.status(200).json({
    status: 'success',
    data: {
      checkoutUrl
    }
  });
});



exports.paymobWebhook = catchAsync(async (req, res, next) => {
  const { obj } = req.body;
  const receivedHmac = req.query.hmac;

  if (!obj) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Paymob callback'
    });
  }

  const isValid = verifyPaymobHmac(obj, receivedHmac);

  if (!isValid) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid Paymob HMAC'
    });
  }

//   if (!obj.success) {
//     return res.status(200).json({
//       status: 'success',
//       message: 'Payment was not successful'
//     });
//   }

//   const paymobOrderId = obj.order?.id;

//   const order = await Order.findOne({
//     paymobOrderId
//   });

  const paymobOrderId = obj.order?.id;

  const order = await Order.findOne({
    paymobOrderId
  });

  if (!order) {
    return res.status(404).json({
      status: 'fail',
      message: 'Order not found'
    });
  }

  if (!obj.success) {
    order.paymentStatus = 'failed';

    await order.save();

    return res.status(200).json({
      status: 'success',
      message: 'Payment failed'
    });
  }



//   if (!order) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Order not found'
//     });
//   }



  if (obj.amount_cents !== Math.round(order.amount * 100)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Payment amount mismatch'
    });
  }

  // Prevent processing the same successful payment twice
  if (order.paymentStatus === 'paid') {
    return res.status(200).json({
      status: 'success',
      message: 'Payment already processed'
    });
  }

  // The order must still be pending
  if (order.status !== 'pending') {
    order.paymentStatus = 'paid';
    await order.save();

    console.error(
      `Payment received for non-pending order ${order._id}. Manual review/refund may be required.`
    );

    return res.status(200).json({
      status: 'success',
      message: 'Payment recorded for manual review'
    });
  }

  const painting = await Painting.findById(order.painting);

  if (!painting) {
    return res.status(404).json({
      status: 'fail',
      message: 'Painting not found'
    });
  }

  const isCurrentWinner =
    painting.winner &&
    painting.winner.toString() === order.user.toString();

  const deadlineIsValid =
    painting.paymentDeadline &&
    painting.paymentDeadline > new Date();

  // The painting must still be reserved for this winner,
  // and the 24-hour payment deadline must not have passed.
  if (
    painting.status !== 'reserved' ||
    !isCurrentWinner ||
    !deadlineIsValid
  ) {
    order.paymentStatus = 'paid';
    await order.save();

    console.error(
      `Late or mismatched payment for order ${order._id}. Manual review/refund may be required.`
    );

    return res.status(200).json({
      status: 'success',
      message: 'Payment recorded for manual review'
    });
  }

  // Payment is valid for the current reservation
  painting.status = 'sold';
  await painting.save();

  order.paymentStatus = 'paid';
  order.status = 'paid';
  await order.save();

  return res.status(200).json({
    status: 'success'
  });


//   if (obj.amount_cents !== Math.round(order.amount * 100)) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Payment amount mismatch'
//     });
//   }

//   order.paymentStatus = 'paid';
//   order.status = 'paid';


//   const painting = await Painting.findById(order.painting);

//   if (!painting) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Painting not found'
//     });
//   }

//   painting.status = 'sold';
//   await painting.save();

//   await order.save();

// //   await order.save();

//   res.status(200).json({
//     status: 'success'
//   });
  
});


// exports.paymobWebhook = catchAsync(async (req, res, next) => {
//   console.log('================ PAYMOB WEBHOOK ================');
//   console.log(JSON.stringify(req.body, null, 2));
//   console.log('=================================================');

//   res.status(200).json({
//     status: 'success'
//   });
// });


// exports.testFailedPayment = catchAsync(async (req, res, next) => {
//   const order = await Order.findById(req.params.orderId);

//   if (!order) {
//     return next(new AppError('Order not found', 404));
//   }

//   order.paymentStatus = 'failed';

//   await order.save();

//   res.status(200).json({
//     status: 'success',
//     message: 'Test failed payment applied',
//     data: {
//       order
//     }
//   });
// });