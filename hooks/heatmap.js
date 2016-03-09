{
    mviewer.hooks.heatmap = {};
    mviewer.hooks.heatmap.layer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: "http://ows.region-bretagne.fr/geoserver/rb/wfs?request=getFeature&outputFormat=application/json&typename=rb:lycee&srsName=EPSG:4326",
                format: new ol.format.GeoJSON()
            })        
    });
    mviewer.hooks.heatmap.handle = function (features) {
        alert(features[0].properties.nom);
    };  
} 