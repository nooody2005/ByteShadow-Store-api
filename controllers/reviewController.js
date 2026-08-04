// const { status } = require('express/lib/response');
// const Review = require('./../models/reviewModel');
// // const catchAsync = require('./../utils/catchAsync');
// const handleFactory =  require('./../controllers/handleFactory');


// exports.setTourUserIds = (req,res,next) => { //this middleware before creating reviews ...cuz needing to route with tour & user id
//     //Allow nested routes
//     if(!req.body.tour)   req.body.tour = req.params.tourId;
//     if(!req.body.user)  req.body.user = req.user.id;
    
//     next();
// }
// //=========================================================
// exports.getAllReviews = handleFactory.getAll(Review);
// exports.getReview = handleFactory.getOne(Review);
// exports.createReview = handleFactory.createOne(Review);
// exports.updateReview = handleFactory.updateOne(Review);
// exports.deleteReview = handleFactory.deleteOne(Review);
// //========================================================
