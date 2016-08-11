/**
 * users.directive.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .directive('equalTo', equalTo)
    .directive("authUsername", username)
    .directive("authEmail", checkEmail)
    .directive("changePassword", changePassword)

  function changePassword() {
    var directive = {
      restrict: 'E',
      templateUrl: 'users/change-password',
    };

    return directive;
  }

  function equalTo(){
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        // Check if attribute exists
        if (!attrs.equalTo) {
          return;
        }
        scope.$watch(attrs.equalTo, function (value) {
          if( value === ctrl.$viewValue && value !== undefined) {
           ctrl.$setValidity('equalTo', true);
           ctrl.$setValidity("parse",false);
         }
         else {
           ctrl.$setValidity('equalTo', false);
         }
       });
        ctrl.$parsers.push(function (value) {
          var isValid = value === scope.$eval(attrs.equalTo);
          ctrl.$setValidity('equalTo', isValid);
          return isValid ? value : false;
        });
      }
    };
  }
  function username(UsersService) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        elem.bind('blur', function (e) {
          if (!ngModel || !elem.val()) return;

          var modelValue = elem.val();
          var id = attrs.userId;

          UsersService.unique('username', modelValue, id)
          .then(function(data){
            ngModel.$setValidity('usernameExists', data);
          })
          .catch(function (fallback) {
            ngModel.$setValidity('usernameExists', false);
          });
        });
      }
    };
  }

  function checkEmail(UsersService) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {

        elem.bind('blur', function (e) {
          if (!ngModel || !elem.val()) return;

          var modelValue = elem.val();
          var id = attrs.userId;

          UsersService.unique('email', modelValue, id)
          .then(function(data){
            ngModel.$setValidity('emailExists', data);
          })
          .catch(function (fallback) {
              ngModel.$setValidity('emailExists', false);
            });
        });
      }
    };
  }


})();

