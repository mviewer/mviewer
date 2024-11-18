import { polygonStyle } from "./styles.js";

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
      f.setStyle(polygonStyle(data.features[0].properties["idu"]));
    });

    mviewerSourceOverlay.addFeatures(features);
    var boundingExtent = mviewerSourceOverlay.getExtent();

    _map.getView().fit(boundingExtent, {
      size: _map.getSize(),
      padding: [0, $("#sidebar-wrapper").width(), 0, 0],
      duration: duration,
    });
  } else {
    mviewer.alert(`Erreur. La parcelle n'a pu être trouvée !`, "alert-danger");
  }
};
