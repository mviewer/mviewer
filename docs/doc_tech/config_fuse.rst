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

Il est nécessaire de créer un fichier javascript pour utiliser la recherche Fuse. La donnée apparaît sur la carte au format vectoriel.


Ce fichier devra :

* son nom et le nom de la variable déclarée au début être le même que le nom de la couche
* la donnée issue de la requête WFS devra être dans la même projection que le mviewer (ici 4326)
* le style de la couche s'appuie sur openLayer (https://openlayers.org/workshop/fr/vector/style.html)

Exemples de fichiers javascript
------------------------------

Voici un premier exemple de fichier javascript pour une donnée ponctuelle (fichier auto_ecole.js)

.. code-block:: bash

    {
    mviewer.customLayers.auto_ecole = {};
    var auto_ecole = mviewer.customLayers.auto_ecole; 

    // Génération de la liste des légendes
    auto_ecole.legend = {items: [{
            geometry: "Point",
            label: "Auto Ecole",
            styles: [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: "#ff2a00"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ff2a00",
                        width: 4
                    }),
                    radius: 4
                })
            })]
        }]
    };
        
    // Appel de la source de donnée (attention à la projection) et affichage du style sur la carte
    mviewer.customLayers.auto_ecole.layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: "https://geobretagne.fr/geoserver/dreal_b/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=auto_ecole&outputFormat=application/json&srsName=EPSG:4326",
                format: new ol.format.GeoJSON()
            }),
            style: function(feature, resolution) {
                return auto_ecole.legend.items[0].styles;
            }
    });
    mviewer.customLayers.auto_ecole.handle = false;
    }

Un deuxième sur une donnée linéaire avec analyse sur enjeu biologique (bief.js)

.. code-block:: bash

	{
	mviewer.customLayers.bief = {};
	var bief = mviewer.customLayers.bief;

	bief.legend = { items: [
	    {
		label: "Enjeu bio. modéré",
		geometry: "LineString",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(129, 236, 236,1.0)', width: 4 })
		})]
	    },
	    {
		label: "Enjeu bio. élevé",
		geometry: "LineString",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(0, 206, 201,1.0)', width: 4 })
		})]
	    },
	    {
		label: "Enjeu bio. très élevé",
		geometry: "LineString",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(250, 177, 160,1.0)', width: 4 })
		})]
	    },
	    {
		label: "Enjeu bio. majeur",
		geometry: "LineString",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(225, 112, 85,1.0)', width: 4 })
		})]
	    },
	    {
		label: "Enjeu bio. inconnu",
		geometry: "LineString",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(255, 234, 167,1.0)', width: 4 })
		})]
	    }
	] };

	mviewer.customLayers.bief.layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		    url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=bief&outputFormat=application/json&srsName=EPSG:4326",
		    format: new ol.format.GeoJSON()
		}),
		style: function(feature, resolution) {
		    var stl;            
		    if (feature.get('enjeu_bio')) {           
			switch (feature.get('enjeu_bio')) {
			    case "modéré":
				stl = bief.legend.items[0].styles;
				break;
			    case "élevé":
				stl = bief.legend.items[1].styles;
				break;
			    case "très élevé":
				stl = bief.legend.items[2].styles;
				break;
			    case "majeur":
				stl = bief.legend.items[3].styles;
				break;        
			    default:
				stl = bief.legend.items[1].styles;
			}
		    }            
		    return stl;
		}
	});
	mviewer.customLayers.bief.handle = false;
	}


Un troisième sur un polygone avec analyse sur l'identifiant de parc (pnr.js)

.. code-block:: bash

	{
	mviewer.customLayers.pnr = {};
	var pnr = mviewer.customLayers.pnr;

	pnr.legend = { items: [
	    {
		label: "PNR d'Armorique",
		geometry: "Polygon",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(248, 194, 145,1.0)', width: 3 }),
		    fill: new ol.style.Fill({ color: 'rgba(248, 194, 145,.7)'})
		})]
	    },
	    {
		label: "PNR du golfe du Morbihan",
		geometry: "Polygon",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(246, 185, 59,1.0)', width: 3 }),
		    fill: new ol.style.Fill({ color: 'rgba(246, 185, 59,0.7)'})
		})]
	    },    
	    {
		label: "Projet",
		geometry: "Polygon",
		styles: [new ol.style.Style({
		    stroke: new ol.style.Stroke({ color: 'rgba(229, 80, 57,1.0)', width: 3 }),
		    fill: new ol.style.Fill({ color: 'rgba(229, 80, 57,0.7)'})
		})]
	    }
	] };

	mviewer.customLayers.pnr.layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		    url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=parc_naturel_regional&outputFormat=application/json&srsName=EPSG:4326",
		    format: new ol.format.GeoJSON()
		}),
		style: function(feature, resolution) {
		    var stl;            
		    if (feature.get('pnr_ident')) {                
			switch (feature.get('pnr_ident')) {
			    case "1":
				stl = pnr.legend.items[0].styles;
				break;
			    case "2":
				stl = pnr.legend.items[1].styles;
				break;                    
			    default:
				stl = pnr.legend.items[2].styles;
			}
		    }            
		    return stl;
		}
	});
	mviewer.customLayers.pnr.handle = false;
	}
		
Un dernier exemple sur un polygone avec analyse un champ numérique

.. code-block:: bash

	{
	// Définition des variables.
	mviewer.customLayers.indice_position_sociale_ecole = {};
	var data = mviewer.customLayers.indice_position_sociale_ecole;

	data.legend = { items: [
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


	data.layer = new ol.layer.Vector({
		source: new ol.source.Vector({
		    url: "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GETFEATURE&TYPENAME=indice_position_sociale_ecole&outputFormat=application/json&srsName=EPSG:4326",
		    format: new ol.format.GeoJSON()
		}),
		style: function(feature, resolution) {
		    var stl;
		    if (feature.get('ips') < 80){
			stl = data.legend.items[0].styles;
				}
		    else if (feature.get('ips') >= 80 && feature.get('ips') < 100 ){
			stl = data.legend.items[1].styles;
				}
		    else if (feature.get('ips') >= 100 && feature.get('ips') < 120 ){
			stl = data.legend.items[2].styles;
		    }
		    else if (feature.get('ips') >= 120 ){
			stl = data.legend.items[3].styles;
		    }
		    return stl;
		}
	});
	data.handle = false;
	}
		
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
* ``fusesearchthreshold`` : optionnel, cette valeur permet de préciser si la recherche doit retourner des résultat très proches de la saisie (0) ou tout mot ou partie de mot qui correspond (1)
