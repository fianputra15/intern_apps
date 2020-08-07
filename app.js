const createError = require('http-errors');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authRouter  = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const internRouter= require('./routes/intern');
const mentor      = require('./routes/mentor');
const spv         = require('./routes/spv');
const app = express();
const cors = require('cors');

// use it before all route definitions
app.use(cors({origin: '*'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(express.static('public'));
app.use(logger('dev'));
// app.use(multer);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);
app.use('/auth',authRouter);
app.use('/magang',internRouter);

process.env.SECRET_KET = 'secret';
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: "8mb",
}));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

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
