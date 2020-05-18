let stylePublic = [new ol.style.Style({
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

let stylePrive = [new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(99, 110, 114,1.0)'
        }),
        stroke: new ol.style.Stroke({
            color: "#ffffff",
            width: 4
        }),
        radius: 9
    })
})];

let legend = { items: [] };

legend.items.push({styles:stylePublic, label: "Public", geometry: "Point"});
legend.items.push({styles:stylePrive, label: "Privé", geometry: "Point"});

let layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=lycee&outputFormat=application/json&srsName=EPSG:4326",
            format: new ol.format.GeoJSON()
        }),
        style: function(feature, resolution) {
            var stl;
            if(feature.get('secteur_li') === 'Public') {
                stl = stylePublic;
            } else if(feature.get('secteur_li') === "Privé sous contrat avec l'éducation nationale") {
                stl = stylePrive;
            }
            return stl;
        }
});

new CustomLayer("lycee", layer, legend);
