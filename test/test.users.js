// test.users.js
// make test
/*
tested list users, find user
 */
'use strict';

var should = require("should");
var mongoose = require('mongoose');
var users = require('../server/models/users');
var passport = require('passport');
var email = require('../server/util/email');
var bcrypt = require('bcrypt');
// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('~{ry*I)44==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
var db;
const saltRounds = 10;

describe('user crud', function() {

  before(function(done) {
    db = mongoose.connect('mongodb://localhost/localapp');
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  it('register new user, save salt, hash');

  it('update password when logged in - pass', function(){
    var oldPassword = 'tesi23';
    var password = 'tesi23';
    var id = '57a8c985958b7c02549bec0e';
    var conditions = {"_id": id};

    users.findById(id, function(err, doc) {
        if (err) {
          console.log('find user err')
          console.log(err)
          return err;
        }
        if(!doc){
          console.log('user not found')
          return false;
        }
        // console.log(doc)
        // Check if hash matches
        //
        if(doc.validatePassword(oldPassword)){
          console.log('pass ok')
          doc.generateHash(password);
          // console.log(doc)

          // update only salt, password and hash
          var update = {$set: {salt:doc.salt, hash: doc.hash, password:password}};
          var options = {new: true, upsert: true};
          users.update(conditions, update, options, function(err, doc) {
            if (err) {
              console.log('update error');
              return false;
            }
            console.log('password reset successful')
            return true;
          });
        }
        else{
          console.log('pass not ok')
          return false;
        }
      });

  });
  it('update  password when logged in - wrong old password failure', function(){
    var oldPassword = 'tesi231';
    var password = 'tesi23';
    var id = '57a8c985958b7c02549bec0e';
    var conditions = {"_id": id};

    users.findById(id, function(err, doc) {
        if (err) {
          console.log('find user err')
          console.log(err)
          return err;
        }
        if(!doc){
          console.log('user not found')
          return false;
        }
        // console.log(doc)
        // Check if hash matches
        //
        if(doc.validatePassword(oldPassword)){
          console.log('pass ok')
          doc.generateHash(password);
          // console.log(doc)

          // update only salt, password and hash
          var update = {$set: {salt:doc.salt, hash: doc.hash, password:password}};
          var options = {new: true, upsert: true};
          users.update(conditions, update, options, function(err, doc) {
            if (err) {
              console.log('update error');
              return false;
            }
            console.log('password reset successful')
            return true;
          });
        }
        else{
          console.log('pass not ok')
          return false;
        }
      });

  });
  it('password reset - update user password when NOT logged in');

  it('delete user account');

});



