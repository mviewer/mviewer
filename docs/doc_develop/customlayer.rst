.. Authors :
.. mviewer team

.. _customlayer:


Développer un customLayer
#########################

.. image:: ../_images/develop/customlayer.png
              :alt: Exemple de customlayer
              :align: center

L'ojectif est ici de créer une couche personnalisée de type ``heatmap`` à partir d'un fichier **KML** en utilisant la librairie ``Openlayers`` et en s'inspirant de cet `exemple. <https://openlayers.org/en/latest/examples/heatmap-earthquakes.html>`_  Avant tout, il faut préparer la structure de fichiers qui convient.

.. sidebar:: Créez un répertoire avec :

    - fichier image pour la légende
    - fichier de configuration
    - fichier customlayer
    - les données


::

    / demo
    │
    ├── heatmap
    │      │
    │      ├── config.xml
    │      ├── customlayer.js
    │      ├── legend.png
    │      ├── data
    │      │     ├── 2012_Earthquakes_Mag5.kml
    |



L'exemple complet est disponible sur `github. <https://github.com/geobretagne/mviewer/tree/develop/demo/heatmap>`_


Ecrire le customLayer
*********************

.. Tip::
   L'ancienne méthode fonctionne toujours mais est plus verbeuse que la nouvelle. Les 3 lignes mises en surbrillance sont remplacées par une seule ligne,
   également mise en surbrillance, dans la nouvelle version.


Ancienne méthode
==================


.. code-block:: javascript
    :caption: customlayer.js
    :linenos:
    :emphasize-lines: 2,4,22

    //Layerid is the same than the layerid in config.xml
    const layerid = "heatmap";
    //Create customlayer object
    mviewer.customLayers[layerid] = {};
    //Create Openlayers heatmap layer
    const layer = new ol.layer.Heatmap({
        source: new ol.source.Vector({
            url: 'demo/heatmap/data/2012_Earthquakes_Mag5.kml',
            format: new ol.format.KML({
                extractStyles: false
            })
        }),
        blur: 10,
        radius: 10,
        weight: function(feature) {
            var name = feature.get('name');
            var magnitude = parseFloat(name.substr(2));
            return magnitude - 5;
        }
    });
    // Set the openlayers layer to the customLayer object layer
    mviewer.customLayers[layerid].layer = layer;



Nouvelle méthode
==================

Depuis la version **3.2** de mviewer, une classe ``CustomLayer`` a été développée afin de faciliter la saisie de nouveaux customLayers

.. code-block:: javascript
    :caption: customlayer.js
    :linenos:
    :emphasize-lines: 16

    const layer = new ol.layer.Heatmap({
        source: new ol.source.Vector({
            url: 'demo/heatmap/data/2012_Earthquakes_Mag5.kml',
            format: new ol.format.KML({
                extractStyles: false
            })
        }),
        blur: 10,
        radius: 10,
        weight: function(feature) {
            var name = feature.get('name');
            var magnitude = parseFloat(name.substr(2));
            return magnitude - 5;
        }
    });
    new CustomLayer('heatmap', layer);


Ecrire le config.xml
*********************

Dans le fichier de configuration, il faut reprendre l'id du customlayer ``id="heatmap"``,  préciser ``type="customlayer"`` ainsi que l'URL du fichier ``url="demo/heatmap/customlayer.js"``

.. code-block:: XML
    :caption: config.xml
    :emphasize-lines: 1,4,7

    <layer id="heatmap"
        name="Earthquakes Heatmap"
        visible="true"
        type="customlayer"
        legendurl="demo/heatmap/legend.png"
        opacity="1"
        url="demo/heatmap/customlayer.js"
        attribution=""
        metadata=""
        metadata-csw="">
    </layer>



.. Note::
    Pour aller plus loin :

    - :ref:`customlayerdev`
    - :ref:`publicfonctions`
