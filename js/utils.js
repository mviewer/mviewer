var utils = (function () {
  var _WMTSTileMatrix = {};

  var _WMTSTileResolutions = {};

  /**
   * Public Method: lonlat2osmtile
   * from https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
   *
   */
  //Not used but great
  var _lonlat2osmtile = function (lon, lat, zoom) {
    var x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    var y = Math.floor(
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
          Math.PI) /
        2) *
        Math.pow(2, zoom)
    );
    var osmtile = "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";
    return osmtile;
  };

  var _tests = {};

  _tests.sld = function (layers) {
    var regexp = /^(?:http(s)?:\/\/)?[\w-./@]+.(sld|SLD)$/i;
    var test = 1;
    layers.forEach(function (layer) {
      if (layer && layer.sld) {
        var name = layer.name;
        var slds = layer.sld.split(",");
        slds = slds.map((sld) => configuration.renderEnvPath(sld));
        slds.forEach(function (sld, i) {
          if (!regexp.test(sld)) {
            test = 0;
            console.log(`sld ${sld}\nnon valide pour la couche ${name}`);
          }
        });
      }
    });
    return test;
  };

  _tests.wildcardpattern = function (layers) {
    var test = 1;
    const allowedwilcards = ["%", "%%"];
    layers.forEach(function (layer) {
      if (
        layer &&
        layer.attributefilter &&
        layer.attributeoperator === "like" &&
        layer.wildcardpattern
      ) {
        var name = layer.name;
        //Extract wildcards from pattern. Eg % or %%
        var wildcards = layer.wildcardpattern.split("value").join("").trim();
        if (!allowedwilcards.includes(wildcards)) {
          test = 0;
          console.log(
            `pattern ${layer.wildcardpattern}\nnon valide pour la couche ${name}`
          );
        }
      }
    });
    return test;
  };

  _tests.icons = function (themes) {
    var test = 1;
    if (themes.theme !== undefined) {
      themes.theme.forEach(function (theme) {
        if (theme && theme.icon && theme.icon.indexOf(".") === -1) {
          if (theme.icon.indexOf(" ") === -1) {
            test = 0;
            console.log(
              `Problème Icone thématique ${theme.name} : ${theme.icon}\nnotation dépréciée avec font-awesome 5.6.3. Utiliser une notation du type 'fas fa-${theme.icon}`
            );
          }
        }
      });
    }
    return test;
  };

  _tests.layerNameDuplicates = function (layers) {
    var test = 1;
    var duplicates = [];
    layers.forEach(function (layer) {
      if (layer) {
        var name = layer.name;
        if ($.inArray(name, duplicates)) {
          duplicates.push(name);
        } else {
          test = 0;
          console.log(`doublon ${name} in layers`);
        }
      }
    });
    return test;
  };

  _tests.oneBaseLayerVisible = function (baselayers) {
    var visibleBaseLayers = 0;
    var test = 1;
    baselayers.baselayer.forEach(function (baselayer) {
      if (baselayer.visible === "true") {
        visibleBaseLayers += 1;
      }
    });
    if (visibleBaseLayers !== 1) {
      test = 0;
      console.log(`${visibleBaseLayers} baselayer(s) visible(s)`);
    }
    return test;
  };

  /**
   * _testConfig
   * @param {xml} config xml to test
   */

  var _testConfiguration = function (conf) {
    var score = 0;
    var nbtests = 0;
    var layers = [];
    //Get all layers
    if (conf.themes.theme !== undefined) {
      conf.themes.theme.forEach(function (theme) {
        if (theme.layer) {
          layers = layers.concat(theme.layer);
        }
        theme.group.forEach(function (group) {
          if (group.layer) {
            layers = layers.concat(group.layer);
          }
        });
      });
    }

    //test = 1 baselayer visible
    score += _tests.oneBaseLayerVisible(conf.baselayers);
    nbtests += 1;

    //Test doublons de noms dans les couches
    score += _tests.layerNameDuplicates(layers);
    nbtests += 1;

    // test validité sld
    score += _tests.sld(layers);
    nbtests += 1;

    // test validité pattern like operator
    score += _tests.wildcardpattern(layers);
    nbtests += 1;

    // test icons fontawesome
    score += _tests.icons(conf.themes);
    nbtests += 1;

    //Résultats tests
    console.log(`tests config :${score / nbtests === 1}`);
  };

  var _initWMTSMatrixsets = function (projection) {
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    _WMTSTileMatrix = { "EPSG:3857": [], "EPSG:4326": [], "EPSG:2154": [], PM: [] };
    _WMTSTileResolutions = { "EPSG:3857": [], "EPSG:4326": [], "EPSG:2154": [], PM: [] };
    for (var z = 0; z < 22; ++z) {
      // generate resolutions and matrixIds arrays for this GEOSERVER WMTS
      _WMTSTileResolutions["EPSG:3857"][z] = size / Math.pow(2, z);
      _WMTSTileMatrix["EPSG:3857"][z] = `EPSG:3857:${z}`;
      _WMTSTileResolutions["EPSG:4326"][z] = size / Math.pow(2, z);
      _WMTSTileMatrix["EPSG:4326"][z] = `EPSG:4326:${z}`;
      _WMTSTileResolutions["EPSG:2154"][z] = size / Math.pow(2, z);
      _WMTSTileMatrix["EPSG:2154"][z] = `EPSG:2154:${z}`;
    }
    for (var z = 0; z < 20; ++z) {
      // generate resolutions and matrixIds arrays for this GEOPORTAIL WMTS
      _WMTSTileResolutions["PM"][z] = size / Math.pow(2, z);
      _WMTSTileMatrix["PM"][z] = z;
    }
  };

  _getWMTSTileMatrix = function (matrixset) {
    return _WMTSTileMatrix[matrixset];
  };

  _getWMTSTileResolutions = function (matrixset) {
    return _WMTSTileResolutions[matrixset];
  };

  /**
   * This function calculates the zoom level for a given extent and map size.
   * @param {ol.Extent} extent - The extent to calculate the zoom level for.
   */
  _calculateZoomExtent = (extent) => {
    const view = mviewer.getMap().getView();
    const size = mviewer.getMap().getSize();
    const resolution = view.getResolutionForExtent(extent, size);
    return view.getZoomForResolution(resolution);
  };

  /**
   * this function zooms the map to the extent of the given features.
   * @param {array} features
   */
  _zoomToFeaturesExtent = (features) => {
    if (!features || features.length === 0) {
      return;
    }
    const extent = ol.extent.createEmpty();
    features.forEach((feature) =>
      ol.extent.extend(extent, feature.getGeometry().getExtent())
    );
    const geometry = features[0].getGeometry();
    const isSinglePoint = features.length < 2 && geometry.getType() === "Point";

    const zoom = isSinglePoint ? 16 : _calculateZoomExtent(extent);

    const center = ol.extent.getCenter(extent);

    mviewer.animateToFeature(center, zoom - 1, center, false);
  };

  _getTemplateUrl = (lang, layer, isUrl) => {
    if (!isUrl) return `${layer.template.url}_${lang}.mst`;

    var template_url = new URL(layer.template.url);
    template_url.searchParams.set("lang", lang);
    template_url = template_url.toString();
    return template_url;
  };

  var _warnedProjectionPairs = {};

  /**
   * Resolve a projection from an OpenLayers projection instance or a projection code.
   * @param {ol.proj.Projection|string|null|undefined} projectionLike
   * @returns {ol.proj.Projection|null}
   */
  var _resolveProjection = function (projectionLike) {
    if (!projectionLike) {
      return null;
    }

    if (typeof projectionLike.getCode === "function") {
      return projectionLike;
    }

    if (typeof projectionLike === "string") {
      return ol.proj.get(projectionLike) || null;
    }

    return null;
  };

  /**
   * Warn once when a projection transformation cannot be applied because a projection is missing.
   * @param {ol.proj.Projection|string|null|undefined} source
   * @param {ol.proj.Projection|string|null|undefined} destination
   * @returns {void}
   */
  var _warnProjectionFallback = function (source, destination) {
    var sourceCode =
      source && typeof source.getCode === "function"
        ? source.getCode()
        : source || "unknown";
    var destinationCode =
      destination && typeof destination.getCode === "function"
        ? destination.getCode()
        : destination || "unknown";
    var key = [sourceCode, destinationCode].join("->");

    if (_warnedProjectionPairs[key]) {
      return;
    }

    _warnedProjectionPairs[key] = true;
    console.warn(
      `Projection transformation skipped because a projection is not registered: ${key}`
    );
  };

  /**
   * Transform coordinates only when both projections are registered.
   * Falls back to a shallow copy of the original coordinates otherwise.
   * @param {Array<number>} coordinate
   * @param {ol.proj.Projection|string|null|undefined} source
   * @param {ol.proj.Projection|string|null|undefined} destination
   * @returns {Array<number>}
   */
  var _transformCoordinateSafe = function (coordinate, source, destination) {
    var resolvedSource = _resolveProjection(source);
    var resolvedDestination = _resolveProjection(destination);

    if (!resolvedSource || !resolvedDestination) {
      _warnProjectionFallback(source, destination);
      return coordinate && coordinate.slice ? coordinate.slice() : coordinate;
    }

    return ol.proj.transform(coordinate, resolvedSource, resolvedDestination);
  };

  /**
   * Transform an extent only when both projections are registered.
   * Falls back to a shallow copy of the original extent otherwise.
   * @param {ol.Extent} extent
   * @param {ol.proj.Projection|string|null|undefined} source
   * @param {ol.proj.Projection|string|null|undefined} destination
   * @returns {ol.Extent}
   */
  var _transformExtentSafe = function (extent, source, destination) {
    var resolvedSource = _resolveProjection(source);
    var resolvedDestination = _resolveProjection(destination);

    if (!resolvedSource || !resolvedDestination) {
      _warnProjectionFallback(source, destination);
      return extent && extent.slice ? extent.slice() : extent;
    }

    return ol.proj.transformExtent(extent, resolvedSource, resolvedDestination);
  };

  /**
   * Transform a geometry clone only when both projections are registered.
   * Falls back to a cloned geometry without reprojection otherwise.
   * @param {ol.geom.Geometry} geometry
   * @param {ol.proj.Projection|string|null|undefined} source
   * @param {ol.proj.Projection|string|null|undefined} destination
   * @returns {ol.geom.Geometry}
   */
  var _transformGeometrySafe = function (geometry, source, destination) {
    if (!geometry) {
      return geometry;
    }

    var resolvedSource = _resolveProjection(source);
    var resolvedDestination = _resolveProjection(destination);

    if (!resolvedSource || !resolvedDestination) {
      _warnProjectionFallback(source, destination);
      return geometry.clone();
    }

    return geometry.clone().transform(resolvedSource, resolvedDestination);
  };

  return {
    lonlat2osmtile: _lonlat2osmtile,
    testConfiguration: _testConfiguration,
    initWMTSMatrixsets: _initWMTSMatrixsets,
    getWMTSTileMatrix: _getWMTSTileMatrix,
    getWMTSTileResolutions: _getWMTSTileResolutions,
    calculateZoomExtent: _calculateZoomExtent,
    zoomToFeaturesExtent: _zoomToFeaturesExtent,
    getTemplateUrl: _getTemplateUrl,
    resolveProjection: _resolveProjection,
    transformCoordinateSafe: _transformCoordinateSafe,
    transformExtentSafe: _transformExtentSafe,
    transformGeometrySafe: _transformGeometrySafe,
  };
})();
