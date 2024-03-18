import { setVisibleOverLayers } from "./overlayers";
export const applyPermalink = (map) => {
    // get  x, y & z url parameters if exists
    if (API.x && API.y && API.z) {
        const center = [parseFloat(API.x), parseFloat(API.y)];
        const zoom = parseInt(API.z);
        map.getView().setCenter(center);
        map.getView().setZoom(zoom);
    }
    // get visible layers
    if (API.l) {
        setVisibleOverLayers(API.l);
    }
}