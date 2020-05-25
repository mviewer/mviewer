{
mviewer.customLayers.pnr = {};
var pnr = mviewer.customLayers.pnr;

pnr.legend = { items: [
    {
        label: "PNR d'Armorique",
        geometry: "Polygon",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(248, 194, 145,1.0)', width: 3 }),
            fill: new ol.style.Fill({ color: 'rgba(248, 194, 145,.7)'})
        })]
    },
    {
        label: "PNR du golfe du Morbihan",
        geometry: "Polygon",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(246, 185, 59,1.0)', width: 3 }),
            fill: new ol.style.Fill({ color: 'rgba(246, 185, 59,0.7)'})
        })]
    },    
    {
        label: "Projet",
        geometry: "Polygon",
        styles: [new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(229, 80, 57,1.0)', width: 3 }),
            fill: new ol.style.Fill({ color: 'rgba(229, 80, 57,0.7)'})
        })]
    }
] };

mviewer.customLayers.pnr.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=parc_naturel_regional&outputFormat=application/json&srsName=EPSG:4326",
            format: new ol.format.GeoJSON()
        }),
        style: function(feature, resolution) {
            var stl;            
            if (feature.get('pnr_ident')) {                
                switch (feature.get('pnr_ident')) {
                    case "1":
                        stl = pnr.legend.items[0].styles;
                        break;
                    case "2":
                        stl = pnr.legend.items[1].styles;
                        break;                    
                    default:
                        stl = pnr.legend.items[2].styles;
                }
            }            
            return stl;
        }
});
mviewer.customLayers.pnr.handle = false;
}