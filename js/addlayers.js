var capabilitiesParser = (function () {
  /**
   * Parse a CSW GetRecords response into a normalized list of WMS layers.
   * @param {string} data - Raw XML response returned by the CSW service.
   * @param {string} url - URL of the CSW request.
   * @returns {{nbTotalResults: number, nextRecord: number, layers: Array<Object>}} Parsed layers and paging metadata.
   */
  var _parseCSW = function (data, url) {
    data = data.replace(/csw:/g, "");
    const doc = new DOMParser().parseFromString(data, "text/xml");

    capabilitiesFromXML = _xmlToJson(doc);

    const nbTotalResults = Number(
      capabilitiesFromXML.GetRecordsResponse.SearchResults["@attributes"]
        .numberOfRecordsMatched
    );
    const nextRecord = Number(
      capabilitiesFromXML.GetRecordsResponse.SearchResults["@attributes"].nextRecord
    );
    let layers = [];
    if (nbTotalResults == 0) {
      return {
        nbTotalResults,
        nextRecord,
        layers,
      };
    }
    layers = capabilitiesFromXML.GetRecordsResponse.SearchResults.Record.filter((x) => {
      // filter record that don't contain WMS layer name or url
      if (!Array.isArray(x["dc:URI"])) {
        x["dc:URI"] = [x["dc:URI"]];
      }
      if (!x["dc:URI"]) {
        return false;
      }
      let wmsRessource = x["dc:URI"].find(
        (x) =>
          x &&
          x["@attributes"] &&
          x["@attributes"].protocol &&
          x["@attributes"].protocol.indexOf("OGC:WMS") >= 0
      );
      return (
        wmsRessource != undefined &&
        wmsRessource["#text"].indexOf("application.i2") < 0 &&
        wmsRessource["@attributes"].name &&
        wmsRessource["@attributes"].name.indexOf(" ") < 0 &&
        wmsRessource["@attributes"].name.length > 0
      );
    }).map((x) => {
      if (!Array.isArray(x["dc:URI"])) {
        x["dc:URI"] = [x["dc:URI"]];
      }
      let wmsRessource = x["dc:URI"].find(
        (x) =>
          x["@attributes"] &&
          x["@attributes"].protocol &&
          x["@attributes"].protocol.indexOf("OGC:WMS") >= 0
      );
      let url = wmsRessource["#text"];
      let name = wmsRessource["@attributes"].name;
      let title = x["dc:title"]["#text"];
      if (url.indexOf("&layers") > 0) {
        //GeoIDe Case
        let sp = new URLSearchParams(url);
        if (!title) {
          title = name;
        }
        name = sp.get("layers");
      }
      let retour = {
        Name: name,
        Url: url,
        Title: title,
        Abstract: x["dc:description"]["#text"],
      };

      let thumbnail = x["dc:URI"].find(
        (x) =>
          x["@attributes"] &&
          x["@attributes"].name &&
          x["@attributes"].name.indexOf("thumbnail") >= 0
      );
      if (thumbnail) {
        retour.Thumbnail = thumbnail["#text"];
      }
      return retour;
    });

    return {
      nbTotalResults,
      nextRecord,
      layers,
    };
  };

  /**
   * Parse a WMS capabilities document and enrich the returned structure with layer metadata.
   * @param {string} data - Raw WMS capabilities XML.
   * @param {string} url - URL of the WMS capabilities request.
   * @returns {Object} Parsed capabilities object enriched with layer info.
   */
  var _parse = function (data, url) {
    data = data.replace(/https:\/\/www.opengis/g, "http://www.opengis");
    data = data.replace(/https:\/\/www.w3/g, "http://www.w3");
    const doc = new DOMParser().parseFromString(data, "text/xml");
    const capabilitiesFromXML = _xmlToJson(doc);
    const capabilities = new ol.format.WMSCapabilities().read(data);
    _addWmsInfosLayer(capabilities, capabilitiesFromXML, data);

    return capabilities;
  };

  /**
   * Post-process WMS capabilities data to normalize layer metadata across service versions.
   * @param {Object} capa - Parsed capabilities object.
   * @param {Object} xmlCapabilities - XML capabilities converted to JSON.
   * @param {string} rawData - Raw XML payload used for compatibility checks.
   * @returns {void}
   */
  var _addWmsInfosLayer = function (capa, xmlCapabilities, rawData) {
    if (capa.Capability.Layer.Layer) {
      capa.layers = capa.Capability.Layer.Layer;
    } else {
      capa.layers = [];
    }
    const isWMS111 = xmlCapabilities.WMT_MS_Capabilities && capa.version == "1.1.1";
    const isMapServer = rawData.indexOf("MapServer version") > 0;

    // add workspace prefix to layer name if not present
    // si le layerName n'a pas de préfix mais que son style à un prefix, on le récupère
    // Ceci arrive quand on interoge le capabilities a partir du workspace et pas du service wms racine
    // par ex: geoserver/rte/wms?request=GetCapabilities
    capa.layers.forEach((element) => {
      element.status = "";

      // ce hack pour récupérer le nom du workspace a partir du style ne fonctionne pas avec mapserver
      if (
        !isMapServer &&
        element.Style &&
        element.Style.length > 0 &&
        element.Name.indexOf(":") < 0 &&
        element.Style[0].Name.indexOf(":") > 0
      ) {
        element.Name = `${element.Style[0].Name.split(":")[0]}:${element.Name}`;
      }
    });
    if (isWMS111) {
      const layers = xmlCapabilities.WMT_MS_Capabilities[1].Capability.Layer.Layer;
      capa.layers.forEach((element, index) => {
        if (element.EX_GeographicBoundingBox == undefined) {
          const coords = layers[index].LatLonBoundingBox["@attributes"];

          element.EX_GeographicBoundingBox = [
            Number(coords.minx),
            Number(coords.miny),
            Number(coords.maxx),
            Number(coords.maxy),
          ];
        }
      });
    }
  };
  /**
   * Convert an XML document into a JavaScript object.
   * @param {Node} xml - XML node to transform.
   * @returns {Object} JSON-like representation of the XML tree.
   */
  var _xmlToJson = function (xml) {
    let obj = {};

    if (xml.nodeType == 1) {
      // element
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j += 1) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i += 1) {
        const item = xml.childNodes.item(i);
        const { nodeName } = item;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = _xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(_xmlToJson(item));
        }
      }
    }
    return obj;
  };

  return {
    parse: _parse,
    parseCSW: _parseCSW,
  };
})();

var addlayers = (function () {
  /**
   * Property: _map
   *  @type {ol.Map}
   */
  var _map;

  /**
   * addlayers tool enabled.
   * @type {boolean}
   */
  var _addlayersEnabled = false;

  var _url = undefined;

  var _urlCsw = undefined;

  var _selectedServer = null;

  /**
   * is tool already loaded.
   * @type {boolean}
   */
  var _loaded = false;

  /**
   * config of the ogc and csw server list.
   */
  var _config = {};

  /**
   * paging parameters.
   */
  var _pagingInfos = {
    pageSize: 100,
    currentPage: 0,
    nbPages: 1,
  };

  /**
   * Resolve the JSON configuration file used for the add-layers server list.
   * @returns {string} Relative URL of the server configuration JSON file.
   */
  var _getServerConfigUrl = function () {
    const appConfig = configuration.getConfiguration()?.application;
    if (appConfig?.addlayerconfig) {
      return appConfig.addlayerconfig;
    }
    return "demo/data/ogc_csw_server.json";
  };

  /**
   * Initialize the add-layers tool, load the server list and bind the UI events.
   * @returns {void}
   */
  var _init = function () {
    if (!_loaded) {
      _map = mviewer.getMap();
      // load server list config
      const serverConfigUrl = _getServerConfigUrl();
      fetch(mviewer.ajaxURL(serverConfigUrl, false))
        .then((response) => response.json())
        .catch(function (error) {
          mviewer.alert(
            "Impossible de récupérer la liste des serveurs csw et ogc",
            "alert-warning"
          );
        })
        .then((json) => {
          _config = json;
          json.csw.map((x) => {
            document
              .querySelector("#addLayers_service_url_csw_select")
              ?.insertAdjacentHTML(
                "beforeend",
                `<option value="${x.url}">${x.label}</option>`
              );
          });
          json.ogc.map((x) => {
            document
              .querySelector("#addLayers_service_url_select")
              ?.insertAdjacentHTML(
                "beforeend",
                `<option value="${x.url}">${x.label}</option>`
              );
          });
          json.api_features.map((x) => {
            document
              .querySelector("#addLayers_service_url_api_features_select")
              ?.insertAdjacentHTML(
                "beforeend",
                `<option value="${x.url}">${x.label}</option>`
              );
          });
        });
      //Add html elements to the DOM

      var button = `<li class="half" id="addLayerMenuBtn">
            <a href="#" onclick="mviewer.tools.addlayers.toggle();">
            <span class="fa-stack">
              <i class="fas fa-plus fa-solid "></i>
            </span>Ajouter des données</a>
            </li>`;

      document.querySelector("#menu")?.insertAdjacentHTML("beforeend", `<hr>${button}`);

      document
        .querySelector("#addLayerpanel")
        ?.addEventListener("hidden.bs.modal", function () {
          _addlayersEnabled = false;
        });

      document
        .querySelector("#addLayers_service_url_select")
        ?.addEventListener("change", function () {
          _url = this.value;
          document.querySelector("#addLayers_service_url").value = _url;
          _connectServer();
        });
      document
        .querySelector("#addLayers_service_url_csw_select")
        ?.addEventListener("change", function () {
          _url = this.value;
          document.querySelector("#addLayers_service_url_csw").value = _url;
          _connectCsw();
        });
      document
        .querySelector("#addLayers_service_url_api_features_select")
        ?.addEventListener("change", function () {
          _url = this.value;
          this.value = _url;
          apiFeatures.clearErrorMessage();
          apiFeatures.connect(_url);
        });
    }
    _loaded = true;

    // if parameter in url to automatically add a layer
    if (API.addLayer) {
      const layerInfos = JSON.parse(API.addLayer);
      _addLayer({
        Name: layerInfos.name,
        Url: layerInfos.url,
        Title: layerInfos.title,
        filter: layerInfos.filter,
      });
    }

    const btnConnectWms = document.getElementById("addLayers_service_url");
    const btnConnectCsw = document.getElementById("addLayers_service_url_csw");
    const filterCsw = document.getElementById("addLayers_service_filter_csw");

    if (btnConnectWms) {
      btnConnectWms.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          _connect(btnConnectWms.value);
        }
      });
    }
    const triggerCswSearch = function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        _pagingInfos.currentPage = 0;
        _connectCsw();
      }
    };
    if (btnConnectCsw) {
      btnConnectCsw.addEventListener("keydown", triggerCswSearch);
    }
    if (filterCsw) {
      filterCsw.addEventListener("keydown", triggerCswSearch);
    }
  };

  /**
   * Show or hide the add-layers panel.
   * @returns {void}
   */
  var _toggle = function () {
    _addlayersEnabled = !_addlayersEnabled;
    if (_addlayersEnabled) {
      bootstrap.Modal.getOrCreateInstance(
        document.querySelector("#addLayerpanel")
      ).show();
    }
  };

  /**
   * Connect to the manually entered WMS service and display the available layers.
   * @returns {void}
   */
  var _connect = function () {
    _url = document.getElementById("addLayers_service_url").value;
    //_url = $("#addLayers_service_url").val();
    _connectServer();
  };

  /**
   * Display an error message in the add-layers results panel.
   * @param {string} textContent - Error message to render.
   * @returns {void}
   */
  var _error = function (textContent) {
    let addLayersResults = document.getElementById("addlayers_results");
    addLayersResults.innerHTML = "";
    _message(textContent, "alert-danger", addLayersResults);
    // $("#addlayers_results").empty();
    // _message(textContent, "alert-danger", $("#addlayers_results"));
  };

  /**
   * Render an alert message inside the given parent container.
   * @param {string} msg - Message to display.
   * @param {string} cls - Bootstrap alert class to apply.
   * @param {HTMLElement} parentDiv - Container that will receive the message.
   * @returns {void}
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
    // var item = $(
    //   [
    //     '<div class="alert ' + cls + ' alert-dismissible" role="alert">',
    //     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
    //     '<span aria-hidden="true">&times;</span></button>',
    //     mviewer.tr(msg),
    //     "</div>",
    //   ].join("")
    // );
    // parentDiv.append(item);
  };
  /**
   * Wrap an AJAX call in a Promise.
   * @param {Object} options - jQuery AJAX options.
   * @returns {Promise} Promise resolved or rejected with the AJAX result.
   */
  var _ajaxPromise = function (options) {
    return new Promise(function (resolve, reject) {
      $.ajax(options).done(resolve).fail(reject);
    });
  };

  /**
   * Render the list of layers returned by a capabilities request.
   * @param {Array<Object>} layerList - Layer descriptors to display.
   * @param {HTMLElement} parentDiv - Container where the layer list is appended.
   * @returns {void}
   */
  var _showLayerList = function (layerList, parentDiv) {
    parentDiv.replaceChildren();
    layerList.forEach(function (layer) {
      const btn = document.createElement("button");
      btn.className = "vcenter";
      btn.insertAdjacentHTML("beforeend", '<i class="ri-add-circle-line"></i>');

      const childContainerRow = document.createElement("div");
      childContainerRow.className = "row";
      const childContainerCol = document.createElement("div");
      childContainerCol.className = "col-md-12";
      childContainerRow.append(childContainerCol);
      btn.addEventListener("click", function () {
        _addLayer(layer, this);
      });
      let rowClass = layer.Layer && layer.Layer.length > 0 ? "" : "layer-result-row";
      const layerContentRow = document.createElement("div");
      layerContentRow.className = `pl-1 ${rowClass} list-group-item`;
      let layerContent = document.createElement("div");
      layerContent.className = "col-md-8";
      const btnContent = document.createElement("div");
      btnContent.className = "col-md-1";

      let title = document.createElement("span");
      title.className = "layer-result";
      title.title = layer.Title;
      title.textContent = layer.Title;
      if (layer.Abstract == undefined) {
        layer.Abstract = "";
      }
      // if layer is a layer list, recursive call
      if (layer.Layer && layer.Layer.length > 0) {
        layerContent = document.createElement("div");
        layerContent.className = "col-md-12";
        title = document.createElement("div");
        title.className = "layer-result layerGroup";
        title.title = layer.Title;
        title.textContent = layer.Title;
        layerContentRow.append(layerContent);
        layerContent.append(title);
        layerContent.append(childContainerRow);
        _showLayerList(layer.Layer, childContainerCol);
      } else {
        if (layer.Name) {
          layerContentRow.append(btnContent);
        }

        layerContentRow.append(layerContent);
        layerContent.append(title);
        const description = document.createElement("div");
        description.className = "layer-result-descr";
        description.title = layer.Abstract;
        description.textContent = layer.Abstract;
        layerContent.append(description);
        if (layer.Thumbnail) {
          const thumbnailContainer = document.createElement("div");
          thumbnailContainer.className = "col-md-3";
          const thumbnail = document.createElement("img");
          thumbnail.className = "thumb_csw";
          thumbnail.width = 200;
          thumbnail.src = layer.Thumbnail;
          thumbnail.title = layer.Title;
          thumbnailContainer.append(thumbnail);
          layerContentRow.append(thumbnailContainer);
        } else {
          const thumbnailContainer = document.createElement("div");
          thumbnailContainer.className = "col-md-3";
          layerContentRow.append(thumbnailContainer);
        }

        btnContent.append(btn);
      }
      parentDiv.append(layerContentRow);
    });
  };

  /**
   * Add a selected layer to the map and register it as queryable.
   * @param {Object} layer - Layer descriptor returned by the WMS/CSW capabilities parser.
   * @param {HTMLElement} [btn] - Optional button element updated after the layer is added.
   * @returns {void}
   */
  var _addLayer = function (layer, btn) {
    let wmsUrl = _url;
    if (layer.Url) {
      wmsUrl = layer.Url;
    }
    var clean_ident = layer.Name.replace(/:|,| |\./g, "");
    var oLayer = {
      type: "wms",
      layername: layer.Name,
      name: layer.Title,
      title: layer.Title,
      tiled: true,
      showintoc: true,
      queryable: true,
      dynamiclegend: true,
      infoformat: "application/vnd.ogc.gml",
      draggable: true,
      checked: true,
      opacity: 1,
      style: "",
      infospanel: "right-panel",
      id: clean_ident,
      layerid: clean_ident,
      url: wmsUrl,
      filter: layer.filter,
    };
    if (layer.Style) {
      oLayer.style = layer.Style[0].Name;
      oLayer.stylesalias = layer.Style[0].Title;
    }
    oLayer.legendurl = mviewer.getLegendUrl(oLayer);
    configuration.processWmsLayer(oLayer, {}, []);
    mviewer.addLayer(oLayer);
    info.addQueryableLayer(oLayer);
    if (btn) {
      btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i>';
    }
  };

  /**
   * Query a WMS capabilities endpoint and display the returned layers.
   * @param {string} url - Capabilities URL to request.
   * @returns {void}
   */
  var _getCapabilities = function (url) {
    document
      .querySelector("#addlayers_results_loading")
      ?.style.setProperty("display", "block");
    _ajaxPromise({
      url: url,
      type: "get",
      dataType: "text",
    })
      .then(
        function onSuccess(data) {
          const capabilities = capabilitiesParser.parse(data, url);
          _resultList = capabilities;
          if (_resultList !== null) {
            _layerList = _resultList.layers;
            _showLayerList(_layerList, document.querySelector("#addlayers_results"));
          }
          document
            .querySelector("#addlayers_results_loading")
            ?.style.setProperty("display", "none");
        },
        function onError(jqXHR, textStatus, errorThrown) {
          var message = `Problème réseau pour intérroger <strong>${url}</strong><br>`;
          if (jqXHR.responseText) {
            message += jqXHR.responseText;
          }
          _error(message);
          document
            .querySelector("#addlayers_results_loading")
            ?.style.setProperty("display", "none");
        }
      )
      .catch(function errorHandler(error) {
        var message = `Problème réseau pour intérroger <strong>${url}</strong><br>`;
        _error(message);
        document
          .querySelector("#addlayers_results_loading")
          ?.style.setProperty("display", "none");
      });
  };
  /**
   * Query a CSW service and display the layers matching the selected filter.
   * @returns {void}
   */
  var _connectCsw = function () {
    // _urlCsw = $("#addLayers_service_url_csw").val();
    _urlCsw = document.getElementById("addLayers_service_url_csw").value;
    // let filterCsw = $("#addLayers_service_filter_csw").val();
    let filterCsw = document.getElementById("addLayers_service_filter_csw").value;
    let selectedServer = _config.csw.find((x) => x.url == _urlCsw);
    let filterTxt = `protocol='OGC:WMS-1.1.1-http-get-map' OR protocol='OGC:WMS'`;
    if (selectedServer) {
      filterTxt = selectedServer.defaultfilter;
    }

    if (filterCsw.length > 0) {
      if (filterTxt.length > 0) {
        filterTxt = `(${filterTxt}) AND title Like '%${filterCsw}%'`;
      } else {
        filterTxt = `title Like '%${filterCsw}%'`;
      }
    }

    let addLayersResults = document.getElementById("addlayers_results");
    let addLayersResultsLoading = document.getElementById("addlayers_results_loading");

    // Empty
    addLayersResults.innerHTML = "";
    let startPos = _pagingInfos.currentPage * _pagingInfos.pageSize + 1;
    const params = `?request=GetRecords&service=CSW&version=2.0.2&typeNames=csw:Record&resultType=results&maxRecords=${_pagingInfos.pageSize}&startPosition=${startPos}&ELEMENTSETNAME=full`;
    const filter = encodeURIComponent(filterTxt);
    const url = `${_urlCsw}${params}&constraintLanguage=CQL_TEXT&CONSTRAINT_LANGUAGE_VERSION=1.1.0&CONSTRAINT=${filter}`;
    // Show
    addLayersResultsLoading.style.display = "block";
    _ajaxPromise({
      url: url,
      type: "get",
      dataType: "text",
    })
      .then(
        function onSuccess(data) {
          if (data.indexOf("ExceptionReport") > 0) {
            let message = `Problème réseau pour intérroger <strong>${url}</strong><br>`;
            message += data;
            _error(message);
            return;
          }
          const capabilities = capabilitiesParser.parseCSW(data, url);
          _resultList = capabilities;
          if (_resultList !== null) {
            _layerList = _resultList.layers;
            _pagingInfos.nbPages = Math.ceil(
              _resultList.nbTotalResults / _pagingInfos.pageSize
            );
            _showLayerList(_layerList, addLayersResults);
            _addPager();
          }
          // Hide
          addLayersResultsLoading.style.display = "none";
        },
        function onError(jqXHR, textStatus, errorThrown) {
          var message = `Problème réseau pour intérroger <strong>${url}</strong><br>`;
          if (jqXHR.responseText) {
            message += jqXHR.responseText;
          }
          _error(message);
          // Hide
          addLayersResultsLoading.style.display = "none";
        }
      )
      .catch(function errorHandler(error) {
        var message = `Problème réseau pour intérroger <strong>${url}<strong><br>`;
        _error(message);
        // Hide
        addLayersResultsLoading.style.display = "none";
      });
  };

  /**
   * Reset the current add-layers UI state and clear the result panel.
   * @returns {void}
   */
  var _clearTab = () => {
    const addLayersResults = document.getElementById("addlayers_results");
    const serverListWms = document.getElementById("addLayers_service_url_select");
    const urlContentWms = document.getElementById("addLayers_service_url");
    const serverListCsw = document.getElementById("addLayers_service_url_csw_select");
    const urlContentCsw = document.getElementById("addLayers_service_url_csw");

    _clearErrorMessage();
    if (addLayersResults) {
      addLayersResults.innerHTML = "";
    }
    if (serverListWms.value !== "default") {
      serverListWms.value = "";
    }
    if (urlContentWms.value !== "") {
      urlContentWms.value = "";
    }
    if (serverListCsw.value !== "default") {
      serverListCsw.value = "";
    }
    if (urlContentCsw.value !== "") {
      urlContentCsw.value = "";
    }
  };

  /**
   * Hide the current alert message displayed in the results panel.
   * @returns {void}
   */
  var _clearErrorMessage = () => {
    let divAlert = document.getElementById("divAlertAddLayers");

    if (divAlert) {
      document.getElementById("divAlertAddLayers").style.display = "none";
    }
  };

  /**
   * Move to the previous page of CSW results.
   * @returns {void}
   */
  var _previousPage = function () {
    _pagingInfos.currentPage -= 1;
    _connectCsw();
  };

  /**
   * Move to the next page of CSW results.
   * @returns {void}
   */
  var _nextPage = function () {
    _pagingInfos.currentPage += 1;
    _connectCsw();
  };

  /**
   * Add pagination controls under the CSW result list.
   * @returns {void}
   */
  var _addPager = function () {
    const pagerContainer = document.querySelector("#addlayers_results_pager");
    pagerContainer?.replaceChildren();
    const previousDisabled = _pagingInfos.currentPage == 0 ? "disabled" : "";
    const nextDisabled =
      _pagingInfos.currentPage == _pagingInfos.nbPages - 1 ? "disabled" : "";
    var pager = `<nav aria-label="...">
                  <ul class="pagination">
                    <li class="page-item ${previousDisabled}">
                      <a class="page-link" href="#" tabindex="-1" onclick="mviewer.tools.addlayers.previousPage();">Précédent</a>
                    </li>
                    <li class="page-item ${nextDisabled}">
                      <a class="page-link" href="#" onclick="mviewer.tools.addlayers.nextPage();">Suivant</a>
                    </li>
                  </ul>
                </nav>`;
    pagerContainer?.insertAdjacentHTML("beforeend", pager);
  };

  /**
   * Prepare and validate a WMS URL before requesting its capabilities.
   * @returns {void}
   */
  var _connectServer = function () {
    let capabilitiesUrl = _url.trim();
    if (capabilitiesUrl.length === 0 && _selectedServer !== null) {
      capabilitiesUrl = _selectedServer.url;
    }
    if (capabilitiesUrl.length === 0) {
      _error("Veuillez renseigner une url ou choisir un serveur dans la liste");
    } else {
      const searchMask = "getCapabilities";
      const regEx = new RegExp(searchMask, "ig");
      if (!regEx.test(capabilitiesUrl)) {
        if (capabilitiesUrl.indexOf("?") > 0) {
          capabilitiesUrl = `${capabilitiesUrl}&request=GetCapabilities`;
        } else {
          capabilitiesUrl = `${capabilitiesUrl}?request=GetCapabilities`;
        }
      }
      const serviceSearchMask = "service=";
      const serviceRegEx = new RegExp(serviceSearchMask, "ig");
      if (!serviceRegEx.test(capabilitiesUrl)) {
        capabilitiesUrl = `${capabilitiesUrl}&service=WMS`;
      }
      _getCapabilities(capabilitiesUrl);
    }
  };

  return {
    init: _init,
    previousPage: _previousPage,
    nextPage: _nextPage,
    toggle: _toggle,
    connect: _connect,
    connectCsw: _connectCsw,
    addLayer: _addLayer,
    message: _message,
    clearResultsList: _clearTab,
  };
})();
