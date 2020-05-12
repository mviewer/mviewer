.. Authors :
.. mviewer team

.. _configcustomlayer:

Configurer - Custom layer
=========================


Un custom layer est une couche personnalisée s'appuyant sur la librairie ``openlayers``. Exemples

- J'ai besoin d'afficher une couche de type KML.
- J'ai besoin de créer une couche de type cluster avec une analyse personnalisée
- J'ai besoin d'une couche de tuiles vectorielles OSM...

**Syntaxe**

.. code-block:: XML
	:emphasize-lines: 2,3

	<layer id="moncustomlayer"
		type="customlayer"
		url="chemin_vers_customlayer.js">
	</layer>


**Paramètres custom layer**

* ``type="customlayer"``: paramètre précisant qu'il s'agit d'une couche de type customlayer.
* ``url``: paramètre qui indique où mviewer doit charger le fichier customlayer.js.




**Exemple**

.. code-block:: XML
    :caption: config.xml
    :emphasize-lines: 5-6

	<layer id="heatmap"
        name="Earthquakes Heatmap"
        visible="true"
		queryable="true"
        url="demo/heatmap/customlayer.js"
        type="customlayer"
        legendurl="demo/heatmap/legend.png"
        opacity="1"
        expanded="true"
        attribution=""
        metadata=""
        metadata-csw="">
    </layer>



.. Note::
    Apprendre par l'exemple :

    - :ref:`customlayer`