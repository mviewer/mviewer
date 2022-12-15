{
  mviewer.customLayers.population_communes = {};
  mviewer.customLayers.population_communes.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "data/pop_communes.geojson",
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: "rgba(255, 118, 117,1.0)",
        }),
        stroke: new ol.style.Stroke({
          color: "#ffffff",
          width: 4,
        }),
        radius: 9,
      }),
    }),
  });
  mviewer.customLayers.population_communes.handle = false;
}
