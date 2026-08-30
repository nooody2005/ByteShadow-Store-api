const Bid = require('./../models/bidModel');
const Painting = require('./../models/paintingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controllers/handleFactory');

// ============================================================
// CREATE BID
// ============================================================

exports.createBid = catchAsync(async (req, res, next) => {
  // const { amount } = req.body;
  const { amount, user } = req.body;

  

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
  // const bid = await Bid.create({
  //   painting: painting._id,
  //   user: req.user._id,
  //   amount,
  // });

  const bid = await Bid.create({
    painting: painting._id,
    user: user,
    amount
  });

  // 7) Update painting
  painting.currentPrice = amount;
  painting.totalBids += 1;
  // painting.highestBidder = req.user._id;
  painting.highestBidder = user;

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

exports.updateBid = handleFactory.updateOne(Bid);
// ============================================================
// DELETE BID
// ============================================================

// exports.deleteBid = handleFactory.deleteOne(Bid);

exports.deleteBid = catchAsync(async (req, res, next) => {
  // 1) Find the bid
  const bid = await Bid.findById(req.params.id);

  if (!bid) {
    return next(new AppError('No bid found with that ID', 404));
  }

  // 2) Get the painting ID before deleting the bid
  const paintingId = bid.painting;

  // 3) Delete the bid
  await Bid.findByIdAndDelete(req.params.id);

  // 4) Find all remaining bids for this painting
  const remainingBids = await Bid.find({
    painting: paintingId
  }).sort({ amount: -1 });

  // 5) Find the painting
  const painting = await Painting.findById(paintingId);

  if (!painting) {
    return next(new AppError('No painting found with that ID', 404));
  }

  // 6) If there are remaining bids
  if (remainingBids.length > 0) {
    const highestBid = remainingBids[0];

    painting.currentPrice = highestBid.amount;
    painting.highestBidder = highestBid.user;
    painting.totalBids = remainingBids.length;
  }

  // 7) If there are NO bids remaining
  else {
    painting.currentPrice = painting.startingPrice;
    painting.highestBidder = null;
    painting.totalBids = 0;
  }

  // 8) Save painting
  await painting.save({
    validateBeforeSave: false
  });

  // 9) Response
  res.status(204).json({
    status: 'success',
    data: null
  });
});

