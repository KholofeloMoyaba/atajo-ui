/**
 * @ngdoc directive
 * @name auiSideMenu
 * @module atajoui
 * @restrict E
 * @parent atajoui.directive:auiSideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link atajoui.directive:auiSideMenuContent} directive.
 *
 * @usage
 * ```html
 * <aui-side-menu
 *   side="left"
 *   width="myWidthValue + 20"
 *   is-enabled="shouldLeftSideMenuBeEnabled()">
 * </aui-side-menu>
 * ```
 * For a complete side menu example, see the
 * {@link atajoui.directive:auiSideMenus} documentation.
 *
 * @param {string} side Which side the side menu is currently on.  Allowed values: 'left' or 'right'.
 * @param {boolean=} is-enabled Whether this side menu is enabled.
 * @param {number=} width How many pixels wide the side menu should be.  Defaults to 275.
 */
AtajoUiModule
.directive('auiSideMenu', function() {
  return {
    restrict: 'E',
    require: '^auiSideMenus',
    scope: true,
    compile: function(element, attr) {
      angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
      angular.isUndefined(attr.width) && attr.$set('width', '275');

      element.addClass('menu menu-' + attr.side);

      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side || 'left';

        var sideMenu = sideMenuCtrl[$scope.side] = new atajoui.views.SideMenu({
          width: attr.width,
          el: $element[0],
          isEnabled: true
        });

        $scope.$watch($attr.width, function(val) {
          var numberVal = +val;
          if (numberVal && numberVal == val) {
            sideMenu.setWidth(+val);
          }
        });
        $scope.$watch($attr.isEnabled, function(val) {
          sideMenu.setIsEnabled(!!val);
        });
      };
    }
  };
});

