{
    mviewer.hooks.heatmap2 = {};
    mviewer.hooks.heatmap2.layer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: "demo/iris.geojson",
                format: new ol.format.GeoJSON()
            })            
    });
    mviewer.hooks.heatmap2.handle = function (features) {
        alert(features[0].properties.TYP_IRIS);
    };  
} 