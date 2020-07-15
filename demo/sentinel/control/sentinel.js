// All images to be displayed
const sentinelLayers = [{
  "value": "AGRICULTURE",
  "input": "Agriculture"
},
{
  "value": "TRUE_COLOR",
  "input": "Vraies Couleurs"
},
{
  "value": "GEOLOGY",
  "input": "Geologie"
},
{
  "value": "SWIR",
  "input": "Swir"
}
];

// WFS request properties
const WFSrequest = {
'SERVICE': 'WFS',
'VERSION': '2.0.0',
'REQUEST': 'GetFeature',
'TIME': new Date(),
'TYPENAMES': "S2.TILE",
"MAXFEATURES": 200,
"OUTPUTFORMAT": "application/json",
'BBOX': '-85609.475158,6342438.846129,-623726.112541,5938851.291686',
'SRSNAME': 'EPSG:3857'
};
var _availableDates = [];

// Classe qui etend la classe abstraite et decrit le custom Control
class Sentinel extends AdvancedCustomControl {
// Initialize the Custom Component

constructor(id) {
  // Initialize CustomControl superClass
  super(id);
  // Data initialised once at the start of the app
  this._storedData = {};
}

// Init Calendar
_initDatePicker(options) {
  console.log("passed");
  if (options) {
    var datepicker = $(".sentinelDatePicker");
    datepicker.datepicker("destroy");
    datepicker.datepicker(options).on('changeDate',(e)=>{
      this.createWfsRequest(e.format());
    });
    
  } else {
    console.log("No propreties provided !");
  }
}
// Callback to sort the dates of the datepicker
_processForEachDay(date) {
  var classe = "";

  if (_availableDates.indexOf(date) >= 0) {

    classe = 'selectedDates';

  }
  return [true, classe];
}
// Filter all the data
_filterWfsData(couverture) {

  _availableDates = [];

  // Remove feature which have more clouds than specified and store there dates
  var selection = this._storedData.filter((feature) => {
    if (_availableDates.indexOf(feature.properties.date) === -1) {
      _availableDates.push(feature.properties.date);
    }
    return feature.properties.cloudCoverPercentage <= parseInt(couverture);
  });
  return selection;
}
// data request
createWfsRequest(date){
  var cloudInput = $("#cloud-cover");
  if(date)
    WFSrequest.TIME=date;
  $.ajax({
    type: "GET",
    url: "https://services.sentinel-hub.com/ogc/wfs/f6219778-b67d-4107-84c6-56e00a2642e2",
    data: WFSrequest,
    crossDomain: true,
    dataType: "json",
    success: (data) => {
      this._storedData = data.features;
      //this._updateLayer(cloudInput.val());
      this._applyFilterToAllLayers(date, cloudInput.val());
    }
  });
}
_updateLayer (couverture) {

  var source = mviewer.customLayers.sentinel.layer.getSource();

  source.clear();

  var selection = this._filterWfsData(couverture);

  selection.forEach(function(item, id) {

      var f = new ol.Feature({geometry: new ol.geom.MultiPolygon(item.geometry.coordinates)});

      f.setProperties(item.properties);

      source.addFeature(f);

  });



}
_setLayerExtraParameters =  function (filter_time, cloud_cover) {

//fonction appellÃ©e pour mettre Ã  jour les donnÃ©e affichÃ©es selon la couvNuageuse et la date

var _source = mviewer.customLayers.sentinel.layer.getSource();

_source.getParams()['TIME'] = filter_time;

_source.getParams()['maxcc'] = cloud_cover;

_source.changed();

if (_source.hasOwnProperty("tileClass")) {

    _source.updateParams({'ol3_salt': Math.random()});

}

};
_applyFilterToAllLayers = function (time_filter, cc) {

//applique les changements Ã  toutes les couches de la liste

const allImages = sentinelLayers.map(sentinelObj => sentinelObj.value);

//pour chaque layer de la liste des layers, on:

allImages.forEach((layer) =>{

    //appelle la fonction:

    this._setLayerExtraParameters(layer,time_filter, cc);

});



}


// Mandatory - code executed when panel is opened
init() {

  // Init Sliders
  $("#sentinel-layer-lumos").slider({});
  $("#sentinel-layer-contrast").slider({});

  // Get all inputs
  var imageSelect = $("#image-displayed");
  var cloudInput = $("#cloud-cover");
  var applyButton = $("#applyButton");

  // Populate the select input for WMS/WFS request
  sentinelLayers.forEach(elem => {
    imageSelect.append(new Option(elem.input, elem.value));
  });

  // Set select default value
  imageSelect.val("TRUE_COLOR");

  // Set cloudCoverage input default value
  cloudInput.val(0);

  // Click event to apply all the parameters entered in the inputs
  applyButton.on("click", function () {
    let image = imageSelect.val();
    let cloud = cloudInput.val();
    //let date = shooting-date.val();

    // Call customLayer function to update the layer
    mviewer.customLayers.sentinel.requestOnImageChange({
      "image": image,
      "cloud": cloud,
      "date": "poney"
    });
  });
  // Init DatePicker
  this._initDatePicker({
    todayHighlight: true,
    beforeShowDay: this._processForEachDay
  });
  // Get WFS data and Init datePicker21
  this.createWfsRequest()
}
// Mandatory - code executed when panel is closed
destroy() {

}

}
// Create The Swipe CustomControl
new Sentinel("sentinel");