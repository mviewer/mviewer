var csv = (function () {

    var _template = function (oLayer) {

        return [
            '<div class="alert alert-info">',
                '<input type="file" name="filebutton" onchange="csv.loadLocalFile(\''+oLayer.layerid+'\')" style="visibility:hidden;" id="loadcsv-'+oLayer.layerid+'"/>',
                '<label>Choisissez un fichier</label>',
                '<div class="input-append">',
                    '<input type="text" id="subfile" class="input-xlarge">',
                    '<a class="btn btn-primary btn-sm" onclick="$(\'#loadcsv-'+oLayer.layerid+'\').click();">Parcourir</a>',
                '</div>',
            '</div>'
        ].join("");
    };

    var _loadLocalFile = function(idlayer) {
        var file = document.getElementById("loadcsv-" + idlayer).files[0];
        if (file) {
            var oLayer = mviewer.getLayers()[idlayer];
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                $("#geocoding-modal").modal("show");
                $("#geocoding-modal button.geocode").attr("data-layerid",idlayer);
                $("#geocoding-modal").on("geocoding-" + idlayer + "-ready", function () {
                    _geocode(evt.target.result,oLayer, oLayer.layer);
                    $("#geocoding-modal").modal("hide");

                });
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    };

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

    var _geocode = function (_csv, oLayer, l) {
        if (oLayer.geocoder === "ban") {
                var formData = new FormData();
                formData.append("data", new Blob([_csv], {"type": "text/csv"}));
                oLayer.geocodingfields.forEach(function(value) {
                    formData.append("columns", value);
                });
                $.ajax({
                    type: "POST",
                    processData: false,
                    url: "https://api-adresse.data.gouv.fr/search/csv/",
                    data: formData,
                    contentType: false,
                    success: function (data) {
                        var _source = l.getSource();
                        _source.clear();
                        var _features = [];
                        l.setStyle(_defaultStyle);
                        oLayer.legend = {items : [{styles: _defaultStyle, label: "Points", geometry: "Point"}]};
                        mviewer.drawVectorLegend(oLayer.layerid, oLayer.legend.items);

                        var test = Papa.parse(data, {header: true});
                        test.data.forEach(function(a) {
                            if (a[oLayer.xfield] && a[oLayer.yfield]) {
                                var feature = new ol.Feature({
                                    geometry: new ol.geom.Point(ol.proj.transform([parseFloat(a[oLayer.xfield]), parseFloat(a[oLayer.yfield])], 'EPSG:4326', 'EPSG:3857'))
                                });
                                feature.setProperties(a);
                                _features.push(feature);
                            }
                        });
                        _source.addFeatures(_features);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        mviewer.alert("Problème avec le géocodage" +  thrownError, "alert-warning");
                    }
                });

            } else {
                console.log("Ce geocoder " + oLayer.geocoder+ " n'est pas pris en compte");
            }
    };

    var _loadCSV = function(oLayer, l) {
        if (oLayer.url && oLayer.geocoder) {
            $.ajax({
                url: oLayer.url,
                success: function (data) {
                    /* TODO , choose fields to use for geocoding and to use with fuse search */
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
        geocodeit: _geocodeit
    };

})();