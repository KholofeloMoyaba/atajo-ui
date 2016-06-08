
/**
 * @ngdoc directive
 * @name auiNavBar
 * @module atajoui
 * @delegate atajoui.service:$atajoUiNavBarDelegate
 * @restrict E
 *
 * @description
 * If we have an {@link atajoui.directive:auiNavView} directive, we can also create an
 * `<aui-nav-bar>`, which will create a topbar that updates as the application state changes.
 *
 * We can add a back button by putting an {@link atajoui.directive:auiNavBackButton} inside.
 *
 * We can add buttons depending on the currently visible view using
 * {@link atajoui.directive:auiNavButtons}.
 *
 * Note that the aui-nav-bar element will only work correctly if your content has an
 * auiView around it.
 *
 * @usage
 *
 * ```html
 * <body ng-app="starter">
 *   <!-- The nav bar that will be updated as we navigate -->
 *   <aui-nav-bar class="bar-positive">
 *   </aui-nav-bar>
 *
 *   <!-- where the initial view template will be rendered -->
 *   <aui-nav-view>
 *     <aui-view>
 *       <aui-content>Hello!</aui-content>
 *     </aui-view>
 *   </aui-nav-view>
 * </body>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this navBar
 * with {@link atajoui.service:$atajoUiNavBarDelegate}.
 * @param align-title {string=} Where to align the title of the navbar.
 * Available: 'left', 'right', 'center'. Defaults to 'center'.
 * @param {boolean=} no-tap-scroll By default, the navbar will scroll the content
 * to the top when tapped.  Set no-tap-scroll to true to disable this behavior.
 *
 * </table><br/>
 */
AtajoUiModule
.directive('auiNavBar', function() {
  return {
    restrict: 'E',
    controller: '$atajoUiNavBar',
    scope: true,
    link: function($scope, $element, $attr, ctrl) {
      ctrl.init();
    }
  };
});

