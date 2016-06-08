/**
 * @ngdoc directive
 * @name keyboardAttach
 * @module atajoui
 * @restrict A
 *
 * @description
 * keyboard-attach is an attribute directive which will cause an element to float above
 * the keyboard when the keyboard shows. Currently only supports the
 * [aui-footer-bar]({{ page.versionHref }}/api/directive/auiFooterBar/) directive.
 *
 * ### Notes
 * - This directive requires the
 * [AtajoUi Keyboard Plugin](https://github.com/driftyco/atajoui-plugins-keyboard).
 * - On Android not in fullscreen mode, i.e. you have
 *   `<preference name="Fullscreen" value="false" />` or no preference in your `config.xml` file,
 *   this directive is unnecessary since it is the default behavior.
 * - On iOS, if there is an input in your footer, you will need to set
 *   `cordova.plugins.Keyboard.disableScroll(true)`.
 *
 * @usage
 *
 * ```html
 *  <aui-footer-bar align-title="left" keyboard-attach class="bar-assertive">
 *    <h1 class="title">Title!</h1>
 *  </aui-footer-bar>
 * ```
 */

AtajoUiModule
.directive('keyboardAttach', function() {
  return function(scope, element) {
    atajoui.on('native.keyboardshow', onShow, window);
    atajoui.on('native.keyboardhide', onHide, window);

    //deprecated
    atajoui.on('native.showkeyboard', onShow, window);
    atajoui.on('native.hidekeyboard', onHide, window);


    var scrollCtrl;

    function onShow(e) {
      if (atajoui.Platform.isAndroid() && !atajoui.Platform.isFullScreen) {
        return;
      }

      //for testing
      var keyboardHeight = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
      element.css('bottom', keyboardHeight + "px");
      scrollCtrl = element.controller('$atajoUiScroll');
      if (scrollCtrl) {
        scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
      }
    }

    function onHide() {
      if (atajoui.Platform.isAndroid() && !atajoui.Platform.isFullScreen) {
        return;
      }

      element.css('bottom', '');
      if (scrollCtrl) {
        scrollCtrl.scrollView.__container.style.bottom = '';
      }
    }

    scope.$on('$destroy', function() {
      atajoui.off('native.keyboardshow', onShow, window);
      atajoui.off('native.keyboardhide', onHide, window);

      //deprecated
      atajoui.off('native.showkeyboard', onShow, window);
      atajoui.off('native.hidekeyboard', onHide, window);
    });
  };
});

function keyboardAttachGetClientHeight(element) {
  return element.clientHeight;
}
