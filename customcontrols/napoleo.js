mviewer.customControls.napoleo = (function() {
    /*
     * Private
     */
    var _idlayer = 'napoleo';
    var _map = mviewer.getMap();

    var _data = {};
    var _vectorSource = new ol.source.Vector();

    $.getJSON("http://kartenn.region-bretagne.fr/img/cadastre_napoleonien/data.json", function(data) {    
        $.each(data, function(id, item) {
            _data[item.id] = item;
            var feature = new ol.Feature({
                geometry: new ol.geom.Polygon.fromExtent(item.extent)
            });
            feature.setProperties(item);
            _vectorSource.addFeature(feature);
        });
    });

    var _updateList = function(e) {
        if (_map.getView().getResolution() < 38) {
            $("#napoleo-select option:not(:selected)").remove();
            $("#napoleo-select").append('<option hidden >Communes...</option>');
            var extent = _map.getView().calculateExtent(mviewer.getMap().getSize());
            _vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
                var prop = feature.getProperties();
                if ($("#napoleo-select option[value='"+ prop.id+"']").length === 0) {
                    $("#napoleo-select").append('<option label="' + prop.label
                        + '" value="' + prop.id + '">' + prop.label + '</option>');
                }
            });
        }
    };



    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            _map.on('moveend', _updateList);

        },

        updateTA: function(select) {
            var data = _data[select.value];
            var url = data.url;
            console.log($("#napoleo-quality:checked").val());
            if ($("#napoleo-quality:checked").val() === true) {
                console.log("HD");
                url = url.replace("/ld/","/hd/");
            }
            var source = new ol.source.ImageStatic({
                attributions: '© <a href="https://geobretagne.com">GéoBretagne</a>',
                url: url,
                imageExtent: data.extent,
                imageSize: data.imageSize,
                projection: 'EPSG:3857'
            });
            source.on('imageloadstart', function(event) {
                $("#loading-" + _idlayer).show();
            });
            source.on('imageloaderror', function(event) {
                $("#loading-" + _idlayer).hide();
                mviewer.alert("Erreur. Image introuvable", "alert-info")
            });
            source.on('imageloadend', function(event) {
                $("#loading-" + _idlayer).hide();
            });
            mviewer.customLayers.napoleo.layer.setSource(source);
        },

        updateQuality: function () {
            var select = $("#napoleo-select")[0];
            if (select.value != "Communes...") {
                this.updateTA(select);
            }
        },

        zoomToTA: function () {
            var data = _data[$("#napoleo-select option:selected").val()];
            _map.getView().fit(data.extent, _map.getSize());
        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            _map.un('moveend', _updateList);
        }
    };
}());