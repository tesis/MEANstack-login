/**
 * routes.js
 */

'use strict';

var api = require('../api');
var users = require('../api/users');
var pages = require('../api/pages');


// Manage routes

module.exports = function (app) {

  // Serve index and view partials
  app.get('/', pages.index);
  app.get('/partials/:name', pages.partials);
  app.get('/users/:name', pages.users);
  app.get('/error', pages.error);

  //Users Lists
  app.get('/api/userList', users.userList);
  app.get('/api/userList/:id', users.getUser);

  // Auth
  app.get('/api/logout', users.logout);
  app.post('/api/signin', users.signin);
  app.post('/api/signup', users.signup);
  app.get('/api/checkUsernameAuth/:username', users.findUsername);
  app.get('/api/checkEmailAuth/:email', users.findEmail);
  app.put('/api/user/:id', users.update);

  app.get('/api/activate/:base64', users.activateAccount);
  app.get('/api/requestReset/:email', users.requestReset);
  app.get('/api/resetPassword/:base64', users.resetPassword);
  // TODO
  app.delete('/api/user/:id', users.delete);

  // At last redirect all others to the index (HTML5 history)
  app.get('*', pages.index);

};