/**
* @ngdoc directive
* @name auiInput
* @parent atajoui.directive:auiList
* @module atajoui
* @restrict E
* Creates a text input group that can easily be focused
*
* @usage
*
* ```html
* <aui-list>
*   <aui-input>
*     <input type="text" placeholder="First Name">
*   </aui-input>
*
*   <aui-input>
*     <aui-label>Username</aui-label>
*     <input type="text">
*   </aui-input>
* </aui-list>
* ```
*/

var labelIds = -1;

AtajoUiModule
.directive('auiInput', [function() {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', function($scope, $element) {
      this.$scope = $scope;
      this.$element = $element;

      this.setInputAriaLabeledBy = function(id) {
        var inputs = $element[0].querySelectorAll('input,textarea');
        inputs.length && inputs[0].setAttribute('aria-labelledby', id);
      };

      this.focus = function() {
        var inputs = $element[0].querySelectorAll('input,textarea');
        inputs.length && inputs[0].focus();
      };
    }]
  };
}]);

/**
* @ngdoc directive
* @name auiLabel
* @parent atajoui.directive:auiList
* @module atajoui
* @restrict E
*
* New in AtajoUi 1.2. It is strongly recommended that you use `<aui-label>` in place
* of any `<label>` elements for maximum cross-browser support and performance.
*
* Creates a label for a form input.
*
* @usage
*
* ```html
* <aui-list>
*   <aui-input>
*     <aui-label>Username</aui-label>
*     <input type="text">
*   </aui-input>
* </aui-list>
* ```
*/
AtajoUiModule
.directive('auiLabel', [function() {
  return {
    restrict: 'E',
    require: '?^auiInput',
    compile: function() {

      return function link($scope, $element, $attrs, auiInputCtrl) {
        var element = $element[0];

        $element.addClass('input-label');

        $element.attr('aria-label', $element.text());
        var id = element.id || '_label-' + ++labelIds;

        if (!element.id) {
          $element.attr('id', id);
        }

        if (auiInputCtrl) {

          auiInputCtrl.setInputAriaLabeledBy(id);

          $element.on('click', function() {
            auiInputCtrl.focus();
          });
        }
      };
    }
  };
}]);

/**
 * Input label adds accessibility to <span class="input-label">.
 */
AtajoUiModule
.directive('inputLabel', [function() {
  return {
    restrict: 'C',
    require: '?^auiInput',
    compile: function() {

      return function link($scope, $element, $attrs, auiInputCtrl) {
        var element = $element[0];

        $element.attr('aria-label', $element.text());
        var id = element.id || '_label-' + ++labelIds;

        if (!element.id) {
          $element.attr('id', id);
        }

        if (auiInputCtrl) {
          auiInputCtrl.setInputAriaLabeledBy(id);
        }

      };
    }
  };
}]);
