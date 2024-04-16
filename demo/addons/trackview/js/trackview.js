var trackview = (function () {

  var _initTool= function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    var layerID = mviewer.customComponents.trackview.config.options.mviewer.parcours.stats[0].layerId;
    console.log(layerID);  // Affichage dans les logs
    
    var mvLayer = mviewer.getLayer(layerID).layer;
    console.log(mvLayer);  // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = mvLayer.getSource();  // Affichage dans les logs
      console.log(source);
      var feature = source.getFeatures();  // Affichage dans les logs
      console.log(feature);
      console.log(feature[0].getGeometry().getExtent());
      console.log(feature[0].getGeometry().getExtent()[0]);
      //mviewer.zoomToLocation(feature[0].getGeometry().getExtent()[0], feature[0].getGeometry().getExtent()[1], 12, null, "EPSG:3857");
      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 4000,
      });
    })
  }


return {
  init: _initTool, 
};
})();

new CustomComponent("trackview", trackview.init);