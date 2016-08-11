/**
 * interceptor.service.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .service('httpInterceptor', httpInterceptor)

  // Interceptor
  httpInterceptor.$inject = ['$q'];

  function httpInterceptor($q) {

    this.request = function(config) {
      // console.log(config);
      return config;
    }

   this.requestError = function(rejection) {
      return $q.reject(rejection);
    }

    this.response = function(response) {
      return response;
    }

   this.responseError = function(rejection) {
      return $q.reject(rejection);
    }
  }

})();




