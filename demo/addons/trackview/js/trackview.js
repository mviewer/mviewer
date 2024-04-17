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
    'Point': new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: "#0000FF",
        }),
        radius: 5,
        stroke: new ol.style.Stroke({
          color: "#00FF00",
          width: 1,
        }),
      }),
    }),
    'LineString': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#FF0000",
        width: 3,
      }),
    }),
    'MultiLineString': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#FFFF00",
        width: 3,
      }),
    }),
  };

  const vector = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: parcoursLayer.urlData,
      format: new ol.format.GPX(),
    }),
    style: function(feature) {
      return style[feature.getGeometry().getType()];
    },
  });
  
  parcoursLayer.legend = {
    items: [
      {
        label: "Circuit",
        geometry: "LineString",
        styles: [
          style["LineString"],
        ],
      },
      {
        label: "Point",
        geometry: "Point",
        styles: [
          style["Point"],
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