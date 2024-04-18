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
        color: global.style.color,
        width: global.style.width,
      }),
    }),
  };

  const vectorSource = new ol.source.Vector({
    url: parcoursLayer.urlData,
    format: new ol.format.GPX(),
  });
  
  var vector = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature) {
      return style["styleCircuit"];
    },
  });

  vectorSource.on("featuresloadend", function (a) {
    // lecture de la lineString
    const lineStringCoords = a.features[0].getGeometry().getLineStrings()[0].getCoordinates();
    // on lit les points et on récupère un objet qui détient une feature par point et le temps associé
    const pointsFeatureAndTime = lineStringCoords.map(coordinates => {
        // création de la feature pour chaque coordonnées de la linestring
        const feature = new ol.Feature(new ol.geom.Point(coordinates));
        // on récupère la valeur de temps
        const timeBrut = coordinates[3];
        // on la formate (ca permettra de lire le temps avec new Date(time))
        const time = timeBrut * 1000;
        return {
            feature,
            time
        };
    });
    // on trie par date 
    const orderPointsByTime = _.sortBy(pointsFeatureAndTime, ["time"]);
    console.log(orderPointsByTime);
  });

  parcoursLayer.legend = {
    items: [
      {
        label: global.title,
        geometry: global.style.geometry,
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