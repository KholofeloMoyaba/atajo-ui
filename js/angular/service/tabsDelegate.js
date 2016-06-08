/**
 * @ngdoc service
 * @name $atajoUiTabsDelegate
 * @module atajoui
 *
 * @description
 * Delegate for controlling the {@link atajoui.directive:auiTabs} directive.
 *
 * Methods called directly on the $atajoUiTabsDelegate service will control all auiTabs
 * directives. Use the {@link atajoui.service:$atajoUiTabsDelegate#$getByHandle $getByHandle}
 * method to control specific auiTabs instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <aui-tabs>
 *
 *     <aui-tab title="Tab 1">
 *       Hello tab 1!
 *       <button ng-click="selectTabWithIndex(1)">Select tab 2!</button>
 *     </aui-tab>
 *     <aui-tab title="Tab 2">Hello tab 2!</aui-tab>
 *
 *   </aui-tabs>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $atajoUiTabsDelegate) {
 *   $scope.selectTabWithIndex = function(index) {
 *     $atajoUiTabsDelegate.select(index);
 *   }
 * }
 * ```
 */
AtajoUiModule
.service('$atajoUiTabsDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiTabsDelegate#select
   * @description Select the tab matching the given index.
   *
   * @param {number} index Index of the tab to select.
   */
  'select',
  /**
   * @ngdoc method
   * @name $atajoUiTabsDelegate#selectedIndex
   * @returns `number` The index of the selected tab, or -1.
   */
  'selectedIndex',
  /**
   * @ngdoc method
   * @name $atajoUiTabsDelegate#showBar
   * @description
   * Set/get whether the {@link atajoui.directive:auiTabs} is shown
   * @param {boolean} show Whether to show the bar.
   * @returns {boolean} Whether the bar is shown.
   */
  'showBar'
  /**
   * @ngdoc method
   * @name $atajoUiTabsDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link atajoui.directive:auiTabs} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$atajoUiTabsDelegate.$getByHandle('my-handle').select(0);`
   */
]));
