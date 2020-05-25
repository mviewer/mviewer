mviewer.customControls.ocs56 = (function() {
    /*
     * Private
     */
    var _idlayer = 'ocs56';



    return {
        /*
         * Public
         */

        init: function () {
            // mandatory - code executed when panel is opened

        },

        updateStyle: function (select) {
            var style = select.value;
            var label = select.options[select.selectedIndex].label;
            mviewer.customLayers.ocs56.layer.setStyle(mviewer.customLayers.ocs56[style]);
            document.getElementById("s-text").firstElementChild.textContent = "ocs" + " - " + label;
            //$("#s-text text").text("ocs" + " - " + label);
        },

        destroy: function () {
            // mandatory - code executed when panel is closed
        }
     };

}());
