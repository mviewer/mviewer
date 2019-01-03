mviewer.customControls.isochrones = (function() {
    /*
     * Private
     */
    var _idlayer = 'isochrones';

    var _draw; // global so we can remove it later

    var _source;

    var _vector;

    var _xy;


    var _showResult = function (data) {
        var parcours = $('.isochrone-values').filter(function() { return this.value == data.time });
        var fill = parcours.attr("data-fill");
        var stroke = parcours.attr("data-stroke");
        var format = new ol.format.WKT();
        var feature = format.readFeature(data.wktGeometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          });
        var style = new ol.style.Style({
            fill: new ol.style.Fill({color:fill}),
            stroke: new ol.style.Stroke({color:stroke, width: 2}),
             zIndex: parseInt(10000 / data.time)
        });
        feature.setStyle(style);
        mviewer.customLayers.isochrones.layer.getSource().addFeature(feature);
    };

    return {
        /*
         * Public
         */

        init: function () {
            // mandatory - code executed when panel is opened
            $(".isochrone-values").each(function(i, item) {
                $(item).css("background-color", $(item).attr("data-fill"));
                $(item).css("border", ["solid", $(item).attr("data-stroke"), "2px"].join (" "));
            });
        },

        getXY: function () {
              info.disable();
              _draw = new ol.interaction.Draw({
                type: 'Point'
              });
              _draw.on('drawend', function(event) {
                 _xy = ol.proj.transform(event.feature.getGeometry().getCoordinates(),'EPSG:3857', 'EPSG:4326');
                 mviewer.getMap().removeInteraction(_draw);
                 mviewer.showLocation('EPSG:4326', _xy[0], _xy[1]);
                 info.enable();
              });
              mviewer.getMap().addInteraction(_draw);


        },

        switchMode: function (element) {
            $(".selected.isochrone-mode").removeClass("selected");
            $(element).addClass("selected");
        },

        calcul: function () {
            var times = [];
            var requests = [];
            $(".isochrone-values").each(function(index,input) {
                if (input.value >= 10) {
                    times.push(input.value);
                }
            });
            if (!_xy || (times.length === 0)) {
                mviewer.alert("Isochrones : Il faut définir l'origine et au moins un temps de parcours", "alert-info")
                return;
            }
            mviewer.customLayers.isochrones.layer.getSource().clear();
            var mode = $(".selected.isochrone-mode").attr("data-mode");
            var url = "http://kartenn.region-bretagne.fr/isochrone?";

            $("#loading-isochrones").show();
            times.forEach(function (time) {
                requests.push(
                    $.ajax({
                        type: "GET",
                        url: url,
                        crossDomain: true,
                        data: {
                            "srs": "epsg:4326",
                            "smoothing": true,
                            "holes":true,
                            "graphName":mode,
                            "location":_xy.join(","),
                            "time":time
                        },
                        dataType: "json"
                    })
                );
            });

            $.when.apply($,requests).done(function(){
                if (requests.length > 1) {
                    $.each(arguments, function (index,request) {
                       _showResult(request[0]);
                    });
                } else {
                    _showResult(arguments[0]);
                }
                $("#loading-isochrones").hide();
            });



        },

        destroy: function () {
            // mandatory - code executed when panel is closed
            _xy = null;
            mviewer.hideLocation();
            mviewer.customLayers.isochrones.layer.getSource().clear();
        }
     };

}());
