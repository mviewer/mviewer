/**
 * @module panoramax
 * @description
 * This module provides a custom component for mviewer that allows users to interact with Panoramax
 * pictures. It shows as a topLayer Panoramax pictures availability, and at map click, opens the
 * interactive picture viewer.
 */

var panoramax = (function () {
  var _map;
  var _url;
  var _projection;
  var _panoramaxBtn;
  var _config;
  var _pnxLayer;
  var _pnxLayerId = "panoramax";
  var _pnxLayerEnabled;
  var _pnxClickEventId;
  var _pnxDblClickEventId;
  var _pnxViewer;
  var _pnxViewerContainer;
  var _pnxViewerCloseBtn;
  var _pnxViewerExpandBtn;
  var _pnxPicMarker;
  var _pnxPicMarkerLayer;
  var _delayMapRender;
  var _glStyle;
  var _pnxMapFilters;
  var _pnxMapFiltersContainer;
  var _pnxMapFiltersMenu;

  /**
   * Initialize the component
   */
  var _initpanoramax = () => {
    _config = mviewer.customComponents.panoramax.config.options.panoramax;
    _url = _config.url;
    _map = mviewer.getMap();
    _projection = _map.getView().getProjection();
    _initToolbarBtn();
    _initPhotoViewer();
  };

  /**
   * Create the toolbar button
   */
  var _initToolbarBtn = () => {
    var button = [
      '<button id="panoramaxBtn" title href="#" type="button" class="btn btn-light" data-original-title="Panoramax" data-toggle="tooltip">' +
        '<span class="fas fa-street-view"></span>' +
        "</button>",
    ].join("");
    $("#toolstoolbar").append(button);

    _panoramaxBtn = document.getElementById("panoramaxBtn");
    _panoramaxBtn?.addEventListener("click", _toggleMapLayer);
  };

  /**
   * Create the photo viewer widget
   */
  var _initPhotoViewer = () => {
    _pnxViewerContainer = document.getElementById("panoramaxPhotoViewerContainer");
    _pnxViewer = document.getElementById("panoramaxPhotoViewer");
    if (!_pnxViewer) {
      console.error("Panoramax photo viewer is not available");
      return;
    }
    _pnxViewer.setAttribute("endpoint", _url + "/api");

    // Picture toolbar
    _pnxViewerCloseBtn = document.getElementById("panoramaxClose");
    _pnxViewerCloseBtn.addEventListener("click", () => _showPictureInViewer());
    _pnxViewerExpandBtn = document.getElementById("panoramaxFullscreen");
    _pnxViewerExpandBtn.addEventListener("click", () =>
      document
        .getElementById("panoramaxPhotoViewerContainer")
        ?.classList.toggle("pnx-mv-full")
    );
    if (window.innerWidth < 768) {
      document
        .getElementsByClassName("pnx-mv-toolbar")[0]
        ?.setAttribute("slot", "top-left");
      document.getElementsByTagName("pnx-widget-player")[0]?.setAttribute("slot", "top");
    }

    // Picture events
    _pnxViewer.addEventListener("psv:picture-loading", (e) => {
      _updateGoToPnxLink(e.detail.picId, { x: e.detail.x, y: e.detail.y, z: e.detail.z });
      if (_pnxLayerEnabled) {
        _changePicMarker(true, [e.detail.lon, e.detail.lat], e.detail.x);
      }
    });
    _pnxViewer.addEventListener("psv:picture-loaded", (e) => {
      _updateGoToPnxLink(e.detail.picId, { x: e.detail.x, y: e.detail.y, z: e.detail.z });
      if (_pnxLayerEnabled) {
        _changePicMarker(true, [e.detail.lon, e.detail.lat], e.detail.x);
      }
    });
    _pnxViewer.addEventListener("psv:view-rotated", (e) => {
      _updateGoToPnxLink(_pnxViewer.psv.getPictureId(), {
        x: e.detail.x,
        y: e.detail.y,
        z: e.detail.z,
      });
      _changePicMarker(null, null, e.detail.x);
    });

    // Drag
    $("#panoramaxPhotoViewerContainer").easyDrag({
      handle: $("#panoramaxDrag"),
      container: $("#panoramaxDragContainer"),
    });

    // Sizing
    if (Array.isArray(_config?.picture_size) && _config.picture_size.length == 2) {
      _pnxViewerContainer.style.width = _config.picture_size[0];
      _pnxViewerContainer.style.height = _config.picture_size[1];
    }

    // Position
    if (_config?.picture_position) {
      _pnxViewerContainer.style.top = _config.picture_position?.top || "unset";
      _pnxViewerContainer.style.bottom = _config.picture_position?.bottom || "unset";
      _pnxViewerContainer.style.right = _config.picture_position?.right || "unset";
      _pnxViewerContainer.style.left = _config.picture_position?.left || "unset";
    }

    // Sidebar toggling
    if (window.innerWidth >= 768) {
      _onSidebarToggle();
      new ResizeObserver(_onSidebarToggle).observe(
        document.getElementById("sidebar-wrapper")
      );
    }
  };

  var _loadTilesJSON = (userId = null) => {
    const tilesUrl = userId
      ? _url + "/api/users/" + userId + "/map/style.json"
      : _url + "/api/map/style.json";

    fetch(tilesUrl).then((response) => {
      response.json().then((glStyle) => {
        _glStyle = glStyle;
        olms.applyStyle(_pnxLayer, glStyle);

        // Apply default filters from config if any
        if (_pnxMapFilters) {
          _onMapFiltersChange();
        } else if (_config?.filters) {
          _onMapFiltersChange(true);
        }
      });
    });
  };

  /**
   * Create map layer (tiles + picture symbol)
   */
  var _initMapLayer = () => {
    _pnxLayer = new ol.layer.VectorTile({ declutter: true });

    // Get style JSON (general or user-specific)
    _loadTilesJSON(_config?.filters?.user);

    // Create marker for showing selected picture
    _pnxPicMarker = new ol.Feature({
      geometry: new ol.geom.Point([0, 0]),
    });
    _pnxPicMarkerLayer = new ol.layer.Vector({
      source: new ol.source.Vector({ features: [_pnxPicMarker] }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          // Original image @ https://gitlab.com/panoramax/clients/web-viewer/-/blob/develop/src/img/marker_blue.svg
          src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQ4IgogICBoZWlnaHQ9IjQ4IgogICB2aWV3Qm94PSIwIDAgMTIuNyAxMi43IgogICB2ZXJzaW9uPSIxLjEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHBhdGgKICAgICBkPSJNLTMuMDA3LS4wMDVhNS45NzggNS45NzggMCAwIDEtNS45NzkgNS45NzhWLS4wMDV6IgogICAgIHN0eWxlPSJmaWxsOiMxYTIzN2U7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmY7c3Ryb2tlLXdpZHRoOjAuNjYxNDU4O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTEzNSkiLz4KICA8Y2lyY2xlCiAgICAgY3g9IjYuMzUiCiAgICAgY3k9IjYuNTQ1IgogICAgIHI9IjIuNjQiCiAgICAgc3R5bGU9ImZpbGw6IzFlODhlNTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6MC42NjAwMjc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg==",
        }),
      }),
      visible: false,
      zIndex: 100,
    });

    // Add to map + listen to click
    _pnxLayerEnabled = true;
    new CustomLayer(_pnxLayerId, _pnxLayer);
    _map.addLayer(_pnxLayer);
    info.disable();
    _pnxClickEventId = _map.on("singleclick", _onCoverageClick);
    _pnxDblClickEventId = _map.on("dblclick", () => _showPictureInViewer());
    _map.addLayer(_pnxPicMarkerLayer);
    mviewer.alert(
      "L'interrogation des couches est désactivé lorsque Panoramax est actif",
      "alert-warning"
    );
  };

  /**
   * Create the map legend settings
   */
  var _initLegend = () => {
    mviewer.customControls[_pnxLayerId] = {
      init: async function () {
        // Filter display configs
        const noFilterDate =
          Array.isArray(_config?.show_filters) && !_config.show_filters.includes("date");
        const noFilterPictype =
          Array.isArray(_config?.show_filters) &&
          !_config.show_filters.includes("picture_type");
        const noFilterQS =
          Array.isArray(_config?.show_filters) &&
          !_config.show_filters.includes("quality_score");
        const noFilterUser =
          Array.isArray(_config?.show_filters) && !_config.show_filters.includes("user");

        // Wrapper for clean look in legend
        _pnxMapFiltersContainer = document.createElement("li");
        _pnxMapFiltersContainer.classList.add("list-group-item-pnx", "mv-layer-details"); //"list-group-item");
        _pnxMapFiltersContainer.innerHTML = `
          <div class="layerdisplay-title">
            <a>Panoramax</a>
            <a href="#" class="mv-layer-remove" aria-label="close"title="" i18n="theme.layers.remove" data-original-title="Supprimer">
              <i class="ri-close-large-line"></i>
            </a>
          </div>
          <div class="mv-layer-options">
            Cliquez sur les lignes oranges pour visualiser les photos. Retrouvez les options de filtre en cliquant sur la flèche ci-dessous.
          </div>
          <div class="mv-layer-options" style="display: none">
            <pnx-map-filters-menu
              id="pnx-map-filters-menu"
              ${noFilterDate ? "no-date" : ""}
              ${noFilterPictype ? "no-picture-type" : ""}
              ${noFilterQS ? "" : "quality-score"}
              ${noFilterUser ? "" : "user-search"}
            ></pnx-map-filters-menu>
          </div>
          <a href="#" aria-label="Options" onclick="mviewer.toggleLayerOptions(this);" i18n="theme.layers.options" class="icon-options" data-bs-original-title="Options">
              <i class="state-icon ri-arrow-down-line"></i>
          </a>
        `;

        // Bindings to look like native Panoramax map
        _pnxMapFiltersMenu = _pnxMapFiltersContainer.querySelector(
          "#pnx-map-filters-menu"
        );
        _pnxMapFiltersMenu._parent = _pnxViewer;
        _pnxMapFiltersMenu._parent._onMapFiltersChange = _onMapFiltersChange;

        if (_config?.filters) {
          _pnxMapFiltersMenu._onParentFilterChange(_config.filters);
          if (_config.filters?.user) {
            _pnxMapFiltersMenu.user = await _pnxViewer.api.getUserName(
              _config.filters.user
            );
            if (!_pnxMapFiltersMenu.user) {
              _pnxMapFiltersMenu.user = _config.filters.user;
            }
          }
        }

        _pnxMapFiltersMenu._onUserSearchResult = (e) => {
          if (e.detail) {
            e.target.classList.add("pnx-filter-active");
          } else {
            e.target.classList.remove("pnx-filter-active");
          }
          // Switch map tiles
          _loadTilesJSON(e.detail?.data ? e.detail?.data.id : undefined);
        };

        _pnxMapFiltersMenu._parent._showQualityScoreDoc = () =>
          window.open("https://docs.panoramax.fr/pictures-metadata/quality_score/");

        const _onMapZoom = () =>
          (_pnxMapFiltersMenu.showZoomIn = _map.getView().getZoom() < 7);

        _onMapZoom();
        _map.on("moveend", _onMapZoom);

        _pnxMapFiltersContainer
          .querySelector(".mv-layer-remove")
          ?.addEventListener("click", _toggleMapLayer);

        const layersList = document.getElementById("layers-container");
        layersList.insertBefore(_pnxMapFiltersContainer, layersList.firstChild);
      },

      destroy: function () {
        _pnxMapFiltersContainer.parentNode.removeChild(_pnxMapFiltersContainer);
      },
    };
  };

  /**
   * Toggle vector tiles on map.
   */
  var _toggleMapLayer = function () {
    // Layer exists : toggle its display
    if (_pnxLayer) {
      if (!_pnxLayerEnabled) {
        info.disable();
        _map.addLayer(_pnxLayer);
        _pnxLayerEnabled = true;
        if (_config?.show_filters !== false) {
          mviewer.customControls[_pnxLayerId].init();
          _pnxMapFiltersMenu.style.display = "block";
        }
        _pnxClickEventId = _map.on("click", _onCoverageClick);
      } else {
        _pnxLayerEnabled = false;
        _map.removeLayer(_pnxLayer);
        if (_pnxClickEventId?.listener) {
          _map.un("singleclick", _pnxClickEventId.listener);
          _map.un("dblclick", _pnxDblClickEventId.listener);
        }
        info.enable();
        if (_config?.show_filters !== false) {
          _pnxMapFiltersMenu.style.display = "none";
          mviewer.customControls[_pnxLayerId].destroy();
        }
        _showPictureInViewer();
      }
    }
    // Create layer
    else {
      _initMapLayer();
      if (_config?.show_filters !== false) {
        _initLegend();
        mviewer.customControls[_pnxLayerId].init();
      }
    }
  };

  /**
   * Change currently shown picture in photo viewer
   * @param {string} [picId] The picture UUID (null to hide)
   * @param {string} [seqId] The sequence UUID for this picture (optional, for faster retrieval)
   */
  var _showPictureInViewer = (picId, seqId) => {
    if (picId) {
      if (seqId) {
        _pnxViewer.setAttribute("sequence", seqId);
      } else {
        _pnxViewer.removeAttribute("sequence");
      }
      _pnxViewer.setAttribute("picture", picId);
      _pnxViewerContainer.style.display = "unset";
      _updateGoToPnxLink(picId, _pnxViewer.psv.getXYZ());
    } else {
      _pnxViewer.psv.stopSequence();
      _pnxViewerContainer.style.display = "none";
      _changePicMarker(false);
    }
  };

  /**
   * Change the "open on Panoramax" link
   */
  var _updateGoToPnxLink = (picid, xyz) => {
    const btn = document.getElementById("panoramaxOpen");
    if (!btn) {
      return;
    }

    btn.href = `${_url}/?pic=${picid}&xyz=${xyz.x}/${xyz.y}/${xyz.z}`;
  };

  /**
   * Handles map click over coverage layer.
   */
  var _onCoverageClick = function (evt) {
    let coordinates = _coordsTo4326(evt.coordinate);
    let bbox = _coordsToBbox(coordinates);

    // Search for features under click position
    _pnxLayer.getFeatures(evt.pixel).then((features) => {
      const searchOpts = {
        limit: 1,
        bbox: bbox.join(","),
      };

      const f = features?.shift();
      if (f) {
        const props = f.getProperties();
        if (props.layer === "pictures" && props.id) {
          searchOpts.ids = props.id;
        } else if (props.layer === "sequences" && props.id) {
          searchOpts.collections = props.id;
        }
      }

      // If picture ID is found from map, use it directly
      if (searchOpts.ids) {
        _showPictureInViewer(searchOpts.ids);
      }
      // Otherwise, launch API call to find best matching picture
      else {
        if (_map.getView().getZoom() >= 14) {
          searchOpts.sortby = "-ts";
        }

        // Make sure to use appropriate filters as well
        if (_pnxMapFilters?.pic_type) {
          searchOpts.filter =
            "field_of_view" + (_pnxMapFilters.pic_type === "flat" ? "<" : "=") + "360";
        }

        fetch(_url + "/api/search?" + new URLSearchParams(searchOpts).toString()).then(
          (response) => {
            response.json().then((pnxjson) => {
              const f = pnxjson?.features?.shift();
              if (f) {
                _showPictureInViewer(f.id, f.collection);
              } else {
                _showPictureInViewer();
              }
            });
          }
        );
      }
    });
  };

  /**
   * Reflects new settings on coverage layer
   * @param {boolean} [fromConfig=false] Read map filters from config.json file instead of HTML form
   */
  var _onMapFiltersChange = function (fromConfig = false) {
    // Get Maplibre style using Panoramax functions
    const mapFiltersMenu = document.getElementById("pnx-map-filters-menu");
    let { mapFilters, mapSeqFilters, mapPicFilters, reloadMapStyle } =
      Panoramax.utils.map.mapFiltersToLayersFilters(
        fromConfig
          ? _config?.filters
          : Panoramax.utils.map.mapFiltersFormValues(
              mapFiltersMenu,
              null,
              mapFiltersMenu.getAttribute("quality-score") === ""
            ),
        true
      );
    _pnxMapFilters = mapFilters;

    // Apply filter to current style
    const seqStyle = _glStyle.layers.find((l) => l["source-layer"] == "sequences");
    const picStyle = _glStyle.layers.find((l) => l["source-layer"] == "pictures");
    const gridStyleID = _glStyle.layers.findIndex((l) => l["source-layer"] == "grid");

    if (seqStyle) {
      seqStyle.filter = mapSeqFilters || undefined;
    }
    if (picStyle) {
      picStyle.filter = mapPicFilters || undefined;
    }
    if (gridStyleID >= 0) {
      let newType = "coef";
      if (mapFilters.pic_type) {
        newType =
          mapFilters.pic_type == "flat" ? "coef_flat_pictures" : "coef_360_pictures";
      }
      _glStyle.layers[gridStyleID] = Panoramax.utils.map.switchCoefValue(
        _glStyle.layers[gridStyleID],
        newType
      );
    }

    olms.applyStyle(_pnxLayer, _glStyle);
  };

  /**
   * Edit the currently selected picture marker.
   * If a parameter is not set, its state is not changed.
   * @param {boolean} [visible] True to make it visible, false to hide
   * @param {number[]} [coords] Map coordinates of picture as [lon, lat]
   * @param {number} [orientation] Picture orientation (in degrees, 0-360)
   */
  var _changePicMarker = function (visible, coords, orientation) {
    // Change coords
    if (coords) {
      const mapcoords = _coordsFrom4326(coords);
      _pnxPicMarker.getGeometry().setCoordinates(mapcoords);
      let pixel = _map.getPixelFromCoordinate(mapcoords);
      if (_config.map_position_offset) {
        pixel[0] += _config.map_position_offset?.[0];
        pixel[1] += _config.map_position_offset?.[1];
      }
      _map.getView().setCenter(_map.getCoordinateFromPixel(pixel));
      _map.getView().setZoom(17);
    }

    // Change orientation
    if (orientation !== null && orientation !== undefined) {
      _pnxPicMarkerLayer
        .getStyle()
        .getImage()
        .setRotation((orientation * Math.PI) / 180);

      // Hack to force map render to make rotation visible
      clearTimeout(_delayMapRender);
      _delayMapRender = setTimeout(() => _pnxPicMarkerLayer.changed(), 100);
    }

    // Change visibility
    if (visible || visible === false) {
      _pnxPicMarkerLayer.setVisible(visible);
    }
  };

  var _onSidebarToggleThrottler = null;

  /**
   * Handles drag area size change due to sidebar toggling.
   */
  var _onSidebarToggle = function () {
    clearTimeout(_onSidebarToggleThrottler);
    _onSidebarToggleThrottler = setTimeout(() => {
      const wrapper = document.getElementById("wrapper");
      const dragContainer = document.getElementById("panoramaxDragContainer");
      if (wrapper.className.includes("toggled")) {
        dragContainer.style.width = "calc(100% - 80px)";
      } else {
        dragContainer.style.width = "calc(100% - 280px)";

        // If viewer goes outside of window, move to left
        const offsets = _pnxViewerContainer.getBoundingClientRect();
        if (offsets.right > document.body.clientWidth) {
          _pnxViewerContainer.style.right = "10px";
          _pnxViewerContainer.style.left = `${
            document.body.clientWidth - 270 - offsets.width
          }px`;
        }
      }
    }, 50);
  };

  /**
   * Transforms map coordinates into EPSG:4326
   * @param {object} c Original map coordinates
   * @returns {number[]} [lon,lat] coordinates in WGS84
   */
  var _coordsTo4326 = function (c) {
    return ol.proj.transform(c, _projection.getCode(), "EPSG:4326");
  };

  /**
   * Transforms EPSG:4326 coordinates into map projection
   * @param {object} c Original WGS84 coordinates
   * @returns {number[]} [lon,lat] coordinates in map projection
   */
  var _coordsFrom4326 = function (c) {
    return ol.proj.transform(c, "EPSG:4326", _projection.getCode());
  };

  /**
   * Generate a bounding box based on coordinates.
   * The bbox allows to search more or less precisely based on map zoom.
   * @param {number[]} coordinate The map coordinates (in EPSG:4326)
   */
  var _coordsToBbox = function (coordinate) {
    const z = _map.getView().getZoom();
    const size = Math.min(0.1, Math.max(0.00005, 0.5 / Math.pow(2, z - 5)));

    return [
      coordinate[0] - size,
      coordinate[1] - size,
      coordinate[0] + size,
      coordinate[1] + size,
    ];
  };

  return {
    init: _initpanoramax,
  };
})();

new CustomComponent("panoramax", panoramax.init);
