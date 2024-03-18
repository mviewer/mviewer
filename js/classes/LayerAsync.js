import Layer from "./Layer";

class LayerAsync extends Layer {
    constructor(options, configuration) {
        super(options, configuration);
        // usefull props to manage async layers
        this.isAsync = true;
        this.asyncLayerPromise = null;
        this.loader = null;

    }
    setLoader(loader) {
        this.loader = loader;
    }

    setAsync(isAsync) {
        this.isAsync = isAsync;
    }

    async createCustomLayer() {
        const urlWithProxy = getProxyfiedUrl();
        if (this.isAsync) {
            // => classic JS async load
            // create promise and execute func on load end
            this.asyncLayerPromise = loadCustomLayerFile(urlWithProxy);
            this.asyncLayerPromise.then((id) => this.loader(id));
        } else {
            // => force to wait loading to continue
            this.asyncLayerPromise = await loadCustomLayerFile(urlWithProxy);
            this.loader(options.id);
        }
    }

    createLayer() {
        switch (this.type) {
            case "customlayer":
                // will create a promise that allow to wait layer loading
                this.createCustomLayer();
                break;
        }
    }
}

export default LayerAsync;