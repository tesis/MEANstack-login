/**
 * config.route.js
 */

(function() {
  'use strict';
  angular.module('app.dashboard', ['ngRoute']);
  angular
    .module('app.dashboard')
    .config(config)

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/CMS', {
        templateUrl: 'partials/cms',
        controller: 'DashboardController',
        controllerAs: 'cms',
        access: {restricted: true}
      })
  }

})();
