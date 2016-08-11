/**
 * util/email.js
 *
 * sending emails with nodemailer
 * https://github.com/nodemailer/nodemailer
 *
 * TODO: check FROM/To (configured for dev env)
 * self.transporter is using inline data,
 * self.trasporterCustom is usign templates
 *
 * templates should be placed in views/emailTemplates
 * subfolder is the name related to email action (register, login, ...)
 * the file in the subfolder should be named html.jade, text.jade,
 *  subject.jade,
 * or with other extension intead of .jade (.html, etc)
 */

'use strict';


// Send email
var nodemailer = require('nodemailer');


process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../env.json')[process.env.NODE_ENV];

// emailFrom and emailFromName - project related email/name
// EMAIL function

// Data should have email address to, from, message

function EmailObj(){
  var self = this;
  self.config = {
    host: config.emailHost,
      port: config.emailPort,
      secure: 'SSL', // use SSL
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
  },

  self.emailFrom = config.emailFrom,
  self.emailFromName = config.emailFromName,
  self.emailAdmin = config.emailAdmin,
  self.fromName = '"' + config.emailFromName + '"' + '<' + config.emailFrom + '>',

  self.transporter = function(mailData){
    var transporter = nodemailer.createTransport(self.config);

    transporter.sendMail(mailData, function(error, info) {
      if(error) {
        console.log('Message not sent');
        console.log(info);
        return false;
      }
      else{
        console.log('Message sent: ' + info.response);
        console.log(info);
        return true;
      };
    });
  },

  self.transporterTemplate = function(mailData, subDir){
    var path = require('path');
    // var EmailTemplate = require('email-templates').EmailTemplate;
    var transporter = nodemailer.createTransport(self.config);

    var templateDir = path.join(__dirname, '../../views/emailTemplates', subDir);

    //--------- v4 using jade
    var jade = require('jade');
    var transporter = nodemailer.createTransport(self.config);

    var header = config.emailFromName;
    var link = mailData.link;

    var html = jade.renderFile(templateDir+'/html.jade', {header: header, link:link});

    var options = {
        from: self.emailAdmin,
        to: mailData.to,
        // to: self.emailAdmin,
        subject: mailData.subject,
        html: html
    };

    transporter.sendMail(options, callback);
    function callback(error, info) {
      if(error) {
        console.log('Message not sent');
        console.log(info);
        return false;
      }
      else{
        console.log('Message sent: ' + info.response);
        console.log(info);
        return true;
      };
    }

  },

  self.newTask = function (data) {

    var subject = self.emailFromName + ": new task: " + data.subject;
    var plainText = 'Task description: ';
    plainText += data.message;
    var htmlText = '<h2>Task description: </h2>';
    htmlText += '<p>' + data.message + '</p>';

    var mailOptions = {
      // Sender address
      from: self.fromName,
      // List of receivers
      to: data.emailFrom,
      // to: data.toEmail,

      subject: subject,
      // Plaintext body
      text: plainText,
      // You can choose to send an HTML body instead
      html:htmlText
    }
    // console.log(mailOptions);
    self.transporter(mailOptions);
  },

  // Users
  self.newRegistrationToAdmin = function (data) {
    var mailOptions = {
      // Sender address
      from: self.fromName,
      // List of receivers
      to: self.emailAdmin,
      // Subject line
      subject: self.emailFromName + ' Registration ',
      // Plaintext body
      text: 'New user has been registered.',
      // You can choose to send an HTML body instead
      html: '<b>New user has been registered. ✔</b>' + '<p>' + data.user + '</p>',
    }

    self.transporter(mailOptions);
  },

  self.newRegistrationToUser = function (data) {
    var mailOptions = {
      // Sender address
      from: self.fromName,
      // List of receivers
      to: self.emailFrom,
      // to: data.toEmail,
      //
      // Subject line
      subject: self.emailFromName + ' Registration ',
      // Plaintext body
      text: 'Your registration was successful.',
      // You can choose to send an HTML body instead
      html: '<b>Your registration was successful. ✔</b>' + '<p> Your data: <br />' + data.username + '</p><p>Please activate your account by clicking on the link: <br />' + data.link
    }
    self.transporter(mailOptions);
  },

  self.activatedEmail = function (data) {
    var mailOptions = {
      // Sender address
      from: self.fromName,
      // List of receivers
      to: self.emailFrom,
      // to: data.toEmail,
      //
      // Subject line
      subject: self.emailFromName + ' Account is activated ',
      // Plaintext body
      text: 'Your account has been successfully activated.',
      // You can choose to send an HTML body instead
      html: '<b>Your account has been successfully activated. ✔</b>'
    }
    self.transporter(mailOptions);
  },

  // Send notification about updated password
  self.resetPaswordEmail = function (data) {
    var mailOptions = {
      // Sender address
      from: self.fromName,
      // List of receivers
      to: self.emailFrom,
      // to: data.toEmail,
      //
      // Subject line
      subject: self.emailFromName + ' Updated Password ',
      // Plaintext body
      text: 'Your password was successfully changed',
      // You can choose to send an HTML body instead
      html: '<b>Your password was successfully changed. ✔</b>'
    }

    self.transporter(mailOptions);
  },

  // send req email with link - set data.link
  self.reqPaswordEmail = function (data) {
    var mailData = {
      from: self.fromName,
      to: data.toEmail,
      link: data.link,
      subject: self.emailFromName + ' Reset Password ',
    }

    self.transporterTemplate(mailData, 'requestResetEmail');
  }


/*----------------- end obj ---------------------*/
}


module.exports = new EmailObj;