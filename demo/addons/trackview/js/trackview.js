var trackview = (function () {

  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;
  var d = [];
  var z = [];

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

    'stylePoint': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: "#000",
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 2,
        }),
      }),
    }),

    'selected': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#000",
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 2,
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
      {
        label: "Points du circuit",
        geometry: "Point",
        styles: [
          style["stylePoint"],
        ],
      },
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
    style: style["stylePoint"]
  });

  const sourceP = new ol.source.Vector();

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
      var featureId = i;
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
      } else { // Sinon
        var distanceCalc = _distanceBtwPoint(point, previousPoint); // Calcul de la distance entre le point actuel et le précédent
        distance += distanceCalc; // Ajout de la distance calculée à une variable totale
        finalData[i] = [distance, point]; // Ajout de la distance calculée et du dénivelé dans le tableau finalData
      }
      previousPoint = point;
    };

    vectorPoint.setSource(sourceP);
    mviewer.getMap().addLayer(vectorPoint);

    _addGraph(finalData);
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

    // Calcul de la distance de la ligne
    var distance = Math.round(line.getLength());
    
    return distance;
  };

  // Fonction permettant d'ajouter le graph sur la map
  var _addGraph = function (data) {
    data.forEach(function (tab) {
      d.push(tab[0]/1000); // Permet d'avoir en km
      z.push(tab[1].getGeometry().getCoordinates()[2]);
    });

    // On définit une valeur maximum pour que les données du graphique prennent toutes la place
    const maxValeur = d[d.length - 1];

    var monGraph = new Chart(document.getElementById("trackview-panel"), {
      type: global.style.graph.type,
      data: {
        labels: d,
        datasets: [{ 
            data: z,
            label: global.stats.name,
            borderColor: global.style.color,
            fill: true
          },
        ],
      },
      options: {
        onHover: (event) => {
          var points = monGraph.getElementsAtEventForMode(event, 'nearest', { intersect: false });

          if (points.length) {
            var pointId = points[0].index;
            vectorPoint.getSource().getFeatures().forEach(function (elt) {
              var carteId = elt.getProperties().properties.id;
              if (pointId >= carteId) {
                elt.setStyle(style["selected"]);
              } else {
                elt.setStyle(style["stylePoint"]);
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
      },
    });
  };
  
  mviewer.processLayer(parcoursLayer, vector);
  mviewer.addLayer(parcoursLayer); // setVisible(true) => n'ajoute pas la légende

  var _initTool = function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      
      var feature = source.getFeatures();

      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 4000, // Permet de définir le temps de l'animation en ms
        maxZoom: 14
      });
      _creaFeature();
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);