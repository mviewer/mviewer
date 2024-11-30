import { requestBan } from "./apiBan.js";
import { requestApiCartoCadastre } from "./apiCartoCadastre.js";
import { requestApiCartoAdmin } from "./geoApiGouv.js";
import { getFeatures } from "./ogcApiFeature.js";

const DURATION = 2000;

/**
 * Read URL qtype valye to return correct API infos
 * @returns
 */
export const getTypeFromUrl = () => {
  const mvConfig = configuration.getConfiguration();
  const qtype = API.qtype;

  const configTypes = mvConfig.urlparams.qtype;
  if (!mvConfig.urlparams.qtype?.length) {
    return mvConfig.urlparams.qtype;
  } else {
    return _.find(configTypes, ["name", qtype]);
  }
};

export const zoomToGeoJSON = (features, duration) => {
  const mviewerSourceOverlay = mviewer?.getSourceOverlay?.();
  mviewerSourceOverlay.addFeatures(features);
  var boundingExtent = mviewerSourceOverlay.getExtent();

  _map.getView().fit(boundingExtent, {
    size: _map.getSize(),
    padding: [0, $("#sidebar-wrapper").width(), 0, 0],
    duration: duration || DURATION,
  });
};

export const requestService = () => {
  let typesInfos = getTypeFromUrl();
  let url = typesInfos?.url;
  let name = typesInfos?.name;
  // types that needs URL from XML
  if (["ban", "cadastre", "admin"].includes(name) && !url) {
    return;
  }
  if (name == "ban") {
    requestBan(`${url}?q=${API.q}`);
  }
  if (name == "cadastre") {
    const parameters = decodeURIComponent(API.q);
    requestApiCartoCadastre(`${url}?${parameters}`, 2000);
  }
  if (name == "admin") {
    const parameters = new URLSearchParams(API.q);
    const service = parameters.get("service");
    parameters.delete("service");
    const pathUrl = `${url}/${service}?${parameters.toString()}`;
    requestApiCartoAdmin(pathUrl);
  }
  if (name == "features") {
    const parameters = new URLSearchParams(API.q);
    if (!url && !parameters.get("service")) {
      return;
    }
    getFeatures(parameters, url);
  }
};
