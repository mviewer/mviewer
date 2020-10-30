const WMSrequest = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'https://services.sentinel-hub.com/ogc/wms/f6219778-b67d-4107-84c6-56e00a2642e2',
    params: {
      'showLogo': false,
      'SERVICE': 'WMS',
      'VERSION': '1.3.0',
      'REQUEST': 'GetMap',
      'FORMAT': 'image/png',
      'TRANSPARENT': true,
      'LAYERS': 'TRUE_COLOR',
      'TILED': true,
      'WIDTH': 256,
      'HEIGHT': 256,
      'BBOX': '-234814.55089206249,6261721.357121639,-156543.033928042,6339992.874085659',
      'CRS': 'EPSG:3857'
    },
    serverType: 'geoserver'
  })
});
//Classe qui etend la classe abstraite et decris le custom Layer
class Sentinel extends CustomLayer {
  // Initialize the Custom Layer
  constructor(id, layer, legend, handle = false) {
    // Initialize CustomLayer superClass
    super(id, layer, legend, handle);
    // Define events on the Tile Layer
    WMSrequest.on('prerender', function (event) {

    });
    // Define events on the Tile Layer
    WMSrequest.on('postrender', function (event) {

    });
  }
  // Update Layer when Changing filters like cloud coverage
  requestOnApplyClicked(values) {
    this.layer.getSource().clear();
    var parameters = {};
    for(const param in values){
      parameters[param]=values[param];
    }
    this.layer.getSource().updateParams(parameters);
  }
}
// Create The Custom Layer
new Sentinel("sentinel", WMSrequest);