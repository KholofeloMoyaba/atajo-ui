/*
 * We don't document the auiActionSheet directive, we instead document
 * the $atajoUiActionSheet service
 */
AtajoUiModule
.directive('auiActionSheet', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element) {

      var keyUp = function(e) {
        if (e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if (e.target == $element[0]) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
      });

      $document.bind('keyup', keyUp);
      $element.bind('click', backdropClick);
    },
    template: '<div class="actaui-sheet-backdrop">' +
                '<div class="actaui-sheet-wrapper">' +
                  '<div class="actaui-sheet" ng-class="{\'actaui-sheet-has-icons\': $actionSheetHasIcon}">' +
                    '<div class="actaui-sheet-group actaui-sheet-options">' +
                      '<div class="actaui-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                      '<button class="button actaui-sheet-option" ng-click="buttonClicked($index)" ng-class="b.className" ng-repeat="b in buttons" ng-bind-html="b.text"></button>' +
                      '<button class="button destructive actaui-sheet-destructive" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                    '</div>' +
                    '<div class="actaui-sheet-group actaui-sheet-cancel" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]);
