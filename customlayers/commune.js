{
  mviewer.customLayers.commune = {};
  mviewer.customLayers.commune.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "data/commune_simple.geojson",
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(45, 64,89,255)",
        width: 0.8,
        lineDash: [4, 4],
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 0, 0)",
      }),
    }),
  });
  mviewer.customLayers.commune.handle = false;
}
