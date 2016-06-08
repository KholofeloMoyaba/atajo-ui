AtajoUiModule

/**
 * @ngdoc directive
 * @name auiSideMenus
 * @module atajoui
 * @delegate atajoui.service:$atajoUiSideMenuDelegate
 * @restrict E
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left and/or right side menu
 * to be toggled by dragging the main content area side to side.
 *
 * To automatically close an opened menu, you can add the {@link atajoui.directive:menuClose} attribute
 * directive. The `menu-close` attribute is usually added to links and buttons within
 * `aui-side-menu-content`, so that when the element is clicked, the opened side menu will
 * automatically close.
 *
 * "Burger Icon" toggles can be added to the header with the {@link atajoui.directive:menuToggle}
 * attribute directive. Clicking the toggle will open and close the side menu like the `menu-close`
 * directive. The side menu will automatically hide on child pages, but can be overridden with the
 * enable-menu-with-back-views attribute mentioned below.
 *
 * By default, side menus are hidden underneath their side menu content and can be opened by swiping
 * the content left or right or by toggling a button to show the side menu. Additionally, by adding the
 * {@link atajoui.directive:exposeAsideWhen} attribute directive to an
 * {@link atajoui.directive:auiSideMenu} element directive, a side menu can be given instructions about
 * "when" the menu should be exposed (always viewable).
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out:
 *
 * - {@link atajoui.directive:auiSideMenuContent}
 * - {@link atajoui.directive:auiSideMenu}
 * - {@link atajoui.directive:menuToggle}
 * - {@link atajoui.directive:menuClose}
 * - {@link atajoui.directive:exposeAsideWhen}
 *
 * @usage
 * To use side menus, add an `<aui-side-menus>` parent element. This will encompass all pages that have a
 * side menu, and have at least 2 child elements: 1 `<aui-side-menu-content>` for the center content,
 * and one or more `<aui-side-menu>` directives for each side menu(left/right) that you wish to place.
 *
 * ```html
 * <aui-side-menus>
 *   <!-- Left menu -->
 *   <aui-side-menu side="left">
 *   </aui-side-menu>
 *
 *   <aui-side-menu-content>
 *   <!-- Main content, usually <aui-nav-view> -->
 *   </aui-side-menu-content>
 *
 *   <!-- Right menu -->
 *   <aui-side-menu side="right">
 *   </aui-side-menu>
 *
 * </aui-side-menus>
 * ```
 * ```js
 * function ContentController($scope, $atajoUiSideMenuDelegate) {
 *   $scope.toggleLeft = function() {
 *     $atajoUiSideMenuDelegate.toggleLeft();
 *   };
 * }
 * ```
 *
 * @param {bool=} enable-menu-with-back-views Determines whether the side menu is enabled when the
 * back button is showing. When set to `false`, any {@link atajoui.directive:menuToggle} will be hidden,
 * and the user cannot swipe to open the menu. When going back to the root page of the side menu (the
 * page without a back button visible), then any menuToggle buttons will show again, and menus will be
 * enabled again.
 * @param {string=} delegate-handle The handle used to identify this side menu
 * with {@link atajoui.service:$atajoUiSideMenuDelegate}.
 *
 */
.directive('auiSideMenus', ['$atajoUiBody', function($atajoUiBody) {
  return {
    restrict: 'ECA',
    controller: '$atajoUiSideMenus',
    compile: function(element, attr) {
      attr.$set('class', (attr['class'] || '') + ' view');

      return { pre: prelink };
      function prelink($scope, $element, $attrs, ctrl) {

        ctrl.enableMenuWithBackViews($scope.$eval($attrs.enableMenuWithBackViews));

        $scope.$on('$atajoUiExposeAside', function(evt, isAsideExposed) {
          if (!$scope.$exposeAside) $scope.$exposeAside = {};
          $scope.$exposeAside.active = isAsideExposed;
          $atajoUiBody.enableClass(isAsideExposed, 'aside-open');
        });

        $scope.$on('$atajoUiView.beforeEnter', function(ev, d) {
          if (d.historyId) {
            $scope.$activeHistoryId = d.historyId;
          }
        });

        $scope.$on('$destroy', function() {
          $atajoUiBody.removeClass('menu-open', 'aside-open');
        });

      }
    }
  };
}]);
