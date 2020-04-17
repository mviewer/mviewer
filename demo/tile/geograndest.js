let m = mviewer.getMap();
let layer;
const sourceId = "openmaptiles";
const layerid = "geograndest";
//olms : https://github.com/openlayers/ol-mapbox-style
//const lyr = 'https://openmaptiles.geograndest.fr/styles/klokantech-basic/style.json'
// lyr generated on https://maputnik.github.io/
const lyr = 'demo/tile/positron.json';
olms(m, lyr).then(function(map) {
  //get layer created by olms
  layer = map.getLayers().getArray().filter(l => l.get('mapbox-source') === sourceId)[0]; 
  //remove fake layer from map
  map.removeLayer(fake);
  //update layer attributes to be compatible with mviewer
  layer.set('mviewerid', layerid);
  layer.set('name', layerid);
  mviewer.getLayer(layerid).layer = layer;
  mviewer.customLayers[layerid].layer = layer;
});
// fake layer
let fake = new ol.layer.VectorTile();
new CustomLayer(layerid, fake);
