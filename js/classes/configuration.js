import { displayVersion, parseJsonConfig } from "../utils/configuration";
import { getHelpTitle, readStats, getApplicationTitle, getLanguages, getLogo, showHelpOnStart, getIconHelp } from "../utils/configuration/application";
import { initDefaultBaseLayer } from "../utils/configuration/baseLayers";
import { authent } from "../utils/configuration/authent";
import { onRestrictedLayerClick } from "../utils/restrictedLayer";

/**
 * TODO :
 * - create mviewer class
 * - create base layer (see getDefaultBaseLayer method)
 * 
 */
class Configuration {
    constructor(xmlParsed) {
        const configAsJson = $.xml2json(xmlParsed);
        this.config = parseJsonConfig(configAsJson);
        this.lang = "";
        this.languages = [];
        this.title = "";
        this.authentification = { enabled: false, url: "", loginurl: "", logouturl: "" };
        this.map = null;
        this.showhelp_startup = null;
        this.captureCoordinates = null;
        this.typecoordinate = null;
        this.togglealllayersfromtheme = null;
        this.proxy = null;
        this.crossOrigin
    }

    init() {
        displayVersion();
        utils.testConfiguration(this.config);
        this.initApplication(this.config.application);
        this.initBaseLayers(this.config.baselayers);
    }
    initBaseLayers(baseLayers) {
        this.baseLayer = initDefaultBaseLayer(baseLayers);
    }
    initApplication(appConfig) {
        this.title = getApplicationTitle(appConfig);
        this.showhelp_startup = showHelpOnStart(appConfig);
        this.captureCoordinates = appConfig.coordinates === "true";
        this.typecoordinate = appConfig.coordinatestype || "xy";
        this.togglealllayersfromtheme = appConfig.togglealllayersfromtheme === "true";
        this.proxy = appConfig.proxy && appConfig.proxy.url;
        this.crossOrigin = appConfig.exportpng != "true" ? "anonymous" : null;

        document.getElementById("exportpng").style.display = appConfig.exportpng != "true" ? "none" : "";
        document.getElementById("mouse-position").style.display = appConfig?.mouseposition === "false" ? "none" : "";
        document.getElementById("geolocbtn").style.display = appConfig?.geoloc != "true" ? "none" : "";
        appConfig?.studio === "false" ? document.getElementById("studiolink").remove() : "";
        appConfig?.mapprint === "false" ? document.getElementById("mapprint").remove() : "";
        appConfig?.home ? $(".mv-logo").parent().attr("href", appConfig.home) : "";
        // if (appConfig?.mapfishurl) {
        //     document.querySelector("#georchestraForm")?.attr?.("action", appConfig.mapfishurl);
        // } else {
        //     document.querySelector("#shareToMapfish")?.style?.display = "none";
        // }
        this.initAuthent();
        this.getLang();

        getIconHelp(appConfig);
        readStats(appConfig);
        getHelpTitle(appConfig);
        getLogo(appConfig);

        // events
        onRestrictedLayerClick();
    }

    getproxy() { return this.proxy }
    getCrossOrigin() { return this.crossOrigin }

    getLang() {
        const languages = getLanguages(this.config);
        this.lang = languages.default;
        this.languages = languages.all;
    }

    setMap(map) {
        this.map = map;
    }

    initAuthent() {
        this.authentification.enabled = this.config?.authentification?.enabled === "true";
        if (this.authentification.enabled) {
            this.authentification.url = this.config?.authentification.url;
            this.authentification.loginurl = this.config?.authentification.loginurl;
            this.authentification.logouturl = this.config?.authentification.logouturl;
        }
        authent(this.authentification);
    }
}

export default Configuration;