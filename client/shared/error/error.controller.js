/**
 * error.controller.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .controller('ErrorController',errorController)


  // If route not found
  // if reload - display general error page
  function errorController() {
    var err = this;
    err.message = '404 - Page not found';
    err.title = "404";
    err.page = "error";
  }


})();

