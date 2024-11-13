import * as apiBanUtils from "./apiBan.js";
import * as apiCartoCadastreUtils from "./apiCartoCadastre.js";
import * as geoApiGouvUtils from "./geoApiGouv.js";

/**
 * Some utils to use mviewer URL Params
 */
mviewer.urlParams = {
  ...apiBanUtils,
  ...apiCartoCadastreUtils,
  ...geoApiGouvUtils,
};
