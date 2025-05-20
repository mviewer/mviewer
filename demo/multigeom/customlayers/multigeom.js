{
  mviewer.customLayers.multigeom = {};
  mviewer.customLayers.multigeom.legend = {
    items: [
      {
        geometry: "Polygon",
        label: "",
        styles: [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: "rgba(255, 0, 0, 0.48)",
            }),
            stroke: new ol.style.Stroke({
              color: "rgb(255, 0, 0)",
              width: 1,
            }),
          }),
        ],
      },
    ],
  };

  mviewer.customLayers.multigeom.vectorSource = new ol.source.Vector({
    url: "demo/multigeom/data/multigeom.geojson",
    format: new ol.format.GeoJSON(),
  });

  mviewer.customLayers.multigeom.layer = new ol.layer.Vector({
    source: mviewer.customLayers.multigeom.vectorSource,
    style: function (feature, resolution) {
      return mviewer.customLayers.multigeom.legend.items[0].styles;
    },
  });
  mviewer.customLayers.multigeom.handle = false;
}
