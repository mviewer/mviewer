var trackview = (function () {

  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;
  var d = [];
  var z = [];
  var dataGraph;
  var propsDistance = [];
  var color = [];
  var radius = [];
  var valueId = 0;

  // Creation du layer mviewer
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
  
  // Permet de définir les différents styles
  const style = {
    'styleCircuit': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: global.style.color,
        width: global.style.width,
      }),
    }),

    'default': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#f00",
        width: 3,
      }),
    }),

    'selectedSegment': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#03224c",
        width: 5,
      }),
    }),

    'styleSegmentBleu': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#77b5fE",
        width: 4,
      }),
    }),

    'styleSegmentVert': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#0f0",
        width: 4,
      }),
    }),

    'styleSegmentOrange': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#ff8000",
        width: 4,
      }),
    }),

    'styleSegmentRouge': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#f00",
        width: 4,
      }),
    }),

    'selected': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#03224c",
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 2,
        }),
      }),
    }),

    'invisible': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: "#0000",
        }),
        stroke: new ol.style.Stroke({
          color: "#0000",
          width: 0,
        }),
      }),
    }),
  };

  // Permet de définir les différentes légendes
  parcoursLayer.legend = {
    items: [
      {
        label: global.title,
        geometry: global.style.geometry,
        styles: [
          style["styleCircuit"],
        ],
      },
      /*{
        label: "Dénivelé de la pente entre 0% et 1%",
        geometry: global.style.geometry,
        styles: [
          style["styleSegmentBleu"],
        ],
      },
      {
        label: "Dénivelé de la pente entre 1% et 2%",
        geometry: global.style.geometry,
        styles: [
          style["styleSegmentVert"],
        ],
      },
      {
        label: "Dénivelé de la pente entre 2% et 3%",
        geometry: global.style.geometry,
        styles: [
          style["styleSegmentOrange"],
        ],
      },
      {
        label: "Dénivelé de la pente supérieur à 3%",
        geometry: global.style.geometry,
        styles: [
          style["styleSegmentRouge"],
        ],
      },*/
    ],
  };

  // Permet de réutiliser les features plus tard
  const vectorSource = new ol.source.Vector({
    url: parcoursLayer.urlData,
    format: new ol.format.GPX(),
  });
  
  var vector = new ol.layer.Vector({
    source: vectorSource,
    style: style["styleCircuit"]
  });

  const vectorPoint = new ol.layer.Vector({
    style: style["invisible"]
  });

  const sourceP = new ol.source.Vector();

  /*
  const vectorPointKilometre = new ol.layer.Vector({
    style: style["invisible"]
  });

  var sourcePointKilometre = new ol.source.Vector();
  */

  const vectorSegment = new ol.layer.Vector({
  });

  var sourceSegment = new ol.source.Vector();

  // Fonction permettant de créer des features
  var _creaFeature = function () {
    let features = vectorSource.getFeatures();
    let coordinates = features[0].getGeometry().getCoordinates()[0];
    var finalData = [];
    var listePoint = [];
    var distance = 0;

    var previousPoint;

    for (let i = 0; i < coordinates.length; i++) {
      // Initialisation du tableau contenant les données du point actuel
      var DataCoord = [];

      // Récupération des données du point actuel
      var featureX = coordinates[i][0];
      var featureY = coordinates[i][1];
      var featureZ = coordinates[i][2];
      var featureT = coordinates[i][3];

      listePoint.push(DataCoord); // Liste de tous les points

      // Création d'une feature par point
      var point = new ol.Feature({
        geometry: new ol.geom.Point([featureX,featureY,featureZ,featureT]),
        properties: {
          id: i
        }
      });
  
      sourceP.addFeature(point);

      // On test si c'est le premier nombre
      if (i === 0) {
        finalData[i] = [distance, point]; // Si oui, on lui ajoute la distance par défaut (0) et son dénivelé dans le tableau finalData
        point.set('distance', distance);
      } else { // Sinon
        var distanceCalc = _distanceBtwPoint(previousPoint, point); // Calcul de la distance entre le point actuel et le précédent
        distance += distanceCalc; // Ajout de la distance calculée à une variable totale
        finalData[i] = [distance, point]; // Ajout de la distance calculée et du dénivelé dans le tableau finalData
        point.set('distance', distance);
      }
      previousPoint = point;
    };

    vectorPoint.setSource(sourceP);
    mviewer.getMap().addLayer(vectorPoint);

    vectorSegment.setSource(sourceSegment);
    mviewer.getMap().addLayer(vectorSegment);

    /*
    vectorPointKilometre.setSource(sourcePointKilometre);
    mviewer.getMap().addLayer(vectorPointKilometre);
    */

    dataGraph = _addGraph(finalData);
    _addPointKilometre(finalData);
  };

  // Fonction qui calcule une distance (en mètre) entre deux points
  var _distanceBtwPoint = function (p1, p2) {
    
    // On commence par définir la projection EPSG:32632 ( UTM )
    const epsg32632 = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs';

    // Ensuite, on charge la projection
    proj4.defs(epsg32632);

    // On convertit les coordonnées EPSG:3857 en UTM
    let point1_utm = proj4('EPSG:3857', epsg32632, p1.getGeometry().getCoordinates());
    let point2_utm = proj4('EPSG:3857', epsg32632, p2.getGeometry().getCoordinates());

    // On créer une localisation pour les deux points
    let location_pt1 = [point1_utm[0], point1_utm[1]];
    let location_pt2 = [point2_utm[0], point2_utm[1]];

    // On créer une ligne utilisant les deux localisations précédentes afin de calculer la distance de celle-ci
    var line = new ol.geom.LineString([location_pt1 , location_pt2]);

    var coordPoint1 = p1.getGeometry().getCoordinates();
    var coordPoint2 = p2.getGeometry().getCoordinates();

    var XYcoordPoint1 = [coordPoint1[0], coordPoint1[1]];
    var XYcoordPoint2 = [coordPoint2[0], coordPoint2[1]];

    var segment = new ol.geom.LineString([XYcoordPoint1, XYcoordPoint2]);

    // Calcul de la distance de la ligne
    var distance = Math.round(line.getLength());

    // Calcul du dénivelé d'un segment
    //var nivDenivele = (_calculDenivele(coordPoint1, coordPoint2, distance)).toFixed(1);

    var segmentFeature;

    /*
    if(0 < nivDenivele && nivDenivele < 1) {
      segmentFeature = new ol.Feature({
        geometry: segment
      });
      segmentFeature.setStyle(style["styleSegmentBleu"]);
    } else if (1 < nivDenivele && nivDenivele < 2) {
      segmentFeature = new ol.Feature({
        geometry: segment
      });
      segmentFeature.setStyle(style["styleSegmentVert"]);
    } else if (2 < nivDenivele && nivDenivele < 3) {
      segmentFeature = new ol.Feature({
        geometry: segment
      });
      segmentFeature.setStyle(style["styleSegmentOrange"]);
    } else {
      segmentFeature = new ol.Feature({
        geometry: segment
      });
      segmentFeature.setStyle(style["styleSegmentRouge"]);
    }

    console.log(segmentFeature);
    */

    segmentFeature = new ol.Feature({
      geometry: segment,
      properties: {
        id: valueId
      }
    });

    valueId += 1;

    segmentFeature.setStyle(style["default"]);

    sourceSegment.addFeature(segmentFeature);
    
    return distance;
  };

  var _addPointKilometre = (pointData) => {
    var maxDistance = 1000;
    var distanceManquante = null;

    for(let i = 0; i < (pointData.length - 1); i++) {
      var distancePoint = pointData[i][0];
      var distancePointAfter = pointData[i + 1][0];

      if(distancePointAfter > maxDistance) {
        distanceManquante = maxDistance - distancePoint;
        console.log(distanceManquante);
        maxDistance += 1000;
      }
    }
    
  }

  var _calculDenivele = (coordPoint1, coordPoint2, distance) => {
    var zPoint1 = coordPoint1[2];
    var zPoint2 = coordPoint2[2];
    var denivele = null;
    var pente = null;

    if (zPoint2 > zPoint1) {
      denivele = zPoint2 - zPoint1;
    } else {
      denivele = zPoint1 - zPoint2;
    }

    pente = ( denivele / distance ) * 100;

    return pente;
  }

  // verticalLine plugin 
  const verticalLine = {
    id: "verticalLine",
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx, tooltip, chartArea: { top, bottom, left, right, width, heigth }, scales: {x, y}} = chart;
      var xCoord = null;

      if (chart.tooltip?._active?.length) {
        xCoord = x.getPixelForValue(tooltip.dataPoints[0].parsed.x);
        //console.log(xCoord);
      } else {
        xCoord = x.getPixelForValue(mviewer.pointHover / 1000); // Petite correction à effectuer !
        //console.log(xCoord);
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

  // Fonction permettant d'ajouter le graph sur la map
  var _addGraph = function (data) {
    // constants
    const defaultPointColor = global.style.color;
    const defaultRadiusValue = 2.5;
    const hoverPointColor = "black"; // à rendre global
    const hoverPointRadius = 8; // à rendre global

    data.forEach(function (tab) {
      d.push(tab[0]/1000); // Permet d'avoir en km
      z.push(tab[1].getGeometry().getCoordinates()[2]);
    });

    // On définit une valeur maximum pour que les données du graphique prennent toutes la place
    const maxValeur = d[d.length - 1];

    // Création de la couleur et de la taille pour chaque point
    for (let i = 0; i < d.length; i++) {
      color.push(global.style.color);
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
          borderColor: global.style.color,
          fill: true,
          /*pointStyle: function(ctx) {
            // si pas de graph alors on ne passe pas dans le bloc
            if(!trackLineChart) return;

            // sinon on execute le reste
            if(ctx.dataIndex === mviewer.pointHover) {
              trackLineChart.data.datasets[0].pointBackgroundColor[ctx.dataIndex] = hoverPointColor;
              trackLineChart.data.datasets[0].pointRadius[ctx.dataIndex] = hoverPointRadius;
            } else {
              trackLineChart.data.datasets[0].pointBackgroundColor[ctx.dataIndex] = defaultPointColor;
              trackLineChart.data.datasets[0].pointRadius[ctx.dataIndex] = defaultRadiusValue;
            }
            // si on veut mettre tout le bloc en une ligne : 
            // trackLineChart.data.datasets[0]["pointBackgroundColor"][ctx.dataIndex] = trackLineChart && (ctx.dataIndex === mviewer.pointHover) ? "black" : "red"
          },*/
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

              if (pointId == carteId) {
                elt.setStyle(style["selected"]);
                segment.forEach(function(seg) {
                  var segmentId = seg.getProperties().properties.id;

                  if (segmentId < pointId) {
                    seg.setStyle(style["selectedSegment"]);
                  } else {
                    seg.setStyle(style["default"]);
                  }
                });
              } else {
                elt.setStyle(style["invisible"]);
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
  
  mviewer.processLayer(parcoursLayer, vector);
  mviewer.addLayer(parcoursLayer); // setVisible(true) => n'ajoute pas la légende

  var _initTool = function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      
      var feature = source.getFeatures();

      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 3000, // Permet de définir le temps de l'animation en ms
        maxZoom: 13.75 // Permet de définir le zoom quand on charge la page
      });
      _creaFeature();

      /*********** Détecter les features sur la map ***********/
      var map = mviewer.getMap();
      map.on("pointermove", function(event) {
        var pixel = event.pixel;
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          var propsId = null;

          if(!feature) return;

          if (layer === vectorPoint) {
            propsDistance = feature.getProperties().distance;
            propsId = feature.getProperties().properties.id;
            var segment = vectorSegment.getSource().getFeatures();
            mviewer.pointHover = propsDistance;

            segment.forEach(function(seg) {
              var segmentId = seg.getProperties().properties.id;

              if(propsId > segmentId) {
                feature.setStyle(style["selected"]);
                seg.setStyle(style["selectedSegment"]);
              } else {
                feature.setStyle(style["invisible"]);
                seg.setStyle(style["default"]);
              }
            });
            dataGraph.update();
          }
        });
      });
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);