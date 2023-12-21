const filter = (function () {
  /**
   * Property: _id
   * @type {String}
   */
  var _id = "";
  /**
   * Property: _visibleLayers
   *  @type {Map}
   */
  var _visibleLayers = new Map();
  /**
   * Property: _layersParams
   *  @type {Map}
   */
  var _layersFiltersParams = new Map();

  /**
   * Property: _visibleFeatures
   *  @type {Map}
   */
  var _visibleFeatures = new Map();

  /**
   *  Property: _currentSelectedLayer
   *  @type {String}
   */
  var _currentSelectedLayer = "";

  /**
   * PrepareLayer before create panel
   *
   */
  var _prepareReadyLayers = (layersParams) => {
    var layerId = "";
    var nbLayers = 0;
    layersParams.forEach((layer, i) => {
      layerId = layer.layerId;
      var mvLayer = mviewer.getLayer(layerId) ? mviewer.getLayer(layerId).layer : null;
      // Should never happens but we could check if layer.id not already exist in _layersParams
      if (mvLayer && mvLayer.getVisible()) _visibleLayers.set(layerId, layer.filter);
      _visibleFeatures.set(layerId, []);

      nbLayers++;
      if (
        !_currentSelectedLayer &&
        ((nbLayers == 1 && mvLayer && mvLayer.getVisible()) ||
          (mvLayer && mvLayer.getVisible()))
      ) {
        _currentSelectedLayer = layerId;
      }
    });
  };

  /**
   * Public Method: _initFilterTool exported as init
   *
   */
  var _initFilterTool = function (isLayerChange) {
    // get config for a specific mviewer
    var mviewerId = configuration.getConfiguration().application.id;
    var options = mviewer.customComponents.filter.config.options;
    if (mviewerId && options.mviewer && options.mviewer[mviewerId]) {
      mviewer.customComponents.filter.config.options = options.mviewer[mviewerId];
      options = mviewer.customComponents.filter.config.options;
    }
    // get filters by layer
    var layersParams = mviewer.customComponents.filter.config.options.layers;

    layersParams.forEach((layer) => {
      _layersFiltersParams.set(layer.layerId, layer.filter);
    });

    if (_layersFiltersParams.size > 0) {
      // wait map ready and prepare layers to avoid empty filter panel
      mviewer.getMap().once("rendercomplete", function (e) {
        _prepareReadyLayers(layersParams);
        _initFilterPanel();
      });

      //Add filter button to toolstoolbar
      var button = `
      <button id="filterbtn" class="btn btn-default btn-raised"
        onclick="filter.toggle();"  title="Filtrer les données" i18n="tbar.right.filter"
        tabindex="115" accesskey="f">
        <span class="glyphicon glyphicon-filter" aria-hidden="true">
        </span>
      </button>`;
      $("#toolstoolbar").prepend(button);
      $("#filterbtn").css("color", options.style.colorButton || "black");
    }

    // custom from config
    $("#filterTitle").text(options.title);
    _setStyle(isLayerChange == false ? false : true);
  };

  /**
   * Public Method: _initFilterPanel
   *
   * Recour au setTimeout car aucun event ne se déclenche correctement à la fin du chargement des données
   */
  var _initFilterPanel = function () {
    var options = mviewer.customComponents.filter.config.options;
    // Parse all layers to get params
    for (var [layerId, params] of _layersFiltersParams) {
      const mvLayer = mviewer.getLayer(layerId);
      const oLayer = mvLayer?.layer;
      const isVisible = oLayer.getVisible();
      if (mvLayer && oLayer) {
        var source = oLayer.getSource();
        var features =
          source instanceof ol.source.Cluster
            ? source.getSource().getFeatures()
            : source.getFeatures();

        if (features.length) {
          _manageFilterPanel();

          // show panel if wanted
          if (
            mviewer.customComponents.filter.config.options.open &&
            window.innerWidth > 360
          ) {
            $("#advancedFilter").show();
          }

          // Add draggable on panel
          $("#advancedFilter").easyDrag({
            handle: "h2",
            container: $("#map"),
          });

          // Update tooltip on button
          $('[data-toggle="filter-tooltip"]').tooltip({
            placement: options.tooltipPosition || "bottom-left",
          });
        } else if (isVisible) {
          setTimeout(_initFilterPanel, 300); // try again in 300 milliseconds
        }
      } else if (isVisible) {
        setTimeout(_initFilterPanel, 300); // try again in 300 milliseconds
      }
      if (!isVisible) {
        oLayer.on("change:visible", () => {
          filter.onLayerChange(layerId);
        });
      }
    }
  };

  /**
   * Private Method: _toggle
   *
   * Open filtering panel
   **/
  var _toggle = function () {
    // show or hide filter panel
    if ($("#advancedFilter").is(":visible")) {
      $("#filterbtn").removeClass("btn.focus");
      $("#filterbtn").removeClass("btn.active");
      $("#advancedFilter").hide();
    } else {
      $("#advancedFilter").show();
    }
  };

  /**
   * Private Method: _createFilterPanel
   *
   *
   */
  var _manageFilterPanel = function () {
    var nbLayers = _layersFiltersParams.size;

    var title =
      mviewer.customComponents.filter.config.options.legendTitle || "Choix de la couche";
    var contentSelectLayer = [
      `<div class="form-group mb-2 mr-sm-2">
      <legend id="layerSelectText" class="textlabel">${title}</legend>
      <select id="select-FilterLayer" class="form-control" onchange="filter.selectLayer(this)">`,
    ];

    var indexLayerId = 0;
    // Parse all layers to get params
    for (var [layerId, params] of _layersFiltersParams) {
      // Create div id
      var destinationDivId = "advancedFilter-" + layerId;

      // Create div only if not exist
      if (!$("#" + destinationDivId).length) {
        // add selectBox if needed
        const selected = mviewer.getLayer(layerId)?.layer.getVisible() ? "selected" : "";
        contentSelectLayer.push(
          `<option selected="${selected}" value="${layerId}">${
            mviewer.getLayer(layerId).name
          }</option>`
        );
        $("#advancedFilter").append('<div id="' + destinationDivId + '" "></div>');
      }

      // update distinct values needed to create template
      _updateFeaturesDistinctValues(layerId);

      // Parse all params to create panel
      for (var index in params) {
        // condition on type
        if (params[index].type == "checkbox") {
          _manageCheckboxFilter(destinationDivId, layerId, params[index]);
        } else if (params[index].type == "combobox") {
          _manageComboboxFilter(destinationDivId, layerId, params[index]);
        } else if (params[index].type == "button") {
          _manageButtonFilter(destinationDivId, layerId, params[index]);
        } else if (params[index].type == "textbox") {
          _manageTextFilter(destinationDivId, layerId, params[index]);
        } else if (params[index].type == "date") {
          _manageDateFilter(destinationDivId, layerId, params[index]);
        }
      }
      const layerConfig = mviewer.customComponents.filter.config.options.layers.find(
        (x) => x.layerId == layerId
      );
      if (layerConfig.downloadFormats && layerConfig.downloadFormats.length) {
        try {
          _addDownLoadPanel(destinationDivId, layerConfig);
        } catch (error) {
          mviewer.alert(
            "L'option downloadFormats ne fonctionne qu'avec des couches WFS",
            "alert-info"
          );
          console.error("L'option downloadFormats ne fonctionne qu'avec des couches WFS");
        }
      }

      if (layerId != _currentSelectedLayer) {
        $("#" + destinationDivId).hide();
      }
      indexLayerId++;
    }

    if (nbLayers > 1 && !$("#select-FilterLayer").length) {
      contentSelectLayer.push("</select></div>");
      $("#selectLayerFilter").append(contentSelectLayer.join(""));
    }

    _setStyle();
  };

  /**
   * Private Method: _addDownLoadPanel
   *
   * Add a download panel for WFS datasource
   **/
  var _addDownLoadPanel = function (destinationDivId, layerConfig) {
    // Create div only if not exist
    if (!$("#download-" + destinationDivId).length) {
      panel = $(
        '<div id="download-' +
          destinationDivId +
          '" class="download-section"> <legend class="textlabel">Télécharger</legend></div>'
      );

      layerConfig.downloadFormats.forEach((format) => {
        var button = $(`
        <span class="download-btn" 
          data-toggle="filter-tooltip" 
          data-original-title="Télécharger au format ${format.label}">
          ${format.label}
        </span>`);
        button.on("click", function (event) {
          _download(layerConfig, format);
        });
        panel.append(button);
      });

      $("#" + destinationDivId).append(panel);
    }
  };

  var _download = function (layerConfig, format) {
    var url = mviewer.getLayer(layerConfig.layerId).layer.getSource().getUrl();
    var parseURL = new URLSearchParams(url);

    if (url.apply) {
      // Si getUrl() renvoie une fonction
      url = mviewer
        .getLayer(layerConfig.layerId)
        .layer.getSource()
        .getUrl()
        .apply(null, []);
    }
    if (format.format) {
      // manage format and replace if already exists - use mixed method to change outputFormat param
      url = parseURL.has("outputFormat")
        ? url.replace(new RegExp(/&outputFormat(.*)(&|$)/), "")
        : url;
      url += `&outputFormat=${format.format}`;
    }
    if (_getFilter(layerConfig.layerId)) {
      // add only if filters exist
      url += _getFilter(layerConfig.layerId);
    }
    window.open(url, "target='_blank'");
  };

  /**
   * Private Method: _getFilter
   *
   * get layer filter as CQL string
   **/
  var _getFilter = function (layerId) {
    let filterTxt;
    filter.layersFiltersParams.get(layerId).forEach((layerFilter) => {
      // Only if there is a filter
      if (layerFilter.currentValues.length) {
        const newFilter = `${layerFilter.attribut} LIKE '%${layerFilter.currentValues[0]}%'`;
        if (filterTxt && filterTxt.length) {
          filterTxt += " AND " + newFilter;
        } else {
          filterTxt = newFilter;
        }
      }
    });
    if (filterTxt && filterTxt.length) {
      return "&CQL_FILTER=" + encodeURIComponent(filterTxt);
    } else {
      return "";
    }
  };

  /**
   * Select wanted layer in filter panel
   */
  var _selectLayer = function (element) {
    $("#advancedFilter-" + _currentSelectedLayer).hide();
    _currentSelectedLayer = element.value;
    $("#advancedFilter-" + _currentSelectedLayer).show();
  };

  var _onFirstVisibilityChange = (layerId) => {
    _updateFeaturesDistinctValues(layerId);
    _initFilterTool(false);
  };
  /**
   * Private Method: _updateDistinctValues for a layer
   * @param {string} layerId The layer id to be filter
   *
   **/
  var _updateFeaturesDistinctValues = function (layerId) {
    // Parse all params to create panel

    // for given attributes array update values
    var layerFiltersParams = _layersFiltersParams.get(layerId);
    var visibleFeatures =
      _visibleFeatures.get(layerId) == undefined ? [] : _visibleFeatures.get(layerId);

    var source = mviewer.getLayer(layerId).layer.getSource();
    var features =
      source instanceof ol.source.Cluster
        ? source.getSource().getFeatures()
        : source.getFeatures();

    // Parse all params to get wanted values
    for (var index in layerFiltersParams) {
      // init current filters values
      layerFiltersParams[index].currentValues = layerFiltersParams[index].currentValues
        ? layerFiltersParams[index].currentValues
        : [];
      layerFiltersParams[index].currentRegexValues = layerFiltersParams[index]
        .currentRegexValues
        ? layerFiltersParams[index].currentRegexValues
        : [];

      // undefined if first loop
      if (
        layerFiltersParams[index].availableValues == undefined ||
        layerFiltersParams[index].updateOnChange
      ) {
        // Removed old values or initialise array
        // Array use to build panel
        layerFiltersParams[index].availableValues = [];

        features.forEach((feature) => {
          // cluster case
          if (feature.get("features")) {
            feature.get("features").forEach((feature) => {
              _checkDistinctValues(feature, visibleFeatures, layerFiltersParams[index]);
            });
          } else {
            _checkDistinctValues(feature, visibleFeatures, layerFiltersParams[index]);
          }
        });

        layerFiltersParams[index].availableValues.sort();
      }
    }
  };

  /**
   * Check in feature properties if value is already listed,
   * if not listed it
   * @param {ol.Feature} feature the current feature
   * @param {Array} visibleFeatures array of visibile feature uid
   * @param {Object} filtersParams filter params information
   */
  var _checkDistinctValues = function (feature, visibleFeatures, filtersParams) {
    // If feature is visible and value not null
    if (
      visibleFeatures.length == 0 ||
      visibleFeatures.includes(ol.util.getUid(feature))
    ) {
      // for date type
      if (filtersParams.type == "date") {
        if (
          !_isEmpty(feature.get(filtersParams.attribut[0])) &&
          !_isEmpty(feature.get(filtersParams.attribut[1]))
        ) {
          var startDate = _stringToDate(feature.get(filtersParams.attribut[0]));
          var endDate = _stringToDate(feature.get(filtersParams.attribut[1]));

          if (
            typeof filtersParams.availableValues[1] === "undefined" ||
            startDate <= filtersParams.availableValues[1]
          ) {
            filtersParams.availableValues[1] = startDate;
          }
          if (
            typeof filtersParams.availableValues[0] === "undefined" ||
            endDate >= filtersParams.availableValues[0]
          ) {
            filtersParams.availableValues[0] = endDate;
          }
        }
      } else if (!_isEmpty(feature.get(filtersParams.attribut))) {
        // if needed, split values with specified separatore
        if (filtersParams.dataSeparator) {
          var results = feature
            .get(filtersParams.attribut)
            .split(filtersParams.dataSeparator)
            .map((e) => $.trim(e));
          // Add values, distinct and sort values
          filtersParams.availableValues = [
            ...new Set(filtersParams.availableValues.concat(results)),
          ].sort();
        } else if (
          filtersParams.availableValues.indexOf(feature.get(filtersParams.attribut)) < 0
        ) {
          filtersParams.availableValues.push(feature.get(filtersParams.attribut));
        }
      }
    }
  };

  /**
   * private _addCheckboxFilter
   *
   * @param {String} divId - div id wher the checkbox group should be added
   * @param {String} layerId - layer id needed to create includes
   * @param {Object} filterParams - list of parameters filterParams.label and filterParames.attribut
   */
  var _manageCheckboxFilter = function (divId, layerId, filterParams) {
    var id = "filterCheck-" + layerId + "-" + filterParams.attribut;
    var clearId = "filterClear-" + layerId + "-" + filterParams.attribut;

    var _checkBox = [];
    var alreadyExist = $("#" + id).length;

    // test if div alreay exist
    if (alreadyExist) {
      $("#" + id).empty();
    } else {
      _checkBox = [
        `
        <div class="form-check mb-2 mr-sm-2">
        <div class="form-check filter-legend">
        <legend class="textlabel"> ${filterParams.label} </legend>
        <span id='${clearId}' class="filter-clear glyphicon glyphicon-trash textlabel" onclick="filter.clearFilter(this.id);"
         data-toggle="filter-tooltip" data-original-title="Réinitaliser ce filtre"></span>
        </div>
        <div id="${id}" class="form-check">
        `,
      ];
    }
    filterParams.availableValues.forEach(function (value, index, array) {
      var id = "filterCheck-" + layerId + "-" + filterParams.attribut + "-" + index;
      _checkBox.push("<div>");
      _checkBox.push('<input type="checkbox" class="form-check-input" id="' + id + '"');
      if (filterParams.currentValues.includes(value)) {
        _checkBox.push(' checked="checked" ');
      }
      _checkBox.push(' onclick="filter.onValueChange(this);">');
      _checkBox.push(
        '<label class="form-check-label" for="' + id + '">' + value + "</label>"
      );
      _checkBox.push("</div>");
    });

    if (!alreadyExist) {
      _checkBox.push("</div></div>");
      $("#" + divId).append(_checkBox.join(""));
    } else {
      $("#" + id).append(_checkBox.join(""));
    }
  };

  /**
   * private _manageButtonFilter
   *
   * @param {String} divId - div id wher the checkbox group should be added
   * @param {String} layerId - layer id needed to create includes
   * @param {Object} filterParams - list of parameters filterParams.label and filterParames.attribut
   */
  var _manageButtonFilter = function (divId, layerId, filterParams) {
    var id = "filterCheck-" + layerId + "-" + filterParams.attribut;
    var clearId = "filterClear-" + layerId + "-" + filterParams.attribut;

    var _buttonForm = [];
    var alreadyExist = $("#" + id).length;

    // test if div alreay exist
    if (alreadyExist) {
      $("#" + id).empty();
    } else {
      _buttonForm = [
        '<div class="form-check mb-2 mr-sm-2">',
        '<div class="form-check filter-legend">',
        '<legend class="textlabel"> ' + filterParams.label + " </legend>",
        "<span id=" +
          clearId +
          ' class="filter-clear glyphicon glyphicon-trash textlabel" onclick="filter.clearFilter(this.id);"',
        ' data-toggle="filter-tooltip" data-original-title="Réinitaliser ce filtre"></span>',
        "</div>",
        '<div id ="' + id + '" class="form-check">',
      ];
    }
    filterParams.availableValues.forEach(function (value, index, array) {
      var id = "filterCheck-" + layerId + "-" + filterParams.attribut + "-" + index;
      _buttonForm.push(
        '<input hidden type="checkbox" class="form-check-input" id="' + id + '"'
      );
      if (filterParams.currentValues.includes(value)) {
        _buttonForm.push(' checked="checked" ');
      }
      _buttonForm.push(' onclick="filter.onValueChange(this);">');

      _buttonForm.push('<label class="form-check-label label label-info ');
      if (filterParams.currentValues.includes(value)) {
        _buttonForm.push(" form-check-label-checked ");
      }
      _buttonForm.push('" for="' + id + '">' + value + "</label>");
    });

    if (!alreadyExist) {
      _buttonForm.push("</div></div>");
      $("#" + divId).append(_buttonForm.join(""));
    } else {
      $("#" + id).append(_buttonForm.join(""));
    }
  };

  /**
   * private _addTextFilter
   *
   * @param {String} divId - div id wher the checkbox group should be added
   * @param {String} layerId - layer id needed to create includes
   * @param {Object} filterParams - list of parameters filterParams.label and filterParames.attribut
   */
  var _manageTextFilter = function (divId, layerId, params) {
    // ID - generate to be unique
    var id = "filterText-" + layerId + "-" + params.attribut;
    var clearId = "filterClear-" + layerId + "-" + params.attribut;

    // If alreadyExist, juste update params values
    if ($("#" + id).length) {
      $("#" + id).tagsinput("destroy");
      // Update tagsinput params
      $("#" + id).tagsinput({
        typeahead: {
          source: params.availableValues,
        },
        freeInput: false,
        confirmKeys: [13, 188],
      });
    } else {
      // HTML
      var _text = [
        '<div class="form-check mb-2 mr-sm-2">',
        '<div class="form-check filter-legend">',
        '<legend class="textlabel"> ' + params.label + " </legend>",
        "<span id=" +
          clearId +
          ' class="filter-clear glyphicon glyphicon-trash textlabel"',
        ' data-toggle="filter-tooltip" data-original-title="Réinitaliser ce filtre"></span>',
        "</div>",
      ];
      _text.push(
        '<input type="text" value="" data-role="tagsinput" id="' +
          id +
          '" class="form-control">'
      );
      _text.push("</div>");
      $("#" + divId).append(_text.join(""));

      // Update tagsinput params
      $("#" + id).tagsinput({
        typeahead: {
          source: params.availableValues,
        },
        freeInput: false,
        confirmKeys: [13, 188],
      });

      //EVENT
      $("#" + id).on("itemAdded", function (event) {
        _addFilterElementToList(layerId, params.attribut, event.item);
        _filterFeatures(layerId);
        // remover entered text
        setTimeout(function () {
          $(">input[type=text]", ".bootstrap-tagsinput").val("");
        }, 1);
      });

      $("#" + clearId).on("click", function (event) {
        $("#" + id).tagsinput("removeAll");
        var layerFiltersParams = _layersFiltersParams.get(layerId);
        // test is at least one filter for this attribut exist
        if (
          layerFiltersParams.filter(
            (f) => f.attribut == params.attribut && f.currentValues.length
          ).length
        ) {
          _removeFilterElementFromList(layerId, params.attribut, null);
          _filterFeatures(layerId);
        }
      });

      $("#" + id).on("itemRemoved", function (event) {
        _removeFilterElementFromList(layerId, params.attribut, event.item);
        _filterFeatures(layerId);
      });
    }
  };

  /**
   * private _addDateFilter
   *
   * @param {String} divId - div id wher the checkbox group should be added
   * @param {String} layerId - layer id needed to create includes
   * @param {Object} filterParams - list of parameters filterParams.label and filterParames.attribut
   */
  var _manageDateFilter = function (divId, layerId, params) {
    // for type date, two parameters are availables
    // create unique id with first parameter
    var id = "filterDate-" + layerId + "-" + params.attribut[0];
    var clearId = "filterClear-" + layerId + "-" + params.attribut[0];

    if (!$("#" + id).length) {
      var _datePicker = [
        `
        <div class="form-group form-group-timer mb-2 mr-sm-2">
        <div class="form-check filter-legend">
        <legend class="textlabel">${params.label}</legend>
        <span id=${clearId} class="filter-clear glyphicon glyphicon-trash textlabel"
         data-toggle="filter-tooltip" data-original-title="Réinitaliser ce filtre"></span>
        </div>`,
      ];
      _datePicker.push('<input type="text" class="form-control" id="' + id + '" />');
      _datePicker.push("</div>");
      $("#" + divId).append(_datePicker.join(""));

      // manage datepicker external clear
      $("#" + clearId).click(function (e) {
        e.preventDefault();
        $("#" + id).datepicker("setDate", null);
        var layerFiltersParams = _layersFiltersParams.get(layerId);
        // test is at least one filter for this attribut exist
        if (
          layerFiltersParams.filter(
            (f) => f.attribut == params.attribut && f.currentValues.length
          ).length
        ) {
          _removeFilterElementFromList(layerId, params.attribut, null);
          _filterFeatures(layerId);
        }
      });
    }

    $("#" + id).datepicker({
      format: "yyyy-mm-dd",
      language: "fr",
      autoclose: true,
      startDate: params.availableValues[1],
      endDate: params.availableValues[0],
      clearBtn: true,
      todayHighlight: true,
    });

    $("#" + id).on("changeDate", function (event) {
      if (typeof event.date == "undefined") {
        _removeFilterElementFromList(layerId, params.attribut, null);
      } else {
        _addFilterElementToList(layerId, params.attribut, event.date, "date");
      }
      _filterFeatures(layerId);
    });
  };

  /**
   * private _addComboboxFilter
   *
   * @param {String} divId - div id wher the checkbox group should be added
   * @param {String} layerId - layer id needed to create includes
   * @param {Object} filterParams - list of parameters filterParams.label and filterParames.attribut
   */
  var _manageComboboxFilter = function (divId, layerId, params) {
    var id = "filterCombo-" + layerId + "-" + params.attribut;
    var clearId = "filterClear-" + layerId + "-" + params.attribut;
    var comboBox = [];

    // If alreadyExist, juste update params values
    if ($("#" + id).length) {
      $("#" + id).empty();
    } else {
      comboBox = [
        '<div class="form-group mb-2 mr-sm-2">',
        '<div class="form-check filter-legend">',
        '<legend class="textlabel"> ' + params.label + " </legend>",
        "<span id=" +
          clearId +
          ' class="filter-clear glyphicon glyphicon-trash textlabel"',
        ' data-toggle="filter-tooltip" data-original-title="Réinitaliser ce filtre"></span>',
        "</div>",
        '<select id="' +
          id +
          '" class="form-control" onchange="filter.onValueChange(this)">',
      ];
    }

    comboBox.push("<option>Choisissez...</option>");

    params.availableValues.forEach(function (value, index, array) {
      if (params.currentValues.includes(value)) {
        comboBox.push(' <option selected="selected">' + value + "</option>");
      } else {
        comboBox.push(" <option>" + value + "</option>");
      }
    });
    if ($("#" + id).length) {
      $("#" + id).append(comboBox.join(""));
    } else {
      comboBox.push("</select></div>");
      $("#" + divId).append(comboBox.join(""));
    }

    $("#" + clearId).on("click", function (event) {
      var layerFiltersParams = _layersFiltersParams.get(layerId);
      // test is at least one filter for this attribut exist
      if (
        layerFiltersParams.filter(
          (f) => f.attribut == params.attribut && f.currentValues.length
        ).length
      ) {
        _removeFilterElementFromList(layerId, params.attribut, null);
        _filterFeatures(layerId);
      }
    });
  };

  /**
   * Private Method: _addFilterElementToList
   * @param {string} layerId The layer id to be filter
   * @param {string} attribute The property key for filtering feature
   * @param {object} value The value to filter can be String, Number, Boolean, Date,
   * @param {String} type The value format to help filtering (text, date, boolean)
   **/
  var _addFilterElementToList = function (layerId, attribut, value, type) {
    var escapeCharPatternForFiltering = "/[-/\\^$*+?.()|[]{}]/g";

    // Add filter only if there something to filter
    if (layerId != null && attribut != null && value != null) {
      var layerFiltersParams = _layersFiltersParams.get(layerId);

      // If attribut exist add new value to existing one
      layerFiltersParams.forEach(function (filter, index, array) {
        if (filter.attribut == attribut && value != null && type == "date") {
          filter.currentValues[0] = value;
        } else if (
          filter.attribut == attribut &&
          value != null &&
          !filter.currentValues.includes(value)
        ) {
          filter.currentValues.push(value);
          filter.currentRegexValues.push(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
        }
      });
    }
  };

  /**
   * Private Method: _removeFilterElementFromList
   * @param {string} layerId The layer id to be filter
   * @param {string} attribute The property key for filtering feature
   * @param {object} value The value to filter can be String, Number, Boolean, Date,
   * @param {String} type The value format to help filtering (text, date, boolean)
   **/
  var _removeFilterElementFromList = function (layerId, attribut, value) {
    var layerFiltersParams = _layersFiltersParams.get(layerId);
    //search if value exist un currentFilters
    if (layerFiltersParams != undefined) {
      layerFiltersParams.forEach(function (filter, index, array) {
        if (
          filter.attribut == attribut &&
          (value == null || filter.currentValues == value)
        ) {
          filter.currentValues = [];
          filter.currentRegexValues = [];
        } else if (filter.attribut == attribut && filter.currentValues.includes(value)) {
          var indexValue = filter.currentValues.indexOf(value);
          filter.currentValues.splice(indexValue, 1);
          filter.currentRegexValues.splice(indexValue, 1);
        }
      });
    }

    var source = mviewer.getLayer(layerId).layer.getSource();
    // update cluster information, test if all filter are cleared to reset view
    if (source instanceof ol.source.Cluster) {
      var atLeasteOnFilter = false;
      layerFiltersParams.forEach(function (filter, index, array) {
        if (filter.currentValues.length > 0) {
          atLeasteOnFilter = true;
        }
      });
      source.setIsFilter(atLeasteOnFilter);
    }
  };

  /**
   * Private Method: _onValueChange
   *
   *  action when filter from filter panel change (checkbox, combobox, textarea or datapicker )
   **/
  var _onValueChange = function (element) {
    // get information for elment id ( type-layerid-attribut-index)
    var filtreInformation = element.id.split("-");
    var type = filtreInformation[0];
    var layerId = filtreInformation[1];
    var attribut = filtreInformation[2];
    var value = element.value;

    // checkbox return index of value in _layersParams
    if (type == "filterCheck") {
      var indexValue = filtreInformation[3];
      value = _getValueFromInfo(layerId, attribut, indexValue);
      // if check add filter, else remove filter
      if (element.checked == true) {
        _addFilterElementToList(layerId, attribut, value);
      } else {
        _removeFilterElementFromList(layerId, attribut, value);
      }
    }
    // combobox only one possible value so remove previous if exist
    else if (type == "filterCombo") {
      _removeFilterElementFromList(layerId, attribut, null);
      // if value not the first text here ("Choississez...")
      if (element.selectedIndex != 0) {
        _addFilterElementToList(layerId, attribut, value);
      }
    } else {
      _addFilterElementToList(layerId, attribut, value);
    }

    _filterFeatures(layerId);
  };

  /**
   * Private Method: _getValueFromInfo
   *
   *
   **/
  var _getValueFromInfo = function (layerId, attribute, indexValue) {
    var params = _layersFiltersParams.get(layerId);

    for (var index in params) {
      if (params[index].attribut == attribute) {
        return params[index].availableValues[indexValue];
      }
    }
  };

  /**
   * Private Method: _clearFilterTools
   *
   */
  var _clearFilterTools = function () {
    $("#filterbtn").removeClass("active");
    $("#advancedFilter").hide();
  };

  /**
   * Private Method: _filterFeature
   * @param {String} layerId Id of layer that should be filtered
   *
   **/
  var _filterFeatures = function (layerId) {
    var _layerFiltersParams = _layersFiltersParams.get(layerId);

    var source = mviewer.getLayer(layerId).layer.getSource();
    // Check if ClusterLayer
    var featuresToBeFiltered =
      source instanceof ol.source.Cluster
        ? source.getSource().getFeatures()
        : source.getFeatures();
    var newVisibleFeatures = [];
    var extent;

    // if zoomOnFeatures enable create an empty extent
    if (mviewer.customComponents.filter.config.options.zoomOnFeatures) {
      extent = ol.extent.createEmpty();
    }

    featuresToBeFiltered.forEach((feature) => {
      var hideFeature = false;
      var atLeastOneFilter = false;

      //search if value exist un _layerFiltersParams
      _layerFiltersParams.forEach(function (filter, index, array) {
        // Only if there is a filter
        if (filter.currentValues.length > 0) {
          atLeastOneFilter = true;

          // filter on date is specific, filter.value should be contains beetween to attribute valuse
          if (filter.type == "date") {
            // if current date beetwen start and end date
            if (
              !_isDateInPeriod(
                filter.currentValues[0],
                feature.get(filter.attribut[0]),
                feature.get(filter.attribut[1])
              )
            ) {
              hideFeature = true;
            }
          } else if (
            !_isValueInFeaturePropertie(
              filter.currentRegexValues,
              feature.get(filter.attribut)
            )
          ) {
            hideFeature = true;
          }
        }
      });
      // Hide features
      if (atLeastOneFilter && hideFeature) {
        feature.setStyle(new ol.style.Style({}));
        feature.hidden = hideFeature;
        // update cluster information to avoir clustering
        if (source instanceof ol.source.Cluster) {
          source.setIsFilter(true);
        }
      } else {
        feature.hidden = hideFeature;
        feature.setStyle(null);
        newVisibleFeatures.push(ol.util.getUid(feature));
        // Extend creation if zoomOnFeatures enable
        if (mviewer.customComponents.filter.config.options.zoomOnFeatures) {
          ol.extent.extend(extent, feature.getGeometry().getExtent());
        }
      }
    });
    _visibleFeatures.set(layerId, newVisibleFeatures);
    // zoom on features
    if (
      mviewer.customComponents.filter.config.options.zoomOnFeatures &&
      !ol.extent.isEmpty(extent)
    ) {
      // add buffer arround extent
      var bufferedExtent = ol.extent.buffer(extent, ol.extent.getWidth(extent) / 2);
      mviewer.getMap().getView().fit(bufferedExtent);
    }
    _manageFilterPanel(layerId);
    _setStyle();
  };

  /**
   *
   */
  var _isDateInPeriod = function (wantedDate, startDate, endDate) {
    if (_stringToDate(startDate) <= wantedDate && _stringToDate(endDate) >= wantedDate) {
      return true;
    }
    return false;
  };

  /**
   *
   */
  var _isValueInFeaturePropertie = function (wantedValues, featurePropertie) {
    var isInValue = false;

    // If featurePropertie not null, empyt or undefined
    if (_isEmpty(featurePropertie)) {
      return isInValue;
    } else if (new RegExp(wantedValues.join("|")).test(featurePropertie)) {
      isInValue = true;
    }
    return isInValue;
  };

  /**
   * _clearFilter from a given id
   * @param {String} id - example button-plage-grand_territoire
   */
  var _clearFilter = function (id) {
    // get information for elment id ( type-layerid-attribut-index)
    var filtreInformation = id.split("-");
    var type = filtreInformation[0];
    var layerId = filtreInformation[1];
    var attribut = filtreInformation[2];

    var layerFiltersParams = _layersFiltersParams.get(layerId);
    // test is at least one filter for this attribut exist
    if (
      layerFiltersParams.filter((f) => f.attribut == attribut && f.currentValues.length)
        .length
    ) {
      _removeFilterElementFromList(layerId, attribut, null);
      _filterFeatures(layerId);
    }
  };

  /**
   *
   **/
  var _isEmpty = function (val) {
    return val === undefined || val == null || val.length <= 0 ? true : false;
  };

  /**
   *
   **/
  var _stringToDate = function (string, format) {
    var date = new Date(string);
    return date;
  };

  /**
   * Private Method: _clearFilterFeatures
   * @param {String} layerId layer id from layer to be cleared
   *
   **/
  var _clearFilterFeatures = function (layerId) {
    _visibleFeatures.set(layerId, []);

    layerFiltersParams = _layersFiltersParams.get(layerId);
    // Parse all params to create panel
    for (var index in layerFiltersParams) {
      // init current filters values
      layerFiltersParams[index].currentValues = [];
      layerFiltersParams[index].currentRegexValues = [];
    }
    _filterFeatures(layerId);
  };

  /**
   * Private Method: _clearAllFilter
   *
   * reset all feature for all layer
   **/
  var _clearAllFilter = function () {
    $(".filter-clear").click();
    // Parse all layer to get params
    for (var [layerId, params] of _layersFiltersParams) {
      var layerFiltersParams = _layersFiltersParams.get(layerId);
      // test is at least one filter for this attribut exist
      if (layerFiltersParams.filter((f) => f.currentValues.length).length) {
        _clearFilterFeatures(layerId);

        var source = mviewer.getLayer(layerId).layer.getSource();
        // update cluster information
        if (source instanceof ol.source.Cluster) {
          source.setIsFilter(false);
        }
      }
    }
  };

  var _setStyle = function (reinitPosition = false) {
    if (!mviewer.customComponents.filter.config.options.style) return;
    var style = mviewer.customComponents.filter.config.options.style;
    $(".textlabel").css("color", style.text || "black");
    $("#advancedFilter").css("background-color", style.background || "white");
    $("#advancedFilter").css("border", style.border || "0px transparent solid");
    // position
    if (reinitPosition) {
      $("#advancedFilter").css("right", style.right || "60px");
      $("#advancedFilter").css("left", style.left || "");
      $("#advancedFilter").css("top", style.top || "65px");
      $("#advancedFilter").css("bottom", style.bottom || "");
    }
    // button style
    $(".label-info").css("background-color", style.unSelectedBtnColor || "grey");
    $(".label-info").css("color", style.textSelectBtnColor || "black");
    $(".form-check-label-checked").css(
      "background-color",
      style.selectedBtnColor || "#5bc0de"
    );
  };

  return {
    init: () => _initFilterTool(),
    toggle: _toggle,
    filterFeatures: _filterFeatures,
    layersFiltersParams: _layersFiltersParams,
    onValueChange: _onValueChange,
    onLayerChange: (idLayer) => _onFirstVisibilityChange(idLayer),
    clearFilter: _clearFilter,
    clearAllFilter: _clearAllFilter,
    selectLayer: _selectLayer,
  };
})();

new CustomComponent("filter", filter.init);
