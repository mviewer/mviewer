export const setVisibleOverLayers = (layersToShow) => {
  const mvLayers = mviewer.getLayers();
  let errors = [];
  let errorLayers = [];
  let layers = layersToShow.split(",");
  let layersWithOptions = {};
  layers.forEach(function (layer, i) {
    let l = false;
    //search layer by id or by name in overLayers collection
    //layer with options - layername*style*cql_filter*time
    let layerWithOptions = layer.split("*");
    let richLayer = {};
    let layerIdOrName = layerWithOptions[0];
    switch (layerWithOptions.length) {
      case 2:
        richLayer.style = layerWithOptions[1];
        break;
      case 3:
        richLayer.style = layerWithOptions[1];
        richLayer.filter = layerWithOptions[2];
        break;
      case 4:
        richLayer.style = layerWithOptions[1];
        richLayer.filter = layerWithOptions[2];
        richLayer.time = layerWithOptions[3];
        break;
    }
    if (
      layers[layerIdOrName] &&
      layers[layerIdOrName].showintoc &&
      layers[layerIdOrName].layer
    ) {
      //layerIdOrName is layerid
      l = mvLayers[layerIdOrName].layer;
      richLayer.layerid = layerIdOrName;
      richLayer.name = mvLayers[layerIdOrName].name;
    } else {
      //layerIdOrName is layername
      l = _getLayerByName(layerIdOrName);
      richLayer.name = layerIdOrName;
      if (l) {
        richLayer.layerid = l.get("mviewerid");
      } else {
        richLayer.layerid = layerIdOrName;
      }
    }
    layersWithOptions[richLayer.layerid] = richLayer;

    if (l) {
      l?.src ? l.src.setVisible(true) : l.setVisible(true);
    } else {
      errors.push(i);
    }
  });
  errors.forEach(function (err) {
    errorLayers.push(layers[err]);
    delete layers[err];
  });
  if (errorLayers.length > 0) {
    mviewer.alert(
      "Couche(s) " + errorLayers.join(", ") + " non disponible(s)",
      "alert-danger"
    );
  }
  return layersWithOptions;
};
