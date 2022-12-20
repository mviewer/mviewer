let style = new ol.style.Style({
  stroke: new ol.style.Stroke({ color: "rgba(248, 194, 145,0.1)", width: 1 }),
  fill: new ol.style.Fill({ color: "rgba(248, 194, 145,0.01)" }),
});

let layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "https://geobretagne.fr/geoserver/ign/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ign:geofla_commune_2015&maxFeatures=2000&outputFormat=application/json&CQL_FILTER=code_reg%20IN%20(%2753%27)&srsName=EPSG:4326",
    format: new ol.format.GeoJSON(),
  }),
  style: style,
});

new CustomLayer("wmswfs", layer);
