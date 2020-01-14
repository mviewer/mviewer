.. Authors : 
.. mviewer team

.. _configsearch:

Configurer - La recherche
=================================

Recherche d'adresse via olscompletion
--------------------------

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
	
	   <searchparameters bbox="" localities="" features="" static="" animate="" duration=""/>

**Attributs**

* ``bbox`` *(optionnel)* : Recherche d'adresse et/ou d'entitées dans l'emprise de la carte : true ou false (defaut = false),
* ``localities`` *(optionnel)* : Utilisation du service d'adresse olscompletion : true ou false (defaut = true),
* ``features`` *(optionnel)* : Utilisation du service de recherche d'entitées elasticsearch ou fuse : true ou false (defaut = true),
* ``static`` *(optionnel)* : En lien avec le paramètre doctypes. Active ou désactive la recherche associée à des documents requêtés systématiquement, indépendamment des couches affichées : true ou false (defaut = false),
* ``animate`` *(optionnel)* : Active ou désactive l'animation de la vue lorsqu'un résultat de recherche est sélectionné  : true ou false (defaut = false),

.. image:: ../_images/dev/config_search/option-animate.gif
            :alt: activation de l'option animate
            :align: center

* ``duration`` *(optionnel)* : Durée en ms de l'animation définie dans l'option 'animate' (defaut = 1000).
