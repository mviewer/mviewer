
mviewer.customLayers.ete_monuments= (function() {
    let data_url='https://public.sig.rennesmetropole.fr/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=eq_poi:v_sitorg_organisme&outputFormat=application/json&srsname=EPSG:3857';
    //let l_id_org=[5120,319,659,50,5434,245,4705,6276,1217,4849,4780,5084, 6804, 6813];
    let l_id_org=[1217,4849,4780,5120];
    let markercolor='#d9762b';
    
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
            url: data_url + '&CQL_FILTER=id_organisme%20IN%20%28' + l_id_org.join('%2C') + '%29',
            format: new ol.format.GeoJSON()
        }),
        style: pctStyle,
    });
    
    
    return {
        layer: dataLayer,
    }
}());


