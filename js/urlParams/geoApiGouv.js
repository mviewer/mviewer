import { polygonStyle } from "./styles.js";

/**
 * Will request https://geo.api.gouv.fr/ api and display overlay feature
 * @param {string} url
 * @param {int} duration
 */
export const requestApiCartoAdmin = async (url, duration = 2000) => {
  const mviewerSourceOverlay = mviewer?.getSourceOverlay?.();
  const response = await fetch(url);
  const data = await response.json();
  if (!_.isEmpty(data) && data[0].contour) {
    const geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      features: [
        {
          type: "Feature",
          geometry: data[0].contour,
        },
      ],
    };
    const features = new ol.format.GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }).readFeatures(geojsonObject);

    features.forEach(function (f) {
      f.setStyle(polygonStyle(""));
    });

    mviewerSourceOverlay.addFeatures(features);
    var boundingExtent = mviewerSourceOverlay.getExtent();

    _map.getView().fit(boundingExtent, {
      size: _map.getSize(),
      padding: [0, $("#sidebar-wrapper").width(), 0, 0],
      duration: duration,
    });
  } else {
    mviewer.alert(
      `Erreur. Aucune entité administrative n'a été trouvée !`,
      "alert-danger"
    );
  }
};
