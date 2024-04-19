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

  // Permet de réutiliser les features plus tard
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

  var _addGraph = function () {
    let features = vectorSource.getFeatures();
    let coordinates = features[0].getGeometry().getCoordinates()[0];
    let featureTab = [];
    let featureListId = []
    let featureListNiv = []

    for (let i = 0; i < coordinates.length; i++) {
      var featureId = i ;
      let featureX = coordinates[i][0] ;
      let featureY = coordinates[i][1] ;
      let featureZ = coordinates[i][2] ;
      let featureT = coordinates[i][3] ;

      featureListId.push(featureId) ;
      featureListNiv.push(featureZ) ;
      featureTab.push("Id :",featureId, "x :",featureX, "y :",featureY, "z :",featureZ, "Time :",featureT) ; // Optionnel
    };
    new Chart(document.getElementById("trackview-panel"), {
      type: 'line',
      data: {
        labels: featureListId,
        datasets: [{ 
            data: featureListNiv,
            label: "Dénivelé du " + global.stats.name,
            borderColor: global.style.color,
            fill: true
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Ne fonctionne pas :("
        },
      },
    });
  };
  
  mviewer.processLayer(parcoursLayer, vector);
  mviewer.addLayer(parcoursLayer); // setVisible(true) => n'ajoute pas la légende


  var _initTool= function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      console.log(source); // Affichage dans les logs
      var feature = source.getFeatures();
      console.log(feature); // Affichage dans les logs
      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 3000, // Permet de définir le temps de l'animation en ms
      });
      _addGraph();
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);