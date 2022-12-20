var stats = (function () {
  /**
   * Property: _statsParams
   *  @type {Array}
   */
  var _layersStatsParams = new Array();

  /**
   * PrepareLayer before create panel
   *
   */
  var _prepareReadyLayers = (statsParams) => {
    statsParams.forEach((stat) => {
      var layerId = stat.layerId;
      var mvLayer = mviewer.getLayer(layerId) ? mviewer.getLayer(layerId).layer : null;

      mvLayer.on("change:visible", function (e) {
        _refreshStats(statsParams);
      });
    });
  };

  /**
   * Public Method: _initTool exported as init
   *
   */
  var _initTool = function () {
    console.log("_initTool");
    // get config for a specific mviewer
    var mviewerId = configuration.getConfiguration().application.id;
    var options = mviewer.customComponents.stats.config.options;
    if (mviewerId && options.mviewer && options.mviewer[mviewerId]) {
      mviewer.customComponents.stats.config.options = options.mviewer[mviewerId];
      options = mviewer.customComponents.stats.config.options;
    }
    // get stats configuration
    _layersStatsParams = mviewer.customComponents.stats.config.options.stats;

    if (_layersStatsParams.length > 0) {
      // wait map ready and prepare layers to avoid empty panel
      mviewer.getMap().once("rendercomplete", function (e) {
        _prepareReadyLayers(_layersStatsParams);
        _initPanel();
        _refreshStats(_layersStatsParams);
      });

      //Add button to toolstoolbar
      var button = `
      <button id="statsbtn" class="btn btn-default btn-raised"
        onclick="stats.toggle();"  title="Afficher les stats" i18n="tbar.right.stat"
        tabindex="116" accesskey="f">
        <span class="glyphicon glyphicon-stats" aria-hidden="true">
        </span>
      </button>`;
      $("#toolstoolbar").prepend(button);
      $("#statsbtn").css("color", options.style.colorButton || "black");
    }

    // custom from config
    $("#statsTitle").text(options.title);
    _setStyle();
  };

  /**
   * Public Method: _initFilterPanel
   *
   * Recour au setTimeout car aucun event ne se déclenche correctement à la fin du chargement des données
   */
  var _initPanel = function () {
    var options = mviewer.customComponents.stats.config.options;
    // show panel if wanted
    if (mviewer.customComponents.stats.config.options.open && window.innerWidth > 360) {
      $("#statsbtn").addClass("active");
      $("#statsPanel").show();
    }
    // Add draggable on panel
    $("#statsPanel").easyDrag({
      handle: "h2",
      container: $("#map"),
    });

    mviewer.getMap().on("moveend", function (e) {
      if ($("#statsPanel").is(":visible")) {
        _refreshStats(_layersStatsParams);
      }
    });
  };

  /**
   * Private Method: _getStatContent
   *
   * get stat content given the feature list and a stat config paramerter
   **/
  var _getStatContent = (features, statsParam) => {
    var value = "";
    if (statsParam.operator === "COUNT") {
      value = features.length;
    } else if (statsParam.operator === "MEAN") {
      var sum = features.reduce((accumulator, object) => {
        return accumulator + Number(object.get(statsParam.field));
      }, 0);
      value = Math.round((sum / features.length) * 100) / 100;
    } else if (statsParam.operator === "SUM") {
      value = features.reduce((accumulator, object) => {
        return accumulator + Number(object.get(statsParam.field));
      }, 0);
    } else if (statsParam.operator === "MAX") {
      const arrMax = (arr) => Math.max(...arr);
      value = arrMax(features.map((x) => x.get(statsParam.field)));
    } else if (statsParam.operator === "MIN") {
      const arrMin = (arr) => Math.min(...arr);
      value = arrMin(features.map((x) => x.get(statsParam.field)));
    }

    var content = statsParam.template.replace("{x}", value.toLocaleString());
    return content;
  };

  /**
   * Private Method: _refreshStats
   *
   * Refresh stats in panel
   **/
  var _refreshStats = (_layersStatsParams) => {
    _layersStatsParams.forEach((params, i) => {
      var layerId = params.layerId;
      if (mviewer.getLayer(layerId) && mviewer.getLayer(layerId).layer) {
        var source = mviewer.getLayer(layerId).layer.getSource();
        var extent = mviewer
          .getMap()
          .getView()
          .calculateExtent(mviewer.getMap().getSize());
        var features =
          source instanceof ol.source.Cluster
            ? source.getSource().getFeaturesInExtent(extent)
            : source.getFeaturesInExtent(extent);
        var content = _getStatContent(features, params);
        var statElement = $("#statpanel_" + i);
        if (statElement.length) {
          statElement.html(content);
        } else {
          var newId = "statpanel_" + i;
          $("#statsPanelContent").append(
            `<div id="${newId}" class="statElement">${content}</div>`
          );
        }
        if (mviewer.getLayer(layerId).layer.getVisible()) {
          statElement.show();
        } else {
          statElement.hide();
        }
        if (statElement.hasClass("stat_effect")) {
          statElement.removeClass("stat_effect");
          void statElement[0].offsetWidth; //Important sinon l'animation ne se redéclenche pas cf https://css-tricks.com/restart-css-animation/
          statElement.addClass("stat_effect");
        } else {
          statElement.addClass("stat_effect");
        }
      }
    });
  };
  /**
   * Private Method: _toggle
   *
   * Open filtering panel
   **/
  var _toggle = function () {
    // show or hide filter panel
    if ($("#statsPanel").is(":visible")) {
      $("#statsbtn").blur();
      $("#statsbtn").removeClass("active");
      $("#statsPanel").hide();
    } else {
      _refreshStats(_layersStatsParams);
      $("#statsbtn").addClass("active");
      $("#statsPanel").show();
    }
  };

  var _setStyle = function () {
    if (!mviewer.customComponents.stats.config.options.style) return;
    var style = mviewer.customComponents.stats.config.options.style;
    $(".titleHeader").css("color", style.text || "black");
    $("#statsPanel").css("background-color", style.background || "white");
    $("#statsPanel").css("border", style.border || "0px transparent solid");
  };

  return {
    init: _initTool,
    toggle: _toggle,
  };
})();

new CustomComponent("stats", stats.init);
