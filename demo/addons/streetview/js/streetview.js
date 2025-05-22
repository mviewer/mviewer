var streetview = (function () {

    var _map;

    var _url;

    var _projection;

    var _streetViewBtn;

    var _config;

    var _typeCoordinates;

    var _lastCoordinates = null;

    var _initStreetView = () => {
        _streetViewBtn = document.getElementById("streetViewBtn");

        _config = mviewer.customComponents.streetview.config.options.mviewer.streetview;
        _typeCoordinates = _config.coordinates.type;
        _url = _config.url;

        _map = mviewer.getMap();
        _projection = mviewer.getProjection();

        _map.on("singleclick", function (evt) {
            _handleMapClick(evt, _projection, _typeCoordinates);
        });

        _streetViewBtn.addEventListener("click", function () {
            if (_lastCoordinates) {
                _redirectToStreetView(_lastCoordinates);

                _streetViewBtn.disabled = true;
                setTimeout(() => {
                    _streetViewBtn.disabled = false;
                }, 5000);
            } else {
                $("#coordinates span").text("Veuillez d'abord cliquer sur la carte ✗");
            }
        });
    };

    var _redirectToStreetView = (coordinates) => {
        let parts = coordinates.split(",").map((part) => part.trim());

        let url = `${_url}${parts[1]},${parts[0]}`;

        window.open(url, "_blank");
    };

    var _formatCoordinatesText = (coordinates, type) => {
        const formatCoordinates =
            type === "dms"
            ? ol.coordinate.toStringHDMS
            : ol.coordinate.toStringXY;
        const coordinatePrecision = type === "dms" ? 0 : 5; // 5 decimal

        let hdms = formatCoordinates(coordinates, coordinatePrecision);
            hdms =
            type === "xy" ? hdms : hdms.replace(/ /g, "").replace("N", "N - ");

        return hdms;
    };

    var _handleMapClick = (evt, projection, typeCoordinates) => {
        let _coordinates = ol.proj.transform(evt.coordinate, projection.getCode(), "EPSG:4326");
        let formattedCoordinates = _formatCoordinatesText(_coordinates, typeCoordinates);

        _lastCoordinates = formattedCoordinates;

        console.log(formattedCoordinates);

        $("#coordinates span").text("Coordonnées sauvegardées ✓");
    };

    return {
        init: _initStreetView,
    };
})();

new CustomComponent("streetview", streetview.init);