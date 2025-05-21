var streetview = (function () {

    var _initStreetView = () => {
        console.log("Street View initialized");
    };

    return {
        init: _initStreetView,
    };
})();

new CustomComponent("streetview", streetview.init);