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
	
	   <elasticsearch url="" geometryfield="" linkid="" querymode="" doctypes=""/>

**Attributs**

* ``url``: Url de l'API Search
* ``geometryfield``: Nom du champ utilisé par l'instance elasticsearch pour stocker la géométrie
* ``linkid``: Nom du champ à  utiliser côté serveur wms/wfs pour faire le lien avec la propriété _id des documents elasticsearch
* ``querymode`` *(optionnel)* : Query mode used by elasticsearch to find results : fuzzy_like_this ou term - default = fuzzy_like_this
* ``doctypes`` *(optionnel)* : types des documents elasticsearch à  requêter systématiquement, indépendamment des couches affichées


searchparameters
--------------------------

Options liées à  la recherche d'adresse *(olscompletion)* et à  la recherche d'entitées *(elasticsearch)*.

**Syntaxe**

.. code-block:: xml
       :linenos:
	
	   <searchparameters bbox="" localities="" features="" static=""/>

**Attributs**

* ``bbox`` *(optionnel)* : Recherche d'adresse et/ou d'entitées dans l'emprise de la carte : true ou false (defaut = false),
* ``localities`` *(optionnel)* : Utilisation du service d'adresse olscompletion : true ou false (defaut = true),
* ``features`` *(optionnel)* : Utilisation du service de recherche d'entitÃƒÂ©s elasticsearch : true ou false (defaut = true),
* ``static`` *(optionnel)* : En lien avec le paramètre doctypes. Active ou désactive la recherche associée à  des documents requêtés systématiquement, indépendamment des couches affichées : true ou false (defaut = false).
