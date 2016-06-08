var ITEM_TPL_OPTION_BUTTONS =
  '<div class="item-options invisible">' +
  '</div>';
/**
* @ngdoc directive
* @name auiOptionButton
* @parent atajoui.directive:auiItem
* @module atajoui
* @restrict E
* @description
* Creates an option button inside a list item, that is visible when the item is swiped
* to the left by the user.  Swiped open option buttons can be hidden with
* {@link atajoui.service:$atajoUiListDelegate#closeOptionButtons $atajoUiListDelegate.closeOptionButtons}.
*
* Can be assigned any button class.
*
* See {@link atajoui.directive:auiList} for a complete example & explanation.
*
* @usage
*
* ```html
* <aui-list>
*   <aui-item>
*     I love kittens!
*     <aui-optaui-button class="button-positive">Share</aui-optaui-button>
*     <aui-optaui-button class="button-assertive">Edit</aui-optaui-button>
*   </aui-item>
* </aui-list>
* ```
*/
AtajoUiModule.directive('auiOptionButton', [function() {
  function stopPropagation(e) {
    e.stopPropagation();
  }
  return {
    restrict: 'E',
    require: '^auiItem',
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr['class'] || '') + ' button', true);
      return function($scope, $element, $attr, itemCtrl) {
        if (!itemCtrl.optionsContainer) {
          itemCtrl.optionsContainer = jqLite(ITEM_TPL_OPTION_BUTTONS);
          itemCtrl.$element.append(itemCtrl.optionsContainer);
        }
        itemCtrl.optionsContainer.append($element);

        itemCtrl.$element.addClass('item-right-editable');

        //Don't bubble click up to main .item
        $element.on('click', stopPropagation);
      };
    }
  };
}]);
