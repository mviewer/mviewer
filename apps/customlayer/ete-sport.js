
mviewer.customLayers.ete_sport= (function() {
    let data_url='https://public.sig.rennesmetropole.fr/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=eq_poi:v_sitorg_organisme&outputFormat=application/json&srsname=EPSG:3857';
    //let l_id_org=[4883,307,57,6792,1025,4699,98,857,966,4795,4954,4798,1477,5562,4883,914,383,6245,6795,6796, 993];
    let l_id_org=[57];
    let markercolor='#62bcf5';
    
    
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


