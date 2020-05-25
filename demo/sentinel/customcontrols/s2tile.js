mviewer.customControls.s2tile = (function() {
    /*
     * Private
     */
    var _idlayer = 's2tile';

    var _data = [];

    var _filteredDates = [];

    var _selectedDate;


    var _filter = function (cc) {
       var selection = _data.filter(function(o) {
           return o.properties.cloudCoverPercentage <= parseInt(cc);
       });

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
        if (d !== _selectedDate) {
             var cc = $(".sentinel2-cc-values").val();
             _applyFilterToAllLayers(d, cc);
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
        var _layerDefinition = mviewer.getLayers()[layerid];
        var _source = _layerDefinition.layer.getSource();
        _source.getParams()['TIME'] = filter_time;
        _source.getParams()['maxcc'] = cloud_cover;
        _source.changed();
        if (_source.hasOwnProperty("tileClass")) {
            _source.updateParams({'ol3_salt': Math.random()});
        }
    };

    var _formatDate = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
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
        var sentinel2_layers = ["1-NATURAL-COLOR", "4_AGRICULTURE", "5_VEGETATION_INDEX"];
        sentinel2_layers.forEach(function(layer) {
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
            date1.setMonth(date1.getMonth() -1);
            var date2 = new Date();
            var periode = [_formatDate(date1), _formatDate(date2), "P1D"].join("/");
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
            $(".sentinel2-cc-values").val(20);
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
