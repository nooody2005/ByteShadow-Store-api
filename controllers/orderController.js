const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createPaymentIntention } = require('../utils/paymob');

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
