(function(atajoui) {
'use strict';

  /**
   * The side menu view handles one of the side menu's in a Side Menu Controller
   * configuration.
   * It takes a DOM reference to that side menu element.
   */
  atajoui.views.SideMenu = atajoui.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
      this.isEnabled = (typeof opts.isEnabled === 'undefined') ? true : opts.isEnabled;
      this.setWidth(opts.width);
    },
    getFullWidth: function() {
      return this.width;
    },
    setWidth: function(width) {
      this.width = width;
      this.el.style.width = width + 'px';
    },
    setIsEnabled: function(isEnabled) {
      this.isEnabled = isEnabled;
    },
    bringUp: function() {
      if(this.el.style.zIndex !== '0') {
        this.el.style.zIndex = '0';
      }
    },
    pushDown: function() {
      if(this.el.style.zIndex !== '-1') {
        this.el.style.zIndex = '-1';
      }
    }
  });

  atajoui.views.SideMenuContent = atajoui.views.View.inherit({
    initialize: function(opts) {
      atajoui.extend(this, {
        animationClass: 'menu-animated',
        onDrag: function() {},
        onEndDrag: function() {}
      }, opts);

      atajoui.onGesture('drag', atajoui.proxy(this._onDrag, this), this.el);
      atajoui.onGesture('release', atajoui.proxy(this._onEndDrag, this), this.el);
    },
    _onDrag: function(e) {
      this.onDrag && this.onDrag(e);
    },
    _onEndDrag: function(e) {
      this.onEndDrag && this.onEndDrag(e);
    },
    disableAnimation: function() {
      this.el.classList.remove(this.animationClass);
    },
    enableAnimation: function() {
      this.el.classList.add(this.animationClass);
    },
    getTranslateX: function() {
      return parseFloat(this.el.style[atajoui.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]);
    },
    setTranslateX: atajoui.animationFrameThrottle(function(x) {
      this.el.style[atajoui.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0, 0)';
    })
  });

})(atajoui);
