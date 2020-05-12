.. Authors :
.. mviewer team

.. _configextensions:

Configurer - Extensions
=======================


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
