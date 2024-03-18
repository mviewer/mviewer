export const pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: parseFloat(options.point.radius),
        fill: new ol.style.Fill({
            color: `rgba(${ options.point.fillcolor }, ${ options.point.opacity })`,
        }),
        stroke: new ol.style.Stroke({
            color: `rgba(${ options.point.strokecolor }, 1)`,
            width: parseFloat(options.point.strokewidth),
        }),
    }),
});

export const lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: `rgba(${ options.line.strokecolor }, ${ options.line.opacity })`,
        width: parseFloat(options.line.strokewidth),
    }),
});
export const polygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: `rgba(${ options.polygon.fillcolor }, ${ options.polygon.opacity })`,
    }),
    stroke: new ol.style.Stroke({
        color: `rgba(${ options.polygon.strokecolor }, 1)`,
        width: parseFloat(options.polygon.strokewidth),
    }),
});
export const getSelectStyle = function (options, feature) {
    const geometryType = feature.getGeometry().getType();
    const highlightSelect = {
        // point
        Point: pointStyle,
        MultiPoint: pointStyle,
        // line
        LineString: lineStyle,
        MultiLineString: lineStyle,
        // polygon
        Polygon: polygonStyle,
        MultiPolygon: polygonStyle
    };
    return highlightSelect[geometryType];
};