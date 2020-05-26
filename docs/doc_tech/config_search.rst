.. Authors :
.. mviewer team

.. _configsearch:

Configurer - La recherche
=================================

Recherche d'adresse via olscompletion
-------------------------------------

Liens vers service d'autocomplétion et de géocodage d'adresses.

**Syntaxe**

.. code-block:: xml
       :linenos:

	   <olscompletion url="" type="" attribution="" />

**Attributs**

* ``url``: Url du service d'autocomplétion d'adresse
* ``type``: Optional - Type de service utilisé geoportail ou ban - defaut = geoportail
* ``attribution``: Attribution du service de geocodage

Recherche d'entités
--------------------------

2 possibilités sur mviewer :

* ":ref:`configels`"
* ":ref:`configfuse`"

Paramétrage des recherches
--------------------------

Options liées à  la recherche d'adresse *(olscompletion)* et à  la recherche d'entitées *(elasticsearch ou fuse)*.

**Syntaxe**

.. code-block:: xml
       :linenos:

	<searchparameters
              imgurl=""
              imgwidth=""
              svgcolor=""
              bbox=""
              inputlabel=""
              localities=""
              features=""
              static=""
              querymaponclick=""
              closeafterclick=""
              animate=""
              duration=""/>

**Attributs**

* ``bbox`` *(optionnel)* : Recherche d'adresse et/ou d'entitées dans l'emprise de la carte : true ou false (defaut = false),
* ``localities`` *(optionnel)* : Utilisation du service d'adresse olscompletion : true ou false (defaut = true),
* ``features`` *(optionnel)* : Utilisation du service de recherche d'entitées elasticsearch ou fuse : true ou false (defaut = true),
* ``static`` *(optionnel)* : En lien avec le paramètre doctypes. Active ou désactive la recherche associée à des documents requêtés systématiquement, indépendamment des couches affichées : true ou false (defaut = false),
* ``inputlabel`` *(optionnel)* : Texte à utiliser pour le placeholder de la zone de saisie de la barre de recherche. default = "Rechercher",
* ``querymaponclick`` *(optionnel)* : Interroge la carte après sélection d'un résultat : true ou false - defaut = false,
* ``closeafterclick`` *(optionnel)* : Ferme la liste des résultats de recherche après avoir sélectionné un item : true ou false - defaut = false,
* ``animate`` *(optionnel)* : Active ou désactive l'animation de la vue lorsqu'un résultat de recherche est sélectionné  : true ou false (defaut = false),
* ``duration`` *(optionnel)* : Durée en ms de l'animation définie dans l'option 'animate' (defaut = 1000).
* ``imgurl`` *(optionnel)* : Url de l'image PNG / JPEG à afficher à l'emplacement du résultat sélectionné en guise de pointeur.
* ``imgwidth`` *(optionnel)* : Taille de l'image (voir paramètre imgurl) du pointeur représentant le résultat sélectionné.
* ``svgcolor`` *(optionnel)* : Couleur du pointeur représentant la localisation du résultat sélectionné.

.. figure:: ../_images/dev/config_search/option-animate.gif
            :alt: activation de l'option animate
            :align: center

            Activation de l'option **animate**.
