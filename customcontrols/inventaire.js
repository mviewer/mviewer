mviewer.customControls.inventaire = (function() {
    /*
     * Private
     */
    var _idlayer = 'inventaire';

    var _zoomlevel = false;

    var defaultValue = false;

    var _updateLayer = function() {
        var values = $("#inventaire_search_queries").tagsinput('items') || [];
        mviewer.customLayers.inventaire.setFilter(values);
        mviewer.customLayers.inventaire.layer.getSource().getSource().clear(true);
    };

    var _mapChanged = function (e) {
        var newZoomlevel = mviewer.getMap().getView().getZoom();
        if ( _zoomlevel && (newZoomlevel > _zoomlevel)) {
            _updateLayer();
        }
        _zoomlevel = newZoomlevel;
    };



    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            var defaultValue = "manoir";
            $.getJSON("demo/collection.json", function(data){
                $("#inventaire_search_queries").tagsinput({
                    typeahead: {
                        source: data
                    },
                    freeInput: false,
                    tagClass: 'label label-mv'
                });
                $("#inventaire_search_queries").on('itemAdded', function(event) {
                    _updateLayer();
                    setTimeout(function(){
                        $(">input[type=text]",".bootstrap-tagsinput").val("");
                    }, 1);
                });
                $("#inventaire_search_queries").on('itemRemoved', function(event) {
                    _updateLayer();
                });
                if (defaultValue) {
                    $("#inventaire_search_queries").tagsinput("add", "manoir");
                }

            });
            mviewer.getMap().on('moveend', _mapChanged);



        },

        updateLayer: function(ctrl) {
            if (ctrl.value.length > 2) {
                $("#inventaire_search_queries").tagsinput('add', ctrl.value);
                $(ctrl).val("");
            }

        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            $("#inventaire_search_queries").tagsinput('removeAll');
            mviewer.getMap().un('moveend', _mapChanged);

        }
    };

}());
