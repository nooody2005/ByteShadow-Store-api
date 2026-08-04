const { status } = require('express/lib/response');
const AppError = require('./../utils/appError');
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`; 
    return new AppError(message,400);
}
const handleDublicateErrorDB =(err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];  // in old versions
    const value = err.keyValue.name;
    const message = `dublicate field name: ${value}..please use another value :)`;
    return new AppError(message,400);
}
const handleMongooseValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);  //array of messages thats exist in errors in err

    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message,400);
}
const handleJsonWebTokenError = () => {
    return new AppError('Invalid Token Please enter valid token :)', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('Expired Token Please enter valid token',401);
}

const sendErrorDev = (err, req, res) => {
    //API
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // Rendered website
     console.log('errrrrror', err);
    return res.status(err.statusCode).render('error' , {   // go to error.pug page 
        title : 'something went wrong (::: ' ,
        msg: err.message   
    });
    
};

const sendErrorProd = (err, req, res) => {
    // API
    if(req.originalUrl.startsWith('/api')){

        //Operational, trusted error:send message to client
        if(err.isOperational){
    
            return res.status(err.statusCode).json({  
                status: err.status,
                message: err.message 
        });
    }
    
        //Programming or other unknown error: don't leak error details
        console.log('errrrrror',err);

        //send generic message   500 ---> maybe bug :(
        return res.status(500).json({
          status: 'error',
          message: 'Something went very wrong (:'
        });
        
    }
    // for rendered website
    if(err.isOperational){

          return res.status(err.statusCode).render('error' ,{
            title: 'Sonething went Wrong :)',
            msg: err.message
          });


        //Programming or other unknown error: don't leak error details
    }
    console.log('errrrrror',err);

    //send generic message   500 ---> maybe bug :(
    return res.status(err.statusCode).render('error', {
      title: 'Sonething went Wrong :)',
      msg: 'please try again later ^_^'
    });


};




module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,req,res);
  }else if (process.env.NODE_ENV === 'production'){
    let error = { ...err };
    error.message = err.message;   //we add this to copy important property
    error.name = err.name;
    // let error = err;

   if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError') error = handleMongooseValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }

};

