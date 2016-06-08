/**
 * @ngdoc directive
 * @name exposeAsideWhen
 * @module atajoui
 * @restrict A
 * @parent atajoui.directive:auiSideMenus
 *
 * @description
 * It is common for a tablet application to hide a menu when in portrait mode, but to show the
 * same menu on the left side when the tablet is in landscape mode. The `exposeAsideWhen` attribute
 * directive can be used to accomplish a similar interface.
 *
 * By default, side menus are hidden underneath its side menu content, and can be opened by either
 * swiping the content left or right, or toggling a button to show the side menu. However, by adding the
 * `exposeAsideWhen` attribute directive to an {@link atajoui.directive:auiSideMenu} element directive,
 * a side menu can be given instructions on "when" the menu should be exposed (always viewable). For
 * example, the `expose-aside-when="large"` attribute will keep the side menu hidden when the viewport's
 * width is less than `768px`, but when the viewport's width is `768px` or greater, the menu will then
 * always be shown and can no longer be opened or closed like it could when it was hidden for smaller
 * viewports.
 *
 * Using `large` as the attribute's value is a shortcut value to `(min-width:768px)` since it is
 * the most common use-case. However, for added flexibility, any valid media query could be added
 * as the value, such as `(min-width:600px)` or even multiple queries such as
 * `(min-width:750px) and (max-width:1200px)`.
 * @usage
 * ```html
 * <aui-side-menus>
 *   <!-- Center content -->
 *   <aui-side-menu-content>
 *   </aui-side-menu-content>
 *
 *   <!-- Left menu -->
 *   <aui-side-menu expose-aside-when="large">
 *   </aui-side-menu>
 * </aui-side-menus>
 * ```
 * For a complete side menu example, see the
 * {@link atajoui.directive:auiSideMenus} documentation.
 */

AtajoUiModule.directive('exposeAsideWhen', ['$window', function($window) {
  return {
    restrict: 'A',
    require: '^auiSideMenus',
    link: function($scope, $element, $attr, sideMenuCtrl) {

      var prevInnerWidth = $window.innerWidth;
      var prevInnerHeight = $window.innerHeight;

      atajoui.on('resize', function() {
        if (prevInnerWidth === $window.innerWidth && prevInnerHeight === $window.innerHeight) {
          return;
        }
        prevInnerWidth = $window.innerWidth;
        prevInnerHeight = $window.innerHeight;
        onResize();
      }, $window);

      function checkAsideExpose() {
        var mq = $attr.exposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.exposeAsideWhen;
        sideMenuCtrl.exposeAside($window.matchMedia(mq).matches);
        sideMenuCtrl.activeAsideResizing(false);
      }

      function onResize() {
        sideMenuCtrl.activeAsideResizing(true);
        debouncedCheck();
      }

      var debouncedCheck = atajoui.debounce(function() {
        $scope.$apply(checkAsideExpose);
      }, 300, false);

      $scope.$evalAsync(checkAsideExpose);
    }
  };
}]);
