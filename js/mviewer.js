/*
 *
 * This file is part of mviewer
 *
 * mviewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with mviewer.  If not, see <http://www.gnu.org/licenses/>.
 */

mviewer = (function () {
    /*
     * Private
     */

    proj4.defs("EPSG:2154",
        "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 " +
        "+units=m +no_defs");

    ol.proj.proj4.register(proj4);

    /**
     * Property: _proxy
     * Ajax proxy to use for crossdomain requests
     * It could be georchestra security-proxy
     */

    var _proxy = "";

    var _bsize = ""; /* bootstrap size */

    var _mediaSize = "";

    var _geolocation;

    var _sourceGeolocation;

    var _events = {
        _confLoaded: false,
        _overLayersLoaded: 0,
        _overLayersTotal: 0,
        overLayersLoadedListener: function(val) {},
        set overLayersLoaded(val) {
            this._overLayersLoaded = val;
            this.overLayersLoadedListener(val);
        },
        get overLayersLoaded() {
            return this._overLayersLoaded;
        },
        set overLayersTotal(val) {
            this._overLayersTotal = val;
        },
        get overLayersTotal() {
            return this._overLayersTotal;
        },
        confLoadedListener: function(val) {},
        set confLoaded(val) {
            this._confLoaded = val;
            this.confLoadedListener(val);
        },
        get confLoaded() {
            return this._confLoaded;
        },
        registerOverLayersLoadedListener: function(listener) {
            this.overLayersLoadedListener = listener;
        },
        registerConfLoadedListener: function(listener) {
            this.confLoadedListener = listener;
        }
    };

    _events.registerOverLayersLoadedListener(function(val) {
        if (val === _events.overLayersTotal && _events.confLoaded === true) {
            $(document).trigger("layersLoaded");
        }
    });

    _events.registerConfLoadedListener(function(val) {
        if (_events.overLayersLoaded === _events.overLayersTotal && val === true) {
            $(document).trigger("layersLoaded");
        }
    });

    var _overLayersReady = function () {
        mviewer.init();
        _applyPermalink();
         //Get backgroundlayer value if exists
        if (API.lb && $.grep(_backgroundLayers, function (n) {
            return n.get('blid') === API.lb;
        })[0]) {
            mviewer.setBaseLayer(API.lb);
        } else {
            mviewer.setBaseLayer(configuration.getDefaultBaseLayer());
        }
        _showCheckedLayers();
    };

    var _applyPermalink = function () {
        //Get  x, y & z url parameters if exists
        if (API.x && API.y && API.z) {
            var center =   [parseFloat(API.x), parseFloat(API.y)];
            var zoom = parseInt(API.z);
            _map.getView().setCenter(center);
            _map.getView().setZoom(zoom);
        }
        //get visible layers
        if (API.l) {
            _setVisibleOverLayers(API.l);
        }
    };



    /**
     * Property: _ajaxURL
     *
     */

    var _ajaxURL = function (url, optionalProxy) {
        // relative path
        if (url.indexOf('http')!=0) {
            return url;
        }
        // same domain
        else if (url.indexOf(location.protocol + '//' + location.host)===0) {
            return url;
        }
        else {
            if (optionalProxy) {
                return  optionalProxy + encodeURIComponent(url);
            } else if (_proxy) {
                return  _proxy + encodeURIComponent(url);
            } else {
                return url;
            }
        }
    };

    /**
     * Property: _map
     * {ol.Map} The map
     */

    var _map = null;


    /**
     * Property: _projection
     * {ol.projection} The map projection
     */

    var _projection = null;

    /**
     * Property: _center
     *
     */

    var _center = null;
    /**
      * Property: _rotation
      *
      */

    var _rotation = false;

    /**
     * Property: _backgroundLayers
     * Array -  of  OpenLayers.Layer
     */

    var _backgroundLayers = [];

    /**
     * Property: _overLayers
     * {object} hash of all overlay Layers (static)
     */

    var _overLayers = {};

    /**
     * Property: _scaledDependantLayers
     * Array of {OpenLayers.Layers.WMS} .
     */

    var _scaledDependantLayers = [];

    var _scaledDependantLayersLegend = [];

    /**
     * Property: _themes
     * {object} hash of all overlay Layers (for each sub theme) - static.
     */

    var _themes = null;

    /**
     * Property: _marker
     * marker used to locate features on the map.
     * @type {ol.Overlay}
     */

    var _marker = null;

    var _topLayer = false;

    var _exclusiveLayer;

    /**
     * Property: renderer
     * @type {ol.Renderer}
     */

    var _renderer = 'canvas';

    /**
     * Property: _sourceOverlay
     * @type {ol.source.Vector}
     * Used to highlight vector features
     */

    var _sourceOverlay;

    /**
     * Property: _overlayFeatureLayer
     * @type {ol.layer.Vector}
     * Used to highlight vector features
     */

    var _overlayFeatureLayer = false;

    var _setVariables = function () {
        _proxy = configuration.getProxy();
    };

    var _initMap = function (mapoptions) {
        _zoom = parseInt(mapoptions.zoom) || 8;
        if (mapoptions.rotation === "true" ) {
            _rotation = true;
        } else {
             $("#northbtn").hide();
        }
        _center = mapoptions.center.split(",").map(Number);
        //Projection
        switch (mapoptions.projection) {
            case "EPSG:3857":
            case "EPSG:4326":
                _projection = ol.proj.get(mapoptions.projection);
                break;

            default:
                _projection = new ol.proj.Projection({
                    code: mapoptions.projection,
                    extent: mapoptions.projextent.split(",").map(function(item) {return parseFloat(item);})
                });
        }
        utils.initWMTSMatrixsets(_projection);
        var overlays = [];
        //Create overlay (red pin) used by showLocation method
        //TODO rename els_marker to mv-marker
        _marker = new ol.Overlay({ positioning: 'bottom-center', element: $("#els_marker")[0], stopEvent: false})
        overlays.push(_marker);
        _map = new ol.Map({
            target: 'map',
            controls: [
                //new ol.control.FullScreen(),
                new ol.control.Attribution({ collapsible: true }),
                new ol.control.ScaleLine(),
                new ol.control.MousePosition({
                    projection: _projection.getCode(),
                    undefinedHTML: 'y , x',
                    className: 'custom-mouse-position',
                    target: document.getElementById('mouse-position'),
                    coordinateFormat: function(coordinate) {
                        let getCoord = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate,
                            _projection.getCode(), 'EPSG:4326'));
                        let coordStr = getCoord.replace(/ /g,"").replace("N","N - ");
                        return coordStr;
                    }
                }),
            ],
            interactions: ol.interaction.defaults({
              doubleClickZoom: false
            }),
            overlays: overlays,
            renderer: _renderer,
            view: new ol.View({
                projection: _projection,
                maxZoom: mapoptions.maxzoom || 19,
                center: _center,
                enableRotation: _rotation,
                zoom: _zoom
            })
        });

         _map.on('moveend', _mapChange);
        //Handle zoom change
        _map.getView().on('change:resolution', _mapZoomChange);
        return _map;
    };

    /**
     * _message Show message method.
     * @param {String} msg
     */

    var _message = function (msg, cls) {
        var item = $(['<div class="alert '+cls+' alert-dismissible" role="alert">',
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
            '<span aria-hidden="true">&times;</span></button>',
            mviewer.tr (msg),
            '</div>'].join (""));
            $("#alerts-zone").append(item);
    };

    var _deleteLayer = function (layername) {
        $( "[data-layerid='"+layername+"']").remove();
        _map.removeLayer(_overLayers[layername].layer);
        delete _overLayers[layername];
    };

    var _getlegendurl = function (layer, scale) {
        var sld = "";
        var legendUrl = "";
        if (layer.sld) {
            sld = '&SLD=' + encodeURIComponent(layer.sld);
        }
        var _layerUrl = layer.url.replace(/[?&]$/, '');
        if (layer.legendurl && !layer.styles) {
            legendUrl = layer.legendurl;
        } else if (layer.legendurl && layer.styles && (layer.styles.split(",").length === 1)) {
            legendUrl = layer.legendurl;
        } else if (layer.sld) {
            legendUrl = _layerUrl.indexOf('?') === -1 ? _layerUrl + '?' : _layerUrl + '&';
            legendUrl = legendUrl + 'service=WMS&Version=1.3.0&request=GetLegendGraphic&SLD_VERSION=1.1.0'+
            '&format=image%2Fpng&width=30&height=20&layer=' + layer.layername + '&style=' + sld+
            '&legend_options=fontName:Open%20Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10;dpi:96&TRANSPARENT=true';
        } else {
            legendUrl = _layerUrl.indexOf('?') === -1 ? _layerUrl + '?' : _layerUrl + '&';
            legendUrl = legendUrl + 'service=WMS&Version=1.3.0&request=GetLegendGraphic&SLD_VERSION=1.1.0'+
            '&format=image%2Fpng&width=30&height=20&layer=' + layer.layername + '&style=' + layer.style + sld+
            '&legend_options=fontName:Open%20Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10;dpi:96&TRANSPARENT=true';
        }
        if (layer.dynamiclegend) {
            if (!scale) {
                scale = _calculateScale(_map.getView().getResolution());
            }
            legendUrl = legendUrl.split("&scale=")[0] += "&scale="+scale;
        }
        return legendUrl;
    };


     //{styles:stylePublic, label: "Public", geometry: "Point"}
    /**
     * _drawVectorLegend draw vector legend  method.
     * @param {String} layerid
     * @param {Array} items. Array of {styles:ol.styles , label: string, geometry: Point|Polygon|LineString)
     */

    var _drawVectorLegend = function (layerid, items) {
		//Remove classic getLegendUrl
        $("#legend-"+layerid).remove();
        var canvas = document.getElementById("vector-legend-" + layerid);
        if (canvas) {
            var marginTop = 15;
            var marginLeft = 15;
            var itemHeight = 20;
            var horizontalSpace = 10;
            verticalPosition = 0;
            var geomWidth = 25;
            var geomHeight = 15;
            var verticalSpace = itemHeight - geomHeight;
            var ctx = canvas.getContext('2d');
            vectorContext = ol.render.toContext(ctx, {
                size: [250, (items.length * itemHeight) + marginTop]
            });
            items.forEach( function (item, id) {
                var geometry;
                verticalPosition+= itemHeight;
                switch (item.geometry) {
                    case 'Point':
                        geometry = new ol.geom.Point([marginLeft + (geomWidth/2),
                            verticalPosition - (geomHeight/2)]);
                        break;

                    case 'LineString':
                        geometry = new ol.geom.LineString([[marginLeft, -marginTop + verticalPosition],
                            [marginLeft + geomWidth, -marginTop + verticalPosition + geomHeight]]);
                        break;

                    case 'Polygon':
                        geometry = new ol.geom.Polygon([[
                            [marginLeft, -marginTop + verticalPosition],
                            [marginLeft, -marginTop + verticalPosition + geomHeight],
                            [marginLeft + geomWidth, -marginTop + verticalPosition + geomHeight],
                            [marginLeft + geomWidth, -marginTop + verticalPosition],
                            [marginLeft, -marginTop + verticalPosition]]]);
                        break;
                }

                item.styles.forEach(function (style) {
                    vectorContext.setStyle(style);
                    vectorContext.drawGeometry(geometry);
                });
                ctx.fillStyle = 'rgba(153, 153, 153, 1)';
                var fontsize = 12;
                ctx.font = fontsize + 'px roboto_regular, Arial, Sans-serif';
                ctx.textAlign = "left";
                ctx.fillText(item.label ,marginLeft + geomWidth + horizontalSpace, verticalPosition - (geomHeight - fontsize));

            });
        }
    };

    var _convertScale2Resolution = function (scale) {
         return scale * 0.28/1000;
    };

    /**
     * Geoloalisation
     * Private Method: _initGeolocation
     *
     */

    var _initGeolocation = function () {
        _geolocation = new ol.Geolocation({
            projection: _projection,
            trackingOptions: {
                enableHighAccuracy: true
            }
        });
        _sourceGeolocation = new ol.source.Vector();
        var layerposition = new ol.layer.Vector({
          source: _sourceGeolocation
        });
        _map.addLayer(layerposition);
    };

    /**
     * Private Method: initVectorOverlay
     * this layer is used to render ol.Feature in methods
     * - zoomToLocation
     */

    var _initVectorOverlay = function () {
        _sourceOverlay = new ol.source.Vector();
        _overlayFeatureLayer = new ol.layer.Vector({
            source: _sourceOverlay,
            style: mviewer.featureStyles.highlight
        });
        _overlayFeatureLayer.set('mviewerid', 'featureoverlay');
        _map.addLayer(_overlayFeatureLayer);
    };

    /**
     * Private Method: initTools
     * Tools can be set or unset. Only one tool can be enabled like a switch.
     * The default enabled tool is info (getFeatureInfo control)
     * Tools must have this methods : enable & disabled & init
     *
     */

    _initTools = function () {
        //GetFeatureInfo tool
        mviewer.tools.info = info;
        mviewer.tools.info.init();
        //Measure tool
        if (configuration.getConfiguration().application.measuretools === "true") {
            //Load measure moadule
            mviewer.tools.measure = measure;
            mviewer.tools.measure.init();
        }
        //Activate GetFeatureInfo tool
        mviewer.setTool('info');
        //Activate tooltips on tools buttons
        if (!configuration.getConfiguration().mobile) {
            $("#backgroundlayersbtn, #zoomtoolbar button, #toolstoolbar button, #toolstoolbar a").tooltip({
                placement: 'left',
                trigger: 'hover',
                html: true,
                container: 'body',
                template: mviewer.templates.tooltip
            });
        }
    };

    var _initShare = function () {
        var displayMode =  API.mode || 'd';
        $("#mv-display-mode input").filter('[value="'+  displayMode +'"]').attr('checked', true);
        $( "#mv-display-mode input" ).change(function() {
            mviewer.setPermalink();
        });
    };

    /**
     * Private Method: _initPanelsPopup
     *
     */

    var _initPanelsPopup = function () {
        if (configuration.getConfiguration().application.help) {
            $.ajax({
                url: configuration.getConfiguration().application.help,
                dataType: "text",
                success: function (html) {
                    $("#help .modal-body").append(html);
                }
            });
        }
    };

    /**
     * Private Method: _mapChange
     *
     *Parameter e - event
     */

    var _mapChange = function (e) {
        if ($("#sharepanel-popup").css("visibility") === "visible") {
            mviewer.setPermalink();
        }
        if (search.options.features && $("#searchfield").val()) {
           search.sendElasticsearchRequest($("#searchfield").val());
        }
    };

    /**
     * Private Method: _calculateScale
     *
     * Parameter res - resolution
     */

    var _calculateScale = function (res) {
        var ppi = 25.4/0.28;
        return res*ppi/0.0254;
    };

    /**
     * Private Method: _mapZoomChange
     *
     *Parameter e - event
     */

    var _mapZoomChange = function (e) {
        var resolution = e.target.getResolution();
        var scale = _calculateScale(resolution);
        _updateLayersScaleDependancy(scale);
        _updateLegendsScaleDependancy(scale);
    };

    /**
     * Private Method: _getLayerByName
     *
     * Parameter name - layer name
     */

    var _getLayerByName = function (name) {
        return $.grep(_map.getLayers().getArray(), function(layer, i) { return layer.get('name') === name; })[0];
    };

    var _processLayer = function (oLayer, l) {
        oLayer.layer = l;
        l.setVisible(oLayer.checked);
        l.setOpacity(oLayer.opacity);
        if (oLayer.scale && oLayer.scale.max) { l.setMaxResolution(_convertScale2Resolution(oLayer.scale.max)); }
        if (oLayer.scale && oLayer.scale.min) { l.setMinResolution(_convertScale2Resolution(oLayer.scale.min)); }
        l.set('name', oLayer.name);
        l.set('mviewerid', oLayer.id);

        if (oLayer.searchable) {
            search.processSearchableLayer(oLayer);
        }
        if (oLayer.scale) {
            _scaledDependantLayers.push(oLayer);
        }
        if (oLayer.dynamiclegend) {
            _scaledDependantLayersLegend.push(oLayer);
        }
        _overLayers[oLayer.id] = oLayer;

        if (oLayer.metadatacsw && oLayer.metadatacsw.search("http")>=0) {
            $.ajax({
                dataType: "xml",
                layer: oLayer.id,
                url:  _ajaxURL(oLayer.metadatacsw),
                success: function (result) {
                    var summary = "";
                    if ($(result).find("dct\\:abstract, abstract").length > 0) {
                        summary = '<p>'+ $(result).find("dct\\:abstract, abstract").text()+ '</p>';
                    } else {
                        summary = '<p>'+$(result).find("gmd\\:identificationInfo, identificationInfo")
                            .find("gmd\\:MD_DataIdentification,  MD_DataIdentification")
                            .find("gmd\\:abstract, abstract").find("gco\\:CharacterString, CharacterString").text()+ '</p>';
                    }
                    if (_overLayers[this.layer].metadata) {
                        summary += '<a href="'+_overLayers[this.layer].metadata+'" target="_blank">En savoir plus</a>';
                    }
                    _overLayers[this.layer].summary = summary;
                    //update visible layers on the map
                    $('#'+this.layer+'-layer-summary').attr("data-content", summary);
                }
            });
        }
        _map.addLayer(l);
        _events.overLayersLoaded += 1;
    };

    /**
     * Private Method: _updateMedia
     *
     */

    var _updateMedia = function (s) {
        switch (s) {
            case "xs":
            case "sm":
                if (_mediaSize === "xl") {
                    _updateViewPort("xs");
                }
                break;
            case "md":
            case "lg":
                if (_mediaSize === "xs") {
                    _updateViewPort("xl");
                }
                break;
        }

    };

    /**
     * Private Method: _updateViewPort
     *
     */

    var _updateViewPort = function (s, displayMode) {
        _mediaSize = s;
        if (s === "xs") {
            $("#wrapper, #main").removeClass("xl").addClass("xs");
            $("#menu").appendTo("#thematic-modal .modal-body");
            $("#legend").appendTo("#legend-modal .modal-body");
            configuration.getConfiguration().mobile = true;
            if (displayMode) {
                 $("#wrapper, #main").addClass("mode-" + displayMode);
                 $("#page-content-wrapper").append(['<a id="btn-mode-su-menu" class="btn btn-sm btn-default" ',
                    'type="button" href="#" data-toggle="modal" data-target="#legend-modal">',
                    '<span class="glyphicon glyphicon-menu-hamburger"></span></a>'].join(""));
                 if (displayMode === "u") {
                    $("#mv-navbar").remove();
                 }
            }
        } else {
            $("#wrapper, #main").removeClass("xs").addClass("xl");
            $("#menu").appendTo("#sidebar-wrapper");
            $("#legend").appendTo("#layers-container-box");
            configuration.getConfiguration().mobile = false;
        }
    };

    /**
     * Private Method: _initDisplayMode
     *
     */

    var _initDisplayMode = function () {
        var displayMode = "d"; /* d :default, s: simple, u: ultrasimple */
        if (API.mode && (API.mode === "s" || API.mode === "u")) {
            displayMode = API.mode;
            if (API.mode === "u") {
                //Show searchtool on main div
                $("#searchtool").appendTo("#main");
                $("#searchtool").removeClass("navbar-form");
            }
        }
        if ($(window).width() < 992 || displayMode !== "d") {
            _mediaSize = "xs";
            configuration.getConfiguration().mobile = true;
        } else {
            _mediaSize = "xl";
            configuration.getConfiguration().mobile = false;
        }
        if (_mediaSize === "xs") {
            _updateViewPort("xs", displayMode);
        }
        if (displayMode === "d") {
            $(window).resize(function() {
                var w = $(this).width();
                var s = "";
                if (w < 768) {
                    s = 'xs';
                } else if (w < 992) {
                    s = 'sm';
                } else if (w < 1200) {
                    s = 'md';
                } else if (w >= 1200) {
                    s = 'lg';
                }
                if (s !== _bsize) {
                    _bsize = s;
                    _updateMedia(_bsize);
                }
            });
        }
        if (configuration.getConfiguration().mobile) {
            $("#thematic-modal .modal-body").append('<ul class="sidebar-nav nav-pills nav-stacked" id="menu"></ul>');
            $("#legend").appendTo("#legend-modal .modal-body");
        } else {
            $("#sidebar-wrapper").append('<ul class="sidebar-nav nav-pills nav-stacked" id="menu"></ul>');
        }

        $('.navbar-collapse a, #map').on('click', function(){
            if ( $( '.navbar-collapse' ).hasClass('in') ) {
                $('.navbar-toggle').click();
            }
        });

    };
    /**
     * Private Method: _initDataList
     *
     * Parameter
     */

    var _initDataList = function () {
        var htmlListGroup = '';
        var reverse_themes = [];
        var crossorigin = '';
        _themes = configuration.getThemes();
		var topics = false;
		if (API.topics) {
			topics = API.topics.split(",");
		}
        $.each(_themes, function (id, theme) {
			if (topics) {
				if (topics.indexOf(theme.id) >= 0) {
					reverse_themes.push(theme);
				}
			} else {
				reverse_themes.push(theme);
			}
        });

        $.each(reverse_themes.reverse(), function (id, theme) {
            var reverse_layers = [];
            var groups = [];
            var classes = [];
            var view = {
                id:theme.id,
                name: theme.name,
                icon: theme.icon,
                layers:false,
                groups: false,
                toggleAllLayers: false,
                cls: ""
            };
             if (configuration.getConfiguration().application.togglealllayersfromtheme === "true") {
                 view.toggleAllLayers = true;
                 classes.push("empty");
             }
            //GROUPS
            if (_themes[theme.id].groups) {
                classes.push("level-1");
                $.each(_themes[theme.id].groups, function (id, group) {
                    var grp = {title: group.name, layers: [] };
                    $.each(group.layers, function (id, layer) {
                        grp.layers.unshift(layer);
                    });
                    groups.push(grp);
                });
                view.groups = groups;
                view.cls = classes.join(" ");
            //NO GROUPS
            } else {
                 $.each(_themes[theme.id].layers, function (id, layer) {
                    reverse_layers.push(layer);
                });
                view.layers = reverse_layers.reverse();
                view.cls = classes.join(" ");
            }
            htmlListGroup += _renderHTMLFromTemplate(mviewer.templates.theme, view);
        });
        var panelMini = configuration.getConfiguration().themes.mini;
        if (panelMini && (panelMini === 'true')) {
            mviewer.toggleMenu(false);
            mviewer.toggleLegend(false);
        }
        $("#menu").html(htmlListGroup);
        initMenu();
        // Open theme item if set to collapsed=false
        if (configuration.getConfiguration().themes.theme !== undefined) {
            var expanded_theme = $.grep(configuration.getConfiguration().themes.theme, function(obj){return obj.collapsed === "false";});
            if (expanded_theme.length > 0) {
                $("#theme-layers-"+expanded_theme[0].id+">a").click();
            }
        }
        //Add remove and add layers button on them
        if (configuration.getConfiguration().application.togglealllayersfromtheme === "true") {
            $(".toggle-theme-layers").on("click",mviewer.toggleAllThemeLayers);
        }
    };

    var _setLayerScaleStatus = function (layer, scale) {
        if (layer.scale) {
            var legendUrl = _getlegendurl(layer);
            if (scale > layer.scale.min && scale <= layer.scale.max) {
                $('#legend-'+layer.id).attr("src",legendUrl);
                $('#legend-'+layer.id).closest("li").removeClass("glyphicon mv-invisible");
            } else {
                $('#legend-'+layer.id).attr("src","img/invisible.png");
                $('#legend-'+layer.id).closest("li").addClass("glyphicon mv-invisible");
            }
        }
    };

    var _setLayerLegend = function (layer, scale) {
        if (layer.dynamiclegend) {
            var legendUrl = _getlegendurl(layer,scale);
            $('#legend-'+layer.id).attr("src",legendUrl);
        }
    };

    var _updateLayersScaleDependancy = function (scale) {
        $.each( _scaledDependantLayers, function (i, item) {
            _setLayerScaleStatus(item, scale);
        });
    };

    var _updateLegendsScaleDependancy = function (scale) {
        $.each( _scaledDependantLayersLegend, function (i, item) {
            _setLayerLegend(item, scale);
        });
    };

    var _setThemeStatus = function (id, prop) {
        var theme = $('#theme-layers-' + id);
        if (!prop) {
            prop = _getThemeStatus(id);
        }
        switch (prop.status) {
            case "empty":
                theme.removeClass("half full").addClass(prop.status);
                break;
            case "full":
                theme.removeClass("half empty").addClass(prop.status);
                break;
            case "half":
                theme.removeClass("empty full").addClass(prop.status);
                break;
        }
        theme.find(".toggle-theme-layers .badge").text([prop.visible, prop.all].join("/"));
    };

    _getThemeStatus = function (id) {
        var theme = $('#theme-layers-' + id);
        var nbLayers = theme.find("input").length;
        var visLayers = theme.find("input[value='true']").length;
        var status = "";
        if (visLayers === 0 ) {
            status = "empty";
        } else if (visLayers === nbLayers ){
            status = "full";
        } else {
            status = "half";
        }
        return {"visible" : visLayers, "all": nbLayers, "status": status};
    };

    /**
     * Method: _createBaseLayer
     * Create an {OpenLayers.Layer}.OSM|WMTS|WMS
     *
     * Parameters:
     * params - [ xml ] a baselayer node    present in config.xml.
     */

    var _createBaseLayer = function (baselayer) {
        var crossorigin = configuration.getCrossorigin();
        var l;
        switch (baselayer.type) {
            case "fake":
                l = new ol.layer.Base({});
                _backgroundLayers.push(l);
                l.set('name', baselayer.label);
                l.set('blid', baselayer.id);
                break;
            case "WMS":
                var params = {
                                'LAYERS': baselayer.layers,
                                'VERSION': '1.1.1',
                                'FORMAT': baselayer.format,
                                'TRANSPARENT': false
                };
                if (baselayer.tiled !== "false") {
                    params.TILED = true;
                }
                l =  new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: baselayer.url,
                        crossOrigin: crossorigin,
                        maxZoom: baselayer.maxzoom || 18,
                        params: params,
                        attributions:  baselayer.attribution
                    }),
                    visible: false
                });
                l.set('name', baselayer.label);
                l.set('blid', baselayer.id);

                _backgroundLayers.push(l);
                _map.addLayer(l);
                break;
            case "WMTS":
                if (baselayer.fromcapacity === "false") {
                    var matrixset = baselayer.matrixset;
                    var projectionExtent = _projection.getExtent();
                    l = new ol.layer.Tile({
                        source: new ol.source.WMTS({
                            url:  baselayer.url,
                            crossOrigin: crossorigin,
                            layer: baselayer.layers,
                            matrixSet: matrixset,
                            style: baselayer.style,
                            format: baselayer.format,
                            attributions: baselayer.attribution,
                            projection: _projection,
                            tileGrid: new ol.tilegrid.WMTS({
                                origin: ol.extent.getTopLeft(projectionExtent),
                                resolutions: utils.getWMTSTileResolutions(matrixset),
                                matrixIds: utils.getWMTSTileMatrix(matrixset)
                            })
                        })
                    });
                    l.setVisible(false);
                    l.set('name', baselayer.label);
                    l.set('blid', baselayer.id);
                    _map.addLayer(l);
                    _backgroundLayers.push(l);
                }
                else {
                    $.ajax({
                        url:_ajaxURL(baselayer.url),
                        dataType: "xml",
                        data: {
                            SERVICE: "WMTS",
                            VERSION: "1.0.0",
                            REQUEST: "GetCapabilities"
                        },
                        success: function (xml) {
                            var getCapabilitiesResult = (new ol.format.WMTSCapabilities()).read(xml);
                            var WMTSOptions = ol.source.WMTS.optionsFromCapabilities( getCapabilitiesResult, {
                                layer: baselayer.layers,
                                matrixSet: baselayer.matrixset,
                                format:baselayer.format,
                                style: baselayer.style
                            });
                            WMTSOptions.attributions = baselayer.attribution;
                            l = new ol.layer.Tile({ source: new ol.source.WMTS(WMTSOptions) });
                            l.set('name', baselayer.label);
                            l.set('blid', baselayer.id);
                            _map.getLayers().insertAt(0,l);
                            _backgroundLayers.push(l);
                            if( baselayer.visible === 'true' ) {
                                l.setVisible(true);
                            } else {
                                l.setVisible(false);
                            }
                        }
                    });
                }
                break;

            case "OSM":
                l = new ol.layer.Tile({
                    source: new ol.source.OSM({
                        url: baselayer.url,
                        crossOrigin: 'anonymous',
                        maxZoom: baselayer.maxzoom || 18,
                        attributions: baselayer.attribution
                    }),
                    visible: false
                });
                l.set('name', baselayer.label);
                l.set('blid', baselayer.id);
                _backgroundLayers.push(l);
                _map.addLayer(l);
                break;
        }
    };

    /**
     * Private Method: _getVisibleOverLayers
     *
     */

    var _getVisibleOverLayers = function () {
        var layers = [];
        $.each(_overLayers, function (i, item) {
            var layerparams = [];
            if (item.layer.getVisible()) {
                layerparams.push(item.layerid);
                if (item.type === "wms") {
                    //get current style if many styles
                    var source = item.layer.getSource();
                    if(item.styles && source.getParams().STYLES) {
                        layerparams.push(source.getParams().STYLES.trim());
                    } else {
                        layerparams.push("");
                    }
                    //get current filter if necessary
                    if (item.attributefilter && source.getParams()['CQL_FILTER']) {
                        layerparams.push(source.getParams()['CQL_FILTER'].trim());
                    } else {
                        layerparams.push("");
                    }
                    //get current time filter if necessary
                    if (item.timefilter && source.getParams()['TIME']) {
                        layerparams.push(source.getParams()['TIME']);
                    }

                }

                layers.push(layerparams.join("*").replace(/\*$/i, ""));
            }
        });
        return layers.join(",");
    };

    /**
     * Private Method: _setVisibleOverLayers
     *
     */

    var _setVisibleOverLayers = function (lst) {
        var errors = [];
        var errorLayers =[];
        var layers = decodeURIComponent(lst).split(",");
        var layersWithOptions = {};
        layers.forEach(function (layer, i) {
            //search layer by id or by name in overLayers collection
            //layer with options - layername*style*cql_filter*time
            var layerWithOptions = layer.split("*");
            var richLayer = {};
            var layerIdOrName = layerWithOptions[0];
            switch (layerWithOptions.length) {
                case 2:
                    richLayer.style = layerWithOptions[1];
                    break;
                case 3:
                    richLayer.style = layerWithOptions[1];
                    richLayer.filter = layerWithOptions[2];
                    break;
                case 4:
                    richLayer.style = layerWithOptions[1];
                    richLayer.filter = layerWithOptions[2];
                    richLayer.time = layerWithOptions[3];
                    break;
            }

            var l = false;
            if (mviewer.getLayers()[layerIdOrName] && mviewer.getLayers()[layerIdOrName].layer) {
                //layerIdOrName is layerid
                l =  mviewer.getLayers()[layerIdOrName].layer;
                richLayer.layerid = layerIdOrName;
                richLayer.name = mviewer.getLayers()[layerIdOrName].name;
            } else {
                //layerIdOrName is layername
                l = _getLayerByName(layerIdOrName);
                richLayer.name = layerIdOrName;
                richLayer.layerid = l.get("mviewerid");
            }
            layersWithOptions[richLayer.layerid] = richLayer;

            if (l) {
                (l.src)?l.src.setVisible(true):l.setVisible(true);
            } else {
                errors.push(i);
            }
        });
        errors.forEach(function(err) {
            errorLayers.push(layers[err]);
            delete layers[err];
        });
        if (errorLayers.length > 0) {
            mviewer.alert("Couche(s) "+ errorLayers.join(", ") + " non disponible(s)", "alert-danger");
        }
        _overwiteThemeProperties(layersWithOptions);
    };

    /**
     * Private Method: _showCheckedLayers
     *
     * Parameter
     */

    var _showCheckedLayers = function () {
        var checkedLayers = $.map(_overLayers, function(layer, index) {
            if (layer.checked) {
                return layer;
            }
        });
        $.each( checkedLayers, function ( index, layer) {
            if (layer) {
                var l = layer.layer;
                if (l && $(".list-group-item.mv-layer-details[data-layerid='"+layer.id+"']").length === 0) {
                    (l.src)?l.src.setVisible(true):l.setVisible(true);
                    mviewer.addLayer(layer);
                }
            }
        });
    };

    /**
     * Private Method: _overwiteThemeProperties
     *
     * Parameter: layers (Hash of richlayers (layerid, style, filter))
     */

    var _overwiteThemeProperties = function (layersWithOptions) {
        var showLayer = function (layerControler, layerOptions) {
            layerControler.checked = true;
            layerControler.visiblebydefault = true;
            var li = $(".mv-nav-item[data-layerid='"+layerControler.layerid+"']");
            if (layerOptions.style && layerControler.type === "wms") {
                layerControler.layer.getSource().getParams()['STYLES'] = layerOptions.style;
                layerControler.style = layerOptions.style;
            }
            if (layerOptions.filter && layerControler.type === "wms") {
                layerControler.layer.getSource().getParams()['CQL_FILTER'] = layerOptions.filter;
                layerControler.filter = layerOptions.filter;
            }
            mviewer.toggleLayer(li);
            if (layerOptions.time && layerControler.type === "wms") {
                //layerControler.layer.getSource().getParams()['TIME'] = layerOptions.time;
                var timeControl = $("#"+layerControler.layerid+"-layer-timefilter");
                if (timeControl.hasClass("mv-slider-timer")) {
                    timeControl.slider('setValue', layerControler.timevalues.indexOf(layerOptions.time), true, true);
                }
            }

        };

        var hideLayer = function (layerControler) {
            layerControler.checked = false;
            if (layerControler.layer) {
                layerControler.layer.setVisible(false);
            }
            layerControler.visiblebydefault = false;
        };
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

    /**
     * Private Method:  parseWMCResponse
     *
     */

    var _parseWMCResponse = function (response, wmcid) {
        var crossorigin = configuration.getCrossorigin();
        var wmc = $('ViewContext', response);
        var wmc_extent = {};
        wmc_extent.srs=$(wmc).find('General > BoundingBox').attr('SRS');
        wmc_extent.minx = parseInt($(wmc).find('General > BoundingBox').attr('minx'));
        wmc_extent.miny = parseInt($(wmc).find('General > BoundingBox').attr('miny'));
        wmc_extent.maxx = parseInt($(wmc).find('General > BoundingBox').attr('maxx'));
        wmc_extent.maxy = parseInt($(wmc).find('General > BoundingBox').attr('maxy'));
        var map_extent = ol.proj.transformExtent([wmc_extent.minx, wmc_extent.miny, wmc_extent.maxx,
            wmc_extent.maxy], wmc_extent.srs, _projection.getCode());
        var title = $(wmc).find('General > Title').text() ||  $(wmc).attr('id');
        var themeLayers = {};
        var layerRank = 0 ;
        $(wmc).find('LayerList > Layer').each(function() {
            layerRank+=1;
            // we only consider queryable layers
            if ($(this).attr('queryable')=='1') {
                var oLayer = {};
                oLayer.checked = ($(this).attr('hidden')==='0')?true:false;
                oLayer.id = $(this).children('Name').text();
                oLayer.rank = layerRank;
                oLayer.infospanel = "right-panel";
                oLayer.layerid = $(this).children('Name').text();
                oLayer.layername = oLayer.id;
                oLayer.name = $(this).children('Title').text();
                oLayer.title = $(this).children('Title').text();
                oLayer.attribution = $(this).find("attribution").find("Title").text() || "";
                oLayer.metadata = $(this).find('MetadataURL > OnlineResource').attr('xlink:href');
                //fixme
                if (oLayer.metadata && oLayer.metadata.search('geonetwork') > 1) {
                    var mdid = oLayer.metadata.split('#/metadata/')[1];
                    oLayer.metadatacsw = oLayer.metadata.substring(0,oLayer.metadata.search('geonetwork')) +
                        'geonetwork/srv/eng/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetRecordById&elementSetName=full&ID=' +
                        mdid;
                }
                oLayer.style = $(this).find("StyleList  > Style[current='1'] > Name").text();
                oLayer.sld = ($(this).find("StyleList  > Style[current='1'] > SLD > OnlineResource").attr('xlink:href'));
                if (!oLayer.sld && $(this).find("StyleList  > Style > Name").length > 1) {
                    oLayer.styles = $(this).find("StyleList  > Style > Name").map(function (id,name) { return $(name).text(); }).toArray().join(",");
                    oLayer.stylesalias = oLayer.styles;
                }
                oLayer.url = $(this).find('Server > OnlineResource').attr('xlink:href');
                oLayer.queryable = true;
                oLayer.infoformat = 'text/html';
                oLayer.format = $(this).find("FormatList  > Format[current='1']").text();
                oLayer.visiblebydefault = oLayer.checked;
                oLayer.tiled = false;
                oLayer.legendurl = _getlegendurl(oLayer);
                oLayer.opacity = parseFloat($(this).find("opacity").text() || "1");
                var minscale = parseFloat($(this).find("MinScaleDenominator").text());
                var maxscale = parseFloat($(this).find("MaxScaleDenominator").text());
                if (!isNaN(minscale) || !isNaN(maxscale)) {
                    oLayer.scale = {};
                    if (!isNaN(minscale)) {
                        oLayer.scale.min = minscale;
                    }
                    if (!isNaN(maxscale)) {
                        oLayer.scale.max = maxscale;
                    }
                }

                oLayer.theme = wmcid;
                themeLayers[oLayer.id] = oLayer;
                var wms_params = {
                    'LAYERS': oLayer.id,
                    'STYLES':oLayer.style,
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true
                };
                if (oLayer.sld) {
                    wms_params['SLD'] = oLayer.sld;
                }
                var l = new ol.layer.Image({
                    source: new ol.source.ImageWMS({
                        url: oLayer.url,
                        crossOrigin: crossorigin,
                        params: wms_params
                    })
                });

                l.setVisible(oLayer.checked);
                l.setOpacity(oLayer.opacity);
                if (oLayer.scale && oLayer.scale.max) { l.setMaxResolution(_convertScale2Resolution(oLayer.scale.max)); }
                if (oLayer.scale && oLayer.scale.min) { l.setMinResolution(_convertScale2Resolution(oLayer.scale.min)); }
                l.set('name', oLayer.name);
                l.set('mviewerid', oLayer.id);
                themeLayers[oLayer.id].layer = l;
                _overLayers[oLayer.id] = themeLayers[oLayer.id];
                if (oLayer.scale) {
                    _scaledDependantLayers.push(oLayer);
                }
            }

        });
        return {title: title, extent:map_extent, layers:themeLayers};
    };

    var _flash = function (feature, source) {
        var duration = 1000;
        var start = new Date().getTime();
        var listenerKey;

        function animate(event) {
            var vectorContext = event.vectorContext;
            var frameState = event.frameState;
            var flashGeom = feature.getGeometry().clone();
            var elapsed = frameState.time - start;
            var elapsedRatio = elapsed / duration;
            // radius will be 5 at start and 30 at end.
            var radius = ol.easing.easeOut(elapsedRatio) * 25;
            var opacity = ol.easing.easeOut(1 - elapsedRatio);

            var flashStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    snapToPixel: false,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, ' + opacity + ')',
                        width: 3,
                        opacity: opacity
                    })
                })
            });
            vectorContext.setStyle(flashStyle);
            vectorContext.drawGeometry(flashGeom);
            if (elapsed > duration) {
                ol.Observable.unByKey(listenerKey);
                source.removeFeature(feature);
                return;
            }
            // tell OL to continue postcompose animation
            _map.render();
        }
        listenerKey = _map.on('postcompose', animate);
    };

    var _calculateTicksPositions = function (values) {
        var min = values[0];
        var max = values[values.length - 1];
        var interval = max - min;
        var positions = [0];
        for (var i = 1; i < values.length - 1; ++i) {
            var val = values[i];
            var pos = parseInt((val - min)/interval * 100);
            positions.push(pos);
        }
        positions.push(100);
        return positions;
    };

    var _createPseudoTicks = function (values) {
        var ticks = [];
        for (var i = 0; i <= values.length - 1; ++i) {
            ticks.push(i);
        }
        return ticks;
    };

        /**
         * Private Method: _getLonLatZfromGeometry
         *
         */

    var _getLonLatZfromGeometry = function (geometry, proj, maxzoom) {
        var xyz = {};
		var coordinates;
        //For Point or multiPoints with one point
        if ((geometry.getType() === "MultiPoint" && geometry.getPoints().length === 1)) {
            coordinates = geometry.getPoints()[0].flatCoordinates;
            xyz = { lon: coordinates[0],
                    lat: coordinates[1],
                    zoom: maxzoom || 15
            };
        } else if (geometry.getType() === "Point") {
			coordinates = geometry.getFlatCoordinates();
            xyz = { lon: coordinates[0],
                    lat: coordinates[1],
                    zoom: maxzoom || 15
			};

		} else {
            var extent = geometry.getExtent();
            var projExtent = ol.proj.transformExtent(extent, proj, _projection.getCode());
            var resolution = _map.getView().getResolutionForExtent(projExtent, _map.getSize());
            var zoom = parseInt(_map.getView().getZoomForResolution(resolution));
            if (maxzoom && zoom > maxzoom) { zoom = maxzoom; }
            var center = ol.proj.transform(ol.extent.getCenter(extent),proj, 'EPSG:4326');
            xyz = { lon: center[0],
                    lat: center[1],
                    zoom: zoom
            };
        }
        return xyz;
    };

    var _configureTranslate = function (dic) {
        var lang = configuration.getLang();
        var languages = configuration.getLanguages();
        if (languages.length > 1) {
            var langitems = [];
            var showHelp = (configuration.getConfiguration().application.showhelp === "true");
            languages.forEach(function(language) {
                var langStr = "";
                var icon = language;
                var p;
                if (language === "en") {
                    icon = "gb";
                }
                if (langitems.length === 0 && showHelp) {
                    // set no padding for the first item element
                    // help popup only
                    p = 0;
                }
                langitems.push('<li style="padding-left:' + p + '" type="button" class="btn mv-translate""><a href="#" idlang="' + language + '"><span style="margin-right: 5px;" class="flag-icon flag-icon-squared flag-icon-' + icon + '"></span><span>' + language + '</span></a></li>');
            });

            // if help popup only
            if (showHelp) {
                $("#help .modal-body").append('<ul style="padding-left:0">' + langitems.join("") + '</ul>');

            } else {
                // display selector or modal according to device
                $("#lang-button, #lang-selector").addClass("enabled");
                $("#lang-body>ul").append(langitems.join(""));
                $("#lang-selector>ul").append(langitems.join(""));
            }
            $(".mv-translate a").click(function() {
                _changeLanguage($(this).attr("idlang"));
            });
        }

        mviewer.lang = {};
        //load i18n for all languages availables
        Object.entries(dic).forEach(function (l) {
            mviewer.lang[l[0]] = i18n.create({"values": l[1]});
        });
        if (mviewer.lang[lang]) {
            mviewer.tr = mviewer.lang[lang];
            _elementTranslate("body");
            mviewer.lang.lang = lang;
        } else {
             console.log("langue non disponible " + lang);
        }
        mviewer.lang.changeLanguage = _changeLanguage;
    };

    var _initTranslate = function() {
        mviewer.tr = function (s) { return s; };
        if (configuration.getLang()) {
            var extraFile = configuration.getConfiguration().application.langfile;
            var defaultFile = "mviewer.i18n.json";
            if (!extraFile) {
                $.ajax({
                    url: defaultFile,
                    dataType: "json",
                    success: _configureTranslate,
                    error: function () {
                        console.log("Error: can't load JSON lang file!")
                    }
                });
            } else {
                $.when( $.getJSON( defaultFile ), $.getJSON( extraFile ) ).then(
                    function( a, b ) {
                        var globalDic = a[0];
                        var extraDic = b[0];
                        $.extend(true, globalDic, extraDic);
                        _configureTranslate(globalDic);
                    },
                    function () {
                        console.log("Error: can't load all JSON lang files!");
                    }
                );
            }
        }
    };

    /**
     * Translate DOM elements
     * @param element String - tag to identify DOM elements to translate
     */

    var _elementTranslate = function (element) {
        // translate each html elements with i18n as attribute
        var lang = configuration.getLang();
        var htmlType = ["placeholder", "title", "accesskey", "alt", "value", "data-original-title"];
        var _element = $(element);
        _element.find("[i18n]").each((i, el) => {
            let find = false;
            let tr = mviewer.lang[lang]($(el).attr("i18n"));
            htmlType.forEach((att) => {
                if ($(el).attr(att) && tr) {
                    $(el).attr(att, tr);
                    find = true;
                }
            });
            if(!find && $(el).text().indexOf("{{")=== -1) {
                $(el).text(tr);
            }
        });
        var ret = (element === "body")?true:_element[0].outerHTML;
        return ret;
    };

    var _changeLanguage = function(lang) {
        if (typeof mviewer.lang[lang] === "function" ) {
            configuration.setLang(lang);
            mviewer.tr = mviewer.lang[lang];
            _elementTranslate("body");
        } else {
            console.log("langue non disponible " + lang);
        }
    };

    var _renderHTMLFromTemplate = function(tpl, data) {
        var result = Mustache.render(tpl, data);
        var lang = configuration.getLang();
        if ( lang && mviewer.lang && mviewer.lang[lang]) {
            result = _elementTranslate(result);
        }
        return result;
    };

    /*
     * Public
     */

    return {
        flash:  function (proj,x,y) {
            var source, vector;
            var vectorLayer = _getLayerByName("flash");
            if (!vectorLayer) {
                source = new ol.source.Vector({
                    wrapX: false,
                });
                vector = new ol.layer.Vector({
                    source: source,
                    style: mviewer.featureStyles.crossStyle
                });
                vector.set('name', "flash");
                _map.addLayer(vector);
                source.on('addfeature', function(e) {
                    _flash(e.feature, source);
                });
            } else {
                vector = vectorLayer;
                source = vectorLayer.getSource();
            }
            var geom = new ol.geom.Point(ol.proj.transform([x, y],
                proj, _map.getView().getProjection().getCode()));
            var feature = new ol.Feature(geom);
            source.addFeature(feature);
        },

        /**
         * Public Method: setTool
         *
         */

        setTool: function (tool, option) {
            //Deactivate active Tool if new tool is different
            if (mviewer.tools.activeTool && mviewer.tools[mviewer.tools.activeTool]) {
                mviewer.tools[mviewer.tools.activeTool].disable();
            }
            //Activate new tool
            if (mviewer.tools[tool]) {
                mviewer.tools[tool].enable(option);
                mviewer.tools.activeTool = tool;
            }
        },

        /**
         * Public Method: setTool
         *
         */

        unsetTool: function (tool) {
            //Deactivate active Tool
            if (mviewer.tools.activeTool === tool  && mviewer.tools[tool]) {
                mviewer.tools[tool].disable();
            }
            //activate getFeatureInfo
            if (tool !== 'info') {
                mviewer.tools.info.enable();
                mviewer.tools.activeTool = 'info';
            }
        },

        /**
         * Public Method: zoomOut
         *
         */

        zoomOut: function () {
           var v = _map.getView();
           v.animate({zoom: v.getZoom() - 1});
        },

        /**
         * Public Method: zoomIn
         *
         */

        zoomIn: function () {
            var v = _map.getView();
            v.animate({zoom: v.getZoom() + 1});
        },

        /**
         * Public Method: zoomToInitialExtent
         *
         */

        zoomToInitialExtent: function () {
           _map.getView().setCenter(_center);
           _map.getView().setZoom(_zoom);
        },

        /**
         * Public Method: getActiveBaseLayer
         *
         */

        getActiveBaseLayer: function () {
            var result = null;
            for (var i = 0; i < _backgroundLayers.length; i += 1) {
                var l = _backgroundLayers[i];
                if (l.getVisible()) {
                    result = l.get('blid');
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
            if ($(".mini").length ==1 && $(".no-active").length > 0) {
                mviewer.bgtoogle();
                return;
            }
            var nexid = null;
            for (var i = 0; i < _backgroundLayers.length; i += 1) {
                var l = _backgroundLayers[i];
                if (l.get('blid') === baseLayerId) {
                    l.setVisible(true);
                    nexid=(i+1)%_backgroundLayers.length;
                 } else {
                    l.setVisible(false);
                 }
            }
            if (configuration.getConfiguration().baselayers.style === 'default') {
                //get the next thumb
                var thumb = configuration.getConfiguration().baselayers.baselayer[nexid].thumbgallery;
                var title = configuration.getConfiguration().baselayers.baselayer[nexid].label;
                $("#backgroundlayersbtn").css("background-image", 'url("'+thumb+'")');
                if (!configuration.getConfiguration().mobile) {
                    $("#backgroundlayersbtn").attr("title", title);
                    $("#backgroundlayersbtn").tooltip('destroy').tooltip({
                        placement: 'left',
                        trigger: 'hover',
                        html: true,
                        container: 'body',
                        template: mviewer.templates.tooltip
                     });
                }
            }
            $.each(_backgroundLayers, function (id, layer) {
                var opt = configuration.getConfiguration().baselayers.style;
                var elem = (opt === "gallery") ? $('#' + layer.get('blid') + '_btn')
                    .closest('li') : $('#' + layer.get('blid') + '_btn');
                if (layer.getVisible()) {
                    elem.removeClass("no-active");
                    elem.addClass("active");
                } else {
                    elem.removeClass("active");
                    elem.addClass("no-active");
                }
            });
            mviewer.bgtoogle();
        },

        /**
         * Public Method: changeLayerOpacity
         *
         */

        changeLayerOpacity: function (id, value) {
            _overLayers[id].layer.setOpacity(value);
            _overLayers[id].opacity = parseFloat(value);
        },

        /**
         * Public Method: getLayerOpacity
         *
         */

        getLayerOpacity: function (id) {
            return _overLayers[id].layer.getOpacity();
        },

        bgtoogle: function () {
            $("#backgroundlayerstoolbar-gallery .no-active").toggle();
            //$("#backgroundlayerstoolbar-gallery .bglt-btn").toggleClass("mini");
        },

        /**
         * Public Method: getLayerMetadata
         *
         */

        getLayerMetadata: function (id) {
            return {url:_overLayers[id].metadata, csw:_overLayers[id].metadatacsw};
        },

        /**
         * Public Method: toggleOverLayer
         *
         */

        toggleOverLayer: function (id) {
            _overLayers[id].checked = !_overLayers[id].checked;
            if (_overLayers[id].checked) {
                _overLayers[id].layer.setVisible(true);
            } else {
                _overLayers[id].layer.setVisible(false);
            }
        },

        reorderLayer: function (layer, newIndex) {
            var layers = _map.getLayers().getArray();
            var oldIndex = layers.indexOf(layer);
            layers.splice(newIndex, 0, layers.splice(oldIndex, 1)[0]);
            _map.render();

        },

        orderLayer: function (actionMove) {
            if (actionMove.layerRef) {
                var layers = _map.getLayers().getArray();
                var layer = _overLayers[actionMove.layerName];
                var layerRef = _overLayers[actionMove.layerRef];
                var oldIndex = layers.indexOf(layer.layer);
                var refIndex = layers.indexOf(layerRef.layer);
                var newIndex = null;
                if (actionMove.action === "up") {
                    newIndex = refIndex +1;
                } else {
                    newIndex = refIndex -1;
                }
                layers.splice(newIndex, 0, layers.splice(oldIndex, 1)[0]);
                //put overlayFeatureLayer on the top of the map
                if (_overlayFeatureLayer) {
                    _map.removeLayer(_overlayFeatureLayer);
                    _map.getLayers().setAt(_map.getLayers().getArray().length, _overlayFeatureLayer);
                }
                _map.render();
            }
        },
        /**
         * Public Method: openStudio
         */
        openStudio: function() {
            // get xml config file
            var configFile = API.config ? API.config : 'config.xml';
            // get domain url and clean
            var splitStr = window.location.href.split('?')[0].replace('#','').split('/');
            splitStr = splitStr.slice(0,splitStr.length-1).join('/');
            // create absolute config file url
            var url = splitStr + '/' + configFile;
            // send config file to studio
            if(url) {
                window.open(configuration.getConfiguration().application.studio + url, '_blank');
            }
        },

        /**
         * Public Method: setPermalink
         *
         */

        setPermalink: function () {
            var c = _map.getView().getCenter();
            var linkParams = {};
            if (!API.wmc){
                linkParams.x = encodeURIComponent(Math.round(c[0]));
                linkParams.y = encodeURIComponent(Math.round(c[1]));
                linkParams.z = encodeURIComponent(_map.getView().getZoom());
                linkParams.l = encodeURIComponent(_getVisibleOverLayers());
            }
            linkParams.lb = encodeURIComponent(this.getActiveBaseLayer());
            if (API.config) {
                linkParams.config = API.config;
            }
            if (API.lang) {
                linkParams.lang = API.lang;
            }
            if (API.wmc) {
                linkParams.wmc = API.wmc;
            }
            linkParams.mode = $('input[name=mv-display-mode]:checked').val();

            var url = window.location.href.split('?')[0].replace('#','') + '?' + $.param(linkParams);
            $("#permalinklink").attr('href',url).attr("target", "_blank");
            $("#permaqr").attr("src","http://chart.apis.google.com/chart?cht=qr&chs=140x140&chl=" + encodeURIComponent(url));
            return url;
        },

        /**
         * Public Method: getMap
         *
         */

        getMap: function () {
            return _map;
        },

        /**
         * Public Method: init
         *
         */

        init: function () {
                _setVariables();
                _initTranslate();
                _initDisplayMode();
                _initDataList();
                _initVectorOverlay();
                search.init(configuration.getConfiguration());
                _initPanelsPopup();
                _initGeolocation();
                _initTools();
                _initShare();
        },

        customLayers: {},

        customControls: {},

        tools: { activeTool: false},

         /**
         * Public Method: popupPhoto
         *
         */

        popupPhoto: function (src) {
            $("#imagepopup").find("img").attr("src",src);
            $("#imagepopup").modal('show');
        },

        /**
         * Public Method: zoomToLocation
         *
         */

        zoomToLocation: function (x, y, zoom, querymap) {
            if (_sourceOverlay) {
                _sourceOverlay.clear();
            }
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', _projection.getCode());
            _map.getView().setCenter(ptResult);
            _map.getView().setZoom(zoom);
            if (querymap) {
                var i = function () {
                    var e = {
                        coordinate:ptResult,
                        pixel: _map.getPixelFromCoordinate(_map.getView().getCenter())
                    };
                    info.queryMap(e);
                };
                setTimeout(i, 250);
            }
        },



        /**
         * Public Method: showLocation
         *
         */

        showLocation: function (proj,x, y) {
            //marker
            var ptResult = ol.proj.transform([x, y], proj, _projection.getCode());
            _marker.setPosition(ptResult);
            $("#els_marker").show();
            _map.render();
        },

        /**
         * Public Method: print
         *
         */

        print: function () {

        },

        /**
         * Public Method: geoloc
         *
         */

        geoloc: function () {
            if (!$("#geolocbtn").hasClass('enabled')){
              $("#geolocbtn").addClass('enabled');
              _geolocation.setTracking(true);
              _geolocation.once('change', function(evt) {
                _map.getView().setZoom(18);
              });
              geolocON = _geolocation.on('change', function(evt) {
                coordinates = _geolocation.getPosition();
                _map.getView().setCenter(coordinates);
                iconFeature = new ol.Feature({
                  geometry: new ol.geom.Point(coordinates)
                });
                iconFeatureStyle = new ol.style.Style({
                  image: new ol.style.Icon({
                    src: 'img/legend/hiking_custom.png'
                  })
                });
                iconFeature.setStyle(iconFeatureStyle);

                var accuracyFeature = new ol.Feature();
                accuracyFeature.setGeometry(_geolocation.getAccuracyGeometry());
                _sourceGeolocation.clear();
                _sourceGeolocation.addFeature(iconFeature);
                _sourceGeolocation.addFeature(accuracyFeature);
            });
          } else {
            $("#geolocbtn").removeClass('enabled');
            _geolocation.setTracking(false);
            _sourceGeolocation.clear();
          }
        },

        /**
         * Public Method: geoloc
         *
         */

        northRotate: function () {
            //_map.getView().setRotation(0);
            _map.getView().animate({rotation: 0});
        },

        /**
         * Public Method: hideLocation
         *
         */

        hideLocation: function ( ) {
            $("#els_marker").hide();
        },

        /**
         * Public Method: sendToGeorchestra
         *
         */

        sendToGeorchestra: function () {
            console.log("test");
            var params = {
                "services": [],
                "layers" : []
            };
            $.each(_overLayers, function(i, layer) {
                if (layer.layer.getVisible()) {
                    var layername = layer.id;
                    params.layers.push({
                        "layername" : layername,
                        "owstype" : "WMS",
                        "owsurl" : layer.url
                    });
                }
            });
            if (params.layers.length > 0) {
                $("#georchestraFormData").val(JSON.stringify(params));
                $("#georchestraForm").submit();
            }
        },

        /**
         * Public Method: mapShare
         *
         */

        mapShare: function () {
            var myurl = this.setPermalink();
        }, // fin function tools toolbar

        /**
         * Public Method: setLoginInfo
         *
         */

        setLoginInfo: function (ctx) {
            var _layer_id = ctx.id.split('#')[1];
            var _service_url = mviewer.getLayers()[_layer_id].url;
            $("#login-panel-service-url").html("<small><i>" + _service_url + "</i></small>");
            $("#service-url").val(_service_url);
            $("#layer-id").val(_layer_id);
            if(sessionStorage.getItem(_service_url))
                $("#user").val(sessionStorage.getItem(_service_url).split(':')[0]);
        },

        addLayer: function (layer) {
            if (!layer) {
                return;
            }
            if (layer.exclusive) {
                //remove previous exclusive layer if exists
                if (_exclusiveLayer) {
                    var el = $(".mv-layer-details[data-layerid='"+_exclusiveLayer+"']");
                    if (el.length > 0) {
                        mviewer.removeLayer(el);
                    }
                }
                _exclusiveLayer = layer.layerid;
            }
            var classes = ["list-group-item", "mv-layer-details"];
            if (!layer.toplayer) {
                classes.push("draggable");
            } else {
                classes.push("toplayer");
            }

            var view = {
                cls:classes.join(" "),
                layerid: layer.layerid,
                title: layer.title,
                opacity: layer.opacity,
                crossorigin: layer.crossorigin,
                legendurl: layer.legendurl,
                attribution: layer.attribution,
                metadata: layer.metadata,
                tooltipControl: false,
                styleControl: false,
                attributeControl: false,
                timeControl: false
            };

            if (layer.type === 'customlayer' && layer.tooltip) {
                view.tooltipControl = true;
            }
            if (layer.styles && layer.styles.split(",").length > 1 &&
                layer.stylesalias && layer.stylesalias.split(",").length > 1) {
                view.styleControl = true;
                var styles = [];
                layer.styles.split(",").forEach( function (style, i) {
                    styles.push ({"style" : style, "label": layer.stylesalias.split(",")[i]});
                });
                view.styles = styles;
            }

            if (layer.attributefilter && layer.attributevalues != "undefined" && layer.attributefield != "undefined") {
                view.attributeControl = true;
                view.attributeLabel = layer.attributelabel;
                var options = [];
                if (layer.attributefilterenabled === false) {
                    options.push({"label": "Par défaut", "attribute": "all"});
                }
                layer.attributevalues.forEach(function (attribute) {
                    options.push({"label": attribute, "attribute": attribute});
                });
                view.attributes = options;
            }

            if (layer.timefilter) {
                view.timeControl = true;
            }

            if (layer.secure) {
                view.secure = (layer.secure === "true") ? "global" : layer.secure;
                if(layer.secure == "layer")
                    view.secure_layer = true;
            }

            var item = _renderHTMLFromTemplate(mviewer.templates.layerControl, view);
            if (layer.customcontrol && mviewer.customControls[layer.layerid] && mviewer.customControls[layer.layerid].form) {
                item = $(item).find('.mv-custom-controls').append(mviewer.customControls[layer.layerid].form).closest(".mv-layer-details");
            }

            if (_topLayer && $("#layers-container .toplayer").length > 0) {
                $("#layers-container .toplayer").after(item);
            } else {
                $("#layers-container").prepend(item);
            }

            //Dynamic vector Legend
            if (layer.vectorlegend  && mviewer.customLayers[layer.layerid] && mviewer.customLayers[layer.layerid].legend) {
                _drawVectorLegend( layer.layerid, mviewer.customLayers[layer.layerid].legend.items );
            }

			//Dynamic vector Legend
            if (layer.vectorlegend  && layer.legend && layer.legend.items) {
                _drawVectorLegend( layer.layerid, layer.legend.items );
            }

            _setLayerScaleStatus(layer, _calculateScale(_map.getView().getResolution()));
            $("#"+layer.layerid+"-layer-opacity").slider({});
            $("#"+layer.layerid+"-layer-summary").popover({container: 'body', html: true});
            $("#"+layer.layerid+"-layer-summary").attr("data-content",layer.summary);
            if (layer.attributefilterenabled === true) {
                //Activate  CQL for this layer
            }
            //Time Filter
            //Time Filter slider and slider-range
            if (layer.timefilter && (layer.timecontrol === 'slider' || layer.timecontrol === 'slider-range')) {
                var ticks_labels;
                var ticks;
                var slider_options;
                var default_values;
                var onSliderChange;
                if (layer.timevalues) {

                    ticks_labels = layer.timevalues;
                    ticks = _createPseudoTicks(layer.timevalues);
                    if (layer.timecontrol === 'slider') {
                        default_value = parseInt(ticks_labels[ticks_labels.length -1]);
                        $(".mv-time-player-selection[data-layerid='"+layer.layerid+"']").text(default_value);
                    } else if (layer.timecontrol === 'slider-range') {
                        default_value = [0, layer.timevalues.length -1];
                        //Set wms filter to see all data and not only the last
                        var range = [parseInt(layer.timevalues[0]), parseInt(layer.timevalues[layer.timevalues.length -1])];
                        wms_timefilter = range.join("/");
                        mviewer.setLayerTime( layer.layerid, wms_timefilter );
                    }

                    slider_options = {
                        value:default_value,
                        tooltip: 'show',
                        tooltip_position: 'bottom',
                        ticks_labels: ticks_labels,
                        ticks: ticks,
                        step:1,
                        formatter: function(val) {
                            var value;
                            if (Array.isArray(val)) {
                                if (val[0] === val[1]) {
                                    value = parseInt(ticks_labels[val[0]]);
                                } else {
                                    value = [parseInt(ticks_labels[val[0]]), parseInt(ticks_labels[val[1]])];
                                }
                            } else {
                                value = parseInt(ticks_labels[val]);
                            }
                            return value;
                        }
                    };

                    onSliderChange = function (data) {
                        var wms_timefilter;
                        if (Array.isArray(data.value.newValue)) {
                                wms_timefilter = [parseInt(ticks_labels[data.value.newValue[0]]),
                                parseInt(ticks_labels[data.value.newValue[1]])].join("/");
                            } else {
                                wms_timefilter = parseInt(ticks_labels[data.value.newValue]);
                            }
                        mviewer.setLayerTime( layer.layerid, wms_timefilter );
                    };

                } else if (layer.timemin && layer.timemax) {
                    default_value = parseInt(layer.timemax);
                    ticks_labels = [layer.timemin];
                    ticks = [parseInt(layer.timemin)];
                    for (var i = parseInt(layer.timemin)+1; i < parseInt(layer.timemax); i++) {
                        ticks_labels.push('');
                        ticks.push(i);
                    }
                    ticks_labels.push(layer.timemax);
                    ticks.push(parseInt(layer.timemax));

                    slider_options = {
                        min:parseInt(layer.timemin),
                        max:parseInt(layer.timemax),
                        step:1,
                        value:default_value,
                        tooltip: 'show',
                        tooltip_position: 'bottom',
                        ticks_labels: ticks_labels,
                        ticks: ticks
                   };

                    onSliderChange = function ( data ) {
                        mviewer.setLayerTime( layer.layerid, data.value.newValue );
                    };

                }
                //slider && slider-range

                $("#"+layer.layerid+"-layer-timefilter")
                    .addClass("mv-slider-timer")
                    .slider(slider_options);
                $("#"+layer.layerid+"-layer-timefilter").slider().on('change', onSliderChange);
                if (ticks_labels.length > 7) {
                    $("#"+layer.layerid+"-layer-timefilter").closest(".form-group")
                        .find(".slider-tick-label").addClass("mv-time-vertical");
                }

                if (layer.timecontrol === 'slider') {
                    //Activate the time player
                    $('.mv-time-player[data-layerid="'+layer.layerid+'"]').click(function(e) {
                        var ctrl = e.currentTarget;
                        $(ctrl).toggleClass("active");
                        if ($(ctrl).hasClass("active")) {
                            mviewer.playLayerTime($(ctrl).attr("data-layerid"), ctrl);
                        }
                    });


                // slider-range
                } else if (layer.timecontrol === 'slider-range') {
                    $("#"+layer.layerid+"-layer-timefilter").closest(".form-group")
                        .removeClass("form-group-timer").addClass("form-group-timer-range");
                    //Remove time player
                    $('.mv-time-player[data-layerid="'+layer.layerid+'"]').remove();
                } else {
                    //Remove time player
                    $('.mv-time-player[data-layerid="'+layer.layerid+'"]').remove();
                }
            }

            //Time Filter calendar
            if (layer.timefilter && layer.timecontrol === 'calendar') {
                var options = {format: "yyyy-mm-dd", language: "fr", todayHighlight: true, minViewMode: 0,  autoclose: true};
                if (layer.timemin && layer.timemax) {
                    options.startDate = new Date(layer.timemin);
                    options.endDate = new Date(layer.timemax)
                }

                switch (layer.timeinterval) {
                    case "year":
                        options.minViewMode = 2;
                         break;
                    case "month":
                        options.startView = 2,
                        options.minViewMode = 1;
                         break;
                    default:
                        break;
                }
                $("#"+layer.layerid+"-layer-timefilter")
                    .addClass("mv-calendar-timer")
                    .addClass("form-control")
                    .wrap('<div class="input-group date"></div>');

                $("#"+layer.layerid+"-layer-timefilter")

                $("#"+layer.layerid+"-layer-timefilter").closest('div')
                    .append('<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>')
                    .datepicker(options);

                $("#"+layer.layerid+"-layer-timefilter").on('change', function(data,cc){
                        mviewer.setLayerTime( layer.layerid, data.currentTarget.value );
                });

            }
            //End Time filter
            if ($("#layers-container").find("li").length > 1) {
                //set Layer to top on the map
                var actionMove = {
                    layerName: layer.layerid,
                    layerRef: $("#layers-container li[data-layerid='"+layer.layerid+"']").next().attr("data-layerid"),
                    action: "up"};

                mviewer.orderLayer(actionMove);
            }
            var oLayer = _overLayers[layer.layerid];
            oLayer.layer.setVisible(true);
            //Only for second and more loads
            if (oLayer.attributefilter && oLayer.layer.getSource().getParams()['CQL_FILTER']) {
                var activeFilter = oLayer.layer.getSource().getParams()['CQL_FILTER'];
                var activeAttributeValue = activeFilter.split(oLayer.attributeoperator)[1].replace(/\%|'/g, "").trim();
                $("#"+layer.layerid+"-attributes-selector option[value='"+activeAttributeValue+"']").prop("selected", true);
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-attribute span')
                    .text(activeAttributeValue);
            }

            var activeStyle = false;
            if (oLayer.type==='wms' && oLayer.layer.getSource().getParams()['STYLES']) {
                activeStyle = oLayer.layer.getSource().getParams()['STYLES'];
                var refStyle= activeStyle;
                //update legend image if nec.
                var legendUrl = _getlegendurl(layer);
                $("#legend-" + layer.layerid).attr("src", legendUrl);
            }
            if (oLayer.styles ) {
                var selectCtrl = $("#"+layer.layerid+"-styles-selector")[0];
                if (activeStyle) {
                    var selectedStyle = $("#"+layer.layerid+"-styles-selector option[value*='"+activeStyle.split('@')[0]+"']")
                        .prop("selected", true);
                }
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-sld span')
                    .text(selectCtrl.options[selectCtrl.selectedIndex].label);
            } else {
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-sld').remove();
            }

            if (!oLayer.attributefilter) {
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-attribute').remove();
            }
            if (!oLayer.attributefilter && !oLayer.styles) {
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle').remove();
            }

            var li = $(".mv-nav-item[data-layerid='"+layer.layerid+"']");
            li.find("a span").removeClass("mv-unchecked").addClass("mv-checked");
            li.find("input").val(true);
            // activate custom controls
            if (layer.customcontrol && mviewer.customControls[layer.layerid]) {
                mviewer.customControls[layer.layerid].init();
            }
            if (layer.type === 'customlayer' && layer.tooltip && layer.tooltipenabled) {
                info.toggleTooltipLayer($('.layer-tooltip[data-layerid="'+layer.layerid+'"]')[0]);
            }
            if (layer.expanded) {
                this.toggleLayerOptions($('.mv-layer-details[data-layerid="'+layer.layerid+'"]')[0]);
            }
            $("#legend").removeClass("empty");
            if (configuration.getConfiguration().application.togglealllayersfromtheme === "true") {
                var newStatus = _getThemeStatus(layer.theme);
                _setThemeStatus(layer.theme, newStatus);
            }
        },
        removeLayer: function (el) {
            var item;
            if ( !$(el).is( "li" ) ) {
                item = $(el).closest("li");
            } else {
                item = $(el);
            }
            var layerid = item.attr("data-layerid");
            var layer = _overLayers[layerid];
            item.remove();
            layer.layer.setVisible(false);
            var li = $(".mv-nav-item[data-layerid='"+layerid+"']");
            li.find("a span").removeClass("mv-checked").addClass("mv-unchecked");
            li.find("input").val(false);
            // deactivate custom controls
            if (layer.customcontrol && mviewer.customControls[layer.layerid]) {
                mviewer.customControls[layer.layerid].destroy();
            }
            //Remove Layer infos in info panels
            mviewer.removeLayerInfo(layer.layerid);
            //check if layers-container is empty
            if ($("#layers-container .list-group-item").length === 0) {
                $("#legend").addClass("empty");
            }
            if (configuration.getConfiguration().application.togglealllayersfromtheme === "true") {
                var newStatus = _getThemeStatus(layer.theme);
                _setThemeStatus(layer.theme, newStatus);
            }
        },
        removeAllLayers: function () {
            $("#layers-container .list-group-item").each( function (id, item) {
                mviewer.removeLayer(item);
            });
        },
        toggleLayer: function (el) {
            var li = $(el).closest("li");
            if ( li.find("input").val() === 'false' ) {
                mviewer.addLayer(_overLayers[$(li).data("layerid")]);
            } else {
                var el = $(".mv-layer-details[data-layerid='"+li.data("layerid")+"']")
                mviewer.removeLayer(el);
            }
        },
        toggleMenu: function (transition) {
            if (transition) {
                $( "#wrapper, #sidebar-wrapper, #page-content-wrapper").removeClass("notransition");
            } else {
                $( "#wrapper, #sidebar-wrapper, #page-content-wrapper").addClass("notransition");
            }
            $("#wrapper").toggleClass("toggled-2");
            $("#menu-toggle-2,.menu-toggle").toggleClass("closed");
            $('#menu ul').hide();
        },

        toggleLegend: function () {
            $("#legend").toggleClass("active");
        },
        toggleParameter: function (li) {
            var span = $(li).find("span");
            var parameter = false;
            if (span.hasClass('mv-unchecked') === true ) {
                span.removeClass('mv-unchecked').addClass('mv-checked');
                parameter = true;
            } else {
                span.removeClass('mv-checked').addClass('mv-unchecked');
            }
            switch (li.id) {
                case "param_search_bbox":
                    _searchparams.bbox = parameter;
                    break;
                case "param_search_localities":
                    _searchparams.localities = parameter;
                    break;
                case "param_search_features":
                    _searchparams.features = parameter;
                    break;
            }

        },
        toggleLayerOptions: function (el) {
            $(el).closest("li").find(".mv-layer-options").slideToggle();
            //hack slider js
            $(el).closest("li").find(".mv-slider-timer").slider('relayout');
            if ($(el).find("span.state-icon").hasClass("glyphicon glyphicon-chevron-down")) {
                $(el).find("span.state-icon").removeClass("glyphicon glyphicon-chevron-down").addClass("glyphicon glyphicon-chevron-up");
            } else {
                $(el).find("span.state-icon").removeClass("glyphicon glyphicon-chevron-up").addClass("glyphicon glyphicon-chevron-down");
            }
        },

        setLayerStyle: function (layerid, style, selectCtrl) {
            var _layerDefinition = _overLayers[layerid];
            var styleRef = style;
            var _source = _layerDefinition.layer.getSource();
            if (_layerDefinition.attributefilter && _layerDefinition.attributestylesync) {
            //Récupère la valeur active de la liste déroulante
                //var attributeValue = $("#"+ layerid + "-attributes-selector").val();
                var attributeValue = 'all';
                var styleBase = style.split('@')[0];
                if (_source.getParams().CQL_FILTER) {
                    attributeValue = _source.getParams().CQL_FILTER.split(" " + _layerDefinition.attributeoperator + " ")[1].replace(/\'/g, "");
                }
                if ( attributeValue != 'all' ) {
                    style = [styleBase, '@', attributeValue.toLowerCase().sansAccent()].join("");
                }
            }
            if (_layerDefinition.sld) {
                if (!/.(sld|SLD)$/.test(style)) {
                    style += ".sld";
                }
                _source.getParams()['SLD'] = style;
                _layerDefinition.sld = style;
            } else {
                _source.getParams()['STYLES'] = style;
                _layerDefinition.style = style;
            }
            _source.updateParams({"dc": new Date().valueOf()});
            _source.changed();
            var styleLabel = $(selectCtrl).find("option[value='"+styleBase+"'], option[value='"+styleRef+"']").attr("label");
            $('.mv-layer-details[data-layerid="'+layerid+'"] .layerdisplay-subtitle .selected-sld span').text(styleLabel);
            var legendUrl = _getlegendurl(_layerDefinition);
            $("#legend-" + layerid).fadeOut( "slow", function() {
                // Animation complete
                 $("#legend-" + layerid).attr("src", legendUrl).fadeIn();
            });
            $('.mv-nav-item[data-layerid="'+layerid+'"]').attr("data-legendurl",legendUrl).data("legendurl",legendUrl);

        },

        makeCQL_Filter: function (fld,operator,value) {
            var cql_filter = "";
            if (operator == "=") {
                    cql_filter = fld + " = " + "'" + value.replace("'","''") + "'";
                } else if (operator == "like") {
                    cql_filter = fld + " like " + "'%" + value.replace("'","''") + "%'";
                }
            return cql_filter;
        },

        setLayerAttribute: function (layerid, attributeValue, selectCtrl) {
            var _layerDefinition = _overLayers[layerid];
            var _source = _layerDefinition.layer.getSource();
            if ( attributeValue === 'all' ) {
                delete _source.getParams()['CQL_FILTER'];
            } else {
                var cql_filter = this.makeCQL_Filter(_layerDefinition.attributefield, _layerDefinition.attributeoperator,
                    attributeValue);
                _source.getParams()['CQL_FILTER'] = cql_filter;
            }
            if (_layerDefinition.attributestylesync) {
                //need update legend ad style applied to the layer
                var currentStyle;
                var newStyle;
                if (_layerDefinition.sld) {
                    currentStyle =  _layerDefinition.sld;
                } else {
                    currentStyle =  _layerDefinition.style;
                }
                //Respect this convention in sld naming : stylename@attribute eg style1@departement plus no accent no Capitale.
                if (attributeValue != 'all') {
                    newStyle = [currentStyle.split("@")[0], "@", attributeValue.sansAccent().toLowerCase()].join("");
                } else {
                    newStyle = currentStyle.split("@")[0];
                }
                if (_layerDefinition.sld) {
                    newStyle += ".sld";
                    _source.getParams()['SLD'] = newStyle;
                    _layerDefinition.sld = newStyle;
                } else {
                    _source.getParams()['STYLES'] = newStyle;
                    _layerDefinition.style = newStyle;
                }
                var legendUrl = _getlegendurl(_layerDefinition);
                $("#legend-" + layerid).fadeOut( "slow", function() {
                    // Animation complete
                    $("#legend-" + layerid).attr("src", legendUrl).fadeIn();
                });
                $('.mv-nav-item[data-layerid="'+layerid+'"]').attr("data-legendurl",legendUrl).data("legendurl",legendUrl);
            }
            _source.updateParams({"dc": new Date().valueOf()});
            _source.changed();
            $('.mv-layer-details[data-layerid="'+layerid+'"] .layerdisplay-subtitle .selected-attribute span')
                .text(selectCtrl.options[selectCtrl.selectedIndex].label);
        },

        setLayerTime: function (layerid, filter_time) {
            //Fix me
            var str = filter_time.toString();
            var test = str.length;
            switch (test) {

                case 6:
                    filter_time = str.substr(0,4) + '-' + str.substr(4,2);
                    break;
                case 8:
                    filter_time = str.substr(0,4) + '-' + str.substr(4,2) +  '-' + str.substr(6,2);
                    break;
                default:
                    filter_time = filter_time;
            }
            var _layerDefinition = _overLayers[layerid];
            var _source = _layerDefinition.layer.getSource();
            _source.getParams()['TIME'] = filter_time;
            $(".mv-time-player-selection[data-layerid='"+layerid+"']").text('Patientez...');
            var key = _source.on('imageloadend', function() {
                ol.Observable.unByKey(key);
                $(".mv-time-player-selection[data-layerid='"+layerid+"']").text(filter_time);
            });
            _source.changed();

            if (_source.hasOwnProperty("tileClass")) {
                _source.updateParams({'ol3_salt': Math.random()});
            }
        },

        playLayerTime: function (layerid, ctrl) {
            var t = $("#"+layerid+"-layer-timefilter");
            var timevalues = _overLayers[layerid].timevalues;
            var animation;
            t.slider({tooltip:'always'}).slider('refresh');

            function play() {
                if ($(ctrl).hasClass("active") && $("#"+layerid+"-layer-timefilter").length > 0) {
                    var nextvalue = (t.slider('getValue')+1)%timevalues.length;
                    t.slider('setValue', nextvalue, true, true);
                } else {
                    t.slider({tooltip:'show'}).slider('refresh');
                    clearInterval(animation);
                }
            }
            animation = setInterval(play, 2000);
        },

        setInfoPanelTitle: function (el, panel) {
            var title = $(el).attr("data-original-title");
            $("#"+panel +" .mv-header h5").text(title);
        },

        nextBackgroundLayer: function () {
            //Get activeLayer
            var id = 0;
            for (var i = 0; i < _backgroundLayers.length; i += 1) {
                var l = _backgroundLayers[i];
                if (l.getVisible()) {
                    id=i;
                    break;
                }
            }
            var nexid=(id+1)%_backgroundLayers.length;
            var i, ii;
            for (i = 0, ii = _backgroundLayers.length; i < ii; ++i) {
                _backgroundLayers[i].set('visible', (i == nexid));
            }
            nexid=(nexid+1)%_backgroundLayers.length;
            //get the next thumb
            var thumb = configuration.getConfiguration().baselayers.baselayer[nexid].thumbgallery;
            var title = configuration.getConfiguration().baselayers.baselayer[nexid].label;
            $("#backgroundlayersbtn").css("background-image", 'url("'+thumb+'")');
            if (!configuration.getConfiguration().mobile) {
                $("#backgroundlayersbtn").attr("data-original-title", title);
                $("#backgroundlayersbtn").tooltip('hide').tooltip({
                    placement: 'top',
                    trigger: 'hover',
                    html: true,
                    container: 'body',
                    template: mviewer.templates.tooltip
                });
            }
        },

        /**
         * Public Method: getLayer
         *
         */

        getLayer: function (idlayer) {
            return _overLayers[idlayer];
        },

        removeLayerInfo: function (layerid) {
            var tab = $('.nav-tabs li[data-layerid="'+layerid+'"]');
            var panel = tab.closest(".popup-content").parent();
            var tabs = tab.parent().find("li");
            var info = $(tab.find("a").attr("href"));

            if ( tabs.length === 1 ) {
                tab.remove();
                info.remove();
                if (panel.hasClass("active")) {
                    panel.toggleClass("active");
                }
                $("#els_marker").hide();
            } else {
                if ( tab.hasClass("active") ) {
                    //Activation de l'item suivant
                    var _next_tab = tab.next();
                    _next_tab.find("a").click();
                    tab.remove();
                    info.remove();
                } else {
                    tab.remove();
                    info.remove();
                }
            }

        },

        alert: function (msg, cls) {
            _message(msg, cls);
        },

        legendSize: function (img) {
            if (img.width > 250) {
                //$(img).addClass("big-legend");
                $(img).closest("div").addClass("big-legend");
                $(img).parent().append('<span onclick="mviewer.popupPhoto(' +
                    'this.parentElement.getElementsByTagName(\'img\')[0].src)" ' +
                    'class="text-big-legend"><span><span class="glyphicon glyphicon-resize-full" aria-hidden="true">' +
                    '</span> Agrandir la légende</span></span>');
            }
        },

        toggleAllThemeLayers: function (e) {
            e.preventDefault;
            var themeid = $(e.currentTarget).closest("li").attr("id").split("theme-layers-")[1];
            var theme = _themes[themeid];
            var status = _getThemeStatus(themeid);
            var visibility = false;
            if (status.status !== "full") {
                visibility = true;
            }
            if (visibility) {
                if (theme.groups) {
                    $.each( theme.groups, function( key, group ) {
                        $.each( group.layers, function( key, layer ) {
                            if (!layer.layer.getVisible()) {
                                mviewer.addLayer(layer);
                            }
                        });
                    });
                } else {
                    $.each( theme.layers, function( key, layer ) {
                        if (!layer.layer.getVisible()) {
                            mviewer.addLayer(layer);
                        }
                    });
                }
            } else {
                if (theme.groups) {
                    $.each( theme.groups, function( key, group ) {
                        $.each( group.layers, function( key, layer ) {
                            if (layer.layer.getVisible()) {
                                mviewer.removeLayer($(".mv-layer-details[data-layerid='"+key+"']"));
                            }
                        });
                    });
                } else {
                    $.each( theme.layers, function( key, layer ) {
                        if (layer.layer.getVisible()) {
                            mviewer.removeLayer($(".mv-layer-details[data-layerid='"+key+"']"));
                        }
                    });
                }
            }
            _setThemeStatus(themeid);
            e.stopPropagation();
        },

        getLayers: function () {
            return _overLayers;
        },

        getLonLatZfromGeometry: _getLonLatZfromGeometry,

        ajaxURL : _ajaxURL,

        parseWMCResponse: _parseWMCResponse,

        deleteLayer: _deleteLayer,

        processLayer: _processLayer,

        initMap: _initMap,

        getLegendUrl: _getlegendurl,

        getProjection: function () { return _projection; },

        getSourceOverlay: function () { return _sourceOverlay; },

        setTopLayer: function (layer) { _topLayer = layer; },

        createBaseLayer: _createBaseLayer,

        drawVectorLegend: _drawVectorLegend,

        overLayersReady: _overLayersReady,

        renderHTMLFromTemplate : _renderHTMLFromTemplate,

        events: function () { return _events; }


    }; // fin return

})();
