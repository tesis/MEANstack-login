/**
 * confirm.module.js
 */

angular.module('myModal', ['ui.bootstrap.modal'])
  .controller('ModalInstanceCtrl', ModalInstanceCtrl)
  .directive('ngConfirmClick', ModalDirectiveClick)

  // Controller
  ModalInstanceCtrl.$inject = ['$uibModalInstance','items'];

  function ModalInstanceCtrl($uibModalInstance, items){
    var vm = this;
    vm.message = items.message;
    vm.title = items.title;
    vm.ok = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
  }
  // Directive
  ModalDirectiveClick.$inject = ['$uibModal'];

  function ModalDirectiveClick($uibModal) {

    return {
      restrict: 'A',
      scope: {
        ngConfirmClick:"&"
      },
      link: postLink
    }

    function postLink(scope, element, attrs) {
      element.bind('click', function() {
        var message = attrs.ngConfirmMessage || "Are you sure ?";
        var title = attrs.title || "Confirmation";
        var modalInstance = $uibModal.open({
          // public folder, ie: partials
          templateUrl: 'partials/confirm',
          controller: ModalInstanceCtrl,
          controllerAs: 'vm',
          resolve: {
            items: function() {
              return {
                title:title,
                message: message
              };
            }
          }
        });
        modalInstance.result.then(function () {
          scope.ngConfirmClick();
        }, function () {
          // console.log('cancelled')
        });
      });
    }
  }
