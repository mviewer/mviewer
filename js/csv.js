/*
 *
 * Need layer config parameters
 * type="csv"
 * geocoder="ban"
 * [optional] geocodingfields="adresse,postcode"
 * xfield="longitude"
 * yfield="latitude"
 *
*/

var csv = (function () {

    var _wizard_modal = [
      '<div id="geocoding-modal" class="modal fade" tabindex="-1" role="dialog" >',
        '<div class="modal-dialog modal-md">',
        '<div class="modal-content" role="document">',
        '<div class="modal-header">',
           '<button type="button" class="close" data-dismiss="modal">&times;</button>',
           '<h4 class="modal-title">Options de géocodage</h4>',
        '</div>',
        '<div class="modal-body" >',
          '<div class="form-group">',
            '<label for="email">Titre de la donnée:</label>',
            '<h3><input type="text" class="csv-name form-control"><h3>',
          '</div>',

           '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">',
              '<div class="panel panel-default">',
                 '<div class="panel-heading" role="tab" id="headingOne">',
                    '<h4 class="panel-title">',
                       '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">',
                       '<b>Sélectionner les champs</b> à utiliser pour le géocodage (adresse)',
                       '</a>',
                    '</h4>',
                 '</div>',
                 '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">',
                    '<div class="panel-body">',
                       '<div class="geocoding csv-fields list-group"/>',
                       '</div>',
                    '</div>',
                 '</div>',
                 '<div class="panel panel-default">',
                    '<div class="panel-heading" role="tab" id="headingTwo">',
                       '<h4 class="panel-title">',
                          '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">',
                          '<b>Ou</b> sélectionner le champ à utiliser pour le géocodage (insee)',
                          '</a>',
                       '</h4>',
                    '</div>',
                    '<div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">',
                       '<div class="panel-body">',
                          '<div class="insee csv-fields list-group"/>',
                          '</div>',
                       '</div>',
                    '</div>',
                    '<div class="panel panel-default">',
                       '<div class="panel-heading" role="tab" id="headingThree">',
                          '<h4 class="panel-title">',
                             '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">',
                             '<b>En option</b> sélectionner les champ à utiliser pour la recherche',
                             '</a>',
                          '</h4>',
                       '</div>',
                       '<div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">',
                          '<div class="panel-body">',
                             '<div class="search csv-fields list-group"/>',
                             '</div>',
                          '</div>',
                       '</div>',
                    '</div>',
                 '</div>',
                 '<div class="modal-footer">',
                    '<button type="button" data-layerid="" onclick="csv.geocodeit(this);" class="geocode btn btn-primary">Géocoder</button>',
                 '</div>',
              '</div>',
           '</div>',
        '</div>'
    ]. join("");

    var _template = function (oLayer) {

        return [
            '<div class="dropzone dz-clickable" id="drop_zone" onclick="$(\'#loadcsv-'+oLayer.layerid+'\').click();" ondrop="csv.dropHandler(event);" ondragover="csv.dragOverHandler(event);">',
                '<div id="csv-status" class="start">',
                    '<div class="dz-default dz-message"><span class="fas fa-cloud-upload-alt fa-3x"></span><p>Glisser un fichier CSV ici<br> ou clic pour sélectionner un fichier...</p></div>',
                    '<div class="dz-work dz-message"><span class="fas fa-spin fa-cog fa-3x"></span><p>Traitement en cours</p></div>',
                '</div>',
            '</div>',
            '<input type="file" name="filebutton" onchange="csv.loadLocalFile(\''+oLayer.layerid+'\')" style="visibility:hidden;" id="loadcsv-'+oLayer.layerid+'"/>'
        ].join("");
    };

    // Load local file
    var _loadLocalFile = function(idlayer, file) {
        if (!file) {
            file = document.getElementById("loadcsv-" + idlayer).files[0];
        }
        if (file) {
            $("#geocoding-modal .csv-fields a").remove();
            //remove existing features. Source can be used many times with differnet files
            var _src = mviewer.getLayers()[idlayer].layer.getSource().clear();
            var oLayer = mviewer.getLayers()[idlayer];
            var reader = new FileReader();
            //Constraint : file must be encoded in UTF-8 and first line is named fields
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                //Show wizard modal
                console.log("getfile");
                $("#geocoding-modal").modal("show");
                $("#geocoding-modal button.geocode").attr("data-layerid",idlayer);
                //update layer title with file name
                $("#geocoding-modal .csv-name").val(file.name);
                //Parse csv file to convert it as json object
                var tmp = Papa.parse(evt.target.result, {header: true});
                var fields = [];
                //Get fields of loaded file
                tmp.meta.fields.forEach(function(f) {
                    fields.push('<a href="#" class="list-group-item">'+f+'</a>');
                });
                //Update 3 wizard sections with field names
                $("#geocoding-modal .csv-fields").append(fields.join(" "));
                //Enable selection on each item
                $("#geocoding-modal .csv-fields a").click(function() {
                    $(this).toggleClass( "active" );
                });
                //Lauchn geocoding with custom parameters
                $("#geocoding-modal").off().on("geocoding-" + idlayer + "-ready", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    //get select fields to use for geocoding
                    var fields = [];
                    var fusefields = [];
                    //get select fields to use for geocoding
                    $("#geocoding-modal .geocoding.csv-fields a.active").each(function(i,f) {
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
                    $("#geocoding-modal .search.csv-fields a.active").each(function(i,f) {
                        fusefields.push(f.textContent);
                    });
                    if (fusefields.length > 0) {
                        oLayer.fusesearchkeys = fusefields.join(",");
                        oLayer.fusesearchresult = "{{"+fusefields[0]+"}}";
                        oLayer.searchengine = "fuse";
                        // Enable tooltip as well
                        oLayer.tooltip = true;
                        oLayer.tooltipcontent = oLayer.fusesearchresult;
                        search.processSearchableLayer(oLayer);
                    }
                    //update layer title in legend panel
                    var title = $("#geocoding-modal .csv-name").val();
                    $(".mv-layer-details[data-layerid='"+ idlayer +"'] .layerdisplay-title>a").first().text(title);
                    $(".mv-layer-details[data-layerid='"+ idlayer +"']").data("data-layerid", title);
                    //geocode file
                    _geocode(evt.target.result,oLayer, oLayer.layer);
                    //hide wizard
                    $("#geocoding-modal").modal("hide");
                    return false;

                });
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    };
    // layer style used for geocoded results
    var _defaultStyle = [new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255, 118, 117,1.0)'
            }),
            stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 4
            }),
            radius: 9
        })
    })];

    // POST local file and parameters to API geocode service
    var _geocode = function (_csv, oLayer, l) {
        if (oLayer.geocoder === "ban") {
                // Create post form data
                var formData = new FormData();
                formData.append("data", new Blob([_csv], {"type": "text/csv"}));
                if (!oLayer.geocodingcitycode) {
                    oLayer.geocodingfields.forEach(function(value) {
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
                        var _source = l.getSource();
                        var _features = [];
                        l.setStyle(_defaultStyle);
                        //draw layer Legend
                        oLayer.legend = {items : [{styles: _defaultStyle, label: "Points", geometry: "Point"}]};
                        mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);
                        //Parse geocoded results
                        var results = Papa.parse(data, {header: true});
                        results.data.forEach(function(a) {
                            //create geometries from xfield and y field
                            if (a[oLayer.xfield] && a[oLayer.yfield]) {
                                var feature = new ol.Feature({
                                    geometry: new ol.geom.Point(ol.proj.transform([parseFloat(a[oLayer.xfield]), parseFloat(a[oLayer.yfield])], 'EPSG:4326', 'EPSG:3857'))
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
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        mviewer.alert("Problème avec le géocodage" +  thrownError, "alert-warning");
                        $("#csv-status").attr("class", "start");
                    }
                });

            } else {
                console.log("Ce geocoder " + oLayer.geocoder+ " n'est pas pris en compte");
            }
    };

    var _loadCSV = function(oLayer, l) {
        // No wizard here. file is directly geocoded at startup. Used with persistant csv with layer config parameters (geocodingfields...)
        if (oLayer.url && oLayer.geocoder) {
            $.ajax({
                url: oLayer.url,
                success: function (data) {
                    _geocode(data, oLayer, l);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    mviewer.alert("Problème avec la récupération du fichier csv" +  thrownError, "alert-warning");
                }
            });
        }

    };

    var _initLoaderFile = function (oLayer) {
        //If no url in config, add form as customcontrol to select local file to geocode
        oLayer.customcontrol = true;
        oLayer.geocodingfields = [];
        oLayer.geocodingcitycode = false;
        mviewer.customControls[oLayer.layerid] = {form: _template(oLayer), init: function(){return false;}, destroy: function(){return false;}};
    };

    var _geocodeit = function (btn) {
        var e = "geocoding-"+$(btn).attr("data-layerid")+"-ready";
        $("#geocoding-modal").trigger(e);
    };


    return {
        initLoaderFile: _initLoaderFile,
        loadLocalFile: _loadLocalFile,
        loadCSV: _loadCSV,
        geocodeit: _geocodeit,
        getModal: function () { return _wizard_modal;},
        dragOverHandler: function(ev) {
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
        removeDragData: function(ev) {
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

$( document ).ready(function() {
    $("#main").append(csv.getModal())
    $("#geocoding-modal .close").click(function(e) { $("#geocoding-modal").modal("hide")});
});