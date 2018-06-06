var mviewer = mviewer || {};
mviewer.featureStyles = {};

mviewer.featureStyles.elsStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(47, 194, 195, 0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: '#2fc2c3',
        width: 1
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: 'rgba(255,255,0,0)'
        }),
        stroke: new ol.style.Stroke({
            color: '#2fc2c3',
            width: 5
        })
    })
});

mviewer.featureStyles.crossStyle = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({color: 'red'}),
        stroke: new ol.style.Stroke({color: 'red', width: 2}),
        points: 4,
        radius: 10,
        radius2: 0,
        angle: 0
    })
});

mviewer.featureStyles.highlight = new ol.style.Style({
  fill: new ol.style.Fill({color: 'rgba(212, 53, 50,0)'}),
  stroke: new ol.style.Stroke({color: 'rgba(217, 85, 82,1)', width: 4})
});

mviewer.featureStyles.circle1 = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: '#CC0000'
        }),
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 2
        })
    })
});

var getText = function(feature, resolution) {
    var type = 'Normal';
    var maxResolution = 75;
    var text = feature.get('nom');

    if (resolution > maxResolution) {
        text = '';
    } else if (type == 'hide') {
        text = '';
    } else if (type == 'shorten') {
        text = text.truncate(12);
    } else if (type == 'wrap') {
        text = text.divide(16, '\n');
    }

    return text;
};

var createTextStyle = function(feature, resolution) {
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
        fill: new ol.style.Fill({color: fillColor}),
        stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
        offsetX: offsetX,
        offsetY: offsetY,
        rotation: rotation
    });
};