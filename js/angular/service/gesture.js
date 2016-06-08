/**
 * @ngdoc service
 * @name $atajoUiGesture
 * @module atajoui
 * @description An angular service exposing atajoui
 * {@link atajoui.utility:atajoui.EventController}'s gestures.
 */
AtajoUiModule
.factory('$atajoUiGesture', [function() {
  return {
    /**
     * @ngdoc method
     * @name $atajoUiGesture#on
     * @description Add an event listener for a gesture on an element. See {@link atajoui.utility:atajoui.EventController#onGesture}.
     * @param {string} eventType The gesture event to listen for.
     * @param {function(e)} callback The function to call when the gesture
     * happens.
     * @param {element} $element The angular element to listen for the event on.
     * @param {object} options object.
     * @returns {atajoui.Gesture} The gesture object (use this to remove the gesture later on).
     */
    on: function(eventType, cb, $element, options) {
      return window.atajoui.onGesture(eventType, cb, $element[0], options);
    },
    /**
     * @ngdoc method
     * @name $atajoUiGesture#off
     * @description Remove an event listener for a gesture on an element. See {@link atajoui.utility:atajoui.EventController#offGesture}.
     * @param {atajoui.Gesture} gesture The gesture that should be removed.
     * @param {string} eventType The gesture event to remove the listener for.
     * @param {function(e)} callback The listener to remove.
     */
    off: function(gesture, eventType, cb) {
      return window.atajoui.offGesture(gesture, eventType, cb);
    }
  };
}]);
