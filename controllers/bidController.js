const Bid = require('./../models/bidModel');
const Painting = require('./../models/paintingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controllers/handleFactory');

// ============================================================
// CREATE BID
// ============================================================

exports.createBid = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  // 1) Check amount
  if (!amount) {
    return next(new AppError('Please provide a bid amount', 400));
  }

  // 2) Get painting
  const painting = await Painting.findById(req.params.paintingId);

  if (!painting) {
    return next(new AppError('No painting found with that ID', 404));
  }

  // 3) Check auction status
  if (painting.status !== 'active') {
    return next(
      new AppError('You can only bid on an active auction', 400)
    );
  }

  // 4) Check auction dates
  const now = new Date();

  if (now < painting.auctionStart) {
    return next(
      new AppError('This auction has not started yet', 400)
    );
  }

  if (now > painting.auctionEnd) {
    return next(
      new AppError('This auction has already ended', 400)
    );
  }

  // 5) Bid must be higher than current price
  if (amount <= painting.currentPrice) {
    return next(
      new AppError(
        `Your bid must be higher than the current price (${painting.currentPrice})`,
        400
      )
    );
  }

  // 6) Create bid
  const bid = await Bid.create({
    painting: painting._id,
    user: req.user._id,
    amount,
  });

  // 7) Update painting
  painting.currentPrice = amount;
  painting.totalBids += 1;
  painting.highestBidder = req.user._id;

  await painting.save({
    validateBeforeSave: false,
  });

  // 8) Send response
  res.status(201).json({
    status: 'success',
    data: {
      bid,
    },
  });
});


// ============================================================
// GET ALL BIDS
// ============================================================

exports.getAllBids = catchAsync(async (req, res, next) => {
  const bids = await Bid.find()
    .populate('user', 'name email photo')
    .populate('painting', 'name currentPrice');

  res.status(200).json({
    status: 'success',
    results: bids.length,
    data: {
      bids,
    },
  });
});


// ============================================================
// GET BIDS FOR ONE PAINTING
// ============================================================

exports.getPaintingBids = catchAsync(async (req, res, next) => {
  const bids = await Bid.find({
    painting: req.params.paintingId,
  })
    .populate('user', 'name photo')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bids.length,
    data: {
      bids,
    },
  });
});


// ============================================================
// GET ONE BID
// ============================================================

exports.getBid = handleFactory.getOne(Bid);


// ============================================================
// DELETE BID
// ============================================================

exports.deleteBid = handleFactory.deleteOne(Bid);

