/**
 * @ngdoc service
 * @name $atajoUiSideMenuDelegate
 * @module atajoui
 *
 * @description
 * Delegate for controlling the {@link atajoui.directive:auiSideMenus} directive.
 *
 * Methods called directly on the $atajoUiSideMenuDelegate service will control all side
 * menus.  Use the {@link atajoui.service:$atajoUiSideMenuDelegate#$getByHandle $getByHandle}
 * method to control specific auiSideMenus instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <aui-side-menus>
 *     <aui-side-menu-content>
 *       Content!
 *       <button ng-click="toggleLeftSideMenu()">
 *         Toggle Left Side Menu
 *       </button>
 *     </aui-side-menu-content>
 *     <aui-side-menu side="left">
 *       Left Menu!
 *     <aui-side-menu>
 *   </aui-side-menus>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $atajoUiSideMenuDelegate) {
 *   $scope.toggleLeftSideMenu = function() {
 *     $atajoUiSideMenuDelegate.toggleLeft();
 *   };
 * }
 * ```
 */
AtajoUiModule
.service('$atajoUiSideMenuDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#toggleLeft
   * @description Toggle the left side menu (if it exists).
   * @param {boolean=} isOpen Whether to open or close the menu.
   * Default: Toggles the menu.
   */
  'toggleLeft',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#toggleRight
   * @description Toggle the right side menu (if it exists).
   * @param {boolean=} isOpen Whether to open or close the menu.
   * Default: Toggles the menu.
   */
  'toggleRight',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#getOpenRatio
   * @description Gets the ratio of open amount over menu width. For example, a
   * menu of width 100 that is opened by 50 pixels is 50% opened, and would return
   * a ratio of 0.5.
   *
   * @returns {float} 0 if nothing is open, between 0 and 1 if left menu is
   * opened/opening, and between 0 and -1 if right menu is opened/opening.
   */
  'getOpenRatio',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#isOpen
   * @returns {boolean} Whether either the left or right menu is currently opened.
   */
  'isOpen',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#isOpenLeft
   * @returns {boolean} Whether the left menu is currently opened.
   */
  'isOpenLeft',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#isOpenRight
   * @returns {boolean} Whether the right menu is currently opened.
   */
  'isOpenRight',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#canDragContent
   * @param {boolean=} canDrag Set whether the content can or cannot be dragged to open
   * side menus.
   * @returns {boolean} Whether the content can be dragged to open side menus.
   */
  'canDragContent',
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#edgeDragThreshold
   * @param {boolean|number=} value Set whether the content drag can only start if it is below a certain threshold distance from the edge of the screen. Accepts three different values:
   *  - If a non-zero number is given, that many pixels is used as the maximum allowed distance from the edge that starts dragging the side menu.
   *  - If true is given, the default number of pixels (25) is used as the maximum allowed distance.
   *  - If false or 0 is given, the edge drag threshold is disabled, and dragging from anywhere on the content is allowed.
   * @returns {boolean} Whether the drag can start only from within the edge of screen threshold.
   */
  'edgeDragThreshold'
  /**
   * @ngdoc method
   * @name $atajoUiSideMenuDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link atajoui.directive:auiSideMenus} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$atajoUiSideMenuDelegate.$getByHandle('my-handle').toggleLeft();`
   */
]));

