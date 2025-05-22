var search = (function () {
  /* COMMON WITH MVIEWER */

  /**
   * Property: _map
   *  @type {ol.Map}
   */

  var _map;

  /**
   * Property: _sourceOverlay
   * @type {ol.source.Vector}
   * Used to highlight vector features
   */

  var _sourceOverlay;

  /**
   * Property: _projection
   *  @type {ol.proj.Projection}
   */

  var _projection;

  /**
   * Property: _overLayers
   * {object} hash of all overlay Layers (static)
   */

  var _overLayers;

  /* FIN DE COMMON */

  /**
   * Property: _sourceEls
   * @type {ol.source.Vector}
   * Used to highlight ELS vector features
   */

  var _sourceEls;

  /**
   * Property: _searchableElasticsearchLayers
   * Array of {ol.layers.WMS} .
   */

  var _searchableElasticsearchLayers = [];

  /**
   * Property: _searchableFuseLayers
   * Array of {ol.Layers.WMS} .
   */

  var _searchableFuseLayers = [];

  /**
   * Property: _olsCompletionUrl
   * String. The OpenLs url used by the geocode control
   */

  var _olsCompletionUrl = null;

  /**
   * Property: _olsCompletionType
   * String. The service type used by the geocode control (search or completion)
   */

  var _olsCompletionType = null;

  /**
   * Property: _elasticSearchUrl
   * String. The Elasticsearch url used by search function
   */

  var _elasticSearchUrl = null;

  /**
   * Property: _elasticSearchGeometryfield
   * String. The Elasticsearch geometry field used by search function
   */

  var _elasticSearchGeometryfield = null;

  /**
   * Property: _elasticSearchDocTypes
   * String. The Elasticsearch document types to use in all search requests
   * @Deprecated not available after ElasticSearch 7
   */

  var _elasticSearchDocTypes = "";

  /**
   * Property: _elasticSearchVersion
   * String. The version of Elasticsearch instance
   */

  var _elasticSearchVersion = null;

  /**
   * Property: _elasticSearchLinkid
   * String. The common id between Elasticsearch document types (_id)  and wfs featureTypes.
   *
   */

  var _elasticSearchLinkid = null;

  /**
   * Property: _elasticSearchQuerymode
   * String. The Elasticsearch query mode used by search function
   */

  var _elasticSearchQuerymode = null;

  var _elasticSearchmouseoverfields = null;

  var _elasticSearchdisplayfields = null;

  var _elasticSearchGeomtype = null;

  /**
   * ElasticSearch use only 4326 projection
   * Transformation in Mviewer projection is needed
   */
  const _proj4326 = "EPSG:4326";

  /**
   * Property: _fuseSearchData
   * String. data from GeoJSON layers for which the fuse search is activated
   */

  var _fuseSearchData = [];

  /**
   * Property: _searchparams
   * Enables properties the search
   */

  var _searchparams = {
    localities: true,
    bbox: false,
    features: false,
    static: false,
    querymaponclick: false,
    closeafterclick: false,
  };

  /**
   * Private Method: _clearSearchResults
   *
   */

  var _clearSearchResults = function () {
    $("#searchresults .list-group-item").not(".search-header").remove();
    $("#searchresults .search-header").addClass("hidden");
    $("#searchresults").hide();
  };

  /**
   * Private Method: _initSearchMarker
   */
  var _initSearchMarker = function (searchparams) {
    if (searchparams && searchparams.imgurl) {
      $(".mv_marker_svg").remove();
      $(".mv_marker_img").attr("style", `max-width:${searchparams.imgwidth || "50px"}`);
      $(".mv_marker_img").attr("src", searchparams.imgurl || "");
    } else {
      $(".mv_marker_img").remove();
      var defaultPath = $("#mv_marker").children("path");
      defaultPath.css(
        "fill",
        (searchparams && searchparams.svgcolor) || defaultPath.css("fill")
      );
    }
  };

  /**
   * Private Method: _clearSearchField
   *
   */

  var _clearSearchField = function () {
    _clearSearchResults();
    $("#searchfield").val("");
  };

  /**
   * Private Method: _showResults
   *
   * @param {*} results
   * @param {*} resultsType
   */
  var _showResults = function (results, resultsType) {
    if (resultsType) {
      var searchHeader = $(`[i18n='search.result.${resultsType}']`);
      searchHeader.removeClass("hidden");
      searchHeader.after(results);
    } else {
      $("#searchresults").append(results);
    }
    if (_searchparams.closeafterclick) {
      $("#searchresults .list-group-item").click(function () {
        $(".searchresults-title .close").trigger("click");
      });
    }
    $("#searchresults").show();
  };

  /**
   * Private Method: _initSearch
   *
   */
  var _initSearch = function () {
    let timeoutId;
    const timeoutToWait = 500;
    $("#searchtool a").attr("title", "Effacer");
    if (_searchparams.features || _searchparams.static) {
      _sourceEls = new ol.source.Vector();
      var vector = new ol.layer.Vector({
        source: _sourceEls,
        style: mviewer.featureStyles.elsStyle,
      });
      vector.set("mviewerid", "elasticsearch");
      _map.addLayer(vector);
    }

    $(".searchresults-title .close").click(function () {
      _clearSearchField();
      if (_sourceEls) {
        _sourceEls.clear();
      }
    });

    // isPasting and keydown are here to avoid Ctrl+V to trigger the keyup function TWICE
    let isPasting = false;

    $(document).on("keydown", (event) => {
      if (event.ctrlKey && event.key === "v") {
        isPasting = true;
      }
    });

    $(document).on("keyup", "#searchfield", function (e) {
      // TIMEOUT will avoid one request by keyup
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Avoid double trigger
        if (isPasting && e.key.toLowerCase() === "v") {
          isPasting = false;
          return;
        }

        // Detect entrer key
        if (e.keyCode == 13 && $("#searchresults a").length > 1) {
          let firstitem = $("#searchresults").find("a")[1];
          $(firstitem).trigger("click");
          return;
        }
        let chars = $(this).val().trim().length;
        if (!chars) {
          return;
          // Do not launch search if less than x chars
        } else if (chars < 3) {
          $("#searchresults .list-group-item").not(".search-header").remove();
          $("#searchresults .search-header").addClass("hidden");
        }
        // Launch search
        else {
          _search($(this).val());
        }
      }, timeoutToWait);
    });

    mviewer.zoomToFeature = search.zoomToFeature;
    mviewer.showFeature = search.showFeature;
    mviewer.animateToFeature = search.animateToFeature;
  };

  /**
   * Request BAN search service
   * @param {string} url
   */
  const displaySearchList = async (url, type = "completion") => {
    const searchType = `.${type}-location`;
    const zoomByType = {
      municipality: 13,
      administratif: 13,
      city: 13,
      locality: 15,
      town: 15,
      village: 16,
      street: 17,
      housenumber: 18,
    };
    // request
    const response = await fetch(url);
    const data = await response.json();
    // display response
    const res = data?.results || data?.features || [];
    let str = "";
    for (var i = 0, len = res.length; i < len && i < 5; i++) {
      var props = res[i].properties;
      let geom;
      if (res[i]?.geometry) {
        // search
        geom = new ol.format.GeoJSON().readGeometry(res[i].geometry);
      } else {
        // completion
        geom = new ol.geom.Point([res[i]?.x, res[i]?.y]);
      }

      var extentCenter = _getCenterWithExtent(geom, _proj4326);
      var coords = geom.getCoordinates();
      const poiType = props?.type || res[i]?.kind;
      const zoom = zoomByType[poiType] || 14;
      let title = "";
      if (type === "search") {
        title = `${props?.context}-${props?.type}` || "";
      }
      str += `<a class="${searchType} list-group-item" href="#" ${title}"
              onclick="mviewer.animateToFeature(
                  ${JSON.stringify([coords[0], coords[1]])},
                  ${zoom},
                  ${JSON.stringify(extentCenter)},
                  ${_searchparams.querymaponclick}
              );
              mviewer.showLocation('${_proj4326}', ${coords[0]}, ${coords[1]}, ${
        _searchparams.marker
      });">
              ${props?.label || res[i].fulltext}
          </a>`;
    }
    $(searchType).remove();
    _showResults(str, "locations");
  };
  /**
   * Will search according to configured search service and input search field
   * @param {string} value input from text field
   */
  var _search = function (value) {
    // OpenLS or IGN services
    if (_searchparams.localities) {
      if (["completion", "geoportail"].includes(_olsCompletionType)) {
        displaySearchList(
          `${_olsCompletionUrl}?text=${value}&type=StreetAddress,PositionOfInterest&ter=5`,
          _olsCompletionType
        );
      } else if (_olsCompletionType === "search") {
        var parameters = { q: value, limit: 5 };
        if (_searchparams.bbox) {
          var center = _map.getView().getCenter();
          var center = ol.proj.transform(center, _projection.getCode(), _proj4326);
          parameters.lon = center[0];
          parameters.lat = center[1];
        }
        // create URL
        const searchUrl = new URL(_olsCompletionUrl);
        searchUrl.searchParams.append("q", parameters.q);
        searchUrl.searchParams.append("limit", parameters.limit);
        const searchUrlString = searchUrl.toString();
        // display result
        displaySearchList(searchUrlString, _olsCompletionType);
      }
    }

    // ElasticSearch request
    if (_searchparams.features || _searchparams.static) {
      _sendElasticsearchRequest(value);
    }

    // Fuse search on local GEOJSON
    if (_searchparams.features) {
      _sendFuseRequest(value);
    }
  };

  var _shapeToPoint = function (geometry) {
    var point = [];
    var position = Math.floor(geometry.coordinates.length / 2);
    if (geometry == null) return;
    switch (geometry.type) {
      case "MultiPoint":
        point[0] = geometry.coordinates[position][0];
        point[1] = geometry.coordinates[position][1];
        break;
      case "MultiLineString":
        point[0] = geometry.coordinates[0][0][0];
        point[1] = geometry.coordinates[0][0][1];
        break;
      case "LineString":
        point[0] = geometry.coordinates[position][0];
        point[1] = geometry.coordinates[position][1];
        break;
      case "MultiPolygon":
      case "Polygon":
        point = ol.extent.getCenter(
          new ol.format.GeoJSON().readGeometry(geometry).getExtent()
        );
        break;
      default:
        point[0] = geometry.coordinates[0];
        point[1] = geometry.coordinates[1];
        break;
    }
    return point;
  };

  /**
   * Private Method: _sendFuseRequest
   *
   */
  var _sendFuseRequest = function (val) {
    $(".fuse").remove();

    var searchableLayers = _searchableFuseLayers.filter(
      (e) => e.getVisible() && _fuseSearchData[e.get("mviewerid")]
    );

    for (var i = 0; i < searchableLayers.length; i++) {
      var layername = searchableLayers[i].get("name");
      var layerid = searchableLayers[i].get("mviewerid");

      var results = _fuseSearchData[layerid].search(val);
      var zoom = 15;
      var max_results = 5;
      var str = "";
      if (results.length > 0) {
        // We only display the first results
        results = results.slice(0, max_results);

        str = '<a class="fuse list-group-item disabled">' + layername + "</a>";
        results.forEach(function (element) {
          // from version 4 data are stored in element.item
          element = element.item;

          /*
           * 2 cases, one specific field or a Mustache template for combining fields in a string. Examples:
           * - name of a field: name
           * - Mustache template : {{name}} ({{city}})
           * - other Mustache template : {{name}}{{#city}} ({{city}}){{/city}}
           */
          var _fuseSearchResult = element.fusesearchresult;
          if (
            _fuseSearchResult.indexOf("{{") === -1 &&
            _fuseSearchResult.indexOf("}}") === -1
          ) {
            // one specific field
            result_label = element[element.fusesearchresult];
          } else {
            // a Mustache template
            result_label = Mustache.render(_fuseSearchResult, element);
          }
          var geom = new ol.format.GeoJSON().readGeometry(element.geometry);
          var xyz = mviewer.getLonLatZfromGeometry(geom, _proj4326, zoom);
          var extentCenter = _getCenterWithExtent(geom, _proj4326);
          str += `
            <a class="fuse list-group-item" title="${result_label}" 
                href="#" onclick="
                  mviewer.animateToFeature(${JSON.stringify([xyz.lon, xyz.lat])}, ${
            xyz.zoom
          }, ${JSON.stringify(extentCenter)}, ${_searchparams.querymaponclick}); 
                  mviewer.showLocation('${_proj4326}', ${xyz.lon}, ${xyz.lat}, false);" 
                onmouseover="mviewer.flash('${_proj4326}', ${xyz.lon}, ${
            xyz.lat
          }, false);">
              ${result_label}
            </a>`;
        });
      }
      _showResults(str);
    }
  };

  /**
   * Build query for elastic search depending on wanted version and params
   * @param {*} version
   * @param {*} mode
   * @param {*} val
   * @param {*} queryLayers - not used after ElasticSearch 7 version
   */
  var buildQuery = function (version, mode, val, queryLayers) {
    if (version === 1.4) {
      switch (mode) {
        case "term":
          query = { match: { _all: val } };
          break;
        case "phrase":
          query = { match_phrase: { _all: val } };
          break;
        case "match":
          query = {
            fuzzy_like_this: {
              like_text: val,
              max_query_terms: 12,
              fuzziness: 0.7,
            },
          };
          break;
        default:
          query = {
            fuzzy_like_this: {
              like_text: val,
              max_query_terms: 12,
              fuzziness: 0.7,
            },
          };
      }

      queryFilter = {
        query: {
          filtered: {
            query: query,
            filter: {
              and: {
                filters: [{ or: { filters: queryLayers } }],
              },
            },
          },
        },
      };
    } else if (version < 7) {
      switch (mode) {
        case "term":
          query = { term: { id: val } };
          break;
        case "phrase":
          query = { match_phrase: { _all: val } };
          break;
        case "match":
          query = { match: { _all: { query: val, fuzziness: "AUTO" } } };
          break;
        default:
          query = { match: { _all: { query: val, fuzziness: "AUTO" } } };
      }
      queryFilter = {
        query: {
          bool: {
            must: [
              query,
              {
                bool: {
                  should: queryLayers,
                },
              },
            ],
          },
        },
      };
    } else {
      // Search for special char
      const specialChars = /[+\-=&|><!(){}[\]^"~*?:\\/]/g;
      const reWhiteSpace = new RegExp("/^s+$/");

      switch (mode) {
        case "term":
          query = { term: { id: val } };
          break;
        case "phrase":
          query = { match_phrase: { message: val } };
          break;
        case "match":
          if (specialChars.test(val)) {
            // escape special elasitc char with \\
            var escapeChar = val.replace(specialChars, "\\$&");

            query = { query_string: { query: escapeChar, fields: [] } };
          } else {
            query = { query_string: { query: val, fields: [] } };
          }
          break;
        default:
          query = { query_string: { query: val, fields: [] } };
      }
      // if val contains space, call should be made in multimatch
      if (reWhiteSpace.test(val)) {
        queryFilter = {
          query: {
            multi_match: {
              query,
              fields: [],
            },
          },
        };
      } else {
        queryFilter = {
          query: {
            bool: {
              must: [query],
            },
          },
        };
      }
    }
    return queryFilter;
  };

  /**
   * Private Method: _sendPrevious6ElasticsearchRequest
   *
   * request on elasticsearche version previous to 7
   * @deprecated
   */
  var _sendPrevious6ElasticsearchRequest = function (val, versionELS) {
    var sendQuery = true;
    var searchableLayers = $.grep(_searchableElasticsearchLayers, function (l, i) {
      return l.getVisible();
    });
    if (searchableLayers.length > 0 || (_searchparams.static && _elasticSearchDocTypes)) {
      var queryLayers = [];
      var currentExtent = _map.getView().calculateExtent(_map.getSize());
      var pe = ol.proj.transformExtent(currentExtent, _projection.getCode(), "EPSG:4326");
      for (var i = 0; i < searchableLayers.length; i++) {
        queryLayers.push({
          type: { value: searchableLayers[i].getSource().getParams()["LAYERS"] },
        });
      }
      if (_searchparams.static && _elasticSearchDocTypes) {
        var doctypes = _elasticSearchDocTypes.split(",");
        for (var i = 0; i < doctypes.length; i++) {
          queryLayers.push({ type: { value: doctypes[i] } });
        }
      }
      var query;
      var mode = _elasticSearchQuerymode;
      var queryFilter = "";
      if (val.substring(0, 1) === "#") {
        mode = "term";
        val = val.substring(1, val.length);
      }
      if (val.slice(0, 1) === '"') {
        sendQuery = false;
      }
      if (val.slice(0, 1) === '"' && val.slice(-1) === '"') {
        mode = "phrase";
        val = val.substring(1, val.length - 1);
        sendQuery = true;
      }
      if (_elasticSearchVersion === "1.4") {
        switch (mode) {
          case "term":
            query = { match: { _all: val } };
            break;
          case "phrase":
            query = { match_phrase: { _all: val } };
            break;
          case "match":
            query = {
              fuzzy_like_this: {
                like_text: val,
                max_query_terms: 12,
                fuzziness: 0.7,
              },
            };
            break;
          default:
            query = {
              fuzzy_like_this: {
                like_text: val,
                max_query_terms: 12,
                fuzziness: 0.7,
              },
            };
        }

        queryFilter = {
          query: {
            filtered: {
              query: query,
              filter: {
                and: {
                  filters: [{ or: { filters: queryLayers } }],
                },
              },
            },
          },
        };
      } else {
        switch (mode) {
          case "term":
            query = { term: { id: val } };
            break;
          case "phrase":
            query = { match_phrase: { _all: val } };
            break;
          case "match":
            query = { match: { _all: { query: val, fuzziness: "AUTO" } } };
            break;
          default:
            query = { match: { _all: { query: val, fuzziness: "AUTO" } } };
        }
        queryFilter = {
          query: {
            bool: {
              must: [
                query,
                {
                  bool: {
                    should: queryLayers,
                  },
                },
              ],
            },
          },
        };
      }

      if (_searchparams.bbox) {
        var geometryfield = _elasticSearchGeometryfield || "location";
        var geofilter = { geo_shape: {} };
        geofilter.geo_shape[geometryfield] = {
          shape: {
            type: "envelope",
            coordinates: [
              [pe[0], pe[3]],
              [pe[2], pe[1]],
            ],
          },
        };
        if (_elasticSearchVersion === "1.4") {
          queryFilter.query.filtered.filter.and.filters.push(geofilter);
        } else {
          queryFilter.query.bool.filter = geofilter;
        }
      }
      var contentType = "text/plain";
      if (parseFloat(_elasticSearchVersion) >= 6) {
        contentType = "application/json; charset=utf-8";
      }
      if (sendQuery) {
        // Fix IE9 "No transport error" with cors
        jQuery.support.cors = true;
        $.ajax({
          type: "POST",
          url: _elasticSearchUrl,
          crossDomain: true,
          data: JSON.stringify(queryFilter),
          dataType: "json",
          contentType: contentType,
          success: function (data) {
            _sourceEls.clear();
            var str = "";
            var format = new ol.format.GeoJSON();
            var nb = data.hits.hits.length;
            for (var i = 0, nb; i < nb && i < 5; i++) {
              var point = _shapeToPoint(data.hits.hits[i]._source.geometry);
              var geom = new ol.format.GeoJSON().readGeometry(
                data.hits.hits[i]._source.geometry
              );
              var geomtype = geom.getType();
              var action_click = "";
              var action_over = "";
              var title = data.hits.hits[i]._source.title;
              if (geomtype !== "Point") {
                var feature = new ol.Feature({
                  geometry: geom.transform("EPSG:4326", "EPSG:3857"),
                  title: title,
                });
                action_click = "mviewer.zoomToFeature('feature." + i + "');";
                feature.setId("feature." + i);
                _sourceEls.addFeature(feature);
                action_over = "mviewer.showFeature('feature." + i + "');";
              } else {
                action_click =
                  "mviewer.zoomToLocation(" +
                  point[0] +
                  "," +
                  point[1] +
                  ",14," +
                  _searchparams.querymaponclick +
                  ");";
                action_over =
                  "mviewer.flash(" + "'EPSG:4326'," + point[0] + "," + point[1] + ");";
              }
              if (_overLayers[data.hits.hits[i]._type]) {
                action_click +=
                  "mviewer.tools.info.queryLayer(" +
                  point[0] +
                  "," +
                  point[1] +
                  ",'EPSG:4326','" +
                  data.hits.hits[i]._type +
                  "','" +
                  data.hits.hits[i]._id +
                  "');";
                action_over =
                  "mviewer.flash(" + "'EPSG:4326'," + point[0] + "," + point[1] + ");";
              }

              str +=
                '<a class="elasticsearch list-group-item" href="#" ' +
                'onclick="' +
                action_click +
                '" ' +
                'onmouseover="' +
                action_over +
                '" ' +
                'title="(' +
                data.hits.hits[i]._type +
                ") " +
                $.map(data.hits.hits[i]._source, function (el) {
                  if (typeof el === "string") {
                    return el;
                  }
                }).join(", \n") +
                '">' +
                title +
                "</a>";
            }
            $(".elasticsearch").remove();
            if (nb > 0) {
              _showResults(str, "entities");
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            mviewer.alert(
              "Problème avec l'instance Elasticsearch.\n" +
                thrownError +
                "\n Désactivation du service.",
              "alert-warning"
            );
            _searchparams.features = false;
            _searchparams.static = false;
            $("#param_search_features span")
              .removeClass("mv-checked")
              .addClass("mv-unchecked");
          },
        });
      }
    }
  };

  /**
   * Private Method: _sendElasticsearchRequest
   *
   * val represent search value given
   */
  var _sendElasticsearchRequest = function (val) {
    // Keep previous elasticsearch call version
    // when only one elasticsearch
    if (
      typeof _elasticSearchVersion === "string" ||
      _elasticSearchVersion instanceof String
    ) {
      _sendPrevious6ElasticsearchRequest(val);
    }
    // New version configuration in <elasticsearchs>
    // Since ElasticSearch 7 DocType can not be used to search several layers data in same index
    else {
      let sendQuery = true;
      // We can have several layers with one elk index each
      let searchableLayers = $.grep(_searchableElasticsearchLayers, function (l, i) {
        return l.getVisible();
      });

      // send request only if at least one layer is searcheable or elastic search in standalone mode
      if (searchableLayers.length > 0 || _searchparams.static) {
        // clean previous search and feature
        $(".elasticsearch").remove();
        _sourceEls.clear();

        // for each layer searcheable and visible layer launch elk search
        for (callIndex = 0; callIndex < searchableLayers.length; callIndex++) {
          let layerId = searchableLayers[callIndex].values_.mviewerid;
          let mode = _elasticSearchQuerymode.get(layerId);
          let versionELS = parseFloat(_elasticSearchVersion.get(layerId));

          // # for term query https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
          if (val.substring(0, 1) === "#") {
            mode = "term";
            val = val.substring(1, val.length);
          }
          if (val.slice(0, 1) === '"') {
            sendQuery = false;
          }
          // value around " " means Phrase mode https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html
          if (val.slice(0, 1) === '"' && val.slice(-1) === '"') {
            mode = "phrase";
            val = val.substring(1, val.length - 1);
            sendQuery = true;
          }

          let queryFilter = buildQuery(versionELS, mode, val, null);

          // Only add geofilter if required in search params
          if (_searchparams.bbox) {
            var currentExtent = _map.getView().calculateExtent(_map.getSize());
            var projectedMapExtent = ol.proj.transformExtent(
              currentExtent,
              _projection.getCode(),
              _proj4326
            );
            var geometryfield = _elasticSearchGeometryfield.get(layerId) || "location";
            var geofilter = { geo_shape: {} };
            geofilter.geo_shape[geometryfield] = {
              shape: {
                type: "envelope",
                coordinates: [
                  [projectedMapExtent[0], projectedMapExtent[3]],
                  [projectedMapExtent[2], projectedMapExtent[1]],
                ],
              },
            };

            queryFilter.query.bool.filter = geofilter;
          }
          contentType = "application/json; charset=utf-8";
          if (sendQuery) {
            // Fix IE9 "No transport error" with cors
            jQuery.support.cors = true;
            $.ajax({
              type: "POST",
              url: _elasticSearchUrl.get(layerId),
              crossDomain: true,
              data: JSON.stringify(queryFilter),
              dataType: "json",
              contentType: contentType,
              success: function (data) {
                let str = "";
                let indexId = "";
                let mouseOverField = "";
                let titleDisplayKey = "id";
                var nb = data.hits.hits.length;
                let formatELS = new ol.format.GeoJSON();

                if (nb > 0) {
                  indexId = data.hits.hits[0]._index;
                  mouseOverField = _elasticSearchmouseoverfields.get(indexId).split(",");
                  titleDisplayKey = _elasticSearchdisplayfields.get(indexId).split(",");

                  // get format from conf but defaut GeoJSON
                  if (_elasticSearchGeomtype.get(indexId) === "WKT") {
                    formatELS = new ol.format.WKT();
                  }
                }

                for (var j = 0, nb; j < nb && j < 10; j++) {
                  let currentFeature = data.hits.hits[j];

                  let geom = formatELS.readGeometry(currentFeature._source.location);

                  let xyz = mviewer.getLonLatZfromGeometry(geom, _proj4326, zoom);

                  var title = "";
                  title += $.map(currentFeature._source, function (value, key) {
                    if (!mouseOverField.length || mouseOverField.includes(key)) {
                      if (typeof value === "string") {
                        return value;
                      }
                    }
                  }).join(" - ");

                  let action_click = "";

                  // always zoom on feature
                  let feature = new ol.Feature({
                    geometry: geom.transform(_proj4326, _map.getView().getProjection()),
                    title: title,
                  });
                  feature.setId("feature." + indexId + "." + j);
                  _sourceEls.addFeature(feature);

                  action_click +=
                    "mviewer.zoomToFeature('feature." + indexId + "." + j + "', 16);";

                  //If index has the same name than a mviewer layer make the query on layer
                  if (_overLayers[indexId]) {
                    _overLayers[indexId].searchid = _elasticSearchLinkid.get(indexId);
                    action_click +=
                      "mviewer.tools.info.queryLayer(" +
                      xyz.lon +
                      "," +
                      xyz.lat +
                      ",'" +
                      _proj4326 +
                      "','" +
                      indexId +
                      "','" +
                      currentFeature._source[_elasticSearchLinkid.get(indexId)] +
                      "');";
                  }

                  let action_over = "";

                  // if search not filter by current bbox
                  if (!_searchparams.bbox) {
                    //action_over = "mviewer.zoomToInitialExtent();";
                  }

                  action_over +=
                    "mviewer.flash(" +
                    "'" +
                    _proj4326 +
                    "'," +
                    xyz.lon +
                    "," +
                    xyz.lat +
                    ");";
                  str +=
                    '<a class="elasticsearch list-group-item" href="#" ' +
                    'onclick="' +
                    action_click +
                    '" ' +
                    'onmouseover="' +
                    action_over +
                    '" ' +
                    'title="' +
                    $.map(currentFeature._source, function (value, key) {
                      if (!titleDisplayKey.length || titleDisplayKey.includes(key)) {
                        if (typeof value === "string") {
                          return value;
                        }
                      }
                    }).join(" \n") +
                    '">' +
                    title +
                    "</a>";
                }

                if (nb > 0) {
                  _showResults(str, "entities");
                }
              },
              error: function (xhr, ajaxOptions, thrownError) {
                mviewer.alert(
                  "Problème avec l'instance Elasticsearch.\n" +
                    thrownError +
                    "\n Désactivation du service.",
                  "alert-warning"
                );
                _searchparams.features = false;
                _searchparams.static = false;
                $("#param_search_features span")
                  .removeClass("mv-checked")
                  .addClass("mv-unchecked");
              },
            });
          }
        }
      }
    }
  };
  /* appeler cette fonction à partir de init de mviewer après
        oLayer.queryable = ($(this).attr("queryable") == "true") ? true : false;*/

  var _configSearchableLayer = function (oLayer, params) {
    oLayer.searchid = params.searchid ? params.searchid : "search_id";
    oLayer.searchengine = params.searchengine ? params.searchengine : "elasticsearch";
    oLayer.fusesearchkeys = params.fusesearchkeys ? params.fusesearchkeys : "";
    oLayer.fusesearchresult = params.fusesearchresult ? params.fusesearchresult : "";
    oLayer.fusesearchthresold = params.fusesearchthresold
      ? params.fusesearchthreshold
      : "";
    return oLayer;
  };

  var _processSearchableLayer = function (oLayer) {
    var l = oLayer.layer;
    switch (oLayer.searchengine) {
      case "fuse":
        if (_searchableFuseLayers.indexOf(l) === -1) {
          _searchableFuseLayers.push(l);
        }
        var options = {
          shouldSort: true,
          threshold: parseFloat(oLayer.fusesearchthreshold) || 0.3,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 2,
          keys: oLayer.fusesearchkeys.split(","),
        };

        var layerSource = l.getSource();
        if (l.getSource().source) {
          /* clusters */
          layerSource = l.getSource().getSource();
        }
        var _listener = layerSource.on("change", function (event) {
          var source = event.target;
          if (source.getState() === "ready") {
            var features = source.getFeatures();
            if (features.length > 0) {
              var geojsonFormat = new ol.format.GeoJSON();
              var mapProj = _map.getView().getProjection();

              var j = [];

              features.forEach(function (feature) {
                var geojsonFeature = geojsonFormat.writeFeatureObject(feature);
                var prop = geojsonFeature.properties;
                if (feature.getGeometry()) {
                  var wgs84Geom = feature
                    .getGeometry()
                    .clone()
                    .transform(mapProj, "EPSG:4326");
                  prop.geometry = geojsonFormat.writeGeometryObject(wgs84Geom);
                  prop.fusesearchresult = oLayer.fusesearchresult;
                } else {
                  console.log(
                    "The following feature could not be indexed due to lack of geometry: ",
                    prop
                  );
                }
                j.push(prop);
              });

              var list = $.map(j, function (el) {
                return el;
              });
              _fuseSearchData[oLayer.id] = new Fuse(list, options);
              //remove listener when data is loaded
              ol.Observable.unByKey(_listener);
            }
          }
        });
        break;

      case "elasticsearch":
        _searchableElasticsearchLayers.push(l);
        break;
    }
  };

  var _init = function (configuration) {
    _map = mviewer.getMap();
    _sourceOverlay = mviewer.getSourceOverlay();
    _projection = mviewer.getProjection();
    _overLayers = mviewer.getLayers();
    var sparams = configuration.searchparameters || false;
    if (configuration.olscompletion) {
      _olsCompletionUrl = configuration.olscompletion.url;
      $("#adresse-attribution").text(configuration.olscompletion.attribution);
      _olsCompletionType = configuration.olscompletion.type || "geoportail";
    }
    // only one elastic index to stay compatible with older version
    if (configuration.elasticsearch) {
      _elasticSearchUrl = configuration.elasticsearch.url;
      _elasticSearchQuerymode = configuration.elasticsearch.querymode;
      _elasticSearchGeometryfield = configuration.elasticsearch.geometryfield;
      // @Deprecated not available after elastic search 7 version
      _elasticSearchDocTypes = configuration.elasticsearch.doctypes;
      _elasticSearchVersion = configuration.elasticsearch.version || "1.4";
      // common id between elasticsearch document types (_id)  and geoserver featureTypes
      _elasticSearchLinkid = configuration.elasticsearch.linkid || "featureid";
      _elasticSearchGeomtype = configuration.elasticsearch.geometryformat || "GeoJSON";
      _elasticSearchdisplayfields = configuration.elasticsearch.displayfields || "";
      _elasticSearchmouseoverfields = configuration.elasticsearch.mouseoverfields || "";
    }
    // multiple index only with elasticsearch > 7
    else if (configuration.elasticsearchs) {
      _elasticSearchUrl = new Map();
      _elasticSearchQuerymode = new Map();
      _elasticSearchGeometryfield = new Map();
      _elasticSearchVersion = new Map();
      _elasticSearchLinkid = new Map();
      _elasticSearchGeomtype = new Map();
      _elasticSearchdisplayfields = new Map();
      _elasticSearchmouseoverfields = new Map();

      if (configuration.elasticsearchs.elasticsearch.constructor === Array) {
        configuration.elasticsearchs.elasticsearch.forEach((elasticsearch, index) => {
          _elasticSearchUrl.set(elasticsearch.layer, elasticsearch.url);
          _elasticSearchQuerymode.set(elasticsearch.layer, elasticsearch.querymode);
          _elasticSearchGeometryfield.set(
            elasticsearch.layer,
            elasticsearch.geometryfield
          );
          _elasticSearchVersion.set(elasticsearch.layer, elasticsearch.version ?? "7");
          // common id between elasticsearch document types (_id)  and geoserver featureTypes
          _elasticSearchLinkid.set(
            elasticsearch.layer,
            elasticsearch.linkid ?? "featureid"
          );
          _elasticSearchGeomtype.set(
            elasticsearch.layer,
            elasticsearch.geometryformat ?? "GeoJSON"
          );
          _elasticSearchdisplayfields.set(
            elasticsearch.layer,
            elasticsearch.displayfields ?? ""
          );
          _elasticSearchmouseoverfields.set(
            elasticsearch.layer,
            elasticsearch.mouseoverfields ?? ""
          );
        });
      } else {
        let currentElkConfig = configuration.elasticsearchs.elasticsearch;
        _elasticSearchUrl.set(currentElkConfig.layer, currentElkConfig.url);
        _elasticSearchQuerymode.set(currentElkConfig.layer, currentElkConfig.querymode);
        _elasticSearchGeometryfield.set(
          currentElkConfig.layer,
          currentElkConfig.geometryfield
        );
        _elasticSearchVersion.set(
          currentElkConfig.layer,
          currentElkConfig.version ?? "7"
        );
        // common id between elasticsearch document types (_id)  and geoserver featureTypes
        _elasticSearchLinkid.set(
          currentElkConfig.layer,
          currentElkConfig.linkid ?? "featureid"
        );
        _elasticSearchGeomtype.set(
          currentElkConfig.layer,
          currentElkConfig.geometryformat ?? "GeoJSON"
        );
        _elasticSearchdisplayfields.set(
          currentElkConfig.layer,
          currentElkConfig.displayfields ?? ""
        );
        _elasticSearchmouseoverfields.set(
          currentElkConfig.layer,
          currentElkConfig.mouseoverfields ?? ""
        );
      }
    }

    if (!_olsCompletionUrl) {
      _searchparams.localities = false;
    }
    if (sparams && sparams.bbox && sparams.localities && sparams.features) {
      _searchparams.bbox = sparams.bbox === "true";
      _searchparams.localities = sparams.localities === "true";
      _searchparams.features = sparams.features === "true";
      _searchparams.static = sparams.static === "true";
      _searchparams.querymaponclick = sparams.querymaponclick === "true";
      _searchparams.closeafterclick = sparams.closeafterclick === "true";
    }

    if (_searchparams.localities === false && _searchparams.features === false) {
      $("#searchtool").remove();
    }
    if (_searchparams.bbox) {
      $("#param_search_bbox span").removeClass("mv-unchecked").addClass("mv-checked");
    }
    if (_searchparams.localities) {
      $("#param_search_localities span")
        .removeClass("mv-unchecked")
        .addClass("mv-checked");
    } else {
      $("#param_search_localities").remove();
    }
    if (_searchparams.features) {
      $("#param_search_features span").removeClass("mv-unchecked").addClass("mv-checked");
    } else {
      $("#param_search_features").remove();
    }

    if (_searchparams.features === false) {
      $("#searchparameters .searchfeatures").remove(".searchfeatures");
    }
    if (sparams.inputlabel) {
      var label = configuration.searchparameters.inputlabel;
      $("#searchfield").attr("placeholder", label).attr("title", label);
    }
    _searchparams.marker = sparams.marker ? sparams.marker === "true" || false : true;
    _initSearch();
  };

  /**
   *
   * @param {*} li
   */
  var _toggleParameter = function (li) {
    var span = $(li).find("span");
    var parameter = false;
    if (span.hasClass("mv-unchecked") === true) {
      span.removeClass("mv-unchecked").addClass("mv-checked");
      parameter = true;
    } else {
      span.removeClass("mv-checked").addClass("mv-unchecked");
    }
    switch (li.id) {
      case "param_search_bbox":
        _searchparams.bbox = parameter;
        break;
      case "param_search_localities":
        _searchparams.localities = parameter;
        break;
      case "param_search_features":
        _searchparams.features = parameter;
        break;
    }
  };

  /**
   *
   * @param {*} featureid
   */
  var _showFeature = function (featureid) {
    var feature = _sourceEls.getFeatureById(featureid).clone();
    _sourceOverlay.clear();
    _sourceOverlay.addFeature(feature);
  };

  /**
   *
   */
  var _clear = function () {
    if (_sourceEls && _sourceOverlay) {
      _sourceEls.clear();
      _sourceOverlay.clear();
    }
  };

  /**
   * Private Method: zoomToFeature
   *
   */
  var _zoomToFeature = function (featureid, zoom) {
    var feature = _sourceEls.getFeatureById(featureid).clone();
    _sourceEls.clear();
    _sourceOverlay.clear();
    _sourceOverlay.addFeature(feature);
    var boundingExtent = feature.getGeometry().getExtent();
    var duration = 2000;

    _map.getView().fit(boundingExtent, {
      size: _map.getSize(),
      padding: [0, $("#sidebar-wrapper").width(), 0, 0],
      duration: duration,
    });

    function clear() {
      _sourceOverlay.clear();
    }
    setTimeout(clear, duration * 2);
  };

  /**
   * Private Method: _triggerQueryMap
   * Trigger queryMap function with a (optionnal) delay.
   *
   * @param {Array} coordinate
   * @param {number} duration
   */
  const _triggerQueryMap = (coordinate, duration) => {
    setTimeout(() => {
      info.queryMap({
        coordinate: coordinate,
        pixel: _map.getPixelFromCoordinate(coordinate),
      });
    }, duration || 0);
  };

  /**
   * Public Method: animateToFeature
   * Animate to a feature with a given zoom level
   * @param {Array} coordinates - Array containing [longitude, latitude, zoom level]
   * @param {number} zoom - Zoom level
   * @param {Array} center - Array containing [center x coordinate, center y coordinate] (extent center)
   * @param {boolean} queryMap - Boolean to trigger queryMap (true to trigger)
   * @param {boolean} hideLeftPannel - Boolean to hide left panel (true to hide, false to display). Defaults to false
   */
  var _animateToFeature = (
    coordinates,
    zoom,
    center,
    queryMap,
    hideLeftPannel = false
  ) => {
    // Get the coordinates
    let lon = coordinates[0];
    let lat = coordinates[1];

    let mapView = _map.getView();
    let mapProjection = mapView.getProjection().getCode();
    let coordsForQueryMap = ol.proj.transform([lon, lat], _proj4326, mapProjection);

    _sourceOverlay.clear();

    let duration = 3000;

    mapView.animate({
      center: center,
      zoom: zoom,
      duration: duration,
    });

    if (queryMap) {
      _triggerQueryMap(coordsForQueryMap, duration + 100);
    }
    if (hideLeftPannel) {
      document.getElementById("wrapper").classList.add("toggled-2");
    }
  };

  /**
   * Private Method: _getCenterWithExtent
   * Get the center of a geometry extent
   * @param {geometry} geom - geometry to get the center from
   * @param {string} sourceProj - source projection of the geometry
   * @returns - center coordinates
   */
  var _getCenterWithExtent = (geom, sourceProj) => {
    let mapView = _map.getView();
    let mapProjection = mapView.getProjection().getCode();
    let extent = geom.getExtent();
    let viewExtent =
      sourceProj && sourceProj !== mapProjection
        ? ol.proj.transformExtent(extent, sourceProj, mapProjection)
        : extent;

    let center = ol.extent.getCenter(viewExtent);

    return center;
  };

  return {
    init: _init,
    configSearchableLayer: _configSearchableLayer,
    processSearchableLayer: _processSearchableLayer,
    toggleParameter: _toggleParameter,
    sendElasticsearchRequest: _sendElasticsearchRequest,
    options: _searchparams,
    showFeature: _showFeature,
    zoomToFeature: _zoomToFeature,
    animateToFeature: _animateToFeature,
    clear: _clear,
    clearSearchField: _clearSearchField,
    initSearchMarker: _initSearchMarker,
  };
})();
