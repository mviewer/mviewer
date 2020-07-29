mviewer.customLayers.cad = (function () {
    var _layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: _defaultStyle
    });
    var _highlightStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ff0000',
            width: 4,
            opacity: 1
        }),
        zIndex:1
    });
    var _defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
        })
    });
    var _handle = function(features){
        let cad_control = mviewer.customControls.cad;
        let src = _layer.getSource();
        src.getFeatures().every(function(feature){
            if(feature.get("geo_parcelle")===features[0].getProperties().geo_parcelle){
                if(cad_control.editSelectedParcelle())
                {
                    cad_control.editSelectedParcelle().setStyle(_defaultStyle);
                }
                feature.setStyle(_highlightStyle);
                cad_control.editSelectedParcelle(feature);
                return false;
            }
            return true;
        });
        
    }
    return {
        layer: _layer,
        highlightStyle: _highlightStyle,
        defaultStyle: _defaultStyle,
        handle:_handle
    };
}());
