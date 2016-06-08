/*
 * We don't document the auiModal directive, we instead document
 * the $atajoUiModal service
 */
AtajoUiModule
.directive('auiModal', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: [function() {}],
    template: '<div class="modal-backdrop">' +
                '<div class="modal-backdrop-bg"></div>' +
                '<div class="modal-wrapper" ng-transclude></div>' +
              '</div>'
  };
}]);
