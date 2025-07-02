/**
 * @module streetview
 * @description
 * This module provides a custom component for mviewer that allows users to open Google Street View
 * at a clicked location on the map. It handles the map click event, formats the coordinates,
 * and redirects the user to the Google Street View URL with the selected coordinates.
 *
 */

var streetview = (function () {
  var _map;

  var _url;

  var _projection;

  var _streetViewBtn;

  var _config;

  var _typeCoordinates;

  var _lastCoordinates = null;

  /**
   * Initialize the street view component
   */
  var _initStreetView = () => {
    _streetViewBtn = document.getElementById("streetViewBtn");

    _config = mviewer.customComponents.streetview.config.options.mviewer.streetview;
    _typeCoordinates = _config.coordinates.type;
    _url = _config.url;

    _map = mviewer.getMap();
    _projection = _map.getView().getProjection();

    _map.on("singleclick", function (evt) {
      _handleMapClick(evt, _projection, _typeCoordinates);
    });

    _streetViewBtn.addEventListener("click", function () {
      if (_lastCoordinates) {
        _redirectToStreetView(_lastCoordinates);
        _streetViewBtn.disabled = true;
        // Disable the button for 5 seconds to prevent multiple clicks
        setTimeout(() => {
          _streetViewBtn.disabled = false;
        }, 5000);
      } else {
        mviewer.toast("StreetView", "Cliquez sur la carte", 6000);
      }
    });
  };

  /**
   * Redirect to Google Street View with the coordinates
   * @param {string} coordinates - The coordinates to redirect to
   *
   */
  var _redirectToStreetView = (coordinates) => {
    let parts = coordinates.split(",").map((part) => part.trim());

    let url = `${_url}${parts[1]},${parts[0]}`;

    window.open(url, "_blank");
  };

  /**
   * Format the coordinates to a string
   * @param {Array} coordinates - The coordinates to format
   * @param {string} type - The type of coordinates to format
   * @returns {string} - The formatted coordinates
   *
   */
  var _formatCoordinatesText = (coordinates, type) => {
    const formatCoordinates = type === "xy" ? ol.coordinate.toStringXY : null;
    const coordinatePrecision = type === "xy" ? 5 : 0; // 5 decimal

    let hxy = formatCoordinates(coordinates, coordinatePrecision);
    hxy = type === "xy" ? hxy : null;

    return hxy;
  };

  /**
   * Handle the map click event
   * @param {ol.MapBrowserEvent} evt - The map click event
   * @param {ol.proj.Projection} projection - The map projection
   * @param {string} typeCoordinates - The type of coordinates
   */
  var _handleMapClick = (evt, projection, typeCoordinates) => {
    let _coordinates = ol.proj.transform(
      evt.coordinate,
      projection.getCode(),
      "EPSG:4326"
    );
    let formattedCoordinates = _formatCoordinatesText(_coordinates, typeCoordinates);

    _lastCoordinates = formattedCoordinates;

    mviewer.toast("StreetView", "<b>Coordonnées sauvegardées.</b> </br> Cliquez de nouveau sur le bouton pour ouvrir StreetView dans un nouvel onglet.",6000);
  };

  return {
    init: _initStreetView,
  };
})();

new CustomComponent("streetview", streetview.init);
