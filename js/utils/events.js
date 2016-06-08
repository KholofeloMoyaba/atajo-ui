/**
 * aui-events.js
 *
 * Author: Max Lynch <max@drifty.com>
 *
 * Framework events handles various mobile browser events, and
 * detects special events like tap/swipe/etc. and emits them
 * as custom events that can be used in an app.
 *
 * Portions lovingly adapted from github.com/maker/ratchet and github.com/alexgibson/tap.js - thanks guys!
 */

(function(atajoui) {

  // Custom event polyfill
  atajoui.CustomEvent = (function() {
    if( typeof window.CustomEvent === 'function' ) return CustomEvent;

    var customEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      try {
        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      } catch (error) {
        // fallback for browsers that don't support createEvent('CustomEvent')
        evt = document.createEvent("Event");
        for (var param in params) {
          evt[param] = params[param];
        }
        evt.initEvent(event, params.bubbles, params.cancelable);
      }
      return evt;
    };
    customEvent.prototype = window.Event.prototype;
    return customEvent;
  })();


  /**
   * @ngdoc utility
   * @name atajoui.EventController
   * @module atajoui
   */
  atajoui.EventController = {
    VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],

    /**
     * @ngdoc method
     * @name atajoui.EventController#trigger
     * @alias atajoui.trigger
     * @param {string} eventType The event to trigger.
     * @param {object} data The data for the event. Hint: pass in
     * `{target: targetElement}`
     * @param {boolean=} bubbles Whether the event should bubble up the DOM.
     * @param {boolean=} cancelable Whether the event should be cancelable.
     */
    // Trigger a new event
    trigger: function(eventType, data, bubbles, cancelable) {
      var event = new atajoui.CustomEvent(eventType, {
        detail: data,
        bubbles: !!bubbles,
        cancelable: !!cancelable
      });

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event);
    },

    /**
     * @ngdoc method
     * @name atajoui.EventController#on
     * @alias atajoui.on
     * @description Listen to an event on an element.
     * @param {string} type The event to listen for.
     * @param {function} callback The listener to be called.
     * @param {DOMElement} element The element to listen for the event on.
     */
    on: function(type, callback, element) {
      var e = element || window;

      // Bind a gesture if it's a virtual event
      for(var i = 0, j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
        if(type == this.VIRTUALIZED_EVENTS[i]) {
          var gesture = new atajoui.Gesture(element);
          gesture.on(type, callback);
          return gesture;
        }
      }

      // Otherwise bind a normal event
      e.addEventListener(type, callback);
    },

    /**
     * @ngdoc method
     * @name atajoui.EventController#off
     * @alias atajoui.off
     * @description Remove an event listener.
     * @param {string} type
     * @param {function} callback
     * @param {DOMElement} element
     */
    off: function(type, callback, element) {
      element.removeEventListener(type, callback);
    },

    /**
     * @ngdoc method
     * @name atajoui.EventController#onGesture
     * @alias atajoui.onGesture
     * @description Add an event listener for a gesture on an element.
     *
     * Available eventTypes (from [hammer.js](http://eightmedia.github.io/hammer.js/)):
     *
     * `hold`, `tap`, `doubletap`, `drag`, `dragstart`, `dragend`, `dragup`, `dragdown`, <br/>
     * `dragleft`, `dragright`, `swipe`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`, <br/>
     * `transform`, `transformstart`, `transformend`, `rotate`, `pinch`, `pinchin`, `pinchout`, <br/>
     * `touch`, `release`
     *
     * @param {string} eventType The gesture event to listen for.
     * @param {function(e)} callback The function to call when the gesture
     * happens.
     * @param {DOMElement} element The angular element to listen for the event on.
     * @param {object} options object.
     * @returns {atajoui.Gesture} The gesture object (use this to remove the gesture later on).
     */
    onGesture: function(type, callback, element, options) {
      var gesture = new atajoui.Gesture(element, options);
      gesture.on(type, callback);
      return gesture;
    },

    /**
     * @ngdoc method
     * @name atajoui.EventController#offGesture
     * @alias atajoui.offGesture
     * @description Remove an event listener for a gesture created on an element.
     * @param {atajoui.Gesture} gesture The gesture that should be removed.
     * @param {string} eventType The gesture event to remove the listener for.
     * @param {function(e)} callback The listener to remove.

     */
    offGesture: function(gesture, type, callback) {
      gesture && gesture.off(type, callback);
    },

    handlePopState: function() {}
  };


  // Map some convenient top-level functions for event handling
  atajoui.on = function() { atajoui.EventController.on.apply(atajoui.EventController, arguments); };
  atajoui.off = function() { atajoui.EventController.off.apply(atajoui.EventController, arguments); };
  atajoui.trigger = atajoui.EventController.trigger;//function() { atajoui.EventController.trigger.apply(atajoui.EventController.trigger, arguments); };
  atajoui.onGesture = function() { return atajoui.EventController.onGesture.apply(atajoui.EventController.onGesture, arguments); };
  atajoui.offGesture = function() { return atajoui.EventController.offGesture.apply(atajoui.EventController.offGesture, arguments); };

})(window.atajoui);
