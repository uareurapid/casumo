/**
 * Created by paulocristo on 26/10/15.
 */

//routes that do not need token authentication

// app/routes.views
module.exports = function(app) {

    //have a reference to the profile controller
    /*var ProfileController = require('../controllers/profile.js');

    var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    var conf = require('./config');

    // show the home page
    app.get('/home', function(req, res) {
        if(req.isAuthenticated()) {
           console.log("received: "+req.user.local.email) ;
           res.sendfile('./views/home.html', {username: req.user.local.email }); // map/home page
           // load the single view file (angular will handle the page changes on the front-end)
        }
        else {
            //send him to login page
            res.render('login.ejs', { message: req.flash('loginMessage') });
        }
        
        
    });*/

    // =====================================
    // HOME PAGE (with books list js grid) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });




};

// route middleware to make sure a user is logged in
/*function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}*/