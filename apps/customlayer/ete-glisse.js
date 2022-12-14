
mviewer.customLayers.ete_glisse= (function() {
    let data_url='https://public.sig.rennesmetropole.fr/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=eq_cultspo:v_sport_proximite&outputFormat=application/json&srsname=EPSG:3857';
    let markercolor='#E44C2D';
    
    
    function pctStyle() {
        let style = new ol.style.Style({
                image: new ol.style.Icon({
                  color: markercolor,
                  crossOrigin: 'anonymous',
                  scale:1,
                  anchor:[0.5,1],
                  src: 'apps/customlayer/picture/marker.svg',
                }),
              });
        return [style];
    }
    
    let dataLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: data_url + "&CQL_FILTER=pratiques = 'Glisse urbaine' AND equip_type = 'Activités de glisse'",
            format: new ol.format.GeoJSON()
        }),
        style: pctStyle,
    });
    
    
    return {
        layer: dataLayer,
    }
}());


