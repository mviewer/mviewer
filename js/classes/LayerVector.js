class LayerVector {
    constructor(format) {
        this.source;
        this.layer;
        this.format = format;
    }

    setFormat(format) {
        this.format = format;
    }

    getLayer() { return this.layer }

    createSource() {
        this.layer = new ol.source.Vector({
            url: layer.url,
            format: this.format
        })
    }

    createLayer() {
        this.createSource();
        return new ol.layer.Vector({
            source: this.source
        });
    }
}

export default LayerVector;