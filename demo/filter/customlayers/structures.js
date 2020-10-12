

let legend = { items: [] };
const id = "structures";
const url = 'demo/filter/data/structures.json';
let type = {};
let formJur = [];
let attributeToStyle = 'form_jur';

/**
 * Get random color
 * @return {String} random code
 */
let getRandomColor = function () {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let getStyle = function (form) {
  let style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({ color: form && type[form] || '#848484' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 1 })
    })
  });
  return [style];
}


// ol vector source
const vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: url
});

// ol vector layer
const layer = new ol.layer.Vector({
  source: vectorSource,
  style: function (feature) {
    return getStyle(feature.getProperties()[attributeToStyle]);
  }
});

// event to realize something when layer is read
// this allow to fix some troubles when the customLayers needs to use not completley ready layer
var getJurForm = vectorSource.once('change', function (e) {
  // only for ready state
  if (vectorSource.getState() == 'ready') {
    // remove event
    ol.Observable.unByKey(getJurForm);
    // get all form jur from features
    formJur = vectorSource.getFeatures().map(e => e.getProperties()[attributeToStyle]);
    formJur = [...new Set(formJur)]; // distinct values
    formJur.forEach(e => type[e] = getRandomColor()); // get colors by form jur

    // Load and display dynamic vector legend
    Object.keys(type).forEach(formType => {
      legend.items.push(
        {
          styles: getStyle(formType),
          label: formType,
          geometry: 'Point'
        }
      )
    });
    mviewer.drawVectorLegend(id, legend.items); // standard mviewer method to draw legend
  }
});

// Create
new CustomLayer(id, layer, legend);