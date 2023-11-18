console.log(window);

const layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: "../../data/2021-08-northabout-clean.geojson",
  }),
});

console.log(mviewer);

//new CustomLayer("geoLayer", geoLayer);

/*

*/

new CustomLayer("heatmap", layer);
