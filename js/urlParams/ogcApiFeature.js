import { zoomToGeoJSON } from "./utils";

/**
 * Read OGC API Feature URL to zoom to features result
 * @param {object} parameters - URLSearchParameters
 */
export const getFeatures = (parameters, url) => {
  const dataSrs = parameters.get("srs");
  const servicePath = parameters.get("service") || url;
  const layer = parameters.get("layer");
  // force JSON format
  parameters.set("f", "application/json");
  let itemsAsJsonUrl = `${servicePath}/ogc/features/v1/collections/${layer}/items?`;
  parameters.delete("layer");
  parameters.delete("service");
  parameters.delete("srs");

  const fullUrl = `${itemsAsJsonUrl}&${parameters.toString()}`;
  fetch(fullUrl)
    .then((resp) => resp.json())
    .then((data) => {
      if (data?.features) {
        const dataProjCode = data?.crs?.properties?.name?.split(":").pop() || "3857";
        let options = {};
        // default proj data infos to reproject
        if (dataProjCode && dataProjCode !== "3857") {
          options = {
            dataProjection: dataSrs || "EPSG:" + dataProjCode,
          };
        }
        const features = new ol.format.GeoJSON({
          ...options,
          featureProjection: "EPSG:3857",
        }).readFeatures(data);
        // change map view
        zoomToGeoJSON(features, 2000);
      }
    })
    .catch((e) => {
      mviewer.alert(
        `Erreur. La requête n'est pas correcte ou retourne une erreur !`,
        "alert-danger"
      );
    });
};
