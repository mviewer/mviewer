var configuration = (function () {

    /**
     * Property: _options
     * XML. The application configuration
     */
    /* INTERNAL */
    var _configuration = null;

    // Mviewer version a saisir manuellement

    var VERSION = "3.8-snapshot";

    var _showhelp_startup = false;

    var _defaultBaseLayer = "";

    var _captureCoordinates = false;

    var _lang = false;

    var _languages = [];

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

    const _blankSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    const _parseXML = function (xml) {
        const _conf = XML.xml2json(xml).config;
        // transtype baselayer, theme, group, layer
        //those types should be array
        //if type is object, push it into new Array
        if (!Array.isArray(_conf.baselayers.baselayer)) {
            _conf.baselayers.baselayer = [_conf.baselayers.baselayer];
        }
        _conf.baselayers = _conf.baselayers;
        if (!Array.isArray(_conf.themes.theme)) {
            if (_conf.themes.theme) {
                _conf.themes.theme = [_conf.themes.theme];
            } else {
                _conf.themes.theme = [];
            }
        }
        if (_conf.themes.theme !== undefined) {
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
        }

        return _conf;
    };

    var _getExtensions = function (conf) {
        //load javascript extensions and trigger applicationExtended when all is done
        const extensionArray = XML.xml2json(conf).config.extensions.extension;
        const jsExtensions = extensionArray.filter(extension => extension.type === 'javascript');
        const requests = jsExtensions.map(extension => {
            return axios.get(mviewer.ajaxURL(extension.src, false), {
                crossDomain: true
            }).catch((error) => {
                alert(`Error with extensions !`);
                console.log(`Error with extension - Can't load file : ${extension.src}`);
            });
        })
        Promise.all(requests).then(data => {
            //Trigger when external resources are loaded
            $(document).trigger("applicationExtended", { "xml": conf });
        }).catch((err) => {
            // Trigger is needed with error
            $(document).trigger("applicationExtended", { "xml": conf });
            console.log(err);
        });

        //load components
        //each component is rendered in Component constructor;
        //When all is done, trigger componentLoaded event
        const componentsExtensions = extensionArray.filter(extension => extension.type === 'component');
        componentsExtensions.forEach(function (component) {
            if (component?.id && component?.path) {
                mviewer.customComponents[component] = new Component(component.id, component.path);
            }
        });

    };

    var _complete = function (conf) {
        /*
         * Des thèmes externes (présents dans d'autres configuration peuvent être automatiquement chargés
         * par référence au fichier xml utilisé (url=) et à l'id de la thématique (id=).
         * Attention si la configuration externe est sur un autre domaine, il faut alors utiliser un proxy Ajax
         * ou alors s'assurer que CORS est activé sur le serveur distant.
         * Les thématiques externes peuvent utiliser des ressources particulières (templates, customLayer, sld...)
         * si les URLs de ces ressources sont absolues et accessibles.
        */

        //Recherche des thématiques externes
        var extraConf = $(conf).find("theme").filter(function (idx, theme) {
            if ($(theme).attr("id") && $(theme).attr("url") && $(theme).attr("url").indexOf("http") > -1 ) {
                return theme;
            }
        });

        var requests = [];
        var ajaxFunction = function () {
            // Préparation des requêtes Ajax pour récupérer les thématiques externes
            extraConf.toArray().forEach(function(theme) {
                var url = $(theme).attr("url");
                var id = $(theme).attr("id");
                var proxy = false;
                if ($(conf).find("proxy").attr("url")) {
                    proxy = $(conf).find("proxy").attr("url");
                }
                requests.push($.ajax({
                    url: mviewer.ajaxURL(url, proxy),
                    crossDomain : true,
                    themeId: id,
                    success: function (response, textStatus, request) {
                        //Si thématique externe récupérée, on la charge dans la configuration courante
                        var node = $(response).find("theme#" + this.themeId);
                        if (node.length > 0) {
                            $(conf).find("theme#" + this.themeId).replaceWith(node);
                        } else {
                            $(conf).find("theme#" + this.themeId).remove();
                            console.log("La thématique " + this.themeId + " n'a pu être trouvée dans " + this.url );
                        }
                    },
                    error: function(xhr, status, error) {
                        //Si la thématique n'est pas récupérable, on supprime la thématique dans la configuration courante
                        console.log(this.url + " n'est pas accessible. La thématique n'a pu être chargée");
                        $(conf).find("theme#" + this.themeId).remove();
                    }
                }));
            });
        };

        $.when.apply(new ajaxFunction(), requests).done(function (result) {
            //Lorsque toutes les thématiques externes sont récupérées,
            // on initialise le chargement de l'application avec le trigger configurationCompleted
            $(document).trigger("configurationCompleted", { "xml": conf});
        }).fail(function(err) {
            // Si une erreur a été rencontrée, initialise également le chargement de l'application
            // avec le trigger configurationCompleted
            $(document).trigger("configurationCompleted", { "xml": conf});
        });




    };

    var _load = function (conf) {

        console.log("Mviewer version " + VERSION);

        // set infos bar text
        $('#mviewerinfosbar').append(VERSION);

        _configuration = conf;
        utils.testConfiguration(conf);
        //apply application customization
        if (conf.application.lang) {
            // default lang from config file
            var languages = conf.application.lang.split(",");
            if (languages.length > 1) {
                _languages = languages;
            }
            _lang = languages[0];
        }
        if (API.lang && API.lang.length > 0) {
            // apply lang set in URL as param
            _lang = API.lang;
        }
        if (conf.application.title || API.title) {
            var title = API.title || conf.application.title;
            document.title = title;
            title = conf.application.htmltitle || title;
            $(".mv-title").text("");
            $(".mv-title").append(title);
        }
        if (conf.application.stats === "true" && conf.application.statsurl) {
            $.get(conf.application.statsurl +"?app=" + document.title);
        }
        if (conf.application.logo) {
            $(".mv-logo").attr("src", conf.application.logo);
        }
        if (conf.application.showhelp === "true") {
            _showhelp_startup = true;
        }
        if(API.popup){
            _showhelp_startup = API.popup && API.popup === "true" ? true : false;
            if(API.popup === "true"){
                _showhelp_startup = true;
            } else if (API.popup === "false"){
                _showhelp_startup = false;
            }
        }
        if (conf.application.titlehelp) {
            $("#help h4.modal-title").text(conf.application.titlehelp);
        }
        if (conf.application.iconhelp) {
            $("#iconhelp span").attr('class',"fa fa-"+conf.application.iconhelp);
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
        if(!conf.application.studio){
            $('#studiolink').remove();
        }
        if(conf.application.home){
            $('.mv-logo').parent().attr('href', conf.application.home);
        }
        if(conf.application.mapfishurl){
            $('#georchestraForm').attr('action', conf.application.mapfishurl);
        } else {
             $("#shareToMapfish").hide();
        }

        //map options
        _map = mviewer.initMap(conf.mapoptions);

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
                        $("#login-box").show();
                        let title = mviewer.lang ? mviewer.tr('tbar.right.logout') : "Se déconnecter";
                        if (response.user !="") {
                            $("#login").attr("href",_authentification.logouturl);
                            $("#login").attr("title", title);
                            $("#login span")[0].className = 'fas fa-lock';
                            $("#login-box>span").text(response.user);
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
        if (API.wmc) {
            var reg = new RegExp("[,]+", "g");
            var wmcs = API.wmc.split(reg);
            var processedWMC = 0;
            var nbOverLayers = 0;



            var requests = [];
            var ajaxFunction = function () {
                // Préparation des requêtes Ajax pour récupérer les thématiques externes
                wmcs.forEach(function(url, idx) {
                    var wmcid = "wmc" + idx;
                    requests.push($.ajax({
                        url: mviewer.ajaxURL(url, _proxy),
                        crossDomain : true,
                        wmcid: wmcid,
                        dataType: "xml",
                        success: function (response, textStatus, request) {
                            var wmc = mviewer.parseWMCResponse(response, this.wmcid);
                            $.each(wmc.layers, function (idx, layer) {
                                mviewer.processLayer(layer, layer.layer);
                            });
                            processedWMC += 1;
                            _themes[wmcid] = {};
                            _themes[wmcid].collapsed = false;
                            _themes[wmcid].id = wmcid;
                            _themes[wmcid].name = wmc.title;
                            _themes[wmcid].layers = {};
                            _themes[wmcid].icon = "fas fa-chevron-circle-right";
                            _map.getView().fit(wmc.extent, { size: _map.getSize(),
                                padding: [0, $("#sidebar-wrapper").width(), 0, 0]});
                            _themes[wmcid].layers = wmc.layers;
                            _themes[wmcid].name = wmc.title;
                            nbOverLayers += Object.keys(wmc.layers).length;
                        },
                        error: function(xhr, status, error) {
                           console.log("WMC " + this.url + " not found");
                        }
                    }));
                });
            };

            $.when.apply(new ajaxFunction(), requests).done(function (result) {
                 mviewer.events().overLayersTotal = nbOverLayers;
                 mviewer.events().confLoaded = true;
            }).fail(function(err) {
                 mviewer.events().overLayersTotal = nbOverLayers;
                 mviewer.events().confLoaded = true;
            });
        } else if (conf.themes.theme !== undefined) {
            var themes = conf.themes.theme;
            var nbOverLayers = 0;
            themes.forEach(function (theme) {
                if (theme.layer) {
                    nbOverLayers += theme.layer.length;
                }
                if (theme.group.length > 0) {
                    theme.group.forEach(function (group) {
                        if (group.layer && group.layer.length > 0) {
                            nbOverLayers += group.layer.length;
                        }
                    });
                }
            });
            mviewer.events().overLayersTotal = nbOverLayers;
            var layerRank = 0;
            var doublons = {};
            conf.themes.theme.reverse().forEach(function(theme) {
                var themeid = theme.id;
                //test icon value
                // with fontawesome 4.6.3 "school" parameter becomes css classes "fa fa-school"
                // in fontawesome 5.6.3 fa fa-school is deprecated. Use "fas fa-school" instead.
                // to preserve compatibility with fontawesome ol notation, it is necessary to test this value.
                var test = (theme.icon || "fas fa-globe").trim();
                var icon = "";
                if (test.indexOf(".") === 0) {
                    // use custom css class to render svg icon for example
                    icon = test.substring(1);
                } else if (test.indexOf(" ") > 0) {
                    // use 5.6.3 notation eg. "fas fa-school"
                    icon = test;
                } else {
                    // use 4.6.3 notation eg. "fa fa-school". deprecated.
                    icon = "fa fa-" + test;
                }
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
                                if (layer) {
                                    layer.group = group.id;
                                }
                            });
                            layers = layers.concat(group.layer);
                        }
                    });
                }
                layers.reverse().forEach( function (layer) {
                   if (layer) { /* to escape group without layer */
                    layerRank+=1;
                    var layerId = layer.id;
                    if (layer.url) {
                        var getCapRequestUrl = getCapUrl(layer.url);
                        var secureLayer = (layer.secure === "true" || layer.secure == "global") ? true : false;
                        if (secureLayer) {
                            $.ajax({
                                dataType: "xml",
                                layer: layerId,
                                url:  mviewer.ajaxURL(getCapRequestUrl),
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
                    oLayer.index = layer.index ? parseFloat(layer.index): null;
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
                    oLayer.sld = layer.sld || null;
                    //slds
                    if (oLayer.sld) {
                        var styles = layer.sld.split(",");
                        //default style is the first
                        oLayer.sld = styles[0];
                        // test if multi styles
                        if (styles.length > 1) {
                            oLayer.styles = styles.toString();
                        }
                    }
                    if (layer.stylesalias && layer.stylesalias !== "") {
                        oLayer.stylesalias = layer.stylesalias;
                    } else {
                        if (oLayer.styles) {
                            if (oLayer.styles.search("http") >= 0) {
                                var sldaliases =[];
                                var regex =  /[^/]+$/i;
                                oLayer.styles.split(",").forEach(function (sld, i) {
                                    sldaliases.push(regex.exec(sld)[0].split("@")[0]);
                                });
                                oLayer.stylesalias = sldaliases.join(",");
                            } else {
                                oLayer.stylesalias = oLayer.styles;
                            }
                        }
                    }
                    oLayer.toplayer =  (layer.toplayer === "true") ? true : false;
                    oLayer.draggable = true;
                    if (oLayer.toplayer) {
                        mviewer.setTopLayer(oLayer.id);
                        oLayer.draggable = false;
                    }
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
                    oLayer.attributeoperator = layer.attributeoperator || "=";
                    oLayer.wildcardpattern = layer.wildcardpattern || "%value%";
                    oLayer.styletitle = layer.styletitle;
                    oLayer.attributelabel = layer.attributelabel;
                    if (layer.attributevalues && layer.attributevalues.search(",")) {
                        oLayer.attributevalues = layer.attributevalues.split(",");
                    }
                    oLayer.attributestylesync =  (layer.attributestylesync &&
                        layer.attributestylesync === "true") ? true : false;
                    oLayer.attributefilterenabled =  (layer.attributefilterenabled &&
                        layer.attributefilterenabled === "true") ? true : false;
                    if (oLayer.attributestylesync && oLayer.attributefilterenabled && oLayer.attributevalues) {
                        if (oLayer.style) {
                            oLayer.style = [oLayer.style.split('@')[0], '@',
                            oLayer.attributevalues[0].sansAccent().toLowerCase()].join("");
                        } else if (oLayer.sld) {
                            oLayer.sld = [oLayer.sld.split('@')[0], '@',
                            oLayer.attributevalues[0].sansAccent().toLowerCase(), ".sld"].join("");
                        }
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
                        $.get(mviewer.ajaxURL(layer.template.url, _proxy), function(template) {
                            oLayer.template = template;
                        });
                    } else if (layer.template) {
                        oLayer.template = layer.template;
                    } else {
                        oLayer.template = false;
                    }
                    oLayer.queryable = (layer.queryable === "true") ? true : false;
                    oLayer.exclusive = (layer.exclusive === "true") ? true : false;
                    oLayer.searchable = (layer.searchable === "true") ? true : false;
                    if (oLayer.searchable) {
                        oLayer = search.configSearchableLayer(oLayer, layer);
                    }
                    oLayer.infoformat = layer.infoformat;
                    oLayer.checked = (layer.visible === "true") ? true : false;
                    oLayer.visiblebydefault = (oLayer.checked) ? true : false;
                    oLayer.tiled = (layer.tiled === "true") ? true : false;
                    oLayer.dynamiclegend = (layer.dynamiclegend === "true") ? true : false;
                    oLayer.vectorlegend =  (layer.vectorlegend === "true") ? true : false;
                    oLayer.nohighlight =  (layer.nohighlight === "true") ? true : false;
                    oLayer.infohighlight =  (layer.infohighlight === "false") ? false : true;
                    oLayer.showintoc =  (layer.showintoc && layer.showintoc === "false") ? false : true;
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

                    if (layer.jsonfields) {
                        oLayer.jsonfields = layer.jsonfields.split(",");
                    } else {
                        oLayer.jsonfields = [];
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
                    oLayer.secure = layer.secure || "public";

                    oLayer.authentification = (layer.authentification === "true") ? true : false;
                    if (layer.authorization){
                        sessionStorage.removeItem(oLayer.url);
                        if(layer.authorization != '')
                            sessionStorage.setItem(oLayer.url, layer.authorization);
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
                            'STYLES': (themeLayers[oLayer.id].style)? themeLayers[oLayer.id].style : '',
                            'FORMAT': 'image/png',
                            'TRANSPARENT': true
                        };
                        var source;
                        if (oLayer.filter) {
                            wms_params['CQL_FILTER'] = oLayer.filter;
                        }
                        if (oLayer.attributefilter && oLayer.attributefilterenabled &&
                            oLayer.attributevalues.length > 1) {
                            wms_params['CQL_FILTER'] = mviewer.makeCQL_Filter(oLayer.attributefield, oLayer.attributeoperator, oLayer.attributevalues[0], oLayer.wildcardpattern);
                        }
                        if (oLayer.sld) {
                            wms_params['SLD'] = oLayer.sld;
                        }

                        // Use owsoptions to overload default Getmap params
                        Object.assign(wms_params, getParamsFromOwsOptionsString(layer.owsoptions));

                        function customWmsImageLoader(image, src) {
                            if (oLayer.useproxy) {
                                src = _proxy + encodeURIComponent(src);
                            }

                            // S'il existe des idenfiants d'accès pour ce layer, on les injecte
                            var _ba_ident = sessionStorage.getItem(layer.url);
                            if (_ba_ident && _ba_ident != '') {
                                var xhr = new XMLHttpRequest();
                                xhr.responseType = 'blob';
                                xhr.open('GET', src);

                                xhr.setRequestHeader("Authorization","Basic " + window.btoa( _ba_ident));
                                xhr.addEventListener('loadend', function (evt) {
                                    var data = this.response;
                                    if (this.status == '401') {
                                        image.getImage().src = _blankSrc;
                                    } else if (data && data !== undefined) {
                                        image.getImage().src = URL.createObjectURL(data);
                                    }
                                });
                                xhr.onload = function() {
                                    image.getImage().src = src;
                                };
                                xhr.send();
                            } else {
                                image.getImage().src = src;
                            }
                        }

                        switch (oLayer.tiled) {
                            case true:
                                wms_params['TILED'] = true;
                                source = new ol.source.TileWMS({
                                    url: layer.url,
                                    crossOrigin: _crossorigin,
                                    tileLoadFunction: customWmsImageLoader,
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
                                    imageLoadFunction: customWmsImageLoader,
                                    params: wms_params
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
                        mviewer.processLayer(oLayer, l);
                    }// end geojson

                    if (oLayer.type === 'kml') {
                        l = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                url: layer.url,
                                format: new ol.format.KML()
                            })
                        });
                        mviewer.processLayer(oLayer, l);
                    }// end kml

                    if (oLayer.type === 'import') {
                        l = new ol.layer.Vector({
                            source: new ol.source.Vector()
                        });
                        if (layer.projections) {
                            oLayer.projections = layer.projections;
                        }
                        if (layer.geocodingfields) {
                            oLayer.geocodingfields = layer.geocodingfields.split(",");
                        }
                        oLayer.geocoder = layer.geocoder || false;
                        oLayer.geocoderurl = layer.geocoderurl || false;
                        oLayer.xfield = layer.xfield;
                        oLayer.yfield = layer.yfield;
                        //allow transformation to mapProjection before map is initialized
                        oLayer.mapProjection = conf.mapoptions.projection;
                        mviewer.processLayer(oLayer, l);
                    }// end import

                    if (oLayer.type === 'customlayer') {
                        var hook_url = 'customLayers/' + oLayer.id + '.js';
                        if (oLayer.url && oLayer.url.slice(-3)==='.js') {
                            hook_url = oLayer.url;
                        }
                        $.ajax({
                            url: mviewer.ajaxURL(hook_url),
                            dataType: "script",
                            success : function (customLayer, textStatus, request) {
                                if (mviewer.customLayers[oLayer.id].layer) {
                                    var l = mviewer.customLayers[oLayer.id].layer;
                                    if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                                        l.setStyle(mviewer.featureStyles[oLayer.style]);
                                    }
                                    mviewer.processLayer(oLayer, l);
                                }
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
                   }}); //fin each layer
            }); // fin each theme
        } // fin de else

         //Export PNG
        if (conf.application.exportpng === "true" && document.getElementById('exportpng')) {
            var exportPNGElement = document.getElementById('exportpng');
            if ('download' in exportPNGElement) {
                exportPNGElement.addEventListener('click', function(e) {
                    _map.once('postcompose', function(event) {
                        try {
                            var mapCanvas = document.createElement('canvas');
                            var size = _map.getSize();
                            mapCanvas.width = size[0];
                            mapCanvas.height = size[1];
                            var mapContext = mapCanvas.getContext('2d');
                            Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), function(canvas) {
                              if (canvas.width > 0) {
                                mapContext.globalAlpha = 1;
                                var transform = canvas.style.transform;
                                // Get the transform parameters from the style's transform matrix
                                var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
                                // Apply the transform to the export map context
                                CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
                                mapContext.drawImage(canvas, 0, 0);
                              }
                            });
                            exportPNGElement.href = mapCanvas.toDataURL('image/png');
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

        // Infos de connexion pour les couches à accès restreint
        $("#savelogin").click(function(){
            var _service_url = $("#service-url").val();
            var _layer_id = $("#layer-id").val();
            sessionStorage.removeItem(_service_url);
            if($("#user").val() != '' && $("#pass").val() != '')
                sessionStorage.setItem(_service_url, $("#user").val() + ':' + $("#pass").val());

            $("#loginpanel").modal("hide");
            // Refresh du layer
            _map.getLayers().forEach(function (lyr) {
                if (_layer_id == lyr.get('mviewerid')) {
                    lyr.getSource().refresh();
                }
            });
        });

         //mviewer.init();
         if (!API.wmc && nbOverLayers === 0) {
             mviewer.init();
             mviewer.setBaseLayer(_defaultBaseLayer);
         }

        if (_showhelp_startup) {
            $("#help").modal('show');
        }

        if (!API.wmc) {
            mviewer.events().confLoaded = true;
        }
    };

    return {
        parseXML: _parseXML,
        getExtensions: _getExtensions,
        load: _load,
        complete: _complete,
        getThemes: function () { return _themes; },
        getDefaultBaseLayer: function () { return _defaultBaseLayer; },
        getProxy: function () { return _proxy; },
        getCrossorigin: function () { return _crossorigin; },
        getCaptureCoordinates: function () { return _captureCoordinates; },
        getConfiguration: function () { return _configuration; },
        getLang: function () { return _lang },
        getLanguages: function () { return _languages; },
        setLang: function (lang) { _lang = lang; mviewer.lang.lang = lang;}
    };

})();
