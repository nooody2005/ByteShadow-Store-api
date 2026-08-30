// const express = require('express');

// const bidController = require('./../controllers/bidController');
// const authController = require('./../controllers/authController');

// const router = express.Router({
//   mergeParams: true,
// });


// // ============================================================
// // PROTECTED ROUTES
// // ============================================================

// // router.use(authController.protect);

// //=============================================================

// // GET ALL BIDS 
// router .route('/') .get(bidController.getAllBids); 

// // GET / DELETE ONE BID 
// router .route('/:id') .get(bidController.getBid) .delete( bidController.deleteBid );

// // ============================================================
// // /api/v1/paintings/:paintingId/bids
// // ============================================================


// router
//   .route('/')
//   .post(
//     // authController.restrictTo('user'),
//     bidController.createBid
//   )
//   .get(
//     bidController.getPaintingBids
//   );


// // ============================================================
// // /api/v1/paintings/:paintingId/bids/:id
// // ============================================================

// router
//   .route('/:id')
//   .get(
//     bidController.getBid
//   )
//   .delete(
//     // authController.restrictTo('admin'),
//     bidController.deleteBid
//   );




// module.exports = router;
const express = require('express');

const bidController = require('./../controllers/bidController');
const authController = require('./../controllers/authController');


const router = express.Router();


// ============================================================
// PROTECTED ROUTES
// ============================================================

// router.use(authController.protect);


// ============================================================
// GET ALL BIDS
// GET /api/v1/bids
// ============================================================

router
  .route('/')
  .get( authController.protect,
      authController.restrictTo('admin', 'lead-guide'),  
  bidController.getAllBids);


// ============================================================
// GET / DELETE ONE BID
// GET    /api/v1/bids/:id
// DELETE /api/v1/bids/:id
// ============================================================

router
  .route('/:id')
  .get(bidController.getBid)
  .patch(bidController.updateBid)
  .delete(
    // authController.restrictTo('admin'),
    bidController.deleteBid
  );


module.exports = router;

