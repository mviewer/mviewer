{
mviewer.customLayers.bief = {};
var bief = mviewer.customLayers.bief;

bief.legend = { items: [
    {
        label: "Enjeu bio. modéré",
        geometry: "LineString",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(129, 236, 236,1.0)', width: 4 })
        })]
    },
    {
        label: "Enjeu bio. élevé",
        geometry: "LineString",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(0, 206, 201,1.0)', width: 4 })
        })]
    },
    {
        label: "Enjeu bio. très élevé",
        geometry: "LineString",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(250, 177, 160,1.0)', width: 4 })
        })]
    },
    {
        label: "Enjeu bio. majeur",
        geometry: "LineString",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(225, 112, 85,1.0)', width: 4 })
        })]
    },
    {
        label: "Enjeu bio. inconnu",
        geometry: "LineString",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(255, 234, 167,1.0)', width: 4 })
        })]
    }
] };

mviewer.customLayers.bief.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=bief&outputFormat=application/json&srsName=EPSG:4326",
            format: new ol.format.GeoJSON()
        }),
        style: function(feature, resolution) {
            var stl;            
            if (feature.get('enjeu_bio')) {           
                switch (feature.get('enjeu_bio')) {
                    case "modéré":
                        stl = bief.legend.items[0].styles;
                        break;
                    case "élevé":
                        stl = bief.legend.items[1].styles;
                        break;
                    case "très élevé":
                        stl = bief.legend.items[2].styles;
                        break;
                    case "majeur":
                        stl = bief.legend.items[3].styles;
                        break;        
                    default:
                        stl = bief.legend.items[1].styles;
                }
            }            
            return stl;
        }
});
mviewer.customLayers.bief.handle = false;
}