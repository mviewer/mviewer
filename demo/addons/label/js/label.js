const label = (function () {
  // Variables globales
  let mviewerId, options, layerId, field, layer, source, isCluster, label;

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
   * style des étiquettes
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
   * Formate une chaîne de caractères en la découpant en lignes
   * de longueur maximale, sans couper les mots.
   *
   * @param str - La chaîne à formater.
   * @returns Une chaîne avec des retours à la ligne insérés.
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
    // Mettre à jour la visibilité lors des changements de résolution
    const view = mviewer.getMap().getView();
    view.on("change:resolution", _updateZoomVisibility);
    _updateZoomVisibility();
  }

  /**
   * Créer le container pour le bouton
   */
  function _createLabelCheckboxContainer() {
    // Créer l'élément <a> principal
    const labelLink = document.createElement("a");
    labelLink.dataset.layerid = layerId;
    labelLink.className = "label-tooltip";
    labelLink.href = "#";
    labelLink.id = `${layerId}-label-tooltip`;

    const zoomLabel = document.createElement("p");
    zoomLabel.dataset.layerid = layerId;
    zoomLabel.textContent = "Zoomer pour afficher les étiquettes";
    zoomLabel.id = `${layerId}-label-zoom`;

    // Icône d'état
    const stateIcon = document.createElement("span");
    stateIcon.className =
      "state-icon far mv-unchecked glyphicon glyphicon-chevron-up";

    // Texte visible
    const labelText = document.createElement("div");
    labelText.style.display = "inline";
    labelText.textContent = "Afficher les étiquettes";

    // Checkbox caché
    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.className = "hidden";
    checkboxInput.value = "false";
    checkboxInput.id = `${layerId}-label-checkbox`;

    // Ajouter les éléments dans <a>
    labelLink.appendChild(zoomLabel);
    labelLink.appendChild(stateIcon);
    labelLink.appendChild(labelText);
    labelLink.appendChild(checkboxInput);

    // Créer la structure d'encapsulation
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-12";
    colDiv.appendChild(labelLink);

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.appendChild(colDiv);

    return rowDiv;
  }

  /**
   * créer le component et l'ajouter dans le custom control
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
      console.warn("targetDiv introuvable");
      return;
    }
  }

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

    feature.setStyle(
      new ol.style.Style({
        image: baseStyle?.getImage(),
        fill: baseStyle?.getFill(),
        stroke: baseStyle?.getStroke(),
        text: textStyle,
      })
    );
  }

  /**
   * Fonctions d'agrégation pour les clusters
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
    return count > 0 ? parseFloat((sum / count).toFixed(2)) : null; // Garde 2 décimales
  }

  /**
   * Fonctions qui vérifie type = numérique
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

  function getMethod(method, clusterFeatures) {
    if (method !== "count" && !isNumericAttribute(clusterFeatures, field)) {
      console.warn(
        `L'attribut ${field} doit être numérique pour effectuer une agrégation`
      );
      return;
    }

    let label;
    switch (method) {
      case "avg":
        label = `moyenne = ${getAverage(clusterFeatures, field)}`;
        break;
      case "count":
        label = `count = ${clusterFeatures.length}`;
        break;
      case "max":
        label = `max = ${getMax(clusterFeatures, field)}`;
        break;
      case "min":
        label = `min = ${getMin(clusterFeatures, field)}`;
        break;
      case "sum":
        label = `somme = ${getSum(clusterFeatures, field)}`;
        break;
      default:
        console.warn(`Méthode inconnue : ${method}`);
        break;
    }

    return label;
  }

  /**
   * Afficher ou enlever les étiquettes en fonction du bouton
   */
  function _updateStyle() {
    _getConfig();

    const isVisible = layer?.getVisible() ?? false;
    if (!isVisible) return; // Évite des calculs inutiles si la couche est invisible

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

        // récupère le style de base
        const baseStyle =
          typeof layer.getStyle() === "function"
            ? layer.getStyle()(ft)
            : layer.getStyle();

        // récupère la valeur à afficher
        const label = ft.get(field) || "N/A";

        _updateFeatureStyle(ft, geometry, baseStyle, label);
      });
    }
  }

  /**
   * si c'est multipolygon
   * trouver le + grand polygone pour appliquer le label uniquement sur celui ci
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
   * si c'est multiline
   * trouver la + longue ligne pour appliquer le label uniquement sur celle ci
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
   * ecouteurs d'evmt : checkbox + custom control + add layer
   */
  function _addClickListener() {
    _getConfig();

    // clique sur a checkbox
    $(`#${layerId}-label-tooltip`).on("click", function () {
      // maj la checkbox
      _updateCheckbox();
      // maj le style
      _updateStyle();
    });

    // si custom control
    $(`[data-layerid="${layerId}"]`).on("click", function () {
      _updateStyle();
    });

    // si on ajoute la couche de puis la liste des couches
    $(`.mv-nav-item[data-layerid="${layerId}"]`).on("click", function () {
      init();
    });

    // pour les clusters car ils sont recalculés à chaque changement de zoom
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

  function _updateCheckbox() {
    const checkbox = $(`#${layerId}-label-checkbox`);
    const stateIcon = $(`#${layerId}-label-tooltip .state-icon`)[0]; // Récupérer l'élément DOM réel

    // Inverser la valeur de la checkbox
    const isChecked = !checkbox.prop("checked");
    checkbox.prop("checked", isChecked);

    // Mettre à jour la classe de l'icône en fonction de l'état de la checkbox
    const iconClass = isChecked
      ? "state-icon far glyphicon glyphicon-chevron-up mv-checked"
      : "state-icon far mv-unchecked glyphicon glyphicon-chevron-up";

    stateIcon.className = iconClass;
  }

  function _getLabelCheckboxValue() {
    return $(`#${layerId}-label-checkbox`).prop("checked");
  }

  /**
   * Indique si le niveau de zoom a atteint le seuil minimum défini
   */
  function _isZoomThreshold() {
    const view = mviewer.getMap().getView();
    const zoomThreshold = options.layer[0].zoomThreshold || 13;
    const currentZoom = view.getZoom();
    const isZoomThreshold = currentZoom >= zoomThreshold;
    return isZoomThreshold;
  }

  /**
   * MaJ la visibilité des étiquettes en fonction du zoom
   */
  function _updateZoomVisibility() {
    const isZoomThreshold = _isZoomThreshold();

    // Activer ou désactiver l'affichage de la checkbox
    const span = $(`#${layerId}-label-tooltip span`);
    const div = $(`#${layerId}-label-tooltip div`);
    if (div && span) {
      div.css("display", isZoomThreshold ? "inline-block" : "none");
      span.css("display", isZoomThreshold ? "inline-block" : "none");
    }

    // Ne pas toucher à l'état du switch si isVisible est vrai
    const labelCheckbox = $(`#${layerId}-label-checkbox`);
    if (labelCheckbox && !isZoomThreshold) {
      labelCheckbox.checked = false;
    }

    // Masquer ou afficher le paragraphe de zoom
    const zoomLabel = $(`#${layerId}-label-zoom`);
    if (zoomLabel) {
      zoomLabel.css("display", isZoomThreshold ? "none" : "block"); // Affiche le message si le zoom est trop faible
    }
  }

  return {
    init: init,
    updateStyle: _updateStyle,
    updateCheckbox: _updateCheckbox,
  };
})();

new CustomComponent("label", label.init);
