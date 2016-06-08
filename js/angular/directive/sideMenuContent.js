/**
 * @ngdoc directive
 * @name auiSideMenuContent
 * @module atajoui
 * @restrict E
 * @parent atajoui.directive:auiSideMenus
 *
 * @description
 * A container for the main visible content, sibling to one or more
 * {@link atajoui.directive:auiSideMenu} directives.
 *
 * @usage
 * ```html
 * <aui-side-menu-content
 *   edge-drag-threshold="true"
 *   drag-content="true">
 * </aui-side-menu-content>
 * ```
 * For a complete side menu example, see the
 * {@link atajoui.directive:auiSideMenus} documentation.
 *
 * @param {boolean=} drag-content Whether the content can be dragged. Default true.
 * @param {boolean|number=} edge-drag-threshold Whether the content drag can only start if it is below a certain threshold distance from the edge of the screen.  Default false. Accepts three types of values:
   *  - If a non-zero number is given, that many pixels is used as the maximum allowed distance from the edge that starts dragging the side menu.
   *  - If true is given, the default number of pixels (25) is used as the maximum allowed distance.
   *  - If false or 0 is given, the edge drag threshold is disabled, and dragging from anywhere on the content is allowed.
 *
 */
AtajoUiModule
.directive('auiSideMenuContent', [
  '$timeout',
  '$atajoUiGesture',
  '$window',
function($timeout, $atajoUiGesture, $window) {

  return {
    restrict: 'EA', //DEPRECATED 'A'
    require: '^auiSideMenus',
    scope: true,
    compile: function(element, attr) {
      element.addClass('menu-content pane');

      return { pre: prelink };
      function prelink($scope, $element, $attr, sideMenuCtrl) {
        var startCoord = null;
        var primaryScrollAxis = null;

        if (isDefined(attr.dragContent)) {
          $scope.$watch(attr.dragContent, function(value) {
            sideMenuCtrl.canDragContent(value);
          });
        } else {
          sideMenuCtrl.canDragContent(true);
        }

        if (isDefined(attr.edgeDragThreshold)) {
          $scope.$watch(attr.edgeDragThreshold, function(value) {
            sideMenuCtrl.edgeDragThreshold(value);
          });
        }

        // Listen for taps on the content to close the menu
        function onContentTap(gestureEvt) {
          if (sideMenuCtrl.getOpenAmount() !== 0) {
            sideMenuCtrl.close();
            gestureEvt.gesture.srcEvent.preventDefault();
            startCoord = null;
            primaryScrollAxis = null;
          } else if (!startCoord) {
            startCoord = atajoui.tap.pointerCoord(gestureEvt.gesture.srcEvent);
          }
        }

        function onDragX(e) {
          if (!sideMenuCtrl.isDraggableTarget(e)) return;

          if (getPrimaryScrollAxis(e) == 'x') {
            sideMenuCtrl._handleDrag(e);
            e.gesture.srcEvent.preventDefault();
          }
        }

        function onDragY(e) {
          if (getPrimaryScrollAxis(e) == 'x') {
            e.gesture.srcEvent.preventDefault();
          }
        }

        function onDragRelease(e) {
          sideMenuCtrl._endDrag(e);
          startCoord = null;
          primaryScrollAxis = null;
        }

        function getPrimaryScrollAxis(gestureEvt) {
          // gets whether the user is primarily scrolling on the X or Y
          // If a majority of the drag has been on the Y since the start of
          // the drag, but the X has moved a little bit, it's still a Y drag

          if (primaryScrollAxis) {
            // we already figured out which way they're scrolling
            return primaryScrollAxis;
          }

          if (gestureEvt && gestureEvt.gesture) {

            if (!startCoord) {
              // get the starting point
              startCoord = atajoui.tap.pointerCoord(gestureEvt.gesture.srcEvent);

            } else {
              // we already have a starting point, figure out which direction they're going
              var endCoord = atajoui.tap.pointerCoord(gestureEvt.gesture.srcEvent);

              var xDistance = Math.abs(endCoord.x - startCoord.x);
              var yDistance = Math.abs(endCoord.y - startCoord.y);

              var scrollAxis = (xDistance < yDistance ? 'y' : 'x');

              if (Math.max(xDistance, yDistance) > 30) {
                // ok, we pretty much know which way they're going
                // let's lock it in
                primaryScrollAxis = scrollAxis;
              }

              return scrollAxis;
            }
          }
          return 'y';
        }

        var content = {
          element: element[0],
          onDrag: function() {},
          endDrag: function() {},
          setCanScroll: function(canScroll) {
            var c = $element[0].querySelector('.scroll');

            if (!c) {
              return;
            }

            var content = angular.element(c.parentElement);
            if (!content) {
              return;
            }

            // freeze our scroll container if we have one
            var scrollScope = content.scope();
            scrollScope.scrollCtrl && scrollScope.scrollCtrl.freezeScrollShut(!canScroll);
          },
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: atajoui.animationFrameThrottle(function(amount) {
            var xTransform = content.offsetX + amount;
            $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(' + xTransform + 'px,0,0)';
            $timeout(function() {
              $scope.sideMenuContentTranslateX = amount;
            });
          }),
          setMarginLeft: atajoui.animationFrameThrottle(function(amount) {
            if (amount) {
              amount = parseInt(amount, 10);
              $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(' + amount + 'px,0,0)';
              $element[0].style.width = ($window.innerWidth - amount) + 'px';
              content.offsetX = amount;
            } else {
              $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(0,0,0)';
              $element[0].style.width = '';
              content.offsetX = 0;
            }
          }),
          setMarginRight: atajoui.animationFrameThrottle(function(amount) {
            if (amount) {
              amount = parseInt(amount, 10);
              $element[0].style.width = ($window.innerWidth - amount) + 'px';
              content.offsetX = amount;
            } else {
              $element[0].style.width = '';
              content.offsetX = 0;
            }
            // reset incase left gets grabby
            $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(0,0,0)';
          }),
          setMarginLeftAndRight: atajoui.animationFrameThrottle(function(amountLeft, amountRight) {
            amountLeft = amountLeft && parseInt(amountLeft, 10) || 0;
            amountRight = amountRight && parseInt(amountRight, 10) || 0;

            var amount = amountLeft + amountRight;

            if (amount > 0) {
              $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(' + amountLeft + 'px,0,0)';
              $element[0].style.width = ($window.innerWidth - amount) + 'px';
              content.offsetX = amountLeft;
            } else {
              $element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(0,0,0)';
              $element[0].style.width = '';
              content.offsetX = 0;
            }
            // reset incase left gets grabby
            //$element[0].style[atajoui.CSS.TRANSFORM] = 'translate3d(0,0,0)';
          }),
          enableAnimation: function() {
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          },
          offsetX: 0
        };

        sideMenuCtrl.setContent(content);

        // add gesture handlers
        var gestureOpts = { stop_browser_behavior: false };
        gestureOpts.prevent_default_directions = ['left', 'right'];
        var contentTapGesture = $atajoUiGesture.on('tap', onContentTap, $element, gestureOpts);
        var dragRightGesture = $atajoUiGesture.on('dragright', onDragX, $element, gestureOpts);
        var dragLeftGesture = $atajoUiGesture.on('dragleft', onDragX, $element, gestureOpts);
        var dragUpGesture = $atajoUiGesture.on('dragup', onDragY, $element, gestureOpts);
        var dragDownGesture = $atajoUiGesture.on('dragdown', onDragY, $element, gestureOpts);
        var releaseGesture = $atajoUiGesture.on('release', onDragRelease, $element, gestureOpts);

        // Cleanup
        $scope.$on('$destroy', function() {
          if (content) {
            content.element = null;
            content = null;
          }
          $atajoUiGesture.off(dragLeftGesture, 'dragleft', onDragX);
          $atajoUiGesture.off(dragRightGesture, 'dragright', onDragX);
          $atajoUiGesture.off(dragUpGesture, 'dragup', onDragY);
          $atajoUiGesture.off(dragDownGesture, 'dragdown', onDragY);
          $atajoUiGesture.off(releaseGesture, 'release', onDragRelease);
          $atajoUiGesture.off(contentTapGesture, 'tap', onContentTap);
        });
      }
    }
  };
}]);
