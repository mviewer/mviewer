import { setVectorLegendStatus, setUrlLegendStatus, getLegendurl } from "./legends";

export const showLayer = (layerControler, layerOptions) => {
    layerControler.checked = true;
    layerControler.visiblebydefault = true;
    var li = $(".mv-nav-item[data-layerid='" + layerControler.layerid + "']");
    if (layerOptions.style && layerControler.type === "wms") {
        layerControler.layer.getSource().getParams()["STYLES"] = layerOptions.style;
        layerControler.style = layerOptions.style;
        layerControler.legendurl = getLegendurl(layerControler);
    }
    if (layerOptions.filter && layerControler.type === "wms") {
        layerControler.layer.getSource().getParams()["CQL_FILTER"] = layerOptions.filter;
        layerControler.filter = layerOptions.filter;
    }
    mviewer.toggleLayer(li);
    if (layerOptions.time && layerControler.type === "wms") {
        //layerControler.layer.getSource().getParams()['TIME'] = layerOptions.time;
        var timeControl = $("#" + layerControler.layerid + "-layer-timefilter");
        if (timeControl.hasClass("mv-slider-timer")) {
            timeControl.slider(
                "setValue",
                layerControler.timevalues.indexOf(layerOptions.time),
                true,
                true
            );
        }
    }
};

export const hideLayer = function (layerControler) {
    layerControler.checked = false;
    if (layerControler.layer && layerControler.showintoc) {
        layerControler.layer.setVisible(false);
    }
    layerControler.visiblebydefault = false;
};

export const toggleLayer = (el) => {
    const li = el.closest("li");
    const input = li.querySelector("input");
    if (input.value === "false") {
        mviewer.addLayer(mviewer.overLayers[$(li).data("layerid")]);
    } else {
        var el = $(".mv-layer-details[data-layerid='" + li.data("layerid") + "']");
        mviewer.removeLayer(el);
    }
}

export const setLayerScaleStatus = function (layer = [], scale) {
    if (layer.scale) {
        var isVector = layer.vectorlegend;
        var isVisible = scale >= layer.scale.min && scale <= layer.scale.max;
        if (isVector) {
            return setVectorLegendStatus(layer, isVisible);
        }
        setUrlLegendStatus(layer, isVisible);
    }
}

export const updateLayersScaleDependancy = (layers, scale) => {
    layers.forEach((layer) => setLayerScaleStatus(layer, scale));
}

export const _overwiteThemeProperties = function (layersWithOptions) {
    $.each(_themes, function (i, theme) {
        $.each(theme.layers, function (j, l) {
            if (layersWithOptions[l.layerid]) {
                var options = layersWithOptions[l.layerid];
                showLayer(l, options);
            } else {
                hideLayer(l);
            }
        });
        $.each(theme.groups, function (g, group) {
            $.each(group.layers, function (i, l) {
                if (layersWithOptions[l.layerid]) {
                    var options = layersWithOptions[l.layerid];
                    showLayer(l, options);
                } else {
                    hideLayer(l);
                }
            });
        });
    });
};


export const processLayer = function (oLayer, l) {
    oLayer.layer = l;
    l.setVisible(oLayer.checked);
    l.setOpacity(oLayer.opacity);
    if (oLayer.scale && oLayer.scale.max) {
        l.setMaxResolution(_convertScale2Resolution(oLayer.scale.max));
    }
    if (oLayer.scale && oLayer.scale.min) {
        l.setMinResolution(_convertScale2Resolution(oLayer.scale.min));
    }
    l.set("name", oLayer.name);
    l.set("mviewerid", oLayer.id);
    l.set("infohighlight", oLayer.infohighlight);

    if (oLayer.searchable) {
        search.processSearchableLayer(oLayer);
    }
    if (oLayer.scale) {
        _scaledDependantLayers.push(oLayer);
    }
    if (oLayer.dynamiclegend) {
        _scaledDependantLayersLegend.push(oLayer);
    }
    mviewer.overLayers[oLayer.id] = oLayer;

    if (oLayer.metadatacsw && oLayer.metadatacsw.search("http") >= 0) {
        $.ajax({
            dataType: "xml",
            layer: oLayer.id,
            url: _ajaxURL(oLayer.metadatacsw),
            success: function (result) {
                var summary = "";
                if ($(result).find("dct\\:abstract, abstract").length > 0) {
                    summary = "<p>" + $(result).find("dct\\:abstract, abstract").text() + "</p>";
                } else {
                    summary =
                        "<p>" +
                        $(result)
                            .find("gmd\\:identificationInfo, identificationInfo")
                            .find("gmd\\:MD_DataIdentification,  MD_DataIdentification")
                            .find("gmd\\:abstract, abstract")
                            .find("gco\\:CharacterString, CharacterString")
                            .text() +
                        "</p>";
                }
                if (mviewer.overLayers[this.layer].metadata) {
                    summary +=
                        '<a href="' +
                        mviewer.overLayers[this.layer].metadata +
                        '" i18n="legend.moreinfo" target="_blank">En savoir plus</a>';
                }
                mviewer.overLayers[this.layer].summary = summary;

                var modifiedDate =
                    $(result).find("dct\\:modified, modified").text() ||
                    $(result).find("dct\\:created, created").text();
                mviewer.overLayers[this.layer].modifiedDate = modifiedDate;

                //use source from metadata as attribution if conf is set to "metadata"
                if (mviewer.overLayers[this.layer].attribution === "metadata") {
                    var source = $(result).find("dc\\:source, source").text();
                    mviewer.overLayers[this.layer].attribution = `Source : ${ source }`;
                    $(`#${ this.layer }-attribution`).text(`Source : ${ source }`);
                }

                //update visible layers on the map
                $(`#${ this.layer }-layer-summary`).attr("data-content", summary);
                $(`#${ this.layer }-date`).text(modifiedDate);
            },
        });
    }
    _map.addLayer(l);
    if (oLayer.type === "customlayer" && mviewer.customLayers[oLayer.id]) {
        mviewer.customLayers[oLayer.id].config = oLayer;
    }
    _events.overLayersLoaded += 1;
};