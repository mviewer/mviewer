mviewer.customControls.els = (function() {
    /*
     * Private
     */
    var _idlayer = 'els';



    return {
        /*
         * Public
         */

        init: function () {
            // mandatory - code executed when panel is opened

        },

        updateLayer: function (value) {
            if (value.length > 2) {
                mviewer.customLayers.els.filter = value;
            } else {
                mviewer.customLayers.els.filter = false;
            }

            mviewer.customLayers.els.layer.getSource().clear();

        },

        destroy: function () {
            // mandatory - code executed when panel is closed
        }
     };

}());
