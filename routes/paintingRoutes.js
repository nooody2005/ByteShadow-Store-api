const express = require('express');
const router = express.Router();
const paintingController = require('./../controllers/paintingController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
// const reviewRouter = require('./../routes/reviewRoutes');

// router.use('/:paintingId/reviews', reviewRouter);

// const bidRouter = require('./../routes/bidRouter');
// router.use('/:paintingId/bids', bidRouter);


const bidController = require('./../controllers/bidController');
router
  .route('/:paintingId/bids')
  .post(
    // authController.protect,
    // authController.restrictTo('user'),
    bidController.createBid
  )
  .get(bidController.getPaintingBids);

  

// router
// .route("/")
// .get(paintingController.getAllPaintings)
// .post(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     paintingController.createPainting
// );

router.route("/").get(paintingController.getAllPaintings).post(
//   authController.protect,
//   authController.restrictTo("admin", "lead-guide"),

  paintingController.uploadPaintingImages,
  paintingController.generatePaintingId,
  paintingController.resizePaintingImages,
  paintingController.createPainting,
);

router
.route('/:id')
.get(paintingController.getPainting)
.patch(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    paintingController.uploadPaintingImages,
    paintingController.resizePaintingImages,
    paintingController.updatePainting
)
.delete(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    paintingController.deletePainting
);

module.exports = router;


















//   .post(paintingController.checkBody, paintingController.createPainting);

// router
//   .route('/:paintingId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// router.param('id', paintingController.checkId);

// router
//   .route('/top-5-cheap')
//   .get(paintingController.aliasTopPainting, paintingController.getAllPaintings);