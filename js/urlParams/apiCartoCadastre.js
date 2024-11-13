// plot style
const plotStyle = (data) =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 5,
      color: "#ff0000",
    }),
    fill: new ol.style.Fill({
      color: "rgba(255,0,0,0.5)",
    }),
    text: new ol.style.Text({
      font: "12px Arial",
      fill: new ol.style.Fill({
        color: "#ffffff",
      }),
      text: data.features[0].properties["idu"],
      placement: "center",
    }),
  });

/**
 * Will request api and display overlay feature
 * @param {string} url
 * @param {int} duration
 */
export const requestApiCartoCadastre = async (url, duration = 2000) => {
  const mviewerSourceOverlay = mviewer?.getSourceOverlay?.();
  const response = await fetch(url);
  const data = await response.json();
  if (data.features) {
    const features = new ol.format.GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }).readFeatures(data);

    features.forEach(function (f) {
      f.setStyle(plotStyle(data));
    });

    mviewerSourceOverlay.addFeatures(features);
    var boundingExtent = mviewerSourceOverlay.getExtent();

    _map.getView().fit(boundingExtent, {
      size: _map.getSize(),
      padding: [0, $("#sidebar-wrapper").width(), 0, 0],
      duration: duration,
    });
  } else {
    mviewer.alert(`Erreur. L'adresse ${API.q} n'a pu être trouvée !`, "alert-danger");
  }
};
