const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const { token } = require('morgan');
const { findById } = require('../models/paintingModel');
const { send } = require('process');
const { cookie, status } = require('express/lib/response');

const signToken = id => {
  //jwt.sign({payload},secret);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // secure: true,        // only https
      httpOnly: true      // can't be accessed or modified in any way by the browser .. recieve cookie and store it and then send it automatically along  wiht every request 
    };
    if(process.env.NODE_ENV === 'production')  cookieOptions.secure = true;


    res.cookie('jwt',token, cookieOptions);


    //remove the password from output
    user.password = undefined

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser,url).sendWelcome();

  createSendToken(newUser ,201 ,res);
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser
  //   }
  // });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) check if email & password already exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // 2) check if user exist & password correct
    const user = await User.findOne({ email }).select('+password');
    // const correct = await user.correctPassword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) check everything is okay then send token
    createSendToken(user, 200 , res);
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
 });


 exports.protect = catchAsync(async (req, res, next) => {
   // 1) getting token and check if its there
   let token;
   if (
     req.headers.authorization &&
     req.headers.authorization.startsWith('Bearer')
   ) {
     token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
     token = req.cookies.jwt;
   }
   console.log(token);

   if (!token) {
     return next(
       new AppError('you are not logged in ..PLease login to get access', 401)
     );
   }

   // 2) verificaton token
   // jwt.verify(token,process.env.JWT_SECRET);
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   console.log(decoded);

   // 3) check if user still exists
   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
     return next(
       new AppError('the user belongs to this token no longer exist :)', 401)
     );
   }

   // 4) check if user changed password the jwt was issued
   if (currentUser.changePasswordAfter(decoded.iat)) {
     return next(
       new AppError('User recently changed password Please log in again', 401)
     );
   }

   //Grant access to protected route
   req.user = currentUser;
   res.locals.user = currentUser;

   next();
 });


// only for render pages
// exports.isLoggedIn = catchAsync(async (req, res, next) => {
  exports.isLoggedIn = async (req, res, next) => {      //we remove catchasync to can logout
    //  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout')

    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
        console.log(decoded);

        // 2) check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // 3) check if user changed password the jwt was issued
        if (currentUser.changePasswordAfter(decoded.iat)) {
          return next();
        }

        // 4) there is a logged in user  ---> make it accessable to a template
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };
  // });

exports.logout = (req,res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),  //make expire date now 
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};



exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles{admin,lead-guide}. role(user)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Sorry you do not have role & permissions to get access',
          403
        )
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async(req,res,next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new AppError('sorry there is no user with this email address :)',404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false});

    // 3) send it to user's email
    
    // const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
    try{
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
      
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Your password reset token (valid for 10 min',
      //   message
      // });
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
      });

    }
    catch(err){
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false});

     return next(
       new AppError(
         'There was an error sending the email. Try again later!',
         500
       )
     );
    }



});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken: hashedToken ,passwordResetExpires: { $gt: Date.now() } });


  // 2) If token has not expired, and there is user , set the new password

  if(!user){
    return next(new AppError('Token is invalid or has expired',400))
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;   //delete reset token ..cuz hasn't need it yet
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user 


  // 4) Log the user in, send JWT     //if every thing is ok ---> sign in 
  createSendToken(user, 200 ,res);
  // const token = signToken(user._id);

  //   res.status(200).json({
  //       status: 'success',
  //       token
  //   });
});


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if Posted current password is correct
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    return next (new AppError('your currrent passowrd is wrong',401));
  }


  // 3) If so , update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will not work as intended!


  // 4) Log user in , send JWT

  createSendToken(user, 200 , res);
      //   const token = signToken(user._id);

      // res.status(200).json({
      //   status: 'success',
      //   token
      // });

});