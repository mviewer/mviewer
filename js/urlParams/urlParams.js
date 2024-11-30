import * as apiBanUtils from "./apiBan.js";
import * as apiCartoCadastreUtils from "./apiCartoCadastre.js";
import * as geoApiGouvUtils from "./geoApiGouv.js";
import * as ogcApiFeature from "./ogcApiFeature.js";

import * as urlParamsUtils from "./utils.js";

/**
 * Some utils to use mviewer URL Params
 */
mviewer.urlParams = {
  ...apiBanUtils,
  ...apiCartoCadastreUtils,
  ...geoApiGouvUtils,
  ...ogcApiFeature,
  ...urlParamsUtils,
};
