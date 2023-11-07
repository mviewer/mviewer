var print = (function () {      
    /**
     * Public Method: _initTool exported as init     *
     */ 
    var _initTool = function () {      
        //Add button to toolstoolbar
        var button = `
        <button id="printBtn" class="btn btn-default btn-raised"
          onclick="$('#printModal').modal('show');"  title="Imprimer la carte" i18n=""
          tabindex="116" accesskey="f">
          <span class="glyphicon glyphicon-print" aria-hidden="true">
          </span>
        </button>`;
        $("#toolstoolbar").append(button); 
    }; 

    /* Creation de la carte */
    var _initMap = function () {
      var mapHtml = `
      <div id="mapBlock">
        <div id="mapPrint" class="map" style="width: 100%;height: 100%;"></div>
        <div id="scaleline-mapPrint" class="scaleline-external"></div> 
        <div id="northArrow-mapPrint"><img src="demo/addons/print/img/NorthArrow.png" alt="North arrow"/></div>     
      </div>`;
      $("#containMap").append(mapHtml);
      /* Get view for map */
      var view = mviewer.getMap().getView();     
      /* Initialisation de la carte */
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      var map = new ol.Map({
        layers: [layer],
        controls: ol.control.defaults.defaults({
          zoom: false,
          attribution: false,
          rotate: false
        }),
        target: 'mapPrint',
        view: view        
      });
      // Create the scalelines within the two div elements    
      var scaleLineMetric = new ol.control.ScaleLine({
        units: ['metric'],
        target: document.getElementById("scaleline-mapPrint")
      });
      map.addControl(scaleLineMetric);

      /* Get active basemap */
      var b = mviewer.getActiveBaseLayer();
      var i = mviewer.getMap().getLayers().getArray();
      i.forEach((function(layer) {
        // Filter only the visible basemap
        if(layer.get('blid') === b) {
          map.addLayer(layer);
        }
      }))
      /* Add layers */
      var arr = Object.keys(mviewer.getLayers());
      arr.forEach((l) => {  
        var layer = mviewer.getLayer(l).layer;
        map.addLayer(layer)
      })
    };

    /* Ouverture du plugin et initialisation du gabarit */
    $(window).on('shown.bs.modal', function() { 
      $( "#mapBlock" ).remove();
      $('#printModal').modal('show');      
      _initMap();   
    });
    
    /* Impression du gabarit */
    var _templatePrint = function () {
      console.log(window.devicePixelRatio)
      $('#printModal').modal('hide');
      var element = document.getElementById('myLandscapeA4');      
      element.classList.add('print');
      document.getElementById("mapPrint").style.width = "100%";
      html2pdf(element, {
          filename: 'mviewerMap.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: {scale: 3},
          jsPDF: { unit: 'mm', format: 'A4', orientation: 'landscape'}
      }).then(function(){
        element.classList.remove('print');
      });
    };   
  
    return {
      init: _initTool,
      initMap:_initMap,
      templatePrint: _templatePrint
    };
  })();
  
  new CustomComponent("print", print.init);
  