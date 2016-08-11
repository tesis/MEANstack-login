/**
 * users.service.js
 *
 * authorization service with interceptors
 * CRUD for users
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .service('UsersService', usersService)

  // usersService
  usersService.$inject = ['$q', '$http', '$window', '$rootScope'];

  function usersService($q, $http, $window, $rootScope) {
    var srv = this;

    srv.token = 'cms-token';

    srv.endpointUser = '/api/user'
    srv.endpointSignin = '/api/signin';
    srv.endpointSignup = '/api/signup';
    srv.endpointActivate = '/api/activate';
    srv.endpointSignout = '/api/logout';
    srv.endpointEmailUnique = '/api/checkEmailAuth';
    srv.endpointUsernameUnique = '/api/checkUsernameAuth';
    srv.endpointRequestReset = '/api/requestReset';
    srv.endpointResetPassword = '/api/resetPassword';

    srv.endpoint = '/api/userList';

    srv.msg = {
      instance: "User ",
      instances: "Users ",
      notFound: " not found ",
      notUpdated: " not updated ",
      notSaved: "  not saved ",
      notDeleted: " not deleted ",
      saved: "  successfully saved ",
      updated: "  successfully updated ",
      deleted: "  successfully deleted ",
      empty: " List is empty ",
      generalErr: " An error occurred ",
      userExists: "User already exists!",
      errNotLoggedOut: "Not logged out. Please try again or contact administrator",
      notActivated: " not activated ",
      activated: " activated ",
      errGeneral: "An error occurred",
    }
    srv.userListArr = [];
    // array list is list of objects, cannot use array.length
    srv.userListArrLen = 0;


    srv.isLoggedIn = function(){
      var token = getToken();
      if(token && token !== 'undefined'){
        // error - if login or register failed:
        var payload = parseJwt(token);

        return payload.exp > Math.round(Date.now() / 1000);
      }
      else {
        return false;
      }
    }

    srv.currentUser = function(){
      if(this.isLoggedIn()){
        var token = getToken();
        var payload = parseJwt(token);

        return payload;
      }
    }

    // Login
    srv.login = function (username, password) {

      // A new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post(srv.endpointSignin,
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 ){
            if(data.valid){
              saveToken(data.token);
              deferred.resolve();
            }
            else{
              deferred.reject(data.fallback);
            }
          }
        })
        // handle error
        .error(function (fallback) {
          // deferred.reject - with or without reason
          deferred.reject(fallback);
          $window.localStorage.removeItem(srv.token);
        });

      // return promise object
      return deferred.promise;

    }

    // Register
    srv.register = function(obj) {

      var deferred = $q.defer();

      $http.post(srv.endpointSignup, obj)
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.userExists);
          }
        })
        .error(function (fallback) {
          deferred.reject(fallback);
        });

      return deferred.promise;

    }

    // Activate account (from email)
    srv.activateAccount = function(base64) {
      var deferred = $q.defer();

      $http.get(srv.endpointActivate + '/' + base64)
        .success(function (data, status) {
          if(status === 200){
            console.log(srv.msg.instance + srv.msg.activated)
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.instance + srv.msg.notActivated);
          }
        })
        .error(function (fallback) {
          deferred.reject(fallback);
        });

      return deferred.promise;

    }

    // Request reset password
    srv.requestReset = function(email) {
      var deferred = $q.defer();

      $http.get(srv.endpointRequestReset + '/' + escape(email))
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.errGeneral);
          }
        })
        .error(function (fallback) {
          deferred.reject(fallback);
        });

      return deferred.promise;

    }

    // Reset password
    srv.resetPassword = function(base64) {

      var deferred = $q.defer();

      $http.get(srv.endpointResetPassword + '/'  + base64)
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.errGeneral);
          }
        })
        .error(function (fallback) {
          deferred.reject(fallback);
        });

      return deferred.promise;
    }

    // Update
    srv.update = function(obj) {

      var deferred = $q.defer();

      $http.put(srv.endpointUser + '/'  + obj._id, obj)
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.notSaved);
          }
        })
        .error(function (fallback) {
          // console.log(fallback)
          deferred.reject(fallback);
        });

      return deferred.promise;
    }

    // Delete
    srv.delete = function(id){
      var deferred = $q.defer();
      $http.delete(srv.endpointUser + '/' + id)
        .success(function (data, status) {
          if(status === 200){
            $window.localStorage.removeItem(srv.token);
            $rootScope.username = null;
            $rootScope.userId = null;
            $rootScope.loggedIn = false;
            $window.localStorage.clear();
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.notDeleted);
          }
        })
        .error(function (fallback) {
          deferred.reject(fallback);
        });

      return deferred.promise;
    }

    // Logout
    srv.logout = function() {

      var deferred = $q.defer();

      $http.get(srv.endpointSignout)
        .success(function (data) {
          $window.localStorage.removeItem(srv.token);
          $rootScope.username = null;
          $rootScope.userId = null;
          $rootScope.loggedIn = false;
          $window.localStorage.clear();
          deferred.resolve();
        })
        .error(function (data) {
          deferred.reject(srv.msg.errNotLoggedOut);
        });

      return deferred.promise;

    }

    srv.unique = function(field, value, id){
      if (!id) id = 0;
      var def = $q.defer();
      var endpoint;

      if(field === 'email'){
        endpoint = srv.endpointEmailUnique;
      }
      if(field === 'username'){
        endpoint = srv.endpointUsernameUnique;
      }

      $http.get(endpoint + '/' + escape(value))
        // handle success
        .success(function (data, status) {
          if(status === 200 && data !== null){
            def.reject(srv.msg.userExists );
          }
          else {
            def.resolve(field + ' valid ');
          }
        })
        // handle error
        .error(function (fallback) {
          if(fallback === undefined || fallback === ''){
            fallback = field + '-error';
          }
          // deferred.reject - with or without reason
          def.resolve(fallback);
        });

      return def.promise;
    }

    srv.userList = function(){
      var deferred = $q.defer();
      $http.get(srv.endpoint)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            srv.userListArr = srv.toArray(data);
            deferred.resolve(data);
          }
          else {
            deferred.reject(srv.msg.instances + srv.msg.notFound);
          }
        })
        // handle error
        .error(function (fallback) {
          // deferred.reject - with or without reason
          deferred.reject(srv.msg.generalErr);
        });

      // return promise object
      return deferred.promise;
    }

    srv.toArray = function(data){
      if(srv.userListArrLen > 0){
        console.log('cached res')
        return srv.userListArr;
      }
      else{
        var list = [];
        for(var i=0; i < data.length; i++){
          list[data[i]._id] = data[i].username;
          srv.userListArrLen = i;
        }
        return list;
      }
    }

    srv.getUser = function(userId){
        var deferred = $q.defer();
        $http.get(srv.endpoint + '/' + userId)
          .success(function (data, status) {
            if(status === 200){
              deferred.resolve(data);
            }
            else {
              deferred.reject(srv.msg.instance + srv.msg.notFound + userId);
            }
          })
          .error(function (fallback) {
            deferred.reject(srv.msg.instance + srv.msg.notFound + userId);
          });

        return deferred.promise;
    }

    // Helper functions
    function getToken(){
      return $window.localStorage[srv.token];
    }
    function saveToken(token){
      $window.localStorage[srv.token] = token;
    }
    function parseJwt(token) {
      token = token.split('.')[1];
      token = token.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(token));
    }
  }

})();




