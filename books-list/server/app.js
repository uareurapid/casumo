var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var passport = require('passport'); //passport authentication
var session  = require('express-session');//express session
var cookieParser = require('cookie-parser');//read the cookies for auth
var flash    = require('connect-flash');
var db = require('./config/db');

//configurations for the json tokens
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config/config');
app.set('superSecret', config.secret); // secret variable

mongoose.connect(db.url);

// use morgan to log requests to the console
app.use(morgan('dev'));

//serve js,css and images from public folder
app.use(express.static('public'));

//TODO check this good example: https://github.com/Foxandxss/sails-angular-jwt-example

//EJS tutorial
//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
// use body parser so we can get info from POST and/or URL parameters
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)

//app.use(bodyParser()); // get information from html forms
//app.set('view engine', 'ejs'); // set up ejs for templating

require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//==============================================================================
// Configure normal routes (un-protected)
//======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//Authentication stuff
//https://scotch.io/courses/easy-node-authentication
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local


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

  //console.log("reached middleware section, just hit next()");

  next();

  /*console.log("checking tokens and all that stuff");
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.cookies.token;

  console.log("ROUTER: request headers: " + JSON.stringify(req.headers));

  //TODO send the token and Authorization Bearer token
  //instead of x-access-token
  //check the headers
  if(!token) {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0],
            credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      }
      else {
        console.log("RESPONSE: 'Format is Authorization: Bearer [token]'");
        return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
      }
    }
    else {
      console.log("RESPONSE: 'No Authorization header was found'");
      return res.json(401, {err: 'No Authorization header was found'});
    }
  }

  // decode token
  if (token) {

    console.log("i have the token: " + token);
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        var payload = JSON.parse(JSON.stringify(decoded));
        console.log("Decoded token username payload: " + payload.local.email); // the username, this is EUREKA!!!!
        req.owner = payload.local.email;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }*/
});
//TODO CHECK THIS FOR ADDING A TOUR: http://linkedin.github.io/hopscotch/#general-usage

//============================================================
// Configure authenticated routes
//============================================================
require('./config/api.js')(apiRouter);

//TODO authenticate API REQUESTS
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

//TODO check https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

/*
apiRouter.use('xpto',function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  next();
});*/

console.log("will execute booksListDummyData now... wish me luck!!!!");
var booksListDummyData = require('./config/initialBooksData');
//insert the records
booksListDummyData();
// set our port
var port = process.env.PORT || 8080;
// START THE SERVER
// =============================================================================
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);


});

//https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local