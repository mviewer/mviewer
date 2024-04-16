{
    mviewer.customLayers.parcours_1 = {};
    var parcours = mviewer.customLayers.parcours_1;
  
    parcours.layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: "demo/trackview/data/swimrun_lineaire.geojson", // On spécifie le fichier de données qu'on souhaite utiliser
        format: new ol.format.GeoJSON(),
      }),
    });
  
    parcours.handle = false;
  }
    