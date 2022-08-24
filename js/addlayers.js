var capabilitiesParser = (function () {

    /**
     * public Method: _parseCSW. Used to parse response of a GetRecords
     */ 
   var _parseCSW =  function(data, url) {
    data = data.replace(/csw:/g, '');
    const doc = new DOMParser().parseFromString(data, 'text/xml');
   
    capabilitiesFromXML = _xmlToJson(doc);
    console.log(capabilitiesFromXML.GetRecordsResponse.SearchResults.Record);
    
    let nbTotalResults = Number(capabilitiesFromXML.GetRecordsResponse.SearchResults["@attributes"].numberOfRecordsMatched);
    let nextRecord = Number(capabilitiesFromXML.GetRecordsResponse.SearchResults["@attributes"].nextRecord);

    const layers = capabilitiesFromXML.GetRecordsResponse.SearchResults.Record.map(x=>{
      
      console.log(x)
      if( !Array.isArray(x["dc:URI"])){
        x["dc:URI"]=[x["dc:URI"]];
      }
      let retour = {
        Name:x["dc:URI"].find(x=>x["@attributes"] && x["@attributes"].protocol.indexOf("OGC:WMS")>=0)["@attributes"].name,
        Url:x["dc:URI"].find(x=>x["@attributes"] && x["@attributes"].protocol.indexOf("OGC:WMS")>=0)["#text"],
        Title:x["dc:title"]["#text"],
        Abstract:x["dc:description"]["#text"]
      };
      console.log(retour.Name)
      
      let thumbnail = x["dc:URI"].find(x=>x["@attributes"] 
        && x["@attributes"].name 
        && x["@attributes"].name.indexOf("thumbnail")>=0);
      if(thumbnail){
        retour.Thumbnail = thumbnail["#text"];
      }
      return retour;
      }

      
    );

    return {nbTotalResults,nextRecord,layers}
  }

    /**
     * public Method: _parse. Used to parse response of a Capabilities
     */
    var _parse = function(data, url) {
        data = data.replace(/https:\/\/www.opengis/g, 'http://www.opengis');
        data = data.replace(/https:\/\/www.w3/g, 'http://www.w3');
        let capabilities;
        let capabilitiesFromXML;
        const doc = new DOMParser().parseFromString(data, 'text/xml');
        console.log(doc)
        capabilitiesFromXML = _xmlToJson(doc);
        if (data.indexOf('OGC WMTS') > 0) {
          capabilities = new ol.format.WMTSCapabilities().read(data);
          capabilities.type = 'WMTS';
          capabilities.layers = capabilities.Contents.Layer;
        } else {
          capabilities = new ol.format.WMSCapabilities().read(data);
          capabilities.type = 'WMS';
          _addWmsInfosLayer(capabilities, capabilitiesFromXML, data);
        }
        
        return capabilities;
      }
  
      /**
       * private Method: _addWmsInfosLayer. Post process Capabilities to adapt all response types
       */
      var _addWmsInfosLayer = function(capa, xmlCapabilities, rawData) {
        console.log(xmlCapabilities);
        if (capa.Capability.Layer.Layer) {
          capa.layers = capa.Capability.Layer.Layer;
        } else {
          capa.layers = [];
        }
        const isWMS111 = xmlCapabilities.WMT_MS_Capabilities && capa.version == '1.1.1';
        const isMapServer = rawData.indexOf('MapServer version') > 0;
    
        // add workspace prefix to layer name if not present
        // si le layerName n'a pas de préfix mais que son style à un prefix, on le récupère
        // Ceci arrive quand on interoge le capabilities a partir du workspace et pas du service wms racine
        // par ex: geoserver/rte/wms?request=GetCapabilities
        capa.layers.forEach((element) => {
          element.status = '';
    
          // ce hack pour récupérer le nom du workspace a partir du style ne fonctionne pas avec mapserver
          if (!isMapServer && element.Style
            && element.Style.length > 0
            && element.Name.indexOf(':') < 0
            && element.Style[0].Name.indexOf(':') > 0) {
            element.Name = `${element.Style[0].Name.split(':')[0]}:${element.Name}`;
          }
        });
        if (isWMS111) {
          const layers = xmlCapabilities.WMT_MS_Capabilities[1].Capability.Layer.Layer;
          capa.layers.forEach((element, index) => {
            if (element.EX_GeographicBoundingBox == undefined) {
              const coords = layers[index].LatLonBoundingBox['@attributes'];
    
              element.EX_GeographicBoundingBox = [Number(coords.minx), Number(coords.miny), Number(coords.maxx), Number(coords.maxy)];
            }
          });
        }
      }
      /**
       * private Method: _xmlToJson. Transform XML doc to JSON
       */
      var _xmlToJson = function(xml) {
        let obj = {};
    
        if (xml.nodeType == 1) { // element
          if (xml.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let j = 0; j < xml.attributes.length; j += 1) {
              const attribute = xml.attributes.item(j);
              obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType == 3) { // text
          obj = xml.nodeValue;
        }
    
        if (xml.hasChildNodes()) {
          for (let i = 0; i < xml.childNodes.length; i += 1) {
            const item = xml.childNodes.item(i);
            const { nodeName } = item;
            if (typeof (obj[nodeName]) == 'undefined') {
              obj[nodeName] = _xmlToJson(item);
            } else {
              if (typeof (obj[nodeName].push) == 'undefined') {
                const old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(_xmlToJson(item));
            }
          }
        }
        return obj;
      }

    return {
        parse: _parse,
        parseCSW: _parseCSW,
        
    };

})();

var addlayers = (function () {

    /**
     * Property: _map
     *  @type {ol.Map}
     */

    var _map;

    /**
     * addlayers tool enabled.
     * @type {boolean}
     */

    var _addlayersEnabled = false;

    var _url = undefined;

    var _urlCsw = undefined; 

    var _selectedServer = null;

    var  _loading = false;

    var _currentUrl = undefined;

    var _loaded = false;

    var _pagingInfos = {pageSize:100,
      currentPage:0,
      nbPages:1,
      };
    /**
     * Public Method: _init exported as init
     * @param {ol.Map}
     */

    var _init = function () {
        if(!_loaded){
            _map = mviewer.getMap();

            //Add html elements to the DOM
            
            var button = `<li class="half" id="addLayerMenuBtn">
              <a href="#" onclick="mviewer.tools.addlayers.toggle();"><span class="fa-stack fa-lg pull-left col-sm-3">
                <i class="fas fa-plus fa-solid "></i></span>Ajouter des données
                </a></li>`

            /*var button = [
                '<button class="mv-modetools btn btn-default btn-raised" href="#"',
                    ' onclick="mviewer.tools.addlayers.toggle();" id="addLayerbtn" title="Ajouter des données" i18n="measure.button.main"',
                    ' tabindex="108" accesskey="8">',
                            '<span class="glyphicon glyphicon-plus" aria-hidden="true">Ajouter des données</span>',
                    '</button>'].join("");*/
    
            $("#menu").append('<hr>').append(button);

            $("#addLayerpanel").on('hidden.bs.modal', function (e) {
              _addlayersEnabled = false;
            })
        }
        _loaded = true;

        
    }

    /**
     * _toggle. used to enable/disable this tool
     * public version of this method is toggle
     */

    var _toggle = function () {
        _addlayersEnabled=!_addlayersEnabled;
        if (_addlayersEnabled) {
            $("#addLayerpanel").modal('show');
        } 
    };

    /**
     * public Method: _connect. Used to connect to the OGC server selected, 
     * list and display all layers
     */
    var _connect = function () {
        
        _url = $("#addLayers_service_url").val();
        _connectServer();
        // alert('connect'+$("#addLayers_service_url").val())
    }

    var _error = function (textContent) {
        console.log('error')
        $("#addlayers_results").empty();
        _message(textContent, "alert-danger",$("#addlayers_results"));
    }
    
    /**
     * _message Show message method.
     * @param {String} msg
     */
    var _message = function (msg, cls,parentDiv) {
      var item = $(['<div class="alert '+cls+' alert-dismissible" role="alert">',
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
          '<span aria-hidden="true">&times;</span></button>',
          mviewer.tr(msg),
          '</div>'].join (""));
          parentDiv.append(item);
    };
    /**
     * private Method: _ajaxPromise. Used to get a Promise from an ajax call
     */
    var _ajaxPromise = function(options) {
        return new Promise(function (resolve, reject) {
          $.ajax(options).done(resolve).fail(reject);
        });
      }

    /**
     * private Method: _showLayerList. Used to render HTML from a layerList
     */
    var _showLayerList = function(layerList,parentDiv){
        parentDiv.empty();
        $.each(layerList, function (id, layer) {
            console.log(layer);
            let btn = $('<button class="vcenter">Ajouter</button>');
            let childContainerRow = $(`<div class="row"></div>`);
            let childContainerCol = $(`<div class="col-md-10 col-md-offset-1">  
                                    </div>`);
            childContainerRow.append(childContainerCol);
            btn.click(function(){
                _addLayer(layer);
              }); 
            let rowClass=layer.Layer && layer.Layer.length>0 ? "":"layer-result-row";
            const layerContentRow = $(`<div class="row pl-1 ${rowClass}"></div>`);
            let layerContent = $(`<div class="col-md-8"> </div>`);
            const btnContent = $(`<div class="col-md-1"> </div>`);
            
            let title = $(`<span class="layer-result" title="${layer.Title}">${layer.Title}</span>`);   
            if(layer.Abstract == undefined)
            {
              layer.Abstract = "";
            }
            if(layer.Layer && layer.Layer.length>0){
              layerContent = $(`<div class="col-md-11"> </div>`);
              title = $(`<span class="layer-result layerGroup" title="${layer.Title}">${layer.Title}</span>`);
              layerContentRow.append(layerContent);
              layerContent.append(title);
              layerContent.append(childContainerRow);
              _showLayerList(layer.Layer,childContainerCol);
            }else{
              layerContentRow.append(btnContent);
              layerContentRow.append(layerContent);
              layerContent.append(title);
              layerContent.append(`<br/><span class="layer-result-descr" title="${layer.Abstract}">${layer.Abstract}</span>`);
              if(layer.Thumbnail){
                layerContentRow.append($(`<div class="col-md-3"><img class="thumb_csw" width="200" src="${layer.Thumbnail}" title="${layer.Title}"/></div>`))
              }
              else{
                layerContentRow.append($(`<div class="col-md-3"></div>`));
              }
             
              btnContent.append(btn);
              
            }
            parentDiv.append(layerContentRow)
        });    
    }

    /**
     * public Method: _addLayer. Used to add layer to the map when user click on the button
     */
    var _addLayer = function(layer){
        console.log(layer);
        let wmsUrl = _url
        if(layer.Url){
          wmsUrl = layer.Url;
        }
        var clean_ident = layer.Name.replace(/:|,| |\./g,'');
        var oLayer = {
            type:'wms',
            layername:layer.Name,
            name:layer.Title,
            title:layer.Title,
            tiled:true,
            showintoc:true,
            queryable:true,
            dynamiclegend:true,
            // infoformat:'application/json',
            infoformat:'application/vnd.ogc.gml',
            draggable:true,
            checked:true,
            opacity:1,
            infospanel:'right-panel',
            id:clean_ident,
            layerid:clean_ident,
            url:wmsUrl
        };
        if(layer.Style){
          oLayer.style=layer.Style[0].Name;
          oLayer.stylesalias= layer.Style[0].Title;
        }
        oLayer.legendurl=mviewer.getLegendUrl(oLayer);
        configuration.processWmsLayer(oLayer,{},[]);
        let theme = configuration.getThemes()['mesdonnees'];
        if(theme==undefined){
            theme = {
                groups:false,
                icon:'fas fa-graduation-cap',
                id:'mesdonnees',
                layers:{},
                name:'Mes données'
            };
            configuration.getThemes()['mesdonnees']= theme;
        }
        theme.layers[oLayer.id] = oLayer;
        //mviewer.initDataList();
        //mviewer.showCheckedLayers();
        mviewer.addLayer(oLayer);
        info.addQueryableLayer(oLayer);
        //mviewer.showLayersByAttrOrder(mviewer.getLayersAttribute('rank'));
        //mviewer.orderLayerByIndex();
        
    }

    /**
     * private Method: _getCapabilities. Used to retrieve a layer list 
     * by querying an OGC getCapabilities Service
     */
    var _getCapabilities = function (url) {
        console.log('getCapabilities');
        const self = this;
        const headers = {};
        _loading = true;
        _currentUrl = url;
        _ajaxPromise({
            url: url,
            type: 'get',
            dataType: 'text',
          }).then(
            function onSuccess(data) {
                const capabilities = capabilitiesParser.parse(data,url);
                console.log(capabilities);
                _resultList = capabilities;
                if (_resultList !== null) {
                    _layerList = _resultList.layers;
                    _showLayerList(_layerList,$("#addlayers_results"));
                }
                _loading = false;
            },
            function onError(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                var message = "Problème réseau pour intérroger "+url+"<br>";
                if(jqXHR.responseText){
                  message += jqXHR.responseText;
                }
                _error(message);
                _loading = false;
            }
          ).catch(function errorHandler(error) {
            console.log(error)
            var message = "Problème réseau pour intérroger "+url+"<br>";
            _error(message);
            _loading = false;
          });

    }

    var _connectCsw  = function (){
      _urlCsw = $("#addLayers_service_url_csw").val();
      let filterCsw = $("#addLayers_service_filter_csw").val();
      let filterTxt = `(protocol='OGC:WMS-1.1.1-http-get-map' OR protocol='OGC:WMS')`;
      if(filterCsw.length>0){
        filterTxt += `AND title Like '%${filterCsw}%'`
      }
      $("#addlayers_results").empty();
      let startPos = _pagingInfos.currentPage*_pagingInfos.pageSize+1;
      var params = `?request=GetRecords&service=CSW&version=2.0.2&typeNames=csw:Record&resultType=results&maxRecords=${_pagingInfos.pageSize}&startPosition=${startPos}&ELEMENTSETNAME=full`;
      /*var filter = encodeURIComponent(`<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:gml="http://www.opengis.net/gml">
        <ogc:PropertyIsLike escapeChar="" singleChar="_" wildCard="%">
        <ogc:PropertyName>Title</ogc:PropertyName>
        <ogc:Literal>%risques%</ogc:Literal>
        </ogc:PropertyIsLike>
        </ogc:Filter>`);
      var url = _urlCsw + params+"&constraintLanguage=FILTER&CONSTRAINT_LANGUAGE_VERSION=1.1.0&CONSTRAINT="+filter;*/
      var filter = encodeURIComponent(filterTxt);
      var url = _urlCsw + params+"&constraintLanguage=CQL_TEXT&CONSTRAINT_LANGUAGE_VERSION=1.1.0&CONSTRAINT="+filter;
      _ajaxPromise({
        url: url,
        type: 'get',
        dataType: 'text',
      }).then(
        function onSuccess(data) {
          console.log(data);
          if(data.indexOf('ExceptionReport')>0){
            var message = "Problème réseau pour intérroger "+url+"<br>";
            message += data;
            
            _error(message);
            return;
          }
          const capabilities = capabilitiesParser.parseCSW(data,url);
          console.log(capabilities);
          _resultList = capabilities;
          if (_resultList !== null) {
            _layerList = _resultList.layers;
            _pagingInfos.nbPages = Math.ceil(_resultList.nbTotalResults / _pagingInfos.pageSize);
            _showLayerList(_layerList,$("#addlayers_results"));
            _addPager();
          }
          _loading = false;
        },
        function onError(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            var message = "Problème réseau pour intérroger "+url+"<br>";
            if(jqXHR.responseText){
              message += jqXHR.responseText;
            }
            _error(message);
            _loading = false;
        }
      ).catch(function errorHandler(error) {
        console.log(error)
        var message = "Problème réseau pour intérroger "+url+"<br>";
        _error(message);
        _loading = false;
      });
    }
    var _previousPage = function(){
      _pagingInfos.currentPage -= 1;
      _connectCsw();
    }
    var _nextPage = function(){
      _pagingInfos.currentPage += 1;
      _connectCsw();
    }
    
    var _addPager = function(){
      $("#addlayers_results_pager").empty();
      const previousDisabled = _pagingInfos.currentPage == 0 ? "disabled":"";
      const nextDisabled = _pagingInfos.currentPage == _pagingInfos.nbPages-1 ? "disabled":"";
      var pager = `<nav aria-label="...">
                    <ul class="pagination">
                      <li class="page-item ${previousDisabled}">
                        <a class="page-link" href="#" tabindex="-1" onclick="mviewer.tools.addlayers.previousPage();">Précédent</a>
                      </li>
                      <li class="page-item ${nextDisabled}">
                        <a class="page-link" href="#" onclick="mviewer.tools.addlayers.nextPage();">Suivant</a>
                      </li>
                    </ul>
                  </nav>`;
      $("#addlayers_results_pager").append(pager)
    }
    /**
     * private Method: _connectServer. Used to get url and check and 
     * process it before calling getCapabilities
     */
    var _connectServer = function (){
        console.log('connect', _url);
        let capabilitiesUrl = _url.trim();
        if (capabilitiesUrl.length === 0 && _selectedServer !== null) {
          capabilitiesUrl = _selectedServer.url;
        }
        if (capabilitiesUrl.length === 0) {
          _error('Veuillez renseigner une url ou choisir un serveur dans la liste');
        } else {
          const searchMask = 'getCapabilities';
          const regEx = new RegExp(searchMask, 'ig');
          if (!regEx.test(capabilitiesUrl)) {
            if (capabilitiesUrl.indexOf('?') > 0) {
              capabilitiesUrl = `${capabilitiesUrl}&request=getCapabilities`;
            } else {
              capabilitiesUrl = `${capabilitiesUrl}?request=getCapabilities`;
            }
          }
          const serviceSearchMask = 'service=';
          const serviceRegEx = new RegExp(serviceSearchMask, 'ig');
          if (!serviceRegEx.test(capabilitiesUrl)) {
            capabilitiesUrl = `${capabilitiesUrl}&service=wms`;
          }
          _getCapabilities(capabilitiesUrl);
        }
      }

    return {
        init: _init,
        previousPage: _previousPage,
        nextPage: _nextPage,
        toggle: _toggle,
        connect: _connect,
        connectCsw: _connectCsw,
        addLayer: _addLayer
    };

})();