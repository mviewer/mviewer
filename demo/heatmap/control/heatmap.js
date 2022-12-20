﻿const layerid = "heatmap";
var cc = (function () {
  /*
   * Private
   */

  var _initialized = false;

  var _layer;

  var _blurElement = false;

  var _radiusElement = false;

  var _blurHandler = function (e) {
    _layer.setBlur(parseInt(e.target.value, 10));
  };

  var _radiusHandler = function (e) {
    _layer.setRadius(parseInt(e.target.value, 10));
  };

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when layer is added to legend panel
      if (!_initialized) {
        _layer = mviewer.getLayer(layerid).layer;
        _blurElement = document.getElementById("heatmap-blur");
        _radiusElement = document.getElementById("heatmap-radius");
        if (_blurElement && _radiusElement) {
          _blurElement.addEventListener("input", _blurHandler);
          _blurElement.addEventListener("change", _blurHandler);
          _radiusElement.addEventListener("input", _radiusHandler);
          _radiusElement.addEventListener("change", _radiusHandler);
          _initialized = true;
        }
      }
    },

    destroy: function () {
      // mandatory - code executed when layer panel is closed
      _initialized = false;
    },
  };
})();
new CustomControl(layerid, cc.init, cc.destroy);
