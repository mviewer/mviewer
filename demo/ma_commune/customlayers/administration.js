//Définition des variables
const LAYER_URL = URL_ADMINISTRATION;
const LAYER_ID = "administration";
const COULEUR_POINT = "#6e8225"; //Couleur du point cluster
const LABEL_LEGEND = "Administration";
const REQ_CQL = "&CQL_FILTER=code_insee=";
const code_insee = API.commune ?? undefined;

mviewer.customLayers.administration = (function () {
  const clusterStyle = function (feature) {
    var size = feature.get("features").length;
    var max_radius = 40;
    var max_value = 500;
    var radius = 10 + Math.sqrt(size) * (max_radius / Math.sqrt(max_value));
    var radius2 = (radius * 80) / 100;
    return manyStyle(radius, radius2, size);
  };
  const manyStyle = function (radius, radius2, size) {
    return [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius2,
          fill: new ol.style.Fill({
            color: COULEUR_POINT,
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
  const _legend = {
    items: [{ styles: manyStyle(10, 10, 7), label: LABEL_LEGEND, geometry: "Point" }],
  };

  let _layer = new ol.layer.Vector({
    source: new ol.source.Cluster({
      geometryFunction: function (feature) {
        return new ol.geom.Point(ol.extent.getCenter(feature.getGeometry().getExtent()));
      },
      distance: 50,
      source: new ol.source.Vector({
        url: LAYER_URL + REQ_CQL + code_insee,
        format: new ol.format.GeoJSON(),
      }),
    }),
    style: clusterStyle,
  });

  const _handle = function (clusters, views) {
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
          elements = elements.concat(
            c?.getProperties()?.features || c.properties.features
          );
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

  return {
    layer: _layer,
    handle: _handle,
    legend: _legend,
  };
})();
