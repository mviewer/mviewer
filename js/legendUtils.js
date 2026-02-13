/**
 * Build GetLegendGraphic URL for a WMS service.
 * @param {Object} layer
 * @param {Object} [params]
 * @returns {string|undefined}
 */
function getLegendGraphicUrl(layer, params) {
  const serviceUri = layer && layer.url;
  if (serviceUri === undefined) {
    return undefined;
  }

  /**
   * Get first direct child text content by localName.
   * @param {Node|null} parent
   * @param {string} localName
   * @returns {string}
   */
  const getTextContentByLocalName = function (parent, localName) {
    if (!parent) {
      return "";
    }
    const node = Array.from(parent.childNodes).find(function (child) {
      return child.nodeType === 1 && child.localName === localName;
    });
    return node && node.textContent ? node.textContent.trim() : "";
  };

  /**
   * Normalize capabilities input to an XML Document.
   * @param {string|Document|undefined|null} capabilitiesValue
   * @returns {Document|null}
   */
  const getCapabilitiesDocument = function (capabilitiesValue) {
    if (!capabilitiesValue) {
      return null;
    }
    if (capabilitiesValue.nodeType === 9) {
      return capabilitiesValue;
    }
    if (typeof capabilitiesValue === "string") {
      const xml = new DOMParser().parseFromString(capabilitiesValue, "text/xml");
      if (!xml.querySelector("parsererror")) {
        return xml;
      }
    }
    return null;
  };

  /**
   * Find a Layer node by Name in capabilities.
   * @param {Document|null} capabilitiesDoc
   * @param {string} layerName
   * @returns {Element|null}
   */
  const findLayerNode = function (capabilitiesDoc, layerName) {
    if (!capabilitiesDoc || !layerName) {
      return null;
    }
    return (
      Array.from(capabilitiesDoc.getElementsByTagName("*")).find(function (node) {
        if (node.localName !== "Layer") {
          return false;
        }
        return getTextContentByLocalName(node, "Name") === layerName;
      }) || null
    );
  };

  /**
   * Extract legend metadata from a layer style definition.
   * @param {Element|null} layerNode
   * @param {string|undefined} styleName
   * @returns {{href?: string, format?: string, width?: string, height?: string, legendOptions?: string, transparent?: string}}
   */
  const getLegendFromLayerNode = function (layerNode, styleName) {
    if (!layerNode) {
      return {};
    }

    const styleNodes = Array.from(layerNode.childNodes).filter(function (node) {
      return node.nodeType === 1 && node.localName === "Style";
    });

    let selectedStyle = styleNodes[0] || null;
    if (styleName) {
      const decodedStyle = decodeURIComponent(styleName);
      const namedStyle = styleNodes.find(function (styleNode) {
        return getTextContentByLocalName(styleNode, "Name") === decodedStyle;
      });
      if (namedStyle) {
        selectedStyle = namedStyle;
      }
    }

    const legendNode = selectedStyle
      ? Array.from(selectedStyle.childNodes).find(function (node) {
          return node.nodeType === 1 && node.localName === "LegendURL";
        })
      : null;

    if (!legendNode) {
      return {};
    }

    const onlineResource = Array.from(legendNode.childNodes).find(function (node) {
      return node.nodeType === 1 && node.localName === "OnlineResource";
    });
    const href =
      onlineResource &&
      (onlineResource.getAttribute("xlink:href") || onlineResource.getAttribute("href"));

    /**
     * Read a query param value in a case-insensitive way.
     * @param {string} url
     * @param {string} key
     * @returns {string}
     */
    const getQueryParamValue = function (url, key) {
      if (!url || !key) {
        return "";
      }
      const queryString = url.split("?")[1] || "";
      if (!queryString) {
        return "";
      }
      const searchParams = new URLSearchParams(queryString);
      const expectedKey = key.toLowerCase();
      for (const [paramKey, paramValue] of searchParams.entries()) {
        if (paramKey.toLowerCase() === expectedKey) {
          return paramValue;
        }
      }
      return "";
    };

    return {
      href: href || "",
      format: getTextContentByLocalName(legendNode, "Format"),
      width: legendNode.getAttribute("width") || "",
      height: legendNode.getAttribute("height") || "",
      legendOptions: getQueryParamValue(href || "", "LEGEND_OPTIONS"),
      transparent: getQueryParamValue(href || "", "TRANSPARENT"),
    };
  };

  /**
   * Find best supported legend format from capabilities request metadata.
   * @param {Document|null} capabilitiesDoc
   * @returns {string}
   */
  const getLegendFormatFromCapabilities = function (capabilitiesDoc) {
    if (!capabilitiesDoc) {
      return "";
    }
    const getLegendGraphicNode = Array.from(
      capabilitiesDoc.getElementsByTagName("*")
    ).find(function (node) {
      return node.localName === "GetLegendGraphic";
    });
    if (!getLegendGraphicNode) {
      return "";
    }
    const formats = Array.from(getLegendGraphicNode.childNodes)
      .filter(function (node) {
        return node.nodeType === 1 && node.localName === "Format";
      })
      .map(function (node) {
        return node.textContent ? node.textContent.trim() : "";
      })
      .filter(Boolean);
    if (formats.length === 0) {
      return "";
    }
    const pngFormat = formats.find(function (format) {
      return format.toLowerCase() === "image/png";
    });
    return pngFormat || formats[0];
  };

  const capabilitiesDoc = getCapabilitiesDocument(layer.capabilities);

  // Try to preload capabilities for next calls when not yet available.
  if (!capabilitiesDoc && serviceUri && !layer._legendCapabilitiesLoading) {
    layer._legendCapabilitiesLoading = true;
    getCapabilities(layer)
      .then(function (xmlDoc) {
        layer.capabilities = xmlDoc;
      })
      .catch(function () {
        // Keep default legend behavior when capabilities are unavailable.
      })
      .finally(function () {
        layer._legendCapabilitiesLoading = false;
      });
  }

  const layerNode = capabilitiesDoc
    ? findLayerNode(capabilitiesDoc, layer.layername)
    : null;
  const capaLegend = getLegendFromLayerNode(layerNode, params && params.STYLE);
  const serviceVersion =
    capabilitiesDoc &&
    capabilitiesDoc.documentElement &&
    capabilitiesDoc.documentElement.getAttribute("version");
  const formatFromCapabilities =
    capaLegend.format || getLegendFormatFromCapabilities(capabilitiesDoc);
  const widthFromCapabilities = capaLegend.width;
  const heightFromCapabilities = capaLegend.height;
  const legendOptionsFromCapabilities = capaLegend.legendOptions;
  const transparentFromCapabilities = capaLegend.transparent;

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
    VERSION: serviceVersion || "1.3.0",
    REQUEST: "GetLegendGraphic",
    SLD_VERSION: "1.1.0",
    FORMAT: formatFromCapabilities || "image/png",
    WIDTH: widthFromCapabilities || "30",
    HEIGHT: heightFromCapabilities || "20",
    LEGEND_OPTIONS: legendOptionsFromCapabilities
      ? encodeURIComponent(legendOptionsFromCapabilities)
      : encodeURIComponent(
          "fontName:Open Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10;dpi:96"
        ),
    TRANSPARENT: transparentFromCapabilities || true,
  };

  if (params !== undefined) {
    Object.assign(defaultParams, uppercaseParams);
  }

  return appendParams(capaLegend.href || serviceUri, defaultParams);
}
