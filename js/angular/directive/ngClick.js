AtajoUiModule

.config(['$provide', function($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}])

/**
 * @private
 */
.factory('$atajoUiNgClick', ['$parse', function($parse) {
  return function(scope, element, clickExpr) {
    var clickHandler = angular.isFunction(clickExpr) ?
      clickExpr :
      $parse(clickExpr);

    element.on('click', function(event) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (event)});
      });
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = noop;
  };
}])

.directive('ngClick', ['$atajoUiNgClick', function($atajoUiNgClick) {
  return function(scope, element, attr) {
    $atajoUiNgClick(scope, element, attr.ngClick);
  };
}])

.directive('auiStopEvent', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      element.bind(attr.auiStopEvent, eventStopPropagation);
    }
  };
});
function eventStopPropagation(e) {
  e.stopPropagation();
}
