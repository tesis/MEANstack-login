/**
 * menu.controller.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .controller('MenuController', menuController)

  menuController.$inject = ['$location'];

  function menuController($location) {
    var vm = this;
    // Active link handler
    vm.menuClass = function(page) {
      var current = $location.path().substring(1);
      return page === current ? "active" : "";
    };
  }

})();

