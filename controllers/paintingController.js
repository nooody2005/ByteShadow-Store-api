const multer = require('multer');
const sharp = require('sharp');
const Painting = require('./../models/paintingModel');
const Order = require('./../models/orderModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controllers/handleFactory');

const fs = require('fs');
const path = require('path');


const mongoose = require("mongoose");

exports.generatePaintingId = (req, res, next) => {
  req.body._id = new mongoose.Types.ObjectId();
  next();
};

const multerStorage = multer.memoryStorage(); //image will store as buffer to make edits on it like resizing it before saving it in db
const multerFile = (req, file, cb) => {

  //  console.log('====================');
  //  console.log('originalname:', file.originalname);
  //  console.log('mimetype:', file.mimetype);
  //  console.log('fieldname:', file.fieldname);
  //  console.log('====================');
   
  if (
    file.mimetype.startsWith('image') ||
    file.mimetype === 'application/octet-stream'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images:)', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFile
});

exports.uploadPaintingImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'decoImages', maxCount: 5},
    { name: 'stageImages', maxCount: 5}

    // upload.single('image')
    // upload.array('images',5)
]);



exports.resizePaintingImages = catchAsync(async (req, res, next) => {
  if (!req.files?.image && !req.files?.decoImages && !req.files?.stageImages) {
    return next();
  }

  const folderName = req.body.name.replace(/\s+/g, '-');
  const paintingFolder = `public/img/paintings/${folderName}`;

  fs.mkdirSync(paintingFolder, { recursive: true });

  // Main Image
  if (req.files.image) {
    req.body.image = `painting-${Date.now()}-cover.jpeg`;

    await sharp(req.files.image[0].buffer)
      .resize({
        width: 2000,
        height: 1333,
        fit: 'inside'
      })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/paintings/${req.body.image}`);
  }

  // Decoration Images
  if (req.files.decoImages) {
    req.body.decoImages = [];

    await Promise.all(
      req.files.decoImages.map(async (file, i) => {
        const filename = `deco-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`${paintingFolder}/${filename}`);

        req.body.decoImages.push(filename);
      })
    );
  }

  // Stage Images
  if (req.files.stageImages) {
    req.body.stageImages = [];

    await Promise.all(
      req.files.stageImages.map(async (file, i) => {
        const filename = `stage-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`${paintingFolder}/${filename}`);

        req.body.stageImages.push(filename);
      })
    );
  }

  next();
});




// exports.resizePaintingImages = catchAsync(async (req, res, next) => {
//   // console.log('🔥🔥🔥 RESIZE PAINTING IMAGES CALLED 🔥🔥🔥');

//   if (!req.files?.image && !req.files?.decoImages && !req.files?.stageImages) {
//     return next();
//   }

//   let paintingFolder;

//   // =========================================
//   // 1) Main Image
//   // =========================================

//   if (req.files.image) {
//     // Generate a unique name for the main painting image
//     req.body.image = `painting-${Date.now()}-cover.jpeg`;

//     // Save the main image directly inside the paintings folder
//     await sharp(req.files.image[0].buffer)
//       .resize({
//         width: 2000,
//         height: 1333,
//         fit: 'inside'
//       })
//       .toFormat('jpeg')
//       .jpeg({ quality: 90 })
//       .toFile(`public/img/paintings/${req.body.image}`);

//     // =========================================
//     // Create one folder for this painting
//     // The folder name is based on the main image name
//     // =========================================

//     // const folderName = req.body.image.replace('.jpeg', '');

//     // paintingFolder = `public/img/paintings/${folderName}`;
//     // Create a folder using the painting name
//   const folderName = req.body.name.replace(/\s+/g, '-');

//   paintingFolder = `public/img/paintings/${folderName}`;

//   fs.mkdirSync(paintingFolder, { recursive: true });


//     // console.log('================================');
//     // console.log('IMAGE:', req.body.image);
//     // console.log('FOLDER:', paintingFolder);
//     // console.log('EXISTS:', fs.existsSync(paintingFolder));
//     // console.log('================================');
//   }

//   // =========================================
//   // 2) Decoration Images
//   // =========================================

//   if (req.files.decoImages) {
//     // Initialize the decoration images array
//     req.body.decoImages = [];

//     await Promise.all(
//       req.files.decoImages.map(async (file, i) => {
//         // Generate a simple name for the decoration image
//         const filename = `deco-${i + 1}.jpeg`;

//         // Save the decoration image inside the painting folder
//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`${paintingFolder}/${filename}`);

//         // Store the filename in the database
//         req.body.decoImages.push(filename);
//       })
//     );
//   }

//   // =========================================
//   // 3) Stage Images
//   // =========================================

//   if (req.files.stageImages) {
//     // Initialize the stage images array
//     req.body.stageImages = [];

//     await Promise.all(
//       req.files.stageImages.map(async (file, i) => {
//         // Generate a simple name for the stage image
//         const filename = `stage-${i + 1}.jpeg`;

//         // Save the stage image inside the painting folder
//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`${paintingFolder}/${filename}`);

//         // Store the filename in the database
//         req.body.stageImages.push(filename);
//       })
//     );
//   }

//   next();
// });

// =====================================================================================

// exports.finishAuctions = async () => {
//   const now = new Date();

//   const paintings = await Painting.find({
//     auctionEnd: { $lte: now },
//     status: 'active'
//   });

//   for (const painting of paintings) {

//     if (painting.highestBidder) {

      
//       painting.winner = painting.highestBidder;
//       painting.finalPrice = painting.currentPrice;
//       // painting.status = 'sold';
//       painting.status = 'reserved';

//       // painting.paymentDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

//       const existingOrder = await Order.findOne({
//         painting: painting._id
//       });

//       if (!existingOrder) {
//         await Order.create({
//           user: painting.highestBidder,
//           painting: painting._id,
//           amount: painting.currentPrice
//         });
//       }
//     } else {
//       painting.status = 'ended';
//     }


//     await painting.save({
//       validateBeforeSave: false
//     });
//   }

//   console.log(`Finished ${paintings.length} auction(s)`);
// };



exports.finishAuctions = async () => {
  const now = new Date();

  // 1. Finish auctions that have reached their end time
  const paintings = await Painting.find({
    auctionEnd: { $lte: now },
    status: 'active'
  });

  for (const painting of paintings) {
    if (painting.highestBidder) {
      painting.winner = painting.highestBidder;
      painting.finalPrice = painting.currentPrice;
      painting.status = 'reserved';

      // Give the winner 24 hours to pay
      // painting.paymentDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      painting.paymentDeadline = new Date(
        painting.auctionEnd.getTime() + 24 * 60 * 60 * 1000
      );

      // const existingOrder = await Order.findOne({
      //   painting: painting._id,
      //   status: { $in: ['pending', 'paid'] }
      // });
      const existingOrder = await Order.findOne({
        painting: painting._id,
        user: painting.highestBidder,
        status: { $in: ['pending', 'paid'] }
      });

      if (!existingOrder) {
        await Order.create({
          user: painting.highestBidder,
          painting: painting._id,
          amount: painting.currentPrice
        });
      }
    } else {
      painting.status = 'ended';
      painting.paymentDeadline = null;
    }

    await painting.save({
      validateBeforeSave: false
    });
  }

  
  // 2. Release expired reservations
  const expiredPaintings = await Painting.find({
    status: 'reserved',
    paymentDeadline: { $lte: now }
  });

  let releasedCount = 0;

  for (const painting of expiredPaintings) {
    const paidOrder = await Order.findOne({
      painting: painting._id,
      user: painting.winner,
      paymentStatus: 'paid'
    });

    // Never release a painting if its winner has paid
    
  // 2. Release reservations whose payment deadline has passed
    if (paidOrder) continue;

    const pendingOrder = await Order.findOne({
      painting: painting._id,
      user: painting.winner,
      status: 'pending'
    });

    if (pendingOrder) {
      pendingOrder.status = 'cancelled';
      await pendingOrder.save();
    }

    painting.status = 'ended';
    painting.paymentDeadline = null;

    await painting.save({ validateBeforeSave: false });

    releasedCount++;
  }

  console.log(
    `Finished ${paintings.length} auction(s), released ${releasedCount} expired reservation(s)`
  );



  // 2. Release expired reservations
  // const expiredPaintings = await Painting.find({
  //   status: 'reserved',
  //   paymentDeadline: { $lte: now }
  // });

  // const reservedPaintings = await Painting.find({
  //   status: 'reserved'
  // }).select('name status paymentDeadline auctionEnd');

  // console.log('All reserved paintings:', reservedPaintings);

  // const expiredPaintings = await Painting.find({
  //   status: 'reserved',
  //   paymentDeadline: { $lte: now }
  // });

  // console.log('Expired paintings found:', expiredPaintings.length);

  // console.log('Expired paintings found:', expiredPaintings.length);
  // console.log('Current time:', now);

  // let releasedCount = 0;

  // for (const painting of expiredPaintings) {

  //   console.log('Checking painting:', {
  //     id: painting._id.toString(),
  //     status: painting.status,
  //     paymentDeadline: painting.paymentDeadline,
  //     winner: painting.winner?.toString()
  //   });

  //   const paidOrder = await Order.findOne({
  //     painting: painting._id,
  //     user: painting.winner,
  //     paymentStatus: 'paid'
  //   });

  //   console.log('Paid order found:', Boolean(paidOrder));

  //   // Never release a painting if its winner has paid
  //   if (paidOrder) continue;

  //   const pendingOrder = await Order.findOne({
  //     painting: painting._id,
  //     user: painting.winner,
  //     status: 'pending'
  //   });

  //   if (pendingOrder) {
  //     pendingOrder.status = 'cancelled';
  //     await pendingOrder.save();
  //   }

  //   painting.status = 'ended';
  //   painting.paymentDeadline = null;

  //   await painting.save({ validateBeforeSave: false });

  //   releasedCount++;
  // }

  // console.log(
  //   `Finished ${paintings.length} auction(s), released ${releasedCount} expired reservation(s)`
  // );
};





// //================================================================================
exports.getAllPaintings = handleFactory.getAll(Painting);
exports.getPainting = handleFactory.getOne(Painting, { path: 'bids' });
exports.createPainting = handleFactory.createOne(Painting);
exports.updatePainting = handleFactory.updateOne(Painting);
exports.deletePainting = handleFactory.deleteOne(Painting);

// //================================================================================














// exports.resizePaintingImages = catchAsync(async (req, res, next) => {
//     console.log('🔥🔥🔥 RESIZE PAINTING IMAGES CALLED 🔥🔥🔥');

//     console.log('================ FILES ================');
//     console.log(req.files);
//     console.log('=======================================');


//   let paintingFolder;

//   if (!req.files?.image && !req.files?.decoImages && !req.files?.stageImages) {
//     return next();
//   }

// const paintingId = req.params.id || req.body._id;



//   // 1) Main image
//   if (req.files.image) {
//     // req.body.image = `painting-${paintingId}--cover.jpeg`;
//     req.body.image = `painting-${paintingId}--cover-${Date.now()}.jpeg`;

//     await sharp(req.files.image[0].buffer)
//       .resize(2000, 500)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`public/img/paintings/${req.body.image}`);


    
//   // Create a folder with the main image name
//   paintingFolder = `public/img/paintings/${req.body.image.replace('.jpeg', '')}`;

//   fs.mkdirSync(paintingFolder, { recursive: true });  

//    console.log('================================');
//    console.log('IMAGE:', req.body.image);
//    console.log('FOLDER:', paintingFolder);
//    console.log('EXISTS:', fs.existsSync(paintingFolder));
//    console.log('================================');
//   }



//   // 2) Decoration images
//   if (req.files.decoImages) {
//     req.body.decoImages = [];

//     await Promise.all(
//       req.files.decoImages.map(async (file, i) => {
//         // const filename = `painting-${paintingId}--deco-${i + 1}.jpeg`;
//         const filename = `painting-${paintingId}--deco-${Date.now()}-${i + 1}.jpeg`;

//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`${paintingFolder}/${filename}`);
//           // .toFile(`public/img/paintings/${filename}`);

//         req.body.decoImages.push(filename);
//       }),
//     );
//   }

//   // 3) Stage images
//   if (req.files.stageImages) {
//     req.body.stageImages = [];

//     await Promise.all(
//       req.files.stageImages.map(async (file, i) => {
//         // const filename = `painting-${paintingId}--stage-${i + 1}.jpeg`;
//         const filename = `painting-${paintingId}--stage-${Date.now()}-${i + 1}.jpeg`;

//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 90 })
//           .toFile(`${paintingFolder}/${filename}`);
//           // .toFile(`public/img/paintings/${filename}`);

//         req.body.stageImages.push(filename);
//       }),
//     );
//   }

//   next();
// });











// exports.resizePaintingImages = catchAsync(async (req, res, next) => {
//   // console.log(req.files);

//   if (!req.files.image || !req.files.decoImages || !req.files.stageImages) return next();

//   // 1) Cover image
//   req.body.image = `painting-${req.params.id}--${Date.now()}--cover.jpeg`;

//   await sharp(req.files.image[0].buffer)
//     .resize(2000, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/paintings/${req.body.image}`);

//   // 2) decoImages
//   req.body.decoImages = [];

//   await Promise.all(
//     req.files.decoImages.map(async (file, i) => {
//       const filename = `painting-${req.params.id}--${Date.now()}-${i + 1}.jpeg`;

//       // await sharp(req.files.image[0].buffer)
//       await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/paintings/${filename}`);

//       req.body.decoImages.push(filename);
//     }),
//   );

//   // 3) stageImages
//   req.body.stageImages = [];

//   if (req.files.stageImages) {
//     await Promise.all(
//       req.files.stageImages.map(async (file, i) => {
//         const filename = `painting-${req.params.id}-${Date.now()}-stage-${i + 1}.jpeg`;

//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 90 })
//           .toFile(`public/img/paintings/${filename}`);

//         req.body.stageImages.push(filename);
//       }),
//     );
//   }

//   next();
// });



// // to find all bids of a painting 
// const bids = await Bid.find({
//   painting: paintingId,
// }).populate("user");


// // to find the last bid
// const bid = await Bid.findOne({
//     painting: paintingId
// }).sort('-createdAt');
