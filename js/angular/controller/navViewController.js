AtajoUiModule
.controller('$atajoUiNavView', [
  '$scope',
  '$element',
  '$attrs',
  '$compile',
  '$controller',
  '$atajoUiNavBarDelegate',
  '$atajoUiNavViewDelegate',
  '$atajoUiHistory',
  '$atajoUiViewSwitcher',
  '$atajoUiConfig',
  '$atajoUiScrollDelegate',
  '$atajoUiSideMenuDelegate',
function($scope, $element, $attrs, $compile, $controller, $atajoUiNavBarDelegate, $atajoUiNavViewDelegate, $atajoUiHistory, $atajoUiViewSwitcher, $atajoUiConfig, $atajoUiScrollDelegate, $atajoUiSideMenuDelegate) {

  var DATA_ELE_IDENTIFIER = '$eleId';
  var DATA_DESTROY_ELE = '$destroyEle';
  var DATA_NO_CACHE = '$noCache';
  var VIEW_STATUS_ACTIVE = 'active';
  var VIEW_STATUS_CACHED = 'cached';

  var self = this;
  var direction;
  var isPrimary = false;
  var navBarDelegate;
  var activeEleId;
  var navViewAttr = $atajoUiViewSwitcher.navViewAttr;
  var disableRenderStartViewId, disableAnimation;

  self.scope = $scope;
  self.element = $element;

  self.init = function() {
    var navViewName = $attrs.name || '';

    // Find the details of the parent view directive (if any) and use it
    // to derive our own qualified view name, then hang our own details
    // off the DOM so child directives can find it.
    var parent = $element.parent().inheritedData('$uiView');
    var parentViewName = ((parent && parent.state) ? parent.state.name : '');
    if (navViewName.indexOf('@') < 0) navViewName = navViewName + '@' + parentViewName;

    var viewData = { name: navViewName, state: null };
    $element.data('$uiView', viewData);

    var deregisterInstance = $atajoUiNavViewDelegate._registerInstance(self, $attrs.delegateHandle);
    $scope.$on('$destroy', function() {
      deregisterInstance();

      // ensure no scrolls have been left frozen
      if (self.isSwipeFreeze) {
        $atajoUiScrollDelegate.freezeAllScrolls(false);
      }
    });

    $scope.$on('$atajoUiHistory.deselect', self.cacheCleanup);
    $scope.$on('$atajoUiTabs.top', onTabsTop);
    $scope.$on('$atajoUiSubheader', onBarSubheader);

    $scope.$on('$atajoUiTabs.beforeLeave', onTabsLeave);
    $scope.$on('$atajoUiTabs.afterLeave', onTabsLeave);
    $scope.$on('$atajoUiTabs.leave', onTabsLeave);

    atajoui.Platform.ready(function() {
      if ( atajoui.Platform.isWebView() && atajoui.Platform.isIOS() ) {
          self.initSwipeBack();
      }
    });

    return viewData;
  };


  self.register = function(viewLocals) {
    var leavingView = extend({}, $atajoUiHistory.currentView());

    // register that a view is coming in and get info on how it should transition
    var registerData = $atajoUiHistory.register($scope, viewLocals);

    // update which direction
    self.update(registerData);

    // begin rendering and transitioning
    var enteringView = $atajoUiHistory.getViewById(registerData.viewId) || {};

    var renderStart = (disableRenderStartViewId !== registerData.viewId);
    self.render(registerData, viewLocals, enteringView, leavingView, renderStart, true);
  };


  self.update = function(registerData) {
    // always reset that this is the primary navView
    isPrimary = true;

    // remember what direction this navView should use
    // this may get updated later by a child navView
    direction = registerData.direction;

    var parentNavViewCtrl = $element.parent().inheritedData('$auiNavViewController');
    if (parentNavViewCtrl) {
      // this navView is nested inside another one
      // update the parent to use this direction and not
      // the other it originally was set to

      // inform the parent navView that it is not the primary navView
      parentNavViewCtrl.isPrimary(false);

      if (direction === 'enter' || direction === 'exit') {
        // they're entering/exiting a history
        // find parent navViewController
        parentNavViewCtrl.direction(direction);

        if (direction === 'enter') {
          // reset the direction so this navView doesn't animate
          // because it's parent will
          direction = 'none';
        }
      }
    }
  };


  self.render = function(registerData, viewLocals, enteringView, leavingView, renderStart, renderEnd) {
    // register the view and figure out where it lives in the various
    // histories and nav stacks, along with how views should enter/leave
    var switcher = $atajoUiViewSwitcher.create(self, viewLocals, enteringView, leavingView, renderStart, renderEnd);

    // init the rendering of views for this navView directive
    switcher.init(registerData, function() {
      // the view is now compiled, in the dom and linked, now lets transition the views.
      // this uses a callback incase THIS nav-view has a nested nav-view, and after the NESTED
      // nav-view links, the NESTED nav-view would update which direction THIS nav-view should use

      // kick off the transition of views
      switcher.transition(self.direction(), registerData.enableBack, !disableAnimation);

      // reset private vars for next time
      disableRenderStartViewId = disableAnimation = null;
    });

  };


  self.beforeEnter = function(transitionData) {
    if (isPrimary) {
      // only update this nav-view's nav-bar if this is the primary nav-view
      navBarDelegate = transitionData.navBarDelegate;
      var associatedNavBarCtrl = getAssociatedNavBarCtrl();
      associatedNavBarCtrl && associatedNavBarCtrl.update(transitionData);
      navSwipeAttr('');
    }
  };


  self.activeEleId = function(eleId) {
    if (arguments.length) {
      activeEleId = eleId;
    }
    return activeEleId;
  };


  self.transitionEnd = function() {
    var viewElements = $element.children();
    var x, l, viewElement;

    for (x = 0, l = viewElements.length; x < l; x++) {
      viewElement = viewElements.eq(x);

      if (viewElement.data(DATA_ELE_IDENTIFIER) === activeEleId) {
        // this is the active element
        navViewAttr(viewElement, VIEW_STATUS_ACTIVE);

      } else if (navViewAttr(viewElement) === 'leaving' || navViewAttr(viewElement) === VIEW_STATUS_ACTIVE || navViewAttr(viewElement) === VIEW_STATUS_CACHED) {
        // this is a leaving element or was the former active element, or is an cached element
        if (viewElement.data(DATA_DESTROY_ELE) || viewElement.data(DATA_NO_CACHE)) {
          // this element shouldn't stay cached
          $atajoUiViewSwitcher.destroyViewEle(viewElement);

        } else {
          // keep in the DOM, mark as cached
          navViewAttr(viewElement, VIEW_STATUS_CACHED);

          // disconnect the leaving scope
          atajoui.Utils.disconnectScope(viewElement.scope());
        }
      }
    }

    navSwipeAttr('');

    // ensure no scrolls have been left frozen
    if (self.isSwipeFreeze) {
      $atajoUiScrollDelegate.freezeAllScrolls(false);
    }
  };


  function onTabsLeave(ev, data) {
    var viewElements = $element.children();
    var viewElement, viewScope;

    for (var x = 0, l = viewElements.length; x < l; x++) {
      viewElement = viewElements.eq(x);
      if (navViewAttr(viewElement) == VIEW_STATUS_ACTIVE) {
        viewScope = viewElement.scope();
        viewScope && viewScope.$emit(ev.name.replace('Tabs', 'View'), data);
        viewScope && viewScope.$broadcast(ev.name.replace('Tabs', 'ParentView'), data);
        break;
      }
    }
  }


  self.cacheCleanup = function() {
    var viewElements = $element.children();
    for (var x = 0, l = viewElements.length; x < l; x++) {
      if (viewElements.eq(x).data(DATA_DESTROY_ELE)) {
        $atajoUiViewSwitcher.destroyViewEle(viewElements.eq(x));
      }
    }
  };


  self.clearCache = function(stateIds) {
    var viewElements = $element.children();
    var viewElement, viewScope, x, l, y, eleIdentifier;

    for (x = 0, l = viewElements.length; x < l; x++) {
      viewElement = viewElements.eq(x);

      if (stateIds) {
        eleIdentifier = viewElement.data(DATA_ELE_IDENTIFIER);

        for (y = 0; y < stateIds.length; y++) {
          if (eleIdentifier === stateIds[y]) {
            $atajoUiViewSwitcher.destroyViewEle(viewElement);
          }
        }
        continue;
      }

      if (navViewAttr(viewElement) == VIEW_STATUS_CACHED) {
        $atajoUiViewSwitcher.destroyViewEle(viewElement);

      } else if (navViewAttr(viewElement) == VIEW_STATUS_ACTIVE) {
        viewScope = viewElement.scope();
        viewScope && viewScope.$broadcast('$atajoUiView.clearCache');
      }

    }
  };


  self.getViewElements = function() {
    return $element.children();
  };


  self.appendViewElement = function(viewEle, viewLocals) {
    // compile the entering element and get the link function
    var linkFn = $compile(viewEle);

    $element.append(viewEle);

    var viewScope = $scope.$new();

    if (viewLocals && viewLocals.$$controller) {
      viewLocals.$scope = viewScope;
      var controller = $controller(viewLocals.$$controller, viewLocals);
      if (viewLocals.$$controllerAs) {
        viewScope[viewLocals.$$controllerAs] = controller;
      }
      $element.children().data('$ngControllerController', controller);
    }

    linkFn(viewScope);

    return viewScope;
  };


  self.title = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.title(val);
  };


  /**
   * @ngdoc method
   * @name $atajoUiNavView#enableBackButton
   * @description Enable/disable if the back button can be shown or not. For
   * example, the very first view in the navigation stack would not have a
   * back view, so the back button would be disabled.
   */
  self.enableBackButton = function(shouldEnable) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.enableBackButton(shouldEnable);
  };


  /**
   * @ngdoc method
   * @name $atajoUiNavView#showBackButton
   * @description Show/hide the nav bar active back button. If the back button
   * is not possible this will not force the back button to show. The
   * `enableBackButton()` method handles if a back button is even possible or not.
   */
  self.showBackButton = function(shouldShow) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    if (associatedNavBarCtrl) {
      if (arguments.length) {
        return associatedNavBarCtrl.showActiveBackButton(shouldShow);
      }
      return associatedNavBarCtrl.showActiveBackButton();
    }
    return true;
  };


  self.showBar = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    if (associatedNavBarCtrl) {
      if (arguments.length) {
        return associatedNavBarCtrl.showBar(val);
      }
      return associatedNavBarCtrl.showBar();
    }
    return true;
  };


  self.isPrimary = function(val) {
    if (arguments.length) {
      isPrimary = val;
    }
    return isPrimary;
  };


  self.direction = function(val) {
    if (arguments.length) {
      direction = val;
    }
    return direction;
  };


  self.initSwipeBack = function() {
    var swipeBackHitWidth = $atajoUiConfig.views.swipeBackHitWidth();
    var viewTransition, associatedNavBarCtrl, backView;
    var deregDragStart, deregDrag, deregRelease;
    var windowWidth, startDragX, dragPoints;
    var cancelData = {};

    function onDragStart(ev) {
      if (!isPrimary || !$atajoUiConfig.views.swipeBackEnabled() || $atajoUiSideMenuDelegate.isOpenRight() ) return;


      startDragX = getDragX(ev);
      if (startDragX > swipeBackHitWidth) return;

      backView = $atajoUiHistory.backView();

      var currentView = $atajoUiHistory.currentView();

      if (!backView || backView.historyId !== currentView.historyId || currentView.canSwipeBack === false) return;

      if (!windowWidth) windowWidth = window.innerWidth;

      self.isSwipeFreeze = $atajoUiScrollDelegate.freezeAllScrolls(true);

      var registerData = {
        direction: 'back'
      };

      dragPoints = [];

      cancelData = {
        showBar: self.showBar(),
        showBackButton: self.showBackButton()
      };

      var switcher = $atajoUiViewSwitcher.create(self, registerData, backView, currentView, true, false);
      switcher.loadViewElements(registerData);
      switcher.render(registerData);

      viewTransition = switcher.transition('back', $atajoUiHistory.enabledBack(backView), true);

      associatedNavBarCtrl = getAssociatedNavBarCtrl();

      deregDrag = atajoui.onGesture('drag', onDrag, $element[0]);
      deregRelease = atajoui.onGesture('release', onRelease, $element[0]);
    }

    function onDrag(ev) {
      if (isPrimary && viewTransition) {
        var dragX = getDragX(ev);

        dragPoints.push({
          t: Date.now(),
          x: dragX
        });

        if (dragX >= windowWidth - 15) {
          onRelease(ev);

        } else {
          var step = Math.min(Math.max(getSwipeCompletion(dragX), 0), 1);
          viewTransition.run(step);
          associatedNavBarCtrl && associatedNavBarCtrl.activeTransition && associatedNavBarCtrl.activeTransition.run(step);
        }

      }
    }

    function onRelease(ev) {
      if (isPrimary && viewTransition && dragPoints && dragPoints.length > 1) {

        var now = Date.now();
        var releaseX = getDragX(ev);
        var startDrag = dragPoints[dragPoints.length - 1];

        for (var x = dragPoints.length - 2; x >= 0; x--) {
          if (now - startDrag.t > 200) {
            break;
          }
          startDrag = dragPoints[x];
        }

        var isSwipingRight = (releaseX >= dragPoints[dragPoints.length - 2].x);
        var releaseSwipeCompletion = getSwipeCompletion(releaseX);
        var velocity = Math.abs(startDrag.x - releaseX) / (now - startDrag.t);

        // private variables because ui-router has no way to pass custom data using $state.go
        disableRenderStartViewId = backView.viewId;
        disableAnimation = (releaseSwipeCompletion < 0.03 || releaseSwipeCompletion > 0.97);

        if (isSwipingRight && (releaseSwipeCompletion > 0.5 || velocity > 0.1)) {
          // complete view transition on release
          var speed = (velocity > 0.5 || velocity < 0.05 || releaseX > windowWidth - 45) ? 'fast' : 'slow';
          navSwipeAttr(disableAnimation ? '' : speed);
          backView.go();
          associatedNavBarCtrl && associatedNavBarCtrl.activeTransition && associatedNavBarCtrl.activeTransition.complete(!disableAnimation, speed);

        } else {
          // cancel view transition on release
          navSwipeAttr(disableAnimation ? '' : 'fast');
          disableRenderStartViewId = null;
          viewTransition.cancel(!disableAnimation);
          associatedNavBarCtrl && associatedNavBarCtrl.activeTransition && associatedNavBarCtrl.activeTransition.cancel(!disableAnimation, 'fast', cancelData);
          disableAnimation = null;
        }

      }

      atajoui.offGesture(deregDrag, 'drag', onDrag);
      atajoui.offGesture(deregRelease, 'release', onRelease);

      windowWidth = viewTransition = dragPoints = null;

      self.isSwipeFreeze = $atajoUiScrollDelegate.freezeAllScrolls(false);
    }

    function getDragX(ev) {
      return atajoui.tap.pointerCoord(ev.gesture.srcEvent).x;
    }

    function getSwipeCompletion(dragX) {
      return (dragX - startDragX) / windowWidth;
    }

    deregDragStart = atajoui.onGesture('dragstart', onDragStart, $element[0]);

    $scope.$on('$destroy', function() {
      atajoui.offGesture(deregDragStart, 'dragstart', onDragStart);
      atajoui.offGesture(deregDrag, 'drag', onDrag);
      atajoui.offGesture(deregRelease, 'release', onRelease);
      self.element = viewTransition = associatedNavBarCtrl = null;
    });
  };


  function navSwipeAttr(val) {
    atajoui.DomUtil.cachedAttr($element, 'nav-swipe', val);
  }


  function onTabsTop(ev, isTabsTop) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.hasTabsTop(isTabsTop);
  }

  function onBarSubheader(ev, isBarSubheader) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.hasBarSubheader(isBarSubheader);
  }

  function getAssociatedNavBarCtrl() {
    if (navBarDelegate) {
      for (var x = 0; x < $atajoUiNavBarDelegate._instances.length; x++) {
        if ($atajoUiNavBarDelegate._instances[x].$$delegateHandle == navBarDelegate) {
          return $atajoUiNavBarDelegate._instances[x];
        }
      }
    }
    return $element.inheritedData('$auiNavBarController');
  }

}]);
