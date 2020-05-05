mviewer.customLayers.cad = (function () {
    var _layer = new ol.layer.Vector({
        source: new ol.source.Vector()
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
    var _handle = function(){
        
    }
    return {
        layer: _layer,
        highlightStyle: _highlightStyle
    };
}());
