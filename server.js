const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION :( Shutting down...');

  process.exit(1);
});

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`running on the port ${port}`);
});

process.on('unhandledRejection',err => {
  
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION :( Shutting down...');
  server.close(() => {
    //we get the server time to finish all the requests
    process.exit(1);
  });
});


