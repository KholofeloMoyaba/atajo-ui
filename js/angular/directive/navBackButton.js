/**
 * @ngdoc directive
 * @name auiNavBackButton
 * @module atajoui
 * @restrict E
 * @parent auiNavBar
 * @description
 * Creates a back button inside an {@link atajoui.directive:auiNavBar}.
 *
 * The back button will appear when the user is able to go back in the current navigation stack. By
 * default, the markup of the back button is automatically built using platform-appropriate defaults
 * (iOS back button icon on iOS and Android icon on Android).
 *
 * Additionally, the button is automatically set to `$atajoUiGoBack()` on click/tap. By default, the
 * app will navigate back one view when the back button is clicked.  More advanced behavior is also
 * possible, as outlined below.
 *
 * @usage
 *
 * Recommended markup for default settings:
 *
 * ```html
 * <aui-nav-bar>
 *   <aui-nav-back-button>
 *   </aui-nav-back-button>
 * </aui-nav-bar>
 * ```
 *
 * With custom inner markup, and automatically adds a default click action:
 *
 * ```html
 * <aui-nav-bar>
 *   <aui-nav-back-button class="button-clear">
 *     <i class="aui-arrow-left-c"></i> Back
 *   </aui-nav-back-button>
 * </aui-nav-bar>
 * ```
 *
 * With custom inner markup and custom click action, using {@link atajoui.service:$atajoUiHistory}:
 *
 * ```html
 * <aui-nav-bar ng-controller="MyCtrl">
 *   <aui-nav-back-button class="button-clear"
 *     ng-click="myGoBack()">
 *     <i class="aui-arrow-left-c"></i> Back
 *   </aui-nav-back-button>
 * </aui-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $atajoUiHistory) {
 *   $scope.myGoBack = function() {
 *     $atajoUiHistory.goBack();
 *   };
 * }
 * ```
 */
AtajoUiModule
.directive('auiNavBackButton', ['$atajoUiConfig', '$document', function($atajoUiConfig, $document) {
  return {
    restrict: 'E',
    require: '^auiNavBar',
    compile: function(tElement, tAttrs) {

      // clone the back button, but as a <div>
      var buttonEle = $document[0].createElement('button');
      for (var n in tAttrs.$attr) {
        buttonEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
      }

      if (!tAttrs.ngClick) {
        buttonEle.setAttribute('ng-click', '$atajoUiGoBack()');
      }

      buttonEle.className = 'button back-button hide buttons ' + (tElement.attr('class') || '');
      buttonEle.innerHTML = tElement.html() || '';

      var childNode;
      var hasIcon = hasIconClass(tElement[0]);
      var hasInnerText;
      var hasButtonText;
      var hasPreviousTitle;

      for (var x = 0; x < tElement[0].childNodes.length; x++) {
        childNode = tElement[0].childNodes[x];
        if (childNode.nodeType === 1) {
          if (hasIconClass(childNode)) {
            hasIcon = true;
          } else if (childNode.classList.contains('default-title')) {
            hasButtonText = true;
          } else if (childNode.classList.contains('previous-title')) {
            hasPreviousTitle = true;
          }
        } else if (!hasInnerText && childNode.nodeType === 3) {
          hasInnerText = !!childNode.nodeValue.trim();
        }
      }

      function hasIconClass(ele) {
        return /aui-|icon/.test(ele.className);
      }

      var defaultIcon = $atajoUiConfig.backButton.icon();
      if (!hasIcon && defaultIcon && defaultIcon !== 'none') {
        buttonEle.innerHTML = '<i class="icon ' + defaultIcon + '"></i> ' + buttonEle.innerHTML;
        buttonEle.className += ' button-clear';
      }

      if (!hasInnerText) {
        var buttonTextEle = $document[0].createElement('span');
        buttonTextEle.className = 'back-text';

        if (!hasButtonText && $atajoUiConfig.backButton.text()) {
          buttonTextEle.innerHTML += '<span class="default-title">' + $atajoUiConfig.backButton.text() + '</span>';
        }
        if (!hasPreviousTitle && $atajoUiConfig.backButton.previousTitleText()) {
          buttonTextEle.innerHTML += '<span class="previous-title"></span>';
        }
        buttonEle.appendChild(buttonTextEle);

      }

      tElement.attr('class', 'hide');
      tElement.empty();

      return {
        pre: function($scope, $element, $attr, navBarCtrl) {
          // only register the plain HTML, the navBarCtrl takes care of scope/compile/link
          navBarCtrl.navElement('backButton', buttonEle.outerHTML);
          buttonEle = null;
        }
      };
    }
  };
}]);
