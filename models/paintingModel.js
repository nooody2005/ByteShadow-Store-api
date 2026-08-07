const mongoose = require('mongoose');
const slugify = require('slugify');

const validator = require('validator');
const User = require('./usermodel');


//make collection (table)
const paintingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A painting must have a name"],
      unique: true,
      trim: true,
      maxlength: [100, "A painting name must have less than 100 characters"],
      minlength: [3, "A painting name must have more than 3 characters"],
    },

    slug: String,

    briefPara: {
      type: String,
      required: [true, "A painting must have a brief description"],
      trim: true,
    },

    description1: {
      //paragraph
      type: String,
      required: [true, "A painting must have a description"],
      trim: true,
    },

    description2: {
      //the rest of paragraph
      type: String,
      required: [true, "A painting must have a description"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "A painting must have a type"],
      enum: {
        values: ["Nature", "Portrait", "Romantic", "Expressive"],
        message: "Type is either: Nature, Portrait, Romantic or Expressive",
      },
    },

    size: {
      type: String,
      required: [true, "A painting must have a size"],
    },

    image: {
      type: String,
      required: [true, "A painting must have a main image"],
    },

    decoImages: [String],

    stageImages: [String],

    startingPrice: {
      type: Number,
      required: [true, "A painting must have a starting price"],
      min: [1, "Price must be greater than 0"],
    },

    currentPrice: {
      type: Number,
      default: function () {
        return this.startingPrice;
      },
    },

    auctionStart: {
      type: Date,
      required: [true, "Auction must have a start date"],
    },

    auctionEnd: {
      type: Date,
      required: [true, "Auction must have an end date"],
    },

    // bids: [
    //   {
    //     user: {
    //       type: mongoose.Schema.ObjectId,
    //       ref: "User",
    //     },
    //     amount: Number,
    //     createdAt: Date,
    //   },
    // ],

    totalBids: {
      type: Number,
      default: 0,
    },

    highestBidder: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },

    winner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },

    finalPrice: {
      type: Number,
      default: null,
    },

    // artist: {
    //   type: String,
    //   default: "Byte Shadow",
    // },

    status: {
      type: String,
      enum: ["draft", "active", "ended", "sold", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true, //createdAt  updatedAt
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);


// to make a virtual view ... painting + its bids
paintingSchema.virtual("bids", {
  ref: "Bid",
  foreignField: "painting",
  localField: "_id",
});


paintingSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});




const Painting = mongoose.model("Painting", paintingSchema);

module.exports = Painting;








// const tourSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'A tour must have a name'],
//       unique: true,
//       trim: true,
//       maxlength: [40, 'name must be less than 40 characters'],
//       minlength: [10, 'name must be above 10 characters']
//       // validate : [validator.isAlpha,'name should contains characters only :)']
//     },

//     duration: {
//       type: Number,
//       required: [true, 'A tour must have a duration']
//     },

//     maxGroupSize: {
//       type: Number,
//       required: [true, 'A tour must have a group size']
//     },

//     difficulty: {
//       type: String,
//       required: [true, 'A tour must have a difficulty'],
//       enum: {
//         values: ['easy', 'medium', 'difficult'],
//         message: 'difficulty must be eaither easy or medium or difficult :)'
//       }
//     },

//     ratingsAverage: {
//       type: Number,
//       default: 4.5,
//       min: [1, 'rating must be above 1.0'],
//       max: [5, 'rating must be less than 5'],
//       set: val => Math.round(val * 10 ) / 10      // to round the value of rating like this 4.666666 ---> 46.6666 ---> 47 ---> 4.7
//     },

//     ratingsQuantity: {
//       type: Number,
//       default: 0
//     },

//     price: {
//       type: Number,
//       required: [true, 'A tour must have a price']
//     },

//     priceDiscount: {
//       type: Number,
//       validate: {
//         validator: function(val) {
//           //this only points to the new DOC in new document creation
//           return val < this.price;
//         },
//         message: 'price dicount ({VALUE}) should be below the regular price'
//       }
//     },

//     summary: {
//       type: String,
//       trim: true,
//       required: [true, 'A tour must have a description']
//     },

//     imageCover: {
//       type: String,
//       required: [true, 'A tour must have a cover image']
//     },

//     images: [String],

//     createdAt: {
//       type: Date,
//       default: Date.now()
//     },

//     startDates: [Date],

//     secretTour: {
//       type: Boolean,
//       default: false
//     },
//     startLocation: {
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point']
//       },
//       coordinates: [Number],
//       address: String,
//       description: String
//     },
//     locations: [
//       {
//         type: {
//           type: String,
//           default: 'Point',
//           enum: ['Point']
//         },
//         coordinates: [Number],
//         address: String,
//         description: String,
//         day: Number
//       }
//     ],
//     // guides: Array            //// embedding way
//     guides:[    //referencing way
//         {
//             type: mongoose.Schema.ObjectId,
//             ref: 'User'
//         }
//     ]

//   },

//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );














// tourSchema.index({ price: 1 , ratingsAverage: -1});
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });

// tourSchema.virtual('durationWeeks').get(function() {
//     return this.duration / 7;
// });

// //virtual populate
// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id'
// });

// //DOCUMENT MIDDLEWARE run before save and create

// tourSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, {lower: true});
//     next();
// });

// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//         path:'guides',
//         select: '-__v -passwordChangedAt'
//     }); //we make population
    
//   next();
// });



// // only for new document        ..not update  ---> make embedding
// // tourSchema.pre('save', async function(next){
// //     const guidePromises = this.guides.map(async id => await User.findById(id));
// //     this.guides = await Promise.all(guidePromises);
// //     next();
// // });





// // tourSchema.pre('save', function(next) {
// //     console.log('save done :)');
// //     next();
// // });

// // tourSchema.post('save',function(doc,next){
// //     console.log(doc);
// //     next();
// // });


// //QUERY MIDDLEWARE 
// tourSchema.pre(/^find/,function(next){
//     this.find({secretTour : {$ne : true}});
//     // wanna calculate the process time
//     this.start = Date.now();
//     next();
// });

// tourSchema.post(/^find/,function(docs,next){
//     console.log(`process take ${Date.now() - this.start} millesSconds :)`);
//     // console.log(docs);
//     next();
// });
// // tourSchema.pre('find',function(next){
// //     this.find({secretTour : {$ne : true}});
// //     next();
// // });
// // tourSchema.pre('findOne',function(next){
// //     this.find({secretTour : {$ne : true}});
// //     next();
// // });


// // tourSchema.pre('aggregate',function(next){
// //     this.pipeline().unshift({$match: {secretTour : {$ne : true} } } );
// //     console.log(this.pipeline());
// //     next();
// // });



// const Tour = mongoose.model('Tour', tourSchema);

// module.exports = Tour;