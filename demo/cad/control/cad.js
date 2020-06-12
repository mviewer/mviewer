mviewer.customControls.cad = (function () {
    var _data = false;
    var _colorpicker;
    var defaultParameters = {
        "BASEURL": "https://geobretagne.fr/geoserver/cadastre/wfs",
        "SERVICE": "WFS",
        "VERSION": "2.0.0",
        "REQUEST": "GetFeature",
        "outputFormat": "application/json",
        "srsName": "EPSG:3857"
    }
    var querybuilder = function (options) {
        options = Object.assign(Object.assign({}, defaultParameters), options);

        let url = "";
        Object.keys(options).forEach(function (key) {
            if (key === "BASEURL")
                url = options[key] + "?" + url;
            else
                url += "&" + key + "=" + options[key]
        });
        return encodeURI(url);
    }

    var setData = function (data) {
        _data = data;
    };

    var updateIHM = function () {
        appendSelect('dep-select', _data.departements, "label", "value");
        document.getElementById('dep-select').addEventListener("change", onDptChange);
        document.getElementById('com-select').addEventListener("change", onComChange);
        document.getElementById('section-select').addEventListener("change", onSectionChange);
        document.getElementById('parcelle-select').addEventListener("change", onParcelleChange);


        //Custom color picker
        if (!document.getElementById("color-picker-btn")) {
            let template = document.querySelector("#color-picker-template");
            let clone = document.importNode(template.content, true);
            document.querySelectorAll('.mv-layer-details[data-layerid="cad"] .layerdisplay-legend')[0].appendChild(clone);
        }

        let pk = new Piklor(".color-picker", [
                "#1abc9c"
              , "#2ecc71"
              , "#3498db"
              , "#9b59b6"
              , "#16a085"
              , "#2980b9"
              , "#8e44ad"
              , "#2c3e50"
              , "#f1c40f"
              , "#e67e22"
              , "#e74c3c"
              , "#ecf0f1"
              , "#95a5a6"
              , "#f39c12"
              , "#d35400"
              , "#c0392b"
              , "#bdc3c7"
              , "#7f8c8d"
            ], {
                open: ".picker-wrapper .btn"
        });

        pk.colorChosen(function (col) {
            document.getElementById('color-picker-btn').style['border-color'] = col;
            colorChange(col);
            this.close();
        });


    };

    var appendSelect = function (select, data, text, value, numbers) {
        let element = document.getElementById(select);
        let tempOptions = [];
        emptySelect(select);
        data.forEach(function (item) {
            let option = document.createElement("option");
            option.text = item.properties[text];
            option.value = item.properties[value];
            tempOptions.push(option);
        })
        if (!numbers) {
            tempOptions.sort(function (a, b) {
                return a.innerHTML.localeCompare(b.innerHTML);
            })
        } else {
            tempOptions.sort(function (a, b) {
                return parseInt(a.innerHTML) - parseInt(b.innerHTML);
            })
        }
        tempOptions.forEach(function (option) {
            element.add(option);
        })


    };
    var emptySelect = function (select) {
        let element = document.getElementById(select);
        let defaultoption = element.options[0];
        element.innerHTML = "";
        element.prepend(defaultoption);
        element.selectedIndex = "0";
    }
    var setLayerSource = function (data) {
        let cad_layer = mviewer.getLayer('cad');
        let src = cad_layer.layer.getSource();
        src.clear();
        src.addFeatures(
            new ol.format.GeoJSON().readFeatures(data)
        );
        let res = mviewer.getMap().getView().getResolutionForExtent(src.getExtent());
        let zoom = mviewer.getMap().getView().getZoomForResolution(res);
        mviewer.getMap().getView().fit(src.getExtent(),{maxZoom:zoom-1});
    };
    var clearSource = function () {
        let cad_layer = mviewer.getLayer('cad');
        let src = cad_layer.layer.getSource();
        src.clear();
    }
    var highlightParcelle = function (id_parcelle) {
        if (previousParcelle) {
            previousParcelle.setStyle(mviewer.customLayers.cad.defaultStyle);
        }
        let layer = mviewer.getLayer('cad').layer;
        let src = layer.getSource();
        let f = false;
        src.forEachFeature(function (feature) {
            if (feature.get("geo_parcelle") === id_parcelle) {
                feature.setStyle(mviewer.customLayers.cad.highlightStyle);
                f = feature;
                let res = mviewer.getMap().getView().getResolutionForExtent(feature.getGeometry().getExtent());
                let zoom = mviewer.getMap().getView().getZoomForResolution(res);
                mviewer.getMap().getView().fit(feature.getGeometry(), {
                    maxZoom: zoom - 5
                });
                return true;
            }
            return false;
        });
        return f;
    }
    var onDptChange = function (e) {
        let selectedDpt = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralZoningLevel1",
            "PROPERTYNAME": "nom_commune,geo_commune",
            "CQL_FILTER": "departement='" + selectedDpt + "'"
        }
        document.getElementById('loading-cad').style.display = "block";
        fetch(querybuilder(options)).then(
            response => {
                response.json().then(
                    data => {
                        appendSelect("com-select", data.features, "nom_commune", "geo_commune", false);
                        clearSource();
                        emptySelect("section-select");
                        emptySelect("parcelle-select");
                    }
                ).then(() => document.getElementById('loading-cad').style.display = "none")
            }
        );
    };

    var colorChange = function (color) {
        let style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: color,
                width: 1.25
            })
        });
        mviewer.customLayers.cad.layer.setStyle(style);
    }

    var onComChange = function (e) {
        let selectedCom = e.target.value;
        let insee = selectedCom.substr(0,2) + selectedCom.substr(3);
        let options = {
            "TYPENAME": "CP.CadastralZoning",
            "CQL_FILTER": "geo_commune='" + selectedCom + "'"

        }
        mviewer.customLayers.cad2.updateCommune(insee);
        document.getElementById('loading-cad').style.display = "block";
        fetch(querybuilder(options))
            .then(
                response => {
                    response.json().then(
                        data => {
                            appendSelect("section-select", data.features, "label", "geo_section", false);
                            clearSource();
                            emptySelect("parcelle-select");
                        }
                    ).then(
                        () => {
                            document.getElementById('loading-cad').style.display = "none"
                            options.TYPENAME+="Level1";
                            fetch(querybuilder(options))
                                .then(
                                    response => {
                                        response.json().then(
                                            data => {
                                                let commune = new ol.format.GeoJSON().readFeature(data.features[0]);
                                                mviewer.getMap().getView().fit(commune.getGeometry(),{duration:500});
                                            }
                                        )
                                    }
                                )
                        }
                    )
                }
            );
    };
    var onSectionChange = function (e) {
        let selectedSection = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralParcel",
            "CQL_FILTER": "geo_section='" + selectedSection + "'"

        }
        document.getElementById('loading-cad').style.display = "block";
        fetch(querybuilder(options))
            .then(
                response => {
                    response.json().then(
                        data => {
                            setLayerSource(data);
                            appendSelect("parcelle-select", data.features, "label", "geo_parcelle", true);
                        }
                    ).then(() => document.getElementById('loading-cad').style.display = "none")
                }
            );
    };
    var previousParcelle = false;

    var onParcelleChange = function (e) {
        let selectedparcelle = e.target.value;
        previousParcelle = highlightParcelle(selectedparcelle);
    }

    var freeText2ID = function (str) {
        let text = str.toUpperCase();
        var nbchar = text.length;
        var section = "";
        var parcelle = "";
        var i = 0;
        for (i = 0; i < nbchar; i++) {
            var charcode = text.substring(i, i + 1).charCodeAt(0);
            if (charcode >= 65 && charcode <= 90) {
                section += String.fromCharCode(charcode).toUpperCase();
            }
            if (charcode >= 48 && charcode <= 57) {
                parcelle += String.fromCharCode(charcode);
            }
        }
        // test validité
        if (section.length >= 1 && parseFloat(parcelle) >= 1) {
            parcelle = parseFloat(parcelle);
            var tmp1 = String("000" + parcelle);
            var formatparcelle = tmp1.substring(tmp1.length - 4, tmp1.length + 1);
            var tmp2 = "0000" + section;
            var formatsection = tmp2.substring(tmp2.length - 5, tmp2.length + 1);
            var commune = document.getElementById('com-select').value;
            var id = "FR" + commune + formatsection + formatparcelle;
            return id;

        } else {
            alert("la saisie : " + text + " n'est pas valide");
        }


    };

    return {
        /*
         * Public
         */

        init: function () {
            if (!_data) {
                fetch('demo/cad/data/departements.json')
                    .then(function (response) {
                        response.json()
                            .then(function (data) {
                                setData(data);
                                updateIHM();
                            });
                    });
            } else {
                updateIHM();
            }
        },

        destroy: function () {
            if (previousParcelle) {
                previousParcelle.setStyle(mviewer.customLayers.cad.defaultStyle);
            }
        },
        editSelectedParcelle: function (value) {
            if (value) {
                previousParcelle = value;
                document.getElementById('parcelle-select').value = value.get("geo_parcelle");
            }
            return previousParcelle;
        },
        test: freeText2ID

    };

}());