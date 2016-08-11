/**
 * users.controller.js
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .controller('logoutController', logoutController)
    .controller('UsersController', usersController)

  // Login Controller
  usersController.$inject = ['$location', '$routeParams', '$timeout', '$rootScope', 'UsersService', '$scope'];



  function usersController($location, $routeParams, $timeout, $rootScope, UsersService, $scope) {
    var vm = this;
    vm.master = {};

    // Init values
    vm.user = {
      username : '',
      password : '',
      email: ''
    }

    // Alerts
    vm.alerts = [];

    vm.addAlert = function(type, message) {
      vm.alerts.push({type: type, msg: message});
    };
    vm.closeAlert = function(index) {
      vm.alerts.splice(0);
    };

    // Display logged in user info
    if($location.path() === '/profile'){
      vm.changePassword = false;
      // console.log($location)
      // Get user's details
      UsersService.getUser($rootScope.userId)
      .then(function (data) {
        vm.user = data;
        vm.user.password = '';
      })
      // handle error
      .catch(function (fallback) {
        vm.addAlert('danger', fallback);
      });
    }
    // Reset password request
    if($location.path() === '/request'){
      vm.message = "Please enter your email and we will send you instructions";
    }

    // Activate account
    if($routeParams !== null && $routeParams.base64 !== null && $location.path() === '/activate/' + $routeParams.base64){
      vm.message = 'Processing ...';
      UsersService.activateAccount($routeParams.base64)
        // handle success
        .then(function () {
          vm.closeAlert();
          vm.message = '';
          vm.addAlert('success', 'Successfully activated. You can login now.');
          $timeout(function() {
            $location.path('/login');
          }, 3000);
        })
        // handle error
        .catch(function (fallback) {
          vm.message = '';
          vm.addAlert('danger', fallback);
          $timeout(function() {
            $location.path('/');
          }, 4000);
        });
    }
    if($routeParams !== null && $routeParams.base64 !== null && $location.path() === '/reset/' + $routeParams.base64){
      vm.resetShow = false;
      vm.message = 'Processing ...';
      console.log($routeParams.base64)
      UsersService.resetPassword($routeParams.base64)
        // handle success
        .then(function (data) {
          vm.closeAlert();
          vm.message = '';
          vm.user._id = data
          vm.resetShow = true;
        })
        // handle error
        .catch(function (fallback) {
          vm.message = '';
          vm.addAlert('danger', fallback);
          $timeout(function() {
            $location.path('/');
          }, 4000);
        });
    }

    vm.create = function(){
      UsersService.register(vm.user)
        .then(function () {
          vm.addAlert('success', 'Successfully registered');
          $timeout(function() {
            $location.path('/');
            }, 2000);
        })
        // handle error
        .catch(function (fallback) {
          vm.addAlert('danger', fallback);
        });
    };

    vm.login = function(){
      UsersService.login(vm.user.username, vm.user.password)
          .then(function () {
            vm.addAlert('success', 'Successfully logged in');
            $timeout(function() {
              $location.path('/profile');
              }, 2000);
          })
          .catch(function (fallback) {
            vm.addAlert('danger', fallback.message);
          });
    }

    vm.updatePassword = function(){
      UsersService.update(vm.user)
          .then(function () {
            vm.addAlert('success', 'Successfully updated');
            $timeout(function() {
                vm.changePassword = false;
              }, 2000);
          })
          .catch(function (fallback) {
            vm.addAlert('danger', fallback);
          });
    }
    vm.newPassword = function(){
      UsersService.update(vm.user)
          .then(function () {
            vm.addAlert('success', 'Successfully updated');
            $timeout(function() {
                $location.path('/login');
              }, 2000);
          })
          .catch(function (fallback) {
            vm.addAlert('danger', fallback);
          });
    }

    vm.requestReset = function(){
      vm.closeAlert();
      UsersService.requestReset(vm.user.email)
      .then(function (data) {
        vm.addAlert('success', 'The email was sent.');
        $timeout(function() {
          $location.path('/');
        }, 3000);
      })
      .catch(function (fallback) {
        vm.addAlert('danger', fallback);
      });
    }

    vm.resetPassword = function(){
      UsersService.resetPassword(vm.user)
          .then(function () {
            vm.addAlert('success', 'Successfully changed.');
            $timeout(function() {
              $location.path('/login');
              }, 2000);
          })
          .catch(function (fallback) {
            vm.addAlert('danger', fallback);
          });
    }
    // Remove user - confirm service added to views
    vm.remove = function(id){
      vm.closeAlert();
      UsersService.delete(id)
        .then(function(data){
          vm.addAlert('success', data);
          $timeout(function() {
            $location.path('/');
          }, 4000);
        })
       .catch(function (fallback) {
          vm.addAlert('danger', fallback);
        });
    }
  }

  // Logout Controller
  logoutController.$inject = ['$location', 'UsersService'];

  function logoutController($location, UsersService) {
      var vm = this;
      vm.logout = function () {
        // call logout from service
        UsersService.logout()
          .then(function () {
            $location.path('/');
          });
      };



  }

})();
