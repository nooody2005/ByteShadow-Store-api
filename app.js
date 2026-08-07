const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const methodOverride = require('method-override');


const paintingRouter = require('./routes/paintingRoutes');
const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRouter');
const { title } = require('process');

const app = express();

app.use(methodOverride('_method'));


app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//===========================================================================
// 1) GLOBAL MIDDLEWARES
//Serving Static files
app.use(express.static(path.join(__dirname,'public')));

//set Security HTTP headers
// app.use(helmet())
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", 'https://js.stripe.com'],
//         connectSrc: ["'self'", 'https://api.stripe.com'],
//         frameSrc: ['https://js.stripe.com', 'https://hooks.stripe.com']
//       }
//     }
//   })
// );

if (process.env.NODE_ENV === 'development') {
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
} else {
  app.use(helmet());
}

// DEvelopment Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,  //to allow 100 requests from the same IP in one hour 
  message: 'TOO many request from this IP, please try again in an hour'
});

app.use('/api',limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit : '10kb'}));    // limitting data sended via body
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injectoin
app.use(mongoSanitize());

// Data sanitization aganist XSS
app.use(xss());    // prevent attacks by converting all these HTML symbols

 // preventing Paramter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage','maxGroupSize','difficulty','price']
}));  



// app.use((req, res, next) => {
//   console.log('Hello from middleware :)');
//   next();
// });

//Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  
  
  next();
});


//========================================================================
// 2) HADLING ROUTES
//========================================================================
// moved in routes folder in paintingRouter.js & userRouter.js
//========================================================================
//3) ROUTES
//======================================================================


// app.use('/',viewRouter);
app.use('/api/v1/paintings', paintingRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews',reviewRouter);
// app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  //make object from class AppError in the file appError in utils folder  and send this error to it 
  next(new AppError(`can't find ${req.originalUrl} on this server :)`, 404));
});

app.use(globalErrorHandler);

//========================================================================
//4) START SERVER
//========================================================================
//moved in server.js
module.exports = app;
//========================================================================

