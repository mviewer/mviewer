{
    mviewer.customLayers.cluster = {};
    var cl = mviewer.customLayers.cluster;
    cl.legend = { items:[] };
    var uniqueStyle = [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'rgba(231, 76, 60, 0.7)'
                })
            })
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: 'rgba(236, 240, 241,7.0)'
                })
            })
        })
    ];
    cl.legend.items.push({styles:uniqueStyle, label: "Dossier", geometry: "Point"});
    var manyStyle = function (radius, radius2, size) {
        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: 'rgba(236, 240, 241,0.7)'
                    })
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 3
              }),
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
              })
            }),
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius2,
                    fill: new ol.style.Fill({
                        color: 'rgba(231, 76, 60, 0.7)'
                    })
                }),
                text: new ol.style.Text({
                    font: '12px roboto_regular, Arial, Sans-serif',
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            })
        ];
    };
    cl.legend.items.push({styles:manyStyle(10,10,7), label: "Groupe de dossiers", geometry: "Point"});

    var clusterStyle = function(feature) {
        var size = feature.get('features').length;
        var max_radius = 40;
        var max_value = 500;
        var radius = 10 + Math.sqrt(size)*(max_radius / Math.sqrt(max_value));
        var radius2 = radius *80 /100 ;
        if (size == 1) {
            return uniqueStyle;
        } else {
            return manyStyle(radius, radius2, size);
        }
    };

    cl.layer = new ol.layer.Vector({
        source: new ol.source.Cluster({
            distance: 50,
            source: new ol.source.Vector({
                url: "https://geobretagne.fr/geoserver/dreal_b/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=dreal_b:projets-environnement-diffusion&outputFormat=application/json&srsName=EPSG:4326&bbox=-6,47,0,49",
                format: new ol.format.GeoJSON()
            })
        }),
        style: clusterStyle

    });
    cl.handle = function(clusters, views) {
        if (clusters.length > 0 && clusters[0].properties.features) {
            var features = clusters[0].properties.features;
            var elements = [];
            var l = mviewer.getLayer("cluster");
            features.forEach(function(feature, i) {
                elements.push({
                    properties: feature.getProperties()
                });
            });
            var html;
            if (l.template) {
                html = info.templateHTMLContent(elements, l);
            } else {
                html = info.formatHTMLContent(elements, l);
            }
            var panel = "";
            if (configuration.getConfiguration().mobile) {
                panel = "modal-panel";
            } else {
                panel = "right-panel"
            }
            var view = views[panel];
            view.layers.push({
                "id": view.layers.length + 1,
                "firstlayer": true,
                "manyfeatures": (features.length > 1),
                "nbfeatures": features.length,
                "name": l.name,
                "layerid": "cluster",
                "theme_icon": l.icon,
                "html": html
            });
        }

    };
}