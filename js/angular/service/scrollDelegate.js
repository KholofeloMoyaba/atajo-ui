
/**
 * @ngdoc service
 * @name $atajoUiScrollDelegate
 * @module atajoui
 * @description
 * Delegate for controlling scrollViews (created by
 * {@link atajoui.directive:auiContent} and
 * {@link atajoui.directive:auiScroll} directives).
 *
 * Methods called directly on the $atajoUiScrollDelegate service will control all scroll
 * views.  Use the {@link atajoui.service:$atajoUiScrollDelegate#$getByHandle $getByHandle}
 * method to control specific scrollViews.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <aui-content>
 *     <button ng-click="scrollTop()">Scroll to Top!</button>
 *   </aui-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $atajoUiScrollDelegate) {
 *   $scope.scrollTop = function() {
 *     $atajoUiScrollDelegate.scrollTop();
 *   };
 * }
 * ```
 *
 * Example of advanced usage, with two scroll areas using `delegate-handle`
 * for fine control.
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <aui-content delegate-handle="mainScroll">
 *     <button ng-click="scrollMainToTop()">
 *       Scroll content to top!
 *     </button>
 *     <aui-scroll delegate-handle="small" style="height: 100px;">
 *       <button ng-click="scrollSmallToTop()">
 *         Scroll small area to top!
 *       </button>
 *     </aui-scroll>
 *   </aui-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $atajoUiScrollDelegate) {
 *   $scope.scrollMainToTop = function() {
 *     $atajoUiScrollDelegate.$getByHandle('mainScroll').scrollTop();
 *   };
 *   $scope.scrollSmallToTop = function() {
 *     $atajoUiScrollDelegate.$getByHandle('small').scrollTop();
 *   };
 * }
 * ```
 */
AtajoUiModule
.service('$atajoUiScrollDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#resize
   * @description Tell the scrollView to recalculate the size of its container.
   */
  'resize',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#scrollTop
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTop',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#scrollBottom
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBottom',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#scrollTo
   * @param {number} left The x-value to scroll to.
   * @param {number} top The y-value to scroll to.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTo',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#scrollBy
   * @param {number} left The x-offset to scroll by.
   * @param {number} top The y-offset to scroll by.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBy',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#zoomTo
   * @param {number} level Level to zoom to.
   * @param {boolean=} animate Whether to animate the zoom.
   * @param {number=} originLeft Zoom in at given left coordinate.
   * @param {number=} originTop Zoom in at given top coordinate.
   */
  'zoomTo',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#zoomBy
   * @param {number} factor The factor to zoom by.
   * @param {boolean=} animate Whether to animate the zoom.
   * @param {number=} originLeft Zoom in at given left coordinate.
   * @param {number=} originTop Zoom in at given top coordinate.
   */
  'zoomBy',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#getScrollPosition
   * @returns {object} The scroll position of this view, with the following properties:
   *  - `{number}` `left` The distance the user has scrolled from the left (starts at 0).
   *  - `{number}` `top` The distance the user has scrolled from the top (starts at 0).
   *  - `{number}` `zoom` The current zoom level.
   */
  'getScrollPosition',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#anchorScroll
   * @description Tell the scrollView to scroll to the element with an id
   * matching window.location.hash.
   *
   * If no matching element is found, it will scroll to top.
   *
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'anchorScroll',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#freezeScroll
   * @description Does not allow this scroll view to scroll either x or y.
   * @param {boolean=} shouldFreeze Should this scroll view be prevented from scrolling or not.
   * @returns {boolean} If the scroll view is being prevented from scrolling or not.
   */
  'freezeScroll',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#freezeAllScrolls
   * @description Does not allow any of the app's scroll views to scroll either x or y.
   * @param {boolean=} shouldFreeze Should all app scrolls be prevented from scrolling or not.
   */
  'freezeAllScrolls',
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#getScrollView
   * @returns {object} The scrollView associated with this delegate.
   */
  'getScrollView'
  /**
   * @ngdoc method
   * @name $atajoUiScrollDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * scrollViews with `delegate-handle` matching the given handle.
   *
   * Example: `$atajoUiScrollDelegate.$getByHandle('my-handle').scrollTop();`
   */
]));

