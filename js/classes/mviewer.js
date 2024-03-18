import { getDefaultEnvPath } from "../init/utils";
import { getDefaultConfigPath, loadXmlConfig } from "../utils/configuration";

import { parseXML } from "../utils/configuration";
import { setVisibleOverLayers } from "../utils/overlayers";

import Configuration from "../classes/configuration";

class Mviewer {
    constructor(map) {
        this.map = map;
        this.env = {};
        this.config = null;
    }

    async init() {
        this.initConfig();
        this.initEnv();
    }

    async initEnv() {
        const configEnv = await loadEnvFile(getDefaultConfigPath()?.replace(".xml", ".json"));
        const defaultEnv = await loadEnvFile(getDefaultEnvPath());
        this.env = this.env || configEnv || defaultEnv;
    }

    async initConfig() {
        let config = await loadXmlConfig();
        this.config = new Configuration(config);
    }

    onLayersLoaded() {
        mviewer.overLayersReady();
        mviewer.showLayersByAttrOrder(mviewer.getLayersAttribute("rank"));
        mviewer.orderLayerByIndex();
    }

    getLayer(id) {
        return this.map.getLayerById(id);
    }

    getLayerByName(name) {
        return this.map.getLayerByName(name);
    }

    getMvLayer(id) {
        return this.map.getLayerByMviewerId(id);
    }

    changeOverLayers = (layersToShow) => {
        let layersWithOptions = setVisibleOverLayers(layersToShow, this.layers);
        return setVisibleOverLayers(layersToShow, this.layers);
    }
}

export default Mviewer;