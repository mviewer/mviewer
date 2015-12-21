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
         
    proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
   
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
            if (_proxy) {
                return  _proxy + encodeURIComponent(url);
            } else {
                return url;
            }
        }
    };
    
    /**
     * Property: _mvReady
     * Boolean. The getFeatureInfo state
     */

    var _mvReady = true;
    
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
     * Property: _wgs84Sphere
     * {ol.Sphere} Sphere used to calculate area an length measures
     */
     
    var _wgs84Sphere = new ol.Sphere(6378137);
    
    /**
     * Property: _crossorigin
     * The crossOrigin attribute for loaded images. Note that you must provide a crossOrigin value 
     * if you want to access pixel data with the Canvas renderer for export png for example. 
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
     */
     
    var _crossorigin = null;

    var _print = false;
     
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
     * Property: _popupInfos
     * {Boolean}  Render getFeatureInfos in popup
     */

    var _popupInfos = true;
    
     /**
     * Property: _queryMapCoordinate
     * {Array} Coordinate of the queryMap click
     */
    
    var _queryMapCoordinate = null;
    
    /**
     * Property: _legendRenderer
     * {string}  canvas or null
     */
    
    var _legendRenderer = null;

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
     * Property: _searchableLayers
     * Array of {OpenLayers.Layers.WMS} .
     */

    var _searchableLayers = [];
    
    /**
     * Property: _scaledDependantLayers
     * Array of {OpenLayers.Layers.WMS} .
     */

    var _scaledDependantLayers = [];

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
     * Property: _olsCompletionType
     * String. The service type used by the geocode control (geoportail or ban)
     */
     
    var _olsCompletionType = null;
    
    /**
     * Property: _elasticSearchUrl
     * String. The Elasticsearch url used by search function
     */
     
    var _elasticSearchUrl = null;
    
    /**
     * Property: _elasticSearchGeometryfield
     * String. The Elasticsearch geometry field used by search function
     */
     
    var _elasticSearchGeometryfield = null;
    
    /**
     * Property: _elasticSearchLinkid
     * String. The common id between Elasticsearch document types (_id)  and wfs featureTypes. 
     * 
     */
     
    var _elasticSearchLinkid = null;
    
    /**
     * Property: _elasticSearchQuerymode
     * String. The Elasticsearch query mode used by search function
     */
     
    var _elasticSearchQuerymode = null;
    
    /**
     * Property: _searchparams
     * Enables properties the search
     */
     
    var _searchparams = { localities : true, bbox: false, features: false};
  
    
    /**
     * Property: _marker
     * marker used to locate features on the map.
     * @type {ol.Overlay}
     */
     
    var _marker = null;

    /**
     * Property: renderer
     * @type {ol.Renderer}
     */

    var _renderer = 'canvas';
    
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
    
    var _sourceEls;
    
    /**
     * _message Show message method.
     * @param {String} msg
     */
    
    var _message = function (msg) {
        $("#msg").text(msg);
        $("#msgpanel").popup( "open");
    };
    
    var _wrapText = function (context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
    };
    
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
              length += _wgs84Sphere.haversineDistance(c1, c2);
          }
      var output;
      if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
      } else {
          output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
      }
      return output;
    };

    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */
     
    var _measureFormatArea = function(polygon) {      
      var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
      _projection, 'EPSG:4326'));
      var coordinates = geom.getLinearRing(0).getCoordinates();
      var area = Math.abs(_wgs84Sphere.geodesicArea(coordinates));
      var output;
      if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
      } else {
          output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';      }
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
        _measureTooltipResult.className = 'tooltip tooltip-measure';
        _measureTooltip = new ol.Overlay({
            element: _measureTooltipResult,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        _map.addOverlay(_measureTooltip);
    };
    
    var _addMeasureInteraction = function (type) {        
        _map.on('pointermove', _pointerMoveHandler);
        $(_map.getViewport()).on('mouseout', function() {
            $(_helpMeasureTooltipMessage).addClass('hidden');
        });      
        _draw = new ol.interaction.Draw({
            source: _sourceMesure,
            type: /** @type {ol.geom.GeometryType} */ (type),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#22AADD',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                      color: '#22AADD',
                      width: 2
                    }),
                    fill: new ol.style.Fill({
                      color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
      _map.addInteraction(_draw);
      _createMeasureTooltip();
      _createHelpTooltip();
      var listener;
      
      _draw.on('drawstart',
          function(evt) {
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
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = _measureFormatLength( /** @type {ol.geom.LineString} */ (geom));
                    tooltipCoord = geom.getLastCoordinate();
                }
                _measureTooltipResult.innerHTML = output;
                _measureTooltip.setPosition(tooltipCoord);
            });
          }, this);

      _draw.on('drawend',
          function(evt) {
            _measureTooltipResult.className = 'tooltip tooltip-measure-static';
            _measureTooltip.setOffset([0, -7]);
            // unset sketch
            _sketch = null;
            // unset tooltip so that a new one can be created
            _measureTooltipResult = null;
            _createMeasureTooltip();
            ol.Observable.unByKey(listener);
          }, this);
    };
    
     /**
     * Private Method: _queryMap()
     *
     */
     
    var _queryMap = function (evt, layer, featureid) { 
        if (!_mvReady) {
            return False;
        }
        var featureInfoByLayer = [];
        var visibleLayers = [];
            if (layer) {
                 visibleLayers.push(_overLayers[layer].layer);
            } else {
                visibleLayers =  $.grep( _queryableLayers, function( l, i ) {return l.getVisible();});
            }
            $("#popup-content").html('');
            if (_popupInfos) {                
                $('#popup').hide();
                var coordinate = evt.coordinate;
                var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, _projection.getCode(), 'EPSG:4326'));
                var hdms2 = hdms.replace(/ /g,"").replace("N","N - ");
                $("#hdms").text(hdms2);
                _overlay.setPosition(coordinate);
            } else { 
                _queryMapCoordinate = evt.coordinate;
            }
            var urls = [];
            var params;
            for (var i = 0; i < visibleLayers.length; i++) {
                params = {'INFO_FORMAT': _overLayers[visibleLayers[i].getSource().getParams()['LAYERS']].infoformat,
                    'FEATURE_COUNT': _overLayers[visibleLayers[i].getSource().getParams()['LAYERS']].featurecount                
                };                
                var url = visibleLayers[i].getSource().getGetFeatureInfoUrl(
                    evt.coordinate, _map.getView().getResolution(), _map.getView().getProjection(), params
                );
                if (layer && featureid) {
                    //url+= '&CQL_FILTER=search_id%3D%27'+featureid+'%27';
                    url+= '&CQL_FILTER='+_overLayers[layer].searchid+'%3D%27'+featureid+'%27';
                }                    
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
                    if ((typeof layerResponse === 'string') && (layerResponse.search('<!--nodatadetect--><!--nodatadetect-->')<0) && (layerResponse.search('<!--nodatadetect-->\n<!--nodatadetect-->')<0))
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
                                _message("Ce format de réponse : " + contentType +" n'est pas pris en charge");												
                        }					
                        if (html) {                                                      
                            tabs.splice(response.layerinfos.rank,1,'<li title="'+name+'"><a href="#slide-'+idcarrousel+'" >'+name+'</a></li>');
                            slide =$('<div id="slide-'+idcarrousel +'" ><ul class="bjqs"> </ul> </div>'); 
                            //test si présence d'une classe .carrousel eg template geoserver.
                            //Les éléments trouvés servent à la création d'un carrousel dédié
                            var carrousel_data=$(layerResponse).find(".carrousel li");                                                     
                            if(carrousel_data.length == 0){                                
                                $(slide).find("ul").append('<li>'+layerResponse+'</li>');
                            }
                            else {							
                                for( var i=0; i<carrousel_data.length; i++){						
                                    var page = $(slide).find("ul").append(carrousel_data[i]);
                                    if (carrousel_data.length > 1) {
                                        var li = $(page).find("li")[i];
                                        $(li).append('<p class="counter-slide">'+(i+1)+'/'+carrousel_data.length+'</p>');
                                    }
                                   
                                }
                            }
                        }
                        else {
                            if (gml) {
                                var obj = _parseGML(gml);                            
                                if (obj.features.length > 0) {                                                                     
                                    tabs.splice(response.layerinfos.rank,1,'<li title="'+name+'"><a href="#slide-'+idcarrousel+'" >'+name+'</a></li>');
                                    slide=$('<div class="mycarrousel" id="slide-'+idcarrousel +'" ><ul class="bjqs"> </ul> </div>'); 
                                    var oLayer =  _overLayers[obj.features[0].layername];                                    
                                    $(slide).find("ul").append('<li>'+createContentHtml(obj.features, oLayer)+'</li>');                                      
                                }
                            }
                        }
                        if (slide) { featureInfosHtml.push(slide);}
                      } else {
                        console.log(layerResponse, contentType);
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
                            width : 280,
                            height:300,
                            showmarkers: false,                            
                            //centermarkers : true,
                            nexttext : '>', // Text for 'next' button (can use HTML)
                            prevtext : '<' 
                        });
                    }                   
                    $( "#selector" ).tabs();
                    $("#popup-content img").click(function(){mviewer.popupPhoto($(this).attr("src"))});
                    $("#popup-content img").on("vmouseover",function(){$(this).css('cursor', 'pointer');}).attr("title","Cliquez pour agrandir cette image");
                    if (_popupInfos) {
                        var offset = (_map.getView().getResolution() *  $('#popup').outerHeight()) /1.5;                   
                        var c = _overlay.getPosition();                     
                        var pan = ol.animation.pan({
                            duration: 2000,
                            source: _map.getView().getCenter()
                        });
                        _map.beforeRender(pan);
                        _map.getView().setCenter([c[0], c[1] + offset]);
                    } else {
                         mviewer.showLocation(_projection.getCode(), _queryMapCoordinate[0], _queryMapCoordinate[1]);
                         mviewer.panelShowTab('mapinfos');
                         $("#tabThemes").removeClass('ui-btn-active');
                         $("#tabInfos").addClass("ui-btn-active");
                         if ($("#themepanel").hasClass("ui-panel-open") === false) {
                            $('#themepanel').panel('open');
                         }
                    }
                }

                $.mobile.loading('hide');
                _mvReady = true;
                
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
    
    var _getlegendUrl = function (layer) {
         return layer.url + '?service=WMS&Version=1.3.0&request=GetLegendGraphic&SLD_VERSION=1.1.0'+
            '&format=image%2Fpng&width=30&height=20&layer=' + layer.id + '&style=' + layer.style +
            '&legend_options=fontName:Trebuchet%20MS;fontAntiAliasing:true;fontColor:0x222222;fontSize:10;dpi:96&TRANSPARENT=true';
    };

    /**
     * Private Method: _getFeatureInfoControl
     *
     */
     
    var _getFeatureInfoListener = function (evt) {
        $.mobile.loading('show', {
            text: 'Interrogation en cours.',
            textonly: false,
            textVisible: false,
            theme: 'b',        
            html: ''
        });
         _queryMap(evt);            
    };
    
    var _getFeatureInfoControl = function (activation) {
        if (activation === true) {
            _map.on('singleclick', _getFeatureInfoListener);
         } else {
            _map.un('singleclick', _getFeatureInfoListener);
         }
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
     * Private Method: _clearOldMeasures
     *
     */

    var _clearOldMeasures = function () {
        _sourceMesure.clear();
        $(".tooltip-measure-static").remove();       
    };
    
     /**
     * Private Method: _resetDrawTool
     *
     */

    var _resetDrawTool = function () {
       _clearOldMeasures();
       _map.removeOverlay(_helpMeasureTooltip);
       _map.removeOverlay(_measureTooltip);
       _map.un('pointermove', _pointerMoveHandler);
       _map.removeInteraction(_draw);        
    };
    
    /**
     * Private Method: _deactivateTools
     *
     */

    var _deactivateTools = function () {         
        _getFeatureInfoControl(false);
        _resetDrawTool();        
    };

    /**
     * Private Method: _clearTools
     *
     */

    var _clearTools = function () {
        $("#infobtn").removeClass('ui-btn-active');
        $('#measurelinebtn').removeClass('ui-btn-active');
        $("#measurebtn").removeClass("ui-btn-active");
        $('#measureareabtn').removeClass('ui-btn-active');
        $("#drawtoolsoptions").hide();
    };

    /**
     * Private Method: _initTools
     *
     */

    var _initTools = function () {
        $("#toolstoolbar").controlgroup( "refresh" );
        _sourceMesure = new ol.source.Vector();
        var vector = new ol.layer.Vector({
          source: _sourceMesure,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(34, 170, 221, 0.1)'
            }),
            stroke: new ol.style.Stroke({
              color: '#22AADD',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#22AADD'
              })
            })
          })
        });        
        _map.addLayer(vector); 
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
        if (_searchparams.features) {
             _sourceEls = new ol.source.Vector();
             var vector = new ol.layer.Vector({
                  source: _sourceEls,
                  style: new ol.style.Style({
                    fill: new ol.style.Fill({
                      color: 'rgba(34, 170, 221, 0.1)'
                    }),
                    stroke: new ol.style.Stroke({
                      color: '#22AADD',
                      width: 3
                    }),
                    image: new ol.style.Circle({
                      radius: 10,
                      fill: new ol.style.Fill({
                        //color: '#22AADD'
                        color: 'rgba(255,255,0,0)'
                      }),
                      stroke: new ol.style.Stroke({
                          color: '#22AADD',
                          width: 4
                      })
                    })
                  })
                });        
             _map.addLayer(vector); 
         }
        
        $("#searchtool .ui-icon-delete").click(function () {
            $("#searchresults").html("").listview("refresh");
            if (_sourceEls) {
                _sourceEls.clear();
            }
        });
        $(document).on("keyup", "#searchfield", function (e) {
            if (e.keyCode == 13) {
                var firstitem = $('#searchresults').find('li')[1];
                var firstlink = $(firstitem).find("a");
                $(firstlink).trigger('click');
                return;
            }
            if ($(this).val().length < 3) {
                $("#searchresults").html("").listview("refresh");
            } else {
                _search($(this).val());
            }
        });
    };
    
    var _search = function (value) {
        //OpenLs request
        if (_searchparams.localities) {
            if (_olsCompletionType === "geoportail") {
                $.ajax({
                    type: "GET",
                    url: mviewer.getOlsCompletionUrl(),
                    crossDomain: true,
                    data: {
                        text: value,
                        type: "StreetAddress,PositionOfInterest",
                        ter: "5"
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        var zoom = 12;
                        var res = data.results;
                        var str = '<li data-role="list-divider" data-theme="b" class="geoportail">Localités</li>';
                        //var str = '';
                        for (var i = 0, len = res.length; i < len && i < 5; i++) {
                             switch (res[i].classification) {
                                case 1:
                                case 2:
                                    zoom = 13;
                                    break;
                                case 3:
                                case 4:
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
                            str += '<li class="geoportail" data-icon="false"><a href="#" onclick="mviewer.zoomToLocation(' + res[i].x + ',' + res[i].y + ',' + zoom + ',\'' + res[i].fulltext.replace("'", "*") + '\');" '+
                            'onmouseover="mviewer.flash('+'\'EPSG:4326\',' + res[i].x + ',' + res[i].y + ');"> ' +
                            '<img src="img/map-marker.svg" alt="icone" class="ui-li-icon ui-corner-none">'
                            + res[i].fulltext + '</a></li>';
                        }
                        $(".geoportail").remove()
                        if (res.length > 0) {
                            $("#searchresults").append(str).listview("refresh");
                        }                        
                    }
                });
            }
            if (_olsCompletionType === "ban") {
                var parameters = {q: value, limit: 5};
                if (_searchparams.bbox) {
                    var center = _map.getView().getCenter();
                    var center = ol.proj.transform(center, _projection.getCode(), 'EPSG:4326')
                    parameters.lon = center[0];
                    parameters.lat = center[1];
                }                
                $.ajax({
                    type: "GET",
                    url: mviewer.getOlsCompletionUrl(),
                    crossDomain: true,
                    data: parameters,
                    dataType: "json",
                    success: function (data) {
                        var zoo = 0;
                        var res = data.features;                        
                        var str = '';
                        for (var i = 0, len = res.length; i < len && i < 5; i++) {                            
                            switch(res[i].properties.type) {
                              case 'city':
                                 zoom = 13;
                                 break;
                              case 'town':
                                 zoom = 15;
                                 break;
                              case 'village':
                                 zoom = 16;
                                 break;
                              case 'street':
                                 zoom = 17;
                                 break;
                              case 'housenumber':
                                 zoom = 18;
                                 break;
                              default:
                                 zoom = 14;
                            }
                            str += '<li class="geoportail" data-icon="false" title="'+res[i].properties.context+' - ' + res[i].properties.type+'" >' +
                            '<a href="#" onclick="mviewer.zoomToLocation(' + res[i].geometry.coordinates[0] + ',' + res[i].geometry.coordinates[1] + ',' + zoom + ',\'' + res[i].properties.name.replace("'", "*") + '\');">'+
                            '<img src="img/map-marker.svg" alt="icone" class="ui-li-icon ui-corner-none">'
                            + res[i].properties.label + '</a></li>';
                        }
                        $(".geoportail").remove()
                        $("#searchresults").append(str).listview("refresh");
                    }
                });
            }
        }
        //ElasticSearch request
        if (_searchparams.features) {
            _sendElasticsearchRequest(value);
        }
    };
    
    var _shapeToPoint = function (geometry){
        var point=[];
        var position = Math.floor(geometry.coordinates.length /2);
        if (geometry == null)
            return;
        switch (geometry.type)
        {           
            case "MultiPoint":
                point[0]=geometry.coordinates[position][0];
                point[1]=geometry.coordinates[position][1];
                break;
            case "MultiLineString":
                point[0]=geometry.coordinates[0][0][0];
                point[1]=geometry.coordinates[0][0][1];
            break;
            case "LineString":                
                point[0]=geometry.coordinates[position][0];
                point[1]=geometry.coordinates[position][1];
                break;
            case "MultiPolygon":
            case "Polygon":
                point = ol.extent.getCenter(new ol.format.GeoJSON().readGeometry(geometry).getExtent());
                /*point[0]=geometry.coordinates[0][0][0][0];
                point[1]=geometry.coordinates[0][0][0][1];*/
                break;
            default: 
                point[0]=geometry.coordinates[0];
                point[1]=geometry.coordinates[1];
                break;
        }
        return point;
    };
    
    /**
     * Private Method: _sendElasticsearchRequest
     *
     */

    var _sendElasticsearchRequest = function (val) {
        var sendQuery = true;
        var searchableLayers =  $.grep( _searchableLayers, function( l, i ) {
            return l.getVisible();
        });
        if (searchableLayers.length > 0) {
            var queryLayers = [];
            var currentExtent = _map.getView().calculateExtent(_map.getSize());
            var pe = ol.proj.transformExtent(currentExtent, _projection.getCode(), 'EPSG:4326');        
            for (var i = 0; i < searchableLayers.length; i++) {            
                queryLayers.push({"type":{"value": searchableLayers[i].getSource().getParams()['LAYERS']}});
            }
            var query;
            var mode = _elasticSearchQuerymode;
            // Enable match mode if val begin with a # char.
            if (val.substring(0,1) === "#") {
                mode = "match";
                val = val.substring(1,val.length);  
            }
            if (val.slice(0,1) === "\"") {
                sendQuery = false;
            }
            if ((val.slice(0,1) === "\"") && (val.slice(-1) === "\"")) {
                mode = "phrase";                
                val = val.substring(1,val.length-1); 
                sendQuery = true;
            }
            switch (mode) {
                case "match":
                    query = {"match": {"_all": val}};
                    break;
                case "phrase":
                    query = {"match_phrase": {"_all": val}};
                    break;
                case "fuzzy_like_this":
                    query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12}};
                    break;
                default:                    
                    query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12}};
            } 
            
            var queryFilter = {
              "query": {
                "filtered" : {
                    "query" : query,
                      "filter" :  {
                         "and": {
                           "filters": [
                             {"or" : 
                                {"filters": queryLayers}                           
                             }                           
                           ]
                         }             
                      }
                }
              }
            };
            
            if (_searchparams.bbox) {
                var geometryfield = _elasticSearchGeometryfield || "location";
                var geofilter = {"geo_shape": {}};
                geofilter.geo_shape[geometryfield] = {"shape": {"type": "envelope","coordinates" : [[ pe[0], pe[3] ],[ pe[2], pe[1] ]]}};
                queryFilter.query.filtered.filter.and.filters.push(geofilter);
            }
            if (sendQuery) {
                // Fix IE9 "No transport error" with cors
                jQuery.support.cors = true;
                $.ajax({
                    type: "POST",
                    url: mviewer.getElasticsearchUrl(),
                    crossDomain: true,
                    data: JSON.stringify(queryFilter),
                    dataType: "json",
                    success: function (data) {
                        _sourceEls.clear();
                        var str = '<li data-role="list-divider" data-theme="b" class="elasticsearch">Entités</li>';
                        var format = new ol.format.GeoJSON();
                        var vectorLayer = _getLayerByName("flash");
                        //var str = '';
                        var nb = data.hits.hits.length;
                        for (var i = 0, nb ; i < nb && i < 5; i++) {
                            var point=_shapeToPoint(data.hits.hits[i]._source.geometry);                        
                            var feature = new ol.Feature({
                              geometry: format.readGeometry(data.hits.hits[i]._source.geometry, {dataProjection: 'EPSG:4326', featureProjection: _projection})           	  
                            });
                            _sourceEls.addFeature(feature);
                            /*var loc = [data.hits.hits[i]._source.geometry.coordinates[0], data.hits.hits[i]._source.geometry.coordinates[1]];*/
                            str += '<li class="elasticsearch" data-icon="false"><a href="#" ' +                        
                            'onclick="mviewer.queryLayer(' + point[0] + ',' + point[1] + ',\'EPSG:4326\',\''+ data.hits.hits[i]._type+'\',\''+ data.hits.hits[i]._id+'\');"' + 
                            /*'onmouseover="mviewer.showLocation('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');" ' +
                            'onmouseout="mviewer.hideLocation();" ' +*/
                            'onmouseover="mviewer.flash('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');" ' +
                            'title="('+ data.hits.hits[i]._type + ') '+$.map(data.hits.hits[i]._source, function(el) { if (typeof(el)==='string') {return el}; }).join(", \n")+'">' +
                            '<img src="'+_overLayers[data.hits.hits[i]._type].iconSearch +' " alt="icone" class="ui-li-icon ui-corner-none">'
                             /*+ data.hits.hits[i]._source.title + ' (' + data.hits.hits[i]._type + ')'+    */
                             + data.hits.hits[i]._source.title + /*' (' + parseFloat(data.hits.hits[i]._score).toFixed(1) + ')'+*/
                                '</a></li>';                        
                        }
                        $(".elasticsearch").remove();
                        if (nb > 0) {
                            $("#searchresults").prepend(str).listview("refresh");
                        }
                    },                
                    error: function (xhr, ajaxOptions, thrownError) {
                        _message("Problème avec l'instance Elasticsearch.\n" +  thrownError + "\n Désactivation du service." );
                        _searchparams.features = false;
                        $('#param_search_features').prop('checked', _searchparams.features).checkboxradio('refresh');
                    }
                });
            }
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
        if (_elasticSearchUrl && _searchparams.features && $("#searchfield").val()) {
           _sendElasticsearchRequest($("#searchfield").val());
        }
    };
    
     /**
     * Private Method: _calculateScale
     *
     *Parameter res - resolution
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
    };
    
    /**
     * Private Method: _mapLayersChange
     *
     *Parameter l - layer
     */

    var _mapLayersChange = function () {
        //Update legendePanel
        if ($("#maplegend-popup").css("visibility") === "visible") {            
            mviewer.getLegend(false);
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
     * Private Method: _setLayerGroupStatus
     *
     *Parameter theme id
     */
     
     var _setLayerGroupStatus = function (themeID) {
        var status = 0;
        //var icon = "check";
        var icon;
        var theme = _themes[themeID];
        var visibleLayers = 0;
        var nbLayers = 0;
        var msg = "Afficher toutes les couches " + theme.name;
        $.each( theme.layers, function( key, l ) {                
                visibleLayers += l.checked;
                nbLayers += 1;                           
        });
        switch (visibleLayers) {
            case nbLayers:
                status = 2;
                msg = "Masquer toutes les couches " + theme.name;
                //icon = "forbidden";                
                break;
            case 0:
                status = 0;
                //icon = "eye";
                break;
             default:
                status = 1;                
        }
        icon = "layerstatus" + status;
        //$("#theme-layers-" + themeID).removeClass("theme-layers-status-0 theme-layers-status-1 theme-layers-status-2").addClass("theme-layers-status-" + status);
        $("#theme-layers-" + themeID).data("status", status).attr("title", msg).buttonMarkup({ icon: icon });
        
     };
     
     /**
     * Private Method: _initDataList
     *
     *Parameter 
     */

    var _initDataList = function () {
		var htmlListGroup = '';
        var reverse_themes = [];
        var crossorigin = (_legendRenderer === "canvas")?'crossorigin="anonymous"':'';
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
				htmlListLayers += new TPLLayercontrol(layer.id, layer.name, layer.legendUrl, 
					layer.queryable, layer.checked, crossorigin, layer.searchable).html();
			});
			htmlListGroup +=  new TPLLayergroup(theme.name, htmlListLayers, theme.collapsed, theme.id).html();            
        });	       
			
        $("#datalist").html(htmlListGroup);
        $("#datalist").trigger("create");
        
        $.each(_themes, function (id, theme) {  
            _setLayerGroupStatus(id);
        });        
		
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
        // Button to show/hide all layers in the theme
        $(".theme-layers-btn").click(function( event ) {
            event.preventDefault();
            event.stopPropagation();
            var currentTheme = $(event.target).data("mvtheme");
            var action = $(event.target).data("action");
            var status = $(event.target).data("status");
            if (status === 2) { action = false;}
            var layers = _themes[currentTheme].layers;
            $.each( layers, function( key, l ) {
                l.layer.setVisible(action);
                l.checked = action;
                $("#datalist").find('input[name="'+l.id+'"]').prop( "checked", action).checkboxradio( "refresh" );              
            });
            $(event.target).data("status", action === true ? 2 : 0); // 0 = no layer visible, 2 = all layers visibles.
            $(event.target).data("action", !action);
            _setLayerGroupStatus(currentTheme);
            _mapLayersChange();
        });
        _updateLayersScaleDependancy(_calculateScale(_map.getView().getResolution()));
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

    var _updateLayersScaleDependancy = function (scale) {
        $.each( _scaledDependantLayers, function (i, item) {
            if (item.scale) {
                if (scale > item.scale.min && scale <= item.scale.max) {
                    $( "[data-layer='"+item.id+"']>a" ).removeClass("ui-state-disabled");                        
                } else {
                    $( "[data-layer='"+item.id+"']>a" ).addClass("ui-state-disabled");
                }
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
            l =  new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: params.attr("url"),
                    crossOrigin: _crossorigin,
                    maxZoom: params.attr("maxzoom") || 18,                               
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
                    crossOrigin: _crossorigin,
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
        $.each(_themes, function (id, theme) {  
            _setLayerGroupStatus(id);
        });        
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
    
    var _parseWMCResponse = function (response, wmcid) {
        var wmc = $('ViewContext', response);
        var wmc_extent = {};
        wmc_extent.srs=$(wmc).find('General > BoundingBox').attr('SRS');
        wmc_extent.minx = parseInt($(wmc).find('General > BoundingBox').attr('minx'));
        wmc_extent.miny = parseInt($(wmc).find('General > BoundingBox').attr('miny'));
        wmc_extent.maxx = parseInt($(wmc).find('General > BoundingBox').attr('maxx'));
        wmc_extent.maxy = parseInt($(wmc).find('General > BoundingBox').attr('maxy'));
        var map_extent = ol.proj.transformExtent([wmc_extent.minx, wmc_extent.miny, wmc_extent.maxx, wmc_extent.maxy], wmc_extent.srs, _projection.getCode());
        var title = $(wmc).find('General > Title').text() ||  $(wmc).attr('id');   
        var themeLayers = {};
        $(wmc).find('LayerList > Layer').each(function() {        
            // we only consider queryable layers
            if ($(this).attr('queryable')=='1') {
                var oLayer = {};
                oLayer.checked = ($(this).attr('hidden')==='0')?true:false;
                oLayer.id = $(this).children('Name').text();
                oLayer.name = $(this).children('Title').text();                
                oLayer.attribution = $(this).find("attribution").find("Title").text() || "";
                oLayer.metadata = $(this).find('MetadataURL > OnlineResource').attr('xlink:href');
                //fixme
                if (oLayer.metadata && oLayer.metadata.search('geonetwork') > 1) {
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
                oLayer.legendUrl = _getlegendUrl(oLayer); 
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
                console.log("wmc", oLayer);                
                themeLayers[oLayer.id] = oLayer;
                var l = new ol.layer.Image({
                    source: new ol.source.ImageWMS({
                        url: oLayer.url,					
                        crossOrigin: _crossorigin,            
                        params: {
                            'LAYERS': oLayer.id,
                            'STYLES':oLayer.style,
                            'FORMAT': 'image/png',
                            'TRANSPARENT': true
                        }
                    })
                });
                l.setVisible(oLayer.checked); 
                l.setOpacity(oLayer.opacity);
                if (oLayer.scale && oLayer.scale.max) { l.setMaxResolution(_convertScale2Resolution(oLayer.scale.max)); }  
                if (oLayer.scale && oLayer.scale.min) { l.setMinResolution(_convertScale2Resolution(oLayer.scale.min)); } 
                l.set('name', oLayer.name);                
                themeLayers[oLayer.id].layer = l;
                //_themes['wmc'].layers[oLayer.id] = themeLayers[oLayer.id];                
                _queryableLayers.push(l);                                     
                _overLayers[oLayer.id] = themeLayers[oLayer.id];
                if (oLayer.scale) {
                    _scaledDependantLayers.push(oLayer);
                }
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
        _WMTSTileMatrix = {'EPSG:3857': [], 'EPSG:4326': [],'EPSG:2154': [],'PM':[]};
        _WMTSTileResolutions = {'EPSG:3857': [], 'EPSG:4326': [],'EPSG:2154': [],'PM':[]};
        for (var z = 0; z < 22; ++z) {
                // generate resolutions and matrixIds arrays for this GEOSERVER WMTS
                _WMTSTileResolutions['EPSG:3857'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['EPSG:3857'][z] = 'EPSG:3857:' + z;
                _WMTSTileResolutions['EPSG:4326'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['EPSG:4326'][z] = 'EPSG:4326:' + z;
                _WMTSTileResolutions['EPSG:2154'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['EPSG:2154'][z] = 'EPSG:2154:' + z;
        }
         for (var z = 0; z < 20; ++z) {
                // generate resolutions and matrixIds arrays for this GEOPORTAIL WMTS
                _WMTSTileResolutions['PM'][z] = size / Math.pow(2, z);
                _WMTSTileMatrix['PM'][z] = z;
        }        
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

            var flashStyle = new ol.style.Circle({
              radius: radius,
              snapToPixel: false,
              stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, ' + opacity + ')',
                width: 3,
                opacity: opacity
              })
            });

            vectorContext.setImageStyle(flashStyle);
            vectorContext.drawPointGeometry(flashGeom, null);
            if (elapsed > duration) {
              ol.Observable.unByKey(listenerKey);
              source.removeFeature(feature);
              return;
            }
            // tell OL3 to continue postcompose animation
            frameState.animate = true;
          }
          listenerKey = _map.on('postcompose', animate);
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
                var stroke = new ol.style.Stroke({color: 'red', width: 2});
                var fill = new ol.style.Fill({color: 'red'});
                var style = new ol.style.Style({
                    image: new ol.style.RegularShape({
                      fill: fill,
                      stroke: stroke,
                      points: 4,
                      radius: 10,
                      radius2: 0,
                      angle: 0
                    })
                });                
                vector = new ol.layer.Vector({
                  source: source,
                  style: style
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

        setTool: function (tool, origin) {
            if (($("#measurebtn").hasClass("ui-btn-active")) && (origin === 'measurebtn')) {              
                tool = 'info';
            }
            _deactivateTools();
            _clearTools();
            switch (tool) {
            case 'info':
                _getFeatureInfoControl(true);
                $("#infobtn").addClass('ui-btn-active');            
                break;
            case 'measureline':
                $("#drawtoolsoptions").show();
                _addMeasureInteraction('LineString');
                $('#measurelinebtn').addClass('ui-btn-active');
                $("#measurebtn").addClass("ui-btn-active");
                break;           
            case 'measurearea':
                 $("#drawtoolsoptions").show();
                 _addMeasureInteraction('Polygon');
                 $('#measureareabtn').addClass('ui-btn-active');
                 $("#measurebtn").addClass("ui-btn-active");
                break;
            }            
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
            if (_legendRenderer === "canvas") {
               _mapLayersChange();
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
            _setLayerGroupStatus(_overLayers[id].theme);
            _mapLayersChange(id);
        },
        
        reorderLayer: function (layer, newIndex) {
            var layers = _map.getLayers().getArray();
            var oldIndex = layers.indexOf(layer);
            layers.splice(newIndex, 0, layers.splice(oldIndex, 1)[0]);
            //_map.render();
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
            if (config.popup) {
                linkParams.popup = config.popup;
            }
            var url = window.location.href.split('?')[0].replace('#','') + '?' + $.param(linkParams);            
            $("#permalinklink").attr('href',url).attr("target", "_blank");
            $("#permaqr").attr("src","http://chart.apis.google.com/chart?cht=qr&chs=140x140&chl=" + encodeURIComponent(url));
            return url;
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
                _options = xml;
                //Application customization (logo, title, helpfile) /
                var applicationOverride = $(xml).find("application");
                if (applicationOverride.attr("title")) {
                    document.title = applicationOverride.attr("title");
                    $(".mv-title").text(applicationOverride.attr("title"));
                }
                if (applicationOverride.attr("logo")) {                    
                    $('.mv-title').css('background-image', 'url("' + applicationOverride.attr("logo") + '")');
                }                
                if (applicationOverride.attr("panelfooterheight") && applicationOverride.attr("panelfooterimage")) {
                    var height = parseInt(applicationOverride.attr("panelfooterheight"));
                    $('#panel-footer').css('background-image', 'url("' + applicationOverride.attr("panelfooterimage") + '")').css('height', height + 'px');
                    $("#datalist,#mapinfos").css('bottom', (height +20)+'px');                    
                }
                //hack css modif
                setTimeout(function(){$("#panel-footer").trigger('resize');}, 2000);   
                
                if (applicationOverride.attr("help")) {
                    $(".mv-help").attr("href", applicationOverride.attr("help"));
                }
                if (applicationOverride.attr("exportpng") === "true" ) {
                    _crossorigin = "anonymous";
                } else {
                     $("#exportpng").hide();
                }
                if ((!applicationOverride.attr("legend")) || (applicationOverride.attr("legend")==="false")){
                    $("#legendbtn").hide();               
                }
                if (applicationOverride.attr("legendasimage")==="true") {
                    _legendRenderer = "canvas";
                }
                if (applicationOverride.attr("print")==="true") {
                    _print = true;
                } else {
                     $("#printbtn").hide();
                }                
                if (applicationOverride.attr("popup")==="false") {
                    _popupInfos = false;                    
                }
                if (config.popup) {
                    if (config.popup === "true") {
                        _popupInfos = true;
                    } else {
                        _popupInfos = false;
                    }
                }
                if (!_popupInfos) {
                    $("#popup").remove();
                    $("#mapinfos").append('<div id="popup-content"></div>');
                }
                
                if ((!applicationOverride.attr("measuretools")) || (applicationOverride.attr("measuretools")==="false")){
                    $(".mv-modetools").remove();               
                }
                //map options
                var options = $(xml).find("mapoptions");                
                _zoom = parseInt(options.attr("zoom")) || 8;
                _center = options.attr("center").split(",").map(Number);
                //Projection
                switch (options.attr("projection")) {
                    case "EPSG:3857":
                    case "EPSG:4326":
                        _projection = ol.proj.get(options.attr("projection"));
                        break;
                        
                    default:
                        _projection = new ol.proj.Projection({
                          code: options.attr("projection"),
                          extent: options.attr("projextent").split(",").map(function(item) {return parseFloat(item);})
                        });
                }               
                
                _initWMTSMatrixsets();
                
                $( "#popup-closer" ).bind( "click", function() {
                    $("#popup").hide();
                    $("#popup-closer").blur();
                    return false;
                });
                var overlays = [];
                if (_popupInfos) {
                    _overlay =  new ol.Overlay({element: $("#popup")});
                    overlays.push(_overlay);
                    $("#tabInfos").remove();
                } else {                    
                    $("#popup-content").append('<div data-role="ui-content"><p>Cliquer sur la carte afin de procéder à l\'interrogation des données</p></div>');
                }
                _marker = new ol.Overlay({ positioning: 'bottom-left', element: $("#els_marker"), stopEvent: false}); 
                overlays.push(_marker);
                
                if (config.x && config.y && config.z) {
                   _center =   [parseFloat(config.x), parseFloat(config.y)];       
                   _zoom = parseInt(config.z);
                } 
                _map = new ol.Map({
                    target: 'map',
                    controls: [
                        //new ol.control.FullScreen(),
                        new ol.control.ScaleLine(),
                        new ol.control.Attribution({label: "\u00a9"})                        
                      ],                    
                    overlays: overlays,
                    renderer: _renderer,
                    view: new ol.View({
                        projection: _projection,
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
                            } else {
                                console.log("Kartenn n'a pas détecté la présence du security-proxy georChestra.\n L'accès aux couches protégées et à l'authentification n'est donc pas possible");
                            }
                        }
                    });                
                }                
                _olsCompletionUrl = $(xml).find('olscompletion').attr("url");                
                $("#adresse-attribution").text($(xml).find('olscompletion').attr("attribution"));
                _olsCompletionType = $(xml).find('olscompletion').attr("type") || "geoportail";
                _elasticSearchUrl = $(xml).find('elasticsearch').attr("url");
                _elasticSearchQuerymode = $(xml).find('elasticsearch').attr("querymode");
                _elasticSearchGeometryfield = $(xml).find('elasticsearch').attr("geometryfield");
                // common id between elasticsearch document types (_id)  and geoserver featureTypes
                _elasticSearchLinkid = $(xml).find('elasticsearch').attr("linkid") || "featureid";
                                
                 if ($(xml).find('searchparameters').attr("bbox") && $(xml).find('searchparameters').attr("localities") && $(xml).find('searchparameters').attr("features")) {
                    _searchparams.bbox = ($(xml).find('searchparameters').attr("bbox") === "true");
                    _searchparams.localities = ($(xml).find('searchparameters').attr("localities") === "true");
                    _searchparams.features = ($(xml).find('searchparameters').attr("features") === "true");                   
                } 
                $('#param_search_bbox').prop('checked', _searchparams.bbox).checkboxradio('refresh')
                        .bind( "change",function() {_searchparams.bbox=this.checked;});
                $('#param_search_localities').prop('checked', _searchparams.localities).checkboxradio('refresh')
                    .bind( "change",function() {_searchparams.localities=this.checked;});
                $('#param_search_features').prop('checked', _searchparams.features).checkboxradio('refresh')
                    .bind( "change",function() {_searchparams.features=this.checked;});
                    
                if (_searchparams.features === false) {
                    $('#searchparameters .searchfeatures').remove('.searchfeatures');
                } else {
                    $("#searchfield").attr("placeholder", "Rechercher...").attr("title", "Rechercher...")
                }                
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
                    var reg=new RegExp("[,]+", "g");
                    var wmcs=config.wmc.split(reg);
                    for (var i=0; i<wmcs.length; i++) {
                     (function(key) {
                         var wmcid = "wmc"+key ;
                         $.ajax({
                             url:_ajaxURL(wmcs[key]),
                             dataType: "xml",                       
                             success: function (xml) {
                                 var wmc = _parseWMCResponse(xml, wmcid);
                                 _themes[wmcid] = {};
                                 _themes[wmcid].collapsed = false;
                                 _themes[wmcid].id = wmcid;                                               
                                 _themes[wmcid].layers = {};                           
                                 console.log ("adding "+wmc.title+" category");
                                 _map.getView().fit(wmc.extent, _map.getSize());
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
                            oLayer.theme = themeid;
                            oLayer.rank = layerRank;
                            oLayer.name = $(this).attr("name");
                            oLayer.featurecount = $(this).attr("featurecount");
                            oLayer.style = $(this).attr("style");
                            oLayer.filter = $(this).attr("filter");
                            oLayer.opacity = parseFloat($(this).attr("opacity") || "1");
                            oLayer.attribution = $(this).attr("attribution");
                            oLayer.metadata = $(this).attr("metadata");
                            oLayer.metadatacsw = $(this).attr("metadata-csw");
                            oLayer.url = $(this).attr("url");                        
                            oLayer.queryable = ($(this).attr("queryable") == "true") ? true : false;
                            oLayer.searchable = ($(this).attr("searchable") == "true") ? true : false;
                            oLayer.searchid = ($(this).attr("searchid"))? $(this).attr("searchid") : _elasticSearchLinkid;
                            oLayer.infoformat = $(this).attr("infoformat");
                            oLayer.checked = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.visiblebydefault = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.tiled = ($(this).attr("tiled") == "true") ? true : false;
                            oLayer.ns = ($(this).attr("namespace")) ? $(this).attr("namespace") : null;
                            oLayer.legendUrl=($(this).attr("legendurl"))? $(this).attr("legendurl") : _getlegendUrl(oLayer);
                            oLayer.useproxy = ($(this).attr("useproxy") == "true") ? true : false;
                            if ($(this).attr("fields") && $(this).attr("aliases")) {
                                oLayer.fields = $(this).attr("fields").split(",");
                                oLayer.aliases = $(this).attr("aliases").split(",");
                            }
                            
                            if($(this).attr("iconSearch")){

                                oLayer.iconSearch=$(this).attr("iconsearch");
                            }
                            else {

                                oLayer.iconSearch="img/star.svg";
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
                            var wms_params = {
                                'LAYERS': $(this).attr("id"),
                                'STYLES':(themeLayers[layerId].style)? themeLayers[layerId].style : '',
                                'FORMAT': 'image/png',
                                'TRANSPARENT': true                                      
                            };
                            if (oLayer.filter) {
                                wms_params['CQL_FILTER'] = oLayer.filter;
                            }
                            switch (oLayer.tiled) {
                                case true:
                                    wms_params['TILED'] = true;
                                    l = new ol.layer.Tile({
                                        source: new ol.source.TileWMS({
                                            url: $(this).attr("url"),
                                            crossOrigin: _crossorigin,
                                            /*attributions: [new ol.Attribution({
                                                html: oLayer.attribution
                                            })],*/
                                            tileLoadFunction: function (imageTile, src) {
                                                if (oLayer.useproxy) {
                                                    src = _proxy + encodeURIComponent(src);                                                    
                                                }
                                                imageTile.getImage().src = src;
                                            },                                           
                                            params: wms_params
                                        })
                                    });                                    
                                    break;
                                case false:
                                    l = new ol.layer.Image({
                                        source: new ol.source.ImageWMS({
                                            url: $(this).attr("url"),
                                            crossOrigin: _crossorigin,
                                            /*attributions: [new ol.Attribution({
                                                html: oLayer.attribution
                                            })],*/
                                            imageLoadFunction: function (imageTile, src) {
                                                if (oLayer.useproxy) {
                                                    src = _proxy + encodeURIComponent(src);                                                    
                                                }
                                                imageTile.getImage().src = src;
                                            },                           
                                            params: wms_params
                                        })
                                    });                                    
                                    break;                        
                            }                           
                            l.setVisible(false);
                            l.setOpacity(oLayer.opacity);
                            if (oLayer.scale && oLayer.scale.max) { l.setMaxResolution(_convertScale2Resolution(themeLayers[layerId].scale.max)); }  
                            if (oLayer.scale && oLayer.scale.min) { l.setMinResolution(_convertScale2Resolution(themeLayers[layerId].scale.min)); } 
                            l.set('name', $(this).attr("name"));
                            themeLayers[layerId].layer = l;
                            _themes[themeid].layers[layerId] = themeLayers[layerId];
                            if (themeLayers[layerId].queryable) {
                                _queryableLayers.push(l);
                            }
                            if (themeLayers[layerId].searchable) {
                                _searchableLayers.push(l);
                            }
                            if (themeLayers[layerId].scale) {
                                _scaledDependantLayers.push(themeLayers[layerId]);
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
               
                //Activate GetFeatureInfo mode
                _getFeatureInfoControl(true);
                $("#infobtn").addClass('ui-btn-active'); 
                
                //Export PNG
                if (applicationOverride.attr("exportpng")) {                   
                    var exportPNGElement = document.getElementById('exportpng');
                    if ('download' in exportPNGElement) {
                      exportPNGElement.addEventListener('click', function(e) {
                        _map.once('postcompose', function(event) {
                            try {
                              var canvas = event.context.canvas;
                              exportPNGElement.href = canvas.toDataURL('image/png');
                            }
                            catch(err) {
                                _message(err);
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
                _map.on('moveend', _mapChange);
                //Handle zoom change
                _map.getView().on('change:resolution', _mapZoomChange);
                //Fix viewPort size change by themepanel
                $("#themepanel").on('panelopen', function(e, ui) {
                    //_map.updateSize();
                    $(".ol-scale-line").css("left","358px");
                });
                $("#themepanel").on('panelclose', function(e, ui) {
                    //_map.updateSize();
                    $(".ol-scale-line").css("left","8px");
                });
                $('#themepanel [data-role="collapsible"]').on('collapsibleexpand',function(e, ui) {
                    //_map.updateSize();
                });
                $('#themepanel [data-role="collapsible"]').on('collapsiblecollapse',function(e, ui) {
                    //_map.updateSize();                    
                    //$(window).trigger('resize');
                });
                
                //Hack ol3 control color
                var themecolor = $("#backgroundlayerstoolbar a").css("background-color");
                $(".ol-control button").css("background-color", themecolor);
                
                //plugins               
                var wdgts = $(xml).find('widget');
                $(wdgts).each(function () {
                    var widget = $(this).attr("name");
                    $.getScript('widgets/' + widget + '/init.js')
                        .fail(function (jqxhr, settings, exception) {
                            _message("Un widget n'a pu être chargé.");
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

        zoomToLocation: function (x, y, zoom, lib) {                
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', _projection.getCode());           
            _map.getView().setCenter(ptResult);
            _map.getView().setZoom(zoom);
            $("#searchresults").html("").listview("refresh");
            $("#searchtool .ui-icon-delete").click();

        },
        
          /**
         * Public Method: queryLayer
         *
         */

        queryLayer: function (x, y, proj, layer, featureid) {
            mviewer.zoomToLocation(x,y,16);     
            var pt = ol.proj.transform([x, y], proj, _projection.getCode());
            var p = _map.getPixelFromCoordinate(pt);
            $.mobile.loading('show', {
                text: 'Interrogation en cours.',
                textonly: false,
                textVisible: false,
                theme: 'b',        
                html: ''
            });
            _queryMap({coordinate:[pt[0],pt[1]]},layer, featureid);
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
         * Public Method: panelShowTab
         *
         */

        panelShowTab: function (tab) {
            var visibleTab = $(".mv-tab-panel:visible").attr("id");
            if (visibleTab != tab) {
                if (tab === 'mapinfos') {                
                    $("#datalist").hide();
                    $("#tabThemes").removeClass("ui-btn-active");
                    $("#mapinfos").slideDown("slow");  
                    $("#tabInfos").addClass("ui-btn-active");  
                } else {  
                    $("#mapinfos").hide();
                    $("#tabInfos").removeClass("ui-btn-active");
                    $("#datalist").slideDown("slow");
                    $("#tabThemes").addClass("ui-btn-active"); 
                }
            }
            return false;
        },
        
        /**
         * Public Method: print
         *
         */
         
        print: function () {
            if (_legendRenderer === "canvas") {
                if ($("#maplegend-popup").css("visibility") !== "visible") {
                    mviewer.getLegend(false);
                }
                $.post('print.php',
                    {  
                        legend : document.getElementById("canvas-legend").toDataURL("image/png"),
                        map: $("#map canvas")[0].toDataURL("image/png")
                    }, function(data) {                       
                        if (data.success) {
                            window.open("print.html?job="+data.job, "_blank");
                        }
                    });
            }
        },
        
        /**
         * Public Method: hideLocation
         *
         */

        hideLocation: function ( ) {
            $("#els_marker").hide();
        },
        
        /**
         * Public Method: getLegend         
         * Render a legend panel in a div or a canvas to export as png.
         */
        
        getLegend:function (showLegend) {
            var legend = [];
            var sources = [];
            
            for (var i = 0; i < _backgroundLayers.length; i += 1) {
                var l = _backgroundLayers[i];
                if (l.getVisible()) {
                    sources.push(l.getSource().getAttributions()[0].getHTML());
                    break;
                }
            }
            
            $.each(_overLayers, function (i, item) {
                if (item.layer.getVisible()) {
                    if (_legendRenderer === "canvas") {
                        legend.push({id: 'legend-' + item.id, label:item.name, image: item.legendUrl});
                    } else {
                        legend.push('<div class="mv-all-legend"><label>'+item.name+'</label><img src="'+item.legendUrl+'"></img></div>');
                    }
                    sources.push(item.attribution);
                }
            });            
            //Draw in Canvas
            if (_legendRenderer === "canvas") {            
                $("#legend-content").html('<canvas id="canvas-legend" class="legend-area" ></canvas>');                
                var c=document.getElementById("canvas-legend");
                var ctx=c.getContext("2d");
                var canvasHeight = 0;
                var canvasWidth = 300;
                $.each(legend, function (i, leg) {
                    var img = document.getElementById(leg.id);                    
                    canvasHeight+=img.height + 25;
                    canvasWidth = (img.width > canvasWidth)? img.width: canvasWidth;
                });
                c.height = canvasHeight +60;
                c.width = canvasWidth +10;
                var y = 0;
                $.each(legend.reverse(), function (i, leg) {
                    var img = document.getElementById(leg.id);
                    img.setAttribute('crossOrigin', 'anonymous');
                    ctx.font = "12px Arial";
                    ctx.fillText(leg.label,0,y+=15);
                    ctx.drawImage(img,5,y+=5);
                    y+=img.height + 5;
                });
                ctx.font = "10px Arial";
                var sourcesMaxWidth = canvasWidth + 10;
                var sourcesLineHeight = 15;
                var d = new Date();
                var tmp = $("<div>").attr("style","display:none");
                var text = "Sources : " + tmp.html($.unique(sources).join(', ')).text() + ". " +
                   (d.getDay() +1) + "/" +  (d.getMonth()+1) +"/"  + d.getFullYear()+ ".";
                tmp.remove();
                _wrapText(ctx, text, 0, y+10, sourcesMaxWidth, sourcesLineHeight);                                
                $("#legend-content").append('<a title="Exporter la légende au format image/png" id="legend-export-png" ' +
                    'class="ui-btn ui-icon-save ui-btn-icon-notext ui-corner-all" download="legende.png" href=""></a>');
                $("#canvas-legend").css("max-height", ($("body").height() -150) + "px");
                // Fix IE9 crossOrigin issue
                try {
                    var link = document.getElementById("canvas-legend").toDataURL("image/png");
                    $("#legend-export-png").attr("href",link);
                } catch(e) {
                    $("#legend-export-png").hide();
                    console.log(e);
                }
            } else {
                $("#legend-content").html('').append(legend.reverse().join(' '));
            }
            $("#source-content").html('').append($.unique(sources).join(', '));            
            if (showLegend) {
                $("#maplegend").popup('open', {dismissible : false} );
                $("#maplegend").draggable({ handle: "h2", cursor: 'move' });
            }
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
             $.each(_themes, function (id, theme) {  
                _setLayerGroupStatus(id);
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
