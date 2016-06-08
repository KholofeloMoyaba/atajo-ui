/**
 * @ngdoc service
 * @name $atajoUiListDelegate
 * @module atajoui
 *
 * @description
 * Delegate for controlling the {@link atajoui.directive:auiList} directive.
 *
 * Methods called directly on the $atajoUiListDelegate service will control all lists.
 * Use the {@link atajoui.service:$atajoUiListDelegate#$getByHandle $getByHandle}
 * method to control specific auiList instances.
 *
 * @usage
 * ```html
 * {% raw %}
 * <aui-content ng-controller="MyCtrl">
 *   <button class="button" ng-click="showDeleteButtons()"></button>
 *   <aui-list>
 *     <aui-item ng-repeat="i in items">
 *       Hello, {{i}}!
 *       <aui-delete-button class="aui-minus-circled"></aui-delete-button>
 *     </aui-item>
 *   </aui-list>
 * </aui-content>
 * {% endraw %}
 * ```

 * ```js
 * function MyCtrl($scope, $atajoUiListDelegate) {
 *   $scope.showDeleteButtons = function() {
 *     $atajoUiListDelegate.showDelete(true);
 *   };
 * }
 * ```
 */
AtajoUiModule.service('$atajoUiListDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiListDelegate#showReorder
   * @param {boolean=} showReorder Set whether or not this list is showing its reorder buttons.
   * @returns {boolean} Whether the reorder buttons are shown.
   */
  'showReorder',
  /**
   * @ngdoc method
   * @name $atajoUiListDelegate#showDelete
   * @param {boolean=} showDelete Set whether or not this list is showing its delete buttons.
   * @returns {boolean} Whether the delete buttons are shown.
   */
  'showDelete',
  /**
   * @ngdoc method
   * @name $atajoUiListDelegate#canSwipeItems
   * @param {boolean=} canSwipeItems Set whether or not this list is able to swipe to show
   * option buttons.
   * @returns {boolean} Whether the list is able to swipe to show option buttons.
   */
  'canSwipeItems',
  /**
   * @ngdoc method
   * @name $atajoUiListDelegate#closeOptionButtons
   * @description Closes any option buttons on the list that are swiped open.
   */
  'closeOptionButtons'
  /**
   * @ngdoc method
   * @name $atajoUiListDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link atajoui.directive:auiList} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$atajoUiListDelegate.$getByHandle('my-handle').showReorder(true);`
   */
]))

.controller('$atajoUiList', [
  '$scope',
  '$attrs',
  '$atajoUiListDelegate',
  '$atajoUiHistory',
function($scope, $attrs, $atajoUiListDelegate, $atajoUiHistory) {
  var self = this;
  var isSwipeable = true;
  var isReorderShown = false;
  var isDeleteShown = false;

  var deregisterInstance = $atajoUiListDelegate._registerInstance(
    self, $attrs.delegateHandle, function() {
      return $atajoUiHistory.isActiveScope($scope);
    }
  );
  $scope.$on('$destroy', deregisterInstance);

  self.showReorder = function(show) {
    if (arguments.length) {
      isReorderShown = !!show;
    }
    return isReorderShown;
  };

  self.showDelete = function(show) {
    if (arguments.length) {
      isDeleteShown = !!show;
    }
    return isDeleteShown;
  };

  self.canSwipeItems = function(can) {
    if (arguments.length) {
      isSwipeable = !!can;
    }
    return isSwipeable;
  };

  self.closeOptionButtons = function() {
    self.listView && self.listView.clearDragEffects();
  };
}]);
