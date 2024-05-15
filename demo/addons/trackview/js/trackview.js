var trackview = (function () {

  // TODO why parcours.parc ?
  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;
  var d = [];
  var z = [];
  var dataGraph;
  var color = [];
  var radius = [];
  var valueId = 0;
  let vector, vectorSource, vectorPoint, sourceP, vectorSegment, sourceSegment, vectorNewPoint, sourceNewPoint, vectorPointKilometers, sourcePointKilometers = null;
  let distanceTotalForSegment = null;

  // Mviewer layer creation
  var parcoursLayer = {
    showintoc: true,
    type: global.stats.type,
    layerid: global.stats.layerId,
    id: global.stats.layerId,
    title: global.stats.name,
    vectorlegend: true,
    visible: true,
    opacity: global.stats.opacity,
    tooltip: true,
    urlData: global.data.url
  };
  
  // Defines the different styles
  const style = {
    'defaultSegment': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: global.style.segment.color.default,
        width: global.style.segment.width.default,
      }),
    }),

    'selectedSegment': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: global.style.segment.color.selected,
        width: global.style.segment.width.selected,
      }),
    }),

    'selected': new ol.style.Style({
      image: new ol.style.Circle({
        radius: global.style.point.radius,
        fill: new ol.style.Fill({
          color: global.style.point.color.image,
        }),
        stroke: new ol.style.Stroke({
          color: global.style.point.color.stroke,
          width: global.style.point.width,
        }),
      }),
    }),

    'each_kilometers': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 9,
        fill: new ol.style.Fill({
          color: "#00f",
        }),
        stroke: new ol.style.Stroke({
          color: "#000",
          width: 3,
        }),
      }),
      text: new ol.style.Text({
        text: null,
        fill: new ol.style.Fill({
          color: "#fff"
        }),
      }),
    }),
  };

  // Define the different legends
  parcoursLayer.legend = {
    items: [
      {
        label: global.title,
        geometry: global.style.geometry,
        styles: [
          style["defaultSegment"],
        ],
      },
    ],
  };

  /**
   * This function allow you to initialize all of the layers presents on the map
   */
  var _initLayer = () => {
    // Source layer
    vectorSource = new ol.source.Vector({
      url: parcoursLayer.urlData,
      format: new ol.format.GPX(),
    });

    vector = new ol.layer.Vector({
      source: vectorSource,
      style: style["defaultSegment"]
    });
  
    // Point layer
    vectorPoint = new ol.layer.Vector({
      style: null
    });
  
    sourceP = new ol.source.Vector();
  
    // Segment layer
    vectorSegment = new ol.layer.Vector();
  
    sourceSegment = new ol.source.Vector();
  
    // Point layer in front of each segment
    vectorNewPoint = new ol.layer.Vector();
  
    sourceNewPoint = new ol.source.Vector();

    // Point layer each kilometers
    vectorPointKilometers = new ol.layer.Vector({
      style: null
    });

    sourcePointKilometers = new ol.source.Vector();

    // Add each layer in mviewer
    mviewer.processLayer(parcoursLayer, vector);
    mviewer.addLayer(parcoursLayer);
  
    vectorNewPoint.setSource(sourceNewPoint);
    mviewer.getMap().addLayer(vectorNewPoint);

    vectorSegment.setSource(sourceSegment);
    mviewer.getMap().addLayer(vectorSegment);

    vectorPoint.setSource(sourceP);
    mviewer.getMap().addLayer(vectorPoint);

    vectorPointKilometers.setSource(sourcePointKilometers);
    mviewer.getMap().addLayer(vectorPointKilometers);
  }
  
  // TODO remove all var for let or const declaration in variables see https://www.freecodecamp.org/news/var-let-and-const-whats-the-difference/

  // features list could be in parameter of the function
  // why _ here in function name and not in other function :)
  /**
   * Description TODO
   * @returns {point[]} - Array of points
   */
  var _createFeature = function () {

    let features = vectorSource.getFeatures();

    // If no feature nothing to do
    if(!features) {
      return;
    }

    let coordinates = features[0].getGeometry().getCoordinates()[0];
    var finalData = [];
    var distance = 0;

    var previousPoint;

    for (let i = 0; i < coordinates.length; i++) {

      // Collect coordinates of all points
      var featureX = coordinates[i][0];
      var featureY = coordinates[i][1];
      var featureZ = coordinates[i][2];
      var featureT = coordinates[i][3];

      // Creation of feature with coordinates
      var point = new ol.Feature({
        geometry: new ol.geom.Point([featureX,featureY,featureZ,featureT]),
        properties: {
          id: i
        }
      });
  
      sourceP.addFeature(point);

      // If its the first point
      if (i === 0) {
        finalData[i] = [distance, point]; // We add the default distance (0) and point in the finalData array
        point.set('distance', distance);
      } else {
        var distanceCalc = _distanceBtwPoint(previousPoint, point); // Distance between the current point and the previous one
        distance += distanceCalc; // Add distance in variable
        finalData[i] = [distance, point]; // Add distance and point in finalData array
        point.set('distance', distance);
      }
      previousPoint = point;
    };

    dataGraph = _addGraph(finalData);
  };

  /**
   * Description TODO again
   * @param {point} p1 - First point.
   * @param {point} p2 - Second point.
   * @returns {float} The distance between the two points.
   */

  var maxDistance = 1000;
  var j = 1;

  var _distanceBtwPoint = function (p1, p2) {

    // Variables
    var sgmtKilometers = {};

    // First, we get the coordinates of two points
    var coordPoint1 = p1.getGeometry().getCoordinates();
    var coordPoint2 = p2.getGeometry().getCoordinates();

    // Then, we get just the x and y coordinates of the two points
    var pointDebut = [coordPoint1[0], coordPoint1[1]];
    var pointFin = [coordPoint2[0], coordPoint2[1]];

    var pointDebutConvert = ol.proj.transform(pointDebut, 'EPSG:3857', 'EPSG:4326');
    var pointFinConvert = ol.proj.transform(pointFin, 'EPSG:3857', 'EPSG:4326');

    var distanceTurf = parseInt((turf.distance(pointDebutConvert, pointFinConvert) * 1000).toFixed(0));

    var segment = new ol.geom.LineString([pointDebut, pointFin]);

    if((distanceTotalForSegment + distanceTurf) > maxDistance) {
      var distanceManquante = (maxDistance - distanceTotalForSegment) / 1000; // We calculate the missing distance
      maxDistance += 1000;

      var lineTurf = turf.lineString([pointDebutConvert, pointFinConvert]);

      var along = turf.along(lineTurf, distanceManquante);

      const pointCoords = along.geometry.coordinates;

      // Then, we create a new point with the coordinates of along
      const olPoint = new ol.geom.Point(ol.proj.fromLonLat(pointCoords));

      const feature = new ol.Feature({
        geometry: olPoint,
        properties : {
          id : j
        }
      });

      j++;

      feature.setStyle(style["each_kilometers"]);

      // We add each feature to the source
      sourcePointKilometers.addFeature(feature);
    }

    distanceTotalForSegment += distanceTurf;

    var segmentFeature;

    // Creation of segment
    segmentFeature = new ol.Feature({
      geometry: segment,
      properties: {
        id: valueId,
        distance: distanceTotalForSegment
      }
    });

    valueId += 1;

    // We set default style of each segment
    segmentFeature.setStyle(style["defaultSegment"]);

    // Finally, we add each segment feature to the segment source
    sourceSegment.addFeature(segmentFeature);

    return distanceTurf;
  };

  // VerticalLine plugin 
  const verticalLine = {
    id: "verticalLine",
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx, tooltip, chartArea: { top, bottom, left, right, width, heigth }, scales: {x, y}} = chart;
      var xCoord = null;

      if (chart.tooltip?._active?.length) {
        xCoord = x.getPixelForValue(tooltip.dataPoints[0].parsed.x);
      } else {
        xCoord = x.getPixelForValue(mviewer.pointHover / 1000);
      }
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#03224c";
      ctx.setLineDash([6, 6]);
      ctx.moveTo(xCoord, top);
      ctx.lineTo(xCoord, bottom);
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);
    }
  }

  /**
   * This function allow you to add a graph on the map to show the altitude of each parcours
   * @param {point} data - Array of points
   * @returns {chart} - The graph who has create
   */
  var _addGraph = function (data) {
    // Constants
    const defaultPointColor = global.style.segment.color.default;
    const defaultRadiusValue = 2.5;


    data.forEach(function (tab) {
      d.push(tab[0]/1000); // Permet d'avoir en km
      z.push(tab[1].getGeometry().getCoordinates()[2]);
    });

    // Define a max value for the graph that the data fill all the available space
    const maxValeur = d[d.length - 1];

    // Creation of the width and the color for each point of the graph
    for (let i = 0; i < d.length; i++) {
      color.push(defaultPointColor);
      radius.push(defaultRadiusValue);
    }

    var trackLineChart = null;
    trackLineChart = new Chart(document.getElementById("trackview-panel"), {
      type: global.style.graph.type,
      data: {
        labels: d,
        datasets: [{
          data: z,
          label: global.stats.name,
          pointBackgroundColor: color,
          pointRadius: radius,
          borderColor: global.style.segment.color.default,
          fill: true
        }],
      },
      options: {
        animation: {
          duration: 500
        },
        onHover: (event) => {
          var points = trackLineChart.getElementsAtEventForMode(event, 'index', { intersect: false });
          var segment = vectorSegment.getSource().getFeatures();

          if (points.length) {
            var pointId = points[0].index;
            vectorPoint.getSource().getFeatures().forEach(function (elt) {

              var carteId = elt.getProperties().properties.id;
              elt.setStyle(null);

              if (pointId == carteId) {
                elt.setStyle(style["selected"]);
                segment.forEach(function(seg) {
                  var segmentId = seg.getProperties().properties.id;

                  if (segmentId < pointId) {
                    seg.setStyle(style["selectedSegment"]);
                  } else {
                    seg.setStyle(style["defaultSegment"]);
                  }
                });
              }
            })
          }
        },
        responsive: true,
        scales: {
          x: {
            type: "linear",
            beginAtZero: true,
            max: maxValeur,
            title: {
              display: true,
              text: global.style.graph.name.xAxis.text
            },
          },
          y: {
            title: {
              display: true,
              text: global.style.graph.name.yAxis.text
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: global.style.graph.title
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
      plugins: [verticalLine]
    });
    return trackLineChart;
  };

  /**
   * This function allow you to initialize the trackview addon
   * @param {null} - Nothing
   * @returns {null} - Nothing
   */
  var _initTool = function () {
    console.log("Initialisation de l'outil"); // Display in logs
    // Calling function do init all layer
    _initLayer();

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      
      var feature = source.getFeatures();

      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 3000, // Define the animation time in ms
        maxZoom: 13.75 // Define the zoom max when the page is load
      });
      _createFeature(); 

      /*********** Detect feature on the map ***********/
      var map = mviewer.getMap();
      map.on("pointermove", function(event) {
        var pixel = event.pixel;
        var tolerance = 4; // In pixel

        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          var segmentVector = vectorSegment.getSource().getFeatures();

          // Nothing to do if no feature
          if(!feature) {
            return;
          }
 
          let pointOnSgmt = null;
          // Check if the layer pointed is equal to the layer of interest
          if(layer === vectorSegment) {
            let idSgmtOnFeature = feature.getProperties().properties.id;
            mviewer.pointHover = feature.getProperties().properties.distance;
            let sgmtLastCoordinate = null;
            sgmtLastCoordinate = feature.getGeometry().getLastCoordinate();

            sourceNewPoint.clear();
            
            // Create a new point feature
            pointOnSgmt = new ol.Feature({
              geometry: new ol.geom.Point(sgmtLastCoordinate)
            });

            // Add style to the feature
            pointOnSgmt.setStyle(style["selected"]);
            
            sourceNewPoint.addFeature(pointOnSgmt);

            segmentVector.forEach(function(segment) {
              let idSgmt = segment.getProperties().properties.id;
              
              if(idSgmt <= idSgmtOnFeature) {
                segment.setStyle(style["selectedSegment"]);
              } else {
                segment.setStyle(style["defaultSegment"]);
              }
            });
            dataGraph.update();
          }
        }, {hitTolerance: tolerance});
      });
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);