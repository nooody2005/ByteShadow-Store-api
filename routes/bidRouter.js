const express = require('express');

const bidController = require('./../controllers/bidController');
const authController = require('./../controllers/authController');

const router = express.Router({
  mergeParams: true,
});


// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(authController.protect);


// ============================================================
// /api/v1/paintings/:paintingId/bids
// ============================================================

router
  .route('/')
  .post(
    authController.restrictTo('user'),
    bidController.createBid
  )
  .get(
    bidController.getPaintingBids
  );


// ============================================================
// /api/v1/paintings/:paintingId/bids/:id
// ============================================================

router
  .route('/:id')
  .get(
    bidController.getBid
  )
  .delete(
    authController.restrictTo('admin'),
    bidController.deleteBid
  );


module.exports = router;

