.. Authors : 
.. mviewer team

.. _configsearch:

Configurer - La recherche
=================================

olscompletion
--------------------------

Liens vers service d'autocomplétion et de géocodage.

**Syntaxe**

.. code-block:: xml
       :linenos:
	
	   <olscompletion url="" type="" attribution="" />

**Attributs**

* ``url``: Url du service d'autocomplétion d'adresse
* ``type``: Optional - Type de service utilisé geoportail ou ban - defaut = geoportail
* ``attribution``: Attribution du service de geocodage


elasticsearch
--------------------------

Liens vers un index **elasticsearch**. Cette fonctionnalité permet d'interroger un index Elasticsearch à  partir d'une saisie libre (exemple "Port de Brest"). Le résultat retourné est une collection de documents disposant d'un champ commun avec les entités géographiques servies par l'instance WMS/WFS. Par convention les types **elasticsearch** ont le même nom que les couches WMS/WFS.

**Syntaxe**

.. code-block:: xml
       :linenos:
	
	   <elasticsearch url="" geometryfield="" linkid="" querymode="" doctypes="" version=""/>

**Attributs**

* ``url``: Url de l'API Search
* ``geometryfield``: Nom du champ utilisé par l'instance elasticsearch pour stocker la géométrie
* ``linkid``: Nom du champ à  utiliser côté serveur wms/wfs pour faire le lien avec la propriété _id des documents elasticsearch
* ``querymode`` *(optionnel)* : Query mode used by elasticsearch to find results : match ou term ou phrase - default = match. Le mode match convient pour la recherche libre et naturelle. Le mode phrase permet de faire des recherches sur une phrase et le mode terme permet de faire une recherche sur un terme exact. Il est à noter que l'utilisateur peut activer le mode terme en préfixant sa recherche de # et activer le mode phrase en encadrant sa recherche de "".
* ``doctypes`` *(optionnel)* : types des documents elasticsearch à  requêter systématiquement, indépendamment des couches affichées
* ``version`` *(optionnel)* : version de l'instance elasticsearch "current" ou "1.4" (defaut = current)

- Configurer un index elasticSearch ":ref:`configels`".

searchparameters
--------------------------

Options liées à  la recherche d'adresse *(olscompletion)* et à  la recherche d'entitées *(elasticsearch)*.

**Syntaxe**

.. code-block:: xml
       :linenos:
	
	   <searchparameters bbox="" localities="" features="" static="" animate="" duration=""/>

**Attributs**

* ``bbox`` *(optionnel)* : Recherche d'adresse et/ou d'entitées dans l'emprise de la carte : true ou false (defaut = false),
* ``localities`` *(optionnel)* : Utilisation du service d'adresse olscompletion : true ou false (defaut = true),
* ``features`` *(optionnel)* : Utilisation du service de recherche d'entitées elasticsearch : true ou false (defaut = true),
* ``static`` *(optionnel)* : En lien avec le paramètre doctypes. Active ou désactive la recherche associée à des documents requêtés systématiquement, indépendamment des couches affichées : true ou false (defaut = false),
* ``animate`` *(optionnel)* : Active ou désactive l'animation de la vue lorsqu'un résultat de recherche est sélectionné  : true ou false (defaut = false),

.. image:: ../_images/dev/config_search/option-animate.gif
            :alt: activation de l'option animate
            :align: center

* ``duration`` *(optionnel)* : Durée en ms de l'animation définie dans l'option 'animate' (defaut = 1000).
