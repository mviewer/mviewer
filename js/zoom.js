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
            class="btn btn-default btn-raised" tabindex="104" accesskey="4" >
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
        </button>`;

  /**
   * Button to zoom -
   * @private
   */
  const buttonOut = `<button href="#"
            onclick="mviewer.tools.zoom.changeZoom(-1)"
            title="Zoom arrière"
            i18n="tbar.right.zoom.out"
            class="btn btn-default btn-raised"
            tabindex="106" accesskey="6">
            <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
        </button>`;

  /**
   * Button zoom to initial extent
   * @private
   */
  const buttonZoomToInitialExtent = `<button href="#" onclick="mviewer.zoomToInitialExtent();"
            title="Revenir à l'étendue géographique de départ" i18n="tbar.right.zoom.initial" class="btn btn-default btn-raised" tabindex="105" accesskey="5">
            <span class="glyphicon glyphicon-home" aria-hidden="true"></span>
        </button>`;

  /**
   * Button zoom toolbar
   * @private
   */
  const zoomToolbar = `
        <div id="zoomtoolbar" class="btn-group-vertical btn-group-sm" role="group" aria-label="true">
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
