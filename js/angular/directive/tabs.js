/**
 * @ngdoc directive
 * @name auiTabs
 * @module atajoui
 * @delegate atajoui.service:$atajoUiTabsDelegate
 * @restrict E
 * @codepen odqCz
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed
 * through.
 *
 * Assign any [tabs class](/docs/components#tabs) to the element to define
 * its look and feel.
 *
 * For iOS, tabs will appear at the bottom of the screen. For Android, tabs will be at the top
 * of the screen, below the nav-bar. This follows each OS's design specification, but can be
 * configured with the {@link atajoui.provider:$atajoUiConfigProvider}.
 *
 * See the {@link atajoui.directive:auiTab} directive's documentation for more details on
 * individual tabs.
 *
 * Note: do not place aui-tabs inside of an aui-content element; it has been known to cause a
 * certain CSS bug.
 *
 * @usage
 * ```html
 * <aui-tabs class="tabs-positive tabs-icon-top">
 *
 *   <aui-tab title="Home" icon-on="aui-ios-filing" icon-off="aui-ios-filing-outline">
 *     <!-- Tab 1 content -->
 *   </aui-tab>
 *
 *   <aui-tab title="About" icon-on="aui-ios-clock" icon-off="aui-ios-clock-outline">
 *     <!-- Tab 2 content -->
 *   </aui-tab>
 *
 *   <aui-tab title="Settings" icon-on="aui-ios-gear" icon-off="aui-ios-gear-outline">
 *     <!-- Tab 3 content -->
 *   </aui-tab>
 *
 * </aui-tabs>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify these tabs
 * with {@link atajoui.service:$atajoUiTabsDelegate}.
 */

AtajoUiModule
.directive('auiTabs', [
  '$atajoUiTabsDelegate',
  '$atajoUiConfig',
function($atajoUiTabsDelegate, $atajoUiConfig) {
  return {
    restrict: 'E',
    scope: true,
    controller: '$atajoUiTabs',
    compile: function(tElement) {
      //We cannot use regular transclude here because it breaks element.data()
      //inheritance on compile
      var innerElement = jqLite('<div class="tab-nav tabs">');
      innerElement.append(tElement.contents());

      tElement.append(innerElement)
              .addClass('tabs-' + $atajoUiConfig.tabs.position() + ' tabs-' + $atajoUiConfig.tabs.style());

      return { pre: prelink, post: postLink };
      function prelink($scope, $element, $attr, tabsCtrl) {
        var deregisterInstance = $atajoUiTabsDelegate._registerInstance(
          tabsCtrl, $attr.delegateHandle, tabsCtrl.hasActiveScope
        );

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));

        $scope.$watch(function() { return $element[0].className; }, function(value) {
          var isTabsTop = value.indexOf('tabs-top') !== -1;
          var isHidden = value.indexOf('tabs-item-hide') !== -1;
          $scope.$hasTabs = !isTabsTop && !isHidden;
          $scope.$hasTabsTop = isTabsTop && !isHidden;
          $scope.$emit('$atajoUiTabs.top', $scope.$hasTabsTop);
        });

        function emitLifecycleEvent(ev, data) {
          ev.stopPropagation();
          var previousSelectedTab = tabsCtrl.previousSelectedTab();
          if (previousSelectedTab) {
            previousSelectedTab.$broadcast(ev.name.replace('NavView', 'Tabs'), data);
          }
        }

        $scope.$on('$atajoUiNavView.beforeLeave', emitLifecycleEvent);
        $scope.$on('$atajoUiNavView.afterLeave', emitLifecycleEvent);
        $scope.$on('$atajoUiNavView.leave', emitLifecycleEvent);

        $scope.$on('$destroy', function() {
          // variable to inform child tabs that they're all being blown away
          // used so that while destorying an individual tab, each one
          // doesn't select the next tab as the active one, which causes unnecessary
          // loading of tab views when each will eventually all go away anyway
          $scope.$tabsDestroy = true;
          deregisterInstance();
          tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
          delete $scope.$hasTabs;
          delete $scope.$hasTabsTop;
        });
      }

      function postLink($scope, $element, $attr, tabsCtrl) {
        if (!tabsCtrl.selectedTab()) {
          // all the tabs have been added
          // but one hasn't been selected yet
          tabsCtrl.select(0);
        }
      }
    }
  };
}]);
