var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');

var User = require('./models/User');

var app = express();

//database
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
});
mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost/fritter');

//route handlers
var index = require('./routes/index');
var users = require('./routes/users');
var freets = require('./routes/freets');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); // make public files accessible
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret : 'dankmemes', resave: false, saveUninitialized: false }));


// Authentication middleware
app.use(function(req, res, next) {
  if (req.session.username) {
    User.findByUsername(req.session.username, 
      function(err, user) {
        if (user) {
          req.currentUser = user;
        } else {
          req.currentUser = undefined;
          req.session.destroy();
        }
        next();
      });
  } else {
      next();
  }
});

// Map paths
app.use('/', index);
app.use('/users', users);
app.use('/freets', freets);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler, prints stacktraces
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler, hides stacktraces
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;