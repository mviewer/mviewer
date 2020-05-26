.. Authors :
.. mviewer team

.. _configmap:

Configurer - les options de la carte
=====================================


**Syntaxe**

.. code-block:: xml
       :linenos:

	<mapoptions
        maxzoom=""
        projection=""
        center=""
        zoom=""
        projextent=""
        rotation=""/>


**Paramètres**

* ``maxzoom`` : paramètre optionnel de type entier qui définit le seuil maximum de zoom de l'application. Valeur par défaut **19**..
* ``projection`` : paramètre obligatoire de type texte définissant la projection (code EPSG) utilisée par la carte. Exemple **EPSG:3857**.
* ``center`` :guilabel:`studio` : paramètre optionnel de type numérique définissant les coordonnées géographiques du centre de la carte. Exemple **-220750.13,6144925.57**.
* ``zoom`` :guilabel:`studio` : paramètre optionnel de type entier définissant le zoom initial de la carte. Valeur par défaut **8**.
* ``projextent`` : paramètre obligatoire de type texte définissant les limites géographiques de la projection utilisée. Ce paramètre n'est pas requis pour obligatoire pour les projections EPSG:4326 et EPSG:3857.

**Exemple**

.. code-block:: xml
       :linenos:

	<mapoptions
		maxzoom="18"
		projection="EPSG:3857"
		center="-161129,6140339"
		zoom="9"
		projextent="-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244" />

.. Tip::
   La carte dispose également d'un marker qui s'affiche au clic sur la carte. Il est possible de modifier ce marker via css.
   
   .. image:: ../_images/dev/config_map/marker.png
       :alt: marker
       :align: center

   .. code-block:: html

    #mv_marker path {
        fill: #337ab7;
    }





