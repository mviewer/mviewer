{
    mviewer.hooks.heatmap2 = {};
    mviewer.hooks.heatmap2.layer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: "http://geobretagne.fr/geoserver/dreal_b/wfs?request=getFeature&outputFormat=application/json&typename=route_accidents_mortels&srsName=EPSG:4326",
                format: new ol.format.GeoJSON()
            })            
    });
    mviewer.hooks.heatmap2.handle = function (features) {
        alert(features[0].properties.tues_nb + " tué(s) " + features[0].properties.date);
    };  
} 