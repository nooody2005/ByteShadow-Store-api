const mongoose = require('mongoose');
const crypto = require('crypto');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt  = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name :)"],
    unique: true,
    trim: true,
    // maxlength: [40, 'name must be less than 40 characters'],
    // minlength: [10, 'name must be above 10 characters']
    // validate : [validator.isAlpha,'name should contains characters only :)']
  },
  role: {
    type: String,
    enum: ["admin", "lead-guide", "guide", "user"],
    default: "user",
  },
  email: {
    // type: email,
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    // type: photo
    type: String,
    default: "default.jpg",
  },
  password: {
    // type: password,
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "you must confirm your password"],
    validate: {
      // not defined when update
      //This only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same:)",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  lastLogin: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
});


userSchema.pre('save',async function(next){
    //only run if password is acually modefied
    if(!this.isModified('password'))    return next();

    //Hash the password with const of 12
    this.password = await bcrypt.hash(this.password,12);

    //no need to confirm pass if validation wan successful 
    this.passwordConfirm = undefined;


    this.passwordChangedAt = Date.now();

    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;   //small hack :)
    next();
});

userSchema.pre(/^find/, function(next){
  //this points to current query
  this.find({active: {$ne: false} }); //not equal false
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword , userPassword) {
    return await bcrypt.compare(candidatePassword , userPassword);
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if(this.passwordChangedAt){
      const changedTimestamp =parseInt( this.passwordChangedAt.getTime()/1000 , 10);
      console.log(this.passwordChangedAt , JWTTimestamp);

      return JWTTimestamp < changedTimestamp;
    }

  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  console.log(resetToken);

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // give 10 minutes for session

  return resetToken;
};




// const User = mongoose.model('User',userSchema);

// module.exports = User;

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
