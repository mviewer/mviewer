import { makeCqlFilter } from "../utils/cql";
import { getParamsFromOwsOptionsString } from "../utils/ogc";
import defaultConst from "../const/config";
class LayerWMS {
    constructor(layerOptions, proxy, crossOrigin) {
        this.layerId = layerOptions.layerid;
        this.layer = null;
        this.source = null;
        this.url = layerOptions.url;
        this.proxy = layerOptions.useproxy ? _proxy : "";
        this.LAYERS = layerOptions.layername;
        this.STYLES = layerOptions.style || "";
        this.FORMAT = layerOptions.format || "image/png";
        this.TRANSPARENT = layerOptions.transparent || true;
        this.CQL_FILTER = this.getCqlFilter(layerOptions);
        this.TILED = layerOptions?.tiled === "true";
        this.SLD = oLayer.sld || "";
        this.owsOptions = getParamsFromOwsOptionsString(layerOptions.owsoptions);
        this.crossOrigin = crossOrigin;
    }

    crateLayer = () => {
        this.createSource();
        const olLayerTypeFunc = this.TILED ? ol.layer.Tile : ol.layer.Image;
        this.layer = new olLayerTypeFunc({
            source: this.source
        });
    }

    createSource = () => {
        const srcProps = {
            url: this.url,
            crossOrigin: this.crossOrigin,
            params: this.getParams()
        }
        if (this.TILED) {
            srcProps.tileLoadFunction = this.customWmsImageLoader;
            this.source = new ol.source.TileWMS(srcProps);
        }
        srcProps.imageLoadFunction = this.customWmsImageLoader;
        this.source = new ol.source.ImageWMS(srcProps);
        this.source.set("layerid", this.layerId);
    }

    setVisible(visible) {
        const target = $("#loading-" + this.layerId);
        visible ? target.show() : target.hide();
    }
    /**
     * init events
     * TODO : control if every events are usefull according to source type (tiled or not)
     */
    initEvents() {
        // tiled - used if src is tiled ?
        this.source.addEventListener("imageloadstart", event => this.setVisible(true));
        this.source.addEventListener("imageloadend", event => this.setVisible(false));
        this.source.addEventListener("imageloaderror", event => this.setVisible(false));
        // not tiled - used if src is image ?
        this.source.addEventListener("tileloadstart", event => this.setVisible(true));
        this.source.addEventListener("tileloadend", event => this.setVisible(false));
        this.source.addEventListener("tileloaderror", event => this.setVisible(false));
    }

    getParams = () => {
        const params = {
            LAYERS: this.LAYERS,
            STYLES: this.STYLES,
            FORMAT: this.FORMAT,
            TRANSPARENT: this.TRANSPARENT,
            SLD: this.SLD,
            TILED: this.TILED
        }
        if (this.CQL_FILTER) {
            params.CQL_FILTER = this.CQL_FILTER;
        }
        params = { ...params, ...this.owsOptions };
    }

    getCqlFilter = (options) => {
        const cqlFilter = "";
        if (options.filter) {
            cqlFilter = options.filter
        }
        if (
            options.attributefilter &&
            options.attributefilterenabled &&
            options.attributevalues.length > 1
        ) {
            cqlFilter = makeCqlFilter(
                options.attributefield,
                options.attributeoperator,
                options.attributevalues[0],
                options.wildcardpattern
            );
        }
        return cqlFilter
    }

    getProxy() {
        return this.proxy;
    }

    customWmsImageLoader(image, src) {
        const proxy = this.getProxy();
        if (proxy) {
            src = proxy + encodeURIComponent(src);
        }

        // S'il existe des idenfiants d'accès pour ce layer, on les injecte
        const _ba_ident = sessionStorage.getItem(this.url);
        if (_ba_ident && _ba_ident != "") {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open("GET", src);
            xhr.setRequestHeader("Authorization", "Basic " + window.btoa(_ba_ident));
            xhr.addEventListener("loadend", function (evt) {
                const data = this.response;
                if (this.status == "401") {
                    image.getImage().src = defaultConst.BLANK_SRC;
                } else if (data && data !== undefined) {
                    image.getImage().src = URL.createObjectURL(data);
                }
            });
            xhr.onload = function () {
                image.getImage().src = src;
            };
            xhr.send();
        } else {
            image.getImage().src = src;
        }
    }
}

export default LayerWMS;