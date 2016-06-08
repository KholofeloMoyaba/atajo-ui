
/**
 * @ngdoc service
 * @name $atajoUiNavBarDelegate
 * @module atajoui
 * @description
 * Delegate for controlling the {@link atajoui.directive:auiNavBar} directive.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <aui-nav-bar>
 *     <button ng-click="setNavTitle('banana')">
 *       Set title to banana!
 *     </button>
 *   </aui-nav-bar>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $atajoUiNavBarDelegate) {
 *   $scope.setNavTitle = function(title) {
 *     $atajoUiNavBarDelegate.title(title);
 *   }
 * }
 * ```
 */
AtajoUiModule
.service('$atajoUiNavBarDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiNavBarDelegate#align
   * @description Aligns the title with the buttons in a given direction.
   * @param {string=} direction The direction to the align the title text towards.
   * Available: 'left', 'right', 'center'. Default: 'center'.
   */
  'align',
  /**
   * @ngdoc method
   * @name $atajoUiNavBarDelegate#showBackButton
   * @description
   * Set/get whether the {@link atajoui.directive:auiNavBackButton} is shown
   * (if it exists and there is a previous view that can be navigated to).
   * @param {boolean=} show Whether to show the back button.
   * @returns {boolean} Whether the back button is shown.
   */
  'showBackButton',
  /**
   * @ngdoc method
   * @name $atajoUiNavBarDelegate#showBar
   * @description
   * Set/get whether the {@link atajoui.directive:auiNavBar} is shown.
   * @param {boolean} show Whether to show the bar.
   * @returns {boolean} Whether the bar is shown.
   */
  'showBar',
  /**
   * @ngdoc method
   * @name $atajoUiNavBarDelegate#title
   * @description
   * Set the title for the {@link atajoui.directive:auiNavBar}.
   * @param {string} title The new title to show.
   */
  'title',

  // DEPRECATED, as of v1.0.0-beta14 -------
  'changeTitle',
  'setTitle',
  'getTitle',
  'back',
  'getPreviousTitle'
  // END DEPRECATED -------
]));
