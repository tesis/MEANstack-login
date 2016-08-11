/**
 * menu.directive.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .directive("menuWidget", menuDirective);

  function menuDirective() {
    var directive = {
      restrict: "E",
      templateUrl: "partials/nav",
      controller: "MenuController",
      controllerAs: "mCtrl"
    };

    return directive;
  }

})();

