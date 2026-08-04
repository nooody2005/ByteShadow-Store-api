// const multer = require('multer');
// const sharp = require('sharp');
// const User = require('./../models/userModel');
// // const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const { all } = require('../app');
// const handleFactory = require('./../controllers/handleFactory');

// // const multerStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'public/img/users');
// //   },
// //   filename: (req, file, cb) => {
// //     const ext = file.mimetype.split('/')[1];
// //     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
// //   }
// // });

// const multerStorage = multer.memoryStorage(); //image will store as buffer to make edits on it like resizing it before saving it in db 
// const multerFile = (req, file , cb) => {
//   if(file.mimetype.startsWith('image')){
//     cb(null,true);
//   } else {
//     cb(new AppError('Not an image! please upload only images:)',400),false);
//   }
// };

// const upload = multer({ 
//   storage: multerStorage,
//   fileFilter: multerFile
// });

// exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = catchAsync(async(req, res , next) => {
//   if(!req.file)   return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`);

//   next();

// });

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // console.log(req.file);
//   // console.log(req.body);

//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         'THis route is not for password updates... please use / updateMy password :)',
//         400
//       )
//     );
//   }

//   // 2) filtered out unwanted fields that are not allowed to be updated    ...cuz for examble can't update your role if you are just user and wanna be an admin :)

//   const filterdBody = filterObj(req.body, 'name', 'email');
//   if(req.file)  filterdBody.photo = req.file.filename;

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
//     new: true,
//     runValidators: true
//   });

//   // const user = await User.findById(req.user.id);
//   // user.name='Nada';
//   // await user.save();

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser
//     }
//   });
// });

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { active: false });

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

// //=========================================================
// exports.getAllUsers = handleFactory.getAll(User);
// exports.getUser = handleFactory.getOne(User);
// exports.createUser = handleFactory.createOne(User);
// exports.updateUser = handleFactory.updateOne(User);
// exports.deleteUser = handleFactory.deleteOne(User);
// //========================================================
