/**
 * Created by paulocristo on 31/10/15.
 */

var ProfileController =  function(req,res) {

};


ProfileController.remoteLogin = function(req,res,next,passport){

    var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    var conf = require('../config/config');

    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if (!user) {
            return res.status(401).json({err: info});
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({err: 'Could not log in user'});
            }

            // if user is found and password is right
            // create a token
            var jsonToken = jwt.sign(user, conf.secret, {
                expiresInMinutes: 1440 // expires in 24 hours
            });

            console.log("request headers: " + JSON.stringify(req.headers));
            res.status(200).json(
                {   status: 'Login successful!',
                    email:user.local.email,
                    token:jsonToken,
                    expires: 1440
                });

        });
    })(req, res, next);
};

ProfileController.remoteSignup = function(req,res,next,passport){

        var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
        var conf = require('../config/config');
        var User = require('../models/user');
        //**********
        User.create({
            username: req.body.email,
            password: req.body.password
        }, function(err, account) {

            if (err) {
                return res.status(500).json({err: err});
            }

            //passport.authenticate('local')(req, res, function () {
            //    return res.status(200).json({status: 'Registration successful!'});
            //});
            passport.authenticate('local-login', function(err, user, info) {
                if (err) {
                    return res.status(500).json({err: err});
                }
                if (!user) {
                    return res.status(401).json({err: info});
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return res.status(500).json({err: 'Could not log in user'});
                    }

                    // if user is found and password is right
                    // create a token
                    var jsonToken = jwt.sign(user, conf.secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    console.log("request headers: " + JSON.stringify(req.headers));
                    res.status(200).json({status: 'Signup successful!',email:user.local.email,token:jsonToken});

                });
            })(req, res, next);
        });

};

ProfileController.generateUUID = function() {

      var uuid = require('node-uuid');
      return uuid.v4() ;

};

module.exports = ProfileController;