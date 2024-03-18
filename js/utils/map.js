import { updateLayersScaleDependancy } from "./layers";
import { updateLegendsScaleDependancy, setLayerScaleStatus } from "./layers";

/**
 * Default map move end event callback
 */
export const defaultMoveEndChange = () => {
    if (search.options.features && $("#searchfield").val()) {
        search.sendElasticsearchRequest($("#searchfield").val());
    }
}

/**
 * Private Method: _calculateScale
 *
 * Parameter res - resolution
 */

export const calculateScale = (res) => {
    let ppi = 25.4 / 0.28;
    return (res * ppi) / 0.0254;
};

/**
 * Default resolution change event callback
 * TODO : get scaled layers and scaled legends
 */
export const defaultResolutionChange = (e) => {
    const resolution = e.target.getResolution();
    const scale = calculateScale(resolution);
    scaledLayers.forEach(layer => setLayerScaleStatus(layer, scale));
    updateLayersScaleDependancy(scaledLayers, scale);
    updateLegendsScaleDependancy(scaledLegends, scale, resolution);
}
/**
 * 
 * @param {string} proj as "EPSG:4326"
 * @param {any} projExtent
 * @returns 
 */
export const getProjection = (projCode, projExtent) => {
    let projDef = ol.proj.get(projCode);
    if (!projDef && projExtent) {
        projDef = new ol.proj.Projection({
            code: projCode,
            extent: projExtent.split(",").map(function (item) {
                return parseFloat(item);
            }),
        })
    }
    return projDef;
}

/**
 * 
 * @param {object} projection ol.proj
 * @param {object} mapoptions from xml
 * @returns 
 */
export const createView = (projection, { maxzoom, center, rotation, zoom, extent }) => {
    return new ol.View({
        projection: projection,
        maxZoom: maxzoom || 19,
        center: center,
        enableRotation: rotation,
        zoom: zoom,
        extent: extent
            ? extent.split(",").map(function (item) {
                return parseFloat(item);
            })
            : undefined,
    })
}

/**
 * 
 * @param {Array} coordinate 
 * @param {string} epsgFrom 
 * @param {string} epsgFromTo 
 * @returns 
 */
export const formatCoordinates = (coordinate, epsgFrom, epsgFromTo = "EPSG:4326") => {
    let getCoord = ol.coordinate.toStringHDMS(
        ol.proj.transform(coordinate, epsgFrom, epsgFromTo)
    );
    return getCoord.replace(/ /g, "").replace("N", "N - ");
}

/**
 * 
 * @param {object} mapoptions object from xml
 * @param {object} projection def from view
 * @returns 
 */
export const createMap = (
    { scaleunits, scalebar, scalesteps, scaletext },
    view,
    overlays,
    render = "canvas"
) => {
    const projectionCode = view.getProjection().getCode();
    const map = new ol.Map({
        target: "map",
        controls: [
            //new ol.control.FullScreen(),
            new ol.control.Attribution({ collapsible: true }),
            new ol.control.ScaleLine({
                units: scaleunits || "metric",
                bar: scalebar === "true",
                steps: parseInt(scalesteps) || 2,
                text: scaletext == "true",
                maxWidth: 100,
            }),
            new ol.control.MousePosition({
                projection: projectionCode,
                undefinedHTML: "y , x",
                className: "custom-mouse-position",
                target: document.getElementById("mouse-position"),
                coordinateFormat: (coordinates) => formatCoordinates(coordinates, projectionCode)
            }),
        ],
        interactions: ol.interaction.defaults.defaults({
            doubleClickZoom: false,
        }),
        overlays: overlays,
        renderer: render,
        view: view
    });
    return map;
}