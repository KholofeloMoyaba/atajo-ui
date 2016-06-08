/**
 * @ngdoc directive
 * @name navTransition
 * @module atajoui
 * @restrict A
 *
 * @description
 * The transition type which the nav view transition should use when it animates.
 * Current, options are `ios`, `android`, and `none`. More options coming soon.
 *
 * @usage
 *
 * ```html
 * <a nav-transition="none" href="#/home">Home</a>
 * ```
 */
AtajoUiModule
.directive('navTransition', ['$atajoUiViewSwitcher', function($atajoUiViewSwitcher) {
  return {
    restrict: 'A',
    priority: 1000,
    link: function($scope, $element, $attr) {
      $element.bind('click', function() {
        $atajoUiViewSwitcher.nextTransition($attr.navTransition);
      });
    }
  };
}]);
