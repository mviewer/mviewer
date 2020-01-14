.. Authors : 
.. mviewer team

.. _configfuse:

Configurer - Une recherche Fuse
===========================================================

Présentation de Fuse
-----------

Fuse permet de rechercher une entité dans la barre de recherche sans installer de solution lourde. Il est adapté à un nombre limité d'entités.


Création du fichier javascript
--------------------

Il est nécessaire de créer un fichier javascript pour utiliser la recherche Fuse. La donnée apparaît sur la carte au format vectoriel.


Ce fichier devra :

* porter le même nom que le nom de la couche
* la source de donnée devra être dans la même projection que le mviewer (ici4326)
* le style de la couche s'appuie sur openLayer (https://openlayers.org/workshop/fr/vector/style.html)


Voici un exemple de fichier javascript pour une donnée ponctuelle (fichier auto_ecole.js)

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
        
    // Appel de la source de donnée et affichage du style sur la carte
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
        
Vous trouverez d'autres exemples `ici <https://github.com/geobretagne/mviewer/commit/001b7d79f3772c1a99cbdf98f1030e12f913e2a0>`_ 
		
Configuration dans le XML
------------------------------------

Au niveau du fichier de configuration mviewer, il est nécessaire de faire les adaptations suivantes au niveau de la couche :

.. code-block:: bash

    type="customlayer" vectorlegend="true" url="https://geobretagne.fr/pub/mviewer-formation/exemples/customlayers/auto_ecole.js" 
    searchable="true" searchengine="fuse" fusesearchkeys="NOM" fusesearchresult="{{NOM}} - {{TYPE}}"

* ``type`` : mettre customlayer
* ``vectorlegend`` : activer l'affichage de la légende saisie dans le fichier javascript
* ``url`` : url du fichier javascript
* ``searchable`` : activer la recherche
* ``searchengine`` : activer le mode de recherche fuse
* ``fusesearchkeys`` : champ dans lequel on va effectuer la recherche
* ``fusesearchresult`` : expression d'affichage du résultat de la recherche

