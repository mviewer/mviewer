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
* ``zoom``: paramètre optionnel de type entier définissant le zoom initial de la carte. Valeur par défaut **8**.
* ``projextent``: paramètre obligatoire de type texte définissant les limites géographiques de la projection utilisée.

