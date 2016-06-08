
/**
 * @ngdoc service
 * @name $atajoUiPlatform
 * @module atajoui
 * @description
 * An angular abstraction of {@link atajoui.utility:atajoui.Platform}.
 *
 * Used to detect the current platform, as well as do things like override the
 * Android back button in PhoneGap/Cordova.
 */
AtajoUiModule
.constant('ATAJOUI_BACK_PRIORITY', {
  view: 100,
  sideMenu: 150,
  modal: 200,
  actionSheet: 300,
  popup: 400,
  loading: 500
})
.provider('$atajoUiPlatform', function() {
  return {
    $get: ['$q', '$atajoUiScrollDelegate', function($q, $atajoUiScrollDelegate) {
      var self = {

        /**
         * @ngdoc method
         * @name $atajoUiPlatform#onHardwareBackButton
         * @description
         * Some platforms have a hardware back button, so this is one way to
         * bind to it.
         * @param {function} callback the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          atajoui.Platform.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * @ngdoc method
         * @name $atajoUiPlatform#offHardwareBackButton
         * @description
         * Remove an event listener for the backbutton.
         * @param {function} callback The listener function that was
         * originally bound.
         */
        offHardwareBackButton: function(fn) {
          atajoui.Platform.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        /**
         * @ngdoc method
         * @name $atajoUiPlatform#registerBackButtonAction
         * @description
         * Register a hardware back button action. Only one action will execute
         * when the back button is clicked, so this method decides which of
         * the registered back button actions has the highest priority.
         *
         * For example, if an actionsheet is showing, the back button should
         * close the actionsheet, but it should not also go back a page view
         * or close a modal which may be open.
         *
         * The priorities for the existing back button hooks are as follows:
         *   Return to previous view = 100
         *   Close side menu = 150
         *   Dismiss modal = 200
         *   Close action sheet = 300
         *   Dismiss popup = 400
         *   Dismiss loading overlay = 500
         *
         * Your back button action will override each of the above actions
         * whose priority is less than the priority you provide. For example,
         * an action assigned a priority of 101 will override the 'return to
         * previous view' action, but not any of the other actions.
         *
         * @param {function} callback Called when the back button is pressed,
         * if this listener is the highest priority.
         * @param {number} priority Only the highest priority will execute.
         * @param {*=} actionId The id to assign this action. Default: a
         * random unique id.
         * @returns {function} A function that, when called, will deregister
         * this backButtonAction.
         */
        $backButtonActions: {},
        registerBackButtonAction: function(fn, priority, actionId) {

          if (!self._hasBackButtonHandler) {
            // add a back button listener if one hasn't been setup yet
            self.$backButtonActions = {};
            self.onHardwareBackButton(self.hardwareBackButtonClick);
            self._hasBackButtonHandler = true;
          }

          var action = {
            id: (actionId ? actionId : atajoui.Utils.nextUid()),
            priority: (priority ? priority : 0),
            fn: fn
          };
          self.$backButtonActions[action.id] = action;

          // return a function to de-register this back button action
          return function() {
            delete self.$backButtonActions[action.id];
          };
        },

        /**
         * @private
         */
        hardwareBackButtonClick: function(e) {
          // loop through all the registered back button actions
          // and only run the last one of the highest priority
          var priorityAction, actionId;
          for (actionId in self.$backButtonActions) {
            if (!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
              priorityAction = self.$backButtonActions[actionId];
            }
          }
          if (priorityAction) {
            priorityAction.fn(e);
            return priorityAction;
          }
        },

        is: function(type) {
          return atajoui.Platform.is(type);
        },

        /**
         * @ngdoc method
         * @name $atajoUiPlatform#on
         * @description
         * Add Cordova event listeners, such as `pause`, `resume`, `volumedownbutton`, `batterylow`,
         * `offline`, etc. More information about available event types can be found in
         * [Cordova's event documentation](https://cordova.apache.org/docs/en/latest/cordova/events/events.html).
         * @param {string} type Cordova [event type](https://cordova.apache.org/docs/en/latest/cordova/events/events.html).
         * @param {function} callback Called when the Cordova event is fired.
         * @returns {function} Returns a deregistration function to remove the event listener.
         */
        on: function(type, cb) {
          atajoui.Platform.ready(function() {
            document.addEventListener(type, cb, false);
          });
          return function() {
            atajoui.Platform.ready(function() {
              document.removeEventListener(type, cb);
            });
          };
        },

        /**
         * @ngdoc method
         * @name $atajoUiPlatform#ready
         * @description
         * Trigger a callback once the device is ready,
         * or immediately if the device is already ready.
         * @param {function=} callback The function to call.
         * @returns {promise} A promise which is resolved when the device is ready.
         */
        ready: function(cb) {
          var q = $q.defer();

          atajoui.Platform.ready(function() {

            window.addEventListener('statusTap', function() {
              $atajoUiScrollDelegate.scrollTop(true);
            });

            q.resolve();
            cb && cb();
          });

          return q.promise;
        }
      };

      return self;
    }]
  };

});
