import { initDropdown } from "./custom-dropdown.js";

var trackview = (function () {
  // Get all configurations
  const tracksList = mviewer.customComponents.trackview.config.options.mviewer.parcours;
  let currentTracks = tracksList[0];
  let currentSelectedSegmentId = 0;

  // ChartJs graph
  let dataGraph;

  // Define global layer and source used for this add-on
  let hiddenLayerGPX,
    vectorLayerSegment,
    sourceSegment,
    vectorLayerPointKilometers,
    sourcePointKilometers;

  /**
   * This function is used to create the style of each kilometers points ( or other depending on the config file ).
   * @param {*} feature Feature of the layer
   * @returns {style} The style of each kilometers points ( or other... ) styleKilo
   */
  var _styleKilo = function (feature) {
    // define null stype if display false
    let styleKilo = null;
    if (currentTracks.param.pointKilometers.display === "true") {
      styleKilo = new ol.style.Style({
        image: new ol.style.Circle({
          radius: currentTracks.style.pointKilometers.radius,
          fill: new ol.style.Fill({
            color: currentTracks.style.pointKilometers.color.image,
          }),
          stroke: new ol.style.Stroke({
            color: currentTracks.style.pointKilometers.color.stroke,
            width: currentTracks.style.pointKilometers.width,
          }),
        }),
        text: new ol.style.Text({
          text: String(feature.getProperties().properties.id),
          fill: new ol.style.Fill({
            color: currentTracks.style.pointKilometers.color.text,
          }),
        }),
      });
    }
    return styleKilo;
  };

  /**
   *
   * @param {*} feature
   * @returns
   */
  var _createSelectedSegementStyle = (feature) => {
    const selectedSegment = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: currentTracks.style.segment.color.selected,
        width: currentTracks.style.segment.width.selected,
      }),
    });

    // if current segment is the last selected add point on segment
    if (currentSelectedSegmentId == feature.getProperties().properties.id) {
      const geometry = feature.getGeometry();
      const coordinates = geometry.getCoordinates();
      const endCoordinate = coordinates[coordinates.length - 1];
      const selectedPoint = new ol.style.Style({
        geometry: new ol.geom.Point(endCoordinate),
        image: new ol.style.Circle({
          radius: currentTracks.style.point.radius,
          fill: new ol.style.Fill({
            color: currentTracks.style.point.color.image,
          }),
          stroke: new ol.style.Stroke({
            color: currentTracks.style.point.color.stroke,
            width: currentTracks.style.point.width,
          }),
        }),
      });
      return [selectedSegment, selectedPoint];
    } else if (currentSelectedSegmentId > feature.getProperties().properties.id) {
      return [selectedSegment];
    } else {
      const defaultSegment = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: currentTracks.style.segment.color.default,
          width: currentTracks.style.segment.width.default,
        }),
      });
      return [defaultSegment];
    }
  };

  /**
   * This function allow you to initialize all of the layers and the styles presents on the map
   * @params index
   * @returns Nothing
   */
  var _initLayer = (index) => {
    currentTracks = tracksList[index];

    // Mviewer layer creation
    let mviewerCurrentTrackLayer = {
      showintoc: true,
      type: currentTracks.stats.type,
      layerid: currentTracks.stats.layerId,
      id: currentTracks.stats.layerId,
      title: currentTracks.label,
      vectorlegend: true,
      visible: true,
      opacity: currentTracks.stats.opacity,
      tooltip: true,
    };

    // Define legend
    mviewerCurrentTrackLayer.legend = {
      items: [
        {
          label: currentTracks.title,
          geometry: currentTracks.style.geometry,
          styles: [
            new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: currentTracks.style.segment.color.default,
                width: currentTracks.style.segment.width.default,
              }),
            }),
          ],
        },
      ],
    };

    // Mviewer visible layer
    vectorLayerSegment = new ol.layer.Vector({
      id: "segmentLayer",
      source: new ol.source.Vector(),
      style: _createSelectedSegementStyle,
    });
    sourceSegment = vectorLayerSegment.getSource();
    mviewer.processLayer(mviewerCurrentTrackLayer, vectorLayerSegment);
    mviewer.addLayer(mviewerCurrentTrackLayer);

    // Source layer with GPX data
    hiddenLayerGPX = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: currentTracks.data.url,
        format: new ol.format.GPX(),
      }),
      style: null,
    });
    mviewer.getMap().addLayer(hiddenLayerGPX);

    // Point layer each kilometers
    vectorLayerPointKilometers = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: _styleKilo,
    });
    sourcePointKilometers = vectorLayerPointKilometers.getSource();
    mviewer.getMap().addLayer(vectorLayerPointKilometers);

    vectorLayerSegment.on("change:visible", function (event) {
      const isVisible = vectorLayerSegment.getVisible();
      vectorLayerPointKilometers.setVisible(isVisible);

      if (!isVisible) {
        // hide graph
        document.getElementById("trackview-panel").classList.add("hidden");
      } else {
        // show graph
        document.getElementById("trackview-panel").classList.remove("hidden");
      }
    });
  };

  // features list could be in parameter of the function
  // why _ here in function name and not in other function :)
  /**
   * This function is used to create feature with coordinates, and then, create an array to store, one feature and it distance.
   * @params Nothing
   * @returns {point[]} Array of points
   */
  var _createFeatures = function () {
    let featuresGPX = hiddenLayerGPX.getSource().getFeatures();

    // If no feature nothing to do
    if (featuresGPX.length === 0) {
      console.error("There is no features !");
      return;
    }

    // GPX is a multiString get all coordonate
    let idKilometre = 1;
    let distanceTotalForSegment = 0;
    let coordinates = featuresGPX[0].getGeometry().getCoordinates()[0];
    let finalData = [];
    let previousPoint;
    let previousPointConvert;
    let markerDistance = 1000;

    // Collect coordinates of all points in multiString order
    for (let i = 0; i < coordinates.length; i++) {
      let featureX = coordinates[i][0];
      let featureY = coordinates[i][1];
      let featureZ = coordinates[i][2];
      // Not used for the moment Time -- let featureT = coordinates[i][3];

      // Get coordinates of each points to be used after
      let currentPoint = [featureX, featureY];

      // Conversion of the current point in other projection for a better manipulation
      let currentPointConvert = ol.proj.transform(currentPoint, "EPSG:3857", "EPSG:4326");

      // Only after first point
      if (i > 0) {
        const distanceCalc =
          turf.distance(previousPointConvert, currentPointConvert) * 1000; // Distance between the current point and the previous one

        // If the distance is greater than the max distance, we create a point and a segment
        if (distanceTotalForSegment + distanceCalc > markerDistance) {
          const distanceManquante = (markerDistance - distanceTotalForSegment) / 1000; // We calculate the missing distance
          markerDistance += 1000;

          // Get coords for the wanted distance
          const segmentTurf = turf.lineString([
            previousPointConvert,
            currentPointConvert,
          ]);
          const along = turf.along(segmentTurf, distanceManquante);
          const pointCoords = along.geometry.coordinates;

          // Then, we create a new point with the coordinates of along
          const olPoint = new ol.geom.Point(ol.proj.fromLonLat(pointCoords));

          const feature = new ol.Feature({
            geometry: olPoint,
            properties: {
              id: idKilometre,
            },
          });

          // We add each feature to the source
          sourcePointKilometers.addFeature(feature);
          idKilometre++;
        }

        // Create segment with point
        var segment = new ol.geom.LineString([previousPoint, currentPoint]);
        // Set high with pointEnd Z
        distanceTotalForSegment += distanceCalc;

        // Creation of segment
        let segmentFeature = new ol.Feature({
          geometry: segment,
          properties: {
            id: i,
            distance: distanceTotalForSegment,
          },
        });

        // Finally, we add each segment feature to the segment source
        sourceSegment.addFeature(segmentFeature);
      }
      finalData[i] = [distanceTotalForSegment, featureZ]; // Add distance and point in finalData array
      // CurrentPoint.set('distance', distance);

      previousPoint = currentPoint;
      previousPointConvert = currentPointConvert;
    }

    dataGraph = _addGraph(finalData);
  };

  // VerticalLine plugin
  const verticalLine = {
    id: "verticalLine",
    afterDatasetsDraw(chart, args, plugins) {
      const {
        ctx,
        tooltip,
        chartArea: { top, bottom, left, right, width, heigth },
        scales: { x, y },
      } = chart;
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
    },
  };

  /**
   * This function allow you to add a graph on the map to show the altitude of each parcours.
   * @param {point} data Array of points
   * @returns {chart} The graph who has create
   */
  var _addGraph = function (data) {
    let xAxisGraphData = [];
    let yAxisGraphData = [];

    data.forEach(function (tab) {
      xAxisGraphData.push(tab[0] / 1000); // In kilometers
      yAxisGraphData.push(tab[1]);
    });

    // Define a max value for the graph that the data fill all the available space
    const maxValeur = xAxisGraphData[xAxisGraphData.length - 1];

    let trackLineChart = new Chart(document.getElementById("trackview-graph"), {
      type: currentTracks.style.graph.type,
      data: {
        labels: xAxisGraphData,
        datasets: [
          {
            data: yAxisGraphData,
            label: currentTracks.label,
            pointBackgroundColor: currentTracks.style.graph.color.point,
            borderColor: currentTracks.style.graph.color.segment,
            fill: true,
          },
        ],
      },
      options: {
        onHover: (event) => {
          var points = trackLineChart.getElementsAtEventForMode(event, "index", {
            intersect: false,
          });

          // if point exist
          if (points.length) {
            // update currentSelectedSegmentId
            currentSelectedSegmentId = points[0].index;
            vectorLayerSegment.changed();
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
              text: currentTracks.style.graph.name.xAxis.text,
            },
          },
          y: {
            title: {
              display: true,
              text: currentTracks.style.graph.name.yAxis.text,
            },
          },
        },
        plugins: {
          tooltip: {
            borderWidth: 1,
            borderColor: "white",
            callbacks: {
              label: function (tooltipItem) {
                var dataItem = tooltipItem.raw;
                return "Altitude " + dataItem + " m";
              },
            },
          },
          title: {
            display: true,
            text: currentTracks.style.graph.title,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
      plugins: [verticalLine],
    });
    return trackLineChart;
  };

  /**
   * This function is used to do a zoom on the features loaded.
   * Zoom on global extend + buffer
   * @returns Nothing
   */
  var _zoomOnFeature = () => {
    // Zoom on first feature
    let firstfeature = hiddenLayerGPX.getSource().getFeatures()[0];

    mviewer.getMap().getView().fit(firstfeature.getGeometry().getExtent(), {
      duration: 3000, // Define the animation time in ms
      maxZoom: 13.75, // Define the zoom max when the page is load
    });
  };

  /**
   * This function is used to clear all of the items we need when the parcours is changing.
   * @params Nothing
   * @returns Nothing
   */
  var _clearTool = () => {
    var legend = document.querySelector(
      `[data-layerid="${currentTracks.stats.layerId}"].mv-layer-details`
    );

    // If legend, we remove it
    if (legend) {
      legend.remove();
    }

    // If graph, delete all data and destroy him
    if (dataGraph) {
      dataGraph.data.datasets.forEach(function (dataset) {
        dataset.data = null;
      });
      dataGraph.destroy();
    }

    // Clear all source that we need
    sourceSegment.clear();
    sourcePointKilometers.clear();
  };

  /**
   * This function allow you to initialize the trackview addon.
   * @params Nothing
   * @returns Nothing
   */
  var _initTool = function () {
    // Trackview-parcours dropdown
    let dropdown = document.getElementById("trackview-parcours");

    // Here we create the dropdown list
    for (let i = 0; i < tracksList.length; i++) {
      const li = document.createElement("li");
      li.value = i;
      li.textContent = tracksList[i].label;

      dropdown.appendChild(li);
    }

    // Here we check if the dropdown is clicked ( used )
    document.querySelector("#trackview-parcours").addEventListener("click", (e) => {
      let itemSelected = e.target;
      let itemValue = itemSelected.getAttribute("value");

      // If an element is selected in the list
      if (itemValue) {
        _clearTool();
        _initLayer(itemValue);

        hiddenLayerGPX.getSource().once("change", function (e) {
          if (hiddenLayerGPX.getSource().getState() === "ready") {
            console.log("Features are loaded");
            _createFeatures();
            dataGraph.update();
            _zoomOnFeature();
            // Display graph
            document.getElementById("trackview-panel").classList.remove("hidden");
          }
        });
      }
    });

    // Calling function do init all layer
    _initLayer(0);

    mviewer.getMap().once("rendercomplete", function (e) {
      _zoomOnFeature(); // Calling fonction for zoom on the features
      _createFeatures(); // Calling fonction for create all of the features
      initDropdown(); // Calling the init of the dropdown

      /*********** Detect feature on the map ***********/
      mviewer.getMap().on("pointermove", function (event) {
        mviewer.getMap().forEachFeatureAtPixel(
          event.pixel,
          function (feature, layer) {
            // Check if the layer pointed is equal to the layer of interest
            if (feature && layer === vectorLayerSegment) {
              mviewer.pointHover = feature.getProperties().properties.distance;
              currentSelectedSegmentId = feature.getProperties().properties.id;
              dataGraph.update();
              vectorLayerSegment.changed();
            }
          },
          { hitTolerance: currentTracks.param.tolerance.value }
        ); // Value in pixel
      });
    });
  };

  return {
    init: _initTool,
  };
})();

new CustomComponent("trackview", trackview.init);
