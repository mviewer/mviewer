const isochroneAddon = (function () {
  var _draw;
  var _xy;
  var btn_depart;
  var btn_calcul;
  var btn_reset;
  var btn_moyen_deplacement_voiture;
  var btn_moyen_deplacement_pieton;
  var _layer;

  /**
   *toggles display of form
   * @param  {event} e
   */

  var _toggleForm = function (e) {
    var _form = document.getElementById("custom-popin");
    if (_form.style.display === "none") {
      _form.style.display = "block";
    } else {
      _form.style.display = "none";
      _xy = null;
      mviewer.hideLocation();
      _layer.getSource().clear();
      $("#temps :input").val("");
      $("#distance :input").val("");
      $("#color :input").val("#2e5367");
    }
  };

  /**
   *gets start point on click of button and click on map
   */

  var getXY = function () {
    info.disable();
    _draw = new ol.interaction.Draw({
      type: "Point",
    });
    _draw.on("drawend", function (event) {
      _xy = ol.proj.transform(
        event.feature.getGeometry().getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      );
      mviewer.getMap().removeInteraction(_draw);
      mviewer.showLocation("EPSG:4326", _xy[0], _xy[1]);
      info.enable();
    });
    mviewer.getMap().addInteraction(_draw);
  };

  /**
   *switch between transport mode adds/removes selected class
   * @param  {event} e
   */

  var switchModeDeplacement = function (e) {
    let element = e.currentTarget;
    $(".selected.isochrone-mode").removeClass("selected");
    $(element).addClass("selected");
  };

  /**
   *switch between time and distance, display respective form and clears the form not displayed, adds/removes selected class
   * @param  {event} f
   */

  var switchModeParametre = function (f) {
    let element = f.currentTarget;
    $(".selected.parametre").removeClass("selected");
    $(element).addClass("selected");
    var parametreData = element.dataset.parametre;
    if (parametreData === "temps") {
      document.getElementById("temps").style.display = "block";
      document.getElementById("distance").style.display = "none";
      $("#distance :input").val("");
    } else if (parametreData === "distance") {
      document.getElementById("distance").style.display = "block";
      document.getElementById("temps").style.display = "none";
      $("#temps :input").val("");
    }
  };

  /**
   * Converts input values to correspond to time in seconds or distances in meters
   * @param  {input} "#heures_input" input value, "#minutes_input" input value, "#kilometers_input" input value, "#meters_input" input value
   * @param  {multiplier} multiplier to convert to seconds or meters
   */

  var convert = function (input, multiplier) {
    let result = 0;
    if (input > 0 && multiplier > 0) {
      result = input * multiplier;
    }
    return result;
  };

  var calcul = function () {
    var times = 0;
    var distances = 0;

    times += convert($("#minutes_input").val(), 60);
    times += convert($("#heures_input").val(), 3600);
    distances += convert($("#metres_input").val(), 1);
    distances += convert($("#kilometres_input").val(), 1000);

    if (!_xy) {
      mviewer.alert(
        "Isochrones : Il faut définir l'origine et au moins un temps de parcours ou une distance",
        "alert-info"
      );
      return;
    }
    if (times === 0 && distances === 0) {
      mviewer.alert(
        "Isochrones : Il faut définir temps parcours ou une distance",
        "alert-info"
      );
      return;
    }

    /**
     * gets other parameters for request
     */

    var mode = $(".selected.isochrone-mode").attr("data-mode");
    var url = mviewer.customComponents["isochroneAddon"].config.options.isochroneUrl;

    var dataParameters = {
      resource: "bdtopo-valhalla",
      point: _xy.join(","),
      profile: mode,
    };

    if (times > 0 && distances === 0) {
      dataParameters["costValue"] = times;
      dataParameters["costType"] = "time";
    } else if (distances > 0 && times === 0) {
      dataParameters["costValue"] = distances;
      dataParameters["costType"] = "distance";
    } else {
      mviewer.alert(
        "Isochrones : Il faut définir soit un temps soit une distance, pas les deux",
        "alert-info"
      );
      return;
    }

    /**
     *Sends request, shows loading messages when request is sent, hides messages when result recieved
     * @param  {} "#loading-isochrones"
     * @param  {} .show
     */

    $("#loading-isochrones").show();
    $.ajax({
      type: "GET",
      url: url,
      crossDomain: true,
      data: dataParameters,
      dataType: "json",
      success: function (response) {
        _showResult(response);
      },
      error: function (request, status, error) {
        mviewer.alert("Il y a un problème avec le calcul, contacter l'admin");
        document.getElementById("loading").style.display = "none";
      },
    });
    document.getElementById("loading").style.display = "block";
  };

  /**
   *displays result recieved from gesoservice
   * @param  {json} data
   */

  var _showResult = function (data) {
    var format = new ol.format.GeoJSON();
    var feature = format.readFeature(data.geometry, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    _layer.getSource().clear();
    _layer.getSource().addFeature(feature);
    document.getElementById("loading").style.display = "none";
    //sets color for result displayed
    var fill = $("#iso_color").val() + "80";
    var stroke = $("#iso_color").val();
    var style = new ol.style.Style({
      fill: new ol.style.Fill({ color: fill }),
      stroke: new ol.style.Stroke({ color: stroke, width: 2 }),
    });
    feature.setStyle(style);
  };

  /**
   *Reset function on click of reset button
   */

  var reset_form = function () {
    _xy = null;
    mviewer.hideLocation();
    _layer.getSource().clear();
    $("#temps :input").val("");
    $("#distance :input").val("");
    $("#color :input").val("#2e5367");
    if ($("#distance-button").hasClass("selected")) {
      $("#distance-button").removeClass("selected");
      $("#time-button").addClass("selected");
      document.getElementById("temps").style.display = "block";
      document.getElementById("distance").style.display = "block";
    }
    if ($("#walking-button").hasClass("selected")) {
      $("#walking-button").removeClass("selected");
      $("#car-button").addClass("selected");
    }
  };

  return {
    init: function () {
      /**
       *Creates button used for toggling form display
       */

      var _btn = document.createElement("button");
      _btn.id = "hfbtn";
      _btn.className = "btn btn-default btn-raised";
      _btn.title = "isochrone";
      let _span = document.createElement("span");
      _span.className = "fas fa-route";
      _btn.appendChild(_span);
      _btn.addEventListener("click", _toggleForm);
      document.getElementById("toolstoolbar").appendChild(_btn);

      /**
       *used for getting start point
       */

      btn_depart = document.getElementById("choisir_depart");
      btn_depart.addEventListener("click", getXY);

      /**
       *used for calcuate button
       */

      btn_calcul = document.getElementById("calcul_result");
      btn_calcul.addEventListener("click", calcul);

      /**
       *Used for transport mode switch
       */

      btn_moyen_deplacement_voiture = document.getElementById("car-button");
      btn_moyen_deplacement_voiture.addEventListener("click", switchModeDeplacement);
      btn_moyen_deplacement_pieton = document.getElementById("walking-button");
      btn_moyen_deplacement_pieton.addEventListener("click", switchModeDeplacement);

      /**
       *used for option switch between time and distance
       */

      btn_moyen_parametre_time = document.getElementById("time-button");
      btn_moyen_parametre_time.addEventListener("click", switchModeParametre);
      btn_moyen_parametre_distance = document.getElementById("distance-button");
      btn_moyen_parametre_distance.addEventListener("click", switchModeParametre);

      /**
       *used to create new layer
       */

      _layer = new ol.layer.Vector({ source: new ol.source.Vector() });
      var _map = mviewer.getMap();
      _map.addLayer(_layer);

      /**
       *used for reset button
       */

      btn_reset = document.getElementById("reset");
      btn_reset.addEventListener("click", reset_form);

      /**
       *gets info from json file
       */

      var isoTitle = mviewer.customComponents["isochroneAddon"].config.options.title;
      document.getElementById("addon_title").innerText = isoTitle;
      var isoColor =
        mviewer.customComponents["isochroneAddon"].config.options.isohroneColor;
      document.getElementById("iso_color").value = isoColor;

      /**
       *adds easy drag to draggable element
       * @param  {html element} '#custom-popin'
       */

      $("#custom-popin").easyDrag({
        handle: ".header",
        container: $("#map"),
      });
    },
  };
})();

new CustomComponent("isochroneAddon", isochroneAddon.init);
