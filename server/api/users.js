/**
 * api/users.js
 *
 * handling users and tasks
 */

'use strict';

var mongoose = require('mongoose');

// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('~{ry*I)44==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
var passport = require('passport');
var users = require('../models/users');
var Email = require('../util/email');

var UserObj = {
  // Logout
  logout: function(req, res) {
    req.logout();
    res.status(200).json({
      status: 'Logged out'
    });
  },

  // Login
  signin: function(req, res, next) {

    if(!req.body.username || !req.body.password) {
      return res.status(400).json({message: 'Please fill out all fields'});
    }
    var username = req.body.username;
    var password = req.body.password;

    passport.authenticate('local-signin', function (err, user, info) {
      if (err) {
        return res.status(401).json(err.message);
      }
      // if user, Log in with custom passport function
      req.logIn(user, function(err) {
        if (err) {
          return res.status(401).json({
            valid: false,
            message: 'User with these credentials does not exist'
          });
        }
        if(user.activated === 0){
          // missing return error: headers already sent !!!
          return res.status(401).json({
            valid: false,
            message: 'Account is not activated yet'
          });
        }
        res.status(200).json({
          valid: true,
          fallback: 'Login successful!',
          token: user.generateJWT()
        });

      });
    })(req, res, next);

  },

  // Registering new user
  signup: function(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.email){
      return res.status(400).json('Please fill out all fields');
    }
    // All required fields at least
    // otherwise the error: 'User validation failed'
    // Username and email already checked
    // Generate hash and save

    var newRecord = new users({ username : req.body.username, email: req.body.email, password: req.body.password});

    newRecord.generateHash(req.body.password);
    // console.log(hash)
    // newRecord.hash = hash;
    newRecord.save(function(err, doc){
      if (err) {
        return res.status(401).json('Please fill all the required fields');
      }
      // Send confirmation email -- make email for registration
      // data should have email,subject, message, check the func

      var data = { username: req.body.username, toEmail:req.body.email }
      Email.newRegistrationToAdmin(data);
      data.toEmail = doc.email;

      // Encrypt your data
      var payload = {
        id: doc._id,
        salt: doc.salt,
        date: new Date(),
        ip: req.ip,
      };
      var base64 = urlCrypt.cryptObj(payload);
      data.link = "http://localhost:3030/activate/" + base64;
      Email.newRegistrationToUser(data);

      // Send only unobtrusive data
      res.status(200).json(doc);
    });
  },

  // Update user
  update: function(req, res, next) {
    var id = req.params.id;
    var conditions = {"_id": id};

    if(req.body.password !== undefined || req.body.password !=='' ) {
      var password = req.body.password;

      users.findById(id, function(err, doc) {
        if (err) {
          return res.status(401).json(err.message);
        }
        if(!doc){
          return res.status(401).json('User not found');
        }
        if(req.body.oldPassword === undefined || req.body.oldPassword === '') {
          //console.info('oldPassword undefined - changing pass when user not logged in')
        }
        else{
          if(!doc.validatePassword(req.body.oldPassword)){
            return res.status(401).send('Wrong old password');
          }
        }
        doc.generateHash(password);

        // update only salt, password and hash
        var update = {$set: {password:req.body.password, hash: doc.hash, updated:Date.now()}};
        var options = {new: true, upsert: true};
        users.update(conditions, update, options, function(err, doc) {
          if (err) {
            return res.status(401).json(err.message);
          }
          // Send email notification
          var data = {
            toEmail: doc.email
          };
          Email.resetPaswordEmail(data);
          return res.status(200).json(doc);
        });

      });
      // Create hash and save the record
    }
    else{
      // update all other fields except password
      var update = {$set: { _id: id, username: req.body.username, phone: req.body.phone, email: req.body.email, fname: req.body.fname, lname: req.body.lname, updated:Date.now()}};
      var options = {new: true, upsert: true};
      users.findOneAndUpdate(conditions, update, options, function(err, doc) {
        if (err) {
          return res.status(401).json(err.message);
        }
        res.status(200).json(doc);
      });
    }

  },

  // Delete account (User)
  delete: function(req, res) {
    var id = req.params.id;
    users.findById(id, function(err, user) {
      if (err) {
        return res.status(401).json(err.message);
      }

      // delete the record
      user.remove(function(err) {
        if (err) {
          return res.status(401).json(err.message);
        }

        res.send('Record successfully deleted!');
      });
    });
  },

  // Find user by username
  findUsername: function(req, res) {
    var username = req.params.username;

    users.findOne({username: username}, function(err, docs) {
      if (err) {
        return res.status(401).json(err.message);
      }

      res.status(200).json(docs);
    });
  },

  // Find user by email
  findEmail: function(req, res) {
    var email = req.params.email;

    users.findOne({email: email}, function(err, docs) {
      if (err) {
        return res.status(401).json(err.message);
      }

      res.status(200).json(docs);
    });
  },

  // Activate account
  activateAccount: function(req, res){
    var payload;

    try {
      payload =  urlCrypt.decryptObj(req.params.base64);
      // Find record in database and if found, update activate
      users.findOne({_id: payload.id, salt: payload.salt}, function(err, docs) {
        if (err) {
          return res.status(401).json(err.message);
        }
        var conditions = {"_id": payload.id};
        var update = {$set: {activated: 1, updated:Date.now()}};
        var options = {new: true, upsert: true};
        users.findOneAndUpdate(conditions, update, options, function(err, doc) {
          if (err) {
            return res.status(401).json(err.message);
          }
          if(doc.activated === 0){
            // Send email notification if account has not been activated yet
            var data = {
              toEmail: doc.email
            };
            Email.activatedEmail(data);
          }
          res.status(200).json(doc);
        });
      });

    } catch(e) {
      // The link was mangled or tampered with.
      return res.status(400).send('Bad request.  Please check the link.');
    }
  },

  // Reset password
  // Process similar way as for activated email, and only then display the form
  resetPassword: function(req, res){
    var payload;

    try {
      payload =  urlCrypt.decryptObj(req.params.base64);
      // Find record in database and if found, update activate
      users.findOne({_id: payload.id, salt: payload.salt}, function(err, docs) {

        if (err) {
          return res.status(401).json(err.message);
        }

        if(!docs){
          return res.status(401).json('User not found');
        }
        return res.status(200).json(docs._id);

      });

    } catch(e) {
      // The link was mangled or tampered with.
      return res.status(400).send('Bad request.  Please check the link.');
    }
  },

  // Request reset password
  // Send similar link as for registration
  requestReset: function(req, res){
    var email = req.params.email;
    users.findOne({email: email}, { hash: 0, password: 0 }, function(err, doc) {
      if (err) {
        return res.status(401).json(err.message);
      }
      if(!doc){
        return res.status(400).send("User with this email does not exist.");
      }
      var payload = {
        id: doc._id,
        salt: doc.salt,
        date: new Date(),
        ip: req.ip,
      };
      var base64 = urlCrypt.cryptObj(payload);
      var link = "http://localhost:3030/reset/" + base64;

      var data = {
        toEmail: email,
        link: link,
        username:doc.username
      };
      Email.reqPaswordEmail(data);
      res.status(200).json(data);
    });
  },

  // Get list of users (only usernames)
  userList: function(req, res, next) {
    users.find({},{username:1}, function(err, docs) {
      if (err) {
        return res.status(401).json({
          err: err.message
        });
      }

      res.status(200).json(docs);
    }).sort({_id:-1});
  },

  // Get user by Id
  getUser: function(req, res) {
    var id = req.params.id;

    users.findById(id, { hash: 0, salt: 0, password: 0 }, function(err, docs) {
      if (err) {
        return res.status(401).json({
          err: err.message
        });
      }

      res.status(200).json(docs);
    });
  },
  /*--------------- end obj ----------*/
}

module.exports = UserObj;

