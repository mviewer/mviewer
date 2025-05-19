const apiFeatures = (function () {
  let actionHistory = [];

  const btnConnectApiFeature = document.getElementById(
    "addLayers_service_url_api_features"
  );

  if (btnConnectApiFeature) {
    btnConnectApiFeature.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        _connect(btnConnectApiFeature.value);
      }
    });
  }

  const _loadData = (url) => {
    const addLayerResultLoading = document.getElementById("addlayers_results_loading");

    // Show the input
    addLayerResultLoading.style.display = "block";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // parse collections
        let _resultList = _parseCollection(data);
        if (_resultList !== null) {
          let divParent = document.getElementById("addlayers_results");
          _showLayerList(_resultList.layers, divParent);
        }

        // Hide the input
        addLayerResultLoading.style.display = "none";
      })
      .catch(function errorHandler(error) {
        var message =
          "Erreur dans la récupération de données <strong>" + url + "</strong><br>";
        _error(message);
        // Hide the input
        addLayerResultLoading.style.display = "none";
      });
  };

  function _connect(url) {
    const serverListElt = document.getElementById(
      "addLayers_service_url_api_features_select"
    );
    const urlInputElt = document.getElementById("addLayers_service_url_api_features");

    if (!url) {
      url = document.getElementById("addLayers_service_url_api_features").value;
      if (!url) {
        let message = "L'url ne peut pas être vide !";
        _error(message);
        return;
      }
    }

    // If there is an action
    if (actionHistory.length > 0) {
      // Get the last action
      const lastAction = actionHistory[0];

      // Check if the last action is about the server list and if there is a value in the entry
      if (lastAction.state === "server" && urlInputElt.value) {
        // Clear the server list
        _clearServerList();
        // Save the new action => url
        actionHistory[0] = { state: "url" };
        // Load data
        _loadData(url);
      }
      // Check if the last action is about the url input and if there is a selected server in the list
      else if (lastAction.state === "url" && serverListElt.value) {
        // Check if the selected server option is "default"
        if (serverListElt.value === "default") {
          // Then, just load data
          _loadData(url);
        }
        // Check if the selected value server is not "default"
        else if (serverListElt.value !== "default") {
          // Clear url input
          _clearUrlInput();
          // Save the new action => server
          actionHistory[0] = { state: "server" };
          // Load data
          _loadData(url);
          // Add url in the input
          urlInputElt.value = url;
        }
      }
    }

    // If there is no action
    if (actionHistory.length === 0) {
      // Check if the selected server option is "default"
      if (serverListElt.value !== "default") {
        // Save the current action
        actionHistory[0] = { state: "server" };
        // Load data
        _loadData(url);
        // Add url in the input
        urlInputElt.value = url;
      }
      // Check if the url input is not null
      else if (urlInputElt.value !== "") {
        // Save the current action
        actionHistory[0] = { state: "url" };
        // Load data
        _loadData(url);
      }
    }
  }

  function _parseCollection(data) {
    let nbTotalResults = data.collections.length;
    let layers = data.collections;

    return {
      nbTotalResults,
      //nextRecord,
      layers,
    };
  }

  function _error(message) {
    let parentDiv = document.getElementById("addlayers_results");
    // Empty parentDiv
    parentDiv.innerHTML = "";
    _message(message, "alert-danger", parentDiv);
  }

  /**
   * private Method: _showLayerList. Used to render HTML from a layerList
   */
  var _showLayerList = function (layerList, parentDiv) {
    // Empty parentDiv
    parentDiv.innerHTML = "";

    $.each(layerList, function (id, layer) {
      let btn = document.createElement("button");
      btn.className = "vcenter";

      let btnIcon = document.createElement("i");
      btnIcon.className = "ri-add-circle-line";

      btn.appendChild(btnIcon);

      let childContainerRow = document.createElement("div");
      childContainerRow.className = "row";

      let childContainerCol = document.createElement("div");
      childContainerCol.className = "col-md-12";

      childContainerRow.appendChild(childContainerCol);

      btn.addEventListener("click", function () {
        _findItems(layer, this);

        btnIcon.className = "fas fa-spinner fa-spin";

        setTimeout(function () {
          btnIcon.className = "ri-checkbox-circle-fill";
        }, 2000);
      });

      let rowClass = layer.Layer && layer.Layer.length > 0 ? "" : "layer-result-row";

      const layerContentRow = document.createElement("div");
      layerContentRow.className = `pl-1 ${rowClass} list-group-item`;

      let layerContent = document.createElement("div");
      layerContent.className = "col-md-8";

      const btnContent = document.createElement("div");
      btnContent.className = "col-md-1";

      let title = document.createElement("span");
      title.textContent = `${layer.title}`;
      title.className = "layer-result";
      title.title = `${layer.title}`;

      layerContentRow.appendChild(btnContent);
      layerContentRow.appendChild(layerContent);
      layerContent.appendChild(title);

      let br = document.createElement("br");
      let layerResult = document.createElement("span");
      layerResult.textContent = `${layer.description}`;
      layerResult.className = "layer-result-descr";
      layerResult.title = `${layer.description}`;

      layerContent.appendChild(br);
      layerContent.appendChild(layerResult);

      let divLayerContentRow = document.createElement("div");
      divLayerContentRow.className = "col-md-3";

      layerContentRow.appendChild(divLayerContentRow);

      btnContent.appendChild(btn);

      parentDiv.appendChild(layerContentRow);
    });
  };

  var _findItems = function (layer, button) {
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
   * This function is a copy of the addlayers.message() function => Unlike the original, this one works on native JavaScript rather than Jquery
   * _message Show message method.
   * @param {String} msg
   */
  var _message = function (msg, cls, parentDiv) {
    var item = document.createElement("div");
    item.className = `alert ${cls} alert-dismissible`;
    item.role = "alert";
    item.id = "divAlertAddLayers";

    let itemButton = document.createElement("button");
    itemButton.type = "button";
    itemButton.className = "btn-close";
    itemButton.ariaLabel = "Close";
    itemButton.setAttribute("data-bs-dismiss", "alert");
    item.appendChild(itemButton);

    item.innerHTML += mviewer.tr(msg);

    parentDiv.appendChild(item);
  };

  var _clearTab = () => {
    _clearResultsList();
    _clearErrorMessage();
    _clearUrlInput();
    _clearServerList();

    actionHistory = [];
  };

  var _clearErrorMessage = () => {
    let divAlertAddLayers = document.getElementById("divAlertAddLayers");

    if (divAlertAddLayers) {
      document.getElementById("divAlertAddLayers").style.display = "none";
    }
  };

  var _clearResultsList = () => {
    let resultsFeature = document.getElementById("addlayers_results");

    if (resultsFeature) {
      resultsFeature.innerHTML = "";
    }
  };

  var _clearUrlInput = () => {
    let urlTextApiFeature = document.getElementById("addLayers_service_url_api_features");

    if (urlTextApiFeature) {
      urlTextApiFeature.value = "";
    }
  };

  var _clearServerList = () => {
    let serverListApiFeature = document.getElementById(
      "addLayers_service_url_api_features_select"
    );

    if (serverListApiFeature.value !== "default") {
      serverListApiFeature.value = "default";
    }
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
      queryable: true,
      infospanel: "right-panel",
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
    clearErrorMessage: _clearErrorMessage,
    clearResultsList: _clearTab,
  };
})();
