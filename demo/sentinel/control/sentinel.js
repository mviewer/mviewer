// All images to be displayed
const sentinelLayers = {
  "AGRICULTURE": {
    "input": "Agriculture",
    "bandes": {
      "bande1": "B11",
      "bande2": "B08",
      "bande3": "B02"
    }
  },
  "TRUE_COLOR": {
    "input": "Vraies Couleurs",
    "bandes": {
      "bande1": "B04",
      "bande2": "B03",
      "bande3": "B02"
    }
  },
  "GEOLOGY": {
    "input": "Geologie",
    "bandes": {
      "bande1": "B12",
      "bande2": "B04",
      "bande3": "B02"
    }
  },
  "SWIR": {
    "input": "Swir",
    "bandes": {
      "bande1": "B02",
      "bande2": "B11",
      "bande3": "B12"
    }
  },
  "FALSE_COLOR": {
    "input": "Fausses couleurs",
    "bandes": {
      "bande1": "B08",
      "bande2": "B04",
      "bande3": "B03"
    }
  }
};

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
    // Default Image
    this._selectedImage = "TRUE_COLOR";
    // Bandes associated with the image
    this._bandes = {};

  }
  // Transform a date object into a string foolowing this format : YYYY-MM-DD
  _formatDate (date) {

    var d = date.getDate();

    var m = date.getMonth() + 1;

    var year = date.getFullYear();

    var day = d < 10 ? ("0" + d) : d;

    var month = m < 10 ? ("0" + m) : m;

    var formatedDate = [year, month, day].join("-");

    return formatedDate;

  };
  // Init Calendar
  _initDatePicker(options, date = new Date()) {
    if (options) {
      var datepicker = $(".sentinelDatePicker");
      datepicker.datepicker("destroy");
      datepicker.datepicker(options);
      datepicker.datepicker("setDate", date);
    } else {
      console.log("No propreties provided !");
    }
  }
  // Callback to sort the dates of the datepicker
  _processForEachDay(date, parent) {
    // Send the context of the customControl with parent to use its functions
    date = parent._formatDate(date);
    var cloudCover = document.getElementById("cloud-cover").value;
    var classe = "";
    // Look for the Index of the Dates that do not correspond to the cloud coverage (either below or above)
    var foundIndex = _availableDates.findIndex(elem => elem.date === date);
    if (foundIndex >= 0) {
      // If found then set class for superior coverage
      if (_availableDates[foundIndex].cc > cloudCover) {
        classe = 'selectedDatesUpper';
      }
      // If found then set class for inferior coverage
      else if (_availableDates[foundIndex].cc < cloudCover) {
        classe = 'selectedDatesLower';
      }
    }
    // If the class is not specified do not set the tooltip over the date
    return {
      classes: classe,
      tooltip: classe !== "" ? "Couverture Nuageuse : " + _availableDates[foundIndex].cc + " %" : false
    };
  }
  // Filter all the data
  _filterWfsData(couverture) {

    _availableDates = [];

    // Remove feature which have more cloud coverage than specified and store their dates and cloud coverage
    var selection = this._storedData.filter((feature) => {
      var inrange = feature.properties.cloudCoverPercentage <= parseInt(couverture);
      if (_availableDates.findIndex(elem => elem.date === feature.properties.date) === -1) {
        _availableDates.push({
          "date": feature.properties.date,
          "cc": feature.properties.cloudCoverPercentage
        });
      }
      return inrange;
    });
    return selection;
  }
  // Create the script to change gamma and gain in the WMS request
  _generateCustomScript(){
    let gain = document.getElementById("sentinel-layer-gain").value;
    let gamma = document.getElementById("sentinel-layer-gamma").value;
    return 'let viz = new HighlightCompressVisualizerSingle(0,0.4, gain = ' + gain + ',gamma=' + gamma + ');' +
           'function evaluatePixel(samples) {' +
              'let val = [samples[0].' + this._bandes.bande1 + ', samples[0].' + this._bandes.bande2 + ', samples[0].' + this._bandes.bande3 + '];' +
              'return val.map(v=>viz.process(v));' +
           '}' +
           'function setup(ds) {' +
              'setInputComponents([ds.' + this._bandes.bande1 + ', ds.' + this._bandes.bande2 + ', ds.' + this._bandes.bande3 + ']);' +
              'setOutputComponentCount(3);' +
           '}';

  }
  // Update all parameters related to the active layer/image
  _setLayerExtraParameters (filter_time, image, cloud_cover, showDate) {

    // Update Layer with CustomLayer function
    var layers = image;
    if (showDate) {
      layers += ",DATE";
    }
    var _source = mviewer.customLayers.sentinel.layer.getSource();
    this._bandes = sentinelLayers[image].bandes;
    var customScriptEncoded = window.btoa(this._generateCustomScript());
    mviewer.customLayers.sentinel.requestOnApplyClicked({
      "maxcc": cloud_cover,
      "TIME": filter_time,
      "LAYERS": layers,
      "EVALSCRIPT":customScriptEncoded
    });
    if (_source.hasOwnProperty("tileClass")) {
      _source.updateParams({
        'ol3_salt': Math.random()
      });
    }

  };
  // Create the wfs request
  _createWfsRequest(date, image = "TRUE_COLOR", cloud = 0, showDate = false) {
    var newDate = this._formatDate(date);
    var bbox = mviewer.getMap().getView().calculateExtent().join(",");
    WFSrequest.BBOX = bbox;
    if (date)
      WFSrequest.TIME = newDate;
    $.ajax({
      type: "GET",
      url: "https://services.sentinel-hub.com/ogc/wfs/f6219778-b67d-4107-84c6-56e00a2642e2",
      data: WFSrequest,
      crossDomain: true,
      dataType: "json",
      success: (data) => {
        this._storedData = data.features;
        this._filterWfsData(cloud);
        this._setLayerExtraParameters(newDate, image, cloud, showDate);
        this._initDatePicker({
          todayHighlight: true,
          beforeShowDay: (date) => this._processForEachDay(date, this),
          autoclose: true
        }, date);
      }
    });
  }


  // Mandatory - code executed when panel is opened
  init() {

    // Init Sliders
    $("#sentinel-layer-gain").slider({});
    $("#sentinel-layer-gamma").slider({});

    // Get all inputs
    var imageSelect = $("#image-displayed");
    var cloudInput = $("#cloud-cover");
    var dateInput = $("#shooting-date");
    var applyButton = $("#applyButton");

    // Populate the select input for WMS/WFS request
    var allLayersEntries = Object.entries(sentinelLayers);
    for (const [key, value] of allLayersEntries) {
      imageSelect.append(new Option(value.input,key));
    }
    // Set select default value
    imageSelect.val(this._selectedImage);

    // Set the bandes of the default selectedImage
    this._bandes = sentinelLayers[this._selectedImage].bandes;

    // Set cloudCoverage input default value
    cloudInput.val(0);

    // Click event to apply all the parameters entered in the inputs
    applyButton.on("click", () => {
      let image = imageSelect.val();
      let cloud = cloudInput.val();
      let date = dateInput.datepicker('getDate');
      let showDate = $("#sentinelShowDate").prop("checked");

      this._createWfsRequest(date, image, cloud, showDate);

    });
    // Init DatePicker
    this._initDatePicker({
      todayHighlight: true,
      beforeShowDay: (date) => this._processForEachDay(date, this),
      autoclose: true
    });
    // Get WFS data and Init datePicker
    this._createWfsRequest(new Date());
  }
  // Mandatory - code executed when panel is closed
  destroy() {

  }

}
// Create The Swipe CustomControl
new Sentinel("sentinel");
