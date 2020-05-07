mviewer.customLayers.cad2 = (function () {
    
        
    var _baseurl = `https://inspire.cadastre.gouv.fr/scpc/5d04f99b4e6140129e/35238.wms`;
    
    var wms_params = {
       'LAYERS':'AMORCES_CAD,LIEUDIT,CP.CadastralParcel,SUBFISCAL,CLOTURE,DETAIL_TOPO,HYDRO,VOIE_COMMUNICATION,BU.Building,BORNE_REPERE',
       'TILED':'true',
       'CRS':'EPSG:3857',
       'FORMAT': 'image/png',
       'TRANSPARENT': true
    };
    
    
    
    var _source = new ol.source.TileWMS({
        url: _baseurl,
        params: wms_params
    });

    var _layer = new ol.layer.Tile({
        source: _source
    });
    
    
    var _updateCommune = function (commune) {       
        _source.setUrl(`https://inspire.cadastre.gouv.fr/scpc/5d04f99b4e6140129e/${commune}.wms`);
    };
    
    return {
        layer: _layer,        
        handle:false,
        updateCommune: _updateCommune
    };
}());
