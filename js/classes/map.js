import { setVisibleOverLayers } from "../utils/overlayers";
import { createView, defaultMoveEndChange, defaultResolutionChange } from "../utils/map";
import { getProjection } from "../utils/map";
import { dispatchNewEvent } from "../utils/events";

class Map {
    constructor({ projCode, extent, zoom, center, rotation, rotation, maxzoom }) {
        const projection = getProjection(projCode, extent);
        this.baseLayers = [];
        this.layers = [];
        this.overLayers = [];
        this.zoom = 6;
        this.rotation = rotation === "true";
        this.center = [689534, 6059555];
        this.projection = projection;
        this.view = createView({ projection, maxzoom, center, rotation, zoom, extent });
        this.marker = null
    }

    init() {
        utils.initWMTSMatrixsets(this.projection);
        this.initSearchLayer();
        this.initMapEvents()
        dispatchNewEvent("map-ready", { map: this.map });
    }

    getLayers() { return this.map.getLayers().getArray(); }

    getLayersValuesByKey(key = "id") {
        return this.getLayers().map(layer => layer.get(key));
    }

    getLayerById(id, key = "id") {
        let search = this.getLayers().filter(layer => layer.get(key) && layer.get(key) === id);
        return search.length ? search[0] : null;
    }

    getLayerByMviewerId(id) {
        return this.getLayerById(id, "mviewerid");
    }

    getLayerByName(name) {
        return this.getLayers().filter(layer => layer.get("name") === name)[0];
    }

    getLayersByVisibility(visible) {
        return this.getLayers().filter(layer => layer.getVisible() === visible);
    }

    getVisibleLayers() { return this.getLayersByVisibility(true); }

    getHiddenLayers() { return this.getLayersByVisibility(false); }

    initMarkerLayer() {
        let markerOverlay = new ol.Overlay({
            positioning: "bottom-center",
            element: document.getElementById("mv_marker"),
            stopEvent: false,
        });
        this.overLayers.push(markerOverlay);
    }

    changeLayerOpacity(id, value) {
        const layer = this.getLayerById(id);
        if (layer) layer.setOpacity(parseFloat(value));
    }

    getLayerOpacity(id) {
        const layer = this.getLayerById(id)
        if (layer) return layer.getOpacity();
    }

    initMapEvents() {
        this.map.on("moveend", defaultMoveEndChange);
        this.view.on("change:resolution", defaultResolutionChange);
    }

}

export default Map;
