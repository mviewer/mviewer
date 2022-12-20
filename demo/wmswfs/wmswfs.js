const layerid = "wmswfs";
const cc = (function () {
  /*
   * Private
   */

  var _layer;

  return {
    /*
     * Public
     */

    init: function () {
      // mandatory - code executed when layer is added to legend panel
      mviewer.getLayer("geofla_commune_2015").layer.setVisible(true);
    },

    destroy: function () {
      // mandatory - code executed when layer panel is closed
      mviewer.getLayer("geofla_commune_2015").layer.setVisible(false);
    },
  };
})();
new CustomControl(layerid, cc.init, cc.destroy);
