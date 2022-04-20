.. Authors :
.. mviewer team

.. _configmap:

Configurer - les options de la carte
=====================================


Syntaxe
-----------------

.. code-block:: xml
       :linenos:

	<mapoptions
        maxzoom=""
        projection=""
        center=""
        zoom=""
        projextent=""
        maxextent=""
        rotation=""
        scalebar=""
        scaleunits=""
        scalesteps=""/>


Paramètres
-----------------

* ``maxzoom`` : paramètre optionnel de type entier qui définit le seuil maximum de zoom de l'application. Valeur par défaut **19**. Plus d'info sur les seuils de zooms https://wiki.openstreetmap.org/wiki/Zoom_levels
* ``projection`` : paramètre obligatoire de type texte définissant la projection (code EPSG) utilisée par la carte. Exemple **EPSG:3857**.
* ``center`` :guilabel:`studio` : paramètre optionnel de type numérique définissant les coordonnées géographiques du centre de la carte dans la projection choisie. Exemple **-220750.13,6144925.57**.
* ``zoom`` :guilabel:`studio` : paramètre optionnel de type entier définissant le zoom initial de la carte. Valeur par défaut **8**.
* ``projextent`` : paramètre obligatoire de type texte définissant les limites géographiques de la projection utilisée. Ce paramètre n'est pas obligatoire pour les projections EPSG:4326 et EPSG:3857.
* ``maxextent`` :guilabel:`studio` : paramètre optionnel de type texte définissant les limites géographiques pour la vue cartographique
* ``scalebar`` : paramètre optionnel de type texte pour afficher l'échelle en barre et non en ligne ("false" par défaut).
* ``scaleunits`` : paramètre optionnel de type texte pour préciser l'unité de mesure de l'échelle ("metric" par défaut)
* ``scalesteps`` : paramètre optionnel de type texte pour préciser le nombre de pas de l'échelle ("2" par défaut).
* ``scaletext`` : paramètre optionnel de type texte pour préciser si on souhaite afficher le texte au dessus d'une échelle en barre ("true" par défaut).

Exemple
-----------------

.. code-block:: xml
       :linenos:

	<mapoptions
              scalebar="true"
              scaletext="true"
              scaleunits="metric"
              scalesteps="3"
              maxzoom="18"
              projection="EPSG:3857"
              center="-161129,6140339"
              zoom="9"
              projextent="-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244"
              maxextent="-550346.603653, 5975541.123222, -45250.720745, 6262944.349574" />

.. Tip::
   La carte dispose également d'un marker qui s'affiche au clic sur la carte. Il est possible de modifier ce marker via un paramétrage dans ":ref:`configsearch`".

   .. image:: ../_images/dev/config_map/marker.png
       :alt: marker
       :align: center

   .. code-block:: html

    <searchparameters imgurl='img/map_marker.png' imgwidth='50px' svgcolor='orange'





