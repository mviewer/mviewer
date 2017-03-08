{
mviewer.hooks.fiche_pays = {};
mviewer.hooks.fiche_pays.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "data/pays_simple.geojson",
            format: new ol.format.GeoJSON()
        }),
style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(114,72,127,255)',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: 'rgba(114,72,127,0.2)'
          })
})        
  });
mviewer.hooks.fiche_pays.handle = function (features) {        
       /*mviewer.alert(features[0].properties.nom_geo, "alert-info");*/
   };    
} 