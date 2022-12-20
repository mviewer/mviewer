const GEOSERVER_URL = "https://geobretagne.fr/geoserver";
const WORKSPACE = "dreal_b";
const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=dreal_b:projets-environnement-diffusion&outputFormat=application/json&srsName=EPSG:4326&bbox=-6,47,0,49`;
const LAYER_ID = "cluster";

// create styles
const uniqueStyle = [
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({
        color: "rgba(231, 76, 60, 0.7)",
      }),
    }),
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8,
      fill: new ol.style.Fill({
        color: "rgba(236, 240, 241,7.0)",
      }),
    }),
  }),
];
const clusterStyle = function (feature) {
  var size = feature.get("features").length;
  var max_radius = 40;
  var max_value = 500;
  var radius = 10 + Math.sqrt(size) * (max_radius / Math.sqrt(max_value));
  var radius2 = (radius * 80) / 100;
  if (size == 1) {
    return uniqueStyle;
  } else {
    return manyStyle(radius, radius2, size);
  }
};
const manyStyle = function (radius, radius2, size) {
  return [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: "rgba(236, 240, 241,0.7)",
        }),
      }),
      stroke: new ol.style.Stroke({
        color: "red",
        width: 3,
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 255, 0.1)",
      }),
    }),
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius2,
        fill: new ol.style.Fill({
          color: "rgba(231, 76, 60, 0.7)",
        }),
      }),
      text: new ol.style.Text({
        font: "12px roboto_regular, Arial, Sans-serif",
        text: size.toString(),
        fill: new ol.style.Fill({
          color: "#fff",
        }),
      }),
    }),
  ];
};

// create legend
const legend = {
  items: [
    { styles: uniqueStyle, label: "Dossier", geometry: "Point" },
    { styles: manyStyle(10, 10, 7), label: "Groupe de dossiers", geometry: "Point" },
  ],
};

let layer = new ol.layer.Vector({
  source: new ol.source.Cluster({
    geometryFunction: function (feature) {
      return new ol.geom.Point(ol.extent.getCenter(feature.getGeometry().getExtent()));
    },
    distance: 50,
    source: new ol.source.Vector({
      url: LAYER_URL,
      format: new ol.format.GeoJSON(),
    }),
  }),
  style: clusterStyle,
});

const handle = function (clusters, views) {
  if (clusters.length > 0) {
    var l = mviewer.getLayer(LAYER_ID);
    var elements = [];
    var html;
    var panel = "";
    clusters.forEach((c) => {
      // ICI ON CREER MANUELLEMENT LES FEATURES POUR MUSTACHE ET LE TEMPLATE POUR V3.5 ET ANTERIEUR
      if (c?.properties) {
        // v<3.5
        elements = elements.concat(
          c.properties.features.map((d) => ({
            properties: d.getProperties(),
          }))
        );
      } else {
        // v>=3.5
        elements = elements.concat(c?.getProperties()?.features || c.properties.features);
      }
    });
    // Création du HTML à partir du template et des features issues de la manipulation des données
    if (l.template) {
      html = info.templateHTMLContent(elements, l);
    } else {
      html = info.formatHTMLContent(elements, l);
    }
    // force l'affichage selon le mode mobile ou desktop
    if (configuration.getConfiguration().mobile) {
      panel = "modal-panel";
    } else {
      panel = "right-panel";
    }
    var view = views[panel];
    view.layers.push({
      id: view.layers.length + 1,
      firstlayer: true,
      manyfeatures: elements.length > 1,
      nbfeatures: elements.length,
      name: l.name,
      layerid: LAYER_ID,
      theme_icon: l.icon,
      html: html,
    });
  }
};

new CustomLayer(LAYER_ID, layer, legend, handle);
