const defaultNorthImgUrl = "demo/addons/print/img/NorthArrow.png";

const defaultLayers = [
  new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
];

const defaultScale = new ol.control.ScaleLine({
  units: ["metric"],
  target: document.getElementById("scaleline-mapPrint"),
});

const defaultControls = {
  zoom: false,
  attribution: false,
  rotate: false,
};

const template = (northImgUrl) => `
<div id="mapBlock">
  <div id="mapPrint" class="map" style="width: 100%;height: 100%;"></div>
  <div id="scaleline-mapPrint" class="scaleline-external"></div> 
  <div id="northArrow-mapPrint"><img src="${northImgUrl}" alt="North arrow"/></div>     
</div>`;

const createMap = (layers, controls) => {
  const view = mviewer.getMap().getView();
  return new ol.Map({
    layers: layers,
    controls: ol.control.defaults.defaults(controls),
    target: "mapPrint",
    view: view,
  });
};

const getMviewerMapLayers = () => {
  const layers = [];
  var baseLayer = mviewer.getActiveBaseLayer();
  var allLayers = mviewer.getMap().getLayers().getArray();
  allLayers.forEach(function (layer) {
    // Filter only the visible basemap
    if (layer.get("blid") === baseLayer) {
      // map.addLayer(layer);
      layers.push(layer);
    }
  });
  /* Add layers */
  var layersIds = Object.keys(mviewer.getLayers());
  layersIds.forEach((id) => {
    var layer = mviewer.getLayer(id).layer;
    // map.addLayer(layer);
    layers.push(layer);
  });
  return layers;
};

export default function (northImgUrl, customControls) {
  $("#containMap").append(template(northImgUrl || defaultNorthImgUrl));

  const controls = { ...defaultControls, ...customControls };
  const mvMapLayers = getMviewerMapLayers();
  const layers = [...defaultLayers, ...mvMapLayers];

  const map = createMap(layers, controls);
  // Create the scalelines within the two div elements
  map.addControl(defaultScale);
}
