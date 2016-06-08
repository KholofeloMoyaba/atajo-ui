/*
 * We don't document the auiPopover directive, we instead document
 * the $atajoUiPopover service
 */
AtajoUiModule
.directive('auiPopover', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: [function() {}],
    template: '<div class="popover-backdrop">' +
                '<div class="popover-wrapper" ng-transclude></div>' +
              '</div>'
  };
}]);
