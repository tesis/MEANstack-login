/**
 * users.js
 *
 * handling user accounts (users with privilege to log in)
 * https://github.com/auth0/node-jsonwebtoken
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');
// bcrypt cost
var saltRounds = 10;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../env.json')[process.env.NODE_ENV];

// Custom email validation
function validateEmail(email) {
  return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}

// Add schema
var UsersSchema = new Schema({
    username: {
      type: String,
      unique: true,
      sparse: true  ,
      required: true,
      trim: true,
      default:'',
    },
    password: {
      type: String,
      default:'',
    },
    hash: {
      type: String,
      default:'',
    },
    salt: {
      type: String,
      default:'',
    },
    fname: {
      type: String,
      trim: true,
      default:'',
    },
    lname: {
      type: String,
      trim: true,
      default:'',
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
      trim: true,
      default:'',
      validate: [validateEmail, 'Email should be valid']
    },
    phone: {
      type:String,
      trim: true,
      default:'',
    },
    role: {
      type: Number,
      default: 3 // 1 = admin, 2 = moderator, 3 = user
    },
    activated: {
      type: Number,
      default: 0 // 0 = not activated, 1 = activated
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }

});

UsersSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

UsersSchema.methods = {
  generateJWT: function() {

    // Set expiration to 1 day
    var exp = Math.floor(Date.now() / 1000) + 7200; //2h

    // Both the server and client will have access to the payload
    return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: exp,
    }, config.secret);
  },
  // Generate new hash when new password is created
  generateHash: function(password) {
    var salt = bcrypt.genSaltSync(saltRounds);

    this.hash = bcrypt.hashSync(password, salt);
    this.salt = salt;
    // console.log(password)
    // console.log(bcrypt.compareSync(password, this.hash))
    return this;
  },
  // Validate password - when new password is created or on login
  validatePassword: function(password) {
    return bcrypt.compareSync(password, this.hash);
  },

}

module.exports = mongoose.model('Users', UsersSchema, 'users');