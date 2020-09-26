var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session); // exports a function to switch we need to pass a session

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('mongodb://mongodb5062mc:ke3qyp@danu7.it.nuigalway.ie:8717/mongodb5062', { useNewUrlParser: true, useUnifiedTopology: true});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());// order is important, goes after the body has been parsed
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 } //  180 minutes
})); //enable sessions
app.use(flash()); // uses sessions so has to be after
app.use(passport.initialize());
app.use(passport.session()); // also has to be after session
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated(); // creating global variable called login which is available in all views
  res.locals.session = req.session; // access session variable in all views
  next(); // to let request continue
});

app.use('/user', userRoutes);
app.use('/', indexRouter);

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
