{
mviewer.hooks.lycee2 = {};
mviewer.hooks.lycee2.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "http://ows.region-bretagne.fr/geoserver/rb/wfs?request=getFeature&outputFormat=application/json&typename=rb:lycee&srsName=EPSG:4326",
            format: new ol.format.GeoJSON()
        })
        ,style : new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: 'rgba(255,0,0,0.5)'
            }),
            radius: 9,
            stroke: new ol.style.Stroke({
              color: '#ff0',
              width: 2
            })
          })
        })
  })                    
} 