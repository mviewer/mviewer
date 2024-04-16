var trackview = (function () {

  // Creation du layer
  var parcoursLayer= {
    showintoc: true,
    type: "customlayer",
    layerid: "parcours_1",
    title: "Parcours GeoJson",
    legendurl: "demo/trackview/customlayers/parcours.js",
    vectorlegend: true,
    visible: true,
    opacity: "0.8",
    tooltip: true,
    tooltipcontent: "Nom {{name}}"
  };

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
      var source = parcoursLayer.getSource();
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

    let style = mviewer.customComponents.trackview.config.options.mviewer.parcours.style; // On récupère le tableau contenant les différents styles
    console.log(style);

    mvLayer.setStyle({
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