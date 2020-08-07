const fileimport = (function () {

    var _button;
    var _buttonActive = false;
    var _importLayer;
    var _toggleImportLayer = function() {
        _buttonActive = !_buttonActive;
        if (_importLayer) {
            if (_buttonActive) {
                mviewer.addLayer(_importLayer);
            } else {
                var el = $(`#layers-container [data-layerid=${_importLayer.layerid}]`)
                mviewer.removeLayer(el);
            }
        } else {
            var alertText = mviewer.lang
            ? mviewer.lang[mviewer.lang.lang]("fileimport.alert.config")
            : "Pas de couche d'import configurée"
            mviewer.alert(alertText, "alert-warning");
        }
    }

    var _wizard_modal =
        `<div id="geocoding-modal" class="modal fade" tabindex="-1" role="dialog" >
    <div class="modal-dialog modal-md">
    <div class="modal-content" role="document">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal">&times;</button>
      <h4 class="modal-title" i18n="fileimport.modal.title">Options d'import</h4>
    </div>
    <div class="modal-body" >
      <div class="form-group">
        <label for="email" i18n="fileimport.data.title">Titre de la donnée:</label>
        <h3><input type="text" class="csv-name form-control"><h3>
      </div>
      <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
        <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingZero">
                <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseZero" 
                        aria-expanded="true" aria-controls="collapseZero" i18n="fileimport.select.coordinates">
                    <b>Sélectionner les champs</b> x, y à utiliser comme coordonnées
                    </a>
                </h4>
            </div>
            <div id="collapseZero" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingZero">
                <div class="panel-body">
                    <table id="table-csv" class="table">
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" i18n="fileimport.srs.lon">X (longitude)</th>
                            <th scope="col"></th>
                            <th scope="col" i18n="fileimport.srs.lat">Y (latitude)</th>
                            <th scope="col" i18n="fileimport.srs.projection">Projection (SRS)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row" i18n="fileimport.srs.select">Sélectionner</th>
                            <td>
                                <select id="x-select" class="form-control"></select>
                            </td>
                            <td><button id="btn-xy" class="btn btn-secondary glyphicon glyphicon-refresh"></button></td>
                            <td>
                                <select id="y-select" class="form-control"></select>
                            </td>
                            <td>
                                <select id="srs-select" class="form-control"></select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" i18n="fileimport.srs.data">Aperçu</th>
                            <td id="x-data"></td>
                            <td></td>
                            <td id="y-data"></td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingOne">
                <h4 class="panel-title">
                  <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" 
                        aria-expanded="false" aria-controls="collapseOne" i18n="fileimport.select.address">
                  <b>Ou</b> sélectionner les champs à utiliser pour le géocodage (adresse)
                  </a>
                </h4>
            </div>
            <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                <div class="panel-body">
                  <div class="geocoding csv-fields list-group"/>
                  </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="headingTwo">
                  <h4 class="panel-title">
                      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" 
                            aria-expanded="false" aria-controls="collapseTwo" i18n="fileimport.select.insee">
                      <b>Ou</b> sélectionner le champ à utiliser pour le géocodage (insee)
                      </a>
                  </h4>
                </div>
                <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                  <div class="panel-body">
                      <div class="insee csv-fields list-group"/>
                      </div>
                  </div>
                </div>
                <div class="panel panel-default">
                  <div class="panel-heading" role="tab" id="headingThree">
                      <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" 
                                aria-expanded="false" aria-controls="collapseThree" i18n="fileimport.select.search">
                        <b>En option</b> sélectionner les champ à utiliser pour la recherche
                        </a>
                      </h4>
                  </div>
                  <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                      <div class="panel-body">
                        <div class="search csv-fields list-group"/>
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
    </div>`

    var _template = function (oLayer) {

        return `<div class="dropzone dz-clickable" id="drop_zone" onclick="$('#loadcsv-${oLayer.layerid}').click();" ondrop="fileimport.dropHandler(event);" ondragover="fileimport.dragOverHandler(event);">
                  <div id="csv-status" class="start">
                      <div class="dz-default dz-message"><span class="fas fa-cloud-upload-alt fa-3x"></span>
                          <p i18n="fileimport.upload.dropzone">Glisser un fichier CSV ou SHP (en ZIP) ici ou clic pour sélectionner un fichier...</p>
                      </div>
                      <div class="dz-work dz-message"><span class="fas fa-spin fa-cog fa-3x"></span>
                          <p i18n="fileimport.upload.processing">Traitement en cours</p>
                      </div>
                  </div>
              </div>
              <input type="file" name="filebutton" onchange="fileimport.loadLocalFile('${oLayer.layerid}')" style="visibility:hidden;" id="loadcsv-${oLayer.layerid}"/>`
    };

    // Load local file
    var _loadLocalFile = function (idlayer, file) {
        if (!file) {
            file = document.getElementById("loadcsv-" + idlayer).files[0];
        }
        if (file) {
            //remove existing features. Source can be used many times with differnet files
            var _src = mviewer.getLayers()[idlayer].layer.getSource().clear();
            var oLayer = mviewer.getLayers()[idlayer];
            var zipMimeTypes = [
                "application/zip", 
                "application/octet-stream", 
                "application/x-zip-compressed",
                "application/x-compressed", 
                "multipart/x-zip"
            ]
            if (zipMimeTypes.includes(file.type)) {
                _unzip(file, oLayer)
            } else {
                _initCsvModal(idlayer, file, oLayer)
            }
        }
    };

    var _initCsvModal = function(idlayer, file, oLayer) {
        _resetForms();
        var reader = new FileReader();
        //Constraint : file must be encoded in UTF-8 and first line is named fields
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            //Show wizard modal
            console.log("getfile");
            $("#geocoding-modal").modal("show");
            $("#geocoding-modal button.geocode").attr("data-layerid", idlayer);
            //update layer title with file name
            $("#geocoding-modal .csv-name").val(file.name);
            //Parse csv file to convert it as json object
            var tmp = Papa.parse(evt.target.result, { header: true });
            var fields = [];
            //Get fields of loaded file
            tmp.meta.fields.forEach(function (f) {
                fields.push('<a href="#" class="list-group-item">' + f + '</a>');
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
            $("#geocoding-modal").off().on("geocoding-" + idlayer + "-ready", function (e) {
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
                    oLayer.geocodingcitycode = $("#geocoding-modal .insee.csv-fields a.active").first().text();
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
                $(".mv-layer-details[data-layerid='" + idlayer + "'] .layerdisplay-title>a").first().text(title);
                $(".mv-layer-details[data-layerid='" + idlayer + "']").data("data-layerid", title);

                if ($("#collapseZero").hasClass("in") !== false) {
                    oLayer.xfield = $("#x-select").val();
                    oLayer.yfield = $("#y-select").val();
                    _mapCSV(evt.target.result, oLayer, oLayer.layer, $("#srs-select").val());
                } else {
                    // geocode file
                    _geocode(evt.target.result, oLayer, oLayer.layer);
                }
                //hide wizard
                $("#geocoding-modal").modal("hide");
                return false;

            });
        }
        reader.onerror = function (evt) {
            alert(mviewer.lang
                ? mviewer.lang[mviewer.lang.lang]("fileimport.alert.filereader")
                : "Erreur de lecture de fichier");
        }
    }

    var _resetForms = function () {
        $("#geocoding-modal .csv-fields a").remove();
        $("#x-select option").remove();
        $("#y-select option").remove();
        $("#srs-select option").remove();
    }

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
        })
        $("#y-select").change(function (e) {
            $("#y-data").text(tmp.data[0][e.target.value]);
        })

        // switch select option values and data preview via button
        $("#btn-xy").off().on("click", function () {
            var xToY = $("#x-select").val();
            $("#x-select").val($("#y-select").val()).trigger("change");
            $("#y-select").val(xToY).trigger("change");
        });

        // init srs select option
        var srs = ["<option value='EPSG:4326'>EPSG:4326</option>"];
        if (oLayer.projections && oLayer.projections.projection) {
            oLayer.projections.projection.forEach(function (p) {
                //register projections
                proj4.defs(p.proj4js);
                ol.proj.proj4.register(proj4);
                //display projections
                var epsg = p.proj4js.split(",")[0].replace(/['"]+/g, '');
                srs.push(`<option value="${epsg}">${epsg}</option>`);
            });
        }
        $("#srs-select").append(srs.join(" "));
    }

    var _unzip = function(file, oLayer) {
        zip.workerScripts = {
            inflater: ['demo/addons/fileimport/lib/z-worker.js', 'demo/addons/fileimport/lib/inflate.js']
          };
        zip.createReader(new zip.BlobReader(file), function(zipReader) {
            zipReader.getEntries(function(entries) {
                if (entries.length) {
                    var shpfile = entries.filter(entry => entry.filename.split(".")[1] === "shp")[0];
                    var dbffile = entries.filter(entry => entry.filename.split(".")[1] === "dbf")[0];
                    var prjfile = entries.filter(entry => entry.filename.split(".")[1] === "prj")[0];
                    var shpPromise = getFileContents(shpfile, "application/octet-stream");
                    var dbfPromise = getFileContents(dbffile, "application/x-dbase");
                    var prjPromise = getFileContents(prjfile, "text/txt");
                    Promise.all([shpPromise, dbfPromise, prjPromise])
                        .then(async ([shpResponse, dbfResponse, prjResponse]) => {
                            var shpContents = await shpResponse.arrayBuffer();
                            var dbfContents = await dbfResponse.arrayBuffer();
                            var prjContents = await prjResponse.text();
                            // register named projection for use in _loadShp
                            var projId = `Proj-${Date.now()}`;
                            proj4.defs(projId, prjContents);
                            ol.proj.proj4.register(proj4);
                            _loadShp(shpContents, dbfContents, projId, oLayer, shpfile.filename);
                    })


                }
            });
        }, _onerror);
    }

    function getFileContents(file, mimetype) {
        return new Promise(resolve => 
            file.getData(new zip.BlobWriter(mimetype), fileBlob => 
                resolve(new Response(fileBlob))
            )
        )
    }

    var _onerror = function(message) {
		console.log(message);
    }
    
    var _loadShp = function(shpfile, dbffile, projId, oLayer, filename) {
        var features = [];
        shapefile.open(shpfile, dbffile, {encoding: "UTF-8"})
        .then(source => source.read()
            .then(function add(result) {
                if (result.done) {
                    // set features
                    var featureSource = oLayer.layer.getSource();
                    oLayer.layer.setStyle(getImportStyle.bind(this));
                    featureSource.addFeatures(
                        new ol.format.GeoJSON({
                            featureProjection: oLayer.mapProjection, 
                            dataProjection: projId
                        }).readFeatures({
                            'type': 'FeatureCollection',
                            'features': features
                        })
                    );
                    mviewer.getMap().getView().fit(featureSource.getExtent());
                    // set legend
                    var legendStyle = getImportStyle(oLayer.layer.getSource().getFeatures()[0]);
                    var geometryType = oLayer.layer.getSource().getFeatures()[0].getGeometry().getType();
                    oLayer.legend = { items: [{ styles: [legendStyle], label: filename, geometry: geometryType }] };
                    mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
                    return;
                }
                    features.push(result.value)
                    return source.read().then(add);
                }))
        .catch(error => console.error(error.stack));
    }

    // POST local file and parameters to API geocode service
    var _geocode = function (_csv, oLayer, l) {
        if (oLayer.geocoder === "ban") {
            // Create post form data
            var formData = new FormData();
            formData.append("data", new Blob([_csv], { "type": "text/csv" }));
            if (!oLayer.geocodingcitycode) {
                oLayer.geocodingfields.forEach(function (value) {
                    formData.append("columns", value);
                });
            } else {
                formData.append("citycode", oLayer.geocodingcitycode);
            }
            $("#csv-status").attr("class", "wait");
            $.ajax({
                type: "POST",
                processData: false,
                url: "https://api-adresse.data.gouv.fr/search/csv/",
                data: formData,
                contentType: false,
                success: function (data) {
                    _mapCSV(data, oLayer, l)
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var alertText = mviewer.lang
                        ? mviewer.lang[mviewer.lang.lang]("fileimport.alert.geocoding")
                        : "Problème avec le géocodage"
                    mviewer.alert(alertText + thrownError, "alert-warning");
                    $("#csv-status").attr("class", "start");
                }
            });

        } else {
            console.log("Ce geocoder " + oLayer.geocoder + " n'est pas pris en compte");
        }
    };

    var _mapCSV = function (data, oLayer, l, srs) {
        var _epsg = srs ? srs : 'EPSG:4326';
        var _source = l.getSource();
        var _features = [];
        l.setStyle(getImportStyle.bind(this));
        //Parse geocoded results
        var results = Papa.parse(data, { header: true });
        results.data.forEach(function (a) {
            //create geometries from xfield and y field
            if (a[oLayer.xfield] && a[oLayer.yfield]) {
                var feature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform(
                        [parseFloat(a[oLayer.xfield]), parseFloat(a[oLayer.yfield])],
                        ol.proj.get(_epsg), oLayer.mapProjection
                    ))
                });
                feature.setProperties(a);
                _features.push(feature);
            } else {
                console.log("paramètres xfield et yfields manquants");
            }
        });
        // Add features to layer source
        // if fusesearch is enabled in config, 'change' event is fired and handled in the  _processSearchableLayer method (search.js)
        _source.addFeatures(_features);
        // zoom to layer extent
        mviewer.getMap().getView().fit(_source.getExtent());
        $("#csv-status").attr("class", "start");
        //draw layer Legend
        oLayer.legend = { items: [{ styles: [getImportStyle(oLayer.layer.getSource().getFeatures()[0])], label: "Points", geometry: "Point" }] };
        mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
    }

    var _loadCSV = function (oLayer, l) {
        // No wizard here. file is directly geocoded at startup. Used with persistant csv with layer config parameters (geocodingfields...)
        if (oLayer.url && oLayer.geocoder) {
            $.ajax({
                url: oLayer.url,
                success: function (data) {
                    _geocode(data, oLayer, l);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var alertText = mviewer.lang
                        ? mviewer.lang[mviewer.lang.lang]("fileimport.alert.fileloading")
                        : "Problème avec la récupération du fichier csv"
                    mviewer.alert(alertText + thrownError, "alert-warning");
                }
            });
        }

    };

    var _initLoaderFile = function (oLayer) {
        //If no url in config, add form as customcontrol to select local file to geocode
        oLayer.customcontrol = true;
        oLayer.geocodingfields = [];
        oLayer.geocodingcitycode = false;
        mviewer.customControls[oLayer.layerid] = { form: _template(oLayer), init: function () { return false; }, destroy: function () { return false; } };
        // Append template manually on init (because customControls are initialized before extensions) 
        $(`.mv-layer-options [data-layerid=${oLayer.layerid}]`).append(_template(oLayer));
    };

    var _geocodeit = function (btn) {
        var e = "geocoding-" + $(btn).attr("data-layerid") + "-ready";
        $("#geocoding-modal").trigger(e);
    };


    return {
        init: function () {
            var layers = mviewer.getLayers();
            for (var layer in layers) {
                if (layers[layer].type === "import") {
                    var oLayer = layers[layer];
                    if (oLayer.url) {
                        _loadCSV(oLayer, oLayer.layer);
                    } else {
                        _initLoaderFile(oLayer);
                        _buttonActive = oLayer.visiblebydefault;
                        _importLayer = oLayer;
                        $(`.nav-pills [data-layerid=${oLayer.layerid}]`).on("click", function() {
                            _buttonActive = !_buttonActive;
                        });
                    }
                }
            }

            $(document).ready(function () {
                $("#main").append(_wizard_modal)
                $("#geocoding-modal .close").click(function (e) { $("#geocoding-modal").modal("hide") });
            });

            _button = document.getElementById("fileimport-button");
            if (_button) {
                _button.addEventListener('click', _toggleImportLayer);
            }

            if (!configuration.getConfiguration().mobile) {
                $("#fileimport-custom-component button").tooltip({
                    placement: 'left',
                    trigger: 'hover',
                    html: true,
                    container: 'body',
                    template: mviewer.templates.tooltip
                });
            }
        },
        loadLocalFile: _loadLocalFile,
        geocodeit: _geocodeit,
        dragOverHandler: function (ev) {
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
        },
        dropHandler: function (ev) {
            console.log('File(s) dropped');
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        var file = ev.dataTransfer.items[i].getAsFile();
                        var layerid = ev.target.closest(".mv-custom-controls").attributes["data-layerid"].value;
                        _loadLocalFile(layerid, ev.dataTransfer.files[i]);
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                    console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
                }
            }
            // Pass event to removeDragData for cleanup
            this.removeDragData(ev)
        },
        removeDragData: function (ev) {
            console.log('Removing drag data')
            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to remove the drag data
                ev.dataTransfer.items.clear();
            } else {
                // Use DataTransfer interface to remove the drag data
                ev.dataTransfer.clearData();
            }
        }
    };

})();

new CustomComponent("fileimport", fileimport.init);