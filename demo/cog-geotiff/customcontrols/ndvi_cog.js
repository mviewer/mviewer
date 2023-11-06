mviewer.customControls.ndvi_cog = (function () {
  /*
   * Private
   */
  var _idlayer = "ndvi_cog";

  var _updateLayer = function () {};

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when panel is opened
      const output = document.getElementById("output");
      const btn = document.getElementById("ndvi_center");
      if (!output) return;

      function displayPixelValue(event) {
        const layer = mviewer.getLayer(_idlayer)?.layer;
        if (!layer) return;
        const data = layer.getData(event.pixel);
        if (!data) {
          return;
        }
        // random calcul example
        const red = data[0];
        const nir = data[1];
        const ndvi = (nir - red) / (nir + red);
        output.textContent = ndvi.toFixed(2);
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
            1686280.9023518958, 6000534.59477369, 2242938.9215387097, 6273281.07408872,
          ]);
      });
    },

    updateLayer: function (ctrl) {},

    destroy: function () {},
  };
})();
