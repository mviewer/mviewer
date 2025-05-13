.. Authors : 
.. mviewer team

.. _configfuse:

Configurer - Une recherche Fuse
===============================

Présentation de Fuse
--------------------

Fuse permet de rechercher une entité dans la barre de recherche sans installer de solution lourde. Il est adapté à un nombre limité d'entités.


Création du fichier javascript
------------------------------

Il est nécessaire de créer un fichier JavaScript pour utiliser la recherche Fuse. La donnée apparaît sur la carte au format vectoriel.


Dans ce fichier :

* son nom et le nom de la variable déclarée au début devront être identiques au nom de la couche
* la donnée issue de la requête WFS devra être dans la même projection que le mviewer (ici 4326)
* le style de la couche s'appuie sur OpenLayers (https://openlayers.org/workshop/fr/vector/style.html)

Exemples de fichiers javascript
------------------------------

Voici un premier exemple de fichier JavaScript pour une donnée ponctuelle avec analyse thématique (fichier lycee.js)

.. code-block:: bash

	{
	// Définition des variables realtives à la couche.
	  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
	  const WORKSPACE = "rb";
	  const LAYER = "lycee";
	  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
	// Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier javascript.
	  const LAYER_ID = "lycee";

	// Style des entités.
	  const legend = {
		items: [
		  {
			label: "Lycée public",
			geometry: "Point",
			styles: [
			  new ol.style.Style({
				image: new ol.style.Circle({
				  fill: new ol.style.Fill({
					color: "rgba(255, 118, 117,1.0)",
				  }),
				  stroke: new ol.style.Stroke({
					color: "#ffffff",
					width: 4,
				  }),
				  radius: 9,
				}),
			  }),
			],
		  },
		  {
			label: "Lycée privé",
			geometry: "Point",
			styles: [
			  new ol.style.Style({
				image: new ol.style.Circle({
				  fill: new ol.style.Fill({
					color: "rgba(99, 110, 114,1.0)",
				  }),
				  stroke: new ol.style.Stroke({
					color: "#ffffff",
					width: 4,
				  }),
				  radius: 9,
				}),
			  }),
			],
		  },
		],
	  };

	//Appel de la donnée
	  const layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		  url: LAYER_URL,
		  format: new ol.format.GeoJSON(),
		}),
	//Analyse thématique ici sur l'attribut secteur_li
		style: function (feature, resolution) {
		  var stl;
		  if (feature.get("secteur_li")) {
			switch (feature.get("secteur_li")) {
			  case "Public":
				stl = legend.items[0].styles;
				break;
			  case "Privé sous contrat avec l'éducation nationale":
				stl = legend.items[1].styles;
				break;
			}
		  }
		  return stl;
		},
	  });
	  handle = false;
	  new CustomLayer(LAYER_ID, layer, legend);
	}

Un deuxième sur une donnée linéaire avec analyse sur enjeu biologique (bief.js)

.. code-block:: bash

	{
	// Définition des variables realtives à la couche.
	  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
	  const WORKSPACE = "rb";
	  const LAYER = "bief";
	  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
	// Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier javascript.
	  const LAYER_ID = "bief";

	// Style des entités
	  const legend = {
		items: [
		  {
			label: "Enjeu bio. modéré",
			geometry: "LineString",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(129, 236, 236,1.0)", width: 4 }),
			  }),
			],
		  },
		  {
			label: "Enjeu bio. élevé",
			geometry: "LineString",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(0, 206, 201,1.0)", width: 4 }),
			  }),
			],
		  },
		  {
			label: "Enjeu bio. très élevé",
			geometry: "LineString",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(250, 177, 160,1.0)", width: 4 }),
			  }),
			],
		  },
		  {
			label: "Enjeu bio. majeur",
			geometry: "LineString",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(225, 112, 85,1.0)", width: 4 }),
			  }),
			],
		  },
		  {
			label: "Enjeu bio. inconnu",
			geometry: "LineString",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(255, 234, 167,1.0)", width: 4 }),
			  }),
			],
		  },
		],
	  };

	//Appel de la donnée
	  const layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		  url: LAYER_URL,
		  format: new ol.format.GeoJSON(),
		}),
		//Analyse thématique ici sur l'attribut enjeu_bio
		style: function (feature, resolution) {
		  var stl;
		  if (feature.get("enjeu_bio")) {
			switch (feature.get("enjeu_bio")) {
			  case "modéré":
				stl = legend.items[0].styles;
				break;
			  case "élevé":
				stl = legend.items[1].styles;
				break;
			  case "très élevé":
				stl = legend.items[2].styles;
				break;
			  case "majeur":
				stl = legend.items[3].styles;
				break;
			}
		  }
		  return stl;
		},
	  });
	  handle = false;
	  new CustomLayer(LAYER_ID, layer, legend);
	};

Un troisième sur un polygone sans analyse thématique (pnr.js)

.. code-block:: bash

	{
	// Définition des constantes liées à la couche GeoServer
	  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
	  const WORKSPACE = "rb";
	  const LAYER = "parc_naturel_regional";
	  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
	// Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier javascript.
	  const LAYER_ID = "pnr";

	// Style des entités
	  const legend = {
		items: [
		  {
			label: "PNR",
			geometry: "Polygon",
			styles: [
			  new ol.style.Style({
				stroke: new ol.style.Stroke({ color: "rgba(246, 185, 59,1.0)", width: 3 }),
				fill: new ol.style.Fill({ color: "rgba(246, 185, 59,0.7)" }),
			  }),
			],
		  },
		],
	  };

	//Appel de la donnée projection 4326
	  const layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		  url: LAYER_URL,
		  format: new ol.format.GeoJSON(),
		}),
		//Analyse thématique
		style: function (feature, resolution) {
		  return legend.items[0].styles;
		},
	  });
	  handle = false;
	  new CustomLayer(LAYER_ID, layer, legend);
	};
		
Un dernier exemple sur un polygone avec analyse un champ numérique

.. code-block:: bash

	{
	// Définition des variables relatives à la couche.
	  const GEOSERVER_URL = "https://ows.region-bretagne.fr/geoserver";
	  const WORKSPACE = "rb";
	  const LAYER = "indice_position_sociale_ecole";
	  const LAYER_URL = `${GEOSERVER_URL}/${WORKSPACE}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=${LAYER}&outputFormat=application/json&srsName=EPSG:4326`;
	// Définition de la variable customlayer. Elle doit être unique et correspond au nom du fichier javascript.
	  const LAYER_ID = "indice_position_sociale_ecole";

	// Style des entités.
	  const legend = { items: [
		{
			label: "Moins de 80",
			geometry: "Point",
			styles: [new ol.style.Style({
				image: new ol.style.Circle({
			fill: new ol.style.Fill({
				color: '#B1252E'
			}),
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 3
			}),
			radius: 7
			})
		})]
		},
		{
			label: "Entre 80 et 100",
			geometry: "Point",
			styles: [new ol.style.Style({
				image: new ol.style.Circle({
			fill: new ol.style.Fill({
				color: '#C28B7E'
			}),
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 3
			}),
			radius: 7
			})
		})]
		},
		{
			label: "Entre 100 et 120",
			geometry: "Point",
			styles: [new ol.style.Style({
				image: new ol.style.Circle({
			fill: new ol.style.Fill({
				color: '#A6B4DA'
			}),
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 3
			}),
			radius: 7
			})
		})]
		},
		{
			label: "Plus de 120",
			geometry: "Point",
			styles: [new ol.style.Style({
				image: new ol.style.Circle({
			fill: new ol.style.Fill({
				color: '#4C75B6'
			}),
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 3
			}),
			radius: 7
			})
		})]
		}
	]};	

	//Appel de la donnée
	  const layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		  url: LAYER_URL,
		  format: new ol.format.GeoJSON(),
		}),
	//Analyse thématique ici sur l'attribut secteur_li
			style: function(feature, resolution) {
				var stl;
				if (feature.get('ips') < 80){
					stl = legend.items[0].styles;
				}
				else if (feature.get('ips') >= 80 && feature.get('ips') < 100 ){
					stl = legend.items[1].styles;
				}
				else if (feature.get('ips') >= 100 && feature.get('ips') < 120 ){
					stl = legend.items[2].styles;
				}
				else if (feature.get('ips') >= 120 ){
					stl = legend.items[3].styles;
				}
				return stl;
			}
	  });
	  handle = false;
	  new CustomLayer(LAYER_ID, layer, legend);
	};
		
Configuration dans le XML
-------------------------

Au niveau du fichier de configuration mviewer, il est nécessaire de faire les adaptations suivantes au niveau de la couche :

.. code-block:: bash

    type="customlayer" vectorlegend="true" url="https://geobretagne.fr/pub/mviewer-formation/exemples/customlayers/auto_ecole.js" 
    searchable="true" searchengine="fuse" fusesearchkeys="NOM" fusesearchresult="{{NOM}} - {{TYPE}}" fusesearchthreshold="0.5"

* ``type`` : mettre customlayer
* ``vectorlegend`` : activer l'affichage de la légende saisie dans le fichier javascript
* ``url`` : url du fichier javascript
* ``searchable`` : activer la recherche
* ``searchengine`` : activer le mode de recherche fuse
* ``fusesearchkeys`` : champ dans lequel on va effectuer la recherche. Possible sur plusieurs champs (exemple : "NOM,TYPE")
* ``fusesearchresult`` : expression d'affichage du résultat de la recherche
* ``fusesearchthreshold`` : optionnel, cette valeur permet de préciser si la recherche doit retourner des résultats très proches de la saisie (0) ou tout mot ou partie de mot qui correspond (1)
