var draw = (function () {
  // tools configuration
  var _config;

  var _map;

  var _wgs84Sphere = ol.sphere;

  var _vectorDraw;

  var _projection;

  var _sourceDraw;

  var _drawInt;

  var _snapInter;

  var _modifyInt;

  var _currentDrawType;

  var _currentFeature;

  /**
   * draw tool enabled.
   * @type {boolean}
   */
  var _modDrawEnabled = false;

  var _drawTooltips = [];

  /**
   * The help measure tooltip message.
   * @type {Element}
   */
  var _helpMeasureTooltipMessage;

  let _drawStyle = {
    Polygon: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#2e5367",
          width: 3,
        }),
        fill: new ol.style.Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: "white",
          }),
          stroke: new ol.style.Stroke({
            color: "#2e5367",
            width: 3,
          }),
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
        stroke: new ol.style.Stroke({
          color: "#2e5367",
          width: 3,
        }),
        fill: new ol.style.Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: "white",
          }),
          stroke: new ol.style.Stroke({
            color: "#2e5367",
            width: 3,
          }),
        }),
      }),
    ],
    Point: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: "rgba(128, 128, 128, 0.1)",
        }),
        stroke: new ol.style.Stroke({
          color: "#2e5367",
          width: 2,
        }),
      }),
    }),
  };

  // drawing tools state
  var isDrawing = false;

  /**
   *  Create overlay
   * @returns
   */
  var _createDrawTooltip = function (feature) {
    // Creation of new HTML element
    let drawTooltipElt = document.createElement("div");
    drawTooltipElt.className = "drawTooltip";
    drawTooltipElt.setAttribute("id", "drawTooltip-" + feature.id_);
    drawTooltipElt.innerHTML = feature.getProperties().label;

    drawTooltip = new ol.Overlay({
      element: drawTooltipElt,
      offset: [0, -15],
      positioning: "bottom-center",
    });

    _map.addOverlay(drawTooltip);
    _drawTooltips[feature.id_] = drawTooltip;
  };

  /**
   * Handle pointer move used by measure tools.
   * @param {ol.MapBrowserEvent} evt
   */

  var _pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    console.log("update help message");
    /** @type {string} */
    var helpMsg = "Cliquer pour débuter la mesure";
    if (_currentFeature) {
      var geom = _currentFeature.getGeometry();
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = "Cliquer pour poursuivre le polygone";
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = "Cliquer pour poursuivre la ligne";
      }
    }
    _helpMeasureTooltipMessage.innerHTML = helpMsg;
    _helpMeasureTooltip.setPosition(evt.coordinate);
    $(_helpMeasureTooltipMessage).removeClass("hidden");
  };

  /**
   * Creates a new help tooltip
   */

  _createHelpTooltip = function () {
    if (_helpMeasureTooltipMessage) {
      _helpMeasureTooltipMessage.parentNode.removeChild(_helpMeasureTooltipMessage);
    }
    _helpMeasureTooltipMessage = document.createElement("div");
    _helpMeasureTooltipMessage.className = "tooltip hidden";
    _helpMeasureTooltip = new ol.Overlay({
      element: _helpMeasureTooltipMessage,
      offset: [15, 0],
      positioning: "center-left",
    });
    _map.addOverlay(_helpMeasureTooltip);
  };

  /**
   * Enable drawbutton
   */
  var _enableDrawTool = function () {
    document.getElementById("drawoptions").style.display = "block";
    document.getElementById("drawBtn").classList.add("active");
  };

  /**
   * Create infopanel link to drawing
   *
   * @param {*} type
   */
  var _createPanelInfo = function (type, placeholder) {
    let iconClass = type === "Point" ? "fas fa-map-pin" : "fas fa-draw-polygon";

    // Add HTML component modal to the DOM
    var panelInfo = [
      '<div id="drawingPanelInfo" draggable>',
      '<div class="header">',
      `<i class="${iconClass} icon-draw"></i>`,
      '<input id="drawingPanelInfoLabel" type="text" placeholder="',
      placeholder,
      '">',
      '<i id="drawingPanelTrash" disabled class="icon-draw clickable glyphicon glyphicon-trash" onclick="draw.clearFeature()";></i>',
      "</div>",
      '<div id="drawingPanelMesure" class="content">',
      "<p></p>",
      "</div>",
      '<div id="drawingPanelExport" class="footer">',
      '<button id="dpExportBtn" disabled onclick="draw.export();">Enregister le projet</button>',
      "</div>",
      "</div>",
    ].join("");

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
        document.getElementById("drawTooltip-" + _currentFeature.id_).innerHTML =
          inputUser;
        _currentFeature.set("label", inputUser);
      });
  };

  var _getNbPixelsBetweenTwoPoints = function (point1, point2) {
    // convert coord in pixel
    var pixel1 = _map.getPixelFromCoordinate(point1);
    var pixel2 = _map.getPixelFromCoordinate(point2);

    //  nb pixel between pixel
    var dx = pixel2[0] - pixel1[0];
    var dy = pixel2[1] - pixel1[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * one interaction by geometry type
   *
   * @param {*} type
   */
  var _addDrawInteraction = function (type) {
    console.log("ADD INTERACTION");

    // if interaction exist disabled it and change button style
    if (_currentDrawType == type) {
      document.getElementById("draw" + _currentDrawType).classList.remove("active");
      _map.removeInteraction(_drawInt);
      _currentDrawType = null;
      _map.removeInteraction(_snapInter);
      // _map.removeLayer(_snappingLayer);

      // TODO ? =>>  delete features on stop draw use
      // _deleteFeatureDraw();
    } else {
      if (_currentDrawType) {
        document.getElementById("draw" + _currentDrawType).classList.remove("active");
        _map.removeInteraction(_drawInt);
      }
      _currentDrawType = type;
      document.getElementById("draw" + _currentDrawType).classList.add("active");

      _drawInt = new ol.interaction.Draw({
        source: _sourceDraw,
        type: type,
        style: _drawStyle[type],
      });

      if (_config.snapLayerId && mviewer.getLayer(_config.snapLayerId)?.layer) {
        const snapSrc = mviewer.getLayer(_config.snapLayerId).layer.getSource();
        _snapInter = new ol.interaction.Snap({
          source: snapSrc,
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
          $(_helpMeasureTooltipMessage).addClass("hidden");
        });
      }

      _drawInt.on(
        "drawstart",
        function (evt) {
          console.log("on drawstart");

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
          geomFeature.on("change", function (event) {
            console.log("on change");

            let outputMeasureDraw;
            let position = geomFeature.getCoordinates();
            if (geomFeature.getType() === "Point") {
              outputMeasureDraw = ol.coordinate.toStringHDMS(ol.proj.toLonLat(position));
            } else if (geomFeature.getType() === "LineString") {
              outputMeasureDraw = _measureDrawFormatLength(geomFeature.getCoordinates());
            } else if (geomFeature.getType() === "Polygon") {
              outputMeasureDraw = _measureDrawFormatLength(
                geomFeature.getCoordinates()[0]
              );
              outputMeasureDraw = outputMeasureDraw.concat(
                " ",
                _measureDrawFormatArea(_currentFeature)
              );
            }
            document.getElementById("drawingPanelMesure").innerHTML = outputMeasureDraw;
            _drawTooltips[_currentFeature.id_].setPosition(position);
          });
        },
        this
      );

      _drawInt.on(
        "drawend",
        function (evt) {
          console.log("on drawend");

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
            }

            geometry = feature.getGeometry();
            let coordinatesLine =
              geometry.getType() === "LineString"
                ? geometry.getCoordinates()
                : geometry.getCoordinates()[0];
            // Create new empty array
            let newCoord = [];
            let start;
            let end;
            // calculate median coordinates for each segment
            for (let i = 0; i < coordinatesLine.length - 1; i++) {
              start = coordinatesLine[i];
              end = coordinatesLine[i + 1];

              // Add the first point to the array
              newCoord.push(start);

              // calculate median point coordinates
              var midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

              // Add the middle point to the array
              newCoord.push(midpoint);
            }
            // Then, add the last point
            newCoord.push(end);

            // Set new coordinates to the feature
            feature
              .getGeometry()
              .setCoordinates(
                geometry.getType() === "LineString" ? newCoord : [newCoord]
              );
          }

          if (type === "Point") {
            document.getElementById("drawingPanelMesure").innerHTML =
              ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinates));
          }

          if (_config.singleDraw == "true") {
            _map.removeInteraction(_drawInt);
            document.getElementById("draw" + _currentDrawType).classList.remove("active");
            _currentDrawType = null;
            isDrawing = false;
          }
        },
        this
      );
    }
  };

  /**
   * Export feature
   */
  var _exportFeatures = function () {
    const format = new ol.format.GeoJSON({ featureProjection: "EPSG:3857" });
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
   * measure format length output
   * @param {ol.geom.LineString} line
   * @return {string}
   */
  var _measureDrawFormatLength = function (coordinates) {
    var length = 0;

    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var c1 = ol.proj.transform(coordinates[i], _projection, "EPSG:4326");
      var c2 = ol.proj.transform(coordinates[i + 1], _projection, "EPSG:4326");
      length += _wgs84Sphere.getDistance(c1, c2);
    }
    var output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }

    return output;
  };

  /**
   * measure format Area output
   * @param {ol.geom.Polygon} polygon
   * @return {string}
   */

  var _measureDrawFormatArea = function (polygon) {
    var area = Math.abs(_wgs84Sphere.getArea(polygon.getGeometry()));
    var output;
    if (area < 0.0001) {
      output = 0;
    } else if (area < 10000) {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    } else if (area < 1000000) {
      output = Math.round((area / 10000) * 100) / 100 + " " + "ha";
    } else if (area >= 1000000) {
      output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    }

    return output;
  };

  var _deleteFeatureDraw = function () {
    _map.removeOverlay(_drawTooltips[_currentFeature.id_]);
    _sourceDraw.removeFeature(_currentFeature);
    $("#drawingPanelInfo").addClass("hidden");
  };

  var _clearToolDraw = function () {
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

    $("#drawoptions").hide();
    $("#drawingPanelInfo").addClass("hidden");
    if (document.getElementById("inputButton")) {
      inputButton.value = "";
    }
  };

  // Clear all element add on the map
  var _clearOldDraw = function () {
    _sourceDraw.clear();
    $(".tooltip-measure-static").remove();
  };

  /**
   * _resetToolDraw. used to reset this tool
   */
  var _resetToolDraw = function () {
    _clearOldDraw();
    _map.removeInteraction(_drawInt);
    _map.removeInteraction(_modifyInt);
    // loop on all overlay
    for (const drawTooltip of _drawTooltips) {
      _map.removeOverlay(drawTooltip);
    }
    _modDrawEnabled = false;
    _clearToolDraw();
  };

  /**
   * Public Method: _toggle exported as toggle
   *
   * Description
   **/
  var _toggle = function () {
    if (_modDrawEnabled) {
      // If the module draw is active
      mviewer.unsetTool("draw");
    } else {
      // If the module draw is not active
      mviewer.setTool("draw");
    }
  };

  /**
   * Several type of drawing are possible Polygon, LineString or Point
   * If no geometry type given, all drawing type are available
   * geometryTypes should be a String with types separeted with coma ,
   * @param {} geometryTypes
   */
  var _initButtons = function () {
    const availableTypes = ["Point", "LineString", "Polygon"];
    let defaultTypes = ["Point", "LineString"];
    let types = defaultTypes;

    if (_config.geometryTypes) {
      types = _config.geometryTypes.replace(" ", "").split(",");
      if (!types || types.length == 0) {
        types = defaultTypes;
      }
    }
    let button, buttonOptions;

    // If only one geom create only one button ( if value is correct )
    if (types.length == 1 && types.every((item) => availableTypes.includes(item))) {
      button = [
        '<button class="mv-modetools btn btn-default btn-raised" href="#"',
        " onclick=\"draw.addDrawInteraction('",
        types[0],
        '\');" id="draw',
        types[0],
        '" title="Dessiner" i18n="draw.button.main"',
        ' tabindex="118 " accesskey="4">',
        '<i class="fas fa-pencil-ruler"></i>',
        "</button>",
      ].join("");
    } else {
      // create master draw button to access other
      button = [
        '<button class="mv-modetools btn btn-default btn-raised" href="#"',
        ' onclick="mviewer.tools.draw.toggle();" id="drawBtn" title="Dessiner" i18n="draw.button.main"',
        ' tabindex="118 " accesskey="4">',
        '<i class="fas fa-pencil-ruler"></i>',
        "</button>",
      ].join("");

      // loop on types to create button
      buttonOptions = [
        '<div id="drawoptions" style="display:none;" class="btn-group btn-group-sm"',
        ' role="group" aria-label="true">',
      ].join("");

      for (const type of types) {
        if (type === "Point") {
          buttonOptions = [
            buttonOptions,
            '<button id="drawPoint" title="Point" i18n="draw.button.point"',
            ' class="btn btn-default button-tools btn-raised" onclick="draw.addDrawInteraction(\'Point\');">',
            '<i class="fas fa-map-pin"></i>',
            "</button>",
          ].join("");
        }
        if (type === "LineString") {
          buttonOptions = [
            buttonOptions,
            '<button id="drawLineString" title="Trajet ou Polygone"',
            ' class="btn btn-default button-tools btn-raised" i18n="draw.button.line" onclick="draw.addDrawInteraction(\'LineString\');">',
            '<i class="fas fa-bezier-curve"></i>',
            "</button>",
          ].join("");
        }
        if (type === "Polygon") {
          buttonOptions = [
            buttonOptions,
            '<button id="drawPolygon" title="Polygone"',
            ' class="btn btn-default button-tools btn-raised" i18n="draw.button.polygon" onclick="draw.addDrawInteraction(\'Polygon\');">',
            '<i class="fas fa-draw-polygon"></i>',
            "</button>",
          ].join("");
        }
      }
      // close
      buttonOptions = [buttonOptions, "</div>"].join("");
    }

    $("#toolstoolbar").append(button);
    $(buttonOptions).insertAfter("#toolstoolbar");
  };

  /** Initialisation of drawing tools
   *
   * This function loaded specific configuration from <tools><draw> section of xml configuration
   * Create necessary layer, interaction and button depending on configuration
   *
   */
  var _initDrawTool = function () {
    // Get specific configuration
    _config = configuration.getConfiguration().tools.draw;
    _map = mviewer.getMap();
    _projection = mviewer.getProjection().getCode(); // For change the projection if necessary
    _sourceDraw = new ol.source.Vector(); // New source

    _vectorDraw = new ol.layer.Vector({
      // New vector
      source: _sourceDraw,
      style: function (feature) {
        return _drawStyle[feature.getGeometry().getType()];
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
      document.getElementById("drawingPanelInfoLabel").value =
        _currentFeature.getProperties().label;
    });

    _modifyInt.on("modifyend", function (e) {
      // enable delete and export once feature is created
      document.getElementById("drawingPanelTrash").disabled = false;
      document.getElementById("dpExportBtn").disabled = false;
    });

    // initialize buttons
    _initButtons();
  };

  return {
    init: _initDrawTool,
    enable: _enableDrawTool,
    toggle: _toggle,
    disable: _resetToolDraw,
    addDrawInteraction: _addDrawInteraction,
    clearFeature: _deleteFeatureDraw,
    export: _exportFeatures,
  };
})();
