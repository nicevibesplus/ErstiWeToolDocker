var path = require('path');
var express = require('express');
var cookieSession = require('cookie-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var routesFront = require('./routes/frontend');
var routesAdmin = require('./routes/admin');
var DBconstructor = require('./DBconstructor'); // DEBUG
var db = require('./DBhandler');
var app = express();

// Init DB connection
db.createConnectionPool('Please change me!');

// harden server by sending certain headers
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create Cookies
app.use(cookieSession({
  name: 'session',
  secret: Math.random().toString(36).substr(2,10)
}));

// All Routes
app.use('/', routesFront);
app.use('/admin', routesAdmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
