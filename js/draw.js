let draw = (function () {
  class DeleteOnRightClick extends ol.interaction.Draw {
    constructor(options) {
      super(options);

      this.handleEvent = function (mapBrowserEvent) {
        if (
          mapBrowserEvent.type === "pointerdown" &&
          mapBrowserEvent.originalEvent.button === 2
        ) {
          // Right-click event, delete the feature being drawn
          this.abortDrawing();
          return true;
        }

        return ol.interaction.Draw.prototype.handleEvent.call(this, mapBrowserEvent);
      };
    }
  }

  // tools configuration
  let _config;

  let _map;

  let _wgs84Sphere = ol.sphere;

  let _vectorDraw;

  let _projection;

  let _sourceDraw;

  let _drawInt;

  let _snapInter;

  let _modifyInt;

  let _currentDrawType;

  let _currentFeature;

  let _snappingLayer;

  let _modDrawEnabled = false;

  let _drawTooltips = [];

  let _helpTooltipMessage;

  let _helpTooltip;

  let _commonDrawStyle;

  /** Initialisation of drawing tools
   *
   * This function loaded specific configuration from <tools><draw> section of xml configuration
   * Create necessary layer, interaction and button depending on configuration
   *
   */
  let _initDrawTool = function () {
    // Get specific configuration
    _config = configuration.getConfiguration().tools.draw;
    _map = mviewer.getMap();
    _projection = mviewer.getProjection().getCode(); // For change the projection if necessary
    _sourceDraw = new ol.source.Vector(); // New source

    _commonDrawStyle = _drawStyleBase(_config);

    _vectorDraw = new ol.layer.Vector({
      // New vector
      source: _sourceDraw,
      style: function (feature) {
        return _commonDrawStyle[feature.getGeometry().getType()];
      },
    });
    _map.addLayer(_vectorDraw);

    // Add geometry modification on source
    _modifyInt = new ol.interaction.Modify({
      source: _sourceDraw,
    });
    _map.addInteraction(_modifyInt);

    _modifyInt.on("modifystart", function (e) {
      _currentFeature = e.features.getArray()[0];
      _createPanelInfo(
        _currentFeature.getGeometry().getType(),
        _currentFeature.getProperties().label
      );
      _measureGeometry(_currentFeature.getGeometry());
      document.getElementById("drawingPanelInfoLabel").value =
        _currentFeature.getProperties().label;
    });

    _modifyInt.on("modifyend", () => {
      // enable delete and export once feature is created
      _measureGeometry(_currentFeature.getGeometry());
      document.getElementById("drawingPanelTrash").disabled = false;
      document.getElementById("dpExportBtn").disabled = false;
    });
    // init snap layer
    _initSnappingLayer();
    // initialize buttons
    _initButtons();
  };

  /**
   * Several type of drawing are possible Polygon, LineString or Point
   * If no geometry type given, all drawing type are available
   * geometryTypes should be a String with types separeted with coma ,
   * @param {} geometryTypes
   */
  let _initButtons = function () {
    const availableTypes = ["Point", "LineString", "Polygon"];
    let defaultTypes = ["Point", "LineString"];
    let types = defaultTypes;

    // read wanted types from configuration
    if (_config.geometryTypes) {
      types = _config.geometryTypes.replace(" ", "").split(",");
      if (!types || types.length == 0) {
        types = defaultTypes;
      }
    }
    let button, buttonOptions;

    // If only one geom create only one button ( if value is correct )
    if (types.length == 1 && types.every((item) => availableTypes.includes(item))) {
      button = `
        <button class="mv-modetools btn btn-light" href="#"
         onclick="draw.addDrawInteraction('${types[0]}');mviewer.tools.draw.toggle();" id="draw${types[0]}" title="Dessiner" i18n="draw.button.main"
         tabindex="118 " accesskey="4">
        <i class="ri-pencil-ruler-2-line"></i>
        </button>`;
    } else {
      // create master draw button to access other
      button = `
        <button class="mv-modetools btn btn-light" href="#"
         onclick="mviewer.tools.draw.toggle();" id="drawBtn" title="Dessiner" i18n="draw.button.main"
         tabindex="118 " accesskey="44">
          <i class="ri-pencil-ruler-2-line"></i>
        </button>`;

      // loop on types to create button
      buttonOptions = ` <div id="drawoptions" style="display:none;" class="btn-group" role="group" aria-label="true">`;
      for (const type of types) {
        if (type === "Point") {
          buttonOptions = `
            ${buttonOptions}
            <button id="drawPoint" title="Point" i18n="draw.button.point"
             class="btn btn-light button-tools" onclick="draw.addDrawInteraction('Point');"
            >
              <i class="ri-map-pin-2-line"></i>
            </button>`;
        }
        if (type === "LineString") {
          buttonOptions = `
            ${buttonOptions}
            <button id="drawLineString" title="Trajet ou Polygone"
             class="btn btn-light button-tools" i18n="draw.button.line" onclick="draw.addDrawInteraction('LineString');">
            <i class="ri-guide-line"></i>
            </button>`;
        }
        if (type === "Polygon") {
          buttonOptions = `${buttonOptions}
            <button id="drawPolygon" title="Polygone"
             class="btn btn-light button-tools" i18n="draw.button.polygon" onclick="draw.addDrawInteraction('Polygon');">
              <i class="ri-shape-line"></i>
            </button>`;
        }
      }

      // close
      buttonOptions = [buttonOptions, "</div>"].join("");
    }

    $("#toolstoolbar").append(button);
    $(buttonOptions).insertAfter("#drawBtn");
  };

  /**
   * Public Method: _toggle exported as toggle
   *
   * Description
   **/
  let _toggle = function () {
    if (_modDrawEnabled) {
      // If the module draw is active
      // mviewer.unsetTool will launch draw.disable
      mviewer.unsetTool("draw");
    } else {
      // If the module draw is not active
      // mviewer.unsetTool will launch draw.enable
      mviewer.setTool("draw");
    }
  };

  /**
   * Enable drawbutton
   */
  let _enableDrawTool = function () {
    _modDrawEnabled = true;

    // if several geometry types
    if (document.getElementById("drawBtn")) {
      document.getElementById("drawBtn").classList.add("active");
    }
    // could be null if only on type of drawing
    if (document.getElementById("drawoptions")) {
      document.getElementById("drawoptions").style.display = "inline-flex";
    }
  };

  /**
   * _disableToolDraw. used to reset this tool
   */
  let _disableToolDraw = function () {
    _modDrawEnabled = false;

    // remove all interaction
    _map.removeInteraction(_drawInt);
    _map.removeInteraction(_modifyInt);

    // loop on all feature overlay
    for (const drawTooltip of _drawTooltips) {
      _map.removeOverlay(drawTooltip);
    }
    // remove help overlay and interaction
    _map.un("pointermove", _pointerMoveHandler);
    $(_helpTooltipMessage).addClass("hidden");
    _map.removeInteraction(_helpTooltip);

    // remove all drawned feature
    _sourceDraw.clear();
    _clearToolDraw();
  };

  /**
   * deleted selected feature from source and remove overlay ( help and name )
   */
  let _deleteSelectedFeatureDraw = function () {
    _map.removeOverlay(_drawTooltips[_currentFeature.id_]);
    if (_helpTooltip) {
      _map.removeInteraction(_helpTooltip);
    }
    _sourceDraw.removeFeature(_currentFeature);
    $("#drawingPanelInfo").addClass("hidden");
  };

  /**
   * remove all draw tool information from dom
   */
  let _clearToolDraw = function () {
    if (document.getElementById("drawBtn")) {
      document.getElementById("drawBtn").classList.remove("active");
    }
    if (document.getElementById("drawPoint")) {
      document.getElementById("drawPoint").classList.remove("active");
    }
    if (document.getElementById("drawLineString")) {
      document.getElementById("drawLineString").classList.remove("active");
    }
    if (document.getElementById("drawPolygon")) {
      document.getElementById("drawPolygon").classList.remove("active");
    }

    //TODO remove Jquery
    $("#drawoptions").hide();
    $("#drawingPanelInfo").addClass("hidden");

    if (document.getElementById("inputButton")) {
      document.getElementById("inputButton").value = "";
    }
  };

  let _drawStyleBase = (extConfig) => {
    const commonLineStroke = new ol.style.Stroke({
      color: extConfig?.lineStroke || "#2e5367",
      width: 3,
    });
    let commonPointStroke = new ol.style.Stroke({
      color: extConfig?.pointStroke || "#2e5367",
      width: 3,
    });
    const commonFill = new ol.style.Fill({
      color: "rgba(0, 0, 255, 0.1)",
    });
    const pointFill = new ol.style.Fill({
      color: extConfig?.pointFill || "rgba(0, 0, 255, 0.1)",
    });
    return {
      Polygon: [
        new ol.style.Style({
          stroke: commonLineStroke,
          fill: commonFill,
        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: pointFill,
            stroke: commonPointStroke,
          }),
          geometry: function (feature) {
            const coordinates = feature.getGeometry().getCoordinates()[0];
            if (coordinates.length > 2) {
              return new ol.geom.MultiPoint(coordinates);
            }
          },
        }),
      ],
      LineString: [
        new ol.style.Style({
          stroke: commonLineStroke,
          fill: commonFill,
        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: pointFill,
            stroke: commonPointStroke,
          }),
        }),
      ],
      Point: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: pointFill,
          stroke: commonPointStroke,
        }),
      }),
    };
  };

  /**
   *  Create overlay on given feature
   * @param {*} feature
   */
  let _createDrawTooltip = function (feature) {
    // Creation of new HTML element
    let drawTooltipElt = document.createElement("input");
    drawTooltipElt.className = "drawTooltip";
    drawTooltipElt.setAttribute("id", "drawTooltip-" + feature.id_);
    drawTooltipElt.setAttribute("oninput", "this.setAttribute('size',this.value.length)");
    drawTooltipElt.type = "text";
    drawTooltipElt.value = feature.getProperties().label;

    let drawTooltip = new ol.Overlay({
      element: drawTooltipElt,
      offset: [0, -15],
      positioning: "bottom-center",
    });

    _map.addOverlay(drawTooltip);

    drawTooltipElt.addEventListener("input", function () {
      document.getElementById("drawingPanelInfoLabel").value = drawTooltipElt.value;
      _currentFeature.set("label", drawTooltipElt.value);
    });

    _drawTooltips[feature.id_] = drawTooltip;
  };

  /**
   * Handle pointer move used to display help
   * @param {ol.MapBrowserEvent} evt
   */
  let _pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }

    /** @type {string} */
    let helpMsg = mviewer.lang
      ? mviewer.lang[mviewer.lang.lang]("draw.help.start")
      : "Cliquer pour débuter le dessin";
    if (_currentFeature) {
      let geom = _currentFeature.getGeometry();
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = "Cliquer pour poursuivre le polygone <BR/>";
        helpMsg += "Double cliquer pour finaliser le polygone";
        helpMsg = mviewer.lang
          ? mviewer.lang[mviewer.lang.lang]("draw.help.polygon")
          : helpMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = "Cliquer pour poursuivre la ligne<BR/>";
        helpMsg += "Double cliquer pour finaliser la ligne<BR/>";
        helpMsg += "Rapprocher vous du point d'origine pour faire un polygone<BR/>";
        helpMsg = mviewer.lang
          ? mviewer.lang[mviewer.lang.lang]("draw.help.linestring")
          : helpMsg;
      }
    }
    _helpTooltipMessage.innerHTML = helpMsg;
    _helpTooltip.setPosition(evt.coordinate);
    $(_helpTooltipMessage).removeClass("hidden");
  };

  /**
   * Creates a help tooltip
   */
  let _createHelpTooltip = function () {
    if (_helpTooltipMessage) {
      _helpTooltipMessage.remove();
    }
    _helpTooltipMessage = document.createElement("div");
    _helpTooltipMessage.className = "drawTooltip";
    _helpTooltip = new ol.Overlay({
      element: _helpTooltipMessage,
      offset: [15, 0],
      positioning: "center-left",
    });
    _map.addOverlay(_helpTooltip);
  };

  /**
   * Create infopanel link to drawing
   *
   * @param {*} type
   */
  let _createPanelInfo = function (type, placeholder) {
    let iconClass = type === "Point" ? "ri-map-pin-2-line" : "ri-shape-line";

    // Add HTML component modal to the DOM
    let panelInfo = `
      <div id="drawingPanelInfo" draggable>
        <div class="drawingPanel__header">          
          <div class="input-group">
            <span class="input-group-text"><i class="${iconClass} icon-draw"></i></span>
            <input type="text" class="form-control" id="drawingPanelInfoLabel" placeholder="${placeholder}">
            <a type="button" id="drawingPanelTrash" disabled class="icon-draw clickable btn btn-outline-secondary" title="Supprimer la géométrie" i18n="draw.button.delete" onclick="draw.clearFeature()"><i class="ri-delete-bin-line"></i></a>
          </div>
        </div>
        <div class="drawingPanel__body">
          <div id="drawingPanelPosition" class="content" />
          <div id="drawingPanelLength" class="content" />
          <div id="drawingPanelArea" class="content" />
          <div id="drawingPanelHelp" class="content" />
        </div>
        <div id="drawingPanelExport" class="drawingPanel__footer">
          <button id="dpExportBtn" i18n="draw.button.export" class="btn btn-primary btn-sm" disabled onclick="draw.export();">Enregister le projet</button>
        </div>
      </div>`;

    let existingPanelInfo = $("#drawingPanelInfo");
    if (existingPanelInfo.length) {
      existingPanelInfo.replaceWith(panelInfo);
    } else {
      $("#page-content-wrapper").append(panelInfo);
    }

    document
      .getElementById("drawingPanelInfoLabel")
      .addEventListener("input", function () {
        let inputUser = document.getElementById("drawingPanelInfoLabel").value;
        document.getElementById("drawTooltip-" + _currentFeature.id_).value = inputUser;
        _currentFeature.set("label", inputUser);
      });
  };

  /**
   *  Used to change LineString in Polygone
   *  calcul distance in pixel and not in meter.
   * @param {*} point1
   * @param {*} point2
   * @returns
   */
  let _getNbPixelsBetweenTwoPoints = function (point1, point2) {
    // convert coord in pixel
    let pixel1 = _map.getPixelFromCoordinate(point1);
    let pixel2 = _map.getPixelFromCoordinate(point2);

    //  nb pixel between pixel
    let dx = pixel2[0] - pixel1[0];
    let dy = pixel2[1] - pixel1[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * one interaction by geometry type
   *
   * @param {*} type
   */
  let _addDrawInteraction = function (type) {
    // if interaction exist disabled it and change button style
    if (_currentDrawType == type) {
      document.getElementById("draw" + _currentDrawType).classList.remove("active");
      _map.removeInteraction(_drawInt);
      _currentDrawType = null;
      _map.removeInteraction(_snapInter);
      if (_config.snapLayerUrl || _config.snapLayerId) {
        _map.removeLayer(_snappingLayer);
      }
    } else {
      if (_currentDrawType) {
        document.getElementById("draw" + _currentDrawType).classList.remove("active");
        _map.removeInteraction(_drawInt);
      }
      _currentDrawType = type;
      document.getElementById("draw" + _currentDrawType).classList.add("active");

      _drawInt = new DeleteOnRightClick({
        source: _sourceDraw,
        type: type,
        style: _commonDrawStyle[type],
      });

      const snapZoomValid = _config?.snapLimitZoom
        ? _map.getView().getZoom() >= parseInt(_config.snapLimitZoom)
        : true;
      if (_snappingLayer && snapZoomValid) {
        if (_config.snapLayerUrl) {
          _map.addLayer(_snappingLayer);
        }
        _snapInter = new ol.interaction.Snap({
          source: _snappingLayer.getSource(),
          option: {
            pixelTolerance: _config.snapTolerance ? _config.snapTolerance : "10",
          },
        });
        _map.addInteraction(_drawInt);
        _map.addInteraction(_snapInter);
      } else {
        _map.addInteraction(_drawInt);
      }

      // if tooltip help is wanted
      if (_config.help == "true") {
        _createHelpTooltip();
        _map.on("pointermove", _pointerMoveHandler);
        $(_map.getViewport()).on("mouseout", function () {
          $(_helpTooltipMessage).addClass("hidden");
        });
      }

      _drawInt.on(
        "drawstart",
        function (evt) {
          _currentFeature = evt.feature;
          let featureId = ol.util.getUid(_currentFeature);
          _currentFeature.setId(featureId);
          let geomFeature = _currentFeature.getGeometry(); // We get the geometry of the feature

          // create draw panel info
          let inputNameFeature =
            geomFeature.getType() === "Point" ? "Repère sans nom" : "Géometrie sans nom";
          _createPanelInfo(type, inputNameFeature);
          _currentFeature.set("label", inputNameFeature);

          // Create a tooltip for a feature
          _createDrawTooltip(_currentFeature);

          _drawTooltips[featureId].setPosition(geomFeature.getLastCoordinate());

          // Show measurement
          geomFeature.on("change", function () {
            let position = geomFeature.getLastCoordinate();
            _measureGeometry(geomFeature);
            _drawTooltips[_currentFeature.id_].setPosition(position);
          });
        },
        this
      );

      _drawInt.on("drawabort", _deleteSelectedFeatureDraw, this);

      _drawInt.on(
        "drawend",
        function (evt) {
          let feature = evt.feature;

          // enable delete and export once feature is created
          document.getElementById("drawingPanelTrash").disabled = false;
          document.getElementById("dpExportBtn").disabled = false;

          let geometry = feature.getGeometry();
          let type = feature.getGeometry().getType();
          let coordinates = geometry.getCoordinates();

          if (type === "LineString") {
            // create polygon from LineString if endpoint is closed enough
            if (
              _getNbPixelsBetweenTwoPoints(
                geometry.getFirstCoordinate(),
                geometry.getLastCoordinate()
              ) <= _config.nbPixelsToClosePolygon
            ) {
              let newGeometry = new ol.geom.Polygon([coordinates]);
              feature.setGeometry(newGeometry);
              _measureGeometry(newGeometry);
            }
          }

          if (type === "Point") {
            document.getElementById("drawingPanelPosition").innerHTML =
              ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinates));
          }

          if (_config.help == "true") {
            let helpMsg =
              "Pour modifier votre dessin, <BR/> maintenez le clique gauche enfoncé <BR/> sur l'endroit que vous souhaitez modifier <BR/>";
            helpMsg = mviewer.lang
              ? mviewer.lang[mviewer.lang.lang]("draw.help.panel")
              : helpMsg;
            document.getElementById("drawingPanelHelp").innerHTML = helpMsg;
          }

          if (_config.singleDraw == "true") {
            _map.removeInteraction(_drawInt);
            _map.un("pointermove", _pointerMoveHandler);
            $(_helpTooltipMessage).addClass("hidden");
            _map.removeInteraction(_helpTooltip);
            document.getElementById("draw" + _currentDrawType).classList.remove("active");
            _currentDrawType = null;
          }

          _map.addInteraction(_modifyInt);
          if (_snapInter) {
            _map.addInteraction(_snapInter);
          }
        },
        this
      );
    }
  };

  /**
   * Export feature
   */
  let _exportFeatures = function () {
    const format = new ol.format.GeoJSON({ featureProjection: _projection });
    const features = _sourceDraw.getFeatures();
    const json = format.writeFeatures(features);

    // Launch download
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "projet-dessin.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  /**
   * set position, length or area in dom depending on geom type
   * @param {*} geometry
   */
  let _measureGeometry = function (geometry) {
    if (geometry.getType() === "Point") {
      let position = geometry.getCoordinates();
      let outputMeasureDraw = ol.coordinate.toStringHDMS(ol.proj.toLonLat(position));
      document.getElementById("drawingPanelPosition").innerHTML = outputMeasureDraw;
    } else if (geometry.getType() === "LineString") {
      _measureDrawLength(geometry.getCoordinates());
    } else if (geometry.getType() === "Polygon") {
      _measureDrawLength(geometry.getCoordinates()[0]);
      _measureDrawArea(geometry);
    }
  };

  /**
   * measure format length output
   * @param {ol.geom.LineString} line
   * @return {string}
   */
  let _measureDrawLength = function (coordinates) {
    let length = 0;

    for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      let c1 = ol.proj.transform(coordinates[i], _projection, "EPSG:4326");
      let c2 = ol.proj.transform(coordinates[i + 1], _projection, "EPSG:4326");
      length += _wgs84Sphere.getDistance(c1, c2);
    }
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }

    let lineMsg = mviewer.lang
      ? mviewer.lang[mviewer.lang.lang]("draw.measure.line")
      : "Longueur : ";
    document.getElementById("drawingPanelLength").innerHTML = lineMsg + output;
    return output;
  };

  /**
   *
   * @param {*} geometry
   * @returns
   */
  let _measureDrawArea = function (geometry) {
    let area = Math.abs(
      _wgs84Sphere.getArea(geometry, { projection: _projection || "EPSG:3857" })
    );
    let output;
    if (area < 0.0001) {
      output = 0;
    } else if (area < 10000) {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    } else if (area < 1000000) {
      output = Math.round((area / 10000) * 100) / 100 + " " + "ha";
    } else if (area >= 1000000) {
      output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    }

    let AreaMsg = mviewer.lang
      ? mviewer.lang[mviewer.lang.lang]("draw.measure.area")
      : "Aire : ";
    document.getElementById("drawingPanelArea").innerHTML = AreaMsg + output;
    return output;
  };

  /**
   * Create snapping layer from snapLayerUrl or snapLayerId
   */
  let _initSnappingLayer = () => {
    if (_config.snapLayerUrl) {
      _snappingLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: (extent) => `${_config.snapLayerUrl}&bbox=${extent}`,
          format: new ol.format.GeoJSON(),
          strategy: ol.loadingstrategy.bbox,
        }),
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "rgba(46,83,103,0.6)",
            width: 1,
          }),
          fill: new ol.style.Fill({
            color: "rgba(0, 0, 0, 0)",
          }),
        }),
      });
    } else if (_config.snapLayerId) {
      _snappingLayer = mviewer.getLayer(_config.snapLayerId);
    }
  };

  return {
    init: _initDrawTool,
    enable: _enableDrawTool,
    toggle: _toggle,
    disable: _disableToolDraw,
    addDrawInteraction: _addDrawInteraction,
    clearFeature: _deleteSelectedFeatureDraw,
    export: _exportFeatures,
  };
})();
