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
        projextent="" />


**Paramètres**

* ``maxzoom``: paramètre optionnel de type entier qui définit le seuil maximum de zoom de l'application. Valeur par défaut **19**..
* ``projection``: paramètre obligatoire de type texte définissant la projection (code EPSG) utilisée par la carte. Exemple **EPSG:3857**.
* ``center``: paramètre optionnel de type numérique définissant les coordonnées géographiques du centre de la carte. Exemple **-220750.13,6144925.57**.
* ``zoom``: paramètre optionnel de type entier définissant le zoom initial de la carte. Valeur par défaut **8**.
* ``projextent``: paramètre obligatoire de type texte définissant les limites géographiques de la projection utilisée.

**Exemple**

.. code-block:: xml
       :linenos:
	
	<mapoptions 
		maxzoom="18" 
		projection="EPSG:3857" 
		center="-161129,6140339" 
		zoom="9" 
		projextent="-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244" />

