// const mongoose  = require('mongoose');
// const Tour = require('./tourModel');

// const reviewSchema = new mongoose.Schema(
//   {
//     review: {
//       type: String,
//       required: [true, 'Review can not be empty']
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     // creating a parent reference
//     tour: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Tour',
//       required: [true, 'Review must belong to a tour']
//     },
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: [true, 'Review must belong to a user']
//     }
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// reviewSchema.index({ tour: 1, user:1 }, { unique:true });

// reviewSchema.statics.calcAverageRatings = async function (tourId) {
//     const stats = await this.aggregate([
//       {
//         $match: { tour: tourId }
//       },
//       {
//         $group: {
//           _id: '$tour',
//           nRating: { $sum: 1 },
//           avgRating: { $avg: '$rating' }
//         }
//       }
//     ]);
//     // console.log(stats);

//     if(stats.length > 0){
//       await Tour.findByIdAndUpdate(tourId, {
//         ratingsQuantity: stats[0].nRating,
//         ratingsAverage : stats[0].avgRating
//       });
//     } else {
//       await Tour.findByIdAndUpdate(tourId, {
//         ratingsQuantity:0,
//         ratingsAverage:4.5
//       });
//     }
// }


// //save ---->  not working with query operation like
// // FindOneAndUpdate
// // FindOneAndDelete
// reviewSchema.post('save', function(){
//   //this points to current Review
//   this.constructor.calcAverageRatings(this.tour);
// });

// reviewSchema.pre(/^findOneAnd/, async function(next) {
//   // this.r = await this.findOne();
//   this.r = await this.clone().findOne();
//   // console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function() {
//   // this.r = await this.findOne(); Doesn't work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

// reviewSchema.pre(/^find/, function(next) {
//   //populating review
//   //   this.populate({
//   //     path  :'tour',
//   //     select:'name'
//   //   }).populate({
//   //     path:'user',
//   //     select:'name photo'
//   //   });
//   //   next();
//   // });

//   this.populate({
//     path: 'user',
//     select: 'name photo'
//   });
//   next();
// });


// const Review = mongoose.model('Review',reviewSchema);

// module.exports = Review;
