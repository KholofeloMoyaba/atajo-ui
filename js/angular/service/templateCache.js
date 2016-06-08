// closure to keep things neat
(function() {
  var templatesToCache = [];

/**
 * @ngdoc service
 * @name $atajoUiTemplateCache
 * @module atajoui
 * @description A service that preemptively caches template files to eliminate transition flicker and boost performance.
 * @usage
 * State templates are cached automatically, but you can optionally cache other templates.
 *
 * ```js
 * $atajoUiTemplateCache('myNgIncludeTemplate.html');
 * ```
 *
 * Optionally disable all preemptive caching with the `$atajoUiConfigProvider` or individual states by setting `prefetchTemplate`
 * in the `$state` definition
 *
 * ```js
 *   angular.module('myApp', ['atajoui'])
 *   .config(function($stateProvider, $atajoUiConfigProvider) {
 *
 *     // disable preemptive template caching globally
 *     $atajoUiConfigProvider.templates.prefetch(false);
 *
 *     // disable individual states
 *     $stateProvider
 *       .state('tabs', {
 *         url: "/tab",
 *         abstract: true,
 *         prefetchTemplate: false,
 *         templateUrl: "tabs-templates/tabs.html"
 *       })
 *       .state('tabs.home', {
 *         url: "/home",
 *         views: {
 *           'home-tab': {
 *             prefetchTemplate: false,
 *             templateUrl: "tabs-templates/home.html",
 *             controller: 'HomeTabCtrl'
 *           }
 *         }
 *       });
 *   });
 * ```
 */
AtajoUiModule
.factory('$atajoUiTemplateCache', [
'$http',
'$templateCache',
'$timeout',
function($http, $templateCache, $timeout) {
  var toCache = templatesToCache,
      hasRun;

  function $atajoUiTemplateCache(templates) {
    if (typeof templates === 'undefined') {
      return run();
    }
    if (isString(templates)) {
      templates = [templates];
    }
    forEach(templates, function(template) {
      toCache.push(template);
    });
    if (hasRun) {
      run();
    }
  }

  // run through methods - internal method
  function run() {
    var template;
    $atajoUiTemplateCache._runCount++;

    hasRun = true;
    // ignore if race condition already zeroed out array
    if (toCache.length === 0) return;

    var i = 0;
    while (i < 4 && (template = toCache.pop())) {
      // note that inline templates are ignored by this request
      if (isString(template)) $http.get(template, { cache: $templateCache });
      i++;
    }
    // only preload 3 templates a second
    if (toCache.length) {
      $timeout(run, 1000);
    }
  }

  // exposing for testing
  $atajoUiTemplateCache._runCount = 0;
  // default method
  return $atajoUiTemplateCache;
}])

// Intercepts the $stateprovider.state() command to look for templateUrls that can be cached
.config([
'$stateProvider',
'$atajoUiConfigProvider',
function($stateProvider, $atajoUiConfigProvider) {
  var stateProviderState = $stateProvider.state;
  $stateProvider.state = function(stateName, definition) {
    // don't even bother if it's disabled. note, another config may run after this, so it's not a catch-all
    if (typeof definition === 'object') {
      var enabled = definition.prefetchTemplate !== false && templatesToCache.length < $atajoUiConfigProvider.templates.maxPrefetch();
      if (enabled && isString(definition.templateUrl)) templatesToCache.push(definition.templateUrl);
      if (angular.isObject(definition.views)) {
        for (var key in definition.views) {
          enabled = definition.views[key].prefetchTemplate !== false && templatesToCache.length < $atajoUiConfigProvider.templates.maxPrefetch();
          if (enabled && isString(definition.views[key].templateUrl)) templatesToCache.push(definition.views[key].templateUrl);
        }
      }
    }
    return stateProviderState.call($stateProvider, stateName, definition);
  };
}])

// process the templateUrls collected by the $stateProvider, adding them to the cache
.run(['$atajoUiTemplateCache', function($atajoUiTemplateCache) {
  $atajoUiTemplateCache();
}]);

})();
