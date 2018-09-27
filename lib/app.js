var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var routesFront = require('./routes/frontend');
var routesApi = require('./routes/api');
var db = require('./DBhandler');
var cfg = require('../config');

var app = express();

// Init mysql connection
db.connect();

// harden server by sending certain headers
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.year = cfg.year;
app.locals.dateBegin = new Date(cfg.dates.begin);
app.locals.dateEnd = new Date(cfg.dates.end);

app.use(bodyParser.urlencoded({ extended: false }));

// development request logger
if (app.get('env') === 'development') {
  app.use((req, res, next) => {
    console.log(
      req.header('authorization') || 'no auth header',
      req.ip, req.url, req.body
    );
    next();
  });
}

// All Routes
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', routesFront);
app.use('/api', routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
