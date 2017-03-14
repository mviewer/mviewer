{
mviewer.hooks.departement = {};
mviewer.hooks.departement.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/departement_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(23,36,52,255)',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
})        
  });
mviewer.hooks.fiche_epci.handle = false;
} 