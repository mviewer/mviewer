mviewer.customLayers.structures = (function () {
  var id = "structures";
  mviewer.customLayers[id] = {};
  var url = 'demo/filter/data/structures.json';

  var _layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: url
    })
  });

  return {
    layer: _layer
  }
}());