var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)

var db = require('./config/db');

mongoose.connect(db.url);

// use morgan to log requests to the console
app.use(morgan('dev'));

//serve js,css and images from public folder
app.use(express.static('public'));


//==============================================================================
// Configure normal routes (un-protected)
//======================================================================
require('./config/routes.js')(app); // load our routes and pass in our app and fully configured passport


//============================================================================
// ---------------------------------------------------------
// get an instance of the apiRouter for api routes
// ---------------------------------------------------------
// ROUTES FOR OUR REST API
// =============================================================================
var apiRouter = express.Router();
// get an instance of the express Router

//-----------------------------------------------
// middleware to use for all requests
// route middleware to verify a token
//-----------------------------------------------
apiRouter.use(function(req, res, next) {

  //console.log("reached middleware section, nothing important to do here, just hit next()");
  next();


});

//============================================================
// Configure authenticated routes
//============================================================
require('./config/api.js')(apiRouter);

// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);


console.log("will execute booksListDummyData now... wish me luck!!!!");
var booksListDummyData = require('./config/initialBooksData');
//insert the records if they don´t exist yet
booksListDummyData();
// set our port
var port = process.env.PORT || 8080;
// START THE SERVER
// =============================================================================
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Casumo Books List Example app listening at http://%s:%s', host, port);


});
