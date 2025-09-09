var zoom = (function () {
  /**
   * Property: _map
   *  @type {ol.Map}
   */

  let _map;
  /**
   * Convert string to HTML DOM node element reusable
   * @private
   * @param {string} is html string element
   */
  var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body.firstChild;
  };

  /**
   * Public Method: zoomIn
   * @public
   */
  let changeZoom = (toValue) =>
    _map.getView().animate({
      zoom: _map.getView().getZoom() + toValue,
    });
  const buttonIn = `<button 
            href="#"
            onclick="mviewer.tools.zoom.changeZoom(1)"
            i18n="tbar.right.zoom.in"
            title="Zoom avant (zoom fenêtre : shift + clic sur la carte)"
            type="button" class="btn btn-light" tabindex="0" accesskey="1" >
            <i class="ri-zoom-in-line"></i>
        </button>`;

  /**
   * Button to zoom -
   * @private
   */
  const buttonOut = `<button href="#"
            onclick="mviewer.tools.zoom.changeZoom(-1)"
            title="Zoom arrière"
            i18n="tbar.right.zoom.out"
            type="button" class="btn btn-light"
            tabindex="0" accesskey="6">
            <i class="ri-zoom-out-line"></i>
        </button>`;

  /**
   * Button zoom to initial extent
   * @private
   */
  const buttonZoomToInitialExtent = `<button href="#" onclick="mviewer.zoomToInitialExtent();"
            title="Revenir à l'étendue géographique de départ" i18n="tbar.right.zoom.initial" type="button" class="btn btn-light" tabindex="0" accesskey="5">
            <i class="ri-road-map-line"></i>
        </button>`;

  /**
   * Button zoom toolbar
   * @private
   */
  const zoomToolbar = `
        <div id="zoomtoolbar" class="btn-group-vertical" role="group" aria-label="true">
        </div>
    `;

  /**
   * Init zoom buttons
   * @public
   */
  const initZoomBtn = () => {
    // add buttons to DOM
    document.getElementById("zoomtoolbar").prepend(stringToHTML(buttonIn));
    document.getElementById("zoomtoolbar").append(stringToHTML(buttonOut));
  };

  /**
   * Init zoom toolbar
   * @public
   */
  const initTbar = () => {
    _map = mviewer.getMap();
    document.getElementById("mviewerinfosbar").after(stringToHTML(zoomToolbar));
  };

  /**
   * Init zoom to initial extent button
   * @public
   */
  const initZoomToInitExtent = () => {
    document
      .getElementById("zoomtoolbar")
      .firstChild.after(stringToHTML(buttonZoomToInitialExtent));
  };
  return {
    init: initTbar,
    initExtentBtn: initZoomToInitExtent,
    initZoomBtn: initZoomBtn,
    changeZoom: changeZoom,
  };
})();
