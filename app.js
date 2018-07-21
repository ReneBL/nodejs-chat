var express = require('express');
var path = require('path');
var config = require('./config/config');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require('./helpers/db');
var flash = require('connect-flash');

// Session storage
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Routes
var users = require('./routes/users');

// Auth manager
var authManager = require('./helpers/authenticationManager');

var app = express();

// Connect to MongoDB
db.configureConnection();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

// MongoDB session storage enabled
app.use(session({
  secret: config.secret,
  store: new MongoStore({ mongooseConnection: db.getConnection() })
}));
app.use(authManager.initialize());
app.use(authManager.session());

authManager.setup();

app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
