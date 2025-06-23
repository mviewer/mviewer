mviewer.customLayers.baignade = (function () {
  const layerId = "baignade";
  const layerName = "ars:risque_baignades_2022";
  const layerUrl = `https://santegraphie.fr/geoserver/ars/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application%2Fjson`;

  //Affichage de la légende
  let legend = { items: [] };

  function getStyle(feature) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({ color: "rgb(130, 207, 232)" }),
        stroke: new ol.style.Stroke({ color: "white", width: 1.5 }),
      }),
    });
  }

  const vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: layerUrl,
  });

  const layer = new ol.layer.Vector({
    source: vectorSource,
    style: getStyle,
  });

  new CustomLayer(layerId, layer, legend);

  return {
    baignade: layerId,
    layer: layer,
  };
})();
