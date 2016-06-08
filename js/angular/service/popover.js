/**
 * @ngdoc service
 * @name $atajoUiPopover
 * @module atajoui
 * @description
 *
 * Related: {@link atajoui.controller:atajoUiPopover atajoUiPopover controller}.
 *
 * The Popover is a view that floats above an app’s content. Popovers provide an
 * easy way to present or gather information from the user and are
 * commonly used in the following situations:
 *
 * - Show more info about the current view
 * - Select a commonly used tool or configuration
 * - Present a list of actions to perform inside one of your views
 *
 * Put the content of the popover inside of an `<aui-popover-view>` element.
 *
 * @usage
 * ```html
 * <p>
 *   <button ng-click="openPopover($event)">Open Popover</button>
 * </p>
 *
 * <script id="my-popover.html" type="text/ng-template">
 *   <aui-popover-view>
 *     <aui-header-bar>
 *       <h1 class="title">My Popover Title</h1>
 *     </aui-header-bar>
 *     <aui-content>
 *       Hello!
 *     </aui-content>
 *   </aui-popover-view>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['atajoui'])
 * .controller('MyController', function($scope, $atajoUiPopover) {
 *
 *   // .fromTemplate() method
 *   var template = '<aui-popover-view><aui-header-bar> <h1 class="title">My Popover Title</h1> </aui-header-bar> <aui-content> Hello! </aui-content></aui-popover-view>';
 *
 *   $scope.popover = $atajoUiPopover.fromTemplate(template, {
 *     scope: $scope
 *   });
 *
 *   // .fromTemplateUrl() method
 *   $atajoUiPopover.fromTemplateUrl('my-popover.html', {
 *     scope: $scope
 *   }).then(function(popover) {
 *     $scope.popover = popover;
 *   });
 *
 *
 *   $scope.openPopover = function($event) {
 *     $scope.popover.show($event);
 *   };
 *   $scope.closePopover = function() {
 *     $scope.popover.hide();
 *   };
 *   //Cleanup the popover when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.popover.remove();
 *   });
 *   // Execute action on hide popover
 *   $scope.$on('popover.hidden', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove popover
 *   $scope.$on('popover.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */


AtajoUiModule
.factory('$atajoUiPopover', ['$atajoUiModal', '$atajoUiPosition', '$document', '$window',
function($atajoUiModal, $atajoUiPosition, $document, $window) {

  var POPOVER_BODY_PADDING = 6;

  var POPOVER_OPTIONS = {
    viewType: 'popover',
    hideDelay: 1,
    animation: 'none',
    positauiView: positauiView
  };

  function positauiView(target, popoverEle) {
    var targetEle = jqLite(target.target || target);
    var buttonOffset = $atajoUiPosition.offset(targetEle);
    var popoverWidth = popoverEle.prop('offsetWidth');
    var popoverHeight = popoverEle.prop('offsetHeight');
    // Use innerWidth and innerHeight, because clientWidth and clientHeight
    // doesn't work consistently for body on all platforms
    var bodyWidth = $window.innerWidth;
    var bodyHeight = $window.innerHeight;

    var popoverCSS = {
      left: buttonOffset.left + buttonOffset.width / 2 - popoverWidth / 2
    };
    var arrowEle = jqLite(popoverEle[0].querySelector('.popover-arrow'));

    if (popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
    } else if (popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (buttonOffset.top + buttonOffset.height + popoverHeight > bodyHeight &&
        buttonOffset.top - popoverHeight > 0) {
      popoverCSS.top = buttonOffset.top - popoverHeight;
      popoverEle.addClass('popover-bottom');
    } else {
      popoverCSS.top = buttonOffset.top + buttonOffset.height;
      popoverEle.removeClass('popover-bottom');
    }

    arrowEle.css({
      left: buttonOffset.left + buttonOffset.width / 2 -
        arrowEle.prop('offsetWidth') / 2 - popoverCSS.left + 'px'
    });

    popoverEle.css({
      top: popoverCSS.top + 'px',
      left: popoverCSS.left + 'px',
      marginLeft: '0',
      opacity: '1'
    });

  }

  /**
   * @ngdoc controller
   * @name atajoUiPopover
   * @module atajoui
   * @description
   * Instantiated by the {@link atajoui.service:$atajoUiPopover} service.
   *
   * Be sure to call [remove()](#remove) when you are done with each popover
   * to clean it up and avoid memory leaks.
   *
   * Note: a popover will broadcast 'popover.shown', 'popover.hidden', and 'popover.removed' events from its originating
   * scope, passing in itself as an event argument. Both the popover.removed and popover.hidden events are
   * called when the popover is removed.
   */

  /**
   * @ngdoc method
   * @name atajoUiPopover#initialize
   * @description Creates a new popover controller instance.
   * @param {object} options An options object with the following properties:
   *  - `{object=}` `scope` The scope to be a child of.
   *    Default: creates a child of $rootScope.
   *  - `{boolean=}` `focusFirstInput` Whether to autofocus the first input of
   *    the popover when shown.  Default: false.
   *  - `{boolean=}` `backdropClickToClose` Whether to close the popover on clicking the backdrop.
   *    Default: true.
   *  - `{boolean=}` `hardwareBackButtonClose` Whether the popover can be closed using the hardware
   *    back button on Android and similar devices.  Default: true.
   */

  /**
   * @ngdoc method
   * @name atajoUiPopover#show
   * @description Show this popover instance.
   * @param {$event} $event The $event or target element which the popover should align
   * itself next to.
   * @returns {promise} A promise which is resolved when the popover is finished animating in.
   */

  /**
   * @ngdoc method
   * @name atajoUiPopover#hide
   * @description Hide this popover instance.
   * @returns {promise} A promise which is resolved when the popover is finished animating out.
   */

  /**
   * @ngdoc method
   * @name atajoUiPopover#remove
   * @description Remove this popover instance from the DOM and clean up.
   * @returns {promise} A promise which is resolved when the popover is finished animating out.
   */

  /**
   * @ngdoc method
   * @name atajoUiPopover#isShown
   * @returns boolean Whether this popover is currently shown.
   */

  return {
    /**
     * @ngdoc method
     * @name $atajoUiPopover#fromTemplate
     * @param {string} templateString The template string to use as the popovers's
     * content.
     * @param {object} options Options to be passed to the initialize method.
     * @returns {object} An instance of an {@link atajoui.controller:atajoUiPopover}
     * controller (atajoUiPopover is built on top of $atajoUiPopover).
     */
    fromTemplate: function(templateString, options) {
      return $atajoUiModal.fromTemplate(templateString, atajoui.Utils.extend({}, POPOVER_OPTIONS, options));
    },
    /**
     * @ngdoc method
     * @name $atajoUiPopover#fromTemplateUrl
     * @param {string} templateUrl The url to load the template from.
     * @param {object} options Options to be passed to the initialize method.
     * @returns {promise} A promise that will be resolved with an instance of
     * an {@link atajoui.controller:atajoUiPopover} controller (atajoUiPopover is built on top of $atajoUiPopover).
     */
    fromTemplateUrl: function(url, options) {
      return $atajoUiModal.fromTemplateUrl(url, atajoui.Utils.extend({}, POPOVER_OPTIONS, options));
    }
  };

}]);
