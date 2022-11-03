var info = (function () {

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
     * Property: _mvReady
     * Boolean. The getFeatureInfo state
     */

    var _mvReady = true;

    var _panelsTemplate = {"right-panel": "default", "bottom-panel": "default", "modal-panel": "default"};

    /**
     * Property: _overLayers
     * {object} hash of all overlay Layers (static)
     */

    var _overLayers = {};

    /**
     * Property: _queryableLayers
     * Array of {ol.layer.Layer}.
     */

    var _queryableLayers = [];


    /**
     * Property: _clickCoordinates
     * {Array} Coordinate of the queryMap click
     */

    var _clickCoordinates = null;

    var _captureCoordinatesOnClick = false;

    /**
     * Property: _toolEnabled
     * {Boolean}
     */

    var _toolEnabled = false;

    /**
     * Property: _featureTooltip
     * {html element} used to render features tooltips
     * with bootstrap tooltip component
     */

    var _featureTooltip;

    /**
     * Property: _activeTooltipLayer
     * {variant} Only one layer can use feature tooltip at
     * same time. If feature tooltip is enabled for a layer,
     * _activeTooltipLayer = layerid. Otherwhise _activeTooltipLayer = false.
     * with bootstrap tooltip component
     */

    var _activeTooltipLayer;

    /**
     * Property: _sourceOverlay
     * @type {ol.source.Vector}
     * Used to hightlight hovered vector features
     */

    var _sourceOverlay;

    /**
     * Property: _queriedFeatures
     * Array of ol.Feature
     * Used to store features retrieved on click
     */
    var _queriedFeatures;

    /**
     * Property: _firstlayerFeatures
     * Array of ol.Feature
     * Used to store features of firstlayer retrieved on click
     */
    var _firstlayerFeatures;

     /**
     * Property: _tocsortedlayers
     * Array of string
     * Used to store all layerids sorted according to the toc
     */
    var _tocsortedlayers;

    /**
     * Private Method: _customizeHTML
     * @param html {Array}
     * @param featurescount {Integer}
     *
     */
    var _customizeHTML = function (html, featurescount) {
        //manipulate html to activate first item.
        var tmp = document.createElement('div');
        $(tmp).append(html);
        $(tmp).find("li.item").first().addClass("active");
        //manipulate html to add data-counter attribute to each feature.
        if (featurescount > 1) {
            $(tmp).find("li.item").each(function (i, item) {
                $(item).attr("data-counter",(i+1)+'/' + featurescount);
            });
        }
        return [$(tmp).html()];
    }

    /**
     * Private Method: _clickOnMap
     *
     */

    var _clickOnMap = function (evt) {
        $('#loading-indicator').show();
        // TODO : Clear search results
        //_clearSearchResults();
        _queryMap(evt);
    };

    /**
     * Private Method: _queryMap()
     * @param evt {ol.MapBrowserEvent}
     * @param options {type: 'feature' || 'map', layer: {ol.layer.Layer}, featureid:'featureid'}
     *
     */

    var _queryMap = function (evt, options) {
        var isClick = evt.type === 'singleclick';
        _queriedFeatures = [];
        _firstlayerFeatures = [];
        var showPin = false;
        var queryType = "map"; // default behaviour
        var views = {
            "right-panel":{ "panel": "right-panel", "layers": []},
            "bottom-panel":{ "panel": "bottom-panel", "layers": []},
            "modal-panel": { "panel": "modal-panel", "layers": []}
        };
        if (options) {
            // used to link elasticsearch feature with wms getFeatureinfo
            var layer = options.layer;
            var featureid = options.featureid;
            queryType = options.type;
        }
        if (!_mvReady) {
            return False;
        }
        if (_captureCoordinatesOnClick) {
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, _projection.getCode(), 'EPSG:4326'));
            var hdms2 = hdms.replace(/ /g,"").replace("N","N - ");
            $("#coordinates span").text(hdms2);
        }
        //Request vector layers
        if (queryType === 'map') {
            var pixel = evt.pixel;
            var vectorLayers = {};
            var format = new ol.format.GeoJSON();
            var f_idx=0;
            _map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                var l = layer.get('mviewerid');
                if (l && l != 'featureoverlay' && l != 'selectoverlay' && l != 'subselectoverlay' && l != 'elasticsearch' ) {
                    var queryable = _overLayers[l].queryable;
                    if (queryable) {
                        if (layer.get('infohighlight')) {
                            _queriedFeatures.push(feature);
                        } else {
                            showPin = true;
                        }
                        if (vectorLayers[l] && vectorLayers[l].features) {
                            vectorLayers[l].features.push(feature);
                        } else {
                            if (_overLayers[l] && _panelsTemplate[_overLayers[l].infospanel]=='allintabs') {
                                l = l + '_#' + f_idx;
                                f_idx++;
                            }
                            vectorLayers[l] = {features:[]};
                            vectorLayers[l].features.push(feature);
                        }
                     }
                }
            });
            for(var layerid in vectorLayers) {
                var originLayer = (layerid in _overLayers ? layerid : layerid.substring(0, layerid.lastIndexOf("_#")) );
                if (mviewer.customLayers[originLayer] && mviewer.customLayers[originLayer].handle) {
                    mviewer.customLayers[originLayer].handle(vectorLayers[originLayer].features, views);
                } else if (mviewer.customControls[originLayer] && mviewer.customControls[originLayer].handle){
                    mviewer.customControls[originLayer].handle(vectorLayers[originLayer].features);
                } else {
                    var l = _overLayers[originLayer];
                    
                    if (l) {
                        var panel = l.infospanel;
                        if (configuration.getConfiguration().mobile) {
                            panel = 'modal-panel';
                        }
                        var name = l.name;
                        var theme = l.theme;
                        var theme_icon = l.icon;
                        var id = views[panel].layers.length + 1;
                        //Create html content from features
                        var html_result = "";
                        var features = vectorLayers[layerid].features;
                        if (l.template) {
                            html_result = applyTemplate(features, l);
                        } else {
                            html_result = createContentHtml(features, l);
                        }
                        //Set view with layer info & html formated features
                        views[panel].layers.push({
                            "panel": panel,
                            "id": id,
                            "firstlayer": false, // firstlayer attribute is calculated after ordering layers with orderViewsLayersByMap
                            "manyfeatures": (features.length > 1),
                            "nbfeatures": features.length,
                            "name": name,
                            "layerid": layerid,
                            "initiallayerid": originLayer,
                            "theme_icon": theme_icon,
                            "html": html_result
                        });
                     }
                }
            }
        }
        //Request wms layers
        var featureInfoByLayer = [];
        var visibleLayers = [];
        if (layer) {
            visibleLayers.push(_overLayers[layer].layer);
        } else {
            visibleLayers =  $.grep( _queryableLayers, function( l, i ) {return l.getVisible();});
        }
        $(".popup-content").html('');
        _clickCoordinates = evt.coordinate;
        var urls = [];
        var params;
        for (var i = 0; i < visibleLayers.length; i++) {
            if (visibleLayers[i] instanceof ol.layer.BaseVector === false) {
                params = {'INFO_FORMAT': _overLayers[visibleLayers[i].get("mviewerid")].infoformat,
                    'FEATURE_COUNT': _overLayers[visibleLayers[i].get("mviewerid")].featurecount
                };
                var url = visibleLayers[i].getSource().getFeatureInfoUrl(
                    evt.coordinate, _map.getView().getResolution(), _map.getView().getProjection(), params
                );
                urlParams = new URLSearchParams(url)
                cql = new URLSearchParams(url).get("CQL_FILTER")
                if (layer && featureid) {
                    // create new cql to insert feature id
                    attributeFilter = _overLayers[layer].searchid+'%3D%27'+featureid+'%27';
                    // create new cql filter
                    urlParams.delete("CQL_FILTER");
                    cql = `&CQL_FILTER=${cql || ""}${cql ? " AND " : ""}${attributeFilter}`;
                    // force to decode to string result and avoid unreadable params
                    url = decodeURIComponent(urlParams.toString()) + cql;
                }
                urls.push({url:url, layerinfos: _overLayers[visibleLayers[i].get('mviewerid')]});
            }
        }

        var requests = [];
        var carrousel=false;

        /**
         * This method test mime type from string content
         * because of bad contentType on GetFeatureInfo response (QGIS SERVER)
         * @param  {variant} content
         * @param  {string} contentType (from GetFeatureInfo response header)
         */
        var _checkMimeType = function (content,contentType ) {
            var mimeType = contentType.split(";")[0];
            //Test string content to check if content is XML or HTML
            if (typeof content === 'string') {
                if (content.indexOf('<wfs:FeatureCollection') > 0 ) {
                    mimeType = "application/vnd.ogc.gml";
                } else if (content.indexOf('<div') >= 0 ) {
                    mimeType = "text/html";
                }
            }
            return mimeType;
        }

        /**
         * Order views layers according to map zindex order
         * @param {Array} viewsLayers - contain each views and layers by view
         * @returns array
         */
        var orderViewsLayersByMap = function (viewsLayers) {
            var mapLayers = mviewer.getMap().getLayers().getArray();
            mapLayers = mapLayers.map(l => l.getProperties().mviewerid).filter(l => l);

            var mapLayersOrder = [];
            viewsLayers.forEach(lv => {
                
                if (mapLayers.indexOf(lv.layerid) > -1){
                mapLayersOrder[mapLayers.indexOf(lv.layerid)] = lv;
                } else {
                    mapLayersOrder[lv.id] = lv; // when display template is allintabs all layers are virtually renamed (one fictive layer per feature)
                }
            })
                        var infoLayers = mapLayersOrder.filter(f => f);
            var orderedlayers = [];
            if (configuration.getConfiguration().application.sortlayersinfopanel && configuration.getConfiguration().application.sortlayersinfopanel=='toc'){ //toc order
                // les couches de la toc dans l'ordre 
                for (var j = 0; j < infoLayers.length; j++) {// layers not shown in toc but queried first
                    if (_tocsortedlayers.indexOf(infoLayers[j].initiallayerid ? infoLayers[j].initiallayerid:infoLayers[j].layerid) === -1){
                        orderedlayers.push(infoLayers[j]);
                    }
                }
                for (var i = 0; i < _tocsortedlayers.length; i++) {
                    for (var j = 0; j < infoLayers.length; j++) {
                        if ((infoLayers[j].initiallayerid ? infoLayers[j].initiallayerid:infoLayers[j].layerid) == _tocsortedlayers[i]){
                            orderedlayers.push(infoLayers[j]);
                        }
                    }
                }
            } else { // ordered with legend (=map order)
                orderedlayers = infoLayers.reverse();
            }
            return orderedlayers
        }

        /**
         * Return infos according to map click event behavior.
         * This callback is return when all request are resolved (like promiseAll behavior)
         * @param {object} result
         */
        var callback = function (result) {
            $.each(featureInfoByLayer, function (index, response) {
                var layerinfos = response.layerinfos;
                var panel = layerinfos.infospanel;
                if (configuration.getConfiguration().mobile) {
                    panel = 'modal-panel';
                }
                var contentType = response.contenttype;
                var layerResponse = response.response;
                var mimeType = _checkMimeType(layerResponse, contentType);
                var name = layerinfos.name;
                var theme = layerinfos.theme;
                var layerid = layerinfos.layerid;
                var theme_icon = layerinfos.icon;
                var infohighlight = layerinfos.infohighlight;
                var id = views[panel].layers.length + 1;
                var manyfeatures = false;
                var html_result = [];

                var xml = null;
                var html = null;

                switch (mimeType) {
                    case "text/html":
                        if ((typeof layerResponse === 'string')
                            && (layerResponse.search('<!--nodatadetect--><!--nodatadetect-->')<0)
                            && (layerResponse.search('<!--nodatadetect-->\n<!--nodatadetect-->')<0)) {
                            html = layerResponse;
                            // no geometry in html
                            showPin = true;
                        }
                        break;
                    case "application/vnd.ogc.gml":
                        if ($.isXMLDoc(layerResponse)) {
                            xml = layerResponse;
                        } else {
                            xml = $.parseXML(layerResponse);
                        }
                        break;
                    case "application/vnd.esri.wms_raw_xml":
                    case "application/vnd.esri.wms_featureinfo_xml":
                        if ($.isXMLDoc(layerResponse)) {
                            xml = layerResponse;
                        } else {
                            xml = $.parseXML(layerResponse);
                        }
                        break;
                    default :
                        mviewer.alert("Ce format de réponse : " + contentType +" n'est pas pris en charge", "alert-warning");
                }
                if (html) {
                    //test si présence d'une classe .feature eg template geoserver.
                    //Chaque élément trouvé est une feature avec ses propriétés
                    // Be carefull .carrousel renamed to mv-features
                    var features = $(layerResponse).find(".mv-features li").addClass("item");
                    if(features.length == 0){
                        html_result.push('<li class="item active">'+layerResponse+'</li>');
                    }
                    else {
                        $(features).each(function(i,feature) {
                            html_result.push(feature);
                        });
                        html_result = _customizeHTML(html_result, features.length);
                    }
                } else {
                    if (xml) {
                        var getFeatureInfo = _parseWMSGetFeatureInfo(xml, layerid);
                        if(!getFeatureInfo.hasGeometry || !getFeatureInfo.features.length || !infohighlight) {
                            // no geometry could be found in gml
                            showPin = true;
                        } else {
                            //Geometry is available
                            _queriedFeatures.push.apply(_queriedFeatures, getFeatureInfo.features);
                        }
                        var features = getFeatureInfo.features;
                        if (features.length > 0) {
                            if (_panelsTemplate[panel]=='allintabs') {
                                features.forEach(function(feature, index) {
                                    if (layerinfos.template) {
                                       html_result.push(applyTemplate([feature], layerinfos));
                                    } else {
                                        html_result.push(createContentHtml([feature], layerinfos));
                                    }
                                });
                            } else {
                                if (layerinfos.template) {
                                    html_result.push(applyTemplate(features, layerinfos));
                                } else {
                                    html_result.push(createContentHtml(features, layerinfos));
                                }
                            }
                        }
                    }
                }
                //If many results, append panels views
                if (html_result.length > 0) {
                    //Set view with layer info & html formated features
                    if (_panelsTemplate[panel]=='allintabs') {
                        for (var i = 0; i < html_result.length; i++) {
                            views[panel].layers.push({
                                "panel": panel,
                                "id": views[panel].layers.length + 1,
                                "firstlayer": false,
                                "manyfeatures": false,
                                "nbfeatures": 1,
                                "name": name,
                                "layerid": layerid + '_' + i,
                                "initiallayerid" : layerid,
                                "theme_icon": theme_icon,
                                "html": html_result[i],
                                "pin": showPin
                            });
                        }
                    } else {
                        views[panel].layers.push({
                            "panel": panel,
                            "id": views[panel].layers.length + 1,
                            "firstlayer": false,
                            "manyfeatures": (features.length > 1),
                            "nbfeatures": features.length,
                            "name": name,
                            "layerid": layerid,
                            "theme_icon": theme_icon,
                            "html": html_result.join(""),
                            "pin": showPin
                        });
                    }
                }
            });
            var infoLayers = [];
            for (var panel in views) {
                infoLayers = infoLayers.concat(views[panel].layers);
            }
            mviewer.setInfoLayers(infoLayers);

            $.each(views, function (panel, view) {
                if (view.layers.length > 0){
                    view.layers = orderViewsLayersByMap(views[panel].layers);
                    view.layers[0].firstlayer=true;
                    var template = "";
                    if (configuration.getConfiguration().mobile) {
                        template = Mustache.render(mviewer.templates.featureInfo.accordion, view);
                    } else {
                        template = Mustache.render(mviewer.templates.featureInfo[_panelsTemplate[panel]], view);
                    }
                    $("#"+panel+" .popup-content").append(template);
                    var title = $( `a[href*='slide-${panel}-']` ).closest("li").attr("title")
                    $("#"+panel+" .mv-header h5").text(title);
                    
                    const infoPanelReadyEvent = new CustomEvent('infopanel-ready', {
                        detail: {
                          panel: panel
                        }
                    });
                    document.dispatchEvent(infoPanelReadyEvent);
                    
                    if (configuration.getConfiguration().mobile) {
                        $("#modal-panel").modal("show");
                        if (_featureTooltip && _featureTooltip.getElement().children.length) {
                            $(_featureTooltip.getElement()).popover('hide')
                        }
                    } else {
                        if (!$('#'+panel).hasClass("active")) {
                            $('#'+panel).toggleClass("active");
                        }
                    }
                    $("#"+panel+" .popup-content iframe[class!='chartjs-hidden-iframe']").each(function( index) {
                        $(this).on('load',function () {
                                $(this).closest("li").find(".mv-iframe-indicator").hide();
                        });
                        $(this).closest("li").append(['<div class="mv-iframe-indicator" >',
                            '<div class="loader">Loading...</div>',
                            '</div>'].join(""));
                    });
                    $("#"+panel+" .popup-content img").click(function(){mviewer.popupPhoto($(this).attr("src"))});
                    $("#"+panel+" .popup-content img").on("vmouseover",function(){$(this).css('cursor', 'pointer');})
                        .attr("title","Cliquez pour agrandir cette image");
                    $(".popup-content .nav-tabs li>a").tooltip('destroy').tooltip({
                        animation: false,
                        trigger: 'hover',
                        container: 'body',
                        placement: 'right',
                        html: true,
                        template: mviewer.templates.tooltip
                    });
                    // init sub selection
                    _firstlayerFeatures = _queriedFeatures.filter(feature => {
                        return feature.get("mviewerid") == view.layers[0].layerid;
                    });
                    // change feature of sub selection
                    $('.carousel.slide').on('slide.bs.carousel', function (e) {
                        $(e.currentTarget).find(".counter-slide").text($(e.relatedTarget).attr("data-counter"));
                        var selectedFeature = _queriedFeatures.filter(feature => {
                            return feature.ol_uid == e.relatedTarget.id;
                        })
                        if (!_queriedFeatures[0].get("features")) {
                            mviewer.highlightSubFeature(selectedFeature[0]);
                        }
                    });
                    // change layer of sub selection
                    if (configuration.getConfiguration().mobile) {
                        $('.panel-heading').on('click', function (e) {
                            changeSubFeatureLayer(e);
                        });
                    } else {
                        $('.nav-tabs li').on('click', function (e) {
                            changeSubFeatureLayer(e);
                        });
                    }
                } else {
                    $('#'+panel).removeClass("active");
                }
                // highlight features and sub feature
                if(_queriedFeatures[0] && _queriedFeatures[0].get("features")) {
                    // cluster
                    mviewer.highlightSubFeature(_queriedFeatures[0]);
                } else {
                    mviewer.highlightFeatures(_queriedFeatures);
                    mviewer.highlightSubFeature(_firstlayerFeatures[0]);
                }
                // show pin as fallback if no geometry for wms layer
                if (showPin || (!_queriedFeatures.length && !_firstlayerFeatures.length && !isClick)) {
                    mviewer.showLocation(_projection.getCode(), _clickCoordinates[0], _clickCoordinates[1], !showPin ? search.options.banmarker : showPin);
                } else {
                    $("#mv_marker").hide();
                }
            });
            $('#loading-indicator').hide();
            search.clearSearchField();
            _mvReady = true;
        };

        var changeSubFeatureLayer = function (e) {
            _firstlayerFeatures = _queriedFeatures.filter(feature => {
                return feature.get("mviewerid") == e.currentTarget.dataset.layerid;
            })
            mviewer.highlightSubFeature(_firstlayerFeatures[0]);
        }

        var ajaxFunction = function () {
            urls.forEach(function(request) {
                var _ba_ident = sessionStorage.getItem(request.layerinfos.url);
                requests.push($.ajax({
                    url: mviewer.ajaxURL(request.url),
                    layer: request.layerinfos,
                    beforeSend: function(req){
                        if(_ba_ident) req.setRequestHeader("Authorization", "Basic " + btoa(_ba_ident));
                    },
                    success: function (response, textStatus, request) {
                        featureInfoByLayer.push({response:response,layerinfos:this.layer,
                            contenttype:request.getResponseHeader("Content-Type")});
                    }
                }));
            });
        };

        // using $.when.apply() we can execute a function when all the requests
        // in the array have completed
        // this is promiseAll equivalent
        $.when.apply(new ajaxFunction(), requests).done(function (result) {
            callback(result)
        });
    };

    /**
     * Private Method: _mouseOverFeature(evt)
     * @param evt {ol.MapBrowserEvent}
     *
     */

    var _mouseOverFeature = function (evt) {
        if (evt.dragging) {
            return;
        }
        if (!_featureTooltip) {
            _featureTooltip = new ol.Overlay({
                element: document.getElementById('feature-info'),
                offset: [5, -10]
            });
            mviewer.getMap().addOverlay(_featureTooltip);
        }
        _featureTooltip.setPosition(evt.coordinate);
        const popup = _featureTooltip.getElement();

        var pixel = mviewer.getMap().getEventPixel(evt.originalEvent);
        // default tooltip state or reset tooltip
        $(popup).popover('destroy');
        $("#map").css("cursor", "");
        var feature = mviewer.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
            if (!layer
                || layer.get('mviewerid') === 'featureoverlay'
                || layer.get('mviewerid') === 'selectoverlay'
                || layer.get('mviewerid') === 'subselectoverlay'
            ) {
                return;
            }
            var ret = false;
            var layerid = layer.get('mviewerid');
            if (_activeTooltipLayer === false || (_activeTooltipLayer && layerid !== _activeTooltipLayer)) {
                ret = false;
            } else {
                if (feature instanceof ol.Feature) {
                    //test if cluster
                    if (typeof feature.get('features') === 'undefined') {
                        feature.set('mviewerid', layerid);
                        ret = feature.clone();
                    } else {
                        ret = feature.get('features')[0].clone();
                        var clustercount = feature.get('features').length;
                        if (clustercount > 1) {
                            ret.set('mv_clustercount', clustercount -1);
                        }
                        ret.set('mviewerid', layerid);
                    }
                 } else {
                    ret = new ol.Feature({
                      geometry: new ol.geom.Point(ol.extent.getCenter(feature.getGeometry().getExtent()))
                    });
                    ret.setProperties(feature.getProperties());
                    ret.set('mviewerid', layerid);
                 }
            }
            return ret;
        });
        //hack to check if feature is yet overlayed
        var newFeature = false;
        if(!feature) {
            $("#map").css("cursor", "");
            _sourceOverlay.clear();
            return;
        }
        if (feature && _sourceOverlay.getFeatures().length > 0) {
            if (feature.getProperties() === _sourceOverlay.getFeatures()[0].getProperties()) {
                newFeature = false;
            } else {
                newFeature = true;
            }
        } else if (feature && _sourceOverlay.getFeatures().length === 0) {
            newFeature = true;
        }

        var l = feature && Object.keys(feature.getProperties()) ? _overLayers[feature.get('mviewerid')] : false;
        if (l && l.tooltip && ((l.fields && l.fields.length) || l.tooltipcontent)) {
            $("#map").css("cursor", "pointer");
            if (newFeature && !l.nohighlight) {
                _sourceOverlay.clear();
                _sourceOverlay.addFeature(feature);
            }
            var title;
            var tooltipcontent = l.tooltipcontent;
            if ( tooltipcontent ) {
                if (tooltipcontent.indexOf('{{') < 0 && tooltipcontent.indexOf('}}') < 0) {
                    // one specific field
                    title = feature.getProperties()[tooltipcontent];
                } else {
                    // a Mustache template
                    title = Mustache.render(tooltipcontent, feature.getProperties());
                }
            } else {
                title = (feature.getProperties()["name"] || feature.getProperties()["label"] ||
                    feature.getProperties()["title"] || feature.getProperties()["nom"] ||
                    feature.getProperties()[l.fields[0]]);
            }
            $(popup).popover({
                container: popup,
                placement: 'top',
                animation: false,
                html: true,
                content: title,
                template: mviewer.templates.tooltip
            });
            $(popup).popover('show');
        }
    };

    /**
     * Private Method: _parseWMSGetFeatureInfo used to parse GML response
     from wms servers. Tries to use bbox as geometry if no geometry returned
     * @ param xml {Geography Markup Language}
     */
    var _parseWMSGetFeatureInfo = function (xml, layerid) {
        var features = new ol.format.WMSGetFeatureInfo().readFeatures(xml);
        var hasGeometry = true;
        features.forEach(feature => {
            // set layer mviewerid for features from WMS layers (already present for vector layers)
            feature.set("mviewerid", layerid);
            // if getfeatureinfo does not return geometry try to set geometry with center of extent
            if (feature.getGeometry() === undefined) {
                var properties = feature.getProperties();
                hasGeometry = false;
                for (p in properties) {
                    if (Array.isArray(properties[p]) && properties[p].length === 4) {
                        var center = ol.extent.getCenter(properties[p]);
                        feature.setGeometry(new ol.geom.Point(center));
                        hasGeometry = true;
                    }
                }
            }
        })
        return {
            'features': features,
            'hasGeometry': hasGeometry
        };
    }

    /**
     * Private Method: createContentHtml
     *
     * @param features : {ol.Features}
     * @param olayer {mviewer.overLayer}
     *
     * returns html content from ol.Features list whithout Mustache template.
     */

    var createContentHtml = function (features, olayer) {
        var html = '';
        var counter = 0;
        features.forEach(function (feature) {
            var nbimg = 0;
            counter+=1;
            var attributes = feature.getProperties();
            var fields = (olayer.fields) ? olayer.fields : $.map(attributes, function (value, key) {
                if (typeof value !== "object") {
                    return key;
                }
            });
            var featureTitle = feature.getProperties().title || feature.getProperties().name || feature.getProperties()[fields[0]];
            var li = '<li id="' + feature.ol_uid + '" class="item" ><div class="gml-item" ><div class="gml-item-title">'
            if (typeof featureTitle != 'undefined') {
                li += featureTitle;
            }
            li += '</div>';

            var aliases = (olayer.fields) ? olayer.aliases : false;
            fields.forEach(function (f) {
                if (attributes[f] && f != fields[0]) { // si valeur != null
                    fieldValue = attributes[f];
                    if ((typeof fieldValue == "string") && ((fieldValue.indexOf("http://") == 0) ||
                        (fieldValue.indexOf("https://") == 0))){
                        if (fieldValue.toLowerCase().match( /(.jpg|.png|.bmp)/ )) {
                            li += '<a onclick="mviewer.popupPhoto(\'' +  fieldValue + '\')" >' +
                            '<img class="popphoto" src="' + fieldValue + '" alt="image..." ></a>';
                        } else {
                            li += '<p><a href="' + fieldValue + '" target="_blank">' + _getAlias(f, aliases, fields) + '</a></p>';
                        }
                    } else {
                        li +=  '<div class="gml-item-field"><div class="gml-item-field-name">' +
                        _getAlias(f, aliases, fields) + '</div><div class="gml-item-field-value" > ' + fieldValue + '</div></div>';
                    }
                }
            });
            li += '</div></li>';
            html += $(li)[0].outerHTML + "\n";
        });
        return _customizeHTML(html, features.length);
    };

    /**
     * Private Method: applyTemplate
     * @param olfeatures : {ol.Features}
     * @param olayer {mviewer.overLayer}
     */

    var applyTemplate = function (olfeatures, olayer) {
        var tpl = olayer.template;
        var _json = function (str) {
            var result = null;
            try {
                result = JSON.parse(str);
            } catch (e) {
                result = str;
            }
            return result;
        };
        var obj = {features: []};
        var activeAttributeValue = false;
        // if attributeControl is used for this layer, get the active attribute value and
        // set this value as property like 'value= true'. This allows use this value in Mustache template
        if (olayer.attributefilter && olayer.layer.getSource().getParams()['CQL_FILTER']) {
            var activeFilter = olayer.layer.getSource().getParams()['CQL_FILTER'];
            activeAttributeValue = activeFilter.split(olayer.attributeoperator).map(e=>e.replace(/[\' ]/g, ''))[1];
        }
        olfeatures.forEach(function(feature){
            olayer.jsonfields.forEach(function (fld) {
                if (feature.get(fld)) {
                    var json = _json(feature.get(fld));
                    // convert String value to JSON value
                    // Great for use in Mustache template
                    feature.set(fld,json);
                }
            });
            if (activeAttributeValue) {
                feature.set(activeAttributeValue, true);
            }
            var geometryName = feature.getGeometryName();
            var excludedPropNames = ['fields_kv', 'serialized', 'feature_ol_uid', 'mviewerid', geometryName];
            var extractFeaturePropertiesFn = function (properties) {
                return Object.keys(properties).reduce((filteredProps, propertyName) => {
                    var value = properties[propertyName];
                    if (!excludedPropNames.includes(propertyName) && typeof value !== 'object') {
                        filteredProps[propertyName] = value;
                    }
                    return filteredProps;
                }, {});
            }

            // add a key_value array with all the fields, allowing to iterate through all fields in a mustache template
            var fields_kv = function () {
                var properties = extractFeaturePropertiesFn(this);
                return Object.entries(properties).map(([key, value]) => {
                    return {key, value};
                })
            }
            feature.setProperties({'fields_kv': fields_kv});
            // add a serialized version of the object so it can easily be passed through HTML GET request
            // you can deserialize it with `JSON.parse(decodeURIComponent(feature.getProperties().serialized()))`
            // when data is the serialized data
            var serialized = function () {
                return encodeURIComponent(JSON.stringify(extractFeaturePropertiesFn(feature.getProperties())));
            }
            feature.setProperties({'serialized': serialized})
            // attach ol_uid to identify feature in DOM (not all features have a feature id as property)
            obj.features.push({...feature.getProperties(), feature_ol_uid: feature.ol_uid});
        });
        var rendered = Mustache.render(tpl, obj);
        return _customizeHTML(rendered, olfeatures.length);
    };

    /**
     * Private Method: _getAlias
     *
     * @param value {String}
     * @param aliases {Array}
     * @param fields {Array}
     *
     * returns alias for a field from {mviewer.overLayer} definition
     */

    var _getAlias = function (value, aliases, fields) {
        var alias = "";
        if (aliases) {
            alias = aliases[$.inArray(value, fields)];
        } else {
            alias = value.substring(0, 1).toUpperCase() + value.substring(1, 50).toLowerCase();
        }
        return alias;
    };

    /* PUBLIC */

    /**
     * Public Method: queryLayer
     * @param y {Long}
     * @param x {Long}
     * @param proj {String} : SRS identifier code
     * @param layer {ol.layer.Layer}
     * @param featureid {String}
     *
     */

    var queryLayer = function (x, y, proj, layer, featureid) {
        (x,y,16);
        var pt = ol.proj.transform([x, y], proj, _projection.getCode());
        var p = _map.getPixelFromCoordinate(pt);
        $('#loading-indicator').show();
        _queryMap({coordinate:[pt[0],pt[1]]},{type: 'feature', layer: layer, featureid:featureid});
        search.clearSearchField();
    };

     /**
     * Public Method: init
     */

    var init = function () {
        _map = mviewer.getMap();
        _projection = mviewer.getProjection();
        _overLayers = mviewer.getLayers();
        _captureCoordinatesOnClick = configuration.getCaptureCoordinates();
        _tocsortedlayers = $(".mv-nav-item").map(function() {
                return $(this).attr('data-layerid');
            }).get();
        if (configuration.getConfiguration().application.templaterightinfopanel) {
            _panelsTemplate["right-panel"] = configuration.getConfiguration().application.templaterightinfopanel;
            _panelsTemplate["modal-panel"] = configuration.getConfiguration().application.templaterightinfopanel;
        }
        if (configuration.getConfiguration().application.templatebottominfopanel) {
            _panelsTemplate["bottom-panel"] = configuration.getConfiguration().application.templatebottominfopanel;
        }
        _sourceOverlay = mviewer.getSourceOverlay();
        $.each(_overLayers, function (i, layer) {
            if (layer.queryable) {
                _addQueryableLayer(layer);
            }
        });
    };

    /**
     * Public Method: enable
     *
     */

    var enable = function () {
        _map.on('singleclick', _clickOnMap);
        _map.on('pointermove', _mouseOverFeature);
        _toolEnabled = true;
    };

     /**
     * Public Method: disable
     *
     */

    var disable = function () {
       _map.un('singleclick', _clickOnMap);
       _map.un('pointermove', _mouseOverFeature);
       _toolEnabled = false;
    };

     /**
     * Public Method: enabled
     * returns {boolean}
     *
     */

    var enabled = function () {
        return _toolEnabled;
    };

     /**
     * Public Method: toggle
     *
     */

    var toggle = function () {
        if (_toolEnabled) {
            disable();
        } else {
            enable();
        }
    };

     /**
     * Public Method: toggleTooltipLayer
     * @param el {element class=layer-tooltip}
     */

    var toggleTooltipLayer =  function (el) {
        var a = $(el);
        if ( a.find("input").val() === 'false' ) {
            //On désactive l'ancien tooltip
            $(".layer-tooltip span.mv-checked").closest("a").find("input").val(false);
            $(".layer-tooltip span.mv-checked").removeClass("mv-checked").addClass("mv-unchecked");
            //On active le nouveau tooltip
            a.find("span").removeClass("mv-unchecked").addClass("mv-checked");
            a.find("input").val(true);
            _activeTooltipLayer = a.attr("data-layerid");
        } else {
            a.find("span").removeClass("mv-checked").addClass("mv-unchecked");
            a.find("input").val(false);
            _activeTooltipLayer =  false;
        }
    };

    /**
     * Public Method: addQueryableLayer
     * @param el {oLayer}
     */

    var _addQueryableLayer = function (oLayer) {
        _queryableLayers.push(oLayer.layer);
    };
    
    /**
     * Public Method: _getQueriedFeatures
     *
     */
    var _getQueriedFeatures = function() {
        return _queriedFeatures;
    }

    return {
        init: init,
        enable: enable,
        toggle: toggle,
        disable: disable,
        enabled : enabled,
        toggleTooltipLayer: toggleTooltipLayer,
        queryLayer: queryLayer,
        queryMap: _queryMap,
        formatHTMLContent: createContentHtml,
        templateHTMLContent: applyTemplate,
        addQueryableLayer: _addQueryableLayer,
        getQueriedFeatures: _getQueriedFeatures,
    };

})();
