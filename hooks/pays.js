{
mviewer.hooks.pays = {};
mviewer.hooks.pays.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/pays_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(45, 64,89,255)',
            width: 2.4
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
})        
  });
mviewer.hooks.pays.handle = false;
} 