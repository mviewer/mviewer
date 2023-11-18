console.log(window);
console.log("customlayer.js");

const image = new ol.layer.CircleStyle({
  radius: 5,
  fill: null,
  stroke: new ol.layer.Stroke({ color: "red", width: 1 }),
});

const styles = {
  Point: new ol.style.Style({
    image: image,
  }),
  LineString: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiLineString: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiPoint: new ol.style.Style({
    image: image,
  }),
  MultiPolygon: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "yellow",
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
  Polygon: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  GeometryCollection: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "magenta",
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: "magenta",
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: "magenta",
      }),
    }),
  }),
  Circle: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "red",
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: "rgba(255,0,0,0.2)",
    }),
  }),
};

const fill = new ol.style.Fill({
  color: "rgba(255,255,255,0.4)",
});
const stroke = new ol.style.Stroke({
  color: "#3399CC",
  width: 1.25,
});

const styleFunction = function (feature) {
  console.log(feature.getGeometry().getType());
  return styles[feature.getGeometry().getType()];
};

const geojson = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "../../data/2021-08-northabout-clean.geojson",
});

console.log("geojson", geojson);

const layer = new ol.layer.Vector({
  source: geojson,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    fill: fill,
    stroke: stroke,
  }),
});

console.log("layer", layer);

new CustomLayer("geoLayer", layer);
