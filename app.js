/**
 * app.js
 * main application file
 *
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');

const myVar = 'MY_VAR';


var http = require('http');
var fs = require('fs');

var app = express();

// Get config file
var config = require('./env.json')[app.get('env')];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Set config in app
app.set('config', config);
app.use(function (req, res, next) {

  // Assign the config to the req object
  req.config = config;

  // Call the next function in the pipeline (your controller actions).
  return next();

});
app.use(favicon());

// Log every request to the console
 app.use(logger('dev'));
 if(config.writeLog === true){
    // Create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
    // setup the logger: show on console  and write into the file at the same time
    app.use(logger({format:"[:date[clf]] :method :url :status :response-time ms",stream: {
        write: function(str)
        {
            accessLogStream.write(str);
        }
    }}));
 }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// passport config
require('./server/config/passport')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

///////////////////////////////
// Routes                    //
///////////////////////////////


// routes for json API + serving index and view partials
require('./server/routes')(app);

////////////////////////
/// Connect mongoose //
///////////////////////
mongoose.connect(config.local, function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  } else {
    console.log('connection successful');
  }

});

// Uncomment what/when is needed
mongoose.set('debug', function (collectionName, method, query, doc, options) {
  // console.log(__filename + ' mongoose DEBUG: ' );
  // console.log(collectionName);
  // console.log(query);
  // console.log(method);
  // console.log(options);
  // console.log(doc);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
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
