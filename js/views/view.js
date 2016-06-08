(function(atajoui) {
'use strict';
  atajoui.views.View = function() {
    this.initialize.apply(this, arguments);
  };

  atajoui.views.View.inherit = atajoui.inherit;

  atajoui.extend(atajoui.views.View.prototype, {
    initialize: function() {}
  });

})(window.atajoui);
