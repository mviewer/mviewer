var trackview = (function () {

  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;

  // Creation du layer
  var parcoursLayer= {
    showintoc: true,
    type: global.stats.type,
    layerid: global.stats.layerId,
    id: global.stats.layerId,
    title: global.title,
    vectorlegend: true,
    visible: true,
    opacity: global.stats.opacity,
    tooltip: true,
    urlData: global.data.url
  };
  
  parcoursLayer.legend = {
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
  
  // Creation du openLayer
  var l = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: parcoursLayer.urlData,
      format: new ol.format.GeoJSON(),
    }),
  });

  mviewer.processLayer(parcoursLayer, l);
  mviewer.addLayer(parcoursLayer);

  // Variables globales
  /*
  
  var layerID = mviewer.customComponents.trackview.config.options.mviewer.parcours.stats[0].layerId;
  console.log(layerID);  // Affichage dans les logs

  var mvLayer = mviewer.getLayer(layerID).layer;
  console.log(mvLayer);  // Affichage dans les logs
  */

  var _initTool= function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = l.getSource();
      console.log(source); // Affichage dans les logs
      var feature = source.getFeatures();
      console.log(feature); // Affichage dans les logs
      //console.log(feature[0].getGeometry().getExtent()); // Affichage dans les logs
      //console.log(feature[0].getGeometry().getExtent()[0]); // Affichage dans les logs
      //mviewer.zoomToLocation(feature[0].getGeometry().getExtent()[0], feature[0].getGeometry().getExtent()[1], 12, null, "EPSG:3857");
      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 4000, // Permet de définir le temps de l'animation en ms
      });
    _setStyle();
    })
  };

  var _setStyle= function () {
    console.log("Initialisation du style");

    let style = global.style; // On récupère le tableau contenant les différents styles
    console.log(style);

    l.setStyle({
      "geometry": style.geometry,
      "stroke-color": style.color,
      "stroke-width": style.width,
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);