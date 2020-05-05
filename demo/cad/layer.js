mviewer.customLayers.cad = (function () {
    // var map = mviewer.getMap();
    // var highlightStyle = new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: 'rgba(255,255,255,0.7)'
    //     }),
    //     stroke: new ol.style.Stroke({
    //         color: '#3399CC',
    //         width: 3
    //     })
    // });
    // var hoveredFeature = null;
    // map.on('pointermove', function (e) {
    //     let source = mviewer.getLayer("cad").layer.getSource();
    //     if (source.getFeatures().length != 0) {
    //         var findHoveredFeature = new Promise(
    //             function (resolve, reject) {
    //                 var feature_hover = map.forEachFeatureAtPixel(e.pixel, function (f) {
    //                     return f;
    //                 });
    //                 if (feature_hover !== "undefined") {
    //                     resolve(feature_hover); // fulfilled
    //                 } else {
    //                     resolve(false); // reject
    //                 }
    //             }
    //         ).then(data => {
    //             if (data && data.clicked !== 1) {
    //                 if (hoveredFeature != null) {
    //                     hoveredFeature.setStyle(undefined);
    //                 }
    //                 hoveredFeature = data;
    //                 data.setStyle(highlightStyle);
    //             } else if (!data) {
    //                 if (hoveredFeature != null)
    //                     hoveredFeature.setStyle(undefined);
    //                 console.log("!data");
    //             }
    //         })

    //     }

    // });
    var getText = function (feature, resolution) {
        var maxResolution = 6;
        var text = feature.get('nom');
        if (resolution > maxResolution) {
            text = '';
        }
        return text.toUpperCase();
    };

    var createTextStyle = function (feature, resolution) {
        var align = 'Start';
        var baseline = 'Middle';
        var size = '10px';
        var offsetX = 0;
        var offsetY = -15;
        var weight = 'Normal';
        var rotation = 0;
        var font = weight + ' ' + size + ' ' + 'Verdana';
        var fillColor = '#aa3300';
        var outlineColor = '#ffffff';
        var outlineWidth = 2;

        return new ol.style.Text({
            /*textAlign: align,*/
            /*textBaseline: baseline,*/
            font: font,
            text: getText(feature, resolution),
            fill: new ol.style.Fill({
                color: fillColor
            }),
            stroke: new ol.style.Stroke({
                color: outlineColor,
                width: outlineWidth
            }),
            offsetX: offsetX,
            offsetY: offsetY,
            rotation: rotation
        });
    };
    var _styleFunction = function (feature, resolution) {
        return [new ol.style.Style({
            text: createTextStyle(feature, resolution)
        })]
    }
    var _layer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    return {
        layer: _layer,
        labelStyle: _styleFunction
    };
}());

// mviewer.customLayers.cad.handle = function (features, views) {
//     // var highlightStyle = new ol.style.Style({
//     //     fill: new ol.style.Fill({
//     //         color: 'rgba(255,255,255,0.7)'
//     //     }),
//     //     stroke: new ol.style.Stroke({
//     //         color: '#ff0000',
//     //         width: 4
//     //     })
//     // });
//     // let source = mviewer.getLayer("cad").layer.getSource();
//     // source.getFeatures().every(function (feature) {
//     //     if (feature.values_.geo_parcelle === features[0].properties.geo_parcelle) {
//     //         feature.clicked = 1;
//     //         feature.setStyle(highlightStyle);
//     //         return false;
//     //     }
//     //     else{
//     //         feature.clicked = 0;
//     //         feature.setStyle(undefined);
//     //     }
//     //     return true;


//     // })

// };