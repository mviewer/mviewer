var trackview = (function () {

  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;

  // Creation du layer mviewer
  var parcoursLayer= {
    showintoc: true,
    type: global.stats.type,
    layerid: global.stats.layerId,
    id: global.stats.layerId,
    title: global.stats.name,
    vectorlegend: true,
    visible: true,
    opacity: global.stats.opacity,
    tooltip: true,
    urlData: global.data.url
  };
  
  // Permet de définir la légende
  const style = {
    'styleCircuit': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#FF0000",
        width: 3,
      }),
    }),
  };

  var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: parcoursLayer.urlData,
      format: new ol.format.GPX(),
    }),
    style: function(feature) {
      console.log(feature);
      return style["styleCircuit"];
    },
  });

  parcoursLayer.legend = {
    items: [
      {
        label: "Circuit",
        geometry: "LineString",
        styles: [
          style["styleCircuit"],
        ],
      },
    ],
  };
  
  mviewer.processLayer(parcoursLayer, vector);
  //l.setVisible(true); // Pas assez optimisé => la ligne du dessous fait la même chose mais avec des options supplémentaires (legend)
  mviewer.addLayer(parcoursLayer);


  var _initTool= function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      console.log(source); // Affichage dans les logs
      var feature = source.getFeatures();
      console.log(feature); // Affichage dans les logs
      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 4000, // Permet de définir le temps de l'animation en ms
      });
    })
    _returnFeaturesInfo();
  };

  var _returnFeaturesInfo = function () {
    let features = [];
    
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);