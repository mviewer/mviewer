{
mviewer.hooks.fiche_epci = {};
mviewer.hooks.fiche_epci.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/epci_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(114,72,127,255)',
            width: 1.5
          }),
          fill: new ol.style.Fill({
            color: 'rgba(114,72,127,0.2)'
          })
})        
  });
mviewer.hooks.fiche_epci.handle = false;
} 