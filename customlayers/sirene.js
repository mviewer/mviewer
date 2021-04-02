{
mviewer.customLayers.sirene = {};
mviewer.customLayers.sirene.layer = new ol.layer.Heatmap({
        source: new ol.source.Vector({
            url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?request=getFeature&outputFormat=application/json&typename=sirene_bretagne&srsName=EPSG:4326&CQL_FILTER=activiteprincipale%3D%2756.30Z%27",
            format: new ol.format.GeoJSON()
        })
  });
mviewer.customLayers.sirene.handle = false;
} 