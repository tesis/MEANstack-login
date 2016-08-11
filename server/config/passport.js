/**
 * config/passport.js
 * passport configuration file with custom local strategy
 */

'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var user = require('../models/users');

module.exports = function (app, passport) {
  app.use(passport.initialize());
  app.use(passport.session());

  // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      user.findById(id, function(err, user) {
        done(err, user);
      });
    });


    // Sign in
    // use named strategies in case others will be needed(fb, tw, ...)
    passport.use('local-signin', new LocalStrategy(
      function(username, password, done) {
        user.findOne({ 'username' :  username }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false)
          }
          if (!user.validatePassword(password)) {
            return done(null, false)
          }
          return done(null, user)
        })
      }
    ))

}