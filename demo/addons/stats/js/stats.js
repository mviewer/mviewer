var stats = (function() {
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
   * Property: _statsParams
   *  @type {Map}
   */
  var _layersStatsParams = new Map();

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
   var _prepareReadyLayers = (statsParams) => {
    var layerId = "";
    var nbLayers = 0;
    statsParams.forEach((stat,i) => {
      layerId = stat.layerId;
      var mvLayer = mviewer.getLayer(layerId) ? mviewer.getLayer(layerId).layer : null;
      // Should never happens but we could check if layer.id not already exist in _statsParams
      if(mvLayer && mvLayer.getVisible()) _visibleLayers.set(layerId, stat);
      _visibleFeatures.set(layerId, []);

      nbLayers++;
      if (!_currentSelectedLayer && (nbLayers == 1 && mvLayer && mvLayer.getVisible() || mvLayer && mvLayer.getVisible())) {
        _currentSelectedLayer =  layerId;
      }
    });
  }

  /**
   * Public Method: _initTool exported as init
   *
   */
  var _initTool = function() {
    console.log("_initTool");
    // get config for a specific mviewer
    var mviewerId = configuration.getConfiguration().application.id;
    var options = mviewer.customComponents.stats.config.options;
    if(mviewerId && options.mviewer && options.mviewer[mviewerId]) {
      mviewer.customComponents.stats.config.options = options.mviewer[mviewerId];
      options = mviewer.customComponents.stats.config.options;
    }
    // get stats 
    var stats = mviewer.customComponents.stats.config.options.stats;

    stats.forEach(stat => {
      _layersStatsParams.set(stat.layerId, stat);
    });

    if (_layersStatsParams.size > 0) {

      // wait map ready and prepare layers to avoid empty filter panel
      mviewer.getMap().once('rendercomplete', function(e) {
        _prepareReadyLayers(_layersStatsParams);
        _initPanel();
      });
     
      //Add filter button to toolstoolbar
      var button = `
      <button id="statsbtn" class="btn btn-default btn-raised"
        onclick="stats.toggle();"  title="Afficher les stats" i18n="tbar.right.stat"
        tabindex="116" accesskey="f">
        <span class="glyphicon glyphicon-filter" aria-hidden="true">
        </span>
      </button>`;
      $("#toolstoolbar").prepend(button);
      $('#statsbtn').css('color', options.style.colorButton || 'black');
    }

    // custom from config
    $('#statsTitle').text(options.title);
    _setStyle();
  };

  /**
   * Public Method: _initFilterPanel
   *
   * Recour au setTimeout car aucun event ne se déclenche correctement à la fin du chargement des données
   */
  var _initPanel = function() {
    var options = mviewer.customComponents.stats.config.options;
    // show panel if wanted
    if (mviewer.customComponents.stats.config.options.open && window.innerWidth > 360) {
      $("#statsPanel").show();
    }
    // Add draggable on panel
    $('#statsPanel').easyDrag({
      handle: 'h2',
      container: $('#map')
    });
    // Update tooltip on button
    $('[data-toggle="filter-tooltip"]').tooltip({
      placement: options.tooltipPosition || 'bottom-left'
    });
    mviewer.getMap().on('moveend', function(e) {
      _refreshStats(_layersStatsParams);
    });

  };

  var _refreshStats = (_layersStatsParams) => {
    for (var [layerId, params] of _layersStatsParams) {
      if (mviewer.getLayer(layerId) && mviewer.getLayer(layerId).layer) {
        var source = mviewer.getLayer(layerId).layer.getSource();
        var extent = mviewer.getMap().getView().calculateExtent(mviewer.getMap().getSize());
        var features = source instanceof ol.source.Cluster ? source.getSource().getFeaturesInExtent(extent) : source.getFeaturesInExtent(extent);
        
       
        $("#selectLayerFilter").html(features.length+" Objets");
        if($('#selectLayerFilter').hasClass('effect1')){
          $('#selectLayerFilter').removeClass('effect1');
          $('#selectLayerFilter').addClass('effect2');
        }
        else if($('#selectLayerFilter').hasClass('effect2')){
          $('#selectLayerFilter').removeClass('effect2');
          $('#selectLayerFilter').addClass('effect1');
        }
        else{
          $('#selectLayerFilter').addClass('effect1');
        }
        
      }
    }

  }
  /**
   * Private Method: _toggle
   *
   * Open filtering panel
   **/
  var _toggle = function() {
    // show or hide filter panel
    if ($("#statsPanel").is(':visible')) {
      $('#statsbtn').removeClass('btn.focus');
      $('#statsbtn').removeClass('btn.active');
      $("#statsPanel").hide();
    } else {
      $('#statsbtn').addClass('btn.focus');
      $('#statsbtn').addClass('btn.active');
      $("#statsPanel").show();
    }
  };

  var _setStyle = function() {
    if(!mviewer.customComponents.stats.config.options.style) return;
    var style = mviewer.customComponents.stats.config.options.style;
    $('.textlabel').css('color', style.text || 'black');
    $('#statsPanel').css('background-color', style.background || 'white');
    $('#statsPanel').css('border', style.border || '0px transparent solid');
  }

  return {
    init: _initTool,
    toggle: _toggle
  };

})();

new CustomComponent("stats", stats.init);
