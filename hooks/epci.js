{
mviewer.hooks.epci = {};
mviewer.hooks.epci.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/epci_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
})        
  });
mviewer.hooks.epci.handle = function (features) {        
       mviewer.alert(features[0].properties.nom_geo, "alert-info");
   };    
} 