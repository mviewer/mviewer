{
  // Définition des variables realtives à la couche.
  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
  const WORKSPACE = "rb";
  const LAYER = "lycee";
  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
  // Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier javascript.
  const LAYER_ID = "lycee";

  // Style des entités.
  const legend = {
    items: [
      {
        label: "Lycée public",
        geometry: "Point",
        styles: [
          new ol.style.Style({
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
        ],
      },
      {
        label: "Lycée privé",
        geometry: "Point",
        styles: [
          new ol.style.Style({
            image: new ol.style.Circle({
              fill: new ol.style.Fill({
                color: "rgba(99, 110, 114,1.0)",
              }),
              stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 4,
              }),
              radius: 9,
            }),
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
    //Analyse thématique ici sur l'attribut secteur_li
    style: function (feature, resolution) {
      var stl;
      if (feature.get("secteur_li")) {
        switch (feature.get("secteur_li")) {
          case "Public":
            stl = legend.items[0].styles;
            break;
          case "Privé sous contrat avec l'éducation nationale":
            stl = legend.items[1].styles;
            break;
        }
      }
      return stl;
    },
  });
  handle = false;
  new CustomLayer(LAYER_ID, layer, legend);
}
