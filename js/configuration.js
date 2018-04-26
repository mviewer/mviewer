var configuration = (function () {

    /**
     * Property: _options
     * XML. The application configuration
     */
    /* INTERNAL */
    var _configuration = null;

    var _showhelp_startup = false;

    var _defaultBaseLayer = "";

    var _captureCoordinates = false;

    /**
     * Property: _crossorigin
     * The crossOrigin attribute for loaded images. Note that you must provide a crossOrigin value
     * if you want to access pixel data with the Canvas renderer for export png for example.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
     */

    var _crossorigin = null;

     /**
     * Property: _authentification
     * Its possible behind georchestra security-proxy.
     * allows working with protected layers
     */

    var _authentification = {enabled:false};

    /* EXTERNAL */

    /**
     * Property: _themes
     * {object} hash of all overlay Layers (for each sub theme) - static.
     * from mviewer.js
     */

    var _themes = null;

     /**
     * Property: _proxy
     * Ajax proxy to use for crossdomain requests
     * It could be georchestra security-proxy
     */

    var _proxy = "";

    var _parseXML = function (xml) {
        var _conf = $.xml2json(xml);
        // transtype baselayer, theme, group, layer
        //those types should be array
        //if type is object, push it into new Array
        if (!Array.isArray(_conf.baselayers.baselayer)) {
            _conf.baselayers.baselayer = [_conf.baselayers.baselayer];
        }
        _conf.baselayers = _conf.baselayers;
        if (!Array.isArray(_conf.themes.theme)) {
            _conf.themes.theme = [_conf.themes.theme];
        }
        _conf.themes.theme.forEach(function (theme) {
            if (theme.group) {
                if (!Array.isArray(theme.group)) {
                    theme.group = [theme.group];
                }
            } else {
                theme.group = [];
            }
            theme.group.forEach(function (group) {
                if (!Array.isArray(group.layer)) {
                    group.layer = [group.layer];
                }
            });
            if (theme.layer) {
                if (!Array.isArray(theme.layer)) {
                    theme.layer = [theme.layer];
                }
            }
        });

        return _conf;
    };

    var _load = function (conf) {
        _configuration = conf;
        utils.testConfiguration2(conf);
        //apply application customization
        if (conf.application.title) {
            document.title = conf.application.title;
            $(".mv-title").text(conf.application.title);
        }
        if (conf.application.stats === "true" && conf.application.statsurl) {
            $.get(conf.application.statsurl +"?app=" + document.title);
        }
        if (conf.application.logo) {
            $(".mv-logo").attr("src", conf.application.logo);
        }
        if (conf.application.showhelp === "true" ) {
            _showhelp_startup = true;
        }
        if (conf.application.coordinates === "true" ) {
            _captureCoordinates = true;
        }
        if (conf.application.togglealllayersfromtheme === "true" ) {
            _toggleAllLayersFromTheme = true;
        }
        if (conf.application.exportpng === "true" ) {
            _crossorigin = "anonymous";
            $("#exportpng").show();
        } else {
             $("#exportpng").remove();
        }
        if ((!conf.application.mouseposition) || (conf.application.mouseposition ==="false")){
            $("#mouse-position").hide();
        }
        if (!conf.application.geoloc || !conf.application.geoloc ==="true") {
             $("#geolocbtn").hide();
        }

        //map options
        _map = mviewer.initMap(conf.mapoptions);

        //Get  x, y & z url parameters if exists
        if (config.x && config.y && config.z) {
            _center =   [parseFloat(config.x), parseFloat(config.y)];
            _zoom = parseInt(config.z);
        }

        if (conf.proxy && conf.proxy.url) {
            _proxy = conf.proxy.url;
        }
        if (conf.authentification && conf.authentification.enabled) {
            _authentification.enabled = (conf.authentification.enabled === "true"?true:false);
        }
        if (_authentification.enabled) {
            _authentification.url = conf.authentification.url;
            _authentification.loginurl = conf.authentification.loginurl;
            _authentification.logouturl = conf.authentification.logouturl;
            $.ajax({
                url: _authentification.url, success: function (response) {
                    //test georchestra proxy
                    if(response.proxy == "true") {
                        $("#login").show();
                        if (response.user !="") {
                            $("#login").attr("href",_authentification.logouturl);
                            $("#login").attr("title","Se déconnecter");
                            console.log("Bonjour " + response.user);
                        } else {
                            var url="";
                            if (location.search=="") {
                                url=_authentification.loginurl;
                            } else {
                                url=location.href  + _authentification.loginurl.replace("?","&");
                            }
                            $("#login").attr("href",url);
                        }
                    } else {
                        console.log(["mviewer n'a pas détecté la présence du security-proxy georChestra.",
                            "L'accès aux couches protégées et à l'authentification n'est donc pas possible"].join("\n"));
                    }
                }
            });
        }


        //baselayertoolbar
        var baselayerControlStyle = conf.baselayers.style;
        if (baselayerControlStyle === "gallery") {
            $("#backgroundlayerstoolbar-default").remove();
        } else {
            $("#backgroundlayerstoolbar-gallery").remove();
        }
        conf.baselayers.baselayer.forEach(function (bl) {
            if (bl.visible === "true") {
                _defaultBaseLayer = bl.id;
            }
            mviewer.createBaseLayer(bl);
            if (baselayerControlStyle === "gallery") {
                $("#basemapslist").append(Mustache.render(mviewer.templates.backgroundLayerControlGallery, bl));
            }
        });
        if (baselayerControlStyle === "gallery") {
            $("#basemapslist li").tooltip({
                placement: 'left',
                trigger: 'hover',
                html: true,
                container: 'body',
                template: mviewer.templates.tooltip
            });
        }

        _themes = {};
        var themeLayers = {};
        if (config.wmc) {
            var reg=new RegExp("[,]+", "g");
            var wmcs=config.wmc.split(reg);
            for (var i=0; i<wmcs.length; i++) {
                (function(key) {
                    var wmcid = "wmc"+key ;
                    $.ajax({
                        url: mviewer.ajaxURL(wmcs[key]),
                        dataType: "xml",
                        success: function (xml) {
                            var wmc = mviewer.parseWMCResponse(xml, wmcid);
                            _themes[wmcid] = {};
                            _themes[wmcid].collapsed = false;
                            _themes[wmcid].id = wmcid;
                            _themes[wmcid].layers = {};
                            _themes[wmcid].icon = "chevron-circle-right";
                            console.log ("adding "+wmc.title+" category");
                            _map.getView().fit(wmc.extent, { size: _map.getSize(),
                                padding: [0, $("#sidebar-wrapper").width(), 0, 0]});
                            _themes[wmcid].layers = wmc.layers;
                            _themes[wmcid].name = wmc.title;
                            mviewer.initDataList();
                            mviewer.showCheckedLayers();
                        }
                    });
                })(i);
            }
        } else {
            var themes = conf.themes.theme;
            var layerRank = 0;
            var doublons = {};
            conf.themes.theme.reverse().forEach(function(theme) {
                var themeid = theme.id;
                var icon = "fa-lg fa-" + (theme.icon || "globe");
                _themes[themeid] = {};
                _themes[themeid].id = themeid;
                _themes[themeid].icon = icon;
                _themes[themeid].name = theme.name;
                _themes[themeid].groups = false;
                // test group
                if (theme.group.length > 0) {
                    _themes[themeid].groups = {};
                    theme.group.forEach(function (group) {
                        _themes[themeid].groups[group.id] = {name: group.name, layers: {}};
                    });
                }
                _themes[themeid].layers = {};
                var layersXml = $(this).find('layer');
                var layers = [];
                if (theme.layer) {
                    layers = theme.layer;
                }
                if (theme.group.length > 0 ) {
                    theme.group.forEach(function (group) {
                        if (group.layer) {
                            group.layer.forEach(function(layer) {
                                layer.group = group.id;
                            });
                            layers = layers.concat(group.layer);
                        }
                    });
                }
                layers.reverse().forEach( function (layer) {
                    layerRank+=1;
                    var layerId = layer.id;
                    var secureLayer = (layer.secure === "true") ? true : false;
                    if (secureLayer) {
                        $.ajax({
                            dataType: "xml",
                            layer: layerId,
                            url:  mviewer.ajaxURL(layer.url + "?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0"),
                            success: function (result) {
                                //Find layer in capabilities
                                var name = this.layer;
                                var layer = $(result).find('Layer>Name').filter(function() {
                                    return $(this).text() == name;
                                });
                                if (layer.length === 0) {
                                    //remove this layer from map and panel
                                    mviewer.deleteLayer(this.layer);
                                }
                            }
                        });
                    }
                    var mvid;
                    var oLayer = {};
                    var clean_ident = layerId.replace(/:|,| |\./g,'');
                    var _overLayers = mviewer.getLayers();
                    if (_overLayers[clean_ident] ) {
                        doublons[clean_ident] += 1;
                        mvid = clean_ident + "dbl"+doublons[clean_ident];
                    } else {
                        mvid = clean_ident;
                        doublons[clean_ident] = 0;
                    }
                    oLayer.id = mvid;
                    oLayer.icon = icon;
                    oLayer.layername = layerId;
                    oLayer.type = layer.type || "wms";
                    oLayer.theme = themeid;
                    oLayer.rank = layerRank;
                    oLayer.name = layer.name;
                    oLayer.title = layer.name;
                    oLayer.layerid = mvid;
                    oLayer.infospanel = layer.infopanel ||'right-panel';
                    oLayer.featurecount = layer.featurecount;
                    //styles
                    if (layer.style && layer.style !== "") {
                        var styles = layer.style.split(",");
                        oLayer.style = styles[0];
                        if (styles.length > 1) {
                            oLayer.styles = styles.toString();
                        }
                    } else {
                       oLayer.style="";
                    }
                    if (layer.stylesalias && layer.stylesalias !== "") {
                        oLayer.stylesalias = layer.stylesalias;
                    } else {
                        if (oLayer.styles) {
                            oLayer.stylesalias = oLayer.styles;
                        }
                    }
                    oLayer.toplayer =  (layer.toplayer === "true") ? true : false;
                    oLayer.draggable = true;
                    if (oLayer.toplayer) {
                        mviewer.setTopLayer(oLayer.id);
                        oLayer.draggable = false;
                    }
                    oLayer.sld = layer.sld || null;
                    oLayer.filter = layer.filter;
                    oLayer.opacity = parseFloat(layer.opacity || "1");
                    oLayer.tooltip =  (layer.tooltip === "true") ? true : false;
                    oLayer.tooltipenabled =  (layer.tooltipenabled === "true") ? true : false;
                    oLayer.tooltipcontent = layer.tooltipcontent ? layer.tooltipcontent : '';
                    oLayer.expanded =  (layer.expanded === "true") ? true : false;
                    oLayer.timefilter =  (layer.timefilter) &&
                        (layer.timefilter === "true") ? true : false;
                    if (oLayer.timefilter && layer.timeinterval) {
                        oLayer.timeinterval = layer.timeinterval || "day";
                    }
                    oLayer.timecontrol = layer.timecontrol || "calendar";
                    if (layer.timevalues && layer.timevalues.search(",")) {
                        oLayer.timevalues = layer.timevalues.split(",");
                    }
                    oLayer.timemin = layer.timemin || new Date().getFullYear() -5;
                    oLayer.timemax = layer.timemax || new Date().getFullYear();

                    oLayer.attributefilter =  (layer.attributefilter &&
                        layer.attributefilter === "true") ? true : false;
                    oLayer.attributefield = layer.attributefield;
                    oLayer.attributelabel = layer.attributelabel || "Attributs";
                    if (layer.attributevalues && layer.attributevalues.search(",")) {
                        oLayer.attributevalues = layer.attributevalues.split(",");
                    }
                    oLayer.attributestylesync =  (layer.attributestylesync &&
                        layer.attributestylesync === "true") ? true : false;
                    oLayer.attributefilterenabled =  (layer.attributefilterenabled &&
                        layer.attributefilterenabled === "true") ? true : false;
                    if (oLayer.attributestylesync && oLayer.attributefilterenabled && oLayer.attributevalues) {
                        oLayer.style = [oLayer.style.split('@')[0], '@',
                        oLayer.attributevalues[0].sansAccent().toLowerCase()].join("");
                    }
                    oLayer.customcontrol = (layer.customcontrol === "true") ? true : false;
                    oLayer.customcontrolpath = layer.customcontrolpath || "customcontrols";
                    oLayer.attribution = layer.attribution;
                    oLayer.metadata = layer.metadata;
                    oLayer.metadatacsw = layer["metadata_csw"];
                    if (oLayer.metadata) {
                        oLayer.summary = '<a href="'+oLayer.metadata+'" target="_blank">En savoir plus</a>';
                    }
                    oLayer.url = layer.url;
                    //Mustache template
                    if (layer.template && layer.template.url) {
                        $.get(layer.template.url, function(template) {
                            oLayer.template = template;
                        });
                    } else if (layer.template) {
                        oLayer.template = layer.template;
                    } else {
                        oLayer.template = false;
                    }
                    oLayer.queryable = (layer.queryable === "true") ? true : false;
                    oLayer.searchable = (layer.searchable === "true") ? true : false;
                    if (oLayer.searchable) {
                        oLayer = search.configSearchableLayer(oLayer, layer);
                    }
                    oLayer.infoformat = layer.infoformat;
                    oLayer.checked = (layer.visible === "true") ? true : false;
                    oLayer.visiblebydefault = (oLayer.checked) ? true : false;
                    oLayer.tiled = (layer.tiled === "true") ? true : false;
                    oLayer.dynamiclegend = (layer.dynamiclegend === "true") ? true : false;
                    oLayer.legendurl=(layer.legendurl)? layer.legendurl : mviewer.getLegendUrl(oLayer);
                    if (oLayer.legendurl === "false") {oLayer.legendurl = "";}
                    oLayer.useproxy = (layer.useproxy === "true") ? true : false;
                    if (layer.fields) {
                        oLayer.fields = layer.fields.split(",");
                        if (layer.aliases) {
                            oLayer.aliases = layer.aliases.split(",");
                        } else {
                            oLayer.aliases = layer.fields.split(",");
                        }
                    }

                    if (layer.scalemin || layer.scalemax) {
                        oLayer.scale = {};
                        if (layer.scalemin) {
                            oLayer.scale.min = parseInt(layer.scalemin);
                        }
                        if (layer.scalemax) {
                            oLayer.scale.max = parseInt(layer.scalemax);
                        }
                    }
                    if (oLayer.customcontrol) {
                        var customcontrolpath = oLayer.customcontrolpath;
                        $.ajax({
                            url: customcontrolpath + '/' + oLayer.id +'.js',
                            layer: oLayer.id,
                            dataType: "script",
                            success : function (customLayer, textStatus, request) {
                                $.ajax({
                                    url: customcontrolpath +'/'  +this.layer +'.html',
                                    layer: oLayer.id,
                                    dataType: "text",
                                    success: function (html) {
                                        mviewer.customControls[this.layer].form = html;
                                        if ($('.mv-layer-details[data-layerid="'+this.layer+'"]').length === 1) {
                                            //append the existing mv-layers-details panel
                                            $('.mv-layer-details[data-layerid="'+this.layer+'"]')
                                                .find('.mv-custom-controls').append(html);
                                            mviewer.customControls[this.layer].init();
                                        }
                                    }
                                });
                            },
                            error: function () {
                                alert( "error customControl" );
                            }
                        });
                    }

                    themeLayers[oLayer.id] = oLayer;
                    var l= null;
                    if (oLayer.type === 'wms') {
                        var wms_params = {
                            'LAYERS': layer.id,
                            'STYLES':(themeLayers[oLayer.id].style)? themeLayers[oLayer.id].style : '',
                            'FORMAT': 'image/png',
                            'TRANSPARENT': true
                        };
                        var source;
                        if (oLayer.filter) {
                            wms_params['CQL_FILTER'] = oLayer.filter;
                        }
                        if (oLayer.attributefilter && oLayer.attributefilterenabled &&
                            oLayer.attributevalues.length > 1) {
                            wms_params['CQL_FILTER'] = oLayer.attributefield + "='" + oLayer.attributevalues[0] + "'";
                        }
                        if (oLayer.sld) {
                            wms_params['SLD'] = oLayer.sld;
                        }
                        switch (oLayer.tiled) {
                            case true:
                                wms_params['TILED'] = true;
                                source = new ol.source.TileWMS({
                                    url: layer.url,
                                    crossOrigin: _crossorigin,
                                    tileLoadFunction: function (imageTile, src) {
                                        if (oLayer.useproxy) {
                                            src = _proxy + encodeURIComponent(src);
                                        }
                                        imageTile.getImage().src = src;
                                    },
                                    params: wms_params
                                });
                                l = new ol.layer.Tile({
                                    source: source
                                });
                                break;
                            case false:
                                source = new ol.source.ImageWMS({
                                    url: layer.url,
                                    crossOrigin: _crossorigin,
                                    imageLoadFunction: function (imageTile, src) {
                                        if (oLayer.useproxy) {
                                            src = _proxy + encodeURIComponent(src);
                                        }
                                        imageTile.getImage().src = src;
                                    }, params: wms_params
                                });
                                l = new ol.layer.Image({
                                    source:source
                                });
                                break;
                        }
                        source.set('layerid', oLayer.layerid);
                        source.on('imageloadstart', function(event) {
                            $("#loading-" + event.target.get('layerid')).show();
                        });

                        source.on('imageloadend', function(event) {
                            $("#loading-" + event.target.get('layerid')).hide();
                        });

                        source.on('imageloaderror', function(event) {
                            $("#loading-" + event.target.get('layerid')).hide();
                        });
                        source.on('tileloadstart', function(event) {
                            $("#loading-" + event.target.get('layerid')).show();
                        });

                        source.on('tileloadend', function(event) {
                            $("#loading-" + event.target.get('layerid')).hide();
                        });

                        source.on('tileloaderror', function(event) {
                            $("#loading-" + event.target.get('layerid')).hide();
                        });
                       mviewer.processLayer(oLayer, l);
                    } //end wms
                    if (oLayer.type === 'geojson') {
                        l = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                url: layer.url,
                                format: new ol.format.GeoJSON()
                            })
                        });
                        if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                            l.setStyle(mviewer.featureStyles[oLayer.style]);
                        }
                        //mviewer.getVectorLayers().push(l);
                        mviewer.processLayer(oLayer, l);
                    }// end geojson

                    if (oLayer.type === 'kml') {
                        l = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                url: layer.url,
                                format: new ol.format.KML()
                            })
                        });
                        //mviewer.getVectorLayers().push(l);
                        mviewer.processLayer(oLayer, l);
                    }// end kml

                    if (oLayer.type === 'customlayer') {
                        var hook_url = 'customLayers/' + oLayer.id + '.js';
                        if (oLayer.url && oLayer.url.slice(-3)==='.js') {
                            hook_url = oLayer.url;
                        }
                        $.ajax({
                            url: hook_url,
                            dataType: "script",
                            success : function (customLayer, textStatus, request) {
                                if (mviewer.customLayers[oLayer.id].layer) {
                                    var l = mviewer.customLayers[oLayer.id].layer;
                                    if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                                        l.setStyle(mviewer.featureStyles[oLayer.style]);
                                    }
                                    //mviewer.getVectorLayers().push(l);
                                    mviewer.processLayer(oLayer, l);
                                }
                                // This seems to be useless. To be removed?
                                if (mviewer.customLayers[oLayer.id].handle) {
                                }
                                mviewer.showCheckedLayers();
                            },
                            error: function (request, textStatus, error) {
                                console.log( "error custom Layer : " + error );
                            }
                        });
                    }
                    if (layer.group) {
                        _themes[themeid].groups[layer.group].layers[oLayer.id] = oLayer;
                    } else {
                        _themes[themeid].layers[oLayer.id] = oLayer;
                    }
                }); //fin each layer
            }); // fin each theme
        } // fin de else

         //Export PNG
        if (conf.application.exportpng === "true" && document.getElementById('exportpng')) {
            var exportPNGElement = document.getElementById('exportpng');
            if ('download' in exportPNGElement) {
                exportPNGElement.addEventListener('click', function(e) {
                    _map.once('postcompose', function(event) {
                        try {
                            var canvas = event.context.canvas;
                            exportPNGElement.href = canvas.toDataURL('image/png');
                        }
                        catch(err) {
                            mviewer.alert(err, "alert-info");
                        }
                    });
                    _map.renderSync();
                }, false);
            } else {
                $("#exportpng").hide();
            }
        } else {
            $("#exportpng").hide();
        }

         mviewer.init();

        //PERMALINK
        if (config.lb && $.grep(mviewer.getBackgroundLayers(), function (n) {
            return n.get('blid') === config.lb;
        })[0]) {
            mviewer.setBaseLayer(config.lb);
        } else {
            mviewer.setBaseLayer(_defaultBaseLayer);
        }

        if (config.l) {
            mviewer.setVisibleOverLayers(config.l);
        } else {
            if (!config.wmc) {
               mviewer.showCheckedLayers();
            }
        }

        if (_showhelp_startup) {
            $("#help").modal('show');
        }

    };

    return {
        parseXML: _parseXML,
        load: _load,
        getThemes: function () { return _themes; },
        getProxy: function () { return _proxy; },
        getCrossorigin: function () { return _crossorigin; },
        getCaptureCoordinates: function () { return _captureCoordinates; },
        getConfiguration: function () { return _configuration; }
    };

})();
