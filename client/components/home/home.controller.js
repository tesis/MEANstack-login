/**
 * controller.js
 *
 * skeleton for controller wrapped
 * in an Immediately Invoked Function Expression (IIFE)
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .controller('MainController',mainController)
    .controller('AboutController', aboutController)
    .controller('ContactController',contactController)


  function mainController() {
    var vm = this;
    vm.message = 'This is home page';
    vm.title = "MEANstack login system";
    vm.page = "home";
  }

  function aboutController() {
    var vm = this;

    vm.message = 'All about us';
    vm.title = 'About Us';
    vm.page = "about";
  }

  function contactController() {
    var vm = this;

    vm.message = 'Contact Us page';
    vm.title = 'Contact Us'
    vm.page = "contact";

  }


})();

