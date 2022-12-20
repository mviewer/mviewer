{
  mviewer.customLayers.lycee_resultat_bac = {};
  mviewer.customLayers.lycee_resultat_bac.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "https://ows.region-bretagne.fr/geoserver/interne/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=lycee_resultat_bac&outputFormat=application/json&srsName=EPSG:4326",
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature, resolution) {
      var fillcolor = "#ffffff";
      if (feature.get("secteur_li") === "Public") {
        fillcolor = "#336699";
      } else if (
        feature.get("secteur_li") === "Privé sous contrat avec l'éducation nationale"
      ) {
        fillcolor = "#CC0000";
      }
      return [
        new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: fillcolor,
            }),
            stroke: new ol.style.Stroke({
              color: "#ffffff",
              width: 4,
            }),
            radius: 9,
          }),
        }),
      ];
    },
  });
  mviewer.customLayers.lycee_resultat_bac.handle = false;
}
