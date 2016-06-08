/**
* @ngdoc directive
* @name auiTitle
* @module atajoui
* @restrict E
*
* Used for titles in header and nav bars. New in 1.2
*
* Identical to <div class="title"> but with future compatibility for AtajoUi 2
*
* @usage
*
* ```html
* <aui-nav-bar>
*   <aui-title>Hello</aui-title>
* <aui-nav-bar>
* ```
*/
AtajoUiModule
.directive('auiTitle', [function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('title');
    }
  };
}]);
