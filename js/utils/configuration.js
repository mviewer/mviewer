import configConst from "../const/config";

export const displayVersion = () => {
    console.log("Mviewer version " + configConst.VERSION);
    $("#mviewerinfosbar").append(configConst.VERSION);
}

export const readShortUrl = () => {
    let configFile;
    const fragment = window.location.hash.split("#")[1];
    if (fragment) {
        configFile = fragment;
        if (!configFile.startsWith("/")) {
            configFile = `apps/${ configFile }`;
        } else {
            configFile = `apps${ configFile }`;
        }
    }
    if (configFile && !configFile.endsWith(".xml")) {
        configFile = `${ configFile }.xml`;
    }
    return configFile;
};

export const loadXmlConfig = async () => {
    const configFile = getDefaultConfigPath();
    // get xml
    const xmlUrl = configFile + "?_dc=" + new Date().getTime();
    const fileRequest = await fetch(xmlUrl);
    const xmlParser = new DOMParser();
    const xmlAsStr = await fileRequest.text();
    return xmlParser.parseFromString(xmlAsStr, "application/xml");
};

export const getDefaultConfigPath = () => {
    // Search for a config param
    const paramsUrl = new URLSearchParams(window.location.search);
    return paramsUrl.get("config") || readShortUrl() || "apps/default.xml";
};

export const decodeString = (str) => {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, "/");
}

export const renderEnvPath = (str, env) => {
    if (!str || !env) return;
    return _decodeString(Mustache.render(str, env));
}

export const parseJsonConfig = function (config) {
    // transtype baselayer, theme, group, layer
    //those types should be array
    //if type is object, push it into new Array
    if (!Array.isArray(config.baselayers.baselayer)) {
        config.baselayers.baselayer = [config.baselayers.baselayer];
    }
    config.baselayers = config.baselayers;
    if (!Array.isArray(config.themes.theme)) {
        if (config.themes.theme) {
            config.themes.theme = [config.themes.theme];
        } else {
            config.themes.theme = [];
        }
    }
    if (config.themes.theme !== undefined) {
        config.themes.theme.forEach(function (theme) {
            if (theme.group) {
                if (!Array.isArray(theme.group)) {
                    theme.group = [theme.group];
                }
            } else {
                theme.group = [];
            }
            theme.group.forEach(function (group) {
                if (!Array.isArray(group.layer)) {
                    group.layer = [group.layer];
                }
            });
            if (theme.layer) {
                if (!Array.isArray(theme.layer)) {
                    theme.layer = [theme.layer];
                }
            }
        });
    }

    return config;
}
