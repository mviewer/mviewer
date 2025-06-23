const code_insee = API.commune ?? undefined;

const url =
  "https://geobretagne.fr/geoserver/ign/wfs?SERVICE=WFS&request=GetFeature&version=1.1.0&typeName=commune_metro&outputFormat=application%2Fjson&srsName=EPSG:3857";

let style = new ol.style.Style({
  stroke: new ol.style.Stroke({ color: "#000", width: 2 }),
  fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
});

let legend = { items: [] };

var _loaderData = function () {
  try {
    _vectorSource.clear();
    if (code_insee) {
      //            format: new ol.format.GeoJSON(),
      //          url: code_insee ? url + "&CQL_FILTER=insee_com=" + code_insee : url + "&CQL_FILTER=insee_dep=35",
      $.ajax({
        url: url + "&CQL_FILTER=insee_com=" + code_insee,
        dataType: "json",
        success: function (data) {
          if (data) {
            _vectorSource.addFeatures(new ol.format.GeoJSON().readFeatures(data));
            mviewer.getMap().getView().fit(_vectorSource.getExtent(), {
              size: mviewer.getMap().getSize(),
              maxZoom: 13,
            });
          } else {
            console.log("pas de données");
          }
        },
        error: function () {},
      });
    }
  } catch (e) {}
};

const _vectorSource = new ol.source.Vector({
  loader: _loaderData,
});

let layer = new ol.layer.Vector({
  source: _vectorSource,
  style: style,
});

new CustomLayer("commune", layer);
