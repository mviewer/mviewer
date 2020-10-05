mviewer.customLayers.structures = (function () {
  var id = "structures";
  mviewer.customLayers[id] = {};
  var url = 'demo/filter/data/structures.json';

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  var juType = ["Association", "Autre catégorie juridique", "Etablissement public", "SA - Société anonyme", "SA à directoire", "SAS - Société par actions simplifiée", "SASU - Société par actions simplifiée uniperson", "Société civile", "administration"];
  var type = {};
  juType.forEach(e => type[e] = getRandomColor());
  
  function layerStyle (f) {
    var jurType = f.getProperties().form_jur;
    //console.log(jurType);
    var style =  new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({color: jurType && type[jurType] || '#848484'}),
        stroke: new ol.style.Stroke({color: 'white', width: 1})
      })
    });
    return [style];
  }

  var _layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: url
    }),
    style: layerStyle
  });

  return {
    layer: _layer
  }
}());