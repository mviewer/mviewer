mviewer.customControls.ortho_cog = (function () {
  /*
   * Private
   */
  var _idlayer = "ortho_cog";

  var _updateLayer = function () {};

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when panel is opened
      const output = document.getElementById("output-cog");
      const btn = document.getElementById("cog_center");
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
            397069.70995898556, 1747685.4816645968, 805288.7621372811, 1947701.1204109823,
          ]);
      });
    },

    updateLayer: function (ctrl) {},

    destroy: function () {},
  };
})();
