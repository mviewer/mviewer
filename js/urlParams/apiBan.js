/**
 * Will request BAN Api
 * @param {string} url
 */
export const requestBan = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (data.features) {
    const result = data.features;
    const coordinates = result[0].geometry.coordinates;
    mviewer.zoomToLocation(coordinates[0], coordinates[1], 18, false, "EPSG:4326");
    mviewer.showLocation("EPSG:4326", coordinates[0], coordinates[1], true);
  } else {
    mviewer.alert(`Erreur. L'adresse ${API.q} n'a pu être trouvée !`, "alert-danger");
  }
};
