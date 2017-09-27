{
mviewer.customLayers.adm0 = {};
mviewer.customLayers.adm0.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "demo/afrique_sud/customlayers/zaf_adm0_3857.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0,0,255)',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.02)'
          })
})        
  });
mviewer.customLayers.adm0.handle = false;
} 