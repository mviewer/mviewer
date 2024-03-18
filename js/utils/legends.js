import { calculateScale } from "./map";
import { appendParams } from "./ogc";

export const setUrlLegendStatus = function (layer, visible) {
    var legendUrl = getLegendurl(layer);
    var panel = $("#legend-" + layer.id);
    if (visible) {
        panel.attr("src", legendUrl);
        panel.closest("li").removeClass("glyphicon mv-invisible");
    } else {
        panel.attr("src", "img/invisible.png");
        panel.closest("li").addClass("glyphicon mv-invisible");
    }
};

export const setVectorLegendStatus = (layer, visible) => {
    var panel = $("#vector-legend-" + layer.id);
    var cl = "hide" + layer.id;
    if (visible) {
        panel.removeClass("hidden");
        panel
            .parents()
            .find("." + cl)
            .remove();
    } else {
        panel.addClass("hidden");
        if (!panel.parents().find("." + cl).length) {
            var img = `<img class="${ cl } img-responsive" src="img/invisible.png" style="max-width:30%">`;
            $("#vector-legend-" + layer.id)
                .parent()
                .append(img);
        }
    }
}

export const getLegendurl = function (layer, scale, resolution) {
    let legendUrl = "";
    if (layer.legendurl && !layer.styles) {
        legendUrl = layer.legendurl;
    } else if (layer.legendurl && layer.styles && layer.styles.split(",").length === 1) {
        legendUrl = layer.legendurl;
    } else if (layer.type !== "vector-tms") {
        legendUrl = getLegendGraphicUrl(layer.url, _getLegendParams(layer));
    }
    if (layer.dynamiclegend) {
        if (!scale) {
            scale = calculateScale(resolution);
        }
        // TODO: this line of code is not robust since OGC parameter names are not case sensitive
        legendUrl = legendUrl.split("&scale=")[0] += "&scale=" + scale;
    }
    return legendUrl;
};

export const setLayerLegend = (layer, scale, resolution) => {
    if (layer.dynamiclegend) {
        let legendUrl = getLegendurl(layer, scale, resolution);
        $("#legend-" + layer.id).attr("src", legendUrl);
    }
}

export const updateLegendsScaleDependancy = (layers = [], scale, resolution) => {
    layers.forEach(layer => setLayerLegend(layer, scale, resolution));
}

export const getLegendGraphicUrl = (serviceUri, params) => {
    if (serviceUri === undefined) {
        return undefined;
    }

    // transform to uppercase param keys
    let uppercaseParams = {};
    for (let key in params) {
        let upperKey = key.toUpperCase();
        uppercaseParams[upperKey] = params[key];
    }

    const defaultParams = {
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetLegendGraphic",
        SLD_VERSION: "1.1.0",
        FORMAT: encodeURIComponent("image/png"),
        WIDTH: "30",
        HEIGHT: "20",
        LEGEND_OPTIONS: encodeURIComponent(
            "fontName:Open Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10;dpi:96"
        ),
        TRANSPARENT: true,
    };

    if (params !== undefined) {
        Object.assign(defaultParams, uppercaseParams);
    }

    return appendParams(serviceUri, defaultParams);
}