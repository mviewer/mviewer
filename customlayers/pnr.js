{
  // Définition des constantes liées à la couche GeoServer
  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
  const WORKSPACE = "rb";
  const LAYER = "parc_naturel_regional";
  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
  // Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier.
  const LAYER_ID = "pnr";

  // Style des entités
  const legend = {
    items: [
      {
        label: "PNR",
        geometry: "Polygon",
        styles: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({ color: "rgba(246, 185, 59,1.0)", width: 3 }),
            fill: new ol.style.Fill({ color: "rgba(246, 185, 59,0.7)" }),
          }),
        ],
      },
    ],
  };

  //Appel de la donnée projection 4326
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: LAYER_URL,
      format: new ol.format.GeoJSON(),
    }),
    //Analyse thématique
    style: function (feature, resolution) {
      return legend.items[0].styles;
    },
  });
  handle = false;

  new CustomLayer(LAYER_ID, layer, legend);
}
