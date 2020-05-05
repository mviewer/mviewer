mviewer.customControls.cad = (function () {
    var _data = false;
    var defaultParameters = {
        "BASEURL": "https://geobretagne.fr/geoserver/cadastre/wfs",
        "SERVICE": "WFS",
        "VERSION": "2.0.0",
        "REQUEST": "GetFeature",
        "outputFormat": "application/json",
        "srsName": "EPSG:4326"
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
        if (!_data) {
            _data = data;
            console.log(data);
            appendSelect('dep-select', data.departements, "label", "value");
            document.getElementById('dep-select').addEventListener("change", onDptChange);
            document.getElementById('com-select').addEventListener("change", onComChange);
            document.getElementById('section-select').addEventListener("change", onSectionChange);
            document.getElementById('parcelle-select').addEventListener("change", onParcelleChange);
        }
    };
    var appendSelect = function (select, data, text, value) {
        let element = document.getElementById(select);
        let tempOptions = [];
        emptySelect(select);
        data.forEach(function (item) {
            let option = document.createElement("option");
            option.text = item.properties[text];
            option.value = item.properties[value];
            tempOptions.push(option);
        })
        tempOptions.sort(function(a,b) {
            return a.innerHTML.localeCompare(b.innerHTML);
        })
        tempOptions.forEach(function(option){
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
            new ol.format.GeoJSON().readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        );
        mviewer.getMap().getView().fit(src.getExtent());
    };

    var highlightParcelle = function (id_parcelle) {
        if(previousParcelle){
            previousParcelle.setStyle(undefined);
        }
        let layer = mviewer.getLayer('cad').layer;
        let src = layer.getSource();
        let f = false;
        src.forEachFeature(function (feature) {
            if (feature.get("geo_parcelle") === id_parcelle) {
                feature.setStyle(mviewer.customLayers.cad.highlightStyle);
                f=feature;
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
                        appendSelect("com-select", data.features, "nom_commune", "geo_commune");
                        emptySelect("section-select");
                        emptySelect("parcelle-select");
                    }
                ).then(() => document.getElementById('loading-cad').style.display = "none")
            }
        );
    };

    var onComChange = function (e) {
        let selectedCom = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralZoning",
            "CQL_FILTER": "geo_commune='" + selectedCom + "'"

        }
        document.getElementById('loading-cad').style.display = "block";
        fetch(querybuilder(options))
            .then(
                response => {
                    response.json().then(
                        data => {
                            appendSelect("section-select", data.features, "label", "geo_section");
                            emptySelect("parcelle-select");
                        }
                    ).then(() => document.getElementById('loading-cad').style.display = "none")
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
                            appendSelect("parcelle-select", data.features, "label", "geo_parcelle");
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
                fetch('demo/cad/data/data.json')
                    .then(function (response) {
                        response.json()
                            .then(function (data) {
                                setData(data);
                            });
                    });
            }
        },

        destroy: function () {
            console.log('destroy');
        }
    };

}());