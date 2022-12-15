{
  mviewer.customLayers.commune = {};
  mviewer.customLayers.commune.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "data/commune_simple.geojson",
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(46,83,103,0.6)",
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 0, 0)",
      }),
    }),
  });
  mviewer.customLayers.commune.handle = false;
}
