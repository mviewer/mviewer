mviewer.customControls.cad = (function () {
    var _data = false;
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
        }

    };

}());