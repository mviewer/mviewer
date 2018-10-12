mviewer.customControls.els = (function() {
    /*
     * Private
     */
    var _idlayer = 'els';

    var _updateLayer = function() {
        var values = $("#els_search_queries").tagsinput('items') || [];
        mviewer.customLayers.els.filter = values;
        mviewer.customLayers.els.layer.getSource().clear(true);
    };



    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            $.getJSON("demo/collection.json", function(data){
                $("#els_search_queries").tagsinput({
                    typeahead: {
                        source: data
                    },
                    freeInput: false,
                    tagClass: 'label label-mv'
                });
                $("#els_search_queries").on('itemAdded', function(event) {
                    _updateLayer();
                    setTimeout(function(){
                        $(">input[type=text]",".bootstrap-tagsinput").val("");
                    }, 1);
                });
                $("#els_search_queries").on('itemRemoved', function(event) {
                    _updateLayer();
                });

            });
            //mviewer.getMap().on('moveend', _updateLayer);



        },

        updateLayer: function(ctrl) {
            if (ctrl.value.length > 2) {
                $("#els_search_queries").tagsinput('add', ctrl.value);
                $(ctrl).val("");
            }

        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            $("#els_search_queries").tagsinput('removeAll');
            //mviewer.getMap().on('moveend', _updateLayer);
        }
    };

}());
