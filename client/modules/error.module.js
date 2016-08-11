/**
 * error.directive.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('errorHandler', [])
    .directive('showErrors', showErrors);

  // name and ng-model should have the same name
  function showErrors() {

    var directive = {
      restrict: 'A',
      require:  '^form',
      link: link
    };

    return directive;

    function link(scope, el, attrs, formCtrl) {
      // find the text box element, which has the 'name' attribute
      var inputEl   = el[0].querySelector("[name]");
      // convert the native text box element to an angular element
      var inputNgEl = angular.element(inputEl);
      // get the name on the text box so we know the property to check
      // on the form controller
      var inputName = inputNgEl.attr('name');
      // only apply the has-error class after the user leaves the text box
      inputNgEl.bind('blur', function() {
        el.toggleClass('has-error', formCtrl[inputName].$invalid);
      })

      scope.$on('show-errors-check-validity', function() {
        el.toggleClass('has-error', formCtrl[inputName].$invalid);
      });

      scope.$on('show-errors-reset', function() {
        $timeout(function() {
          el.removeClass('has-error');
        }, 0, false);
      });
    }

  }


})();
