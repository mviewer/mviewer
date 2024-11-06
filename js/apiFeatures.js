var apiFeatures = (function () {
  /**
   * private Method: _ajaxPromise. Used to get a Promise from an ajax call
   */
  var _ajaxPromise = function (options) {
    return new Promise(function (resolve, reject) {
      $.ajax(options).done(resolve).fail(reject);
    });
  };

  function _connect(url) {
    if (!url) {
      url = $("#addLayers_service_url_api_features").val();
    }
    $("#addlayers_results_loading").show();
    _ajaxPromise({
      url: url,
      type: "get",
      dataType: "json",
    })
      .then(
        function onSuccess(data) {
          // parse collections
          let _resultList = _parseCollection(data);
          if (_resultList !== null) {
            _showLayerList(_resultList.layers, $("#addlayers_results"));
            //addlayers.addPager();
          }

          $("#addlayers_results_loading").hide();
        },
        function onError(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          var message = "Problème réseau pour intérroger " + url + "<br>";
          if (jqXHR.responseText) {
            message += jqXHR.responseText;
          }
          _error(message);
          $("#addlayers_results_loading").hide();
        }
      )
      .catch(function errorHandler(error) {
        console.log(error);
        var message = "Erreur dans la récupération de données " + url + "<br>";
        _error(message);
        $("#addlayers_results_loading").hide();
      });
  }

  function _parseCollection(data) {
    console.log(data);
    let nbTotalResults = data.collections.length;
    let layers = data.collections;

    return {
      nbTotalResults,
      //nextRecord,
      layers,
    };
  }

  function _error(message) {
    $("#addlayers_results").empty();
    addlayers.message(message, "alert-danger", $("#addlayers_results"));
  }

  /**
   * private Method: _showLayerList. Used to render HTML from a layerList
   */
  var _showLayerList = function (layerList, parentDiv) {
    parentDiv.empty();

    $.each(layerList, function (id, layer) {
      let btn = $(
        '<button class="vcenter"><span class="glyphicon glyphicon-plus"></span></button>'
      );
      let childContainerRow = $(`<div class="row"></div>`);
      let childContainerCol = $(`<div class="col-md-12"></div>`);
      childContainerRow.append(childContainerCol);

      btn.click(function () {
        _findItems(layer, this);
      });

      let rowClass = layer.Layer && layer.Layer.length > 0 ? "" : "layer-result-row";
      const layerContentRow = $(
        `<div class="row pl-1 ${rowClass}" style="padding-left: 20px;"></div>`
      );
      let layerContent = $(`<div class="col-md-8"> </div>`);
      const btnContent = $(`<div class="col-md-1"> </div>`);

      let title = $(
        `<span class="layer-result" title="${layer.title}">${layer.title}</span>`
      );

      layerContentRow.append(btnContent);
      layerContentRow.append(layerContent);
      layerContent.append(title);
      layerContent.append(
        `<br/><span class="layer-result-descr" title="${layer.description}">${layer.description}</span>`
      );

      layerContentRow.append($(`<div class="col-md-3"></div>`));

      btnContent.append(btn);

      parentDiv.append(layerContentRow);
    });
  };

  var _findItems = function (layer, button) {
    console.log(layer);

    let url = "";
    // if links.type equalse geo+json get href
    layer.links.forEach((link, index) => {
      if (link.type == "application/geo+json") {
        url = link.href;
        _initLayer(layer.id, layer.title, url);
      }
    });
  };

  /**
   * This function allow you to initialize all of the layers and the styles presents on the map
   * @params index
   * @returns Nothing
   */
  var _initLayer = (id, title, url) => {
    // Mviewer layer creation
    let apiFeaturesLayer = {
      showintoc: true,
      type: "customlayer",
      layerid: id,
      id: id,
      title: title,
      visible: true,
      opacity: 1,
      tooltip: true,
    };

    // Source layer with geojson data
    let items = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
      }),
    });

    mviewer.processLayer(apiFeaturesLayer, items);
    mviewer.addLayer(apiFeaturesLayer);

    // when data loaded zoom on it
    items.getSource().once("change", function (e) {
      if (items.getSource().getState() === "ready") {
        let zone = ol.geom.Polygon.fromExtent(items.getSource().getExtent());
        zone.scale(1.2);
        mviewer.getMap().getView().fit(zone.getExtent(), {
          duration: 3000,
        });
      }
    });
  };

  return {
    connect: _connect,
  };
})();
