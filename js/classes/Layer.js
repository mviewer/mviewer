import config from "../const/config";
import LayerWMS from "./LayerWMS";
import LayerVector from "./LayerVector";
import { loadCustomLayerFile } from "../utils/customLayers";
class Layer {
    constructor(options, configuration) {
        this.options = options;
        this.proxy = configuration.getProxy() || "";
        this.crossOrigin = configuration.getCrossorigin();
        this.type = options.type;
        this.projection = options?.projection;
        this.geocodingField = options?.geocodingfields ? options?.geocodingField.split(",") : null;
        this.geocoderurl = options?.geocoderurl;
        this.geocoder = options?.geocoder || false;
        this.mapProjection = conf.mapoptions.projection;
        this.url = options?.url;

    }

    createLayerWms() {
        this.layer = new LayerWMS(this.options, this.proxy, this.crossOrigin)
    }
    createGeoJsonLayer() {
        this.layer = new LayerVector(new ol.format.GeoJSON());
    }
    crateKmlLayer() {
        this.layer = new LayerVector(new ol.format.KML());
    }
    createImportLayer() {
        this.layer = new LayerVector(new ol.source.Vector());
    }
    getProxyfiedUrl() {
        return this.proxy + this.url;
    }
    createLayer() {
        switch (this.type) {
            case "WMS":
                this.createLayerWms();
                break;
            case "geojson":
                this.createGeoJsonLayer();
                break;
            case "kml":
                this.crateKmlLayer();
                break;
            case "import":
                break;
        }
    }
}

export default Layer;