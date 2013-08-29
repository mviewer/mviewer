mviewer = (function () {
    /*
     * Private
     */
    var Ol = OpenLayers;
    Ol.Popup.Anchored.prototype.calculateRelativePosition = function () {
        return 'tr';
    };
    Proj4js.defs["EPSG:3857"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
    Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    /**
     * Property: _options
     * XML. The application configuration
     */

    var _options = null;

    /**
     * Property: _map
     * {OpenLayers.Map} The map
     */
    var _map = null;

    /**
     * Property: _mapOptions
     * {Object}  hash of map options
     */

    var _mapOptions = null;

    /**
     * Property: _extent
     * {OpenLayers.Bounds} The initial extent of the map
     */

    var _extent = null;

    /**
     * Property: baseLayers
     * Array -  of  OpenLayers.Layer
     */

    var baseLayers = [];

    /**
     * Property: _allOverLayers
     * {object} hash of all overlay Layers (static)
     */

    var _allOverLayers = {};

    /**
     * Property: _queryableLayers
     * Array of {OpenLayers.Layers.WMS} .
     */

    var _queryableLayers = [];

    /**
     * Property: _allLayersGroups
     * {object} hash of all overlay Layers (for each sub theme) - static.
     */

    var _allLayersGroups = null;

    /**
     * Property: _layersGroup
     * {object} hash of overlay Layers displayed in legend panel (active map)
     */
    var _layersGroup = {};

    /**
     * Property: _getFeatureInfo
     * {OpenLayers.Control.WMSGetFeatureInfo}
     */

    var _getFeatureInfo = null;

    /**
     * Property: _popup
     * {OpenLayers.Popup.Anchored}
     */

    var _popup = null;

    /**
     * Property: _olsCompletionUrl
     * String. The OpenLs url used by the geocode control
     */
    var _olsCompletionUrl = null;

    /**
     * Property: renderer
     * {OpenLayers.Renderer}
     */

    var renderer = Ol.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : Ol.Layer.Vector.prototype.renderers;

    /**
     * Property: sketchSymbolizers
     * {OpenLayers.Symbolizer} . For styles used by measure controls
     */
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 6,
            graphicName: "circle",
            fillColor: "#25a0da",
            fillOpacity: 1,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#25a0da"
        },
        "Line": {
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColor: "#25a0da",
            strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#25a0da",
            fillColor: "yellow",
            fillOpacity: 0.3
        }
    };

    var style = new Ol.Style();
    style.addRules([
        new Ol.Rule({
            symbolizer: sketchSymbolizers
        })
    ]);

    var styleMap = new Ol.StyleMap({
        "default": style
    });

    var measureControls = {
        line: new Ol.Control.Measure(
            Ol.Handler.Path, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        ),
        polygon: new Ol.Control.Measure(
            Ol.Handler.Polygon, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        )
    };

    /**
     * Private Method: createGetFeatureInfoControl
     *
     */
    var createGetFeatureInfoControl = function () {
        var maxheight = $(_options).find("popupoptions").attr("max-height");
        var maxrecords = $(_options).find("popupoptions").attr("max-records");
        var title = $(_options).find("popupoptions").attr("title");
        if (_getFeatureInfo) {
            _getFeatureInfo.destroy();
        }
        _getFeatureInfo = new Ol.Control.WMSGetFeatureInfo({
            title: 'Interroger la carte par clic',
            queryVisible: true,
            drillDown: true,
            infoFormat: 'application/vnd.ogc.gml',
            hover: false,
            handlerOptions: {
                "hover": {
                    delay: 500
                }
            },
            maxFeatures: parseInt(maxrecords),
            layers: _queryableLayers,
            vendorParams: {},
            eventListeners: {
                //"beforegetfeatureinfo": function(e) {e.object.vendorParams.propertyName = _todo();},
                "getfeatureinfo": function (e) {
                    if (e.features.length > 0) {
                        var content = createContentHtml(e.features, title, maxheight);
                        showPopup(_map.getLonLatFromPixel(e.xy), content, e.features.length);
                    }
                }
            }
        });
        _map.addControl(_getFeatureInfo);
        if ($('#infobtn').attr('data-theme') === "b") {
            _getFeatureInfo.activate();
        }
    };

    /**
     * Private Method: createContentHtml
     *
     * Parameter features
     * Parameter title
     * Parameter maxheight
     *
     * returns html content to display in popup
     */

    var createContentHtml = function (features, title, maxheight) {
        var html = '';
        html += '<div id="popuptitle" class="popover-title"><strong>' + title + '</strong><button type="button" id="popupclose" onclick="map.mviewer.closePopup(event);" class="close">&times;</button></div>';
        if (maxheight) {
            html += '<div id="popupgroup" style="max-height:' + maxheight + ';">' + "\n";
        } else {
            html += '<div id="popupgroup" >' + "\n";
        }
        var fcount = 1;
        features.forEach(function (feature) {
            var nbimg = 0;
            var olayer = _allOverLayers[feature.gml.featureNSPrefix + ":" + feature.gml.featureType];
            html += '<div class="popupitem">';
            var featuretype = feature.gml.featureType;
            var attributes = feature.attributes;
            var fields = (olayer.fields) ? olayer.fields : $.map(attributes, function (value, key) {
                return key;
            });
            var aliases = (olayer.fields) ? olayer.aliases : false;
            fields.forEach(function (f) {
                if (attributes[f]) { // si valeur != null
                    if (attributes[f].indexOf("http://") >= 0) {
                        if (attributes[f].indexOf(".jpg") >= 0) {
                            /*html += '<p class="center"><img onload="map.mviewer.updatePopupSize()" src="' + attributes[f] + '" height="100px"</img></p>';
                            nbimg += 1;*/                           
                            html += '<a onclick="map.mviewer.popupPhoto(\'' +  attributes[f] + '\')" href="#imagepopup" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + attributes[f] + '" alt="image..." style="height:100px;"></a>';
                                
                        } else {
                            html += '<p><a href="' + attributes[f] + '" target="_blank">' + getAlias(f, aliases, fields) + '</a></p>';
                        }
                    } else {
                        html += '<p> ' + getAlias(f, aliases, fields) + ' : ' + attributes[f] + '</p>';
                    }
                }
            });
            html += '</div>' + "\n";
            fcount += 1;
        });
        html += "</div>";
        return html;
    };

    /**
     * Private Method: getAlias
     *
     * Parameter value
     * Parameter aliases
     * Parameter fields
     *
     * returns alias for a field
     */

    var getAlias = function (value, aliases, fields) {
        var alias = "";
        if (aliases) {
            alias = aliases[$.inArray(value, fields)];
        } else {
            alias = value.substring(0, 1).toUpperCase() + value.substring(1, 50).toLowerCase();
        }
        return alias;
    };

    /**
     * Private Method: showPopup
     *
     * Parameter pt
     * Parameter message
     * Parameter pages
     *
     */

    var showPopup = function (pt, message, pages) {
        _map.popups.forEach(function (p) {
            p.destroy();
        });
        AutoSizeAnchored = Ol.Class(Ol.Popup.Anchored, {
            'autoSize': true,
            'panMapIfOutOfView': true
        });
        _popup = new AutoSizeAnchored("popup", pt, new Ol.Size(300, 150), message, null, false);
        _map.addPopup(_popup);
        var w = $("#popup").css('width');
        $("#popup").css({
            'margin-left': (-parseInt(w) / 2)
        });
        $("#popupgroup").jScrollPane();
    };

    /**
     * Private Method: _deactivateTools
     *
     */

    var _deactivateTools = function () {
        for (key in measureControls) {
            var control = measureControls[key];
            control.deactivate();
        }
        if (_getFeatureInfo) {
            _getFeatureInfo.deactivate();
        }
    };

    /**
     * Private Method: _clearTools
     *
     */

    var _clearTools = function () {
        $("#measurelinebar").hide();
        $("#measureareabar").hide();
        // maxi hack jquery mobile !
        $('#infobtn').attr("data-theme", "a").removeClass("ui-btn-b ui-btn-up-b ui-btn-hover-b").addClass("ui-btn-a ui-btn-up-a").trigger("create");
        $('#measurelinebtn').attr("data-theme", "a").removeClass("ui-btn-b ui-btn-up-b ui-btn-hover-b").addClass("ui-btn-a ui-btn-up-a").trigger("create");
        $('#measureareabtn').attr("data-theme", "a").removeClass("ui-btn-b ui-btn-up-b ui-btn-hover-b").addClass("ui-btn-a ui-btn-up-a").trigger("create");
    };

    /**
     * Private Method: _setLineMeasure
     *
     */

    var _setLineMeasure = function () {
        measureControls.line.activate();
    };

    /**
     * Private Method: _setAreaMeasure
     *
     */

    var _setAreaMeasure = function () {
        measureControls.polygon.activate();
    };

    /**
     * Private Method: handleMeasurements
     *
     * Parameter event
     *
     */

    var handleMeasurements = function (event) {
        if (event.geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {

            _map.events.triggerEvent('mviewer.updateareameasure', event);
        } else {
            _map.events.triggerEvent('mviewer.updatelinemeasure', event);
        }
    };

    /**
     * Private Method: _initTools
     *
     */

    var _initTools = function () {
        $("#measurelinebar").css('top', $("#measurelinebtn").offset().top - 4);
        $("#measureareabar").css('top', $("#measureareabtn").offset().top - 4);
        _map.events.addEventType('mviewer.infotool');
        _map.events.register('mviewer.infotool', null, function () {
            _clearTools();
            $('#infobtn').attr("data-theme", "b").removeClass("ui-btn-a ui-btn-up-a ui-btn-hover-a").addClass("ui-btn-b ui-btn-up-b").trigger("create");
        });
        _map.events.addEventType('mviewer.measurelinetool');
        _map.events.register('mviewer.measurelinetool', null, function () {
            _clearTools();
            $('#measurelinebtn').attr("data-theme", "b").removeClass("ui-btn-a ui-btn-up-a ui-btn-hover-a").addClass("ui-btn-b ui-btn-up-b").trigger("create");
            $("#measurelinebar").show();
        });
        _map.events.addEventType('mviewer.measureareatool');
        _map.events.register('mviewer.measureareatool', null, function () {
            _clearTools();
            $('#measureareabtn').attr("data-theme", "b").removeClass("ui-btn-a ui-btn-up-a ui-btn-hover-a").addClass("ui-btn-b ui-btn-up-b").trigger("create");
            $("#measureareabar").show();
        });
        _map.events.addEventType('mviewer.updatelinemeasure');
        _map.events.register('mviewer.updatelinemeasure', null, function (data) {
            $("#distancebtn .ui-btn-text").text("Distance : " + data.measure.toFixed(1) + " " + data.units);
        });

        _map.events.addEventType('mviewer.updateareameasure');
        _map.events.register('mviewer.updateareameasure', null, function (data) {
            $("#areabtn .ui-btn-text").text("Surface : " + data.measure.toFixed(1) + " " + data.units + '²');
        });
    };

    /**
     * Private Method: _initShare
     *
     */

    var _initShare = function () {
        $(':input', '#emailform')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        var form = $("#emailform").validate();
        $("#emailformsubmit").click(function () {
            var res = form.form();
            if (res) {
                var formData = $("#emailform").serialize();
                $.postJSON(
                    '../ws/mail/mail.php?_dc=' + $.getTime(),
                    formData,
                    function (res, code) {
                        if (res.success) {
                            $("#msg").html('Message envoyé !');
                        } else {
                            $("#msg").html('Message non envoyé. Veuillez réessayer ultérieurement.');
                        }
                        // hack JQuery Mobile popup !
                        $("#lnkmsg").click();
                    }
                );
            }
        });
    };

    /**
     * Private Method: _initSearch
     *
     */

    var _initSearch = function () {
        $("#searchtool a").attr("title", "Effacer");
        $("#searchtool .ui-icon-delete").click(function () {
            $("#searchresults").html("").listview("refresh");
        });
        $(document).on("keyup", "#searchfield", function (e) {
            if (e.keyCode == 13) {
                var firstitem = $('#searchresults').find('li')[0];
                var firstlink = $(firstitem).find("a");
                $(firstlink).trigger('click');
                return;
            }
            if ($(this).val().length < 3) {
                $("#searchresults").html("").listview("refresh");
            } else {
                $.ajax({
                    type: "GET",
                    url: map.mviewer.getOlsCompletionUrl(),
                    crossDomain: true,
                    data: {
                        text: $(this).val(),
                        type: "StreetAddress,PositionOfInterest",
                        ter: "5"
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        var res = data.results;
                        var str = "";
                        for (var i = 0, len = res.length; i < len && i < 5; i++) {
                            str += '<li data-icon="false"><a hreaf="#" onclick="map.mviewer.zoomToLocation(' + res[i].x + ',' + res[i].y + ',' + res[i].classification + ',\'' + res[i].fulltext.replace("'", "*") + '\');">' + res[i].fulltext + '</a></li>';
                        }
                        $("#searchresults").html(str).listview("refresh");
                    }
                });
            }
        });
    };

    /**
     * Private Method: _initPanelsPopup
     *
     */

    var _initPanelsPopup = function () {
        // Mentions légales
        $.ajax({
            url: 'panels/mentionslegales.html',
            dataType: "text",
            success: function (html) {
                $("#mentionslegales").prepend(html);
                $('#mentionslegales').jScrollPane();
            }
        });
        //Crédits
        $.ajax({
            url: 'panels/credits.html',
            dataType: "text",
            success: function (html) {
                $("#credits").prepend(html);
                $('#credits').jScrollPane();
            }
        });
        //Conditions d'utilisation
        $.ajax({
            url: 'panels/usage.html',
            dataType: "text",
            success: function (html) {
                $("#usage").prepend(html);
                $('#usage').jScrollPane();
            }
        });
        //Formulaire de contact
        $.ajax({
            url: 'panels/contact.html',
            dataType: "text",
            success: function (html) {
                $("#contact").prepend(html);
                $("#contact").trigger("create");
                $(':input', '#contactform')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .removeAttr('checked')
                    .removeAttr('selected');
                var form = $("#contactform").validate();
                $("#contactformsubmit").click(function () {
                    var res = form.form();
                    if (res) {
                        var formData = $("#contactform").serialize();
                        $.postJSON(
                            '../ws/mail/mail.php?_dc=' + $.getTime(),
                            formData,
                            function (res, code) {
                                if (res.success) {
                                    $("#msg").html('Message envoyé !');
                                } else {
                                    $("#msg").html('Message non envoyé. Veuillez réessayer ultérieurement.');
                                }
                                // hack JQuery Mobile popup !
                                $("#lnkmsg").click();
                            }
                        );
                    }
                });
            }
        });
    };

    /**
     * Private Method: _initThemes
     *
     */

    var _initThemes = function () {
        var html = "";
        var themes = _options;
        $(themes).find("theme").each(function () {
            // boucles sur les themes
            if ($(this).attr("showtheme") === "true") {
                html += '<li data-role="list-divider" role="heading" >' + $(this).attr("name") + '</li>';
            }
            $(this).find("map").each(function () {
                //boucle sur les cartes
                html += ['<li id="' + $(this).attr("id") + '_btn">',
                    '<a href="#" data-mini="false" onclick="map.mviewer.loadMap(\'' + $(this).attr("id") + '\');">',
                    $(this).attr("name") + '</a></li>'
                ].join("");
            });
        });
        $("#themeaccordeon").html(html);
        $("#themeaccordeon").listview("refresh");       
    };

    /**
     * Private Method: _mapChange
     *
     *Parameter e - event
     */

    var _mapChange = function (e) {
        if ($("#sharepanel-popup").css("visibility") === "visible") {
            console.log('mapChange');
            _map.mviewer.setPermalink();
        }
    };

    /**
     * Private Method: _updateLayersGroup
     *
     *Parameter e - event
     */

    var _updateLayersGroup = function (e) {
        // Vérifie si la couche est à la bonne échelle
        var currentScale = _map.getScale();
        var layersToDisplay = [];
        $.each(_layersGroup, function (id, layer) {
            // Vérifie si la couche est visible à l'échalle courante
            layer.enable = (layer.scale.min < currentScale && currentScale <= layer.scale.max) ? true : false;
            layersToDisplay.push(layer);
        });
        var html = '';
        $.each(layersToDisplay.reverse(), function (id, layer) {

            html += ['<div data-role="collapsible"  ' + (layer.enable ? '' : 'class="ui-disabled"') + ' data-inset="true" data-theme="c" data-content-theme="a"  data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u">',
                '<h4>',
                '<table style="width:100%;"><tr>',
                '<td><img src="' + _map.mviewer.getLegendUrl(layer) + '" /></td>',
                '<td>' + layer.name + '</td>',
                '<td><form class="slid">',
                '<label for="flip-' + layer.id + '" class="ui-hidden-accessible">nolabel</label>',
                '<select onchange="map.mviewer.toggleOverLayer(this.name)" name="' + layer.id + '" ',
                'id="flip-' + layer.id + '" data-role="slider" data-mini="true" data-track-theme="c" data-theme="c" >',
                '<option value="off">non</option><option ' + (layer.checked ? 'selected="selected"' : '') + ' value="on">oui</option></select></form>',
                '</td>',
                '</tr></table>',
                '</h4>',
                '<input data-mini="true" type="range" name="' + layer.id + '" id="slider-' + layer.id + '" data-highlight="true" min="0" max="100" value="100" onchange="map.mviewer.changeLayerOpacity(this.name,this.value)">',
                '<p>' + layer.attribution + '<a href="' + layer.metadata + '" target="_blank" data-role="button" data-icon="home" data-iconpos="notext" data-theme="c" data-inline="true">Afficher les métadonnées dans une nouvelle page</a></p>',
                '</div>'
            ].join(" ");
        });
        $("#overlayers").html(html);
        $("#over").trigger("create");


        $.each(_layersGroup, function (id, layer) {
            // Ajoute ou retire la couche
            if (layer.checked && layer.enable) {
                layer.layer.setVisibility(true);
            } else if (_map.getLayersByName(layer.name).length > 0) {
                layer.layer.setVisibility(false);
            }
        });

    };

    /**
     * Private Method: _removeAllOverLayers
     *
     */

    var _removeAllOverLayers = function () {
        $.each(_layersGroup, function (id, layer) {
            if (_map.getLayersByName(layer.name).length > 0) {
                //_map.removeLayer(layer.layer);
                layer.layer.setVisibility(false);
            }
        });
    };

    /**
     * Method: _createBaseLayer
     * Create an {OpenLayers.Layer}.OSM|WMTS|WMS
     *
     * Parameters:
     * params - [ xml ] a baselayer node    present in config.xml.
     */

    var _createBaseLayer = function (params) {
        var l;
        switch (params.attr("type")) {
        case "WMS":
            l = new Ol.Layer.WMS(
                params.attr("label"),
                params.attr("url"), {
                    layers: params.attr("layers"),
                    format: params.attr("format"),
                    transparent: false
                }, {
                    attribution: params.attr("attribution"),
                    isBaseLayer: false,
                    transitionEffect: 'resize',
                    tileSize: new Ol.Size(256, 256),
                    visibility: false
                }
            );
            l.blid = params.attr("id");
            baseLayers.push(l);
            _map.addLayer(l);
            _map.setLayerIndex(l, baseLayers.length);
            break;
        case "WMTS":
            Ol.Request.GET({
                url: params.attr("url"),
                params: {
                    SERVICE: "WMTS",
                    VERSION: "1.0.0",
                    REQUEST: "GetCapabilities"
                },
                success: function (request) {
                    var format = new Ol.Format.WMTSCapabilities();
                    var doc = request.responseXML;
                    if (!doc || !doc.documentElement) {
                        doc = request.responseText;
                    }
                    var capabilities = format.read(doc);

                    // hack geowebcache geoserver 2.3
                    for (var i = 0; i < capabilities.contents.layers.length; i += 1) {
                        if (capabilities.contents.layers[i].styles.length === 0) {
                            capabilities.contents.layers[i].styles.push({
                                identifier: "_null",
                                isDefault: true
                            });
                        }

                    }
                    l = format.createLayer(capabilities, {
                        name: params.attr("label"),
                        layer: params.attr("layers"),
                        minResolution: parseFloat(params.attr("minresolution")),
                        matrixSet: params.attr("matrixset"),
                        style: params.attr("style"),
                        visibility: false,
                        format: params.attr("format"),
                        attribution: params.attr("attribution"),
                        opacity: 1,
                        maxScale: parseInt(params.attr("maxscale")),
                        //transitionEffect: 'resize',
                        isBaseLayer: false
                    });
                    //hack for geoportail proxy
                    l.setUrl(params.attr("url"));
                    l.blid = params.attr("id");
                    baseLayers.push(l);
                    _map.addLayer(l);
                    _map.setLayerIndex(l, baseLayers.length);
                }
            });
            break;
        case "OSM":
            l = new Ol.Layer.OSM(
                params.attr("label"),
                params.attr("url").split(","), {
                    attribution: "<br />Fond cartographique : <a href='http://www.openstreetmap.org/'>OpenStreetMap CC-by-SA</a>",
                    visibility: false,
                    transitionEffect: 'resize',
                    isBaseLayer: false
                }
            );
            l.blid = params.attr("id");
            //hack cross origin error with chrome
            l.tileOptions.crossOriginKeyword = null;
            baseLayers.push(l);
            _map.addLayer(l);
            _map.setLayerIndex(l, baseLayers.length);
            break;
        }
    };

    /**
     * Private Method: _getVisibleOverLayers
     *
     */

    var _getVisibleOverLayers = function () {
        var layers = [];
        $.each(_allOverLayers, function (i, item) {
            if (item.layer.getVisibility()) {
                layers.push(item.name);
            }
        });
        return layers.join(",");
    };

    /**
     * Private Method: _setVisibleOverLayers
     *
     */

    var _setVisibleOverLayers = function (lst) {
        var layers = decodeURIComponent(lst).split(",");
        for (var i = 0; i < layers.length; i++) {
            var l = _map.getLayersByName(layers[i]);
            if (l.length > 0) {
                l[0].setVisibility(true);
            }
        }
        _overwiteThemeProperties(layers);
    };

    /**
     * Private Method: _getVisibleOverLayers
     *
     * Parameter: layers (Array of strings)
     */

    var _overwiteThemeProperties = function (layers) {
        $.each(_allLayersGroups, function (i, theme) {
            $.each(theme.layers, function (j, l) {
                if (layers.indexOf(l.name) != -1) {
                    l.checked = true;
                } else {
                    l.checked = false;
                }
            });
        });
    };


    /*
     * Public
     */

    return {

        /**
         * Public Method: updatePopupSize
         *
         */

        updatePopupSize: function () {
            //_map.popups[0].setSize(new Ol.Size($("#abc")[0].offsetWidth,$("#abc")[0].offsetHeight));
        },

        /**
         * Public Method: ugetFeatureInfo
         *
         */

        getFeatureInfo: function () {
            return _getFeatureInfo;
        },

        /**
         * Public Method: setTool
         *
         */

        setTool: function (tool) {
            _deactivateTools();
            switch (tool) {
            case 'info':
                _getFeatureInfo.activate();
                break;
            case 'measureline':
                _setLineMeasure();
                break;
            case 'measurearea':
                _setAreaMeasure();
                break;
            }
            _map.events.triggerEvent('mviewer.' + tool + 'tool');
        },

        /**
         * Public Method: getActiveBaseLayer
         *
         */

        getActiveBaseLayer: function () {
            var result = null;
            for (var i = 0; i < baseLayers.length; i += 1) {
                var l = baseLayers[i];
                if (l.getVisibility()) {
                    result = l.blid;
                    break;
                }
            }
            return result;
        },

        /**
         * Public Method: setActiveBaseLayer
         *
         */

        setBaseLayer: function (baseLayerId) {
            for (var i = 0; i < baseLayers.length; i += 1) {
                var l = baseLayers[i];
                if (l.getVisibility()) {
                    l.setVisibility(false);
                } else {
                    (l.blid === baseLayerId) ? l.setVisibility(true) : l.setVisibility(false);
                }
            }
            $.each(baseLayers, function (id, layer) {
                var opt = $(_options).find("baselayers").attr("style");
                var elem = (opt === "gallery") ? $('#' + layer.blid + '_btn').closest('li') : $('#' + layer.blid + '_btn');
                if (layer.visibility) {
                    $(elem).attr("data-theme", "b").removeClass("ui-btn-a ui-btn-up-a ui-btn-hover-a").addClass("ui-btn-b ui-btn-up-b").trigger("create");
                } else {
                    $(elem).attr("data-theme", "a").removeClass("ui-btn-b ui-btn-up-b ui-btn-hover-b").addClass("ui-btn-a ui-btn-up-a").trigger("create");
                }
                if (opt === "gallery") {
                    $('#basemapslist').trigger("collapse");
                }
            });
        },

        /**
         * Public Method: changeLayerOpacity
         *
         */

        changeLayerOpacity: function (id, value) {
            _layersGroup[id].layer.setOpacity(value / 100);
        },

        /**
         * Public Method: toggleOverLayer
         *
         */

        toggleOverLayer: function (id) {
            _layersGroup[id].checked = !_layersGroup[id].checked;
            if (_layersGroup[id].checked) {
                //_map.addLayer(_layersGroup[id].layer);
                _layersGroup[id].layer.setVisibility(true);
            } else {
                //_map.removeLayer(_layersGroup[id].layer);
                _layersGroup[id].layer.setVisibility(false);
            }
            _map.events.triggerEvent('mviewer.toggleoverlayer', {
                layer: _layersGroup[id]
            });
        },

        /**
         * Public Method: getLegendUrl
         *
         */

        getLegendUrl: function (layer) {
            return layer.url + '?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.id + '&style=' + layer.style + '&legend_options=fontName:Trebuchet%20MS;fontAntiAliasing:true;fontColor:0x222222;fontSize:12;dpi:96&SCALE='+parseInt(_map.getScale());
        },

        /**
         * Public Method: setPermalink
         *
         */

        setPermalink: function () {
            var permalinkLink = Ol.Util.getElement("permalinklink");
            var permaqr = Ol.Util.getElement("permaqr");
            var c = map.getCenter();
            var linkParams = {};
            linkParams.x = encodeURIComponent(Math.round(c.lon));
            linkParams.y = encodeURIComponent(Math.round(c.lat));
            linkParams.z = encodeURIComponent(map.getZoom());
            linkParams.lb = encodeURIComponent(this.getActiveBaseLayer());
            linkParams.l = encodeURIComponent(_getVisibleOverLayers());
            if (config.config) {
                linkParams.config = config.config;
            }

            var url = Ol.Util.urlAppend(
                window.location.href.split('?')[0],
                Ol.Util.getParameterString(linkParams)
            );
            permalinkLink.href = url;
            permaqr.src = "http://chart.apis.google.com/chart?cht=qr&chs=140x140&chl=" + encodeURIComponent(url);

            return url;
        },

        /**
         * Public Method: resetLineMeasure
         *
         */

        resetLineMeasure: function () {
            measureControls.line.deactivate();
            measureControls.line.activate();
            _map.events.triggerEvent('mviewer.updatelinemeasure', {
                measure: 0,
                units: 'm'
            });
        },

        /**
         * Public Method: resetAreaMeasure
         *
         */

        resetAreaMeasure: function () {
            measureControls.polygon.deactivate();
            measureControls.polygon.activate();
            _map.events.triggerEvent('mviewer.updateareameasure', {
                measure: 0,
                units: 'm'
            });
        },

        /**
         * Public Method: getInitialExtent
         *
         */

        getInitialExtent: function () {
            return _extent;
        },

        /**
         * Public Method: init
         *
         */

        init: function (xml) {
            try {
                Ol.DOTS_PER_INCH = 25.4 / 0.28;
                _options = xml;
                var options = $(xml).find("mapoptions");
                _extent = new Ol.Bounds.fromString(options.attr("extent"));
                _mapOptions = {
                    projection: new Ol.Projection(options.attr("projection")),
                    displayProjection: new Ol.Projection(options.attr("displayprojection")),
                    maxExtent: new Ol.Bounds.fromString(options.attr("maxextent")),
                    restrictedExtent: new Ol.Bounds.fromString(options.attr("restrictedextent")),
                    maxResolution: parseInt(options.attr("maxresolution")),
                    numZoomLevels: 20, // max zoom level + 1
                    units: "m",
                    controls: [
                        new Ol.Control.Navigation({
                            mouseWheelOptions: {
                                cumulative: false,
                                interval: 100
                            },
                            dragPanOptions: {
                                enableKinetic: {
                                    deceleration: 0.02
                                }
                            }
                        }),
                        new Ol.Control.ZoomBox(),
                        new Ol.Control.LoadingPanel()

                    ],
                    layers: [new Ol.Layer("fake", {
                        isBaseLayer: true,
                        displayInLayerSwitcher: false
                    })]
                };
                _map = new Ol.Map('map', _mapOptions);
                _map.mviewer = mviewer;
                Ol.ProxyHost = $(xml).find('proxy').attr("url");
                _olsCompletionUrl = $(xml).find('olscompletion').attr("url");
                var bl = $(xml).find('baselayer');
                var th = $(xml).find('theme');
                var baselayerControlStyle = $(xml).find('baselayers').attr("style");
                $(bl).each(function () {
                    _createBaseLayer($(this));
                    var label = $(this).attr("label");
                    var id = $(this).attr("id");
                    var thumb = $(this).attr("thumbgallery");
                    var domBaseLayer = "";
                    if (baselayerControlStyle === "default") {
                        domBaseLayer = '<a href="#" id="' + id + '_btn" title="' + $(this).attr("title") + '" onclick="map.mviewer.setBaseLayer(\'' + id + '\')" data-theme="a" data-role="button">' + label + '</a>';
                        $("#baselayerstoolbar").append(domBaseLayer);
                    }
                    if (baselayerControlStyle === "gallery") {
                        domBaseLayer = '<li onclick="map.mviewer.setBaseLayer(\'' + id + '\')"><a id="' + id + '_btn" href="#"><img src="' + thumb + '" /><h3>' + id + '</h3><p>' + $(this).attr("title") + '</p></a></li>';
                        $("#basemapslist").append(domBaseLayer);
                    }
                });
                if (baselayerControlStyle === "default") {
                    $("#baselayerstoolbar").show();
                    $("#baselayerstoolbar").controlgroup();
                    $("#baselayerstoolbar").trigger("create");
                    $("#baselayerstoolbar").controlgroup("refresh");
                    //hack jquerymobile 1.3.1
                    $("#baselayerstoolbar").navbar();
                }
                if (baselayerControlStyle === "gallery") {
                    $("#basemapslist").trigger("create");
                    $("#basemapslist").listview('refresh');
                    $("#basemapstoolbar").show();
                }

                _allLayersGroups = {};
                var maps = $(xml).find('map');
                $(maps).each(function () {
                    var mapid = $(this).attr("id");
                    _allLayersGroups[mapid] = {};
                    _allLayersGroups[mapid].id = mapid;
                    _allLayersGroups[mapid].name = $(this).attr("name");
                    var logoXml = $(this).find('logo');
                    var object = '';
                    $(logoXml).each(function () {
                        object += '<a href="' + $(this).attr("url") + '" target="_blank" title="' + $(this).attr("title") + '"><img src="img/logo/' + $(this).attr("img") + '" /></a>';
                    });
                    object += '<a href="http://www.bretagne.fr" target="_blank" title="Accéder au site de Bretagne.fr"><img src="img/logo/RB_NB.png" /></a>';
                    _allLayersGroups[mapid].logos = object;
                    _allLayersGroups[mapid].layers = {};
                    var layersXml = $(this).find('layer');
                    $(layersXml.get().reverse()).each(function () {
                        var layerId = $(this).attr("id");
                        _layersGroup[layerId] = {};
                        _layersGroup[layerId].id = layerId;
                        _layersGroup[layerId].name = $(this).attr("name");
                        _layersGroup[layerId].style = $(this).attr("style");
                        _layersGroup[layerId].attribution = $(this).attr("attribution");
                        _layersGroup[layerId].metadata = $(this).attr("metadata");
                        _layersGroup[layerId].url = $(this).attr("url");
                        _layersGroup[layerId].scale = {};
                        _layersGroup[layerId].scale.min = parseInt($(this).attr("scalemin"));
                        _layersGroup[layerId].scale.max = parseInt($(this).attr("scalemax"));
                        _layersGroup[layerId].queryable = ($(this).attr("queryable") == "true") ? true : false;
                        _layersGroup[layerId].checked = ($(this).attr("visible") == "true") ? true : false;
                        _layersGroup[layerId].enable = true;
                        if ($(this).attr("fields") && $(this).attr("aliases")) {
                            _layersGroup[layerId].fields = $(this).attr("fields").split(",");
                            _layersGroup[layerId].aliases = $(this).attr("aliases").split(",");
                        }
                        _layersGroup[layerId].layer = new Ol.Layer.WMS(
                            $(this).attr("name"),
                            $(this).attr("url"), {
                                layers: layerId,
                                format: "image/png",
                                maxScale: parseInt($(this).attr("scalemax")),
                                transparent: true
                            }, {
                                isBaseLayer: false,
                                singleTile: true,
                                ratio: 1.2
                            }
                        );
                        _layersGroup[layerId].layer.setVisibility(false);
                        // stylee
                        if (_layersGroup[layerId].style) {
                            _layersGroup[layerId].layer.mergeNewParams({
                                "STYLES": _layersGroup[layerId].style
                            });
                        }
                        _allLayersGroups[mapid].layers[layerId] = _layersGroup[layerId];
                        if (_layersGroup[layerId].queryable) {
                            _queryableLayers.push(_layersGroup[layerId].layer);
                        }
                        _allOverLayers[layerId] = _layersGroup[layerId];
                        _map.addLayer(_layersGroup[layerId].layer);
                    }); //fin each	layer					
                }); // fin each map                

                _initThemes();
                _initTools();
                _initSearch();
                _initShare();
                _initPanelsPopup();
                //PERMALINK
                if (config.x && config.y && config.z) {
                    _map.setCenter(new Ol.LonLat(config.x, config.y), config.z);
                } else {
                    _map.zoomToExtent(_extent);
                }
                if (config.lb && $.grep(baseLayers, function (n) {
                    return n.blid === config.lb;
                })[0]) {

                    _map.mviewer.setBaseLayer(config.lb);
                    //todo asynchronous layers WMTS
                } else {
                    _map.mviewer.setBaseLayer($(xml).find('baselayers').find('[visible="true"]').attr("id"));
                }
                if (config.l) {
                    _setVisibleOverLayers(config.l);
                } else {
                    this.loadMap($(xml).find('theme').find('[default="true"]').attr("id"));
                }

                var control;
                for (var key in measureControls) {
                    control = measureControls[key];
                    control.events.on({
                        "measure": handleMeasurements,
                        "measurepartial": handleMeasurements
                    });
                    _map.addControl(control);
                }
                var scaleline = new Ol.Control.ScaleLine();
                _map.addControl(scaleline);
                _map.paddingForPopups = new Ol.Bounds(200, 105, -30, 65);

                createGetFeatureInfoControl();

                _map.events.register('zoomend', null, _updateLayersGroup);
                _map.events.register('changelayer', null, _mapChange);
                _map.events.register('moveend', null, _mapChange);

                //plugins               
                var wdgts = $(xml).find('widget');
                $(wdgts).each(function () {
                    var widget = $(this).attr("name");
                    $.getScript('widgets/' + widget + '/init.js')
                        .fail(function (jqxhr, settings, exception) {
                            alert("Un widget n'a pu être chargé.");
                        });
                });

                return _map;

            } catch (err) {
                alert(err.message);
            }
        },

        /**
         * Public Method: getOlsCompletionUrl
         *
         */

        getOlsCompletionUrl: function () {
            return _olsCompletionUrl;
        },
        
         /**
         * Public Method: popupPhoto
         *
         */

        popupPhoto: function (src) {
            $("#imagepopup").find("img").attr("src",src) ;
            $("#imagepopup").popup('open');
        },

        /**
         * Public Method: zoomToLocation
         *
         */

        zoomToLocation: function (x, y, classification, lib) {

            var zoom = 15;
            var ptResult = new Ol.LonLat(x, y).transform(new Ol.Projection("EPSG:4326"), new Ol.Projection(_map.displayProjection.projCode));
            switch (classification) {
            case 1, 2:
                zoom = 13;
                break;
            case 3:
                zoom = 14;
                break;
            case 5:
                zoom = 15;
                break;
            case 6:
                zoom = 16;
                break;
            case 7:
                zoom = 17;
                break;
            }
            _map.setCenter(ptResult, zoom);
            $("#searchresults").html("").listview("refresh");
            $("#searchtool .ui-icon-delete").click();

        },

        /**
         * Public Method: loadMap
         *
         */

        loadMap: function (id) {
            var composite = $(_options).find("themes").attr("composite");
            if (composite === "false") {
                _removeAllOverLayers();
            }
            var themap = _allLayersGroups[id];
            _layersGroup = _allLayersGroups[id].layers;
            $("#logo").html(themap.logos);
            //clearThemes();
            $('#themeaccordeon li[data-role!=list-divider]').each(function (idx, obj) {
                $(this).attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c").trigger("create");
            });
            $('#' + themap.id + '_btn').attr("data-theme", "b").removeClass("ui-btn-up-c").removeClass("ui-btn-hover-c").addClass("ui-btn-up-b").trigger("create");
            _updateLayersGroup();
        },

        /**
         * Public Method: closePopup
         *
         */

        closePopup: function (event) {
            event.stopPropagation();
            map.popups.forEach(function (p) {
                p.destroy();
            });
        },

        /**
         * Public Method: showWidgets
         *
         */

        showWidgets: function () {
            $("#widgetcontainer").toggle();
            $(".widget").each(function () {
                $(this).toggle();
            });
        },

        /**
         * Public Method: mapShare
         *
         */

        mapShare: function () {
            var myurl = this.setPermalink();
            $('.easyShareBox').remove();
            $('#shareeasy').append('<a id="alink" href="' + encodeURIComponent(myurl) + '" title="Kartenn" class="easyShare">Share me !</a>');
            $('.easyShare').easyShare({
                imagePath: 'lib/jquery/base/plugins/easyshare/',
                sites: ['facebook', 'twitter', 'google', 'yahoo', 'bebo', 'evernote', 'live', 'linkedin', 'netvibes'],
                mode: 'big'
            });
        } // fin function tools toolbar
    }; // fin return		

})();