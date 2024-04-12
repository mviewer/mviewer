{
  mviewer.customLayers.parcours = {};
  var parcours = mviewer.customLayers.parcours;

  parcours.legend = {
    items: [
      {
        label: "Circuit",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "#FF0000", width: 4 }),
          }),
        ],
      },
    ],
  };

  mviewer.customLayers.parcours.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "demo/data/swimrun_lineaire.geojson", // On spécifie le fichier de données qu'on souhaite utiliser
      format: new ol.format.GeoJSON(),
    }),
    // C'est ici que l'on va gérer le style
    style: parcours.legend.items[0].styles,
  });

  mviewer.customLayers.parcours.handle = false;
}