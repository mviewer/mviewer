
export const getActiveBaseLayer = function (baseLayers) {
    var result = null;
    for (var i = 0; i < baseLayers.length; i += 1) {
        var l = baseLayers[i];
        if (l.getVisible()) {
            result = l.get("blid");
            break;
        }
    }
    return result;
}

export const bgtoogle = () => {
    $("#backgroundlayerstoolbar-gallery .no-active").toggle();
};