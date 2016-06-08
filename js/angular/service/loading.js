
var LOADING_TPL =
  '<div class="loading-container">' +
    '<div class="loading">' +
    '</div>' +
  '</div>';

/**
 * @ngdoc service
 * @name $atajoUiLoading
 * @module atajoui
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction.
 *
 * @usage
 * ```js
 * angular.module('LoadingApp', ['atajoui'])
 * .controller('LoadingCtrl', function($scope, $atajoUiLoading) {
 *   $scope.show = function() {
 *     $atajoUiLoading.show({
 *       template: 'Loading...'
 *     }).then(function(){
 *        console.log("The loading indicator is now displayed");
 *     });
 *   };
 *   $scope.hide = function(){
 *     $atajoUiLoading.hide().then(function(){
 *        console.log("The loading indicator is now hidden");
 *     });
 *   };
 * });
 * ```
 */
/**
 * @ngdoc object
 * @name $atajoUiLoadingConfig
 * @module atajoui
 * @description
 * Set the default options to be passed to the {@link atajoui.service:$atajoUiLoading} service.
 *
 * @usage
 * ```js
 * var app = angular.module('myApp', ['atajoui'])
 * app.constant('$atajoUiLoadingConfig', {
 *   template: 'Default Loading Template...'
 * });
 * app.controller('AppCtrl', function($scope, $atajoUiLoading) {
 *   $scope.showLoading = function() {
 *     //options default to values in $atajoUiLoadingConfig
 *     $atajoUiLoading.show().then(function(){
 *        console.log("The loading indicator is now displayed");
 *     });
 *   };
 * });
 * ```
 */
AtajoUiModule
.constant('$atajoUiLoadingConfig', {
  template: '<aui-spinner></aui-spinner>'
})
.factory('$atajoUiLoading', [
  '$atajoUiLoadingConfig',
  '$atajoUiBody',
  '$atajoUiTemplateLoader',
  '$atajoUiBackdrop',
  '$timeout',
  '$q',
  '$log',
  '$compile',
  '$atajoUiPlatform',
  '$rootScope',
  'ATAJOUI_BACK_PRIORITY',
function($atajoUiLoadingConfig, $atajoUiBody, $atajoUiTemplateLoader, $atajoUiBackdrop, $timeout, $q, $log, $compile, $atajoUiPlatform, $rootScope, ATAJOUI_BACK_PRIORITY) {

  var loaderInstance;
  //default values
  var deregisterBackAction = noop;
  var deregisterStateListener1 = noop;
  var deregisterStateListener2 = noop;
  var loadingShowDelay = $q.when();

  return {
    /**
     * @ngdoc method
     * @name $atajoUiLoading#show
     * @description Shows a loading indicator. If the indicator is already shown,
     * it will set the options given and keep the indicator shown.
     * @returns {promise} A promise which is resolved when the loading indicator is presented.
     * @param {object} opts The options for the loading indicator. Available properties:
     *  - `{string=}` `template` The html content of the indicator.
     *  - `{string=}` `templateUrl` The url of an html template to load as the content of the indicator.
     *  - `{object=}` `scope` The scope to be a child of. Default: creates a child of $rootScope.
     *  - `{boolean=}` `noBackdrop` Whether to hide the backdrop. By default it will be shown.
     *  - `{boolean=}` `hideOnStateChange` Whether to hide the loading spinner when navigating
     *    to a new state. Default false.
     *  - `{number=}` `delay` How many milliseconds to delay showing the indicator. By default there is no delay.
     *  - `{number=}` `duration` How many milliseconds to wait until automatically
     *  hiding the indicator. By default, the indicator will be shown until `.hide()` is called.
     */
    show: showLoader,
    /**
     * @ngdoc method
     * @name $atajoUiLoading#hide
     * @description Hides the loading indicator, if shown.
     * @returns {promise} A promise which is resolved when the loading indicator is hidden.
     */
    hide: hideLoader,
    /**
     * @private for testing
     */
    _getLoader: getLoader
  };

  function getLoader() {
    if (!loaderInstance) {
      loaderInstance = $atajoUiTemplateLoader.compile({
        template: LOADING_TPL,
        appendTo: $atajoUiBody.get()
      })
      .then(function(self) {
        self.show = function(options) {
          var templatePromise = options.templateUrl ?
            $atajoUiTemplateLoader.load(options.templateUrl) :
            //options.content: deprecated
            $q.when(options.template || options.content || '');

          self.scope = options.scope || self.scope;

          if (!self.isShown) {
            //options.showBackdrop: deprecated
            self.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
            if (self.hasBackdrop) {
              $atajoUiBackdrop.retain();
              $atajoUiBackdrop.getElement().addClass('backdrop-loading');
            }
          }

          if (options.duration) {
            $timeout.cancel(self.durationTimeout);
            self.durationTimeout = $timeout(
              angular.bind(self, self.hide),
              +options.duration
            );
          }

          deregisterBackAction();
          //Disable hardware back button while loading
          deregisterBackAction = $atajoUiPlatform.registerBackButtonAction(
            noop,
            ATAJOUI_BACK_PRIORITY.loading
          );

          templatePromise.then(function(html) {
            if (html) {
              var loading = self.element.children();
              loading.html(html);
              $compile(loading.contents())(self.scope);
            }

            //Don't show until template changes
            if (self.isShown) {
              self.element.addClass('visible');
              atajoui.requestAnimationFrame(function() {
                if (self.isShown) {
                  self.element.addClass('active');
                  $atajoUiBody.addClass('loading-active');
                }
              });
            }
          });

          self.isShown = true;
        };
        self.hide = function() {

          deregisterBackAction();
          if (self.isShown) {
            if (self.hasBackdrop) {
              $atajoUiBackdrop.release();
              $atajoUiBackdrop.getElement().removeClass('backdrop-loading');
            }
            self.element.removeClass('active');
            $atajoUiBody.removeClass('loading-active');
            self.element.removeClass('visible');
            atajoui.requestAnimationFrame(function() {
              !self.isShown && self.element.removeClass('visible');
            });
          }
          $timeout.cancel(self.durationTimeout);
          self.isShown = false;
          var loading = self.element.children();
          loading.html("");
        };

        return self;
      });
    }
    return loaderInstance;
  }

  function showLoader(options) {
    options = extend({}, $atajoUiLoadingConfig || {}, options || {});
    // use a default delay of 100 to avoid some issues reported on github
    // https://github.com/driftyco/ionic/issues/3717
    var delay = options.delay || options.showDelay || 0;

    deregisterStateListener1();
    deregisterStateListener2();
    if (options.hideOnStateChange) {
      deregisterStateListener1 = $rootScope.$on('$stateChangeSuccess', hideLoader);
      deregisterStateListener2 = $rootScope.$on('$stateChangeError', hideLoader);
    }

    //If loading.show() was called previously, cancel it and show with our new options
    $timeout.cancel(loadingShowDelay);
    loadingShowDelay = $timeout(noop, delay);
    return loadingShowDelay.then(getLoader).then(function(loader) {
      return loader.show(options);
    });
  }

  function hideLoader() {
    deregisterStateListener1();
    deregisterStateListener2();
    $timeout.cancel(loadingShowDelay);
    return getLoader().then(function(loader) {
      return loader.hide();
    });
  }
}]);
