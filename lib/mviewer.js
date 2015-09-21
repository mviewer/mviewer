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
    
    Proj4js.defs["EPSG:3857"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
    Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    Proj4js.defs['IGNF:WGS84G'] = '+title=World Geodetic System 1984 ' +
			'+proj=longlat +towgs84=0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,' +
			'0.000000 +a=6378137.0000 +rf=298.2572221010000 +units=m +no_defs <>';    
   
    var _WMTSTileMatrix = {};
    var _WMTSTileResolutions = {};
    
    var _proxy ="";    
    
    var _authentification= {enabled:false};
    
    var _ajaxURL = function (url) {
        // relative path
        if (url.indexOf('http')!=0) {
            return url;
        }
        // same domain
        else if (url.indexOf(location.protocol + '//' + location.host)===0) {
            return url;
        }
        else {
            return  _proxy + encodeURIComponent(url);
        }
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
     * Property: _projection
     * {ol.projection} The map projection
     */
    var _projection = null;

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
     * Property: _center
     * 
     */

    var _center = null;

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
     * Property: _elasticSearchUrl
     * String. The Elasticsearch url used by search function
     */
    var _elasticSearchUrl = null;
    
    /**
     * Property: _marker
     */
     
    var _marker = null;

    /**
     * Property: renderer
     * {OpenLayers.Renderer}
     */

    var _renderer = 'canvas';

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
     * Private Method: _queryMap()
     *
     */
    var _queryMap = function (evt,layer) {
        var featureInfoByLayer = [];
            var visibleLayers =  $.grep( _queryableLayers, function( l, i ) {return l.getVisible();});
            $("#popup-content").html('');
            $('#popup').hide();
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, _projection.getCode(), 'EPSG:4326'));
            var hdms2 = hdms.replace(/ /g,"").replace("N","N - ");
            $("#hdms").text(hdms2);
            _overlay.setPosition(coordinate);          
           
            var urls = [];
            for (var i = 0; i < visibleLayers.length; i++) {
                var url = visibleLayers[i].getSource().getGetFeatureInfoUrl(
                    evt.coordinate, _map.getView().getResolution(), _map.getView().getProjection(),
                {'INFO_FORMAT': _overLayers[visibleLayers[i].getSource().getParams()['LAYERS']].infoformat,
                'FEATURE_COUNT': _overLayers[visibleLayers[i].getSource().getParams()['LAYERS']].featurecount
                });
                urls.push({url:url, layerinfos: _overLayers[visibleLayers[i].getSource().getParams()['LAYERS']]});
            }            
           
            var requests = [];
            var carrousel=false;
            var idcarrousel=0;
            var callback = function (result) {               
                var tabs = Array(_map.getLayers().getLength());
                var featureInfosHtml = [];
                $.each(featureInfoByLayer, function (index, response) {
                    var contentType = response.contenttype;                    
					var layerResponse = response.response;
                    var slide = null;
                    if ((layerResponse.search('<!--nodatadetect--><!--nodatadetect-->')<0) && (layerResponse.search('<!--nodatadetect-->\n<!--nodatadetect-->')<0))
                    {                        
                        idcarrousel=idcarrousel+1;
                        var name=response.layerinfos.name;                       
                        var gml = null;
                        var html = null; 
                       
                        switch (contentType.split(";")[0]) {
                            case "text/html":
                                html = layerResponse;                                
                                break;							
                            case "application/vnd.ogc.gml" :
                                gml = $.parseXML(layerResponse);
                                break;							
                            default :
                                alert("Ce format de réponse : " + contentType +" n'est pas pris en charge");															
                        }					
                        if (html) {                                                      
                            tabs.splice(response.layerinfos.rank,1,'<li><a href="#slide-'+idcarrousel+'" >'+name+'</a></li>');
                            slide =$('<div id="slide-'+idcarrousel +'" ><ul class="bjqs"> </ul> </div>'); 
                            //test si présence d'une classe .carrousel eg template geoserver.
                            //Les éléments trouvés servent à la création d'un carrousel dédié
                            var carrousel_data=$(layerResponse).find(".carrousel li");                                                     
                            if(carrousel_data.length == 0){                                
                                $(slide).find("ul").append('<li>'+layerResponse+'</li>');
                            }
                            else {							
                                for( var i=0; i<carrousel_data.length; i++){						
                                    $(slide).find("ul").append(carrousel_data[i]);                                    				 
                                }
                            }
                        }
                        else {
                            if (gml) {
                                var obj = _parseGML(gml);                            
                                if (obj.features.length > 0) {                                                                     
                                    tabs.splice(response.layerinfos.rank,1,'<li><a href="#slide-'+idcarrousel+'" >'+name+'</a></li>');
                                    slide=$('<div class="mycarrousel" id="slide-'+idcarrousel +'" ><ul class="bjqs"> </ul> </div>'); 
                                    var oLayer =  _overLayers[obj.features[0].layername];                                    
                                    $(slide).find("ul").append('<li>'+createContentHtml(obj.features, oLayer)+'</li>');                                      
                                }
                            }
                        }
                        if (slide) { featureInfosHtml.push(slide);}
                      }
                    });
                			     
            	if(featureInfosHtml.length>0){                    
                    $("#popup-content").append('<div id="selector"> <ul id=ulnav></ul></div>');
                    $("#selector").append(featureInfosHtml);                    
                    tabs = tabs.filter(function(n){ return n != undefined });                     
                    $("#ulnav").append(tabs.reverse());
                    $('#popup').show();
                    for(i=1;i<=idcarrousel;i++){
                        $('#slide-'+i).bjqs({
                            automatic : false,
                            width : 300,
                            height:300,
                            showmarkers: true,
                            showmarkers : true, // Show individual slide markers
                            centermarkers : true,
                            nexttext : '>', // Text for 'next' button (can use HTML)
                            prevtext : '<' 
                        });
                    }                    
                    $( "#selector" ).tabs();
                    var offset = (_map.getView().getResolution() *  $('#popup').outerHeight()) /1.5;                   
                    var c = _overlay.getPosition();
                     $("#popup-content img").click(function(){mviewer.popupPhoto($(this).attr("src"))});
                     $("#popup-content img").on("vmouseover",function(){$(this).css('cursor', 'pointer');}).attr("title","Cliquez pour agrandir cette image");
                    var pan = ol.animation.pan({
                        duration: 2000,
                        source: _map.getView().getCenter()
                    });
                    _map.beforeRender(pan);
                    _map.getView().setCenter([c[0], c[1] + offset]);
                }

                $.mobile.loading('hide');
                
            };

            var ajaxFunction = function () {
                for (var request, i = -1; request = urls[++i];) {
                    requests.push($.ajax({
                        url: _ajaxURL(request.url),
                        layer: request.layerinfos,
                        success: function (response, textStatus, request) {
                            featureInfoByLayer.push({response:response,layerinfos:this.layer, contenttype:request.getResponseHeader("Content-Type")});
                        }
                    }));
                }
            };

            // using $.when.apply() we can execute a function when all the requests 
            // in the array have completed
            $.when.apply(new ajaxFunction(), requests).done(function (result) {
                callback(result)
            });
    };

    /**
     * Private Method: createGetFeatureInfoControl
     *
     */
    var createGetFeatureInfoControl = function () {         
        _map.on('singleclick', function (evt) {
            $.mobile.loading('show', {
                text: 'Interrogation en cours.',
                textonly: false,
                textVisible: false,
                theme: 'b',        
                html: ''
            });
             _queryMap(evt);            
        });
    };
    
    var _convertScale2Resolution = function (scale) {
         return scale * 0.28/1000;
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

    var createContentHtml = function (features, olayer) {
        var html = '';
        features.forEach(function (feature) {
            var nbimg = 0;            
            html += '<div class="popupitem"><h3>'+olayer.name+' : <font size=-1>' + feature.attributes[olayer.fields[0]] +'</font></h3>';            
            var attributes = feature.attributes;
            var fields = (olayer.fields) ? olayer.fields : $.map(attributes, function (value, key) {
                return key;
            });
            var aliases = (olayer.fields) ? olayer.aliases : false;
            fields.forEach(function (f) {
                if (attributes[f] && f != fields[0]) { // si valeur != null
                    if (attributes[f].indexOf("http://") >= 0) {
                        //if ((attributes[f].toLowerCase().indexOf(".jpg") + attributes[f].toLowerCase().indexOf(".png")) >= 0) {   
                        if (attributes[f].toLowerCase().match( /(.jpg|.png|.bmp)/ )) { 
                            html += '<a onclick="mviewer.popupPhoto(\'' +  attributes[f] + '\')" ><img class="popphoto" src="' + attributes[f] + '" alt="image..." ></a>';
                                
                        } else {
                            html += '<p><a href="' + attributes[f] + '" target="_blank">' + getAlias(f, aliases, fields) + '</a></p>';
                        }
                    } else {
                        html +=  getAlias(f, aliases, fields) + ' : ' + attributes[f] + '</br>';
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
                //OpenLs request
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
                            str += '<li class="geoportail" data-icon="false"><a href="#" onclick="mviewer.zoomToLocation(' + res[i].x + ',' + res[i].y + ',' + res[i].classification + ',\'' + res[i].fulltext.replace("'", "*") + '\');">'+
                            '<img src="img/geoportal.png" alt="icone" class="ui-li-icon ui-corner-none">'
                            + res[i].fulltext + '</a></li>';
                        }
                        $(".geoportail").remove()
                        $("#searchresults").append(str).listview("refresh");
                    }
                });
                //ElasticSearch request
                _sendElasticsearchRequest($(this).val());
            }
        });
    };
    
    function ShapeToPoint(location){

        var point=[];
        if (location == null)
            return;
        switch (location.type)
        {
           
            case "MultiPoint": point[0]=location.coordinates[0][0];
                               point[1]=location.coordinates[0][1];
            break;
            case "MultiLineString": point[0]=location.coordinates[0][0][0];
                                    point[1]=location.coordinates[0][0][1];
            break;
            case "LineString": point[0]=location.coordinates[0][0];
                                    point[1]=location.coordinates[0][1];
            break;
            case "MultiPolygon"  : point[0]=location.coordinates[0][0][0][0];
                                   point[1]=location.coordinates[0][0][0][1];
            break;

            default: 
                                   point[0]=location.coordinates[0];
                                   point[1]=location.coordinates[1];
            break;

        }
        return point;

    }
    
    /**
     * Private Method: _sendElasticsearchRequest
     *
     */

    var _sendElasticsearchRequest = function (val) {  
        var visibleLayers =  $.grep( _queryableLayers, function( l, i ) {return l.getVisible();});
        if (visibleLayers.length > 0) {
            var queryLayers = [];
            var currentExtent = _map.getView().calculateExtent(_map.getSize());
            var pe = ol.proj.transform(currentExtent, _projection.getCode(), 'EPSG:4326');        
            for (var i = 0; i < visibleLayers.length; i++) {            
                queryLayers.push({"type":{"value": visibleLayers[i].getSource().getParams()['LAYERS']}});
            }
            var queryFilter = {
              "query": {
                "filtered" : {
                    "query" : {
                      /*"match": {
                        "_all": val
                      }*/
                      "fuzzy_like_this" : {              
                          "like_text" : val,
                          "max_query_terms" : 12
                      }
                    },
                      "filter" :  {
                         "and": {
                           "filters": [
                             {"or" : 
                                {"filters": queryLayers}                           
                             },
                           {
                              "geo_shape": {
                        "geometry": {
                            "shape": {
                                "type": "envelope",
                                "coordinates" : [[ pe[0], pe[3] ],[ pe[2], pe[1] ]]
                            }
                        }
                    }}
                           ]
                         }             
                      }
                }
              }
            };
            $.ajax({
                type: "POST",
                url: mviewer.getElasticsearchUrl(),
                crossDomain: true,
                data: JSON.stringify(queryFilter),
                dataType: "json",
                success: function (data) {                       
                    var str = "";
                   
                    for (var i = 0, len = data.hits.hits.length; i < len && i < 5; i++) {
                        var point=ShapeToPoint(data.hits.hits[i]._source.geometry);
                        var loc = [data.hits.hits[i]._source.geometry.coordinates[0], data.hits.hits[i]._source.geometry.coordinates[1]];
                        str += '<li class="elasticsearch" data-icon="false"><a href="#" ' +
                        //'onclick="mviewer.zoomToLocation(' + data.hits.hits[i]._source.geometry.lon + ',' + data.hits.hits[i]._source.geometry.lat + ',7);" ' +
                        'onclick="mviewer.queryLayer(' + point[0] + ',' + point[1] + ',\'EPSG:4326\',\''+ data.hits.hits[i]._type+'\');"' +
                        'onmouseover="mviewer.showLocation(' + point[0] + ',' + point[1] + ');" ' +
                        'onmouseout="mviewer.hideLocation();" ' +
                        'title="'+$.map(data.hits.hits[i]._source, function(el) { if (typeof(el)==='string') {return el}; }).join(", \n")+'">' +
                        '<img src="'+_overLayers[data.hits.hits[i]._type].iconSearch +' " alt="icone" class="ui-li-icon ui-corner-none">'
                         + data.hits.hits[i]._source.title +                         
                            '</a></li>';                        
                    }
                    $(".elasticsearch").remove();
                    $("#searchresults").append(str).listview("refresh");
                }
            });
        }
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
        //Accessibilité
        $.ajax({
            url: 'panels/accessibility.html',
            dataType: "text",
            success: function (html) {
                $("#accessibility").prepend(html);
                $('#accessibility').jScrollPane();
            }
        });
        /*//Conditions d'utilisation
        $.ajax({
            url: 'panels/usage.html',
            dataType: "text",
            success: function (html) {
                $("#usage").prepend(html);
                $('#usage').jScrollPane();
            }
        });*/
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
            mviewer.setPermalink();
        }
        if (_elasticSearchUrl && $("#searchfield").val()) {
           _sendElasticsearchRequest($("#searchfield").val());
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
     * Private Method: _initDataList
     *
     *Parameter 
     */

    var _initDataList = function () {
		var htmlListGroup = '';
        var reverse_themes = [];
        $.each(_themes, function (id, theme) {  
            reverse_themes.push(theme);
        });
        
		$.each(reverse_themes.reverse(), function (id, theme) {            
			var htmlListLayers = ""
            var reverse_layers = [];
            $.each(_themes[theme.id].layers, function (id, layer) {
                reverse_layers.push(layer);
            });
			$.each(reverse_layers.reverse(), function (id, layer) {
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
                $("#metadata-abstract").text("Récupérations des informations ...");
				var md = mviewer.getLayerMetadata(this.name);
				$("#metadata-target").attr("href",md.url);
				$.ajax({
					url: _ajaxURL(md.csw),				  				  
                    success: function (data) {	
                        var mdtitle = $(data).find("dc\\:title, title").text();
                        $("#metadata-title").text(mdtitle);                    
                        var mdabstract = $(data).find("dct\\:abstract, abstract").text();
                        //take the 397 first chars
                        var truncatevalue = 397;
                        var shortabstract = mdabstract.substr(0,truncatevalue);
                        if (mdabstract.length > shortabstract.length) {
                             shortabstract += " ...";
                        }
                        var urls = _findUrls(mdabstract);
                        $.each(urls, function( index, url ) {
                            if ((mdabstract.indexOf(url) + url.length) < truncatevalue) {
                                shortabstract = shortabstract.replace(url,'<a href="'+url+'" target="_blank" >'+url+'</a>');
                            }
                        });
                        $("#metadata-abstract").html(shortabstract);
                    }
				});				
				$("#metadataPopup").popup('open',{positionTo: $( this )});
			});
		});
	};
    
    var _findUrls = function (text) {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null )
        {
            var token = matchArray[0];
            urlArray.push( token );
        }

        return urlArray;
    }

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
                    maxZoom: params.attr("maxzoom") || 18,
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
            break;
        case "WMTS":
            if (params.attr("fromcapacity") == "false") {
                var matrixset = params.attr("matrixset");                
                var projectionExtent = _projection.getExtent();                              
                l = new ol.layer.Tile({
                  source: new ol.source.WMTS({
                    url:  params.attr("url"),
                    layer: params.attr("layers"),
                    matrixSet: matrixset,
                    style: params.attr("style"),
                    format: params.attr('format'),
                    attributions: [new ol.Attribution({html:params.attr("attribution")})],
                    projection: _projection,
                    tileGrid: new ol.tilegrid.WMTS({
                      origin: ol.extent.getTopLeft(projectionExtent),
                      resolutions: _WMTSTileResolutions[matrixset],
                      matrixIds: _WMTSTileMatrix[matrixset]
                    })
                  })
                });               
                l.setVisible(false);
                l.set('name', params.attr("label"));
                l.set('blid', params.attr("id"));
                _map.addLayer(l);
                _backgroundLayers.push(l);
            }
            else {
                $.ajax({
                    url:_ajaxURL(params.attr("url")),
                    dataType: "xml",
                    data: {
                        SERVICE: "WMTS",
                        VERSION: "1.0.0",
                        REQUEST: "GetCapabilities"
                    },
                    success: function (xml) {
                        // TODO  WMTS Capabilities in beta2                        
                    }
                });
            }
            break;
            
        case "OSM":           
            l = new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: params.attr("url"),
                    crossOrigin: 'anonymous',
                    maxZoom: params.attr("maxzoom") || 18,
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
            (l.src)?l.src.setVisible(true):l.setVisible(true);           
        }
        _overwiteThemeProperties(layers);        
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
     * Private Method: _overwiteThemeProperties
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
    
     /**
     * Private Method:  parseWMCResponse
     *
     */
    
    var _parseWMCResponse = function (response) {
        var wmc = $('ViewContext', response);
        var wmc_extent = {};
        wmc_extent.srs=$(wmc).find('General > BoundingBox').attr('SRS');
        wmc_extent.minx = parseInt($(wmc).find('General > BoundingBox').attr('minx'));
        wmc_extent.miny = parseInt($(wmc).find('General > BoundingBox').attr('miny'));
        wmc_extent.maxx = parseInt($(wmc).find('General > BoundingBox').attr('maxx'));
        wmc_extent.maxy = parseInt($(wmc).find('General > BoundingBox').attr('maxy'));
        var map_extent = ol.proj.transform([wmc_extent.minx, wmc_extent.miny, wmc_extent.maxx, wmc_extent.maxy], wmc_extent.srs, _projection.getCode());
        var title = $(wmc).find('General > Title').text() ||  $(wmc).attr('id');   
        var themeLayers = {};
        $(wmc).find('LayerList > Layer').each(function() {        
            // we only consider queryable layers
            if ($(this).attr('queryable')=='1') {
                var oLayer = {};
                oLayer.checked = ($(this).attr('hidden')==='0')?true:false;
                oLayer.id = $(this).children('Name').text();
                oLayer.name = $(this).children('Title').text();                
                oLayer.attribution = "";
                oLayer.metadata = $(this).find('MetadataURL > OnlineResource').attr('xlink:href');
                //fixme
                if (oLayer.metadata.search('geonetwork') > 1) {
                    var mdid = oLayer.metadata.split('uuid=')[1];
                    oLayer.metadatacsw = oLayer.metadata.substring(0,oLayer.metadata.search('geonetwork')) +
                        'geonetwork/srv/eng/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetRecordById&elementSetName=full&ID=' +
                        mdid;
                }               
                oLayer.style = $(this).find("StyleList  > Style[current='1'] > Name").text();                
                oLayer.url = $(this).find('Server > OnlineResource').attr('xlink:href'); 
                oLayer.queryable = true;
                oLayer.infoformat = 'text/html';
                oLayer.format = $(this).find("FormatList  > Format[current='1']").text();                
                oLayer.visiblebydefault = oLayer.checked;
                oLayer.tiled = false;
                oLayer.ns = (oLayer.id.split(':').length > 0) ? oLayer.id.split(':')[0] : null;
                oLayer.enable = true;
                console.log("wmc", oLayer);
                //config.layersQueryable.push(layerDesc);
                //map.addLayer(parseLayerQueryable(layerDesc)); 
                themeLayers[oLayer.id] = oLayer;
                var l = new ol.layer.Image({
                    source: new ol.source.ImageWMS({
                        url: oLayer.url,					
                        crossOrigin: null,            
                        params: {
                            'LAYERS': oLayer.id,
                            'STYLES':oLayer.style,
                            'FORMAT': 'image/png',
                            'TRANSPARENT': true
                        }
                    })
                });
                l.setVisible(true);                
                l.set('name', oLayer.name);
                themeLayers[oLayer.id].layer = l;
                //_themes['wmc'].layers[oLayer.id] = themeLayers[oLayer.id];                
                _queryableLayers.push(l);                                     
                _overLayers[oLayer.id] = themeLayers[oLayer.id];
                _map.addLayer(l);                    
            }           
           
        });
        return {title: title, extent:map_extent, layers:themeLayers};
    };
    
     /**
     * Private Method:  parseGML
     *
     */
    
    var _parseGML = function (gml) {
        var results = $.xml2json(gml);
		var liste = [];
        var geoserver = false;
        var o = {features: []}; 
		//GEOSERVER
        if (results.featureMember) {
            geoserver = true;
            if ($.isArray(results.featureMember) === false) {
                liste.push(results.featureMember);
            } else {
                liste = results.featureMember;
            }
            for (var j=0; j<liste.length ;j++) {
                var obj=liste[j];
                //GEOSERVER
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        o.features.push({layername:prop, attributes:obj[prop]});                
                }              
            }
        }          
        //MAPSERVER Huge hack        
        for (var p in results) {
            if (typeof(results[p]) === 'object') {
                //Search for response type : layername_layer & layername_feature                
                var mslayer = p.substring(0,p.search('_layer')); //eg. STQ_layer
                 if (results[mslayer + '_layer'] && results[mslayer + '_layer'][mslayer + '_feature']) { 
                        if ($.isArray(results[mslayer + '_layer'][mslayer + '_feature']) === false) {
                            o.features.push({layername:mslayer, attributes:results[mslayer + '_layer'][mslayer + '_feature']});
                        } else {
                            for (var k=0; k<results[mslayer + '_layer'][mslayer + '_feature'].length ;k++) {
                                o.features.push({layername:mslayer, attributes:results[mslayer + '_layer'][mslayer + '_feature'][k]});
                            }
                        }                    
                 }
            }
        }    
		
        return o;
    };
    
    var _initWMTSMatrixsets = function () {
        var projectionExtent = _projection.getExtent();
        var size = ol.extent.getWidth(projectionExtent) / 256; 
        _WMTSTileMatrix = {'EPSG:3857': [], 'PM':[]};
        _WMTSTileResolutions = {'EPSG:3857': [], 'PM':[]};
        for (var z = 0; z < 22; ++z) {
                // generate resolutions and matrixIds arrays for this Geobretagne WMTS
                _WMTSTileResolutions['EPSG:3857'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['EPSG:3857'][z] = 'EPSG:3857:' + z;
        }
         for (var z = 0; z < 20; ++z) {
                // generate resolutions and matrixIds arrays for this Geobretagne WMTS
                _WMTSTileResolutions['PM'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['PM'][z] = z;
        }
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
                    $(elem).find("a").attr("data-theme", "a").removeClass("ui-btn-b ui-btn-up-b").addClass("ui-btn-a ui-btn-up-a").enhanceWithin();
                } else {
                    $(elem).find("a").attr("data-theme", "b").removeClass("ui-btn-a ui-btn-up-a").addClass("ui-btn-b ui-btn-up-b").enhanceWithin();
                }
                if (opt === "gallery") {
                    $('#backgroundlayerstoolbar').collapsible( "collapse" );
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
            //_map.render();
        },

        /**
         * Public Method: getLegendUrl
         *
         */

        getLegendUrl: function (layer) {
			// for legend scale dependancy add this option &SCALE='+parseInt(_map.getScale())
			// todo 
        	if(layer.legendUrl){
        		return layer.legendUrl;
        	}
        	else {
            return layer.url + '?service=WMS&Version=1.3.0&request=GetLegendGraphic&SLD_VERSION=1.1.0&format=image%2Fpng&width=30&height=20&layer=' + layer.id + '&style=' + layer.style + '&legend_options=fontName:Trebuchet%20MS;fontAntiAliasing:true;fontColor:0x222222;fontSize:10;dpi:96&TRANSPARENT=true';
        	}
        	},

        /**
         * Public Method: setPermalink
         *
         */

        setPermalink: function () {                     
            var c = _map.getView().getCenter();
            var linkParams = {};
            if (!config.wmc){
                linkParams.x = encodeURIComponent(Math.round(c[0]));
                linkParams.y = encodeURIComponent(Math.round(c[1]));
                linkParams.z = encodeURIComponent(_map.getView().getZoom());            
                linkParams.l = encodeURIComponent(_getVisibleOverLayers());
            }
            linkParams.lb = encodeURIComponent(this.getActiveBaseLayer());
            if (config.config) {
                linkParams.config = config.config;
            }
            if (config.wmc) {
                linkParams.wmc = config.wmc;
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
                //_extent = options.attr("extent").split(",").map(Number);
                _zoom = parseInt(options.attr("zoom")) || 8;
                _center = options.attr("center").split(",").map(Number);
                //_projection = ol.proj.configureProj4jsProjection({code: options.attr("projection"), extent: options.attr("projextent").split(",")});
                _projection = ol.proj.get(options.attr("projection"));
                _initWMTSMatrixsets();
                
                $( "#popup-closer" ).bind( "click", function() {
                    $("#popup").hide();
                    $("#popup-closer").blur();
                    return false;
                });
                _overlay =  new ol.Overlay({element: $("#popup")});
                //var center = ol.proj.transform([-290498.08475351497, 6127179.4067011485], 'EPSG:3857', _projection.getCode());
                
                _marker = new ol.Overlay({ positioning: 'center-center', element: $("#marker"), stopEvent: false}); 
                
                 if (config.x && config.y && config.z) {
                    _center =   [parseFloat(config.x), parseFloat(config.y)];       
                    _zoom = parseInt(config.z);
                 } 
                _map = new ol.Map({
                    target: 'map',
                    controls: [
                        //new ol.control.FullScreen(),
                        new ol.control.ScaleLine(),
                        new ol.control.Attribution()                        
                      ],                    
                    overlays: [_overlay, _marker],
                    renderer: _renderer,
                    view: new ol.View({
                        //projection: _projection,
                        maxZoom: options.attr("maxzoom") || 19,
                        center: _center,
                        zoom: _zoom
                    })
                });               
                _proxy = $(xml).find('proxy').attr("url");                
                _authentification.enabled = $(xml).find('authentification').attr("enabled")=="true"?true:false;
                if (_authentification.enabled) {
                    _authentification.url = $(xml).find('authentification').attr("url");
                    _authentification.loginurl = $(xml).find('authentification').attr("loginurl");
                    _authentification.logouturl = $(xml).find('authentification').attr("logouturl");
                    $.ajax({url: _authentification.url,
                        success: function (response) {
                            //test georchestra proxy
                            if(response.proxy == "true") {
                                $("#login").show();
                                if (response.user !="") {
                                    $("#login").attr("href",_authentification.logouturl);
                                    $("#login").attr("title","Se déconnecter");
                                    console.log("Bonjour " + response.user);
                                }
                                else {
                                    var url="";
                                    if (location.search=="") {
                                        url=_authentification.loginurl;
                                    }
                                    else {
                                        url=location.href  + _authentification.loginurl.replace("?","&");
                                    }
                                    $("#login").attr("href",url);
                                }
                            }
                        }
                    });                
                }                
                _olsCompletionUrl = $(xml).find('olscompletion').attr("url");
                _elasticSearchUrl = $(xml).find('elasticsearch').attr("url");
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
                if (config.wmc) {
                    /*$.ajax({
                        url:config.wmc,
                        dataType: "xml",                        
                        success: function (xml) {
                            _themes['wmc'] = {};
                            _themes['wmc'].collapsed = false;
                            _themes['wmc'].id = 'wmc';                                               
                            _themes['wmc'].layers = {};                            
                            var wmc = _parseWMCResponse(xml);
                            //themeLayers = wmc.layers;
                            _map.getView().fitExtent(wmc.extent, _map.getSize());
                            _themes['wmc'].layers = wmc.layers;
                            _themes['wmc'].name = wmc.title; 
                            _initDataList();
                        }
                    });    */
                    var reg=new RegExp("[,]+", "g");
                    var wmcs=config.wmc.split(reg);
                    for (var i=0; i<wmcs.length; i++) {
                     (function(key) {
                         var wmcid = "wmc"+key ;
                         $.ajax({
                             url:_ajaxURL(wmcs[key]),
                             dataType: "xml",                       
                             success: function (xml) {
                                 var wmc = _parseWMCResponse(xml);
                                 _themes[wmcid] = {};
                                 _themes[wmcid].collapsed = true;
                                 _themes[wmcid].id = wmcid;                                               
                                 _themes[wmcid].layers = {};                           
                                 console.log ("adding "+wmc.title+" category");
                                 _map.getView().fitExtent(wmc.extent, _map.getSize());
                                 _themes[wmcid].layers = wmc.layers;
                                 _themes[wmcid].name = wmc.title; 
                                 _initDataList();
                            }
                         });  
                     })(i);  
                    }
                }
                else {                
                    var themes = $(xml).find('theme');
                    var layerRank = 0;
                    $(themes.get().reverse()).each(function () {
                        var themeid = $(this).attr("id");
                        _themes[themeid] = {};
                        _themes[themeid].collapsed = $(this).attr("collapsed");
                        _themes[themeid].id = themeid;                       
                        _themes[themeid].name = $(this).attr("name");                    
                        _themes[themeid].layers = {};
                        var layersXml = $(this).find('layer');
                        $(layersXml.get().reverse()).each(function () {
                            layerRank+=1;
                            var layerId = $(this).attr("id");
                            var oLayer = {};
                            oLayer.id = layerId;
                            oLayer.rank = layerRank;
                            oLayer.name = $(this).attr("name");
                            oLayer.featurecount = $(this).attr("featurecount");
                            oLayer.style = $(this).attr("style");
                            oLayer.attribution = $(this).attr("attribution");
                            oLayer.metadata = $(this).attr("metadata");
                            oLayer.metadatacsw = $(this).attr("metadata-csw");
                            oLayer.url = $(this).attr("url");                        
                            oLayer.queryable = ($(this).attr("queryable") == "true") ? true : false;
                            oLayer.infoformat = $(this).attr("infoformat");
                            oLayer.checked = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.visiblebydefault = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.tiled = ($(this).attr("tiled") == "true") ? true : false;
                            oLayer.ns = ($(this).attr("namespace")) ? $(this).attr("namespace") : null;
                            oLayer.legendUrl=($(this).attr("legendUrl"))? $(this).attr("legendUrl") : false;
                            oLayer.enable = true;
                            if ($(this).attr("fields") && $(this).attr("aliases")) {
                                oLayer.fields = $(this).attr("fields").split(",");
                                oLayer.aliases = $(this).attr("aliases").split(",");
                            }
                            
                            if($(this).attr("iconSearch")){

                                oLayer.iconSearch=$(this).attr("iconSearch");
                            }
                            else {

                                oLayer.iconSearch="img/box.png";
                            }
                            
                            if ($(this).attr("scalemin") || $(this).attr("scalemax")) {
                                oLayer.scale = {};
                                if ($(this).attr("scalemin")) {
                                    oLayer.scale.min = parseInt($(this).attr("scalemin"));
                                }
                                if ($(this).attr("scalemax")) {
                                    oLayer.scale.max = parseInt($(this).attr("scalemax"));
                                }
                            }

                            themeLayers[layerId] = oLayer;
                            var l= null;
                            switch (oLayer.tiled) {
                                case true:
                                    l = new ol.layer.Tile({
                                        source: new ol.source.TileWMS({
                                            url: $(this).attr("url"),
                                            crossOrigin: null,
                                            params: {
                                                'LAYERS': $(this).attr("id"),
                                                'STYLES':(themeLayers[layerId].style)? themeLayers[layerId].style : '',
                                                'FORMAT': 'image/png',
                                                'TRANSPARENT': true,
                                                'TILED':true
                                            }
                                        })
                                    });
                                    break;
                                case false:
                                    l = new ol.layer.Image({
                                        source: new ol.source.ImageWMS({
                                            url: $(this).attr("url"),
                                            crossOrigin: null,
                                            params: {
                                                'LAYERS': $(this).attr("id"),
                                                'STYLES':(themeLayers[layerId].style)? themeLayers[layerId].style : '',
                                                'FORMAT': 'image/png',
                                                'TRANSPARENT': true
                                            }
                                        })
                                    });
                                    break;                        
                            }                       
                            
                            l.setVisible(false);
                            if (oLayer.scale.max) { l.setMaxResolution(_convertScale2Resolution(themeLayers[layerId].scale.max)); }  
                            if (oLayer.scale.min) { l.setMinResolution(_convertScale2Resolution(themeLayers[layerId].scale.min)); } 
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
                } // fin de else

                _initDataList();
                _initTools();
                _initSearch();
                _initShare();
                _initPanelsPopup();				
				
                //_map.getView().fitExtent(_extent, _map.getSize());
                //PERMALINK                
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
                    if (!config.wmc) {
                        _showCheckedLayers(xml);
                    }
                }      
               
                
                createGetFeatureInfoControl();
                
                _map.on('moveend', _mapChange);
                //Fix viewPort size change by themepanel
                $("#themepanel").on('panelopen', function(e, ui) {_map.updateSize();});
                $("#themepanel").on('panelclose', function(e, ui) {_map.updateSize();});
                $('#themepanel [data-role="collapsible"]').on('collapsibleexpand',function(e, ui) {_map.updateSize();});
                $('#themepanel [data-role="collapsible"]').on('collapsiblecollapse',function(e, ui) {_map.updateSize();});
                
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
         * Public Method: getElasticsearchUrl
         *
         */

        getElasticsearchUrl: function () {
            return _elasticSearchUrl;
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
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', _projection.getCode());
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
         * Public Method: queryLayer
         *
         */

        queryLayer: function (x, y, proj, layer) {
            mviewer.zoomToLocation(x,y,7);     
            var pt = ol.proj.transform([x, y], proj, _projection.getCode());
            var p = _map.getPixelFromCoordinate(pt);            
            _queryMap({coordinate:[pt[0],pt[1]]},layer);
        },

        /**
         * Public Method: showLocation
         *
         */

        showLocation: function (x, y) {
            //marker
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', _projection.getCode());           
            _marker.setPosition(ptResult);
            $("#marker").show();
            //$("#marker").fadeOut(900).delay(300).fadeIn(800); 
            _map.render();
        },
        
        /**
         * Public Method: hideLocation
         *
         */

        hideLocation: function ( ) {
            $("#marker").hide();
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
         * Public Method: restoreInitialDisplay
         *
         */
        
        restoreInitialDisplay: function () {      
            $.each(_overLayers, function (id, layer) {
                if  (layer.checked != layer.visiblebydefault) {
                    layer.checked = layer.visiblebydefault;                    
                    layer.layer.setVisible(layer.visiblebydefault);
                    $("#datalist").find('input[name="'+layer.id+'"]').prop( "checked", layer.visiblebydefault).checkboxradio( "refresh" );
                }
            });            
        },
        /**
         * Public Method: lonlat2osmtile
         * from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
         *
         */
        
        lonlat2osmtile: function (lon, lat, zoom) {            
            var x = Math.floor((lon+180)/360*Math.pow(2,zoom));
            var y = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
            var osmtile = 'http://tile.openstreetmap.org/' +zoom+'/'+x + '/'+y+'.png';
            console.log('tile',osmtile);
            return osmtile;
            
        },
        
        /**
         * Public Method: sendToGeorchestra
         *
         */
        
        sendToGeorchestra: function () {             
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
            $('.easyShareBox').remove();
            $('#shareeasy').append('<a id="alink" href="' + encodeURIComponent(myurl) + '" title="Kartenn" class="easyShare">Share me !</a>');
            $('.easyShare').easyShare({
                imagePath: 'lib/jquery/base/plugins/easyshare/',
                sites: ['twitter', 'google'],
                mode: 'big'
            });
            $(".easyShareBox").append("<li class='georchestra'><a href='#' title='Envoyer vers le visualiseur Georchestra'><img src='img/logo/g.png' alt='georchestra' onclick='mviewer.sendToGeorchestra();' /></a></li>");
        } // fin function tools toolbar
    }; // fin return		

})();
