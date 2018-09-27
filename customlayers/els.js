{
    mviewer.customLayers.els = {};
    var els = mviewer.customLayers.els;
    els.filter = false;
    var els2GeoJSON = function(data) {
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        var getProperties = function(source) {
            var properties = {};
            for (var propertyName in source) {
                if (!["geometry", "@timestamp", "@version", "search_id"].includes(propertyName)) {
                    properties[propertyName] = source[propertyName];
                }
            }
            return properties;
        };
        data.hits.hits.forEach(function(item) {
            var properties = getProperties(item._source);
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

    var elsLoader = function(extent, resolution, projection) {
        var filter = {
            "match_all": {}
        };
        if (mviewer.customLayers.els.filter) {
            var matchQueries = [];
            mviewer.customLayers.els.filter.forEach(function(text) {
                var matchQuery = {
                    "match": {
                        "_all": {
                            "query": text,
                            "operator": "and"
                        }
                    }
                };
                matchQueries.push(matchQuery);
            });
            filter = {
                "bool": {
                    "should": matchQueries
                }
            };
        }
        var proj = projection.getCode();
        var e = ol.proj.transformExtent(extent, proj, 'EPSG:4326');
        var url = "http://ows.region-bretagne.fr/kartenn/_search?type=etude_patrimoine_simple";
        var geofilter = JSON.stringify({
            "from": 0,
            "size": 5000,
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
            vectorSource.removeLoadedExtent(extent);
        }
        xhr.onerror = onError;
        xhr.onload = function() {
            if (xhr.status == 200) {
                vectorSource.addFeatures(
                    new ol.format.GeoJSON().readFeatures(els2GeoJSON(JSON.parse(xhr.responseText)), {
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



    els.legend = {
        items: []
    };
    var uniqueStyle = [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'rgba(231, 76, 60, 0.7)'
                })
            })
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: 'rgba(236, 240, 241,7.0)'
                })
            })
        })
    ];
    els.legend.items.push({
        styles: uniqueStyle,
        label: "Elément patrimonial",
        geometry: "Point"
    });
    var manyStyle = function(radius, radius2, size) {
        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: 'rgba(236, 240, 241,0.7)'
                    })
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            }),
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius2,
                    fill: new ol.style.Fill({
                        color: 'rgba(231, 76, 60, 0.7)'
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
    els.legend.items.push({
        styles: manyStyle(10, 10, 7),
        label: "Eléments patrimoniaux",
        geometry: "Point"
    });

    var clusterStyle = function(feature) {
        var size = feature.get('features').length;
        var max_radius = 40;
        var max_value = 500;
        var radius = 10 + Math.sqrt(size) * (max_radius / Math.sqrt(max_value));
        var radius2 = radius * 80 / 100;
        if (size == 1) {
            return uniqueStyle;
        } else {
            return manyStyle(radius, radius2, size);
        }
    };

    var vectorSource = new ol.source.Vector({
        loader: elsLoader,
        strategy: ol.loadingstrategy.bbox
    });


    var clusterSource = new ol.source.Cluster({
        distance: 50,
        strategy: ol.loadingstrategy.bbox,
        source: vectorSource
    });
    mviewer.customLayers.els.layer = new ol.layer.Vector({
        source: clusterSource,
        style: clusterStyle
    });
    els.handle = function(clusters, views) {
        if (clusters.length > 0 && clusters[0].properties.features) {
            var features = clusters[0].properties.features;
            var elements = [];
            var l = mviewer.getLayer("els");
            features.forEach(function(feature, i) {
                elements.push({
                    properties: feature.getProperties()
                });
            });
            var html;
            if (l.template) {
                html = info.templateHTMLContent(elements, l);
            } else {
                html = info.formatHTMLContent(elements, l);
            }
            var view = views["right-panel"];
            view.layers.push({
                "id": view.layers.length + 1,
                "firstlayer": true,
                "manyfeatures": (features.length > 1),
                "nbfeatures": features.length,
                "name": l.name,
                "layerid": "els",
                "theme_icon": l.icon,
                "html": html
            });
        }

    };
}
