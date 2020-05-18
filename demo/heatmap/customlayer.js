const layer = new ol.layer.Heatmap({
  source: new ol.source.Vector({
    url: 'demo/heatmap/data/2012_Earthquakes_Mag5.kml',
    format: new ol.format.KML({
      extractStyles: false
    })
  }),
  blur: 10,
  radius: 10,
  weight: function(feature) {    
    var name = feature.get('name');
    var magnitude = parseFloat(name.substr(2));
    return magnitude - 5;
  }
});
new CustomLayer('heatmap', layer);