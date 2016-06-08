(function(document, atajoui) {
  'use strict';

  // AtajoUi CSS polyfills
  atajoui.CSS = {};
  atajoui.CSS.TRANSITION = [];
  atajoui.CSS.TRANSFORM = [];

  atajoui.EVENTS = {};

  (function() {

    // transform
    var i, keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                   '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

    for (i = 0; i < keys.length; i++) {
      if (document.documentElement.style[keys[i]] !== undefined) {
        atajoui.CSS.TRANSFORM = keys[i];
        break;
      }
    }

    // transition
    keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
    for (i = 0; i < keys.length; i++) {
      if (document.documentElement.style[keys[i]] !== undefined) {
        atajoui.CSS.TRANSITION = keys[i];
        break;
      }
    }

    // Fallback in case the keys don't exist at all
    atajoui.CSS.TRANSITION = atajoui.CSS.TRANSITION || 'transition';

    // The only prefix we care about is webkit for transitions.
    var isWebkit = atajoui.CSS.TRANSITION.indexOf('webkit') > -1;

    // transition duration
    atajoui.CSS.TRANSITION_DURATION = (isWebkit ? '-webkit-' : '') + 'transitaui-duration';

    // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
    atajoui.CSS.TRANSITIONEND = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
  })();

  (function() {
      var touchStartEvent = 'touchstart';
      var touchMoveEvent = 'touchmove';
      var touchEndEvent = 'touchend';
      var touchCancelEvent = 'touchcancel';

      if (window.navigator.pointerEnabled) {
        touchStartEvent = 'pointerdown';
        touchMoveEvent = 'pointermove';
        touchEndEvent = 'pointerup';
        touchCancelEvent = 'pointercancel';
      } else if (window.navigator.msPointerEnabled) {
        touchStartEvent = 'MSPointerDown';
        touchMoveEvent = 'MSPointerMove';
        touchEndEvent = 'MSPointerUp';
        touchCancelEvent = 'MSPointerCancel';
      }

      atajoui.EVENTS.touchstart = touchStartEvent;
      atajoui.EVENTS.touchmove = touchMoveEvent;
      atajoui.EVENTS.touchend = touchEndEvent;
      atajoui.EVENTS.touchcancel = touchCancelEvent;
  })();

  // classList polyfill for them older Androids
  // https://gist.github.com/devongovett/1381839
  if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function() {
        var self = this;
        function update(fn) {
          return function() {
            var x, classes = self.className.split(/\s+/);

            for (x = 0; x < arguments.length; x++) {
              fn(classes, classes.indexOf(arguments[x]), arguments[x]);
            }

            self.className = classes.join(" ");
          };
        }

        return {
          add: update(function(classes, index, value) {
            ~index || classes.push(value);
          }),

          remove: update(function(classes, index) {
            ~index && classes.splice(index, 1);
          }),

          toggle: update(function(classes, index, value) {
            ~index ? classes.splice(index, 1) : classes.push(value);
          }),

          contains: function(value) {
            return !!~self.className.split(/\s+/).indexOf(value);
          },

          item: function(i) {
            return self.className.split(/\s+/)[i] || null;
          }
        };

      }
    });
  }

})(document, atajoui);
