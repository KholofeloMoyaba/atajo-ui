/**
 * @ngdoc directive
 * @name auiNavTitle
 * @module atajoui
 * @restrict E
 * @parent auiNavView
 *
 * @description
 *
 * The nav title directive replaces an {@link atajoui.directive:auiNavBar} title text with
 * custom HTML from within an {@link atajoui.directive:auiView} template. This gives each
 * view the ability to specify its own custom title element, such as an image or any HTML,
 * rather than being text-only. Alternatively, text-only titles can be updated using the
 * `view-title` {@link atajoui.directive:auiView} attribute.
 *
 * Note that `aui-nav-title` must be an immediate descendant of the `aui-view` or
 * `aui-nav-bar` element (basically don't wrap it in another div).
 *
 * @usage
 * ```html
 * <aui-nav-bar>
 * </aui-nav-bar>
 * <aui-nav-view>
 *   <aui-view>
 *     <aui-nav-title>
 *       <img src="logo.svg">
 *     </aui-nav-title>
 *     <aui-content>
 *       Some super content here!
 *     </aui-content>
 *   </aui-view>
 * </aui-nav-view>
 * ```
 *
 */
AtajoUiModule
.directive('auiNavTitle', ['$document', function($document) {
  return {
    require: '^auiNavBar',
    restrict: 'E',
    compile: function(tElement, tAttrs) {
      var navElementType = 'title';
      var spanEle = $document[0].createElement('span');
      for (var n in tAttrs.$attr) {
        spanEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
      }
      spanEle.classList.add('nav-bar-title');
      spanEle.innerHTML = tElement.html();

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
