/**
 * @private
 * DEPRECATED, as of v1.0.0-beta14 -------
 */
AtajoUiModule
.factory('$atajoUiViewService', ['$atajoUiHistory', '$log', function($atajoUiHistory, $log) {

  function warn(oldMethod, newMethod) {
    $log.warn('$atajoUiViewService' + oldMethod + ' is deprecated, please use $atajoUiHistory' + newMethod + ' instead: http://ionicframework.com/docs/nightly/api/service/$atajoUiHistory/');
  }

  warn('', '');

  var methodsMap = {
    getCurrentView: 'currentView',
    getBackView: 'backView',
    getForwardView: 'forwardView',
    getCurrentStateName: 'currentStateName',
    nextViewOptions: 'nextViewOptions',
    clearHistory: 'clearHistory'
  };

  forEach(methodsMap, function(newMethod, oldMethod) {
    methodsMap[oldMethod] = function() {
      warn('.' + oldMethod, '.' + newMethod);
      return $atajoUiHistory[newMethod].apply(this, arguments);
    };
  });

  return methodsMap;

}]);
