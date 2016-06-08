/**
 * @ngdoc directive
 * @name auiNavButtons
 * @module atajoui
 * @restrict E
 * @parent auiNavView
 *
 * @description
 * Use nav buttons to set the buttons on your {@link atajoui.directive:auiNavBar}
 * from within an {@link atajoui.directive:auiView}. This gives each
 * view template the ability to specify which buttons should show in the nav bar,
 * overriding any default buttons already placed in the nav bar.
 *
 * Any buttons you declare will be positioned on the navbar's corresponding side. Primary
 * buttons generally map to the left side of the header, and secondary buttons are
 * generally on the right side. However, their exact locations are platform-specific.
 * For example, in iOS, the primary buttons are on the far left of the header, and
 * secondary buttons are on the far right, with the header title centered between them.
 * For Android, however, both groups of buttons are on the far right of the header,
 * with the header title aligned left.
 *
 * We recommend always using `primary` and `secondary`, so the buttons correctly map
 * to the side familiar to users of each platform. However, in cases where buttons should
 * always be on an exact side, both `left` and `right` sides are still available. For
 * example, a toggle button for a left side menu should be on the left side; in this case,
 * we'd recommend using `side="left"`, so it's always on the left, no matter the platform.
 *
 * ***Note*** that `aui-nav-buttons` must be immediate descendants of the `aui-view` or
 * `aui-nav-bar` element (basically, don't wrap it in another div).
 *
 * @usage
 * ```html
 * <aui-nav-bar>
 * </aui-nav-bar>
 * <aui-nav-view>
 *   <aui-view>
 *     <aui-nav-buttons side="primary">
 *       <button class="button" ng-click="doSomething()">
 *         I'm a button on the primary of the navbar!
 *       </button>
 *     </aui-nav-buttons>
 *     <aui-content>
 *       Some super content here!
 *     </aui-content>
 *   </aui-view>
 * </aui-nav-view>
 * ```
 *
 * @param {string} side The side to place the buttons in the
 * {@link atajoui.directive:auiNavBar}. Available sides: `primary`, `secondary`, `left`, and `right`.
 */
AtajoUiModule
.directive('auiNavButtons', ['$document', function($document) {
  return {
    require: '^auiNavBar',
    restrict: 'E',
    compile: function(tElement, tAttrs) {
      var side = 'left';

      if (/^primary|secondary|right$/i.test(tAttrs.side || '')) {
        side = tAttrs.side.toLowerCase();
      }

      var spanEle = $document[0].createElement('span');
      spanEle.className = side + '-buttons';
      spanEle.innerHTML = tElement.html();

      var navElementType = side + 'Buttons';

      tElement.attr('class', 'hide');
      tElement.empty();

      return {
        pre: function($scope, $element, $attrs, navBarCtrl) {
          // only register the plain HTML, the navBarCtrl takes care of scope/compile/link

          var parentViewCtrl = $element.parent().data('$auiViewController');
          if (parentViewCtrl) {
            // if the parent is an aui-view, then these are aui-nav-buttons for JUST this aui-view
            parentViewCtrl.navElement(navElementType, spanEle.outerHTML);

          } else {
            // these are buttons for all views that do not have their own aui-nav-buttons
            navBarCtrl.navElement(navElementType, spanEle.outerHTML);
          }

          spanEle = null;
        }
      };
    }
  };
}]);
