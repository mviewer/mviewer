!(function (e) {
  function t(e, t, o) {
    var n = this;
    (o = o || {}),
      (o.open = n.getElm(o.open)),
      (o.openEvent = o.openEvent || "click"),
      (o.style = Object(o.style)),
      (o.style.display = o.style.display || "block"),
      (o.closeOnBlur = o.closeOnBlur || !1),
      (o.template =
        o.template || '<div data-col="{color}" style="background-color: {color}"></div>'),
      (n.elm = n.getElm(e)),
      (n.cbs = []),
      (n.isOpen = !0),
      (n.colors = t),
      (n.options = o),
      n.render(),
      o.open &&
        o.open.addEventListener(o.openEvent, function (e) {
          n.isOpen ? n.close() : n.open();
        }),
      n.elm.addEventListener("click", function (e) {
        var t = e.target.getAttribute("data-col");
        t && (n.set(t), n.close());
      }),
      o.closeOnBlur &&
        window.addEventListener("click", function (e) {
          e.target != o.open && e.target != n.elm && n.isOpen && n.close();
        }),
      o.autoclose !== !1 && n.close();
  }
  (t.prototype.getElm = function (e) {
    return "string" == typeof e ? document.querySelector(e) : e;
  }),
    (t.prototype.render = function () {
      var e = this,
        t = "";
      e.colors.forEach(function (o) {
        t += e.options.template.replace(/\{color\}/g, o);
      }),
        (e.elm.innerHTML = t);
    }),
    (t.prototype.close = function () {
      (this.elm.style.display = "none"), (this.isOpen = !1);
    }),
    (t.prototype.open = function () {
      (this.elm.style.display = this.options.style.display), (this.isOpen = !0);
    }),
    (t.prototype.colorChosen = function (e) {
      this.cbs.push(e);
    }),
    (t.prototype.set = function (e, t) {
      var o = this;
      (o.color = e),
        t !== !1 &&
          o.cbs.forEach(function (t) {
            t.call(o, e);
          });
    }),
    (e.Piklor = t);
})(this);
