const image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({ color: "red", width: 1 }),
});

const styles = {
  Point: new ol.style.Style({
    image: image,
  }),
};

const styleFunction = function (feature) {
  console.log(feature.getGeometry().getType());
  return styles[feature.getGeometry().getType()];
};

const geoJson = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "data/2021-10-la-louise-clean.geojson",
});

console.log("geoJson", geoJson);

const layer = new ol.layer.Vector({
  source: geoJson,
  style: styleFunction,
});

console.log("layer", layer);

new CustomLayer("la-louise", layer);
