/**
 * @ngdoc directive
 * @name menuToggle
 * @module atajoui
 * @restrict AC
 *
 * @description
 * Toggle a side menu on the given side.
 *
 * @usage
 * Below is an example of a link within a nav bar. Tapping this button
 * would open the given side menu, and tapping it again would close it.
 *
 * ```html
 * <aui-nav-bar>
 *   <aui-nav-buttons side="left">
 *    <!-- Toggle left side menu -->
 *    <button menu-toggle="left" class="button button-icon icon aui-navicon"></button>
 *   </aui-nav-buttons>
 *   <aui-nav-buttons side="right">
 *    <!-- Toggle right side menu -->
 *    <button menu-toggle="right" class="button button-icon icon aui-navicon"></button>
 *   </aui-nav-buttons>
 * </aui-nav-bar>
 * ```
 *
 * ### Button Hidden On Child Views
 * By default, the menu toggle button will only appear on a root
 * level side-menu page. Navigating in to child views will hide the menu-
 * toggle button. They can be made visible on child pages by setting the
 * enable-menu-with-back-views attribute of the {@link atajoui.directive:auiSideMenus}
 * directive to true.
 *
 * ```html
 * <aui-side-menus enable-menu-with-back-views="true">
 * ```
 */
AtajoUiModule
.directive('menuToggle', function() {
  return {
    restrict: 'AC',
    link: function($scope, $element, $attr) {
      $scope.$on('$atajoUiView.beforeEnter', function(ev, viewData) {
        if (viewData.enableBack) {
          var sideMenuCtrl = $element.inheritedData('$auiSideMenusController');
          if (!sideMenuCtrl.enableMenuWithBackViews()) {
            $element.addClass('hide');
          }
        } else {
          $element.removeClass('hide');
        }
      });

      $element.bind('click', function() {
        var sideMenuCtrl = $element.inheritedData('$auiSideMenusController');
        sideMenuCtrl && sideMenuCtrl.toggle($attr.menuToggle);
      });
    }
  };
});
