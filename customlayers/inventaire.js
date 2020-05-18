mviewer.customLayers.inventaire = (function () {

    _filter = false;
    _ready = false;
    _mode = "AND"; /*AND | OR*/
    _maxfeatures = 5000;
    _maxrequestedfeatures = 50;
    _featurescount = null;
    _searchinfields = [ "denomination", "datation", "murs", "toit" ];

    var _els2GeoJSON = function(data) {
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        var getProperties = function(source) {
            var properties = {};
            for (var propertyName in source) {
                if (["geometry", "@timestamp", "@version"].indexOf(propertyName) === -1) {
                    properties[propertyName] = source[propertyName];
                }
            }
            return properties;
        };
        data.hits.hits.forEach(function(item) {
            var properties = getProperties(item._source);
            var prop = {};
            if (item._type === "etude_patrimoine_simple") {
                prop.source = "dossiers d'études complets";
            } else {
                prop.source = "recensement avant étude";
            }
            properties.type = item._type;
            properties.source = prop.source;
            var feature = {
                "type": "Feature",
                "id": item._id,
                "geometry": item._source.geometry,
                "properties": properties
            };
            geojson.features.push(feature);
        });
        return JSON.stringify(geojson);
    };

    var _elsLoader = function(extent, resolution, projection) {
        var filter = {
            "match_all": {}
        };
        if (_filter) {
            var matchQueries = [];
            _filter.forEach(function(text) {
                var matchQuery = {
                    "match": {
                        "_all": {
                            "query": text,
                            "operator": "and"
                        }
                    }
                };
                if (_searchinfields.length > 0) {
                    matchQuery = {
                        "multi_match" : {
                            "query":    text,
                            "operator": "and",
                            "fields": _searchinfields
                        }
                    };
                }
                matchQueries.push(matchQuery);
            });
            filter = {
                "bool": {
                    "should": matchQueries,
                    "minimum_should_match": (_mode === "AND")? matchQueries.length: 1
                }
            };
        }
        var proj = projection.getCode();
        var e = ol.proj.transformExtent(extent, proj, 'EPSG:4326');
        var url = "https://ows.region-bretagne.fr/kartenn/_search?";
        var geofilter = JSON.stringify({
            "from": 0,
            "size": (_ready)? _maxfeatures: 10,
            "query": {
                "bool": {
                    "must": [
                        filter,
                        {
                            "bool": {
                                "should": [{
                                    "type": {
                                        "value": "etude_patrimoine_simple"
                                    }
                                },
                                {
                                    "type": {
                                        "value": "recensement_patrimoine"
                                    }
                                }]
                            }
                        }
                    ],
                    "filter": {
                        "geo_shape": {
                            "geometry": {
                                "shape": {
                                    "type": "envelope",
                                    "coordinates": [
                                        [e[0], e[1]],
                                        [e[2], e[3]]
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        });
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        var onError = function() {
            _vectorSource.removeLoadedExtent(extent);
        }
        xhr.onerror = onError;
        xhr.onload = function() {
            if (xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                var message = "* Affichage complet - " + json.hits.total + " éléments";
                if (json.hits.total >  json.hits.hits.length) {
                    message = "* Affichage partiel : " +parseInt(json.hits.hits.length/json.hits.total*100) + "% des éléments" ;
                }
                _featurescount = json.hits.hits.length;
                $("#inventaire_search_message i").text(message);
                _vectorSource.addFeatures(
                    new ol.format.GeoJSON().readFeatures(_els2GeoJSON(json), {
                        dataProjection: 'EPSG:4326',
                        featureProjection: proj
                    })
                );
            } else {
                onError();
            }
        }
        xhr.send(geofilter);
    };



    _legend = {
        items: []
    };
    var _styleEtude = [new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(0, 40, 107, .8)'
            }),
            stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 2
            }),
            radius: 8
        })
    })];

    _legend.items.push({styles:_styleEtude, label: "Etudes", geometry: "Point"});

    var _styleRecensement = [new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(144, 106, 131, .8)'
            }),
            stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 2
            }),
            radius: 8
        })
    })];

    _legend.items.push({styles:_styleRecensement, label: "Recensement", geometry: "Point"});

    var _mixedStyle = function (radius, size) {
        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: 'rgba(79, 76, 120, .7)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ffffff",
                        width: 2
                    })
                }),
                text: new ol.style.Text({
                    font: '12px roboto_regular, Arial, Sans-serif',
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            })
        ];
    };
    _legend.items.push({styles:_mixedStyle(12,7), label: "Corpus d'études et de recencés", geometry: "Point"});

    var _styleUnique = function(feature) {
        var stl;
        if(feature.get('type') === 'recensement_patrimoine') {
            stl = _styleRecensement;
        } else if(feature.get('type') === 'etude_patrimoine_simple') {
            stl = _styleEtude;
        }
        return stl;
    };

    var _clusterStyle = function(feature) {
        var size = feature.get('features').length;
        var max_radius = 40;
        var max_value = _featurescount || _maxfeatures;
        var radius = 10 + Math.sqrt(size)*(max_radius / Math.sqrt(max_value));
        if (size == 1) {
            return _styleUnique(feature.getProperties().features[0]);
        } else {
            return _mixedStyle(radius, size);
        }
    };



    var _vectorSource = new ol.source.Vector({
        loader: _elsLoader,
        strategy: ol.loadingstrategy.bbox
    });

    var _layer = new ol.layer.Vector({
        source: new ol.source.Cluster({
            distance: 50,
            source: _vectorSource
        }),
        style: _clusterStyle
    });
    var _handle = function(clusters, views) {
        if (clusters.length > 0 && clusters[0].properties.features) {
        var features = clusters[0].properties.features;
            var extraTemplate = [
                '{{#lien_image}}',
                '<img src="{{lien_image}}" class="img-responsive center-block" />',
                '{{/lien_image}}',
                '{{#photo_1}}',
                '<img src="{{photo_1}}" class="img-responsive center-block" />',
                '{{/photo_1}}',
                '<p class="text-feature">',
                '{{#datation_principale}}',
                '<span > Datation :</span> {{datation_principale}}<br/>',
                '{{/datation_principale}}',
                '<span > Commune : </span>{{commune}}<br/>',
                '{{#localisation}}',
                '<span> Localisation :</span> {{localisation}}<br/>',
                '{{/localisation}}',
                '{{^localisation}}',
                '<span > Localisation :</span> {{adresse}} {{lieudit}} {{commune}}<br/>',
                '{{/localisation}}',
                '{{#cadre_etude}}',
                '<span > Enquête(s) :</span> {{cadre_etude}}<br/>',
                '{{/cadre_etude}}',
                '{{#date_bordereau}}',
                '<span > Date(s) de bordereau  :</span> {{date_bordereau}}<br/>',
                '{{/date_bordereau}}',
                '{{#lien_dossier}}',
                '<div class="but_link">',
                '<p> <a href="{{lien_dossier}}" target=_blank"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Dossier complet</a>',
                '</p>',
                '</div>',
                '{{/lien_dossier}}',
                '{{#url}}',
                '<div class="but_link">',
                '<p> <a href="{{url}}" target=_blank"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Lien vers notice</a>',
                '</p>',
                '</div>',
                '{{/url}}',
                '</p>'
            ].join(" ");
            var _extendHTML = function (wfsfeatures) {
                wfsfeatures.forEach(function (wfsfeature, i) {
                    var html = Mustache.render(extraTemplate, wfsfeature.properties);
                    $(document.getElementById(wfsfeature.properties.search_id)).append(html);
                });

            };

            var _renderHTML = function (elements) {
                var l = mviewer.getLayer("inventaire");
                var html;
                if (l.template) {
                    html = info.templateHTMLContent(elements, l);
                } else {
                    html = info.formatHTMLContent(elements, l);
                }
                var view = views["right-panel"];
                view.layers.push({
                    "id": view.layers.length + 1,
                    "firstlayer": false,
                    "manyfeatures": (features.length > 1),
                    "nbfeatures": features.length,
                    "name": l.name,
                    "layerid": "inventaire",
                    "theme_icon": l.icon,
                    "html": html
                });
            };
            // Get additional infos via wfs for each feature
            var search_ids = [];
            var featuretypes = [];
            var elements = [];

            features.forEach(function(feature, i) {
                if (feature.getProperties() && feature.getProperties().search_id && i < _maxrequestedfeatures) {
                    search_ids.push("'" + feature.getProperties().search_id + "'");
                    if (featuretypes.indexOf(feature.getProperties().type) === -1) {
                        featuretypes.push(feature.getProperties().type);
                    }
                    elements.push({
                        properties: feature.getProperties()
                    });
                }
            });

            if (search_ids.length > 0) {
                var wfs_url = 'https://ows.region-bretagne.fr/geoserver/rb/wfs';
                var wfs_params = {
                    "REQUEST": "getFeature",
                    "TYPENAME": featuretypes.join(","),
                    "VERSION": "2.0.0",
                    "SERVICE": "WFS",
                    "outputFormat": "application/json",
                    "CQL_FILTER" : "search_id IN (" + search_ids.join(",") + ")"
                }

                $.ajax({
                    type: "GET",
                    async:true,
                    url: wfs_url,
                    data: wfs_params,
                    dataType: "json",
                    success: function (data) {
                        _extendHTML(data.features);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                    }
                });
            }
            _renderHTML(elements);
        }
    };


    return {
        layer: _layer,
        handle: _handle,
        legend: _legend,
        mode: _mode,
        setFilter: function (val) { _filter = val; _ready = true; },
        getFilter: function () { return _filter; }
    };

}());
