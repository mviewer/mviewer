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
 
String.prototype.sansAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
}

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

    //var _popupInfos = true;
    
     /**
     * Property: _queryMapCoordinate
     * {Array} Coordinate of the queryMap click
     */
    
    var _queryMapCoordinate = null;
    
   
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
     * Property: _vectorLayers
     * Array of {ol.layer.Vector} .
     */

    var _vectorLayers = [];
    
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
     
    var _description = false;
    
    /**
     * Property: _description
     * String
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
     * Property: _elasticSearchDocTypes
     * String. The Elasticsearch document types to use in all search requests
     */
     
    var _elasticSearchDocTypes = null;
    
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
     
    var _searchparams = { localities : true, bbox: false, features: false, static: false};
  
    
    /**
     * Property: _marker
     * marker used to locate features on the map.
     * @type {ol.Overlay}
     */
     
    var _marker = null;
    
    var _topLayer = false;

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
    
    var _modMeasureEnabled = false;
    
    var _featureTooltip;
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

    var _sourceOverlay;
    
    var _overlayFeatureLayer = false;
    
    var _activeTooltipLayer;
    
    /**
     * _message Show message method.
     * @param {String} msg
     */
    
    var _message = function (msg, cls) {
       var item = $(['<div class="alert '+cls+' alert-dismissible" role="alert">',
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
              msg,
            '</div>'].join (""));
            $("#alerts-zone").append(item);
    };
    
    /**
     * _testConfig
     * @param {xml} config xml to test
     */
    
    var _testConfig = function (xml) {
        var score = 0;
        var nbtests = 2;
        //test doublon name layers        
        var test = [];
        var doublons = 0;
        $('layer',xml).each(function() {
            var name = $(this).attr("name");
            if ($.inArray(name, test)) {
                test.push(name);
            } else {
                doublons = 1;
                console.log("doublon " + name + " in layers");                
            }                
        });
        score+=(doublons === 0);
        //test = 1 baselayer visible 
        test = $(xml).find( 'baselayer[visible="true"]').length;
        if (test === 1) {
            score+=1;
        } else {
            console.log(test + " baselayer(s) visible(s)");
        }        
        //Résultats tests
        console.log("tests config :" + ((score/nbtests)===1));
    };    
    var _removeLayer = function (layername) {        
         $( "[data-layerid='"+layername+"']").remove();
        _map.removeLayer(_overLayers[layername].layer);
        delete _overLayers[layername]; 
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
        _measureTooltipResult.className = 'tooltip2 tooltip-measure';
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
            style: mviewer.featureStyles.drawStyle
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
            _measureTooltipResult.className = 'tooltip2 tooltip-measure-static';
            _measureTooltip.setOffset([0, -7]);            
            _sketch = null;            
            _measureTooltipResult = null;
            _createMeasureTooltip();
            ol.Observable.unByKey(listener);
          }, this);
    };   
    
     /**
     * Private Method: _queryMap()
     *
     */
     
    var _queryMap = function (evt, options) {        
        var queryType = "map"; // default behaviour
        var featureInfosHtml = {'right-panel':[], 'bottom-panel':[]}; // structured html infos are put here
        
        var tabs = {'right-panel': Array(_map.getLayers().getLength()), 'bottom-panel': Array(_map.getLayers().getLength())};        
        var id_tab = {'right-panel' : 0, 'bottom-panel' : 0 };        
        if (options) {
            // used to link elasticsearch feature with wms getFeatureinfo
            var layer = options.layer;
            var featureid = options.featureid;
            queryType = options.type;
        }
        if (!_mvReady) {
            return False;
        }
        
        //Request vector layers
        if (queryType === 'map') {
            var pixel = evt.pixel;
            var vectorLayers = {};
            var format = new ol.format.GeoJSON();
            _map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                 var l = layer.get('mviewerid');                 
                
                 if (l != 'featureoverlay') {
                     var queryable = _overLayers[l].queryable;
                     if (queryable) {
                         if (vectorLayers[l] && vectorLayers[l].features) {
                            vectorLayers[l].features.push(format.writeFeatureObject(feature));
                         } else {
                            vectorLayers[l] = {features:[]};
                            vectorLayers[l].features.push(format.writeFeatureObject(feature));
                         }
                     }
                 }               
            });        
            for(var layerid in vectorLayers) {                
                if (mviewer.customLayers[layerid] && mviewer.customLayers[layerid].handle) {
                    mviewer.customLayers[layerid].handle(vectorLayers[layerid].features);
                } else if (mviewer.customControls[layerid] && mviewer.customControls[layerid].handle){    
                    mviewer.customControls[layerid].handle(vectorLayers[layerid].features);
                } else {
                    var l = _overLayers[layerid];
                    if (l) {
                        var panel = l.infospanel;
                        id_tab[panel]+=1;
                        var name = l.name;
                        var theme = l.theme;
                        var theme_icon = "glyphicon-triangle-right";
                        if ($(_options).find('theme[id="'+theme+'"]').attr("icon")) {
                            theme_icon = "fa-lg fa-" + $(_options).find('theme[id="'+theme+'"]').attr("icon");
                        }
                        /*tabs[panel].splice(l.rank,1,'<li title="'+l.name+'"><a href="#slide-'+panel+'-'+id_tab[panel]+'" >'+l.name+'</a></li>');*/
                        tabs[panel].splice(l.rank,1,                                
                                ['<li title="'+name+'">',
                                    '<a onclick="mviewer.setInfoPanelTitle(this,\''+panel+'\');" title="'+name+'" href="#slide-'+panel+'-'+id_tab[panel]+'" data-toggle="tab">',
                                        '<span class="fa '+theme_icon+'"></span>',
                                    '</a></li>'].join(" "));
                        
                        var slide =$(new TPLInfopanel( panel, id_tab).html());
                        if (_overLayers[layerid].template) {
                            $(slide).find("ul").append(applyTemplate(vectorLayers[layerid].features, _overLayers[layerid]));                                        
                        } else {
                            $(slide).find("ul").append(createContentHtml(vectorLayers[layerid].features, _overLayers[layerid]));                                
                        }
                        $(slide).find("li.item").first().addClass("active");
                        
                        if (vectorLayers[layerid].features.length === 1) {
                            $(slide).find(".carousel-control").remove(); 
                            $(slide).find(".counter-slide") .remove();                                   
                        }
                        if (slide) { featureInfosHtml[panel].push(slide);} 
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
            _queryMapCoordinate = evt.coordinate;           
            var urls = [];
            var params;
            for (var i = 0; i < visibleLayers.length; i++) {
                if (visibleLayers[i] instanceof ol.layer.Vector === false) {
                    params = {'INFO_FORMAT': _overLayers[visibleLayers[i].get("mviewerid")].infoformat,
                        'FEATURE_COUNT': _overLayers[visibleLayers[i].get("mviewerid")].featurecount                
                    };                
                    var url = visibleLayers[i].getSource().getGetFeatureInfoUrl(
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
                    var contentType = response.contenttype;                    
					var layerResponse = response.response;
                    var slide = null;
                    if ((typeof layerResponse === 'string') && (layerResponse.search('<!--nodatadetect--><!--nodatadetect-->')<0) && (layerResponse.search('<!--nodatadetect-->\n<!--nodatadetect-->')<0))
                    {                        
                        id_tab[panel]+=1;
                        var name = layerinfos.name;
                        var theme = layerinfos.theme;
                        var layerid = layerinfos.layerid;
                        var theme_icon = "glyphicon-triangle-right";
                        if ($(_options).find('theme[id="'+theme+'"]').attr("icon")) {
                            theme_icon = "fa-lg fa-" + $(_options).find('theme[id="'+theme+'"]').attr("icon");
                        }
                        
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
                            tabs[panel].splice(response.layerinfos.rank,1,                                
                                ['<li title="'+name+'" data-layerid="'+layerid+'">',
                                    '<a onclick="mviewer.setInfoPanelTitle(this,\''+panel+'\');" title="'+name+'" href="#slide-'+panel+'-'+id_tab[panel]+'" data-toggle="tab">',
                                        '<span class="fa '+theme_icon+'"></span>',
                                    '</a></li>'].join(" "));
                            slide =$(new TPLInfopanel( panel, id_tab).html()); 
                                                       
                            //test si présence d'une classe .carrousel eg template geoserver.
                            //Les éléments trouvés servent à la création d'un carrousel dédié
                            var carrousel_data=$(layerResponse).find(".carrousel li").addClass("item");
                            carrousel_data.first().addClass("active");
                            if(carrousel_data.length == 0){                                
                                $(slide).find("ul").append('<li class="item active">'+layerResponse+'</li>');
                                $(slide).find(".carousel-control").remove();
                            }
                            else {							
                                for( var i=0; i<carrousel_data.length; i++){						
                                    var page = $(slide).find("ul").append(carrousel_data[i]);
                                    if (carrousel_data.length > 1) {
                                        var li = $(page).find("li")[i];
                                        $(li).append('<p class="counter-slide">'+(i+1)+'/'+carrousel_data.length+'</p>');
                                    } else {
                                        $(slide).find(".carousel-control").remove();
                                    }
                                   
                                }
                                // ajout des ctrls du carrousel
                            }
                        }
                        else {
                            if (gml) {
                                var obj = _parseGML(gml);                            
                                if (obj.features.length > 0) {
                                    tabs[panel].splice(response.layerinfos.rank,1,                                       
                                        ['<li title="'+name+'" data-layerid="'+layerid+'">',
                                            '<a onclick="mviewer.setInfoPanelTitle(this,\''+panel+'\');" title="'+name+'" href="#slide-'+panel+'-'+id_tab[panel]+'" data-toggle="tab">',
                                                '<span class="fa '+theme_icon+'"></span>',
                                             '</a></li>'].join(" "));
                                    slide = $(new TPLInfopanel( panel, id_tab).html());
                                    if (layerinfos.template) {
                                        $(slide).find("ul").append(applyTemplate(obj.features, layerinfos));                                        
                                    } else {
                                        $(slide).find("ul").append(createContentHtml(obj.features, layerinfos));                                        
                                    }
                                    $(slide).find("li.item").first().addClass("active");
                                }
                                if (obj.features.length === 1) {
                                    $(slide).find(".carousel-control").remove(); 
                                    $(slide).find(".counter-slide") .remove();                                   
                                }
                            }
                        }
                        if (slide) { featureInfosHtml[panel].push(slide);}
                      } else {
                        console.log(layerResponse, contentType);
                      }
                    });
                $.each(featureInfosHtml, function (panel, value) {     
                    if(featureInfosHtml[panel].length>0){ 
                        $("#"+panel+" .popup-content").append([
                            '<div id="'+panel+'-selector">',
                                '<div class="row">',
                                    '<div class="col-md-12">',
                                      '<div class="tabs-left">',
                                        '<ul class="nav nav-tabs"></ul>',
                                        '<div class="tab-content"></div></div></div></div>'].join(" "));
                        $("#"+panel+"-selector .tab-content").append(featureInfosHtml[panel]);                    
                        tabs[panel] = tabs[panel].filter(function(n){ return n != undefined });
                        $("#"+panel+"-selector .nav-tabs").prepend(tabs[panel].reverse());                        
                        //$("#"+panel+"-selector .nav-tabs a").last().closest("li").addClass("active");
                        $("[href='#slide-"+panel+"-1']").closest("li").addClass("active");
                        $("#"+panel+"-selector .tab-pane").first().addClass("active in");
                        //var title = $("#"+panel+"-selector .nav-tabs a").last().closest("li").attr("title");
                        var title = $("[href='#slide-"+panel+"-1']").closest("li").attr("title");
                        $("#"+panel+" .mv-header h5").text(title);
                        
                        if (!$('#'+panel).hasClass("active")) {                   
                            $('#'+panel).toggleClass("active");
                        }
                        $("#"+panel+" .popup-content iframe").each(function( index) {
                            $(this).closest("li").append(['<div class="mv-iframe-indicator" >',
                                 '<div class="loader">Loading...</div>',
                             '</div>'].join(""));
                              $(this).on('load',function () {
                                    $(this).closest("li").find(".mv-iframe-indicator").hide();
                              });
                        });  
                        $("#"+panel+" .popup-content img").click(function(){mviewer.popupPhoto($(this).attr("src"))});
                        $("#"+panel+" .popup-content img").on("vmouseover",function(){$(this).css('cursor', 'pointer');}).attr("title","Cliquez pour agrandir cette image");
                        $(".popup-content .nav-tabs li>a").tooltip('destroy').tooltip({
                                animation: false,
                                trigger: 'hover',
                                container: 'body',
                                placement: 'right',
                                html: true,
                                template: '<div class="tooltip mv-tooltip" role="tooltip"><div class="mv-tooltip tooltip-arrow"></div><div class="mv-tooltip tooltip-inner"></div></div>'
                       });
                         mviewer.showLocation(_projection.getCode(), _queryMapCoordinate[0], _queryMapCoordinate[1]);
                        
                    } else {
                        $('#'+panel).removeClass("active");
                    }
                });
                $('#loading-indicator').hide();
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
    
    var _getlegendurl = function (layer) {
         var sld = "";
         if (layer.sld) {
            sld = '&SLD=' + encodeURIComponent(layer.sld);
         }
         return layer.url + '?service=WMS&Version=1.3.0&request=GetLegendGraphic&SLD_VERSION=1.1.0'+
            '&format=image%2Fpng&width=30&height=20&layer=' + layer.layername + '&style=' + layer.style + sld+
            '&legend_options=fontName:Open%20Sans;fontAntiAliasing:true;fontColor:0x777777;fontSize:10.5;dpi:96&TRANSPARENT=true';
    };

    /**
     * Private Method: _getFeatureInfoControl
     *
     */
     
    var _getFeatureInfoListener = function (evt) {
        $('#loading-indicator').show();
         _queryMap(evt);            
    };
    
    var _mouseOverFeature = function (evt) {
        if (evt.dragging ||  _modMeasureEnabled) {
          return;
        }
        if (!_featureTooltip) {
            _featureTooltip = $('#feature-info');
            _featureTooltip.tooltip({
                    animation: false,
                    trigger: 'manual',
                    container: 'body',
                    html: true,
                    template: '<div class="tooltip tooltip-feature" role="tooltip"><div class="tooltip-feature tooltip-arrow"></div><div class="tooltip-feature tooltip-inner"></div></div>'
            });
        }
        var pixel = _map.getEventPixel(evt.originalEvent);
        
        var feature = _map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            var ret = false;
            var layerid = layer.get('mviewerid');
            /*if (!(layerid in ['featureoverlay'])) {*/
            if (layerid === _activeTooltipLayer) {
                feature.set('mviewerid', layerid);
                ret = feature.clone();
            }
            return ret;
        });        
        if (feature && Object.keys(feature.getProperties()).length > 1) {
            $("#map").css("cursor", "pointer");
            _sourceOverlay.clear();
            var l = _overLayers[feature.get('mviewerid')];
            if (l) {
                _sourceOverlay.addFeature(feature);                        
                var title = (feature.getProperties()["name"] || feature.getProperties()["label"] || feature.getProperties()["title"] || feature.getProperties()["nom"] || feature.getProperties()[l.fields[0]]);
                 _featureTooltip.css({
                      left: (pixel[0]) + 'px',
                      top: (pixel[1] - 15) + 'px'
                  });
                 _featureTooltip.tooltip('hide')
                    .attr('data-original-title', title)
                    .tooltip('fixTitle')
                    .tooltip('show');
            }
        } else {
            _featureTooltip.tooltip('hide');
            $("#map").css("cursor", "");
            _sourceOverlay.clear();
        }        
    };
    
    var _getFeatureInfoControl = function (activation) {
        //WMS
        if (activation === true) {
            _map.on('singleclick', _getFeatureInfoListener);
            _map.on('pointermove', _mouseOverFeature);
         } else {
            _map.un('singleclick', _getFeatureInfoListener);
            _map.on('pointermove', _mouseOverFeature);
         }
    };    
        
    /**
     * Private Method: createContentHtml
     *
     * Parameter features
     * Parameter title
     * Parameter maxheight
     *
     * returns html content to display in panel
     */
     
    var _convertScale2Resolution = function (scale) {
         return scale * 0.28/1000;
    };
    
    var applyTemplate = function (olfeatures, olayer) {
        var tpl = olayer.template;
        var obj = {features: []};
        var activeAttributeValue = false;
        if (olayer.attributefilter && olayer.layer.getSource().getParams()['CQL_FILTER']) {                
                var activeFilter = olayer.layer.getSource().getParams()['CQL_FILTER'];
                activeAttributeValue = activeFilter.split('=')[1].replace(/\'/g, "");
        }
        olfeatures.forEach(function(feature){
            if (activeAttributeValue) {
                feature.properties[activeAttributeValue] = true;
            }
            obj.features.push(feature.properties);            
        });
        var rendered = Mustache.render(tpl, obj);
        return rendered;
    };

    var createContentHtml = function (features, olayer) {
        var html = '';
        var counter = 0;        
        features.forEach(function (feature) {
            var nbimg = 0;
            counter+=1;            
            var li = '<li class="item" ><div class="gml-item" ><div class="gml-item-title">' + feature.properties[olayer.fields[0]] +'</div>';           
            var attributes = feature.properties;
            var fields = (olayer.fields) ? olayer.fields : $.map(attributes, function (value, key) {
                return key;
            });
            var aliases = (olayer.fields) ? olayer.aliases : false;
            fields.forEach(function (f) {
                if (attributes[f] && f != fields[0]) { // si valeur != null
                    if (attributes[f].indexOf("http://") >= 0) {                        
                        if (attributes[f].toLowerCase().match( /(.jpg|.png|.bmp)/ )) { 
                            li += '<a onclick="mviewer.popupPhoto(\'' +  attributes[f] + '\')" ><img class="popphoto" src="' + attributes[f] + '" alt="image..." ></a>';                                
                        } else {
                            li += '<p><a href="' + attributes[f] + '" target="_blank">' + getAlias(f, aliases, fields) + '</a></p>';
                        }
                    } else {
                        li +=  '<div class="gml-item-field"><div class="gml-item-field-name">'+ getAlias(f, aliases, fields) + '</div><div class="gml-item-field-value" > ' + attributes[f] + '</div></div>';
                    }
                }
            });
            li += '</div></li>';            
            html += $(li).append('<p class="counter-slide">'+counter+'/'+features.length+'</p>')[0].outerHTML + "\n";            
        });        
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
       _modMeasureEnabled = false;
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
        $("#infobtn").removeClass('active');
        $('#measurelinebtn').removeClass('active');
        $("#measurebtn").removeClass("active");
        $('#measureareabtn').removeClass('active');
        $("#drawtoolsoptions").hide();
    };

    /**
     * Private Method: _initTools
     *
     */

    var _initTools = function () {        
        _sourceMesure = new ol.source.Vector();
        var vector = new ol.layer.Vector({
           source: _sourceMesure,
           style: mviewer.featureStyles.measureStyle
        });        
        _map.addLayer(vector);
        $("#zoomtoolbar button, #toolstoolbar button, #toolstoolbar a").tooltip({
            placement: 'left', 
            trigger: 'hover',
            html: true,
            container: 'body',
            template: '<div class="tooltip mv-tooltip" role="tooltip"><div class="mv-tooltip tooltip-arrow"></div><div class="mv-tooltip tooltip-inner"></div></div>'
        });
    };

    /**
     * Private Method: initVectorOverlay
     *
     */
     
    var _initVectorOverlay = function () {
        /*if (_vectorLayers.length > 0) {*/
            _sourceOverlay = new ol.source.Vector();
            _overlayFeatureLayer = new ol.layer.Vector({
                  source: _sourceOverlay,
                  style: mviewer.featureStyles.highlight
             });
             _overlayFeatureLayer.set('mviewerid', 'featureoverlay');
            _map.addLayer(_overlayFeatureLayer);
        /*}*/
    };
    
    /**
     * Private Method: _initSearch
     *
     */
     
    var _initSearch = function () {
        $("#searchtool a").attr("title", "Effacer");
        if (_searchparams.features || _searchparams.static) {
             _sourceEls = new ol.source.Vector();
             var vector = new ol.layer.Vector({
                  source: _sourceEls,
                  style: mviewer.featureStyles.elsStyle
                });
              vector.set('mviewerid', 'elasticsearch');
             _map.addLayer(vector); 
         }
        
        $("#searchtool .mv-searchtool-delete").click(function () {
            $("#searchresults").html("");
            $("#searchfield").val("");
            $(".mv-searchtool-delete").removeClass("active");
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
            var chars = $(this).val().length;
            if (chars === 0) {
                $(".mv-searchtool-delete").removeClass("active");
            } 
            else if ((chars >0) && (chars < 3)) {                
                $("#searchresults").html("");
                $(".mv-searchtool-delete").addClass("active");
            } else {
                _search($(this).val());
                $(".mv-searchtool-delete").addClass("active");
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
                        var str = '<li class="geoportail list-group-item disabled">Localités</li>';
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
                            str += '<li class="geoportail list-group-item" ><a href="#" onclick="mviewer.zoomToLocation(' + res[i].x + ',' + res[i].y + ',' + zoom + ',\'' + res[i].fulltext.replace("'", "*") + '\');" '+
                            'onmouseover="mviewer.flash('+'\'EPSG:4326\',' + res[i].x + ',' + res[i].y + ');"> '                            
                            + res[i].fulltext + '</a></li>';
                        }
                        $(".geoportail").remove()
                        if (res.length > 0) {                            
                             $("#searchresults").append(str);
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
                        var str = '<li class="geoportail list-group-item disabled">Localités</li>';
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
                            str += '<li class="geoportail list-group-item" data-icon="false" title="'+res[i].properties.context+' - ' + res[i].properties.type+'" >' +
                            '<a href="#" onclick="mviewer.zoomToLocation(' + res[i].geometry.coordinates[0] + ',' + res[i].geometry.coordinates[1] + ',' + zoom + ',\'' + res[i].properties.name.replace("'", "*") + '\');">'                            
                            + res[i].properties.label + '</a></li>';
                        }
                        $(".geoportail").remove();                        
                        $("#searchresults").append(str);
                    }
                });
            }
        }
        //ElasticSearch request
        if (_searchparams.features || _searchparams.static) {
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
        if (searchableLayers.length > 0 || (_searchparams.static && _elasticSearchDocTypes)) {
            var queryLayers = [];
            var currentExtent = _map.getView().calculateExtent(_map.getSize());
            var pe = ol.proj.transformExtent(currentExtent, _projection.getCode(), 'EPSG:4326');        
            for (var i = 0; i < searchableLayers.length; i++) {            
                queryLayers.push({"type":{"value": searchableLayers[i].getSource().getParams()['LAYERS']}});
            }
            if (_searchparams.static && _elasticSearchDocTypes) {
                var doctypes = _elasticSearchDocTypes.split(",");
                for (var i = 0; i < doctypes.length; i++) {
                    queryLayers.push({"type":{"value": doctypes[i]}});
                }
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
                    query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12, "fuzziness":0.7}};
                    break;
                default:                    
                    query = {"fuzzy_like_this" : {"like_text" : val, "max_query_terms" : 12, "fuzziness":0.7}};
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
                        var str = '<li class="elasticsearch list-group-item disabled" >Entités</li>';
                        var format = new ol.format.GeoJSON();                                               
                        var nb = data.hits.hits.length;
                        for (var i = 0, nb ; i < nb && i < 5; i++) {
                            var point = _shapeToPoint(data.hits.hits[i]._source.geometry);
                            var geom =  new ol.format.GeoJSON().readGeometry(data.hits.hits[i]._source.geometry);
                            var geomtype = geom.getType();
                            var action_click = "";    
                            var action_over = ""; 
                            var icon = "img/star.svg";
                            var title =   data.hits.hits[i]._source.title;
                            if (geomtype !== 'Point') {
                                var feature = new ol.Feature({geometry: geom.transform('EPSG:4326','EPSG:3857'), title:title});                                
                                action_click = 'mviewer.zoomToFeature(\'feature.'+i+'\');';                                    
                                feature.setId( "feature." +i);
                                _sourceEls.addFeature(feature);
                                action_over = 'mviewer.showFeature(\'feature.'+i+'\');';               
                            } else {
                                action_click = 'mviewer.zoomToLocation('  + point[0] + ',' + point[1]  + ',14);';
                                action_over = 'mviewer.flash('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');';                                   
                            }
                            if  (_overLayers[data.hits.hits[i]._type] ) {
                                //icon = _overLayers[data.hits.hits[i]._type].iconsearch;
                                action_click += 'mviewer.queryLayer(' + point[0] + ',' + point[1] + ',\'EPSG:4326\',\''+ data.hits.hits[i]._type+'\',\''+ data.hits.hits[i]._id+'\');';
                                action_over = 'mviewer.flash('+'\'EPSG:4326\',' + point[0] + ',' + point[1] + ');';
                            }
                            
                            str += '<li class="elasticsearch list-group-item" data-icon="false" ><a href="#" ' +                        
                            'onclick="'+action_click+ '" ' +                             
                            'onmouseover="'+action_over+'" ' +
                            'title="('+ data.hits.hits[i]._type + ') '+$.map(data.hits.hits[i]._source, function(el) { if (typeof(el)==='string') {return el}; }).join(", \n")+'">'                                                      
                             + title +
                                '</a></li>';                        
                        }                        
                        $(".elasticsearch").remove();
                        if (nb > 0) {                            
                            $("#searchresults").prepend(str);
                        }
                    },                
                    error: function (xhr, ajaxOptions, thrownError) {
                        _message("Problème avec l'instance Elasticsearch.\n" +  thrownError + "\n Désactivation du service." );
                        _searchparams.features = false; 
                       $('#param_search_features span').removeClass('mv-checked').addClass('mv-unchecked');                       
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
        if ($(_options).find("application").attr("help")) {
            $.ajax({
                url: $(_options).find("application").attr("help"),
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
     * Private Method: _getLayerByName
     *
     *Parameter name - layer name
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
        if (oLayer.queryable) {
            _queryableLayers.push(l);
        }
        if (oLayer.searchable) {
            _searchableLayers.push(l);
        }
        if (oLayer.scale) {
            _scaledDependantLayers.push(oLayer);
        }
        _overLayers[oLayer.id] = oLayer;
        
        if (oLayer.metadatacsw.search("http")>=0) {
            $.ajax({
                dataType: "xml",
                layer: oLayer.id,
                url:  _ajaxURL(oLayer.metadatacsw),
                success: function (result) {
                    var summary = '<p>'+ $(result).find("abstract").text()+ '</p>';
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
    }
		
     
     /**
     * Private Method: _initDataList
     *
     *Parameter 
     */

    var _initDataList = function () {
		var htmlListGroup = '';
        var reverse_themes = [];
        var crossorigin = '';
        $.each(_themes, function (id, theme) {  
            reverse_themes.push(theme);
        });
        
		$.each(reverse_themes.reverse(), function (id, theme) {            
			var htmlListLayers = ""
            var reverse_layers = [];
            var groups = []; 
            //GROUPS
            if (_themes[theme.id].groups) {
                $.each(_themes[theme.id].groups, function (id, group) {
                    var grp = {title: group.name, layers: [] };
                    $.each(group.layers, function (id, layer) {
                        grp.layers.push(new TPLLayercontrol(layer).html());
                    });
                    groups.push(grp);
                });
                htmlListGroup +=  new TPLLayergroupGroup(theme.name, groups, theme.id, theme.icon).html();
            //NO GROUPS
            } else {
                 $.each(_themes[theme.id].layers, function (id, layer) {
                    reverse_layers.push(layer);
                });
                $.each(reverse_layers.reverse(), function (id, layer) {                    
                    htmlListLayers += new TPLLayercontrol(layer).html();
                });
                htmlListGroup +=  new TPLLayergroup(theme.name, htmlListLayers, theme.id, theme.icon).html();
            }       
        });
        var panelMini = $(_options).find("themes").attr("mini");
        if (panelMini && (panelMini === 'true')) {
            mviewer.toggleMenu(false);
        }
        $("#menu").html(htmlListGroup);
        initMenu();
	};
    
    var _setLayerScaleStatus = function (layer, scale) {
        if (layer.scale) {            
            var legendUrl = _getlegendurl(layer);
            if (scale > layer.scale.min && scale <= layer.scale.max) {                    
                $('#legend-'+layer.id).attr("src",legendUrl);                
                $('#legend-'+layer.id).closest("li").removeClass("mv-invisible");
            } else {
                $('#legend-'+layer.id).attr("src","img/invisible.png");                
                $('#legend-'+layer.id).closest("li").addClass("mv-invisible");
            }
        }    
    };
    
    var _updateLayersScaleDependancy = function (scale) {
        $.each( _scaledDependantLayers, function (i, item) {
            _setLayerScaleStatus(item, scale);
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
        case "fake":
            var l = new ol.layer.Layer({});
            _backgroundLayers.push(l);
            l.set('name', params.attr("label"));
            l.set('blid', params.attr("id"));    
            break;
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
                        var getCapabilitiesResult = (new ol.format.WMTSCapabilities()).read(xml);
                        var WMTSOptions = ol.source.WMTS.optionsFromCapabilities( getCapabilitiesResult, { 
                            layer: params.attr("layers"), 
                            matrixSet: params.attr("matrixset"), 
                            format: params.attr('format'), 
                            style: params.attr("style")
                        });
                        WMTSOptions.attributions = [new ol.Attribution({html:params.attr("attribution")})];
                        l = new ol.layer.Tile({ source: new ol.source.WMTS(WMTSOptions) });
                        l.set('name', params.attr("label"));
                        l.set('blid', params.attr("id"));
                        _map.getLayers().insertAt(0,l);
                        _backgroundLayers.push(l);
                        if( params.attr("visible") == 'true' ) {
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

    var _showCheckedLayers = function () {
        var checkedLayers = $.map(_overLayers, function(layer, index) {
            if (layer.checked) {
                return layer;
            }
        }).reverse();
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
     * Parameter: layers (Array of strings)
     */

    var _overwiteThemeProperties = function (layers) {
        $.each(_themes, function (i, theme) {
            $.each(theme.layers, function (j, l) {
                if (layers.indexOf(l.name) != -1) {
                    l.checked = true;
                    l.visiblebydefault = true;
                    var li = $(".mv-nav-item[data-layerid='"+l.id+"']");
                    mviewer.toggleLayer(li);
                } else {
                    l.checked = false;
                    l.layer.setVisible(false);
                    l.visiblebydefault = false;
                }
            });
             $.each(theme.groups, function (g, group) {
                 $.each(group.layers, function (i, l) {
                    if (layers.indexOf(l.name) != -1) {
                        l.checked = true;
                        l.visiblebydefault = true;                        
                        var li = $(".mv-nav-item[data-layerid='"+l.id+"']");
                        mviewer.toggleLayer(li);
                    } else {
                        l.checked = false;
                        l.layer.setVisible(false);
                        l.visiblebydefault = false;
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
                oLayer.layerid = $(this).children('Name').text();
                oLayer.layername = oLayer.id;
                oLayer.name = $(this).children('Title').text();    
                oLayer.title = $(this).children('Title').text();
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
                //oLayer.ns = (oLayer.id.split(':').length > 0) ? oLayer.id.split(':')[0] : null; 
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
                l.set('mviewerid', oLayer.id);
                themeLayers[oLayer.id].layer = l;                            
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
                        o.features.push({layername:prop, properties:obj[prop]});                
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
                            o.features.push({layername:mslayer, properties:results[mslayer + '_layer'][mslayer + '_feature']});
                        } else {
                            for (var k=0; k<results[mslayer + '_layer'][mslayer + '_feature'].length ;k++) {
                                o.features.push({layername:mslayer, properties:results[mslayer + '_layer'][mslayer + '_feature'][k]});
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
        
        showFeature: function (featureid) {
            var feature = _sourceEls.getFeatureById(featureid).clone();            
            _sourceOverlay.clear();
            _sourceOverlay.addFeature(feature);           
        },

        /**
         * Public Method: setTool
         *
         */

        setTool: function (tool, origin) {
            if (($("#measurebtn").hasClass("active")) && (origin === 'measurebtn')) {              
                tool = 'info';
            }
            _deactivateTools();
            _clearTools();
            switch (tool) {
            case 'info':
                _getFeatureInfoControl(true);
                $("#infobtn").addClass("active");            
                break;
            case 'measureline':
                $("#drawtoolsoptions").show();
                _addMeasureInteraction('LineString');
                $('#measurelinebtn').addClass("active");
                $("#measurebtn").addClass("active");
                _modMeasureEnabled = true;
                break;           
            case 'measurearea':               
                 $("#drawtoolsoptions").show();
                 _addMeasureInteraction('Polygon');
                 $('#measureareabtn').addClass("active");
                 $("#measurebtn").addClass("active");
                  _modMeasureEnabled = true;
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
            if ($(_options).find("baselayers").attr("style") === 'default') {
                //get the next thumb
                var thumb = $(_options).find('baselayer[id="'+_backgroundLayers[nexid].get('blid')+'"]').attr("thumbgallery");
                var title = $(_options).find('baselayer[id="'+_backgroundLayers[nexid].get('blid')+'"]').attr("label");
                $("#backgroundlayersbtn").css("background-image", 'url("'+thumb+'")');
                $("#backgroundlayersbtn").attr("title", title);                
                $("#backgroundlayersbtn").tooltip('destroy').tooltip({
                    placement: 'left', 
                    trigger: 'hover',
                    html: true,
                    container: 'body',
                    template: '<div class="tooltip mv-tooltip" role="tooltip"><div class="mv-tooltip tooltip-arrow"></div><div class="mv-tooltip tooltip-inner"></div></div>'
                 });
            }
            $.each(_backgroundLayers, function (id, layer) {
                var opt = $(_options).find("baselayers").attr("style");
                var elem = (opt === "gallery") ? $('#' + layer.get('blid') + '_btn').closest('li') : $('#' + layer.get('blid') + '_btn');
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
            $("#backgroundlayerstoolbar-gallery .bglt-btn").toggleClass("mini");
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
                //_map.getLayers().forEach(function(layer,id) {console.log(layer.get('mviewerid'))});
            }
            _map.render();
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
                _testConfig(xml);
                _options = xml;                              
                //Application customization (logo, title, helpfile) /
                var applicationOverride = $(xml).find("application");
                if (applicationOverride.attr("title")) {
                    document.title = applicationOverride.attr("title");
                    $(".mv-title").text(applicationOverride.attr("title"));
                }
                if ((applicationOverride.attr("stats") === "true" ) && applicationOverride.attr("statsurl")) {
                    $.get(applicationOverride.attr("statsurl") +"?app=" + document.title); 
                }                 
                if (applicationOverride.attr("logo")) {
                    $(".mv-logo").attr("src", applicationOverride.attr("logo"));
                }
                if (applicationOverride.attr("exportpng") === "true" ) {
                    _crossorigin = "anonymous";
                    $("#exportpng").show();
                } else {
                     $("#exportpng").remove();
                }           
                if ((!applicationOverride.attr("measuretools")) || (applicationOverride.attr("measuretools")==="false")){
                    $(".mv-modetools").remove();               
                } else {
                    $("#measurebtn").show();
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
                
               
                var overlays = [];
               
                $("#popup-content").append('<div data-role="ui-content"><p>Cliquer sur la carte afin de procéder à l\'interrogation des données</p></div>');
               
               
                _marker = new ol.Overlay({ positioning: 'bottom-center', element: $("#els_marker"), stopEvent: false})
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
                _elasticSearchDocTypes = $(xml).find('elasticsearch').attr("doctypes");
                // common id between elasticsearch document types (_id)  and geoserver featureTypes
                _elasticSearchLinkid = $(xml).find('elasticsearch').attr("linkid") || "featureid";
                 if (!_olsCompletionUrl)  {
                    _searchparams.localities = false;
                 }                 
                 if ($(xml).find('searchparameters').attr("bbox") && $(xml).find('searchparameters').attr("localities") && $(xml).find('searchparameters').attr("features")) {
                    _searchparams.bbox = ($(xml).find('searchparameters').attr("bbox") === "true");
                    _searchparams.localities = ($(xml).find('searchparameters').attr("localities") === "true");
                    _searchparams.features = ($(xml).find('searchparameters').attr("features") === "true"); 
                    _searchparams.static = ($(xml).find('searchparameters').attr("static") === "true");  
                }
                if (_searchparams.localities===false && _searchparams.localities===false) {
                    $("#searchtool").remove();
                }
                if (_searchparams.bbox) {
                    $('#param_search_bbox span').removeClass('mv-unchecked').addClass('mv-checked');
                }
                if (_searchparams.localities) {
                    $('#param_search_localities span').removeClass('mv-unchecked').addClass('mv-checked');
                }
                if (_searchparams.features) {
                    $('#param_search_features span').removeClass('mv-unchecked').addClass('mv-checked');
                }                
                    
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
                                 _map.getView().fit(wmc.extent, _map.getSize(), {padding: [0, $("#sidebar-wrapper").width(), 0, 0]});
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
                    var doublons = {};
                    $(themes.get().reverse()).each(function () {                        
                        var themeid = $(this).attr("id");
                        _themes[themeid] = {};
                        _themes[themeid].id = themeid;  
                        _themes[themeid].icon = $(this).attr("icon");  
                        _themes[themeid].name = $(this).attr("name");
                        _themes[themeid].groups = false;
                        // test group
                        if ($(this).find("group").length) {                            
                            var groups = $(this).find("group");
                            _themes[themeid].groups = {};
                            groups.each(function () {
                                _themes[themeid].groups[$(this).attr("id")] = {name: $(this).attr("name"), layers: {}};
                            });
                            
                        }
                        _themes[themeid].layers = {};
                        var layersXml = $(this).find('layer');
                        $(layersXml.get().reverse()).each(function () {                            
                            layerRank+=1;
                            var layerId = $(this).attr("id");
                            var secureLayer = ($(this).attr("secure") == "true") ? true : false;
                            if (secureLayer) {
                                $.ajax({
                                    dataType: "xml",
                                    layer: layerId,
                                    url:  _ajaxURL($(this).attr("url")+ "?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0"),
                                    success: function (result) {
                                        //Find layer in capabilities
                                        var name = this.layer;
                                        var layer = $(result).find('Layer>Name').filter(function() {
                                            return $(this).text() == name;
                                        });
                                        if (layer.length === 0) {
                                            //remove this layer from map and panel
                                            _removeLayer(this.layer);
                                        }
                                    }
                                });
                            }
                            var mvid;
                            var oLayer = {};
                            var clean_ident = layerId.replace(':','__');
                            if (_overLayers[clean_ident] ) {
                                doublons[clean_ident] += 1;
                                mvid = clean_ident + "dbl"+doublons[clean_ident];                                                          
                            } else {
                                mvid = clean_ident;
                                doublons[clean_ident] = 0;
                            }
                            oLayer.id = mvid;
                            oLayer.layername = layerId;
                            oLayer.type = $(this).attr("type") || "wms";                            
                            oLayer.theme = themeid;
                            oLayer.rank = layerRank;
                            oLayer.name = $(this).attr("name");
                            oLayer.title = $(this).attr("name");
                            oLayer.layerid = mvid;
                            oLayer.infospanel = $(this).attr("infopanel") ||'right-panel';
                            oLayer.featurecount = $(this).attr("featurecount");
                            //styles
                            if ($(this).attr("style") && $(this).attr("style") != "") {
                                var styles = $(this).attr("style").split(",");
                                oLayer.style = styles[0];
                                if (styles.length > 1) {
                                    oLayer.styles = styles.toString();
                                }
                            } else {
                               oLayer.style="";     
                            }
                            if ($(this).attr("stylesalias") && $(this).attr("stylesalias") != "") {
                                oLayer.stylesalias = $(this).attr("stylesalias");
                            } else {
                                if (oLayer.styles) {
                                    oLayer.stylesalias = oLayer.styles;
                                }
                            }
                            oLayer.toplayer =  ($(this).attr("toplayer") == "true") ? true : false;
                            oLayer.draggable = true;
                            if (oLayer.toplayer) {
                                _topLayer = oLayer.id;
                                oLayer.draggable = false;
                            }                            
                            oLayer.sld = $(this).attr("sld") || null;
                            oLayer.filter = $(this).attr("filter");
                            oLayer.opacity = parseFloat($(this).attr("opacity") || "1");
                            oLayer.tooltip =  ($(this).attr("tooltip") == "true") ? true : false;
                            oLayer.tooltipenabled =  ($(this).attr("tooltipenabled") == "true") ? true : false;
                            oLayer.expanded =  ($(this).attr("expanded") == "true") ? true : false;
                            oLayer.timefilter =  ($(this).attr("timefilter") && $(this).attr("timefilter") == "true") ? true : false;
                            if (oLayer.timefilter && $(this).attr("timeinterval")) {
                                oLayer.timeinterval = $(this).attr("timeinterval") || "day";
                            }                            
                            oLayer.timecontrol = $(this).attr("timecontrol") || "calendar";
                            if ($(this).attr("timevalues") && $(this).attr("timevalues").search(",")) {
                                oLayer.timevalues = $(this).attr("timevalues").split(",");
                            }
                            oLayer.timemin = $(this).attr("timemin") || new Date().getFullYear() -5;
                            oLayer.timemax = $(this).attr("timemax") || new Date().getFullYear(); 
                            
                            oLayer.attributefilter =  ($(this).attr("attributefilter") && $(this).attr("attributefilter") == "true") ? true : false;
                            oLayer.attributefield = $(this).attr("attributefield");
                            oLayer.attributelabel = $(this).attr("attributelabel") || "Attributs";
                            if ($(this).attr("attributevalues") && $(this).attr("attributevalues").search(",")) {
                                oLayer.attributevalues = $(this).attr("attributevalues").split(",");
                            }
                            oLayer.attributestylesync =  ($(this).attr("attributestylesync") && $(this).attr("attributestylesync") == "true") ? true : false;
                            oLayer.attributefilterenabled =  ($(this).attr("attributefilterenabled") && $(this).attr("attributefilterenabled") == "true") ? true : false;
                            if (oLayer.attributestylesync && oLayer.attributefilterenabled && oLayer.attributevalues) {
                                oLayer.style = [oLayer.style.split('@')[0], '@', oLayer.attributevalues[0].sansAccent().toLowerCase()].join("");
                            }
                            oLayer.customcontrol = ($(this).attr("customcontrol") == "true") ? true : false;
                            oLayer.customcontrolpath = $(this).attr("customcontrolpath") || "customcontrols";
                            oLayer.attribution = $(this).attr("attribution");
                            oLayer.metadata = $(this).attr("metadata");
                            oLayer.metadatacsw = $(this).attr("metadata-csw");
                            if (oLayer.metadata) {
                                oLayer.summary = '<a href="'+oLayer.metadata+'" target="_blank">En savoir plus</a>';
                            }
                            oLayer.url = $(this).attr("url");
                            //Mustache template
                            if ($(this).find("template") && $(this).find("template").attr("url")) {
                                $.get($(this).find("template").attr("url"), function(template) {
                                    oLayer.template = template;
                                });
                            } else if ($(this).find("template") && $(this).find("template").text()) {
                                oLayer.template = $(this).find("template").text();
                            } else {
                                oLayer.template = false;
                            }
                            oLayer.queryable = ($(this).attr("queryable") == "true") ? true : false;
                            oLayer.searchable = ($(this).attr("searchable") == "true") ? true : false;
                            oLayer.searchid = ($(this).attr("searchid"))? $(this).attr("searchid") : _elasticSearchLinkid;
                            oLayer.infoformat = $(this).attr("infoformat");
                            oLayer.checked = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.visiblebydefault = ($(this).attr("visible") == "true") ? true : false;
                            oLayer.tiled = ($(this).attr("tiled") == "true") ? true : false;
                            //oLayer.ns = ($(this).attr("namespace")) ? $(this).attr("namespace") : null;
                            oLayer.legendurl=($(this).attr("legendurl"))? $(this).attr("legendurl") : _getlegendurl(oLayer);
                            if (oLayer.legendurl === "false") {oLayer.legendurl = "";}
                            oLayer.useproxy = ($(this).attr("useproxy") == "true") ? true : false;
                            if ($(this).attr("fields") && $(this).attr("aliases")) {
                                oLayer.fields = $(this).attr("fields").split(",");
                                oLayer.aliases = $(this).attr("aliases").split(",");
                            }
                            
                            if($(this).attr("iconsearch")){

                                oLayer.iconsearch=$(this).attr("iconsearch");
                            }
                            else {

                                oLayer.iconsearch="img/star.svg";
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
                                                        $('.mv-layer-details[data-layerid="'+this.layer+'"]').find('.mv-custom-controls').append(html);
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
                                    'LAYERS': $(this).attr("id"),
                                    'STYLES':(themeLayers[oLayer.id].style)? themeLayers[oLayer.id].style : '',
                                    'FORMAT': 'image/png',
                                    'TRANSPARENT': true                                      
                                };
                                var source;
                                if (oLayer.filter) {
                                    wms_params['CQL_FILTER'] = oLayer.filter;
                                }
                                if (oLayer.attributefilter && oLayer.attributefilterenabled && oLayer.attributevalues.length > 1) {
                                    wms_params['CQL_FILTER'] = oLayer.attributefield + "='" + oLayer.attributevalues[0] + "'";
                                }
                                if (oLayer.sld) {
                                    wms_params['SLD'] = oLayer.sld;
                                }
                                switch (oLayer.tiled) {
                                    case true:
                                        wms_params['TILED'] = true;
                                        source = new ol.source.TileWMS({
                                            url: $(this).attr("url"),
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
                                                url: $(this).attr("url"),
                                                crossOrigin: _crossorigin,                                                
                                                imageLoadFunction: function (imageTile, src) {
                                                    if (oLayer.useproxy) {
                                                        src = _proxy + encodeURIComponent(src);                                                    
                                                    }
                                                    imageTile.getImage().src = src;
                                                },                           
                                                params: wms_params
                                            });
                                        l = new ol.layer.Image({
                                            source:source
                                        });                                    
                                        break;                        
                                }
                                source.set('layerid', oLayer.layerid);
                                source.on('imageloadstart', function(event) {
                                    //console.log('imageloadstart event',event);                                    
                                    $("#loading-" + event.target.get('layerid')).show();
                                });

                                source.on('imageloadend', function(event) {
                                    //console.log('imageloadend event',event);
                                    $("#loading-" + event.target.get('layerid')).hide();
                                });

                                source.on('imageloaderror', function(event) {
                                    //console.log('imageloaderror event',event);
                                    $("#loading-" + event.target.get('layerid')).hide();
                                }); 
                                source.on('tileloadstart', function(event) {
                                    //console.log('imageloadstart event',event);                                    
                                    $("#loading-" + event.target.get('layerid')).show();
                                });

                                source.on('tileloadend', function(event) {
                                    //console.log('imageloadend event',event);
                                    $("#loading-" + event.target.get('layerid')).hide();
                                });

                                source.on('tileloaderror', function(event) {
                                    //console.log('imageloaderror event',event);
                                    $("#loading-" + event.target.get('layerid')).hide();
                                }); 
                                _processLayer(oLayer, l);
                            } //end wms
                            if (oLayer.type === 'geojson') {
                                l = new ol.layer.Vector({
                                        source: new ol.source.Vector({
                                          url: $(this).attr("url"),
                                          format: new ol.format.GeoJSON()
                                        })                                    
                                });
                                if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                                    l.setStyle(mviewer.featureStyles[oLayer.style]);
                                }
                                _vectorLayers.push(l);
                                _processLayer(oLayer, l);
                            }// end geojson
                            if (oLayer.type === 'kml') {
                                l = new ol.layer.Vector({
                                        source: new ol.source.Vector({
                                          url: $(this).attr("url"),
                                          format: new ol.format.KML()
                                        })                                    
                                });                                     
                                _vectorLayers.push(l);
                                _processLayer(oLayer, l);
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
                                                _vectorLayers.push(l);
                                                _processLayer(oLayer, l);
                                            }
                                            if (mviewer.customLayers[oLayer.id].handle) {                                                
                                            }
                                            _showCheckedLayers();
                                      },
                                      error: function (request, textStatus, error) {
                                            console.log( "error custom Layer : " + error );
                                      }
                                });
                            }
                            if ($(this).parent().is("group")) {
                                _themes[themeid].groups[$(this).parent().attr("id")].layers[oLayer.id] = oLayer;
                            } else {
                                _themes[themeid].layers[oLayer.id] = oLayer;
                            }
                        }); //fin each	layer					
                    }); // fin each theme
                } // fin de else

                _initDataList();
                _initTools();
                _initSearch();                
                _initPanelsPopup();
                _initVectorOverlay();
                
                //PERMALINK                
                if (config.lb && $.grep(_backgroundLayers, function (n) {
                    return n.get('blid') === config.lb;
                })[0]) {

                    this.setBaseLayer(config.lb);
                } else {
                    this.setBaseLayer($(xml).find('baselayers').find('[visible="true"]').attr("id"));
                }
				
                if (config.l) {
                    _setVisibleOverLayers(config.l);
                } else {
                    if (!config.wmc) {
                        _showCheckedLayers();
                    }
                }      
               
                //Activate GetFeatureInfo mode
                _getFeatureInfoControl(true);
                $("#infobtn").addClass('ui-btn-active'); 
                
                //Export PNG
                if (applicationOverride.attr("exportpng") && document.getElementById('exportpng')) {                   
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
                
                $("#layers-container-box, #sidebar-wrapper, #bottom-panel, #right-panel").on('mouseover', function() {
                    if (_featureTooltip) {
                        $('#feature-info').tooltip('hide');
                    }
                });
                
                return _map;
            
        },

        /**
         * Public Method: getOlsCompletionUrl
         *
         */

        getOlsCompletionUrl: function () {
            return _olsCompletionUrl;
        },
        
        customLayers: {},
        
        customControls: {},
        
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
            $("#imagepopup").modal('show');
        },       

        /**
         * Public Method: zoomToLocation
         *
         */

        zoomToLocation: function (x, y, zoom, lib) {                
            var ptResult = ol.proj.transform([x, y], 'EPSG:4326', _projection.getCode());           
            _map.getView().setCenter(ptResult);
            _map.getView().setZoom(zoom);
            $("#searchresults").html("");            
            $("#searchfield").val("");
            $(".mv-searchtool-delete").removeClass("active");

        },
        
        /**
         * Public Method: zoomToLocation
         *
         */

        zoomToFeature: function (featureid) {            
            var feature = _sourceEls.getFeatureById(featureid).clone();
            _sourceEls.clear();
            _sourceOverlay.clear();
            _sourceOverlay.addFeature(feature);
            var boundingExtent = feature.getGeometry().getExtent();   
            var duration = 2000;
            var start = +new Date();
            var pan = ol.animation.pan({
                duration: duration,
                source: /** @type {ol.Coordinate} */ (_map.getView().getCenter()),
                start: start
            });           
            var zoom = ol.animation.zoom({
              resolution: _map.getView().getResolution(),
              duration: duration,
            });
            _map.beforeRender(pan, zoom);                
            _map.getView().fit(boundingExtent, _map.getSize(), {padding: [0, $("#sidebar-wrapper").width(), 0, 0]});
            
            
            function clear() {
                _sourceOverlay.clear();
            }
            setTimeout(clear, duration*2);    
            $("#searchresults").html("");            
            $("#searchfield").val("");
            $(".mv-searchtool-delete").removeClass("active");

        },
        
          /**
         * Public Method: queryLayer
         *
         */

        queryLayer: function (x, y, proj, layer, featureid) {
            (x,y,16);     
            var pt = ol.proj.transform([x, y], proj, _projection.getCode());
            var p = _map.getPixelFromCoordinate(pt);
            $('#loading-indicator').show();
            _queryMap({coordinate:[pt[0],pt[1]]},{type: 'feature', layer: layer, featureid:featureid});
            $("#searchresults").html("");            
            $("#searchfield").val("");
            $(".mv-searchtool-delete").removeClass("active");
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
         * Public Method: hideLocation
         *
         */

        hideLocation: function ( ) {
            $("#els_marker").hide();
        },
       
        /**
         * Public Method: lonlat2osmtile
         * from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
         *
         */
        //Not used but great
        lonlat2osmtile: function (lon, lat, zoom) {            
            var x = Math.floor((lon+180)/360*Math.pow(2,zoom));
            var y = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
            var osmtile = 'http://tile.openstreetmap.org/' +zoom+'/'+x + '/'+y+'.png';
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
        }, // fin function tools toolbar
        
        addLayer: function (layer) {            
            var item = new TPLLayercontrol2(layer).html();
            if (_topLayer && $("#layers-container .toplayer").length > 0) {
                $("#layers-container .toplayer").after(item);
            } else {
                $("#layers-container").prepend(item);
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
                                        wms_timefilter = [parseInt(ticks_labels[data.value.newValue[0]]), parseInt(ticks_labels[data.value.newValue[1]])].join("/");
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
                        $("#"+layer.layerid+"-layer-timefilter").closest(".form-group").find(".slider-tick-label").addClass("mv-time-vertical");
                    }
                    
                    if (layer.timecontrol === 'slider') {                         
                          //Activate the time player                          
                          $('.mv-time-player[data-layerid="'+layer.layerid+'"]').click(function(e){
                                var ctrl = e.currentTarget;
                                $(ctrl).toggleClass("active");
                                if ($(ctrl).hasClass("active")) {
                                    mviewer.playLayerTime($(ctrl).attr("data-layerid"), ctrl);
                                }
                           });
                    
                        
                    // slider-range   
                    } else if (layer.timecontrol === 'slider-range'){                          
                          $("#"+layer.layerid+"-layer-timefilter").closest(".form-group").removeClass("form-group-timer").addClass("form-group-timer-range");
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
                    layerName: $(item).attr("data-layerid"),
                    layerRef: $($("#layers-container").find("li")[1]).attr("data-layerid"),
                    action: "up"};
                    
                mviewer.orderLayer(actionMove);
                console.log(_topLayer);
             }
             var oLayer = _overLayers[layer.layerid];
             oLayer.layer.setVisible(true);             
             //Only for second and more loads
             if (oLayer.attributefilter && oLayer.layer.getSource().getParams()['CQL_FILTER']) { 
                var activeFilter = oLayer.layer.getSource().getParams()['CQL_FILTER'];
                var activeAttributeValue = activeFilter.split('=')[1].replace(/\'/g, "");
                $("#"+layer.layerid+"-attributes-selector option[value='"+activeAttributeValue+"']").prop("selected", true);
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-attribute span').text(activeAttributeValue);  
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
                    var selectedStyle = $("#"+layer.layerid+"-styles-selector option[value*='"+activeStyle.split('@')[0]+"']").prop("selected", true); 
                }                
                $('.mv-layer-details[data-layerid="'+layer.layerid+'"] .layerdisplay-subtitle .selected-sld span').text(selectCtrl.options[selectCtrl.selectedIndex].label);
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
                this.toggleTooltip($('.layer-tooltip[data-layerid="'+layer.layerid+'"]')[0]);
             }
             if (layer.expanded) {
                this.toggleLayerOptions($('.mv-layer-details[data-layerid="'+layer.layerid+'"]')[0]);
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
        toggleTooltip: function (el) {
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
            if ($(el).find("span").hasClass("glyphicon glyphicon-plus")) {
                $(el).find("span").removeClass("glyphicon glyphicon-plus").addClass("glyphicon glyphicon-minus");
            } else {
                $(el).find("span").removeClass("glyphicon glyphicon-minus").addClass("glyphicon glyphicon-plus");
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
                    attributeValue = _source.getParams().CQL_FILTER.split('=')[1].replace(/\'/g, "");
                }
                if ( attributeValue != 'all' ) {                     
                    style = [styleBase, '@', attributeValue.toLowerCase().sansAccent()].join("");
                }
            }
            _source.getParams()['STYLES'] = style;
            _layerDefinition.style = style;            
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
        
         setLayerAttribute: function (layerid, attributeValue, selectCtrl) {            
            var _layerDefinition = _overLayers[layerid];
            var _source = _layerDefinition.layer.getSource();
            if ( attributeValue === 'all' ) {
                delete _source.getParams()['CQL_FILTER'];
            } else {
                _source.getParams()['CQL_FILTER'] = _layerDefinition.attributefield + "='" + attributeValue.replace("'","''") + "'";  
            }
            if (_layerDefinition.attributestylesync) {
                //need update legend ad style applied to the layer
                var currentStyle =  _layerDefinition.style;
                var newStyle;
                //Respect this convention in sld naming : stylename@attribute eg style1@departement plus no accent no Capitale.
                if (attributeValue != 'all') { 
                    newStyle = [currentStyle.split("@")[0], "@", attributeValue.sansAccent().toLowerCase()].join("");
                } else {
                    newStyle = currentStyle.split("@")[0];
                }
                _source.getParams()['STYLES'] = newStyle;
                _layerDefinition.style = newStyle;
                 var legendUrl = _getlegendurl(_layerDefinition);
                $("#legend-" + layerid).fadeOut( "slow", function() {
                    // Animation complete
                    $("#legend-" + layerid).attr("src", legendUrl).fadeIn();
                });
                $('.mv-nav-item[data-layerid="'+layerid+'"]').attr("data-legendurl",legendUrl).data("legendurl",legendUrl);
            }
            _source.changed();
            $('.mv-layer-details[data-layerid="'+layerid+'"] .layerdisplay-subtitle .selected-attribute span').text(selectCtrl.options[selectCtrl.selectedIndex].label);            
        },
        
        setLayerTime: function (layerid, filter_time) {
            var _layerDefinition = _overLayers[layerid];
            var _source = _layerDefinition.layer.getSource();
            _source.getParams()['TIME'] = filter_time;
            $(".mv-time-player-selection[data-layerid='"+layerid+"']").text('Patientez...');
            var key = _source.on('imageloadend', function() { 
                _source.unByKey(key);
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
            var i, ii
             for (i = 0, ii = _backgroundLayers.length; i < ii; ++i) {
                _backgroundLayers[i].set('visible', (i == nexid));
            }
            nexid=(nexid+1)%_backgroundLayers.length;
            //get the next thumb
            var thumb = $(_options).find('baselayer[id="'+_backgroundLayers[nexid].get('blid')+'"]').attr("thumbgallery");
            var title = $(_options).find('baselayer[id="'+_backgroundLayers[nexid].get('blid')+'"]').attr("label");
            $("#backgroundlayersbtn").css("background-image", 'url("'+thumb+'")');
            $("#backgroundlayersbtn").attr("data-original-title", title);
            $("#backgroundlayersbtn").tooltip('hide').tooltip({
                placement: 'top', 
                trigger: 'hover',
                html: true,
                container: 'body',
                template: '<div class="tooltip mv-tooltip" role="tooltip"><div class="mv-tooltip tooltip-arrow"></div><div class="mv-tooltip tooltip-inner"></div></div>'
             });
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
                    /*var _next_info = info.next();                     
                    _next_tab.addClass("active");
                    _next_info.addClass("active"); 
                    _next_tab.find("a").click();*/
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
        }
    }; // fin return		

})();
