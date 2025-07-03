const label = (function () {
  // Global variables
  let mviewerId, options, layerId, field, layer, source, isCluster, label, features;

  /**
   * Get config from config file
   */
  function _getConfig() {
    mviewerId = configuration.getConfiguration().application.id;
    options = mviewer.customComponents.label.config.options.mviewer[mviewerId];

    layerId = options.layer[0].layerId;
    field = options.layer[0].field;

    if (mviewer.getLayer(layerId) && mviewer.getLayer(layerId).layer) {
      layer = mviewer.getLayer(layerId).layer;
      source = layer.getSource();
      isCluster = source instanceof ol.source.Cluster;
      features =
        source instanceof ol.source.Cluster
          ? source.getSource().getFeatures()
          : source.getFeatures();
    }
  }

  /**
   * Label style
   */
  function _labelStyle(text, geometry) {
    const formattedText = _wrapText(text);

    const textStyle = new ol.style.Text({
      text: formattedText,
      font: options.layer[0].font || "10px Calibri,sans-serif",
      overflow: true,
      fill: new ol.style.Fill({
        color: options.layer[0].textColor || "black",
      }),
      stroke: new ol.style.Stroke({
        color: options.layer[0].strokeColor || "white",
        width: options.layer[0].width || 6,
      }),
      zIndex: 100,
      offsetX: options.layer[0].offsetX || 0,
      offsetY: options.layer[0].offsetY || 0,
    });

    const isPoint = geometry instanceof ol.geom.Point;
    const isLine = geometry instanceof ol.geom.LineString;
    if (isPoint) {
      textStyle.setTextAlign("left");
      textStyle.setTextBaseline("bottom");
    } else if (isLine) {
      textStyle.setPlacement("line");
    }

    return textStyle;
  }

  /**
   * Format a string by wrapping text without breaking words
   * @param str - The string to format
   * @returns A string with inserted line breaks
   */
  function _wrapText(str) {
    if (!str || str.length <= 30) return str || "";

    const words = str.split(" ");
    const lines = [];
    let line = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if ((line + " " + word).length <= 30) {
        line += " " + word;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);

    return lines.join("\n");
  }

  /**
   * Public Method: init
   */
  function init() {
    _getConfig();
    _addComponent();
    _addClickListener();
    // Update visibility on zoom level changes
    const view = mviewer.getMap().getView();
    view.on("change:resolution", _updateZoomVisibility);
    _updateZoomVisibility();
  }

  /**
   * Create the container for the label button
   */
  function _createLabelCheckboxContainer() {
    const labelLink = document.createElement("a");
    labelLink.dataset.layerid = layerId;
    labelLink.className = "label-tooltip";
    labelLink.href = "#";
    labelLink.id = `${layerId}-label-tooltip`;

    const zoomLabel = document.createElement("div");
    zoomLabel.dataset.layerid = layerId;
    zoomLabel.textContent = "Zoomer pour afficher les étiquettes";
    zoomLabel.id = `${layerId}-label-zoom`;

    const stateIcon = document.createElement("span");
    stateIcon.className = "state-icon mv-unchecked";

    const labelText = document.createElement("div");
    labelText.style.display = "inline";
    labelText.textContent = "Afficher les étiquettes";

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.className = "hidden";
    checkboxInput.value = "false";
    checkboxInput.id = `${layerId}-label-checkbox`;

    labelLink.appendChild(zoomLabel);
    labelLink.appendChild(stateIcon);
    labelLink.appendChild(labelText);
    labelLink.appendChild(checkboxInput);

    const colDiv = document.createElement("div");
    colDiv.className = "col-md-12";
    colDiv.appendChild(labelLink);

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.appendChild(colDiv);

    // Conversion DOM to jQuery
    return $(rowDiv);
  }

  /**
   * Create the component and add it to the custom control
   */
  function _addComponent() {
    if ($(`#${layerId}-label-tooltip`).length) {
      return;
    }

    const component = _createLabelCheckboxContainer();
    const targetDiv = $(`.mv-layer-options[data-layerid="${layerId}"]`);

    if (component && targetDiv) {
      targetDiv.prepend(component);
    } else {
      console.warn("targetDiv not found");
      return;
    }
  }

  /**
   * Add or remove label to style
   */
  function _updateFeatureStyle(feature, geometry, baseStyle, label) {
    const isChecked = _getLabelCheckboxValue();
    const isZoomThreshold = _isZoomThreshold();

    if (feature.hidden) {
      return;
    }

    if (!isChecked || !isZoomThreshold) {
      feature.setStyle(baseStyle);
      return;
    }

    const textStyle = _labelStyle(label, geometry);

    feature.setGeometry(geometry);

    let style = null;

    if (baseStyle instanceof ol.style.Style) {
      style = baseStyle;
    } else if (Array.isArray(baseStyle) && baseStyle[0] instanceof ol.style.Style) {
      style = baseStyle[0];
    } else {
      return;
    }

    feature.setStyle(
      new ol.style.Style({
        image: style?.getImage(),
        fill: style?.getFill(),
        stroke: style?.getStroke(),
        text: textStyle,
      })
    );
  }

  /**
   * Aggregation functions for clusters
   */

  /**
   * Get max value
   */
  function getMax(features) {
    let maxValue = 0;
    features.forEach((ft) => {
      const value = ft.get(field);
      if (typeof value === "number" && !isNaN(value)) {
        if (value > maxValue) {
          maxValue = value;
        }
      }
    });
    return maxValue;
  }

  /**
   * Get min value
   */
  function getMin(features) {
    let minValue = 0;
    features.forEach((ft) => {
      const value = ft.get(field);
      if (typeof value === "number" && !isNaN(value)) {
        if (value < minValue) {
          minValue = value;
        }
      }
    });
    return minValue;
  }

  /**
   * Get sum value
   */
  function getSum(features) {
    let sum = 0;
    features.forEach((ft) => {
      const value = ft.get(field);
      if (typeof value === "number" && !isNaN(value)) {
        sum += value;
      }
    });
    return sum;
  }

  /**
   * Get avg value
   */
  function getAverage(features) {
    let sum = 0;
    let count = 0;
    features.forEach((ft) => {
      const value = ft.get(field);
      if (typeof value === "number" && !isNaN(value)) {
        sum += value;
        count++;
      }
    });
    return count > 0 ? parseFloat((sum / count).toFixed(2)) : null; // Keep 2 decimals
  }

  /**
   * Check if attribute is numeric
   */
  function isNumericAttribute(features) {
    for (const ft of features) {
      const value = ft.get(field);
      if (value !== undefined && value !== null) {
        return typeof value === "number" && !isNaN(value);
      }
    }
    return false;
  }

  /**
   * Get label for clusters according to aggregation function
   */
  function getMethod(method, clusterFeatures) {
    if (method !== "count" && !isNumericAttribute(clusterFeatures)) {
      console.warn(`Attribute ${field} must be numeric for aggregation`);
      return;
    }

    let label;
    switch (method) {
      case "avg":
        label = `moyenne = ${getAverage(clusterFeatures)}`;
        break;
      case "count":
        label = `compte = ${clusterFeatures.length}`;
        break;
      case "max":
        label = `max = ${getMax(clusterFeatures)}`;
        break;
      case "min":
        label = `min = ${getMin(clusterFeatures)}`;
        break;
      case "sum":
        label = `somme = ${getSum(clusterFeatures)}`;
        break;
      default:
        console.warn(`Unknown method: ${method}`);
        break;
    }

    return label;
  }

  /**
   * Show or remove labels based on the button state
   */
  function _updateStyle() {
    _getConfig();

    const isVisible = layer?.getVisible() ?? false;
    if (!isVisible) return;

    if (isCluster) {
      layer
        .getSource()
        .getFeatures()
        .forEach((cluster) => {
          const clusterFeatures = cluster.get("features") || [];
          const baseStyles = [].concat(layer.getStyle()?.(cluster) || []);
          const clusterGeometry = cluster.getGeometry();
          const method = options.layer[0].method;

          if (method) {
            label = getMethod(method, clusterFeatures);
          } else {
            label = clusterFeatures[0].get(field) || "N/A";
          }

          baseStyles.forEach((style) => {
            _updateFeatureStyle(cluster, clusterGeometry, style, label);
          });
        });
    } else {
      features.forEach((ft) => {
        let geometry = ft.getGeometry();
        if (geometry instanceof ol.geom.MultiPolygon) {
          geometry = _getLargestMultiPolygon(geometry);
        } else if (geometry instanceof ol.geom.MultiLineString) {
          geometry = _getLongestMultiLine(geometry);
        }

        const baseStyle =
          typeof layer.getStyle() === "function"
            ? layer.getStyle()(ft)
            : layer.getStyle();

        const label = ft.get(field) || "N/A";

        _updateFeatureStyle(ft, geometry, baseStyle, label);
      });
    }
  }

  /**
   * If multipolygon, find the largest polygon to apply the label
   */
  function _getLargestMultiPolygon(geometry) {
    let polygons = geometry.getPolygons();
    let maxArea = 0;
    let largestPolygon = null;

    polygons.forEach((polygon) => {
      let area = polygon.getArea();
      if (area > maxArea) {
        maxArea = area;
        largestPolygon = polygon;
      }
    });
    return largestPolygon;
  }

  /**
   * If multiline, find the longest line to apply the label
   */
  function _getLongestMultiLine(geometry) {
    let lines = geometry.getLineStrings();
    let maxLength = 0;
    let longestLine = null;

    lines.forEach((line) => {
      let length = line.getLength();
      if (length > maxLength) {
        maxLength = length;
        longestLine = line;
      }
    });
    return longestLine;
  }

  /**
   * Event listeners: checkbox + custom control + add layer
   */
  function _addClickListener() {
    _getConfig();

    $(`#${layerId}-label-tooltip`).on("click", function () {
      _updateCheckbox();
      _updateStyle();
    });

    $(`[data-layerid="${layerId}"]`).on("click", function () {
      _updateStyle();
    });

    $(`.mv-nav-item[data-layerid="${layerId}"]`).on("click", function () {
      init();
    });

    mviewer
      .getMap()
      .getView()
      .on("change:resolution", function () {
        setTimeout(() => {
          _updateStyle();
          if (_isZoomThreshold() && _getLabelCheckboxValue()) {
            _updateStyle();
          }
        }, 100);
      });
  }

  /**
   * Update checkbox value
   */
  function _updateCheckbox() {
    const checkbox = $(`#${layerId}-label-checkbox`);
    const stateIcon = $(`#${layerId}-label-tooltip .state-icon`)[0];

    const isChecked = !checkbox.prop("checked");
    checkbox.prop("checked", isChecked);

    const iconClass = isChecked
      ? "state-icon far glyphicon glyphicon-chevron-up mv-checked"
      : "state-icon far mv-unchecked glyphicon glyphicon-chevron-up";

    stateIcon.className = iconClass;
  }

  /**
   * Get checkbox value
   */
  function _getLabelCheckboxValue() {
    return $(`#${layerId}-label-checkbox`).prop("checked");
  }

  /**
   * Check if the zoom level has reached the threshold
   */
  function _isZoomThreshold() {
    const view = mviewer.getMap().getView();
    const zoomThreshold = options.layer[0].zoomThreshold || 13;
    const currentZoom = view.getZoom();
    const isZoomThreshold = currentZoom >= zoomThreshold;
    return isZoomThreshold;
  }

  /**
   * Update label visibility depending on zoom
   */
  function _updateZoomVisibility() {
    const isZoomThreshold = _isZoomThreshold();

    const span = $(`#${layerId}-label-tooltip span`);
    const div = $(`#${layerId}-label-tooltip div`);
    if (div && span) {
      div.css("display", isZoomThreshold ? "inline-block" : "none");
      span.css("display", isZoomThreshold ? "inline-block" : "none");
    }

    const labelCheckbox = $(`#${layerId}-label-checkbox`);
    if (labelCheckbox && !isZoomThreshold) {
      labelCheckbox.checked = false;
    }

    const zoomLabel = $(`#${layerId}-label-zoom`);
    if (zoomLabel) {
      zoomLabel.css("display", isZoomThreshold ? "none" : "inline-block");
    }
  }

  return {
    init: init,
    updateStyle: _updateStyle,
    updateCheckbox: _updateCheckbox,
  };
})();

new CustomComponent("label", label.init);
