{
mviewer.customLayers.els = {};
mviewer.customLayers.els.filter = false;
var els2GeoJSON = function (data) {
    var geojson = {"type":"FeatureCollection","features":[]};
    var getProperties = function (source) {
        var properties = {};
        for(var propertyName in source) {
           if (!["geometry", "@timestamp", "@version", "search_id"].includes(propertyName)) {
                properties[propertyName] = source[propertyName];
           }
        }
        return properties;
    };
    data.hits.hits.forEach(function (item) {
        var properties = getProperties(item._source);
        var feature = {"type":"Feature","id": item._id,"geometry":item._source.geometry, "properties": properties};
        geojson.features.push(feature);
    });
    return JSON.stringify(geojson);
};
var vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection) {
     var filter = {"match_all" : {}};
     if (mviewer.customLayers.els.filter) {
        filter = {
                    "match": {
                        "_all":{
                            "query": mviewer.customLayers.els.filter
                            //,"fuzziness":"AUTO"
                        }
                    }
                };
     }
     var proj = projection.getCode();
     var e = ol.proj.transformExtent(extent, proj, 'EPSG:4326');
     var url = "http://ows.region-bretagne.fr/kartenn/_search?type=etude_patrimoine_simple";
     /*var geofilter = JSON.stringify({
        "from" : 0, "size" : 5000,
        "query": {
            "bool" : {
                "must" : {
                    "match_all" : {}
                },
                "filter" : {
                    "geo_shape" : {
                        "geometry" : {
                            "shape":{"type":"envelope","coordinates":[[e[0], e[1]],[e[2],e[3]]] }
                        }
                    }
                }
            }
        }
    });*/

    var geofilter = JSON.stringify({
        "from" : 0, "size" : 5000,
        "query": {
            "bool": {
                "must": [
                filter,
                {
                    "bool": {
                        "should":[{
                            "type":{
                                "value":"etude_patrimoine_simple"
                            }
                        }]
                    }
                }],
                "filter": {
                    "geo_shape":{
                        "geometry": {
                            "shape":{
                                "type":"envelope",
                                "coordinates":[[e[0], e[1]],[e[2],e[3]]]
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
             //vectorSource.getFormat().readFeatures(xhr.responseText));
             vectorSource.getFormat().readFeatures(els2GeoJSON(JSON.parse(xhr.responseText)),{ dataProjection: 'EPSG:4326', featureProjection: proj})
         );
       } else {
         onError();
       }
     }
     xhr.send(geofilter);
   },
   strategy: ol.loadingstrategy.bbox
 });

mviewer.customLayers.els.layer = new ol.layer.Vector({
        source: vectorSource,
        style: mviewer.featureStyles.circle1
});
mviewer.customLayers.els.handle = false;
}
