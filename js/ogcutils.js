/**
 * Append query params to a base URI.
 * @param {string} uri
 * @param {Object} params
 * @returns {string}
 */
// This function has been mainly copied from appendParams from OpenLayers
function appendParams(uri, params) {
  const keyParams = [];
  // Skip any null or undefined parameter values
  Object.keys(params).forEach(function (k) {
    if (params[k] !== null && params[k] !== undefined) {
      keyParams.push(k + "=" + params[k]);
    }
  });
  const qs = keyParams.join("&");
  // remove any trailing ? or &
  uri = uri.replace(/[?&]$/, "");
  // append ? or & depending on whether uri has existing parameters
  uri = uri.indexOf("?") === -1 ? uri + "?" : uri + "&";
  return uri + qs;
}

/**
 * Parse "key:value,key:value" into a params object.
 * @param {string} owsOptionsString
 * @returns {Object|undefined}
 */
function getParamsFromOwsOptionsString(owsOptionsString) {
  if (owsOptionsString === undefined) {
    return undefined;
  }

  const params = {};
  const kvArray = owsOptionsString.split(",");

  kvArray.forEach(function (kv) {
    if (kv.includes(":")) {
      const splited = kv.split(":");
      const key = splited[0];
      const value = splited.slice(1).join(":");
      if (key !== "") {
        params[key] = value;
      }
    }
  });

  return params;
}

/**
 * Fetch and parse a WMS GetCapabilities response as XML.
 * @param {{url: string, owsParams?: Object}} layer
 * @returns {Promise<Document>}
 * @throws {Error} If HTTP request fails or XML is invalid
 */
function getCapabilities(layer) {
  const url = getCapUrl(layer.url, layer.owsParams);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GetCapabilities request failed with status ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const parserError = xml.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid XML returned by GetCapabilities request");
      }
      return xml;
    });
}

/**
 * Build GetCapabilities URL for a WMS service.
 * @param {string} serviceUri
 * @param {Object} [params]
 * @returns {string|undefined}
 */
function getCapUrl(serviceUri, params) {
  if (serviceUri === undefined) {
    return undefined;
  }

  // transform to uppercase param keys
  const uppercaseParams = {};
  if (params !== undefined) {
    for (const key in params) {
      const upperKey = key.toUpperCase();
      uppercaseParams[upperKey] = params[key];
    }
  }

  const defaultParams = {
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetCapabilities",
  };

  if (params !== undefined) {
    Object.assign(defaultParams, uppercaseParams);
  }

  return appendParams(serviceUri, defaultParams);
}

/**
 * WMS filter param keys.
 * @type {{cql: string, filter: string}}
 */
// WMS filter helpers for GeoServer/QGIS Server/MapServer.
const WMS_FILTER_PARAM_KEYS = {
  cql: "CQL_FILTER",
  filter: "FILTER",
};

/**
 * Normalize server type value.
 * @param {string} value
 * @returns {string}
 */
function normalizeServerType(value) {
  const normalized = (value || "").toString().trim().toLowerCase();
  return WMS_SERVER_TYPES[normalized] || "";
}

/**
 * Resolve server type for a layer definition.
 * @param {Object} layerDefinition
 * @returns {string}
 */
function getLayerServerType(layerDefinition) {
  if (layerDefinition && layerDefinition.servertype) {
    const explicit = normalizeServerType(layerDefinition.servertype);
    if (explicit) {
      return explicit;
    }
  }
  const url = layerDefinition && layerDefinition.url;
  if (isQgisServer(url)) {
    return WMS_SERVER_TYPES.qgis;
  }
  if (isMapServer(url)) {
    return WMS_SERVER_TYPES.ogc;
  }
  return WMS_SERVER_TYPES.geoserver;
}

/**
 * Escape string for RegExp usage.
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Detect QGIS Server URLs.
 * @param {string} url
 * @returns {boolean}
 */
function isQgisServer(url) {
  return /qgis|qgs/i.test(url || "");
}

/**
 * Detect MapServer URLs.
 * @param {string} url
 * @returns {boolean}
 */
function isMapServer(url) {
  return /mapserv(\\.exe)?|mapserver/i.test(url || "");
}

/**
 * Pick the WMS filter parameter key for a layer.
 * @param {Object} layerDefinition
 * @returns {string}
 */
function getWmsFilterParamKey(layerDefinition) {
  const explicit = layerDefinition && layerDefinition.filterparam;
  if (explicit) {
    const normalized = explicit.toString().trim().toUpperCase();
    if (
      normalized === WMS_FILTER_PARAM_KEYS.cql ||
      normalized === WMS_FILTER_PARAM_KEYS.filter
    ) {
      return normalized;
    }
  }
  const serverType = getLayerServerType(layerDefinition);
  if (serverType === WMS_SERVER_TYPES.qgis || serverType === WMS_SERVER_TYPES.ogc) {
    return WMS_FILTER_PARAM_KEYS.filter;
  }
  return WMS_FILTER_PARAM_KEYS.cql;
}

/**
 * Check if FILTER param needs layername prefix.
 * @param {Object} layerDefinition
 * @returns {boolean}
 */
function shouldPrefixFilter(layerDefinition) {
  return getWmsFilterParamKey(layerDefinition) === WMS_FILTER_PARAM_KEYS.filter;
}

/**
 * Remove layername prefix from a WMS filter expression.
 * @param {Object} layerDefinition
 * @param {string} filterValue
 * @returns {string}
 */
function stripLayerPrefixFromFilter(layerDefinition, filterValue) {
  if (!filterValue || !shouldPrefixFilter(layerDefinition)) {
    return filterValue;
  }
  const layerName = layerDefinition && layerDefinition.layername;
  if (!layerName) {
    return filterValue;
  }
  const pattern = new RegExp("^" + escapeRegExp(layerName) + "\\s*:\\s*", "i");
  return filterValue.replace(pattern, "");
}

/**
 * Build FILTER/CQL_FILTER param value with optional layer prefix.
 * @param {Object} layerDefinition
 * @param {string} filterExpression
 * @returns {string}
 */
function buildWmsFilterParamValue(layerDefinition, filterExpression) {
  if (!filterExpression || !shouldPrefixFilter(layerDefinition)) {
    return filterExpression;
  }
  const layerName = layerDefinition && layerDefinition.layername;
  if (!layerName) {
    return filterExpression;
  }
  const trimmed = filterExpression.trim();
  const pattern = new RegExp("^" + escapeRegExp(layerName) + "\\s*:\\s*", "i");
  if (pattern.test(trimmed)) {
    return trimmed;
  }
  if (layerDefinition?.servertype === WMS_SERVER_TYPES.ogc) {
    return trimmed;
  }
  return layerName + ":" + trimmed;
}

/**
 * Read the filter expression from WMS params (CQL_FILTER or FILTER).
 * @param {Object} layerDefinition
 * @param {Object} params
 * @returns {string}
 */
function getWmsFilterExpression(layerDefinition, params) {
  if (!params) {
    return "";
  }
  const paramKey = getWmsFilterParamKey(layerDefinition);
  let filterValue = params[paramKey];
  if (!filterValue) {
    const fallbackKey =
      paramKey === WMS_FILTER_PARAM_KEYS.cql
        ? WMS_FILTER_PARAM_KEYS.filter
        : WMS_FILTER_PARAM_KEYS.cql;
    filterValue = params[fallbackKey];
  }
  return stripLayerPrefixFromFilter(layerDefinition, filterValue || "");
}

/**
 * Set WMS filter param on a params object.
 * @param {Object} layerDefinition
 * @param {Object} params
 * @param {string} filterExpression
 * @returns {void}
 */
function setWmsFilterParam(layerDefinition, params, filterExpression) {
  if (!params) {
    return;
  }
  delete params[WMS_FILTER_PARAM_KEYS.cql];
  delete params[WMS_FILTER_PARAM_KEYS.filter];
  if (!filterExpression) {
    return;
  }
  let paramKey = getWmsFilterParamKey(layerDefinition);
  // force FILTER key if expression contains XML
  if (filterExpression.trim().charAt(0) === "<") {
    paramKey = WMS_FILTER_PARAM_KEYS.filter;
  }
  params[paramKey] = buildWmsFilterParamValue(layerDefinition, filterExpression);
}

/**
 * Quote a field name for FILTER syntax (QGIS/MapServer).
 * @param {Object} layerDefinition
 * @param {string} fieldName
 * @returns {string}
 */
function formatFilterFieldName(layerDefinition, fieldName) {
  if (!fieldName) {
    return fieldName;
  }
  if (getWmsFilterParamKey(layerDefinition) !== WMS_FILTER_PARAM_KEYS.filter) {
    return fieldName;
  }
  if (/^\".*\"$/.test(fieldName)) {
    return fieldName;
  }
  return `"${fieldName.replace(/\"/g, '""')}"`;
}
