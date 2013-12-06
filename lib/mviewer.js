mviewer = (function () {
    /*
     * Private
     */
    
    Proj4js.defs["EPSG:3857"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
    Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    Proj4js.defs['IGNF:WGS84G'] = '+title=World Geodetic System 1984 ' +
			'+proj=longlat +towgs84=0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,' +
			'0.000000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs <>';
    
    var _proxy ="";
    
    var makeSameOrigin = function (url, proxy) {
        var sameOrigin = url.indexOf("http") !== 0;
        var urlParts = !sameOrigin && url.match(/([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/);
        if (urlParts) {
            var location = window.location;
            sameOrigin =
                urlParts[1] == location.protocol &&
                urlParts[3] == location.hostname;
            var uPort = urlParts[4],
                lPort = location.port;
            if (uPort != 80 && uPort != "" || lPort != "80" && lPort != "") {
                sameOrigin = sameOrigin && uPort == lPort;
            }
        }
        if (!sameOrigin) {
            if (proxy) {
                url = proxy + encodeURIComponent(url);
            }
        }
        return url;
    };

    var proxied = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {                    
        arguments[1] = makeSameOrigin(arguments[1], _proxy);
        return proxied.apply(this, [].slice.call(arguments));

    };
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
     * Property: _queryableLayers
     * Array of {OpenLayers.Layers.WMS} .
     */

    var _queryableLayers = [];

    /**
     * Property: _themes
     * {object} hash of all overlay Layers (for each sub theme) - static.
     */

    var _themes = null;
    
    /**
     * Property: _getFeatureInfo
     * {OpenLayers.Control.WMSGetFeatureInfo}
     */

    var _getFeatureInfo = null;      
    
    
    /**
     * Property: _overlay
     */
    
    var _overlay = null;

    /**
     * Property: _olsCompletionUrl
     * String. The OpenLs url used by the geocode control
     */
    var _olsCompletionUrl = null;

    /**
     * Property: renderer
     * {OpenLayers.Renderer}
     */

    var _renderer = ol.RendererHint.CANVAS;

    /**
     * Property: sketchSymbolizers
     * {OpenLayers.Symbolizer} . For styles used by measure controls
     */
    /*var sketchSymbolizers = {
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
    };*/

    /**
     * Private Method: createGetFeatureInfoControl
     *
     */
    var createGetFeatureInfoControl = function () {        
        _map.on('singleclick', function (evt) {
            var coordinate = evt.getCoordinate();            
            _overlay.setPosition(coordinate);
            _map.getFeatureInfo({
                pixel: evt.getPixel(),
                layers: $.grep( _queryableLayers, function( l, i ) {return l.getVisible();}),
                success: function (featureInfoByLayer) {
                    $("#popup-content").html('');                    
                    $.each(featureInfoByLayer, function (index, wfsResponse) {
                        var gml = $.parseXML(wfsResponse);
                        var obj = new ol.parser.ogc.GML_v2().read($.parseXML( wfsResponse ));  
                        toto = $.grep( _overLayers, function( l, i ) {
                            console.log('test');
                            return l.split(":")[1]===obj.features[0].featureId_.split(".fid")[0];
                            })
                        if (obj.features) {
                            $.each(obj.features, function (index, feature) {
                                var result = feature.featureId_;
                                $("#popup-content").append('<p>' + result + '</p>');
                            });
                        }                                               
                    });                    
                    $('#popup').show();
                },
                error: function () {
                    alert('erreur dans la requête getFeatureInfo');
                }
            });
        });


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

    var createContentHtml = function (features, title) {
        var html = '';
        features.forEach(function (feature) {
            var nbimg = 0;
            var olayer = _overLayers[feature.gml.featureNSPrefix + ":" + feature.gml.featureType];
            html += '<div class="popupitem"><h3>'+olayer.name+' : <font size=-1>' + feature.attributes[olayer.fields[0]] +'</font></h3>';
            var featuretype = feature.gml.featureType;
            var attributes = feature.attributes;
            var fields = (olayer.fields) ? olayer.fields : $.map(attributes, function (value, key) {
                return key;
            });
            var aliases = (olayer.fields) ? olayer.aliases : false;
            fields.forEach(function (f) {
                if (attributes[f] && f != fields[0]) { // si valeur != null
                    if (attributes[f].indexOf("http://") >= 0) {
                        if (attributes[f].toLowerCase().indexOf(".jpg") >= 0) {                                                       
                            html += '<a onclick="mviewer.popupPhoto(\'' +  attributes[f] + '\')" ><img class="popphoto" src="' + attributes[f] + '" alt="image..." ></a>';
                                
                        } else {
                            html += '<p><a href="' + attributes[f] + '" target="_blank">' + getAlias(f, aliases, fields) + '</a></p>';
                        }
                    } else {
                        html += '<p> ' + getAlias(f, aliases, fields) + ' : ' + attributes[f] + '</p>';
                    }
                }
            });
            html += '</div>' + "\n";            
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
        /*$("#measurelinebar").css('top', $("#measurelinebtn").offset().top - 4);
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
        });*/
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
                    url: mviewer.getOlsCompletionUrl(),
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
                            str += '<li data-icon="false"><a hreaf="#" onclick="mviewer.zoomToLocation(' + res[i].x + ',' + res[i].y + ',' + res[i].classification + ',\'' + res[i].fulltext.replace("'", "*") + '\');">' + res[i].fulltext + '</a></li>';
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
     * Private Method: _mapChange
     *
     *Parameter e - event
     */

    var _mapChange = function (e) {
        if ($("#sharepanel-popup").css("visibility") === "visible") {            
            this.setPermalink();
        }
    };
    
     /**
     * Private Method: _getLayerByName
     *
     *Parameter name - layer name
     */
     
    var _getLayerByName = function (name) {
        return $.grep(_map.getLayers().getArray(), function(layer, i) { return layer.get('name') === name; })[0];
    };
	
	 /**
     * Private Method: _showCheckedLayers
     *
     *Parameter 
     */

    var _showCheckedLayers = function (xml) {
        $(xml).find('layer[visible="true"]').each(function() {			
			var l = _getLayerByName($(this).attr("name"));
            (l.src)?l.src.setVisible(true):l.setVisible(true);
		});
    };
	
	/**
     * Private Method: _initDataList
     *
     *Parameter 
     */

    var _initDataList = function () {
		var htmlListGroup = '';
		$.each(_themes, function (id, theme) {
			var htmlListLayers = ""
			$.each(_themes[theme.id].layers, function (id, layer) {
				htmlListLayers += new TPLLayercontrol(layer.id, layer.name, mviewer.getLegendUrl(layer) , 
					layer.queryable, layer.checked, layer.enabled).html();
			});
			htmlListGroup +=  new TPLLayergroup(theme.name, htmlListLayers, theme.collapsed).html();           
        });	       
			
        $("#datalist").html(htmlListGroup);
        $("#datalist").trigger("create");
		
		$( ".togglelayer" ).each(function() {		
			$( this ).bind( "change",function() {			
				mviewer.toggleOverLayer(this.name);
			});
		});
		
		$( ".opacity-btn" ).each(function() {		
			$( this ).bind( "click",function() {
				$("#opacityLayer-slider").attr("name",this.name);
				$("#opacityLayer-slider").val(mviewer.getLayerOpacity(this.name)).slider("refresh");
				$("#opacityLayer-popup").popup('open',{positionTo: $( this )});
			});
		});
		
		$( ".metadata-btn" ).each(function() {		
			$( this ).bind( "click",function() {
				var md = mviewer.getLayerMetadata(this.name);
				$("#metadata-target").attr("href",md.url);
				$.ajax({
					url: md.csw,				  				  
                    success: function (data) {	
                        var mdtitle = $(data).find("dc\\:title, title").text();
                        $("#metadata-title").text(mdtitle);                    
                        var mdabstract = $(data).find("dct\\:abstract, abstract").text();                   
                        $("#metadata-abstract").text(mdabstract);
                    }
				});				
				$("#metadataPopup").popup('open',{positionTo: $( this )});
			});
		});
	};

    /**
     * Private Method: _updateLayersGroup
     *
     *Parameter e - event
     */

    var _updateLayersScaleDependancy = function (e) {
        // toDO
        var currentScale = _map.getScale();
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
            l =  new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: params.attr("url"),                    
                    crossOrigin: null,                   
                    params: {
                        'LAYERS': params.attr("layers"),
                        'VERSION': '1.1.1',
                        'FORMAT': params.attr("format"),
                        'TRANSPARENT': false,
                        'TILED': true
                    },
                    attributions: [new ol.Attribution({
                        html: params.attr("attribution")
                    })]
                }),
                visible: false
            });
            l.set('name', params.attr("label"));
            l.set('blid', params.attr("id"));            
            
            _backgroundLayers.push(l);
            _map.addLayer(l);
            //_map.setLayerIndex(l, _backgroundLayers.length);
            break;
        case "WMTS":
            $.ajax({
                url:params.attr("url"),
                dataType: "xml",
                data: {
                    SERVICE: "WMTS",
                    VERSION: "1.0.0",
                    REQUEST: "GetCapabilities"
                },
                success: function (xml) {
                    var parser = new ol.parser.ogc.WMTSCapabilities();
                    var capabilities = parser.read(xml);
                    var sourceOptions = ol.source.WMTS.optionsFromCapabilities(capabilities, params.attr("layers"));
                    // we need to set the URL because it must include the key.
                    sourceOptions.urls = [params.attr("url")];
                    sourceOptions.attributions =  new ol.Attribution({html:params.attr("attribution")});                    
                    var source = new ol.source.WMTS(sourceOptions);
                    l = new ol.layer.Tile({source: source});
                    l.setVisible(false);
                    l.set('name', params.attr("label"));
                    l.set('blid', params.attr("id"));
                    _map.addLayer(l);
                    _backgroundLayers.push(l);
                    //put this layer at bottom
                    mviewer.reorderLayer(l,0);
                }

            });
            break;
            
        case "OSM":           
            l = new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: params.attr("url"),
                    crossOrigin: null,
                    attributions: [new ol.Attribution({
                        html: params.attr("attribution")
                    })]
                }),
                visible: false
            });
            l.set('name', params.attr("label"));
            l.set('blid', params.attr("id"));            
            _backgroundLayers.push(l);
            _map.addLayer(l);
            //_map.setLayerIndex(l, _backgroundLayers.length);
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
            if (item.layer.getVisible()) {
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
            var l = _getLayerByName(layers[i]);            
            l.setVisible(true);            
        }
        _overwiteThemeProperties(layers);
    };

    /**
     * Private Method: _getVisibleOverLayers
     *
     * Parameter: layers (Array of strings)
     */

    var _overwiteThemeProperties = function (layers) {
        $.each(_themes, function (i, theme) {
            $.each(theme.layers, function (j, l) {
                if (layers.indexOf(l.name) != -1) {
                    l.checked = true;
					$("#datalist").find('input[name="'+l.id+'"]').prop( "checked", true ).checkboxradio( "refresh" );
					
                } else {
                    l.checked = false;
					$("#datalist").find('input[name="'+l.id+'"]').prop( "checked", false ).checkboxradio( "refresh" );
                }
            });
        });
    };


    /*
     * Public
     */

    return {     

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
            //_map.events.triggerEvent('mviewer.' + tool + 'tool');
        },
        
        /**
         * Public Method: zoomOut
         *
         */

        zoomOut: function () {            
           var v = _map.getView();
           v.setZoom(v.getZoom() -1);
        },
        
        /**
         * Public Method: zoomIn
         *
         */

        zoomIn: function () {
            var v = _map.getView();
            v.setZoom(v.getZoom() +1);
        },
        
         /**
         * Public Method: zoomToInitialExtent
         *
         */

        zoomToInitialExtent: function () {           
           _map.getView().fitExtent(_extent, _map.getSize());
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
            for (var i = 0; i < _backgroundLayers.length; i += 1) {
                var l = _backgroundLayers[i];
                if (l.getVisible()) {
                    l.setVisible(false);
                } else {
                    (l.get('blid') === baseLayerId) ? l.setVisible(true) : l.setVisible(false);
                }
            }
            $.each(_backgroundLayers, function (id, layer) {
                var opt = $(_options).find("baselayers").attr("style");
                var elem = (opt === "gallery") ? $('#' + layer.get('blid') + '_btn').closest('li') : $('#' + layer.get('blid') + '_btn');
                if (layer.getVisible()) {
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
            _overLayers[id].layer.setOpacity(value / 100);
        },
		
		/**
         * Public Method: getLayerOpacity
         *
         */

        getLayerOpacity: function (id) {
            return _overLayers[id].layer.getOpacity() * 100;
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

        /**
         * Public Method: getLegendUrl
         *
         */

        getLegendUrl: function (layer) {
			// for legend scale dependancy add this option &SCALE='+parseInt(_map.getScale())
			// todo 
            return layer.url + '?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer.id + '&style=' + layer.style + '&legend_options=fontName:Trebuchet%20MS;fontAntiAliasing:true;fontColor:0x222222;fontSize:12;dpi:96&TRANSPARENT=true';
        },

        /**
         * Public Method: setPermalink
         *
         */

        setPermalink: function () {                     
            var c = _map.getView().getCenter();
            var linkParams = {};
            linkParams.x = encodeURIComponent(Math.round(c[0]));
            linkParams.y = encodeURIComponent(Math.round(c[1]));
            linkParams.z = encodeURIComponent(_map.getView().getZoom());
            linkParams.lb = encodeURIComponent(this.getActiveBaseLayer());
            linkParams.l = encodeURIComponent(_getVisibleOverLayers());
            if (config.config) {
                linkParams.config = config.config;
            }
            var url = window.location.href.split('?')[0] + '?' + $.param(linkParams);            
            $("#permalinklink").attr('href',url);
            $("#permaqr").attr("src","http://chart.apis.google.com/chart?cht=qr&chs=140x140&chl=" + encodeURIComponent(url));
            return url;
        },

        /**
         * Public Method: resetLineMeasure
         *
         */

        resetLineMeasure: function () {
           /* measureControls.line.deactivate();
            measureControls.line.activate();
            _map.events.triggerEvent('mviewer.updatelinemeasure', {
                measure: 0,
                units: 'm'
            });*/
        },

        /**
         * Public Method: resetAreaMeasure
         *
         */

        resetAreaMeasure: function () {
            /*measureControls.polygon.deactivate();
            measureControls.polygon.activate();
            _map.events.triggerEvent('mviewer.updateareameasure', {
                measure: 0,
                units: 'm'
            });*/
        },

        /**
         * Public Method: getInitialExtent
         *
         */

        getInitialExtent: function () {
            return _extent;
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

        init: function (xml) {
           // try {
                //Ol.DOTS_PER_INCH = 25.4 / 0.28;
                _options = xml;
                var options = $(xml).find("mapoptions");
                _extent = options.attr("extent").split(",").map(Number);             
                
                $( "#popup-closer" ).bind( "click", function() {
                    $("#popup").hide();
                    $("#popup-closer").blur();
                    return false;
                });
                _overlay =  new ol.Overlay({element: $("#popup")});
                _map = new ol.Map({
                    target: 'map',
                    controls: [
                        //new ol.control.FullScreen(),
                        new ol.control.ScaleLine(),
                        new ol.control.Attribution()                        
                      ],
                    /*layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM({
                                url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                crossOrigin: null
                            })
                        })
                    ],*/
                    overlays: [_overlay],
                    renderer: _renderer,
                    view: new ol.View2D({
                        center: ol.proj.transform([350300, 6789000], 'EPSG:2154', 'EPSG:3857'),
                        zoom: 8
                    })
                });
                //mviewer = mviewer;
                _proxy = $(xml).find('proxy').attr("url");
                _olsCompletionUrl = $(xml).find('olscompletion').attr("url");
                var bl = $(xml).find('baselayer');
                var th = $(xml).find('theme');
				//baselayertoolbar
                var baselayerControlStyle = $(xml).find('baselayers').attr("style");
				var baselayerToolbar = new TPLBackgroundlayerstoolbar(baselayerControlStyle).init();				
                $(bl).each(function () {
                    _createBaseLayer($(this));
					var nodeLayer = new TPLBackgroundLayerControl($(this), baselayerControlStyle).html();					
                });                
				baselayerToolbar.create();
                _themes = {};
				var themeLayers = {};
                var themes = $(xml).find('theme');
                $(themes).each(function () {
                    var themeid = $(this).attr("id");
                    _themes[themeid] = {};
					_themes[themeid].collapsed = $(this).attr("collapsed");
                    _themes[themeid].id = themeid;
                    _themes[themeid].name = $(this).attr("name");                    
                    _themes[themeid].layers = {};
                    var layersXml = $(this).find('layer');
                    $(layersXml.get().reverse()).each(function () {
                        var layerId = $(this).attr("id");
                        themeLayers[layerId] = {};
                        themeLayers[layerId].id = layerId;
                        themeLayers[layerId].name = $(this).attr("name");
                        themeLayers[layerId].style = $(this).attr("style");
                        themeLayers[layerId].attribution = $(this).attr("attribution");
                        themeLayers[layerId].metadata = $(this).attr("metadata");
						themeLayers[layerId].metadatacsw = $(this).attr("metadata-csw");
                        themeLayers[layerId].url = $(this).attr("url");
                        themeLayers[layerId].scale = {};
                        themeLayers[layerId].scale.min = parseInt($(this).attr("scalemin"));
                        themeLayers[layerId].scale.max = parseInt($(this).attr("scalemax"));
                        themeLayers[layerId].queryable = ($(this).attr("queryable") == "true") ? true : false;
                        themeLayers[layerId].checked = ($(this).attr("visible") == "true") ? true : false;
                        themeLayers[layerId].enable = true;
                        if ($(this).attr("fields") && $(this).attr("aliases")) {
                            themeLayers[layerId].fields = $(this).attr("fields").split(",");
                            themeLayers[layerId].aliases = $(this).attr("aliases").split(",");
                        }                     
                        
                        var l = new ol.layer.Image({
                            source: new ol.source.ImageWMS({
                                url: $(this).attr("url"),					
                                crossOrigin: null,
                                getFeatureInfoOptions: {
                                    method: ol.source.WMSGetFeatureInfoMethod.XHR_GET,
                                    params: {
                                        'INFO_FORMAT': 'application/vnd.ogc.gml'                                        
                                    }
                                },
                                params: {
                                    'LAYERS': $(this).attr("id"),
                                    'STYLES':(themeLayers[layerId].style)? themeLayers[layerId].style : '',
                                    'FORMAT': 'image/png',
                                    'TRANSPARENT': true
                                }
                            })
                        });
                        
                        l.setVisible(false);
                        l.set('name', $(this).attr("name"));
                        themeLayers[layerId].layer = l;
                        _themes[themeid].layers[layerId] = themeLayers[layerId];
                        if (themeLayers[layerId].queryable) {
                            _queryableLayers.push(l);
                        }                        
                        _overLayers[layerId] = themeLayers[layerId];
                        _map.addLayer(l);                        
                    }); //fin each	layer					
                }); // fin each theme                

                _initDataList();
                _initTools();
                _initSearch();
                _initShare();
                _initPanelsPopup();				
				
                //PERMALINK
                if (config.x && config.y && config.z) {
                    _map.getView().setCenter([config.x, config.y]);
                    _map.getView().setZoom(config.z);
                } else {
                   _map.getView().fitExtent(_extent, _map.getSize());
                }
                if (config.lb && $.grep(_backgroundLayers, function (n) {
                    return n.get('blid') === config.lb;
                })[0]) {

                    this.setBaseLayer(config.lb);
                    //todo asynchronous layers WMTS
                } else {
                    this.setBaseLayer($(xml).find('baselayers').find('[visible="true"]').attr("id"));
                }
				
                if (config.l) {
                    _setVisibleOverLayers(config.l);
                } else {
                    _showCheckedLayers(xml);
                }
                
                createGetFeatureInfoControl();

                var control;
                /*for (var key in measureControls) {
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

                
                
                _map.events.register('changelayer', null, _mapChange);
                _map.events.register('moveend', null, _mapChange);
				_map.events.register('zoomeend', null, _updateLayersScaleDependancy);*/

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

            /*} catch (err) {
                alert(err.message);
            }*/
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
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
            switch (classification) {
                case 1:
                case 2:
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
            _map.getView().setCenter(ptResult);
            _map.getView().setZoom(zoom);
            $("#searchresults").html("").listview("refresh");
            $("#searchtool .ui-icon-delete").click();

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