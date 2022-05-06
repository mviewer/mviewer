.. Authors :
.. mviewer team

.. _configextensions:

Configurer - Extensions
=======================

Configuration globale
--------------------

Chargement de librairies javascripts externes ou de composants personnalisés.
Ce module d'extension permet de répondre à deux cas d'usage :

- J'ai besoin d'une librairie **javascript** (chart.js) pour faire mes templates de couche.
- J'ai besoin de créer un nouveau **composant** (mini carte de localisation) sans modifier le cœur de mviewer. Plus de précisions ici : ":ref:`configcustomcomponent`"

**Syntaxe**

.. code-block:: xml
       :linenos:

	<extensions>
    	<extension type="javascript" src=""/>
    	<extension type="component" id="" path=""/>
	</extensions>


**Paramètres pour les extensions de type javascripts**

* ``src``: paramètre obligatoire qui correspond à l'URL vers le fichier.

**Paramètres pour les extensions de type component**

* ``id``: paramètre obligatoire qui correspond au nom du dossier du composant.
* ``path``: paramètre obligatoire qui correspond à l'URL vers le dossier contenant la structure su composant.


**Exemple**

.. code-block:: xml
       :linenos:

	<extensions>
    	<extension type="javascript" src="chart.js"/>
    	<extension type="component" id="graph3d" path="demo/addons"/>
	</extensions>

Extension filtre sur nom de la couche
--------------------

Cett extension permet de filtrer ses couches selon leur titre comme ceci :

.. image:: ../_images/dev/config_extension/layerfilter.png
              :alt: Filtre de couche
              :align: center

Il faut pour cela ajouter ceci dans votre XML :

.. code-block:: xml

    <extensions>    
        <extension type="component" id="layerfilter" path="demo/addons"/>
    </extensions>

Extension plein écran
--------------------

Cette extension permet d'afficher la carte en plein écran comme ceci :

.. image:: ../_images/dev/config_extension/fullscreen.png
              :alt: Filtre de couche
              :align: center


| Cette extension est très utile si vous intégré votre carte via une iframe.
| Il faut pour cela ajouter ceci dans votre XML :

.. code-block:: xml

    <extensions>    
        <extension type="component" id="fullscreen" path="demo/addons"/>
    </extensions>


Extension isochrone
--------------------

Cett extension permet d'ajouter la possibilité de calculer des isochrones dans votre mviewer comme ceci :

.. image:: ../_images/dev/config_extension/isochroneAddon.png
              :alt: Calcul isochrone
              :align: center

| Cette extension utilise le geoservices de l'IGN. Il permet de faire des isochrones sur les parcours piétons et voiture.
| Il faut pour cela ajouter ceci dans votre XML :

.. code-block:: xml

    <extensions>    
        <extension type="component" id="isochroneAddon" path="demo/addons"/>
    </extensions>

Extension ajout couche temporaire
--------------------

Cette extension permet d'ajouter une couche dans votre mviewer. Attention, la couche ne sera pas persistente :

.. image:: ../_images/dev/config_extension/fileimport.png
              :alt: Calcul isochrone
              :align: center

| Elle fonctionne avec les formats CSV et Shapefile (via un ZIP).
| Il faut pour cela ajouter ceci dans votre XML :

.. code-block:: xml

    <extensions>    
        <extension type="component" id="fileimport" path="demo/addons"/>
    </extensions>

Extension filtre sur données
--------------------

Cette extension permet de filtrer les entités d'une donnée :

.. image:: ../_images/dev/config_extension/filter.png
              :alt: Calcul isochrone
              :align: center

Elle nécessite plusieurs prérequis :

* Elle s'applique sur les couches de types customlayer (couche vecteur avec création d'un fichier javascript pointant sur un flux WFS par exemple). Cela ne fonctionne pas sur wms. Pour plus d'information sur le fichier javascript à créer, se référer à cette page ":ref:`configfuse`".

.. code-block:: xml

	type="customlayer"
	
* il faut définir un id au niveau de l'application dans le XML :

.. code-block:: xml

	<application
		id="livre_lecture"

* il faut compléter le fichier demo/addons/filter/config.json en y ajoutant vos options de recherche et en mettant en début de liste le même id que dans votre XML. Exemple ici avec au début la configuration du positionnement de la fenêtre et ensuite les recherches par couches

.. code-block:: javascript

      "livre_lecture":{
        "tooltipPosition": "bottom-left",
        "title": "Filtrer",
        "open": true,
        "zoomOnFeatures": true,
        "legendTitle": "Sélectionner une donnée :",
        "style": {
          "border": "1px #2e5367 solid",
          "background": "#2e5367",
          "text": "white",
          "colorButton": "#2e5367"
        },
        "layers": [{
          "layerId": "reseau",
          "filter": [{
              "attribut": "code_departement",
              "type": "button",
              "label": "Départements"
            },
            {
              "attribut": "diagnostic_terr",
              "type": "button",
              "label": "Diagnostic Territorial",
              "updateOnChange": true
            }
          ]
        }]
      }



| Il faut pour cela ajouter ceci dans votre XML :

.. code-block:: xml

	<extensions>
			<extension type="component" id="filter" path="demo/addons"/>
	</extensions>
