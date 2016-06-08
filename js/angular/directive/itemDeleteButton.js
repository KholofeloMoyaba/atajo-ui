var ITEM_TPL_DELETE_BUTTON =
  '<div class="item-left-edit item-delete enable-pointer-events">' +
  '</div>';
/**
* @ngdoc directive
* @name auiDeleteButton
* @parent atajoui.directive:auiItem
* @module atajoui
* @restrict E
* Creates a delete button inside a list item, that is visible when the
* {@link atajoui.directive:auiList auiList parent's} `show-delete` evaluates to true or
* `$atajoUiListDelegate.showDelete(true)` is called.
*
* Takes any ionicon as a class.
*
* See {@link atajoui.directive:auiList} for a complete example & explanation.
*
* @usage
*
* ```html
* <aui-list show-delete="shouldShowDelete">
*   <aui-item>
*     <aui-delete-button class="aui-minus-circled"></aui-delete-button>
*     Hello, list item!
*   </aui-item>
* </aui-list>
* <aui-toggle ng-model="shouldShowDelete">
*   Show Delete?
* </aui-toggle>
* ```
*/
AtajoUiModule
.directive('auiDeleteButton', function() {

  function stopPropagation(ev) {
    ev.stopPropagation();
  }

  return {
    restrict: 'E',
    require: ['^^auiItem', '^?auiList'],
    //Run before anything else, so we can move it before other directives process
    //its location (eg ngIf relies on the location of the directive in the dom)
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      //Add the classes we need during the compile phase, so that they stay
      //even if something else like ngIf removes the element and re-addss it
      $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
      return function($scope, $element, $attr, ctrls) {
        var itemCtrl = ctrls[0];
        var listCtrl = ctrls[1];
        var container = jqLite(ITEM_TPL_DELETE_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-left-editable');

        //Don't bubble click up to main .item
        $element.on('click', stopPropagation);

        init();
        $scope.$on('$atajoui.reconnectScope', init);
        function init() {
          listCtrl = listCtrl || $element.controller('auiList');
          if (listCtrl && listCtrl.showDelete()) {
            container.addClass('visible active');
          }
        }
      };
    }
  };
});
