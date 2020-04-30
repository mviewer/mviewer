mviewer.customControls.cad = (function() {
    var _data = false;
    var defaultParameters = {
            "BASEURL": "https://geobretagne.fr/geoserver/cadastre/wfs",
            "SERVICE": "WFS",
            "VERSION": "2.0.0",
            "REQUEST": "GetFeature",
            "outputFormat": "application/json",
            "srsName": "EPSG:4326" 
    }
    var querybuilder = function(options){
        options = Object.assign(Object.assign({}, defaultParameters), options);
        let url = "";
        Object.keys(options).forEach(function (key) {
            if(key==="BASEURL")
                url = options[key]+"?" + url;
            else
                url += "&"+key+"="+options[key]
        });
        console.log(url);
        return encodeURI(url);
    }
    var setData = function (data) {
        if (!_data) {
            _data = data;
            console.log(data);
            appendSelect('dep-select', data.departements, false);
            document.getElementById('dep-select').addEventListener("change", onDptChange);
            document.getElementById('com-select').addEventListener("change", onComChange);
            document.getElementById('section-select').addEventListener("change", onParcChange);
        }
    };
    var appendSelect = function (select, data, remove) {
        let element  = document.getElementById(select);
        if (remove) {
            element.value = "";
            let options = element.getElementsByTagName("option");

            for (let i = 0;i < options.length; i++) {
                element.remove(1);
            }
        }

        data.forEach(function(item) {
            let option = document.createElement("option");
            option.text = item.label;
            option.value = item.value;
            element.add(option);
        })
    };

    var setLayerSource = function (data) {
        let layer = mviewer.getLayer('cad').layer;
        let src = layer.getSource();
        src.clear();
        src.addFeatures(
            new ol.format.GeoJSON().readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        );
        mviewer.getMap().getView().fit(src.getExtent());
    };

    var onDptChange = function (e) {
        let selectedDpt = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralZoningLevel1",
            "PROPERTYNAME": "nom_commune,geo_commune",
            "CQL_FILTER": "departement="+selectedDpt
        }
        fetch(querybuilder(options)).then(
            response => {
                response.json().then(
                    data => {
                        let element  = document.getElementById('com-select');
                        data.features.forEach(function(item) {
                            let option = document.createElement("option");
                            option.text = item.properties.nom_commune;
                            option.value = item.properties.geo_commune;
                            element.add(option);
                        })
                    }
                )
            }
        );
    };

    var onComChange = function (e) {
        let selectedCom = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralZoning",
            "CQL_FILTER": "geo_commune="+selectedCom
            
        }
        fetch(querybuilder(options))
        .then(
            response => {
                response.json().then(
                    data => {
                        console.log("Com  : ",data);
                        
                        let element  = document.getElementById('section-select');
                        data.features.forEach(function(item) {
                            let option = document.createElement("option");
                            option.text = item.properties.label;
                            option.value = item.properties.geo_section;
                            element.add(option);
                        })
                    }
                )
            }
        );
    };
    var onParcChange = function (e) {
        let selectedSection = e.target.value;
        let options = {
            "TYPENAME": "CP.CadastralParcel",
            "CQL_FILTER": "geo_section="+selectedSection
            
        }
        
        fetch(querybuilder(options))
        .then(
            response => {
                response.json().then(
                    data => {
                        console.log(data);
                        
                        //setLayerSource(data);
                    }
                )
            }
        );
    };

    return {
        /*
         * Public
         */

        init: function() {
            console.log('init cad');
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

        destroy: function() {
            console.log('destroy');
        }
    };

}());
