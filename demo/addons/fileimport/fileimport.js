const fileimport = (function () {
  const API_CSV = "https://api-adresse.data.gouv.fr/search/csv/";
  var _button;
  var _buttonActive = false;
  var _importLayer;
  var _srsHTML = ["<option value='EPSG:4326'>EPSG:4326</option>"];

  /**
   * Private method createDefaultOLayerOption
   * Creates default layer options for imported layers
   * @param {*} idLayer
   * @param {*} title
   * @param {*} params
   * @returns
   */
  const createDefaultOLayerOption = (idLayer, title, params) => {
    let id = idLayer || _.uniqidId("import_file_");
    return {
      projections: {
        projection: [
          {
            proj4js:
              "'EPSG:3857','+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'",
          },
          {
            proj4js:
              "'EPSG:2154','+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'",
          },
        ],
      },
      type: "import",
      id: id,
      name: title,
      visible: "true",
      legendurl: "img/blank.gif",
      urlparam: "file",
      queryable: true,
      vectorlegend: true,
      expanded: true,
      sld: null,
      template: false,
      icon: "fas fa-file",
      layername: id,
      theme: "csv",
      rank: 1,
      index: null,
      title: title,
      layerid: id,
      infospanel: "right-panel",
      style: "",
      toplayer: false,
      draggable: true,
      opacity: 1,
      maxzoom: null,
      minzoom: null,
      tooltip: false,
      tooltipenabled: false,
      tooltipcontent: "",
      timefilter: false,
      timecontrol: "calendar",
      timeshowavailable: false,
      timemin: 2020,
      timemax: 2025,
      attributefilter: false,
      attributeoperator: "=",
      wildcardpattern: "%value%",
      attributestylesync: false,
      attributefilterenabled: false,
      customcontrol: false,
      customcontrolpath: "customcontrols",
      exclusive: false,
      searchable: false,
      checked: true,
      visiblebydefault: true,
      tiled: false,
      dynamiclegend: false,
      nohighlight: false,
      infohighlight: true,
      showintoc: true,
      useproxy: false,
      jsonfields: [],
      secure: "public",
      authentification: false,
      ...params,
    };
  };

  /**
   * Private method _toggleImportLayer
   */
  var _toggleImportLayer = function () {
    _buttonActive = !_buttonActive;
    if (_importLayer) {
      if (_buttonActive) {
        mviewer.addLayer(_importLayer);
      } else {
        var el = $(`#layers-container [data-layerid=${_importLayer.layerid}]`);
        mviewer.removeLayer(el);
      }
    } else {
      var alertText = _getI18NAlertMessage(
        "Pas de couche d'import configurée",
        "fileimport.alert.config"
      );
      mviewer.alert(alertText, "alert-warning");
    }
  };

  /**
   * HTML content of modal for importing csv
   */
  var _wizard_modal = `<div id="geocoding-modal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" i18n="fileimport.modal.title">Options d'import</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label i18n="fileimport.data.title" class="form-label">Titre de la couche importée</label>
          <input type="text" class="csv-name form-control">
        </div>
        <div class="accordion" id="accordion">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                <span i18n="fileimport.select.coordinates">Sélectionnez les champs x, y à utiliser comme coordonnées</span>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
              <div class="accordion-body">
                <table id="table-csv" class="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>      
                      <th scope="col" i18n="fileimport.srs.lon">X (longitude)</th>
                      <th scope="col" i18n="fileimport.srs.lat">Y (latitude)</th>
                      <th scope="col" i18n="fileimport.srs.projection">Projection (SRS)</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" i18n="fileimport.srs.select">Sélectionner</th>
                      <td>
                        <select id="x-select" class="form-select"></select>
                      </td>
                      <td>
                        <select id="y-select" class="form-select"></select>
                      </td>
                      <td>
                        <select id="srs-select" class="form-select"></select>
                      </td>
                      <td>
                        <button id="btn-xy" class="btn btn-light"><i class="ri-reset-left-fill"></i></button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" i18n="fileimport.srs.data">Aperçu</th>
                      <td id="x-data"></td>
                      <td id="y-data"></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                <span i18n="fileimport.select.address">
                  <b>OU |</b> sélectionnez les champs à utiliser pour le géocodage (adresse) </span>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="geocoding csv-fields list-group"></div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                <span i18n="fileimport.select.insee">
                  <b>OU |</b> Sélectionnez le champ à utiliser pour le géocodage (insee) </span>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="insee csv-fields list-group"></div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                <span i18n="fileimport.select.search">
                  <b>OPTIONNEL |</b> Sélectionnez les champ à utiliser pour la recherche </span>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="search csv-fields list-group"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="submit-button" type="button" data-layerid="" onclick="fileimport.geocodeit(this);" class="geocode btn btn-primary" i18n="fileimport.button.submit">Importer</button>
      </div>
    </div>
  </div>
</div>`;

  /**
   * HTML content of modal for importing shp
   * only displayed if no .proj file found and
   * manual selection of SRS necessary
   */
  var _projection_modal = `<div id="projection-modal" class="modal fade" tabindex="-1" role="dialog" >
            <div class="modal-dialog modal-md">
                <div class="modal-content" role="document">
                    <div class="modal-header">
                      <h5 class="modal-title" i18n="fileimport.shpmodal.title">Sélection de la projection</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" >
                        <div class="mb-3">
                            <p i18n="fileimport.shpmodal.comment">L'archive zip n'inclue pas de fichier .prj !</p>
                            <label for="shp-srs-select" i18n="fileimport.shpmodal.subtitle">SRS de la donnée :</label>
                            <select id="shp-srs-select" class="form-select"></select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" data-layerid="" class="geocode btn btn-primary" i18n="fileimport.button.validate">Valider</button>
                    </div>
                </div>
            </div>
        </div>`;

  /**
   * HTML content of drag and drop zone
   */
  var _template = function (oLayer) {
    return `
    <div class="form-group mb-3">
      <label for="importFileByUrl" class="mb-1">Charger un fichier via une URL</label>
      <div class="input-group">
        <input type="text" class="form-control form-control-sm" id="importFileByUrl" placeholder="http://example.com/file.csv">
        <button class="btn btn-sm btn-primary" type="button" onclick="fileimport.loadUrlFile('${oLayer.layerid}')">Valider</button>
      </div>
    </div>
    <label for="importFileByUrl" class="mb-1">Téléverser un fichier</label>
    <div class="dropzone dz-clickable" id="drop_zone" onclick="$('#loadcsv-${oLayer.layerid}').click();" ondrop="fileimport.dropHandler(event);" ondragover="fileimport.dragOverHandler(event);">
        <div id="csv-status" class="start">
            <div class="dz-default dz-message"><span class="fas fa-cloud-upload-alt fa-3x"></span>
                <p i18n="fileimport.upload.dropzone">Glisser un fichier GeoJSON, CSV ou SHP (en ZIP) ici ou clic pour sélectionner un fichier...</p>
            </div>
            <div class="dz-work dz-message"><span class="fas fa-spin fa-cog fa-3x"></span>
                <p i18n="fileimport.upload.processing">Traitement en cours</p>
            </div>
        </div>
    </div>
    <input type="file" name="filebutton" onchange="fileimport.loadLocalFile('${oLayer.layerid}')" style="visibility:hidden;" id="loadcsv-${oLayer.layerid}"/>`;
  };

  /**Veifiy if coordinates fields are corrects and return features */
  const isCorrectCSVCoordFields = (data, oLayer) => {
    // Check if the CSV has at least two fields for coordinates
    const parsedData = Papa.parse(data, { header: true });
    let withXY = parsedData.data.filter((f) => f[oLayer.xfield] && f[oLayer.yfield]);
    return withXY.length > 0;
  };

  /**
   * Private method _loadUrlFile
   * Reads csv from URL and calls _initCsvModal with parsed data.
   * @param {*} idLayer
   */
  const _loadUrlFile = function (idLayer, urlFromAPI) {
    const url = urlFromAPI || document.getElementById("importFileByUrl").value;
    const oLayer = mviewer.getLayers()[idLayer];
    // clear previous data
    oLayer.layer.getSource().clear();
    // read csv from URL
    fetch(url).then((response) => {
      if (response.ok) {
        response.text().then((data) => {
          // call _mapCSV with parsed data
          if (oLayer.xfield && oLayer.yfield && isCorrectCSVCoordFields(data, oLayer)) {
            _mapCSV(data, oLayer, oLayer.layer, "");
          } else {
            _initCsvModal(idLayer, data, oLayer, "grist.csv");
          }
          oLayer.layer.set("url", url);
          setPermaLink({
            file: url,
            xfield: oLayer.xfield,
            yfield: oLayer.yfield,
          });
        });
      } else {
        var alertText = _getI18NAlertMessage(
          "Problème avec la récupération du fichier csv",
          "fileimport.alert.fileloading"
        );
        mviewer.alert(alertText + response.statusText, "alert-warning");
      }
    });
  };

  /**
   * Private method _loadLocalFile
   * Clears features, registers SRS and checks mimetype to decide between csv and shp import
   * @param {String} idlayer
   * @param {File} file
   */
  var _loadLocalFile = function (idlayer, file) {
    if (!file) {
      file = document.getElementById("loadcsv-" + idlayer).files[0];
    }
    if (file) {
      //remove existing features
      mviewer.getLayers()[idlayer].layer.getSource().clear();
      var oLayer = mviewer.getLayers()[idlayer];
      //register SRS on first load
      if (_srsHTML.length === 1) _registerSRS(oLayer);
      var zipMimeTypes = [
        "application/zip",
        "application/octet-stream",
        "application/x-zip-compressed",
        "application/x-compressed",
        "multipart/x-zip",
      ];
      if (zipMimeTypes.includes(file.type)) {
        _unzip(file, oLayer);

        // regex fix windows OS empty type with .geojson format
      } else if (
        /\.geojson$/i.test(file.name) ||
        ["application/geo+json", "application/json"].includes(file.type)
      ) {
        // Load GeoJSON directly
        var reader = new FileReader();
        reader.onload = function (evt) {
          loadGeoJson(oLayer, oLayer.layer, evt.target.result);
        };
        reader.readAsText(file);
      } else {
        fileToData(idlayer, file, oLayer);
      }
    }
  };

  /**
   * Private method _registerSRS
   * Registers SRS indicated in config.xml and creates HTML dropdown
   * used for csv and shp (without .prj)
   * @param {Object} oLayer
   */
  var _registerSRS = function (oLayer) {
    if (oLayer.projections && oLayer.projections.projection) {
      oLayer.projections.projection.forEach(function (p) {
        //register projections
        proj4.defs(p.proj4js);
        ol.proj.proj4.register(proj4);
        //format projections for html select
        var epsg = p.proj4js.split(",")[0].replace(/['"]+/g, "");
        _srsHTML.push(`<option value="${epsg}">${epsg}</option>`);
      });
    }
  };

  /**
   * Private method fileToData
   * Utility method for _loadLocalFile to read csv file and init modal with data from it.
   * @param {string} idlayer
   * @param {*} file
   * @param {object} oLayer
   */
  const fileToData = (idlayer, file, oLayer) => {
    var reader = new FileReader();
    //Constraint : file must be encoded in UTF-8 and first line is named fields
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
      const data = evt.target.result;
      _initCsvModal(idlayer, data, oLayer, file.name);
    };
    reader.onerror = function (evt) {
      alert(
        _getI18NAlertMessage(
          "Erreur de lecture de fichier",
          "fileimport.alert.filereader"
        )
      );
    };
  };

  /**
   * Private method _initCsvModal
   * Displays and inits modal for csv import, clearing and initializing values and events.
   * Parses csv to json. Calls _geocode() or _mapCSV() depending on presence of coords in data.
   * @param {String} idlayer
   * @param {File} file
   * @param {Object} oLayer
   */
  var _initCsvModal = function (idlayer, data, oLayer, name) {
    _resetForms();

    //Show wizard modal
    $("#geocoding-modal").modal("show");
    $("#geocoding-modal button.geocode").attr("data-layerid", idlayer);
    //update layer title with file name
    $("#geocoding-modal .csv-name").val(name);
    //Parse csv file to convert it as json object
    var tmp = Papa.parse(data, { header: true });
    var fields = [];
    //Get fields of loaded file
    tmp.meta.fields.forEach(function (f) {
      fields.push('<a href="#" class="list-group-item">' + f + "</a>");
    });
    //Update 3 wizard sections with field names
    $("#geocoding-modal .csv-fields").append(fields.join(" "));
    //Enable selection on each item
    $("#geocoding-modal .csv-fields a").click(function () {
      $(this).toggleClass("active");
    });
    //Init coordinate tab with data and events
    _initCoordsTab(tmp, oLayer);
    //Launch geocoding with custom parameters
    $("#geocoding-modal")
      .off()
      .on("geocoding-" + idlayer + "-ready", function (e) {
        e.preventDefault();
        e.stopPropagation();
        //get select fields to use for geocoding
        var fields = [];
        var fusefields = [];
        //get select fields to use for geocoding
        $("#geocoding-modal .geocoding.csv-fields a.active").each(function (i, f) {
          fields.push(f.textContent);
        });
        // update global layer parameters
        oLayer.geocodingfields = fields;
        // get optional selected field to use as citycode (insee)
        if ($("#geocoding-modal .insee.csv-fields a.active").length > 0) {
          oLayer.geocodingcitycode = $("#geocoding-modal .insee.csv-fields a.active")
            .first()
            .text();
        } else {
          oLayer.geocodingcitycode = false;
        }
        //Enable fuse search
        $("#geocoding-modal .search.csv-fields a.active").each(function (i, f) {
          fusefields.push(f.textContent);
        });
        if (fusefields.length > 0) {
          oLayer.fusesearchkeys = fusefields.join(",");
          oLayer.fusesearchresult = "{{" + fusefields[0] + "}}";
          oLayer.searchengine = "fuse";
          // Enable tooltip as well
          oLayer.tooltip = true;
          oLayer.tooltipcontent = oLayer.fusesearchresult;
          search.processSearchableLayer(oLayer);
        }
        //update layer title in legend panel
        var title = $("#geocoding-modal .csv-name").val();
        $(
          ".mv-layer-details[data-layerid='" +
            idlayer +
            "'] .layerdisplay-title > .layerdisplay-titleLabel > div"
        )
          .first()
          .text(title);
        $(".mv-layer-details[data-layerid='" + idlayer + "']").data(
          "data-layerid",
          title
        );

        if ($("#panelsStayOpen-collapseOne").hasClass("show") !== false) {
          oLayer.xfield = $("#x-select").val();
          oLayer.yfield = $("#y-select").val();
          oLayer.layer.set("xfield", oLayer.xfield);
          oLayer.layer.set("yfield", oLayer.yfield);
          _mapCSV(data, oLayer, oLayer.layer, $("#srs-select").val());
        } else {
          // geocode file
          _geocode(data, oLayer, oLayer.layer);
        }
        //hide wizard
        $("#geocoding-modal").modal("hide");
        return false;
      });
  };

  /**
   * Private method _resetForms
   * Utility method for _initCsvModal to clear values
   */
  var _resetForms = function () {
    $("#geocoding-modal .csv-fields a").remove();
    $("#x-select option").remove();
    $("#y-select option").remove();
    $("#srs-select option").remove();
  };

  /**
   * Private method _initCoordsTab
   * Utility method for _initCsvModal to init coords tab with values
   */
  var _initCoordsTab = function (tmp, oLayer) {
    // init xy select options
    var options = [];
    tmp.meta.fields.forEach(function (f) {
      options.push(`<option value="${f}">${f}</option>`);
    });
    $("#x-select").append(options.join(" "));
    $("#y-select").append(options.join(" "));

    // take last two fields as coords by default
    $("#x-select").val(tmp.meta.fields[tmp.meta.fields.length - 2]);
    $("#y-select").val(tmp.meta.fields[tmp.meta.fields.length - 1]);

    // init and update xy data preview
    $("#x-data").text(tmp.data[0][$("#x-select").val()]);
    $("#y-data").text(tmp.data[0][$("#y-select").val()]);

    $("#x-select").change(function (e) {
      $("#x-data").text(tmp.data[0][e.target.value]);
    });
    $("#y-select").change(function (e) {
      $("#y-data").text(tmp.data[0][e.target.value]);
    });

    // switch select option values and data preview via button
    $("#btn-xy")
      .off()
      .on("click", function () {
        var xToY = $("#x-select").val();
        $("#x-select").val($("#y-select").val()).trigger("change");
        $("#y-select").val(xToY).trigger("change");
      });

    // init srs select option
    $("#srs-select").append(_srsHTML.join(" "));
  };

  /**
   * Private method _unzip
   * Unzips .shp, .dbf and .prj
   * Aborts, displaying error messages to user if .shp or .dbf missing.
   * Displays modal to choose SRS if .proj is missing.
   * @param {File} file
   * @param {Object} oLayer
   */
  var _unzip = function (file, oLayer) {
    zip.workerScripts = {
      inflater: [
        "demo/addons/fileimport/lib/z-worker.js",
        "demo/addons/fileimport/lib/inflate.js",
      ],
    };
    zip.createReader(
      new zip.BlobReader(file),
      function (zipReader) {
        zipReader.getEntries(function (entries) {
          if (entries.length) {
            var shpfile = entries.filter(
              (entry) => entry.filename.split(".")[1] === "shp"
            )[0];
            var dbffile = entries.filter(
              (entry) => entry.filename.split(".")[1] === "dbf"
            )[0];
            var prjfile = entries.filter(
              (entry) => entry.filename.split(".")[1] === "prj"
            )[0];
            if (shpfile) {
              var shpPromise = _getFileContents(shpfile, "application/octet-stream");
              var dbfPromise = _getFileContents(dbffile, "application/x-dbase");
              if (prjfile) {
                //get projection from .prj file
                _getFileContents(prjfile, "text/txt").then(async (prjResponse) => {
                  var prjContents = await prjResponse.text();
                  // register named projection for use in _loadShp
                  var projId = `Proj-${Date.now()}`;
                  proj4.defs(projId, prjContents);
                  ol.proj.proj4.register(proj4);
                  _resolveShpDbf(
                    shpPromise,
                    dbfPromise,
                    projId,
                    oLayer,
                    shpfile.filename
                  );
                });
              } else {
                //let user select projection via modal, if no .prj file in zip
                $("#shp-srs-select option").remove();
                $("#shp-srs-select").append(_srsHTML.join(" "));
                $("#projection-modal").modal("show");
                new Promise(function (resolve, reject) {
                  //user projections registered from conf.xml
                  $("#projection-modal .btn").click(() =>
                    resolve($("#shp-srs-select").val())
                  );
                  $("#projection-modal .close").click(() => reject());
                })
                  .then(function (projId) {
                    _resolveShpDbf(
                      shpPromise,
                      dbfPromise,
                      projId,
                      oLayer,
                      shpfile.filename
                    );
                    $("#projection-modal").modal("hide");
                  })
                  .catch(function () {
                    console.log("cancelled shp import");
                  });
              }
            } else {
              var alertText = _getI18NAlertMessage(
                "Pas de fichier shp trouvé",
                "fileimport.alert.shp"
              );
              mviewer.alert(alertText, "alert-warning");
            }
          }
        });
      },
      _onerror
    );
  };

  /**
   * Private method _getFileContents
   * Utility method for _unzip to get fileBlob
   * @param {Entry} file
   * @param {String} mimetype
   */
  function _getFileContents(file, mimetype) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(
          new Error(
            _getI18NAlertMessage(`Pas de fichier dbf trouvé`, "fileimport.alert.dbf")
          )
        );
      } else {
        file.getData(new zip.BlobWriter(mimetype), (fileBlob) =>
          resolve(new Response(fileBlob))
        );
      }
    });
  }

  /**
   * Private method _resolveShpDbf
   * Utility method for _unzip to resolve shp, dbf promise and call _loadShp once SRS is set
   * @param {Promise} shpPromise
   * @param {Promise} dbfPromise
   * @param {String} projId
   * @param {Object} oLayer
   * @param {String} shpfilename
   */
  function _resolveShpDbf(shpPromise, dbfPromise, projId, oLayer, shpfilename) {
    Promise.all([shpPromise, dbfPromise])
      .then(async ([shpResponse, dbfResponse]) => {
        var shpContents = await shpResponse.arrayBuffer();
        var dbfContents = await dbfResponse.arrayBuffer();
        _loadShp(shpContents, dbfContents, projId, oLayer, shpfilename);
      })
      .catch(function (error) {
        mviewer.alert(error, "alert-warning");
      });
  }

  var _onerror = function (message) {
    console.log(message);
  };

  /**
   * Private method _loadShp
   * Loads shp geoms and dbf attributs into map via shapefile js lib
   * @param {ArrayBuffer} shpfile
   * @param {ArrayBuffer} dbffile
   * @param {String} projId
   * @param {Object} oLayer
   * @param {String} filename
   */
  var _loadShp = function (shpfile, dbffile, projId, oLayer, filename) {
    var features = [];
    shapefile
      .open(shpfile, dbffile, { encoding: "UTF-8" })
      .then((source) =>
        source.read().then(function add(result) {
          if (result.done) {
            // set features
            var featureSource = oLayer.layer.getSource();
            oLayer.layer.setStyle(getImportStyle.bind(this));
            featureSource.addFeatures(
              new ol.format.GeoJSON({
                featureProjection: oLayer.mapProjection,
                dataProjection: projId,
              }).readFeatures({
                type: "FeatureCollection",
                features: features,
              })
            );
            utils.zoomToFeaturesExtent(featureSource.getFeatures());
            // set legend
            var legendStyle = getImportStyle(oLayer.layer.getSource().getFeatures()[0]);
            var geometryType = oLayer.layer
              .getSource()
              .getFeatures()[0]
              .getGeometry()
              .getType();
            oLayer.legend = {
              items: [{ styles: [legendStyle], label: filename, geometry: geometryType }],
            };
            mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
            return;
          }
          features.push(result.value);
          return source.read().then(add);
        })
      )
      .catch((error) => console.error(error.stack));
  };

  /**
   * Private method _geocode
   * POSTs local file and parameters to API geocode service.
   * Will use IGN [POST] search/csv service
   * Service details : https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage
   * @param {String} _csv
   * @param {Object} oLayer
   * @param {Object} l
   */
  var _geocode = function (_csv, oLayer, l) {
    if (oLayer.geocoder === "search") {
      // Create post form data
      var formData = new FormData();
      formData.append("data", new Blob([_csv], { type: "text/csv" }));
      if (!oLayer.geocodingcitycode) {
        oLayer.geocodingfields.forEach(function (value) {
          formData.append("columns", value);
        });
      } else {
        formData.append("citycode", oLayer.geocodingcitycode);
      }
      document.getElementById("csv-status").setAttribute("class", "wait");
      $.ajax({
        type: "POST",
        processData: false,
        url: oLayer?.geocoderurl || API_CSV,
        data: formData,
        contentType: false,
        success: function (data) {
          _mapCSV(data, oLayer, l);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          var alertText = _getI18NAlertMessage(
            "Problème avec le géocodage",
            "fileimport.alert.geocoding"
          );
          mviewer.alert(alertText + thrownError, "alert-warning");
          $("#csv-status").attr("class", "start");
        },
      });
    } else {
      var alertText = _getI18NAlertMessage(
        "Ce geocoder " + oLayer.geocoder + " n'est pas pris en compte",
        "fileimport.alert.geocoder"
      );
      mviewer.alert(alertText, "alert-warning");
    }
  };

  /**
   * Private method _mapCSV
   * Maps geocoded csv data (returned from geocoding API or including coords)
   * @param {String} data
   * @param {Object} oLayer
   * @param {Object} l
   * @param {String} srs
   */
  var _mapCSV = function (data, oLayer, l, srs, title) {
    var _epsg = srs ? srs : "EPSG:4326";
    var _source = l.getSource();
    l.setStyle(getImportStyle.bind(this));
    //Parse geocoded results
    var results = Papa.parse(data, { header: true });

    let withXY = results.data.filter((f) => f[oLayer.xfield] && f[oLayer.yfield]);
    if (withXY) {
      oLayer.layer.set("xfield", oLayer.xfield);
      oLayer.layer.set("yfield", oLayer.yfield);
    }
    let features = withXY.map((f) => {
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.transform(
            [
              parseFloat(f[oLayer.xfield].replace(",", ".")),
              parseFloat(f[oLayer.yfield].replace(",", ".")),
            ],
            ol.proj.get(_epsg),
            oLayer.mapProjection
          )
        ),
      });
      feature.setProperties(f);
      return feature;
    });
    // Add features to layer source
    // if fusesearch is enabled in config, 'change' event is fired and handled in the  _processSearchableLayer method (search.js)
    _source.addFeatures(features);
    // zoom to layer extent
    if (l.getVisible()) {
      utils.zoomToFeaturesExtent(_source.getFeatures());
    }
    $("#csv-status").attr("class", "start");
    //draw layer Legend
    oLayer.legend = {
      items: [
        {
          styles: [getImportStyle(oLayer.layer.getSource().getFeatures()[0])],
          label:
            document.getElementsByClassName("csv-name form-control")?.[0]?.value ||
            "Points CSV",
          geometry: "Point",
        },
      ],
    };
    mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
  };

  /**
   * Private method _loadCSV
   * Load csv indicated in config.xml with url param directly on startup (without file loader and wizard modal)
   * @param {Object} oLayer
   * @param {Object} l
   */
  let _loadCSV = function (oLayer, l) {
    // No wizard here. file is directly geocoded at startup. Used with persistent csv with layer config parameters (geocodingfields...)
    if (oLayer.url && oLayer.geocoder) {
      fetch(oLayer.url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText || "HTTP error");
          }
          return response.text();
        })
        .then((data) => {
          // insert url into layer prop to be shared in permalink
          oLayer.layer.set("url", oLayer.url);
          setPermaLink({
            file: oLayer.url,
          });
          // geocoding
          _geocode(data, oLayer, l);
        })
        .catch((error) => {
          const alertText = _getI18NAlertMessage(
            "Problème avec la récupération du fichier csv",
            "fileimport.alert.fileloading"
          );
          mviewer.alert(`${alertText}: ${error.message}`, "alert-warning");
        });
    }
  };

  /**
   * Private method _initLoaderFile
   * Inits file loader if no url param in config.xml
   * @param {Object} oLayer
   */
  var _initLoaderFile = function (oLayer) {
    //If no url in config, add form as customcontrol to select local file to geocode
    oLayer.customcontrol = true;
    oLayer.geocodingfields = [];
    oLayer.geocodingcitycode = false;
    mviewer.customControls[oLayer.layerid] = {
      form: _template(oLayer),
      init: function () {
        return false;
      },
      destroy: function () {
        return false;
      },
    };
    // Append template manually on init (because customControls are initialized before extensions)
    $(`.mv-layer-options [data-layerid=${oLayer.layerid}]`).append(_template(oLayer));
  };

  /**
   * Private method _geocodeit
   * Triggers event for modal submit
   * @param {Element} btn
   */
  var _geocodeit = function (btn) {
    var e = "geocoding-" + $(btn).attr("data-layerid") + "-ready";
    $("#geocoding-modal").trigger(e);
  };

  /**
   * Private method _getI18NAlertMessage
   * Returns translation if mviewer.lang set, else original message
   * @param {String} message
   * @param {String} messageId (for mviewer.i18n.json)
   */
  var _getI18NAlertMessage = function (message, messageId) {
    return mviewer.lang ? mviewer.lang[mviewer.lang.lang](messageId) : message;
  };

  /**
   * Public method loadGeoJson
   * Loads a GeoJSON file into the given layer
   * @param {Object} oLayer - Layer configuration object
   * @param {Object} l - OpenLayers vector layer
   * @param {String|Object} geojson - GeoJSON data as string or parsed object
   */
  const loadGeoJson = function (oLayer, l, geojson) {
    try {
      let _source = l.getSource();
      l.setStyle(getImportStyle.bind(this));

      // Parse if input is string
      let data = typeof geojson === "string" ? JSON.parse(geojson) : geojson;

      let features = new ol.format.GeoJSON({
        featureProjection: oLayer.mapProjection,
        dataProjection: "EPSG:4326", // Assumes GeoJSON is in WGS84
      }).readFeatures(data);

      _source.clear();
      _source.addFeatures(features);

      utils.zoomToFeaturesExtent(features);

      // Generate legend
      oLayer.legend = {
        items: [
          {
            styles: [getImportStyle(features[0])],
            label: "GeoJSON",
            geometry: features[0].getGeometry().getType(),
          },
        ],
      };
      mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
    } catch (err) {
      let alertText = _getI18NAlertMessage(
        "Erreur lors du chargement du fichier GeoJSON",
        "fileimport.alert.geojson"
      );
      mviewer.alert(alertText + ": " + err.message, "alert-warning");
    }
  };
  /*
   * Private method _createLayerFromApi
   * Creates layer from API file if URL param is available.
   * Layer will be processed and added to map as native layer.
   */
  const _createLayerFromApi = () => {
    if (API.file) {
      // default oLayer params
      let params = createDefaultOLayerOption(_.uniqueId(), "fichier csv", {
        xfield: API?.xfield,
        yfield: API?.yfield,
      });
      // create vector layer and add it to map
      configuration.createVectorLayer(params, {
        url: API.file,
      });
    }
  };

  setPermaLink = (params) => {
    API = { ...API, ...params };
  };

  return {
    init: function () {
      // Avoid to use existing XML layer. Allow to create a new one with default params.
      _createLayerFromApi();

      // parse layers and load data, or show wizard modal
      var layers = mviewer.getLayers();
      let layerAPIToUse = null;
      for (var layer in layers) {
        if (layers[layer].type === "import") {
          var oLayer = layers[layer];
          if (oLayer.urlparam && !oLayer?.geocoder) {
            _loadUrlFile(oLayer.id, API.file);
          } else if (oLayer.urlparam && oLayer?.geocoder) {
            _loadCSV(oLayer, oLayer.layer, API.file);
          } else if (oLayer.url && !oLayer?.geocoder === "BAN") {
            _loadUrlFile(oLayer.id, oLayer.url);
          } else if (oLayer.geocoder && oLayer.url) {
            _loadCSV(oLayer, oLayer.layer, oLayer.url);
          } else {
            _initLoaderFile(oLayer);
            layerAPIToUse = oLayer;
            _buttonActive = oLayer.visiblebydefault;
            _importLayer = oLayer;
            $(`.nav-pills [data-layerid=${oLayer.layerid}]`).on("click", function () {
              _buttonActive = !_buttonActive;
            });
          }
        }
      }

      $(document).ready(function () {
        $("#main").append(_wizard_modal);
        $("#main").append(_projection_modal);
        $("#geocoding-modal .close").click(function (e) {
          $("#geocoding-modal").modal("hide");
        });
      });

      _button = document.getElementById("fileimport-button");
      if (_button) {
        _button.addEventListener("click", _toggleImportLayer);
      }

      $(document).on("configurationCompleted", () => {
        if (!configuration.getConfiguration().mobile) {
          $("#fileimport-custom-component button").tooltip({
            placement: "left",
            trigger: "hover",
            html: true,
            container: "body",
            template: mviewer.templates.tooltip,
          });
        }
      });
    },
    loadLocalFile: _loadLocalFile,
    loadUrlFile: _loadUrlFile,
    geocodeit: _geocodeit,
    dragOverHandler: function (ev) {
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    },
    dropHandler: function (ev) {
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === "file") {
            var file = ev.dataTransfer.items[i].getAsFile();
            var layerid =
              ev.target.closest(".mv-custom-controls").attributes["data-layerid"].value;
            _loadLocalFile(layerid, ev.dataTransfer.files[i]);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log("... file[" + i + "].name = " + ev.dataTransfer.files[i].name);
        }
      }
      // Pass event to removeDragData for cleanup
      this.removeDragData(ev);
    },
    removeDragData: function (ev) {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
      } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
      }
    },
    loadGeoJson: loadGeoJson,
  };
})();

new CustomComponent("fileimport", fileimport.init);
