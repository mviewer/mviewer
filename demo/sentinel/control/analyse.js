mviewer.customControls.s2tile = (function() {

    /*

     * Private

     */

    var _idlayer = 's2tile';

 

    var _data = [];

 

    var _filteredDates = [];

 

    var _selectedDate;

 

    var _gain = 1.0;

 

    var _gamma = 1.0;

 

    var _filter = function (cc) {

       //filtre les donnÃ©es de al reqÃ»ete wfs selon le pourcentage de CouvNuageuse

       var selection = _data.filter(function(o) {

           return o.properties.cloudCoverPercentage <= parseInt(cc);

       });

 

       //Mettre toutes les dates des donnÃ©es filtrÃ©es dans un array

       _filteredDates = [];

       selection.forEach(function(item, id) {

            if (_filteredDates.indexOf(item.properties.date) === -1) {

                _filteredDates.push(item.properties.date);

            }

       });

 

 

       _updateCalendar();

 

       return selection;

    };

 

    _renderCalendarCallback = function (date) {

       var d = _formatDate(date);

       //debugger;

       var classe = "";

       if (_filteredDates.indexOf(d) >=0) {

          classe =  'good';

      }

       return {classes: classe};

    }

 

    var _onSelectDate = function (d) {

        //Fonction qui rÃ©git ce qui se passe lorsqu'on change de date

 

        //on vÃ©rifie si la date choisie n'est pas la mÃªme que la date dÃ©jÃ  sÃ©lectionnÃ©es

        if (d !== _selectedDate) {

            //on rÃ©cupÃ¨re le pourcentage de couverture nuageuse

             var cc = $(".sentinel2-cc-values").val();

             //on applique les changements

             _applyFilterToAllLayers(d, cc);

 

             //la variable globale de la date sÃ©lectionnÃ©e est mise Ã  jour

             _selectedDate = d;

        }

    };

 

    var _updateCalendar = function () {

        console.log(_filteredDates);

        $(".sentinel2.datepicker").datepicker("destroy");

        $(".sentinel2.datepicker").datepicker({

            todayHighlight: true,

            beforeShowDay: _renderCalendarCallback

 

        }).on('changeDate', function(e) {

            _onSelectDate(e.format());

        });

    };

 

    _setLayerExtraParameters =  function (layerid, filter_time, cloud_cover) {

        //fonction appellÃ©e pour mettre Ã  jour les donnÃ©e affichÃ©es selon la couvNuageuse et la date

        var _layerDefinition = mviewer.getLayers()[layerid];

        var _source = _layerDefinition.layer.getSource();
        console.log(_source);

        _source.getParams()['TIME'] = filter_time;

        _source.getParams()['maxcc'] = cloud_cover;

        _source.changed();

        if (_source.hasOwnProperty("tileClass")) {

            _source.updateParams({'ol3_salt': Math.random()});

        }

    };

   

    var _formatDate = function (date) {

        var d = date.getDate();

        var m = date.getMonth() ;

        var year = date.getFullYear();

        var day = d < 10 ? ("0" + d) : d;

        var month = m < 10 ? ("0" + m) : m;

        var formatedDate = [year,month,day].join("-");

        return formatedDate;

    };

 

    var _updateLayer = function (cc) {

        var _source = mviewer.getLayers()["s2tile"].layer.getSource();

        _source.clear();

        var selection = _filter(cc);

        selection.forEach(function(item, id) {

            var f = new ol.Feature({geometry: new ol.geom.MultiPolygon(item.geometry.coordinates)});

            f.setProperties(item.properties);

            _source.addFeature(f);

        });

 

    }

 

    _applyFilterToAllLayers = function (time_filter, cc) {

        //applique les changements Ã  toutes les couches de la liste

        var sentinel2_layers = ["TRUE_COLOR", "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B8A", "B09", "B10", "B11", "B12",

                                "RGB_8_6_4", "RGB_8_5_4", "RGB_8_11_4", "RGB_8_11_12", "SWIR", "GEOLOGY", "RGB_11_8_3", "AGRICULTURE",

                                "FALSE_COLOR_URBAN","SAVI", "NDWI", "NDVI","S2PRODUCT" ];

        //pour chaque layer de la liste des layers, on:

        sentinel2_layers.forEach(function(layer) {

            //appelle la fonction:

            _setLayerExtraParameters(layer,time_filter, cc);

        });

 

    }

 

    return {

        /*

         * Public

         */

 

      init: function () {

            // mandatory - code executed when panel is opened

            $(".sentinel2.datepicker").datepicker({

                todayHighlight: true

            });

            var date1 = new Date();

            date1.setMonth(date1.getMonth() -1 );

            var date2 = new Date();

            var periode = _formatDate(date2);

            var bbox = "-85609.475158,6342438.846129,-623726.112541,5938851.291686";

            var wfs_params = {

                "test":1557833591312,

                "service": "WFS",

                "version": "2.0.0",

                "request": "GetFeature",

                "time": periode,

                "typenames": "S2.TILE",

                "maxfeatures": 200,

                "srsname": "EPSG:3857",

                "bbox": bbox,

                "outputformat": "application/json"

            };

            $(".sentinel2-cc-values").val();

            $.ajax({

                type: "GET",

                url: "https://services.sentinel-hub.com/ogc/wfs/b7b5e3ef-5a40-4e2a-9fd3-75ca2b81cb32",

                data: wfs_params,

                crossDomain: true,

                dataType: "json",

                success: function (result) {

                    _data = result.features;

                    _updateLayer(20);

                }

            });

 

            $(".sentinel2-cc-values").change(function(e) {

                _updateLayer(this.value);

            });

 

        },

 

        filter: function (cc) {

            var dates = [];

            var result = _data.filter(item => item.properties.cloudCoverPercentage <= cc);

            result.forEach(function(item, id) {

                if (dates.indexOf(item.properties.date) === -1) {

                    dates.push(item.properties.date);

                }

            });

 

            return dates;

        },

       

        destroy: function () {

            // mandatory - code executed when panel is closed

 

        }

     };

 

}());

 

