
mviewer.customLayers.ete_parcs= (function() {
    let data_url='https://public.sig.rennesmetropole.fr/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=eq_poi:v_sitorg_organisme&outputFormat=application/json&srsname=EPSG:3857';
    //let l_id_org=[5067,4883,235,45,359,5093,307,4732,57,4797,6043,6794,4951,1123,229,195,1165];
    let l_id_org=[235];
    let markercolor='#cc8db2';
    
    
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


