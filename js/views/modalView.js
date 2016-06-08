(function(atajoui) {
'use strict';

  atajoui.views.Modal = atajoui.views.View.inherit({
    initialize: function(opts) {
      opts = atajoui.extend({
        focusFirstInput: false,
        unfocusOnHide: true,
        focusFirstDelay: 600,
        backdropClickToClose: true,
        hardwareBackButtonClose: true,
      }, opts);

      atajoui.extend(this, opts);

      this.el = opts.el;
    },
    show: function() {
      var self = this;

      if(self.focusFirstInput) {
        // Let any animations run first
        window.setTimeout(function() {
          var input = self.el.querySelector('input, textarea');
          input && input.focus && input.focus();
        }, self.focusFirstDelay);
      }
    },
    hide: function() {
      // Unfocus all elements
      if(this.unfocusOnHide) {
        var inputs = this.el.querySelectorAll('input, textarea');
        // Let any animations run first
        window.setTimeout(function() {
          for(var i = 0; i < inputs.length; i++) {
            inputs[i].blur && inputs[i].blur();
          }
        });
      }
    }
  });

})(atajoui);
