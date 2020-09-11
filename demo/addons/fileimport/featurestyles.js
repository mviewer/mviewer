var getImportStyle = function (feature) {
    var _rgb = '0, 153, 255';
    var _width = 1;

    var _importFillColor = `rgba(${_rgb}, 0.2)`;
    var _importStrokeColor = `rgba(${_rgb}, 1)`;

    var _importStyle = {
        'Point': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: _importFillColor
                }),
                stroke: new ol.style.Stroke({
                    color: _importStrokeColor,
                    width: _width
                })
            })
        }),
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: _importStrokeColor,
                width: _width
            })
        }),
        'Polygon': new ol.style.Style({
            fill: new ol.style.Fill({
                color: _importFillColor
            }),
            stroke: new ol.style.Stroke({
                color: _importStrokeColor,
                width: _width
            })
        })
    };
    _importStyle['MultiPoint'] = _importStyle['Point'];
    _importStyle['MultiLineString'] = _importStyle['LineString'];
    _importStyle['MultiPolygon'] = _importStyle['Polygon'];

    return _importStyle[feature.getGeometry().getType()];
}