{
  mviewer.customLayers.point = {};
  mviewer.customLayers.point.legend = {
    items: [
      {
        geometry: "Point",
        label: "",
        styles: [
          new ol.style.Style({
            image: new ol.style.Circle({
              radius: 6,
              fill: new ol.style.Fill({
                color: "rgba(0, 0, 0, 0.48)",
              }),
              stroke: new ol.style.Stroke({
                color: "rgb(0, 0, 0)",
                width: 1,
              }),
            }),
          }),
        ],
      },
    ],
  };

  mviewer.customLayers.point.vectorSource = new ol.source.Vector({
    url: "demo/multigeom/data/point.geojson",
    format: new ol.format.GeoJSON(),
  });

  mviewer.customLayers.point.layer = new ol.layer.Vector({
    source: mviewer.customLayers.point.vectorSource,
    style: function (feature, resolution) {
      return mviewer.customLayers.point.legend.items[0].styles;
    },
  });
  mviewer.customLayers.point.handle = false;
}
