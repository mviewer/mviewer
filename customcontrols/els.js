mviewer.customControls.els = (function() {
    /*
     * Private
     */
    var _idlayer = 'els';

    var _updateLayer = function() {
        var values = $("#els_search_queries").tagsinput('items');
        mviewer.customLayers.els.filter = values;
        mviewer.customLayers.els.layer.getSource().getSource().clear(true);
    };



    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            $("#els_search_queries").tagsinput({
                tagClass: 'label label-mv'
            });
            $("#els_search_queries").on('itemAdded', function(event) {
                _updateLayer();
            });
            $("#els_search_queries").on('itemRemoved', function(event) {
                _updateLayer();
            });

        },

        updateLayer: function(value) {
            if (value.length > 2) {
                $("#els_search_queries").tagsinput('add', value);
                $("#els_input").val("");
            }

        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            $("#els_search_queries").tagsinput('removeAll');
        }
    };

}());
