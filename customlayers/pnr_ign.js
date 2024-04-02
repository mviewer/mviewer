{
  mviewer.customLayers.pnr = {};
  var pnr = mviewer.customLayers.pnr;

  pnr.legend = {
    items: [
      {
        label: "Parc Naturel Régional",
        geometry: "Polygon",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(110, 178, 37,1.0)", width: 3 }),
            fill: new ol.style.Fill({ color: "rgba(110, 178, 37,.7)" }),
          }),
        ],
      },
    ],
  };

  mviewer.customLayers.pnr.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "https://data.geopf.fr/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GETFEATURE&TYPENAME=PROTECTEDAREAS.PNR:pnr&outputFormat=application/json&srsName=EPSG:4326",
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature, resolution) {
      return pnr.legend.items[0].styles;
    },
  });
  mviewer.customLayers.pnr.handle = false;
}
