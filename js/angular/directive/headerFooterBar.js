
AtajoUiModule
//.directive('auiHeaderBar', tapScrollToTopDirective())

/**
 * @ngdoc directive
 * @name auiHeaderBar
 * @module atajoui
 * @restrict E
 *
 * @description
 * Adds a fixed header bar above some content.
 *
 * Can also be a subheader (lower down) if the 'bar-subheader' class is applied.
 * See [the header CSS docs](/docs/components/#subheader).
 *
 * @param {string=} align-title How to align the title. By default the title
 * will be aligned the same as how the platform aligns its titles (iOS centers
 * titles, Android aligns them left).
 * Available: 'left', 'right', or 'center'.  Defaults to the same as the platform.
 * @param {boolean=} no-tap-scroll By default, the header bar will scroll the
 * content to the top when tapped.  Set no-tap-scroll to true to disable this
 * behavior.
 * Available: true or false.  Defaults to false.
 *
 * @usage
 * ```html
 * <aui-header-bar align-title="left" class="bar-positive">
 *   <div class="buttons">
 *     <button class="button" ng-click="doSomething()">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </aui-header-bar>
 * <aui-content class="has-header">
 *   Some content!
 * </aui-content>
 * ```
 */
.directive('auiHeaderBar', headerFooterBarDirective(true))

/**
 * @ngdoc directive
 * @name auiFooterBar
 * @module atajoui
 * @restrict E
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Can also be a subfooter (higher up) if the 'bar-subfooter' class is applied.
 * See [the footer CSS docs](/docs/components/#footer).
 *
 * Note: If you use auiFooterBar in combination with ng-if, the surrounding content
 * will not align correctly.  This will be fixed soon.
 *
 * @param {string=} align-title Where to align the title.
 * Available: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <aui-content class="has-footer">
 *   Some content!
 * </aui-content>
 * <aui-footer-bar align-title="left" class="bar-assertive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons" ng-click="doSomething()">
 *     <button class="button">Right Button</button>
 *   </div>
 * </aui-footer-bar>
 * ```
 */
.directive('auiFooterBar', headerFooterBarDirective(false));

function tapScrollToTopDirective() { //eslint-disable-line no-unused-vars
  return ['$atajoUiScrollDelegate', function($atajoUiScrollDelegate) {
    return {
      restrict: 'E',
      link: function($scope, $element, $attr) {
        if ($attr.noTapScroll == 'true') {
          return;
        }
        atajoui.on('tap', onTap, $element[0]);
        $scope.$on('$destroy', function() {
          atajoui.off('tap', onTap, $element[0]);
        });

        function onTap(e) {
          var depth = 3;
          var current = e.target;
          //Don't scroll to top in certain cases
          while (depth-- && current) {
            if (current.classList.contains('button') ||
                current.tagName.match(/input|textarea|select/i) ||
                current.isContentEditable) {
              return;
            }
            current = current.parentNode;
          }
          var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
          var bounds = $element[0].getBoundingClientRect();
          if (atajoui.DomUtil.rectContains(
            touch.pageX, touch.pageY,
            bounds.left, bounds.top - 20,
            bounds.left + bounds.width, bounds.top + bounds.height
          )) {
            $atajoUiScrollDelegate.scrollTop(true);
          }
        }
      }
    };
  }];
}

function headerFooterBarDirective(isHeader) {
  return ['$document', '$timeout', function($document, $timeout) {
    return {
      restrict: 'E',
      controller: '$atajoUiHeaderBar',
      compile: function(tElement) {
        tElement.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
        // top style tabs? if so, remove bottom border for seamless display
        $timeout(function() {
          if (isHeader && $document[0].getElementsByClassName('tabs-top').length) tElement.addClass('has-tabs-top');
        });

        return { pre: prelink };
        function prelink($scope, $element, $attr, ctrl) {
          if (isHeader) {
            $scope.$watch(function() { return $element[0].className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubheader = value.indexOf('bar-subheader') !== -1;
              $scope.$hasHeader = isShown && !isSubheader;
              $scope.$hasSubheader = isShown && isSubheader;
              $scope.$emit('$atajoUiSubheader', $scope.$hasSubheader);
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasHeader;
              delete $scope.$hasSubheader;
            });
            ctrl.align();
            $scope.$on('$atajoUiHeader.align', function() {
              atajoui.requestAnimationFrame(function() {
                ctrl.align();
              });
            });

          } else {
            $scope.$watch(function() { return $element[0].className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubfooter = value.indexOf('bar-subfooter') !== -1;
              $scope.$hasFooter = isShown && !isSubfooter;
              $scope.$hasSubfooter = isShown && isSubfooter;
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasFooter;
              delete $scope.$hasSubfooter;
            });
            $scope.$watch('$hasTabs', function(val) {
              $element.toggleClass('has-tabs', !!val);
            });
            ctrl.align();
            $scope.$on('$atajoUiFooter.align', function() {
              atajoui.requestAnimationFrame(function() {
                ctrl.align();
              });
            });
          }
        }
      }
    };
  }];
}
