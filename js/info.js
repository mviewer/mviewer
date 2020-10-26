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
                            vectorLayers[l] = {features:[]};
                            vectorLayers[l].features.push(feature);
                        }
                     }
                }
            });
            for(var layerid in vectorLayers) {
                if (mviewer.customLayers[layerid] && mviewer.customLayers[layerid].handle) {
                    mviewer.customLayers[layerid].handle(vectorLayers[layerid].features, views);
                } else if (mviewer.customControls[layerid] && mviewer.customControls[layerid].handle){
                    mviewer.customControls[layerid].handle(vectorLayers[layerid].features);
                } else {
                    var l = _overLayers[layerid];
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
                            "firstlayer": (id === 1),
                            "manyfeatures": (features.length > 1),
                            "nbfeatures": features.length,
                            "name": name,
                            "layerid": layerid,
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
                if (layer && featureid) {
                    url+= '&CQL_FILTER='+_overLayers[layer].searchid+'%3D%27'+featureid+'%27';
                }
                urls.push({url:url, layerinfos: _overLayers[visibleLayers[i].get('mviewerid')]});
            }
        }

        var requests = [];
        var carrousel=false;
        var callback = function (result) {
            $.each(featureInfoByLayer, function (index, response) {
                var layerinfos = response.layerinfos;
                var panel = layerinfos.infospanel;
                if (configuration.getConfiguration().mobile) {
                    panel = 'modal-panel';
                }
                var contentType = response.contenttype;
                var layerResponse = response.response;
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

                switch (contentType.split(";")[0]) {
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
                            showPin = true;
                        } else {
                            // no geometry could be found in gml
                            _queriedFeatures.push.apply(_queriedFeatures, getFeatureInfo.features);
                            var features = getFeatureInfo.features;
                            if (layerinfos.template) {
                                html_result.push(applyTemplate(features, layerinfos));
                            } else {
                                html_result.push(createContentHtml(features, layerinfos));
                            }
                        }
                    }
                }
                //If some results, apppend panels views
                if (html_result.length > 0) {
                    //Set view with layer info & html formated features
                    views[panel].layers.push({
                        "panel": panel,
                        "id": id,
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
            });
            var infoLayers = [];
            for (var panel in views) {
                infoLayers = infoLayers.concat(views[panel].layers);
            }
            mviewer.setInfoLayers(infoLayers);

            $.each(views, function (panel, view) {
                if (views[panel].layers.length > 0){
                        views[panel].layers[0].firstlayer=true;
                        var template = "";
                        if (configuration.getConfiguration().mobile) {
                            template = Mustache.render(mviewer.templates.featureInfo.accordion, view);
                        } else {
                            template = Mustache.render(mviewer.templates.featureInfo[_panelsTemplate[panel]], view);
                        }
                        $("#"+panel+" .popup-content").append(template);
                    //TODO reorder tabs like in theme panel

                    var title = $("[href='#slide-"+panel+"-1']").closest("li").attr("title");
                    $("#"+panel+" .mv-header h5").text(title);

                    if (configuration.getConfiguration().mobile) {
                        $("#modal-panel").modal("show");
                        $("#feature-info").tooltip("hide");
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
                        return feature.get("mviewerid") == views[panel].layers[0].layerid;
                    })
                    // change feature of sub selection
                    $('.carousel.slide').on('slide.bs.carousel', function (e) {
                        $(e.currentTarget).find(".counter-slide").text($(e.relatedTarget).attr("data-counter"));
                        var selectedFeature = _queriedFeatures.filter(feature => {
                            return feature.ol_uid == e.relatedTarget.id;
                        })
                        mviewer.highlightSubFeature(selectedFeature[0]);
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
                mviewer.highlightFeatures(_queriedFeatures);
                mviewer.highlightSubFeature(_firstlayerFeatures[0]);
                // show pin as fallback if no geometry for wms layer
                if (showPin || (!_queriedFeatures.length && !_firstlayerFeatures.length)) {
                    mviewer.showLocation(_projection.getCode(), _clickCoordinates[0], _clickCoordinates[1]);
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
            _featureTooltip = $('#feature-info');
            _featureTooltip.tooltip({
                animation: false,
                trigger: 'manual',
                container: 'body',
                html: true,
                template: mviewer.templates.tooltip
            });
        }
        var pixel = _map.getEventPixel(evt.originalEvent);
        var _o = mviewer.getLayers();
        // default tooltip state or reset tooltip
        _featureTooltip.tooltip('hide');
        $("#map").css("cursor", "");

        var feature = _map.forEachFeatureAtPixel(pixel, function (feature, layer) {
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

            _featureTooltip.css({
                left: (pixel[0]) + 'px',
                top: (pixel[1] - 15) + 'px'
            });
            _featureTooltip.tooltip('hide')
                .attr('data-original-title', title)
                .tooltip('fixTitle')
                .tooltip('show');
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
        var obj = {features: []};
        var activeAttributeValue = false;
        var geojson = new ol.format.GeoJSON();
        // if attributeControl is used for this layer, get the active attribute value and
        // set this value as property like 'value= true'. This allows use this value in Mustache template
        if (olayer.attributefilter && olayer.layer.getSource().getParams()['CQL_FILTER']) {
            var activeFilter = olayer.layer.getSource().getParams()['CQL_FILTER'];
            activeFilter.split(olayer.attributeoperator).map(e=>e.replace(/[\' ]/g, ''))[1];
        }
        olfeatures.forEach(function(feature){
            if (activeAttributeValue) {
                feature.setProperties({'activeAttributeValue': true});
            }
            // add a key_value array with all the fields, allowing to iterate through all fields in a mustache templaye
            var fields_kv = function () {
              fields_kv = [];
              keys = Object.keys(this);
              for (i = 0 ; i < keys.length ; i++ ) {
                if (keys[i] == "fields_kv" || keys[i] == "serialized" 
                    || keys[i] === "feature_ol_uid" || keys[i] === "mviewerid" || typeof this[keys[i]] === "object") {
                  continue;
                }
                field_kv = {
                  'key': keys[i],
                  'value': this[keys[i]]
                }
                fields_kv.push(field_kv);
              }
              return fields_kv;
            }
            feature.setProperties({'fields_kv': fields_kv});
            // add a serialized version of the object so it can easily be passed through HTML GET request
            // you can deserialize it with `JSON.parse(data)` when data is the serialized data
            var serialized = function () {
              return encodeURIComponent(geojson.writeFeature(feature));
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
        var noTooltipZone = [
            "#layers-container-box",
            "#sidebar-wrapper",
            "#bottom-panel",
            "#right-panel",
            "#mv-navbar",
            "#zoomtoolbar",
            "#toolstoolbar",
            "#backgroundlayerstoolbar-default",
            "#backgroundlayerstoolbar-gallery"
        ];
        $(noTooltipZone.join(", ")).on('mouseover', function() {
            if (_featureTooltip) {
                $('#feature-info').tooltip('hide');
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
        addQueryableLayer: _addQueryableLayer
    };

})();
