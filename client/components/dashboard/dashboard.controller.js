/**
 * dashboard.controller.js
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .controller('DashboardController', dashboardController);

  dashboardController.$inject = [];

  function dashboardController(){
    var vm = this;
    vm.message = 'This is restrict area!';
    vm.page = "cms";


    init();

    // Display list of users and tasks for logged in user
    function init(){
      console.log('dashboard initialized');
    }
  }

})();
