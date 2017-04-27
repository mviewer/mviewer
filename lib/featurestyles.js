mviewer.featureStyles = {};

 /**
       * @param {number} n The max number of characters to keep.
       * @return {string} Truncated string.
       */
      String.prototype.trunc = String.prototype.trunc ||
          function(n) {
            return this.length > n ? this.substr(0, n - 1) + '...' : this.substr(0);
          };


      // http://stackoverflow.com/questions/14484787/wrap-text-in-javascript
      function stringDivider(str, width, spaceReplacer) {
        if (str.length > width) {
          var p = width;
          while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
            p--;
          }
          if (p > 0) {
            var left;
            if (str.substring(p, p + 1) == '-') {
              left = str.substring(0, p + 1);
            } else {
              left = str.substring(0, p);
            }
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
          }
        }
        return str;
      }

mviewer.featureStyles.drawStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new ol.style.Stroke({
        color: '#2fc2c3',
        lineDash: [10, 10],
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: '#2fc2c3',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
    })
});
mviewer.featureStyles.measureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(47, 194, 195, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#2fc2c3',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#2fc2c3'
      })
    })
});

mviewer.featureStyles.elsStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(47, 194, 195, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#2fc2c3',
      width: 1
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({        
        color: 'rgba(255,255,0,0)'
      }),
      stroke: new ol.style.Stroke({
          color: '#2fc2c3',
          width: 5
      })
    })
});

mviewer.featureStyles.crossStyle = new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: 'red'}),
      stroke: new ol.style.Stroke({color: 'red', width: 2}),
      points: 4,
      radius: 10,
      radius2: 0,
      angle: 0
    })
});

mviewer.featureStyles.highlight = new ol.style.Style({   
      fill: new ol.style.Fill({color: 'rgba(212, 53, 50,0)'}),
      stroke: new ol.style.Stroke({color: 'rgba(217, 85, 82,1)', width: 4})     
   
});
mviewer.featureStyles.circle1 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#CC0000'            
          }),
          stroke: new ol.style.Stroke({
            color: '#000000',
            width: 2
          })
        })
      }
);

var getText = function(feature, resolution) {
        var type = 'Normal';
        var maxResolution = 75;
        var text = feature.get('nom');

        if (resolution > maxResolution) {
          text = '';
        } else if (type == 'hide') {
          text = '';
        } else if (type == 'shorten') {
          text = text.trunc(12);
        } else if (type == 'wrap') {
          text = stringDivider(text, 16, '\n');
        }

        return text;
};

var createTextStyle = function(feature, resolution) {
  var align = 'Center';
  var baseline = 'Middle';
  var size = '10px';
  var offsetX = 15;
  var offsetY = 0;
  var weight = 'Normal';
  var rotation = 0;
  var font = weight + ' ' + size + ' ' + 'Verdana';
  var fillColor = '#aa3300';
  var outlineColor = '#ffffff';
  var outlineWidth = 2;

  return new ol.style.Text({
    textAlign: align,
    textBaseline: baseline,
    font: font,
    text: getText(feature, resolution),
    fill: new ol.style.Fill({color: fillColor}),
    stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
    offsetX: offsetX,
    offsetY: offsetY,
    rotation: rotation
  });
};

mviewer.featureStyles.lycee = function(feature, resolution) {
  var fillcolor = "#ffffff";
  if(feature.get('secteur_li')=== 'Public') {
    fillcolor = '#336699';
  } else if(feature.get('secteur_li')=== "Privé sous contrat avec l'éducation nationale") {
    fillcolor = '#CC0000';
  }
  return [new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: fillcolor
      }),
      stroke: new ol.style.Stroke({
        color: "#ffffff",
        width: 4
      }),
      radius: 9
    }),
     text: createTextStyle(feature, resolution)
  })];
};
