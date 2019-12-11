var measure = (function () {

    /**
     * Property: _map
     *  @type {ol.Map}
     */

    var _map;

    /**
     * Property: _projection
     *  @type {ol.proj.Projection}
     */

    var _projection;
    /**
     * Property: _wgs84Sphere
     * @type {ol.sphere} Sphere used to calculate area an length measures
     */

    var _wgs84Sphere = ol.sphere;

    /**
     * The help measure tooltip message.
     * @type {Element}
     */

    var _helpMeasureTooltipMessage;

    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     */

    var _helpMeasureTooltip;

    /**
     * The measure result tooltip element.
     * @type {Element}
     */

    var _measureTooltipResult;

    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */

    var _measureTooltip;

    /**
     * measure tool enabled.
     * @type {boolean}
     */

    var _modMeasureEnabled = false;

    /**
     * Style used by draw.
     * @type {ol.style.Style}
     */

    var _drawStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#2fc2c3',
            lineDash: [10, 10],
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#2fc2c3',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            })
        })
    });

    /**
     * Style used by measure.
     * @type {ol.style.Style}
     */

    var _measureStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(47, 194, 195, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#2fc2c3',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#2fc2c3'
            })
        })
    });

    /**
     * _sketch - Currently drawn feature.
     * @type {ol.Feature}
     */

    var _sketch;

    /**
     * _draw - Openlayers draw interaction used by measure tools.
     * @type {ol.interaction.Draw}
     */

    var _draw;

    /**
     * _sourceMesure - Openlayers vector source used to store measure draws.
     * @type {ol.source.Vector}
     */

    var _sourceMesure;

    /**
     * Handle pointer move used by measure tools.
     * @param {ol.MapBrowserEvent} evt
     */

    var _pointerMoveHandler = function(evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Cliquer pour débuter la mesure';
        if (_sketch) {
            var geom = (_sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = 'Cliquer pour poursuivre le polygone';
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = 'Cliquer pour poursuivre la ligne';
            }
        }
        _helpMeasureTooltipMessage.innerHTML = helpMsg;
        _helpMeasureTooltip.setPosition(evt.coordinate);
        $(_helpMeasureTooltipMessage).removeClass('hidden');
    };

    /**
     * measure format length output
     * @param {ol.geom.LineString} line
     * @return {string}
     */

    var _measureFormatLength = function(line) {
        var length = 0;
        var coordinates = line.getCoordinates();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], _projection, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], _projection, 'EPSG:4326');
            length += _wgs84Sphere.getDistance(c1, c2);
        }
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) + ' ' + 'm';
        }
        return output;
    };

    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */

    var _measureFormatArea = function(polygon) {
        var area = Math.abs(_wgs84Sphere.getArea(polygon));
        var output;
        if (area < 0.0001) {
            output = 0;
        } else if (area < 10000) {
            output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
        } else if (area < 1000000) {
            output = (Math.round(area / 10000 * 100) / 100) + ' ' + 'ha';
        } else if (area >= 1000000) {
            output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
        }

        return output;
    };

    /**
     * Creates a new help tooltip
     */

    _createHelpTooltip = function () {
        if (_helpMeasureTooltipMessage) {
            _helpMeasureTooltipMessage.parentNode.removeChild(_helpMeasureTooltipMessage);
        }
        _helpMeasureTooltipMessage = document.createElement('div');
        _helpMeasureTooltipMessage.className = 'tooltip hidden';
        _helpMeasureTooltip = new ol.Overlay({
            element: _helpMeasureTooltipMessage,
            offset: [15, 0],
            positioning: 'center-left'
        });
        _map.addOverlay(_helpMeasureTooltip);
    };

    /**
     * Creates a new measure tooltip
     */

    var _createMeasureTooltip = function () {
        if (_measureTooltipResult) {
            _measureTooltipResult.parentNode.removeChild(_measureTooltipResult);
        }
        _measureTooltipResult = document.createElement('div');
        _measureTooltipResult.className = 'tooltip2 tooltip-measure';
        _measureTooltip = new ol.Overlay({
            element: _measureTooltipResult,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        _map.addOverlay(_measureTooltip);
    };

    /**
     * Private Method: _clearMeasureTool
     *
     */

    var _clearMeasureTool = function () {
        $('#measurelinebtn').removeClass('active');
        $("#measurebtn").removeClass("active");
        $('#measureareabtn').removeClass('active');
        $("#drawtoolsoptions").hide();
    };

    /**
     * Private Method: _clearOldMeasures
     *
     */

    var _clearOldMeasures = function () {
        _sourceMesure.clear();
        $(".tooltip-measure-static").remove();
    };

    /* PUBLIC */

    /**
     * Public method_addMeasureInteraction. used to enable the measure tool
     * @param @type {ol.geom.GeometryType} LineString || Polygon
     * exported as enable
     */

    var _addMeasureInteraction = function (type) {
        $("#drawtoolsoptions").show();
        $("#measurebtn").addClass("active");
        if (type === 'LineString') {
             $('#measurelinebtn').addClass("active");
        } else if (type === 'Polygon') {
            $('#measureareabtn').addClass("active");
        }

        _map.on('pointermove', _pointerMoveHandler);
        $(_map.getViewport()).on('mouseout', function() {
            $(_helpMeasureTooltipMessage).addClass('hidden');
        });
        _draw = new ol.interaction.Draw({
            source: _sourceMesure,
            type: (type),
            style: _drawStyle
        });
        _map.addInteraction(_draw);
        _createMeasureTooltip();
        _createHelpTooltip();
        var listener;

        _draw.on('drawstart', function(evt) {
            _clearOldMeasures();
            // set sketch
            _sketch = evt.feature;
            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;
            listener = _sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = _measureFormatArea(/** @type {ol.geom.Polygon} */ (geom));
                    var coords = geom.getCoordinates()[0];
                    var nbCoords = coords.length;
                    if (nbCoords < 2) {
                        tooltipCoord = coords[0];
                    } else {
                        tooltipCoord = coords[nbCoords-2];
                    }
                } else if (geom instanceof ol.geom.LineString) {
                    output = _measureFormatLength( /** @type {ol.geom.LineString} */ (geom));
                    tooltipCoord = geom.getLastCoordinate();
                }
                _measureTooltipResult.innerHTML = output;
                _measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

        _draw.on('drawend', function(evt) {
            _measureTooltipResult.className = 'tooltip2 tooltip-measure-static';
            _measureTooltip.setOffset([0, -7]);
            _sketch = null;
            _measureTooltipResult = null;
            _createMeasureTooltip();
            ol.Observable.unByKey(listener);
        }, this);

        _modMeasureEnabled = true;
    };

    /**
     * Public Method: _resetDrawTool exported as disable
     */

    var _resetDrawTool = function () {
       _clearOldMeasures();
       _map.removeOverlay(_helpMeasureTooltip);
       _map.removeOverlay(_measureTooltip);
       _map.un('pointermove', _pointerMoveHandler);
       _map.removeInteraction(_draw);
       _modMeasureEnabled = false;
       _clearMeasureTool();
    };

    /**
     * _toggle. used to enable/disable this tool
     * public version of this method is toggle
     */

    var _toggle = function () {
        if (_modMeasureEnabled) {
            mviewer.unsetTool('measure');
        } else {
            mviewer.setTool('measure', 'LineString');
        }
    };

    /**
     * public Method: _state exported as enabled
     */

    var _state = function () {
        return _modMeasureEnabled;
    }

    /**
     * Public Method: _initMeasureTool exported as init
     * @param {ol.Map}
     */

    var _initMeasureTool = function () {
        _map = mviewer.getMap();
        _projection = mviewer.getProjection().getCode();
        _sourceMesure = new ol.source.Vector();
        var vector = new ol.layer.Vector({
           source: _sourceMesure,
           style: _measureStyle
        });

        //Add html elements to the DOM
        var button = [
            '<button class="mv-modetools btn btn-default btn-raised" href="#"',
                ' onclick="mviewer.tools.measure.toggle();" id="measurebtn" title="Mesurer" i18n="measure.button.main"',
                ' tabindex="108" accesskey="8">',
                        '<span class="glyphicon glyphicon-resize-horizontal" aria-hidden="true"></span>',
                '</button>'].join("");
        var buttonoptions = [
            '<div id="drawtoolsoptions" style="display:none;" class="btn-group btn-group-sm"',
                ' role="group" aria-label="true">',
                '<button  id="measurelinebtn" title="Mesure linéaire" i18n="measure.button.line"',
                    ' onclick="mviewer.setTool(\'measure\', \'LineString\');" class="btn btn-default button-tools" >',
                    '<span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span>',
                '</button>',
                '<button  id="measureareabtn" title="Mesure surfacique" i18n="measure.button.surface" onclick="mviewer.setTool(\'measure\', \'Polygon\');"',
                    ' class="btn btn-default button-tools">',
                    '<span class="glyphicon glyphicon-adjust" aria-hidden="true"></span>',
                '</button>',
            '</div>'].join("");
        $("#toolstoolbar").prepend(button);
        $(buttonoptions).insertAfter("#toolstoolbar");

        _map.addLayer(vector);
    };

    return {
        init: _initMeasureTool,
        enable: _addMeasureInteraction,
        toggle: _toggle,
        disable: _resetDrawTool,
        enabled : _state
    };

})();