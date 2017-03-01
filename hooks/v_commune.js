{
mviewer.hooks.v_commune = {};
mviewer.hooks.v_commune.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/pays_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
})        
  });
mviewer.hooks.v_commune.handle = function (features) {        
       /*mviewer.alert(features[0].properties.nom_geo, "alert-info");*/
   };    
} 