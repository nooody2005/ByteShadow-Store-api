const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv.config();
const { exit } = require('process');
// dotenv.config({ path: './config.env' });

dotenv.config({ path: './../../config.env' });


const Painting = require('./../../models/paintingModel');
// const User = require('./../../models/userModel');
// const Review = require('./../../models/reviewModel');

// const DB = 'mongodb://127.0.0.1:27017/paintings';
const DB = process.env.DATABASE_LOCAL;


console.log(DB);
mongoose
.connect(DB)
.then(() => console.log('DB connection successful'))
.catch(err => console.log('DB connection error:', err));

//Read file
const paintings =JSON.parse(fs.readFileSync(`${__dirname}/paintings.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));


const importData = async() => {
  
  try{
    await Painting.create(paintings);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    
    console.log('created successfully :)');
  }catch(err) {
    console.log(err);
  }
  process.exit();
};

//delete all

const deleteData = async() => {
  try{
    await Painting.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('deleted successfully :)');
  }catch(err) {
    console.log(err);
  }
  process.exit();
}
if (process.argv[2] === '--import'){
  importData();
} else if (process.argv[2] === '--delete'){
  deleteData();
}
console.log(process.argv);





//=================================== For the last that before downloading the local mongoose db ================================================

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// const DB = process.env.DATABASE;

// mongoose.connect(DB, {
  //   useNewUrlParser: true,
  // })
// .then(() => console.log('DB connection successful'))
// .catch(err => console.log('DB connection error:', err));

// const DB = process.env.DATABASE;