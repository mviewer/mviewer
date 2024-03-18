export const getDefaultBaseLayer = ({ baselayer }) => {
    let defaultBaseLayer = baselayer.filter(base => base.visible === "true");
    let defaultBaseLayerId = "";
    if (defaultBaseLayer[0]) {
        defaultBaseLayerId = defaultBaseLayer[0]?.id
    };
    return defaultBaseLayerId;
}

export const createBaseLayers = (baseLayers) => {
    baseLayers.forEach(base => {
        mviewer.createBaseLayer(base);
    });
}

export const initDefaultBaseLayer = (baselayers) => {
    const baselayerControlStyle = baselayers.style;
    const isGallery = baselayerControlStyle === "gallery";
    const defaultBaseLayer = getDefaultBaseLayer(baselayers);
    if (isGallery) {
        document.getElementById("backgroundlayerstoolbar-default")?.remove?.();
        baselayers.baselayer.forEach(base => $("#basemapslist").append(
            Mustache.render(mviewer.templates.backgroundLayerControlGallery, base)
        ));
        $("#basemapslist li").tooltip({
            placement: "left",
            trigger: "hover",
            html: true,
            container: "body",
            template: mviewer.templates.tooltip,
        });
    } else {
        document.getElementById("backgroundlayerstoolbar-gallery")?.remove?.();
    }

    return defaultBaseLayer;
}