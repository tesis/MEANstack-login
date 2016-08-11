(function() {
  'use strict';
  angular.module('app.users', ['ngRoute']);
  angular
    .module('app.users')
    .config(config)

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider

      .when('/login', {
        templateUrl: 'users/login',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: false}
      })
      .when('/logout', {
        controller: 'logoutController',
        controllerAs: 'logoutCtrl',
        access: {restricted: false}
      })
      .when('/register', {
        templateUrl: 'users/register',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: false}
      })
      .when('/request', {
        templateUrl: 'users/forgot',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: false}
      })
      .when('/activate/:base64', {
        templateUrl: 'users/index',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: false}
      })
      .when('/reset/:base64', {
        templateUrl: 'users/reset-password',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: false}
      })
      .when('/profile', {
        templateUrl: 'users/profile',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        access: {restricted: true}
      })
  }

})();


