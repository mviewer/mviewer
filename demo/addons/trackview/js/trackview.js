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

  const vectorSource = new ol.source.Vector({
    url: parcoursLayer.urlData,
    format: new ol.format.GPX(),
  });

  vectorSource.on("featuresloadend", function (a) {
    console.log(a);
  });
  
  var vector = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature) {
      var features = feature.getGeometry().getCoordinates()[0];
      console.log(features);
      
      for (let i = 0; i < features.length; i++) {
        let featureId = i;
        let featureX = features[i][0] ;
        let featureY = features[i][1] ;
        let featureZ = features[i][2] ;

        let featureTab = [];

        featureTab.push("Id :",featureId, "x :",featureX, "y :",featureY, "z :",featureZ);

        console.log(featureTab);
      }

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
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);