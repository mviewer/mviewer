var search = (function () {

    /* Penser à supprimer toutes les références à iconsearch, propriété plus utilisée.*/

    /* COMMON WITH MVIEWER */

    /**
     * Property: _map
     *  @type {ol.Map}
     */

    var _map;

    /**
     * Property: _sourceOverlay
     * @type {ol.source.Vector}
     * Used to highlight vector features
     */

    var _sourceOverlay;

    /**
     * Property: _projection
     *  @type {ol.proj.Projection}
     */

    var _projection;

    /**
     * Property: _overLayers
     * {object} hash of all overlay Layers (static)
     */

    var _overLayers;

    /* FIN DE COMMON */

    /**
     * Property: _sourceEls
     * @type {ol.source.Vector}
     * Used to highlight ELS vector features
     */

    var _sourceEls;

    /**
     * Property: _searchableElasticsearchLayers
     * Array of {ol.layers.WMS} .
     */

    var _searchableElasticsearchLayers = [];

    /**
     * Property: _searchableFuseLayers
     * Array of {ol.Layers.WMS} .
     */

    var _searchableFuseLayers = [];

        /**
     * Property: _olsCompletionUrl
     * String. The OpenLs url used by the geocode control
     */

    var _olsCompletionUrl = null;

    /**
     * Property: _olsCompletionType
     * String. The service type used by the geocode control (geoportail or ban)
     */

    var _olsCompletionType = null;

    /**
     * Property: _elasticSearchUrl
     * String. The Elasticsearch url used by search function
     */

    var _elasticSearchUrl = null;

    /**
     * Property: _elasticSearchGeometryfield
     * String. The Elasticsearch geometry field used by search function
     */

    var _elasticSearchGeometryfield = null;

     /**
     * Property: _elasticSearchDocTypes
     * String. The Elasticsearch document types to use in all search requests
     */

    var _elasticSearchDocTypes = null;

    /**
     * Property: _elasticSearchVersion
     * String. The version of Elasticsearch instance
     */

    var _elasticSearchVersion = null;

    /**
     * Property: _elasticSearchLinkid
     * String. The common id between Elasticsearch document types (_id)  and wfs featureTypes.
     *
     */

    var _elasticSearchLinkid = "search_id";

    /**
     * Property: _elasticSearchQuerymode
     * String. The Elasticsearch query mode used by search function
     */

    var _elasticSearchQuerymode = null;

    /**
     * Property: _fuseSearchData
     * String. data from GeoJSON layers for which the fuse search is activated
     */

    var _fuseSearchData = [];

    /**
     * Property: _searchparams
     * Enables properties the search
     */

    var _searchparams = { localities : true, bbox: false, features: false, static: false, querymaponclick:false, closeafterclick:false};

     /**
     * Private Method: _clearSearchResults
     *
     */

    var _clearSearchResults = function () {
        $("#searchresults .list-group-item").remove();
        $("#searchresults").hide();

    };

    /**
     * Private Method: _clearSearchField
     *
     */

    var _clearSearchField = function () {
        _clearSearchResults();
        $("#searchfield").val("");
    };

    var _showResults = function (results) {
        $("#searchresults").append(results);
        if (_searchparams.closeafterclick) {
            $("#searchresults .list-group-item").click(function(){
                $(".searchresults-title .close").trigger("click");
            });
        }
        $("#searchresults").show();
    };

    /**
     * Private Method: _initSearch
     *
     */

    var _initSearch = function () {
        $("#searchtool a").attr("title", "Effacer");
        if (_searchparams.features || _searchparams.static) {
            _sourceEls = new ol.source.Vector();
            var vector = new ol.layer.Vector({
                source: _sourceEls,
                style: mviewer.featureStyles.elsStyle
            });
            vector.set('mviewerid', 'elasticsearch');
            _map.addLayer(vector);
        }

        $(".searchresults-title .close").click(function () {
            _clearSearchField();
            if (_sourceEls) {
                _sourceEls.clear();
            }
        });

        $(document).on("keyup", "#searchfield", function (e) {
            if (e.keyCode == 13 && $('#searchresults a').length > 1) {
                var firstitem = $('#searchresults').find('a')[1];
                $(firstitem).trigger('click');
                return;
            }
            var chars = $(this).val().length;
            if (chars === 0) {
            } else if ((chars >0) && (chars < 3)) {
                $("#searchresults .list-group-item").remove();
            } else {
                _search($(this).val());
            }
        });

        mviewer.zoomToFeature = search.zoomToFeature;
        mviewer.showFeature = search.showFeature;
    };

    var _search = function (value) {
        // OpenLS or BAN search
        if (_searchparams.localities) {
            if (_olsCompletionType === "geoportail") { // Open LS search
                $.ajax({
                    type: "GET",
                    url: _olsCompletionUrl,
                    crossDomain: true,
                    data: {
                        text: value,
                        type: "StreetAddress,PositionOfInterest",
                        ter: "5"
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        var zoom = 12;
                        var res = data.results;
                        var str = '<a class="geoportail list-group-item disabled">Localités</a>';
                        //var str = '';
                        for (var i = 0, len = res.length; i < len && i < 5; i++) {
                             switch (res[i].classification) {
                                case 1:
                                case 2:
                                    zoom = 13;
                                    break;
                                case 3:
                                case 4:
                                    zoom = 14;
                                    break;
                                case 5:
                                    zoom = 15;
                                    break;
                                case 6:
                                    zoom = 16;
                                    break;
                                case 7:
                                    zoom = 17;
                                    break;
                                }
                            str += '<a class="geoportail list-group-item" href="#" onclick="mviewer.zoomToLocation(' +
                            res[i].x + ',' + res[i].y + ',' + zoom + ',' + _searchparams.querymaponclick +');" '+
                            'onmouseover="mviewer.flash('+'\'EPSG:4326\',' + res[i].x + ',' + res[i].y + ');"> ' +
                            res[i].fulltext + '</a>';
                        }
                        $(".geoportail").remove()
                        if (res.length > 0) {
                             _showResults(str);
                        }
                    }
                });
            } else if (_olsCompletionType === "ban") { // BAN search
                var parameters = {q: value, limit: 5};
                if (_searchparams.bbox) {
                    var center = _map.getView().getCenter();
                    var center = ol.proj.transform(center, _projection.getCode(), 'EPSG:4326');
                    parameters.lon = center[0];
                    parameters.lat = center[1];
                }
                $.ajax({
                    type: "GET",
                    url: _olsCompletionUrl,
                    crossDomain: true,
                    data: parameters,
                    dataType: "json",
                    success: function (data) {
                        var zoo = 0;
                        var res = data.features;
                        var str = '<a class="geoportail list-group-item disabled">Localités</a>';
                        for (var i = 0, len = res.length; i < len && i < 5; i++) {
                            switch(res[i].properties.type) {
                                case 'city':
                                    zoom = 13;
                                    break;
                                case 'town':
                                    zoom = 15;
                                    break;
                                case 'village':
                                    zoom = 16;
                                    break;
                                case 'street':
                                    zoom = 17;
                                    break;
                                case 'housenumber':
                                    zoom = 18;
                                    break;
                                default:
                                    zoom = 14;
                            }
                            str += '<a class="geoportail list-group-item" href="#" title="' +
                            res[i].properties.context+' - ' + res[i].properties.type +
                            '" onclick="mviewer.zoomToLocation('+
                            res[i].geometry.coordinates[0] + ',' +
                            res[i].geometry.coordinates[1] + ',' + zoom + ',' + _searchparams.querymaponclick +');">' + res[i].properties.label + '</a>';
                        }
                        $(".geoportail").remove();
                        _showResults(str);
                    }
                });
            }
        }

        // ElasticSearch request
        if (_searchparams.features || _searchparams.static) {
            _sendElasticsearchRequest(value);
        }

        // Fuse search on local GEOJSON
        if (_searchparams.features) {
            _sendFuseRequest(value);
        }
    };

    var _shapeToPoint = function (geometry){
        var point=[];
        var position = Math.floor(geometry.coordinates.length /2);
        if (geometry == null)
            return;
        switch (geometry.type)
        {
            case "MultiPoint":
                point[0]=geometry.coordinates[position][0];
                point[1]=geometry.coordinates[position][1];
                break;
            case "MultiLineString":
                point[0]=geometry.coordinates[0][0][0];
                point[1]=geometry.coordinates[0][0][1];
            break;
            case "LineString":
                point[0]=geometry.coordinates[position][0];
                point[1]=geometry.coordinates[position][1];
                break;
            case "MultiPolygon":
            case "Polygon":
                point = ol.extent.getCenter(new ol.format.GeoJSON().readGeometry(geometry).getExtent());
                break;
            default:
                point[0]=geometry.coordinates[0];
                point[1]=geometry.coordinates[1];
                break;
        }
        return point;
    };

    /**
     * Private Method: _sendFuseRequest
     *
     */
    var _sendFuseRequest = function (val) {
        $(".fuse").remove();

        var searchableLayers =  $.grep( _searchableFuseLayers, function( l, i ) {
            return l.getVisible();
        });

        for (var i = 0; i < searchableLayers.length; i++) {

            var layername = searchableLayers[i].get('name');
            var layerid = searchableLayers[i].get('mviewerid');

            var results = _fuseSearchData[layerid].search(val);
            var zoom = 15;
            var max_results = 5;
            var str = "";
            if (results.length > 0) {
                // We only display the first results
                results = results.slice(0, max_results);

                str = '<a class="fuse list-group-item disabled">' + layername + '</a>';
                results.forEach(function(element){
                    /*
                     * 2 cases, one specific field or a Mustache template for combining fields in a string. Examples:
                     * - name of a field: name
                     * - Mustache template : {{name}} ({{city}})
                     * - other Mustache template : {{name}}{{#city}} ({{city}}){{/city}}
                     */
                    var _fuseSearchResult = element.fusesearchresult;
                    if (_fuseSearchResult.indexOf('{{')  === -1 && _fuseSearchResult.indexOf('}}')  === -1) {
                        // one specific field
                        result_label = element[element.fusesearchresult];
                    } else {
                        // a Mustache template
                        result_label = Mustache.render(_fuseSearchResult, element);
                    }
                    var geom = new ol.format.GeoJSON().readGeometry(element.geometry);
                    var xyz = mviewer.getLonLatZfromGeometry(geom, 'EPSG:4326', zoom);
                    str += '<a class="fuse list-group-item" title="' + result_label + '" ' +
                        'href="#" onclick="mviewer.zoomToLocation('
                        + xyz.lon + ',' + xyz.lat + ',' + xyz.zoom + ',' + _searchparams.querymaponclick +');mviewer.showLocation(\'EPSG:4326\','
                        + xyz.lon + ',' + xyz.lat +');" '
                        + 'onmouseover="mviewer.flash(\'EPSG:4326\',' + xyz.lon + ',' + xyz.lat + ');" >'
                        + result_label + '</a>';
                });
            }
            _showResults(str);
        }
    };

    /**
     * Private Method: _sendElasticsearchRequest
     *
     */

    var _sendElasticsearchRequest = function (val) {
        var sendQuery = true;
        var searchableLayers =  $.grep( _searchableElasticsearchLayers, function( l, i ) {
            return l.getVisible();
        });
        if (searchableLayers.length > 0 || (_searchparams.static && _elasticSearchDocTypes)) {
            var queryLayers = [];
            var currentExtent = _map.getView().calculateExtent(_map.getSize());
            var pe = ol.proj.transformExtent(currentExtent, _projection.getCode(), 'EPSG:4326');
            for (var i = 0; i < searchableLayers.length; i++) {
                queryLayers.push({"type":{"value": searchableLayers[i].getSource().getParams()['LAYERS']}});
            }
            if (_searchparams.static && _elasticSearchDocTypes) {
                var doctypes = _elasticSearchDocTypes.split(",");
                for (var i = 0; i < doctypes.length; i++) {
                    queryLayers.push({"type":{"value": doctypes[i]}});
                }
            }
            var query;
            var mode = _elasticSearchQuerymode;
            var queryFilter = "";
            if (val.substring(0,1) === "#") {
                    mode = "term";
                    val = val.substring(1,val.length);
                }
                if (val.slice(0,1) === "\"") {
                    sendQuery = false;
                }
                if ((val.slice(0,1) === "\"") && (val.slice(-1) === "\"")) {
                    mode = "phrase";
                    val = val.substring(1,val.length-1);
                    sendQuery = true;
                }
            if (_elasticSearchVersion === "1.4") {
                switch (mode) {
                    case "term":
                        query = {"match": {"_all": val}};
                        break;
                    case "phrase":
                        query = {"match_phrase": {"_all": val}};
                        break;
                    case "match":
                        query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12, "fuzziness":0.7}};
                        break;
                    default:
                        query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12, "fuzziness":0.7}};
                }

                queryFilter = {
                    "query": {
                        "filtered" : {
                            "query" : query,
                            "filter" :  {
                                "and": {
                                    "filters": [
                                        {"or" :
                                            {"filters": queryLayers}
                                        }
                                    ]
                                }
                            }
                        }
                    }
                };

            } else {
                switch (mode) {
                    case "term":
                        query = {"term": {"id": val}};
                        break;
                    case "phrase":
                        query = {"match_phrase": {"_all": val}};
                        break;
                    case "match":
                         query = {"match":{"_all": {"query": val,"fuzziness": "AUTO"}}};
                        break;
                    default:
                        query = {"match":{"_all": {"query": val,"fuzziness": "AUTO"}}};
                }
                queryFilter = {
                    "query": {
                        "bool": {
                            "must": [
                                query,
                                {
                                    "bool": {
                                        "should": queryLayers
                                    }
                                }
                             ]
                        }
                    }
                };
            }

            if (_searchparams.bbox) {
                var geometryfield = _elasticSearchGeometryfield || "location";
                var geofilter = {"geo_shape": {}};
                geofilter.geo_shape[geometryfield] = {"shape": {"type": "envelope",
                    "coordinates" : [[ pe[0], pe[3] ],[ pe[2], pe[1] ]]}};
                if (_elasticSearchVersion === "1.4") {
                    queryFilter.query.filtered.filter.and.filters.push(geofilter);
                } else {
                    queryFilter.query.bool.filter = geofilter;
                }
            }
            if (sendQuery) {
                // Fix IE9 "No transport error" with cors
                jQuery.support.cors = true;
                $.ajax({
                    type: "POST",
                    url: _elasticSearchUrl,
                    crossDomain: true,
                    data: JSON.stringify(queryFilter),
                    dataType: "json",
                    //contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        _sourceEls.clear();
                        var str = '<a class="elasticsearch list-group-item disabled" >Entités</a>';
                        var format = new ol.format.GeoJSON();
                        var nb = data.hits.hits.length;
                        for (var i = 0, nb ; i < nb && i < 5; i++) {
                            var point = _shapeToPoint(data.hits.hits[i]._source.geometry);
                            var geom =  new ol.format.GeoJSON().readGeometry(data.hits.hits[i]._source.geometry);
                            var geomtype = geom.getType();
                            var action_click = "";
                            var action_over = "";
                            var icon = "img/star.svg";
                            var title =   data.hits.hits[i]._source.title;
                            if (geomtype !== 'Point') {
                                var feature = new ol.Feature({geometry: geom.transform('EPSG:4326','EPSG:3857'), title:title});
                                action_click = 'mviewer.zoomToFeature(\'feature.'+i+'\');';
                                feature.setId( "feature." +i);
                                _sourceEls.addFeature(feature);
                                action_over = 'mviewer.showFeature(\'feature.'+i+'\');';
                            } else {
                                action_click = 'mviewer.zoomToLocation('  + point[0] + ',' + point[1]  + ',14,' + _searchparams.querymaponclick +');';
                                action_over = 'mviewer.flash('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');';
                            }
                            if  (_overLayers[data.hits.hits[i]._type] ) {
                                //icon = _overLayers[data.hits.hits[i]._type].iconsearch;
                                action_click += 'mviewer.tools.info.queryLayer(' + point[0] + ',' + point[1] + ',\'EPSG:4326\',\''+
                                data.hits.hits[i]._type+'\',\''+ data.hits.hits[i]._id+'\');';
                                action_over = 'mviewer.flash('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');';
                            }

                            str += '<a class="elasticsearch list-group-item" href="#" ' +
                            'onclick="'+action_click+ '" ' +
                            'onmouseover="'+action_over+'" ' +
                            'title="('+ data.hits.hits[i]._type + ') ' +
                            $.map(data.hits.hits[i]._source, function(el) {
                                if (typeof(el)==='string') {return el};
                            }).join(", \n")+'">' + title + '</a>';
                        }
                        $(".elasticsearch").remove();
                        if (nb > 0) {
                            _showResults(str);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        mviewer.alert("Problème avec l'instance Elasticsearch.\n" +  thrownError + "\n Désactivation du service.", "alert-warning");
                        _searchparams.features = false;
                        _searchparams.static = false;
                        $('#param_search_features span').removeClass('mv-checked').addClass('mv-unchecked');
                    }
                });
            }
        }
    };
    /* appeler cette fonction à partir de init de mviewer après
        oLayer.queryable = ($(this).attr("queryable") == "true") ? true : false;*/

    var _configSearchableLayer = function (oLayer, params) {
        oLayer.searchid = (params.searchid)? params.searchid : _elasticSearchLinkid;
        oLayer.searchengine = (params.searchengine) ? params.searchengine : 'elasticsearch';
        oLayer.fusesearchkeys = (params.fusesearchkeys) ? params.fusesearchkeys : '';
        oLayer.fusesearchresult = (params.fusesearchresult) ? params.fusesearchresult : '';
        return oLayer;
    };

    var _processSearchableLayer = function (oLayer) {
        var l = oLayer.layer;
        switch (oLayer.searchengine) {
            case "fuse":
                if (_searchableFuseLayers.indexOf(l) === -1) {
                    _searchableFuseLayers.push(l);
                }
                var options = {
                    shouldSort: true,
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 2,
                    keys: oLayer.fusesearchkeys.split(',')
                };


                var layerSource = l.getSource();
                if (l.getSource().source) {/* clusters */
                    layerSource = l.getSource().getSource();
                }
                var _listener = layerSource.on('change', function(event) {
                    var source = event.target;
                    if (source.getState() === "ready") {
                        var features = source.getFeatures();
                        if (features.length > 0) {
                            var geojsonFormat = new ol.format.GeoJSON();
                            var mapProj = _map.getView().getProjection();

                            var j = [];

                            features.forEach(function(feature) {
                                var geojsonFeature = geojsonFormat.writeFeatureObject(feature);
                                var wgs84Geom = feature.getGeometry().clone().transform(mapProj, "EPSG:4326");
                                var prop = geojsonFeature.properties;
                                prop.geometry = geojsonFormat.writeGeometryObject(wgs84Geom);
                                prop.fusesearchresult = oLayer.fusesearchresult;
                                j.push(prop);
                            });

                            var list = $.map(j, function(el) { return el });
                            _fuseSearchData[oLayer.id] = new Fuse(list, options);
                            //remove listener when data is loaded
                            ol.Observable.unByKey(_listener);
                        }
                    }
                });
                break;

            case "elasticsearch":
                _searchableElasticsearchLayers.push(l);
                break;
        }
    };

    var _init = function (configuration) {
        _map = mviewer.getMap();
        _sourceOverlay = mviewer.getSourceOverlay();
        _projection = mviewer.getProjection();
        _overLayers = mviewer.getLayers();
        if (configuration.olscompletion) {
            _olsCompletionUrl = configuration.olscompletion.url;
            $("#adresse-attribution").text(configuration.olscompletion.attribution);
            _olsCompletionType = configuration.olscompletion.type || "geoportail";
        }
        if (configuration.elasticsearch) {
            _elasticSearchUrl = configuration.elasticsearch.url;
            _elasticSearchQuerymode = configuration.elasticsearch.querymode;
            _elasticSearchGeometryfield = configuration.elasticsearch.geometryfield;
            _elasticSearchDocTypes = configuration.elasticsearch.doctypes;
            _elasticSearchVersion = configuration.elasticsearch.version || "1.4";
            // common id between elasticsearch document types (_id)  and geoserver featureTypes
            _elasticSearchLinkid = configuration.elasticsearch.linkid || "featureid";
        }

        if (!_olsCompletionUrl)  {
            _searchparams.localities = false;
        }
        if (configuration.searchparameters && configuration.searchparameters.bbox &&
            configuration.searchparameters.localities && configuration.searchparameters.features) {
            _searchparams.bbox = (configuration.searchparameters.bbox === "true");
            _searchparams.localities = (configuration.searchparameters.localities === "true");
            _searchparams.features = (configuration.searchparameters.features === "true");
            _searchparams.static = (configuration.searchparameters.static === "true");
            _searchparams.querymaponclick = (configuration.searchparameters.querymaponclick === "true");
            _searchparams.closeafterclick = (configuration.searchparameters.closeafterclick === "true");
        }
        if (_searchparams.localities===false && _searchparams.features===false) {
            $("#searchtool").remove();
        }
        if (_searchparams.bbox) {
            $('#param_search_bbox span').removeClass('mv-unchecked').addClass('mv-checked');
        }
        if (_searchparams.localities) {
            $('#param_search_localities span').removeClass('mv-unchecked').addClass('mv-checked');
        } else {
            $("#param_search_localities").remove();
        }
        if (_searchparams.features) {
            $('#param_search_features span').removeClass('mv-unchecked').addClass('mv-checked');
        } else {
            $("#param_search_features").remove();
        }

        if (_searchparams.features === false) {
            $('#searchparameters .searchfeatures').remove('.searchfeatures');
        }
        if (configuration.searchparameters && configuration.searchparameters.inputlabel) {
            var label = configuration.searchparameters.inputlabel;
            $("#searchfield").attr("placeholder", label).attr("title", label);
        }
        _initSearch();
    };

    var _toggleParameter = function (li) {
        var span = $(li).find("span");
        var parameter = false;
        if (span.hasClass('mv-unchecked') === true ) {
            span.removeClass('mv-unchecked').addClass('mv-checked');
            parameter = true;
        } else {
            span.removeClass('mv-checked').addClass('mv-unchecked');
        }
        switch (li.id) {
            case "param_search_bbox":
                _searchparams.bbox = parameter;
                break;
            case "param_search_localities":
                _searchparams.localities = parameter;
                break;
            case "param_search_features":
                _searchparams.features = parameter;
                break;
        }

    };

     var _showFeature = function (featureid) {
        var feature = _sourceEls.getFeatureById(featureid).clone();
        _sourceOverlay.clear();
        _sourceOverlay.addFeature(feature);
    };

    var _clear = function () {
        if (_sourceEls && _sourceOverlay) {
            _sourceEls.clear();
            _sourceOverlay.clear();
        }
    };

    /**
     * Public Method: zoomToFeature
     *
     */

    var _zoomToFeature = function (featureid) {
        var feature = _sourceEls.getFeatureById(featureid).clone();
        _sourceEls.clear();
        _sourceOverlay.clear();
        _sourceOverlay.addFeature(feature);
        var boundingExtent = feature.getGeometry().getExtent();
        var duration = 2000;
        _map.getView().fit(boundingExtent, { size: _map.getSize(),
            padding: [0, $("#sidebar-wrapper").width(), 0, 0], duration: duration});

        function clear() {
            _sourceOverlay.clear();
        }
        setTimeout(clear, duration*2);

    };


    return {
        init: _init,
        configSearchableLayer: _configSearchableLayer,
        processSearchableLayer: _processSearchableLayer,
        toggleParameter: _toggleParameter,
        sendElasticsearchRequest: _sendElasticsearchRequest,
        options: _searchparams,
        showFeature: _showFeature,
        zoomToFeature: _zoomToFeature,
        clear: _clear,
        clearSearchField: _clearSearchField
    };

})();