var trackview = (function () {

  var global = mviewer.customComponents.trackview.config.options.mviewer.parcours.parc;

  // Creation du layer mviewer
  var parcoursLayer= {
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
  
  // Permet de définir la légende
  const style = {
    'styleCircuit': new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: global.style.color,
        width: global.style.width,
      }),
    }),
  };

  // Permet de réutiliser les features plus tard
  const vectorSource = new ol.source.Vector({
    url: parcoursLayer.urlData,
    format: new ol.format.GPX(),
  });
  
  var vector = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature) {
      return style["styleCircuit"];
    },
  });

  parcoursLayer.legend = {
    items: [
      {
        label: global.title,
        geometry: global.style.geometry,
        styles: [
          style["styleCircuit"],
        ],
      },
    ],
  };

  var _addGraph = function () {
    let features = vectorSource.getFeatures();
    let coordinates = features[0].getGeometry().getCoordinates()[0];
    //let feature = [] ; // Optionnel
    let featureListId = [] ;
    let featureListNiv = [] ;
    var TabFeature = [] ;

    for (let i = 0; i < coordinates.length; i++) {
      // Initialisation du tableau contenant les données du point actuel
      var DataCoord = [] ;

      // Récupération des données du point actuel
      var featureId = i ;
      var featureX = coordinates[i][0] ;
      var featureY = coordinates[i][1] ;
      var featureZ = coordinates[i][2] ;
      var featureT = coordinates[i][3] ;

      // On stock les données du point actuel
      DataCoord.push(featureX, featureY, featureZ, featureT);

      // On ajoute chaque point dans le tableau permettant de le réutiliser plus tard
      TabFeature.push(DataCoord);

      featureListId.push(featureId) ; // Liste des id de chaque point
      featureListNiv.push(featureZ) ; // Liste des 'z' soit du niveau de dénivelé
      //feature.push("Id :",featureId, "x :",featureX, "y :",featureY, "z :",featureZ, "Time :",featureT) ; // Optionnel
    };
    new Chart(document.getElementById("trackview-panel"), {
      type: 'line',
      data: {
        labels: featureListId,
        datasets: [{ 
            data: featureListNiv,
            label: "Dénivelé du " + global.stats.name,
            borderColor: global.style.color,
            fill: true
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Ne fonctionne pas :("
        },
      },
    });
    return TabFeature ;
  };

  var _creaFeature = function (data) {
    // On récupère la liste de tableaux créée dans la fonction '_addGraph' + initialisation d'un tableau qui contiendra les features
    var FeaturesData = data;
    var PointData = [];
    // On va maintenant créer une nouvelle feature pour chaque 'point' / coordonnées
    FeaturesData.forEach(coord => {
      var point = new ol.Feature(
        new ol.geom.Point(coord)
      );
      /*
      // On récupère le time
      const time = coord[3];
      // On formate le time ( il est divisé par 1000 dans un fichier js )
      const timeFormate = time * 1000;
      */
      // On stock nos features (points) dans un tableau
      PointData.push(point);
    });
    return PointData;
  };

  var _distanceBtwPoint = function (Points) {
    var listePoints = Points;
    var distanceBtwPoint = [];

    for (let elt = 0; elt < ((listePoints.length) -1); elt++) {
      // On comment par définir la projection EPSG:32632 ( UTM )
      const epsg32632 = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs';

      // Ensuite, on charge la projection
      proj4.defs(epsg32632);

      // On récupère les coordonnées d'un premier point et du point suivant
      let point_1 = listePoints[elt].getGeometry().getCoordinates();
      let point_2 = listePoints[elt + 1].getGeometry().getCoordinates();

      // On convertit les coordonnées EPSG:3857 en UTM
      let point1_utm = proj4('EPSG:3857', epsg32632, point_1);
      let point2_utm = proj4('EPSG:3857', epsg32632, point_2);

      // On créer une localisation pour les deux points
      let location_pt1 = [point1_utm[0], point1_utm[1]];
      let location_pt2 = [point2_utm[0], point2_utm[1]];

      var line = new ol.geom.LineString([location_pt2 , location_pt1]);

      var distance = Math.round(line.getLength());

      //var distance = point_1.distanceTo(point_2);

      distanceBtwPoint.push(distance);
    };
    let distanceBtwPointTotal = 0;

    for (let i = 0; i < distanceBtwPoint.length; i++) {
      distanceBtwPointTotal += distanceBtwPoint[i];
    }

    console.log(distanceBtwPoint);
    console.log("Distance total : " + distanceBtwPointTotal + " m");
    return distanceBtwPoint;
  };
  
  mviewer.processLayer(parcoursLayer, vector);
  mviewer.addLayer(parcoursLayer); // setVisible(true) => n'ajoute pas la légende

  var _initTool= function () {
    console.log("Initialisation de l'outil"); // Affichage dans les logs

    mviewer.getMap().once("rendercomplete", function (e) {
      var source = vector.getSource();
      console.log(source); // Affichage dans les logs
      var feature = source.getFeatures();
      console.log(feature); // Affichage dans les logs
      mviewer.getMap().getView().fit(feature[0].getGeometry().getExtent(), {
        duration: 3000, // Permet de définir le temps de l'animation en ms
      });
      // Permet d'éviter un double appel de fonction
      var data = _addGraph();
      var points =_creaFeature(data);
      _distanceBtwPoint(points)
    });
  };

return {
  init: _initTool,
};
})();

new CustomComponent("trackview", trackview.init);