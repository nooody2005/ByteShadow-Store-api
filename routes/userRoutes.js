// const express = require('express');

// const userController = require('./../controllers/userController');
// const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
// const { route } = require('./tourRoutes');


// //define router
// const router = express.Router();

// // ==================================================== PUBLIC ==============================================
// router.post('/signup', authController.signup);
// router.post('/login', authController.login);

// router.post('/forgetPassword', authController.forgetPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);


// // ================================================== PROTECTED ==============================================
// router.get('/logout',authController.logout);

// router.use(authController.protect);   //the centeral middle ware for all the next routers // son no need yet to write it again

// router.patch(
//   '/updateMyPassword',
//   authController.updatePassword
// );

// router.get(
//   '/me',
//   userController.getMe,
//   userController.getUser
// );

// router.patch('/updateMe',userController.uploadUserPhoto,
//   userController.resizeUserPhoto,userController.updateMe);
// router.delete('/deleteMe',userController.deleteMe);


// // ============================================== ADMIN =========================================================
// router.use(authController.restrictTo('admin'));   //make this as a middle ware for all the next routers after it 

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

// module.exports = router;
