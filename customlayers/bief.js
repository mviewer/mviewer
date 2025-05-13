{
  // Définition des variables realtives à la couche.
  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
  const WORKSPACE = "rb";
  const LAYER = "bief";
  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
  // Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier.
  const LAYER_ID = "bief";

  // Style des entités
  const legend = {
    items: [
      {
        label: "Enjeu bio. modéré",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(129, 236, 236,1.0)", width: 4 }),
          }),
        ],
      },
      {
        label: "Enjeu bio. élevé",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(0, 206, 201,1.0)", width: 4 }),
          }),
        ],
      },
      {
        label: "Enjeu bio. très élevé",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(250, 177, 160,1.0)", width: 4 }),
          }),
        ],
      },
      {
        label: "Enjeu bio. majeur",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(225, 112, 85,1.0)", width: 4 }),
          }),
        ],
      },
      {
        label: "Enjeu bio. inconnu",
        geometry: "LineString",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(255, 234, 167,1.0)", width: 4 }),
          }),
        ],
      },
    ],
  };

  //Appel de la donnée
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: LAYER_URL,
      format: new ol.format.GeoJSON(),
    }),
    //Analyse thématique ici sur l'attribut enjeu_bio
    style: function (feature, resolution) {
      var stl;
      if (feature.get("enjeu_bio")) {
        switch (feature.get("enjeu_bio")) {
          case "modéré":
            stl = legend.items[0].styles;
            break;
          case "élevé":
            stl = legend.items[1].styles;
            break;
          case "très élevé":
            stl = legend.items[2].styles;
            break;
          case "majeur":
            stl = legend.items[3].styles;
            break;
        }
      }
      return stl;
    },
  });
  handle = false;
  new CustomLayer(LAYER_ID, layer, legend);
}
