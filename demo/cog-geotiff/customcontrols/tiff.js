mviewer.customControls.tiff = (function () {
  /*
   * Private
   */
  var _idlayer = "tiff";

  var _updateLayer = function () {};

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when panel is opened
      const output = document.getElementById("output-tiff");
      const btn = document.getElementById("tiff_center");
      if (!output) return;

      function displayPixelValue(event) {
        const layer = mviewer.getLayer(_idlayer)?.layer;
        if (!layer) return;
        const data = layer.getData(event.pixel);
        if (!data) {
          return;
        }
        // random calcul example
        output.textContent = data[0].toFixed(2);
      }
      if (!mviewer.getMap()) return;
      mviewer.getMap().on(["pointermove", "click"], displayPixelValue);
      $(btn).click((x) => {
        // fast example
        // need to be improve by extent calculation from layer directly
        mviewer
          .getMap()
          .getView()
          .fit([
            -491292.029705857, 6216156.180293629, -489733.12741514464, 6216919.99774839,
          ]);
      });
    },

    updateLayer: function (ctrl) {},

    destroy: function () {},
  };
})();
