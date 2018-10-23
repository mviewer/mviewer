mviewer.customControls.inventaire = (function() {
    /*
     * Private
     */
    var _idlayer = 'inventaire';

    var _zoomlevel = false;

    var _defaultValue = "maison,18e siècle,ardoise";

    var _lastValues = false;

    var _collection = false;

    var _updateLayer = function() {
        var values = $("#inventaire_search_queries").tagsinput('items') || [];
        mviewer.customLayers.inventaire.setFilter(values);
        mviewer.customLayers.inventaire.layer.getSource().getSource().clear(false);
        _lastValues = values.join(",");
    };

    var _mapChanged = function (e) {
        var newZoomlevel = mviewer.getMap().getView().getZoom();
        if ( _zoomlevel && (newZoomlevel > _zoomlevel)) {
            _updateLayer();
        }
        _zoomlevel = newZoomlevel;
    };

    var _initForm = function () {
        $("#inventaire_search_queries").tagsinput({
            typeahead: {
                source: _collection
            },
            freeInput: false,
            tagClass: 'label label-mv'
        });
        if (_defaultValue && !_lastValues) {
            $("#inventaire_search_queries").tagsinput("add", _defaultValue);
            _defaultValue = false;
            _updateLayer();
        } else if (_lastValues) {
            $("#inventaire_search_queries").tagsinput("add", _lastValues);
            _defaultValue = false;
            _updateLayer();
        }
        $("#inventaire_search_queries").on('itemAdded', function(event) {
            _updateLayer();
            setTimeout(function(){
                $(">input[type=text]",".bootstrap-tagsinput").val("");
            }, 1);
        });
        $("#inventaire_search_queries").on('itemRemoved', function(event) {
            _updateLayer();
        });
    };



    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            if (!_collection) {
                $.getJSON("demo/collection.json", function(data){
                    _collection = data;
                    _initForm();
                });
            } else {
                _initForm();
            }
            mviewer.getMap().on('moveend', _mapChanged);


        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            $("#inventaire_search_queries").tagsinput('removeAll');
            mviewer.getMap().un('moveend', _mapChanged);

        }
    };

}());
