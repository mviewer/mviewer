import * as apiSearchAddressUtils from "./apiSearchAddress.js";
import * as apiCartoCadastreUtils from "./apiCartoCadastre.js";
import * as geoApiGouvUtils from "./geoApiGouv.js";
import * as ogcApiFeature from "./ogcApiFeature.js";

import * as urlParamsUtils from "./utils.js";

/**
 * Some utils to use mviewer URL Params
 */
mviewer.urlParams = {
  ...apiSearchAddressUtils,
  ...apiCartoCadastreUtils,
  ...geoApiGouvUtils,
  ...ogcApiFeature,
  ...urlParamsUtils,
};
