const multer = require('multer');
const sharp = require('sharp');
const Painting = require('./../models/paintingModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controllers/handleFactory');


const multerStorage = multer.memoryStorage(); //image will store as buffer to make edits on it like resizing it before saving it in db
const multerFile = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
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
  // console.log(req.files);

  if (!req.files.image || !req.files.decoImages || !req.files.stageImages) return next();

  // 1) Cover image
  req.body.image = `painting-${req.params.id}--${Date.now()}--cover.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(2000, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/paintings/${req.body.image}`);

  // 2) decoImages
  req.body.decoImages = [];

  await Promise.all(
    req.files.decoImages.map(async (file, i) => {
      const filename = `painting-${req.params.id}--${Date.now()}-${i + 1}.jpeg`;

      // await sharp(req.files.image[0].buffer)
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/paintings/${filename}`);

      req.body.decoImages.push(filename);
    }),
  );

  // 3) stageImages
  req.body.stageImages = [];

  if (req.files.stageImages) {
    await Promise.all(
      req.files.stageImages.map(async (file, i) => {
        const filename = `painting-${req.params.id}-${Date.now()}-stage-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/paintings/${filename}`);

        req.body.stageImages.push(filename);
      }),
    );
  }

  next();
};);



// // to find all bids of a painting 
// const bids = await Bid.find({
//   painting: paintingId,
// }).populate("user");


// // to find the last bid
// const bid = await Bid.findOne({
//     painting: paintingId
// }).sort('-createdAt');





// //================================================================================
exports.getAllPaintings = handleFactory.getAll(Painting);
exports.getPainting = handleFactory.getOne(Painting, { path: 'reviews' });
exports.createPainting = handleFactory.createOne(Painting);
exports.updatePainting = handleFactory.updateOne(Painting);
exports.deletePainting = handleFactory.deleteOne(Painting);

// //================================================================================
