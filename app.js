const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// wrap mongoose around local MongoDB dev server
const {MONGO_URI, MONGO_USERNAME} = process.env;
const url = `${MONGO_URI}/${MONGO_USERNAME}`;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
connect.then(() => console.log(`Connected correctly to server ${url}`),
    err => console.log(err)
);

// route imports
const indexRouter = require('./routes/index');
const experienceRouter = require('./routes/experienceRoutes');
const locationRouter = require('./routes/locationRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

// call express class methods
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// morgan logger
// TODO: Look at process.env node environment vs "dev" vs "prod"
app.use(logger('dev'));

// parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// router routes
app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/experiences', experienceRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/locations', locationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
