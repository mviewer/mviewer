.. Authors :
.. mviewer team

.. _configurlparams:

Configurer - Les paramètres d'URL
=================================

Notions d'encodage
------------------

Pour utiliser les paramètres dans l'URL, vous devrez encoder ce qui doit être contenu dans le paramètre `q`.

Vous devrez notamment renseigner dans le paramètre `q` tous les paramètres utile à l'appel final (ce sont les paramètres de l'API ou du service qui retourne les entités).

Voici la table d'encodage des caractères :

https://www.nicolas-hoffmann.net/utilitaires/codes-hexas-ascii-unicode-utf8-caracteres-usuels.php

Exemple décodé :

`?q=code_insee=35238&section=AB&numero=0001&qtype=cadastre`

Exemple encodé :

`?q=code_insee%3D35238%26section%3DAB%26numero%3D0001&qtype=cadastre`

Notez ici que le caractète `=` de `qytpe=cadastre` n'est pas encodé car il n'est pas dans le paramètre `q`.


Centrer la carte à l'ouverture sur une entité via une API
---------------------------------------------------------

L'application peut s'ouvrir en centrant la carte sur une localité particulière (e.g adresse, parcelle, contours d'entité administrative).

Ce paramétrage dynamique est rendu possible en ajoutant à l'URL mviewer les paramètres suivants et des compléments dans la configuration XML : 

* ?q=21 rue dupont des loges Rennes&qtype=ban
* ?q=code_insee%3D35238%26section%3DAB%26numero%3D0001&qtype=cadastre
* &q=service%3Depcis%26nom%3DNan%26fields%3Dcontour&qtype=admin
* &q=layer%3Didf:COMMUNES_IDF%26filter%3DCODE_INSEE%3D77177&qtype=features
* &q=layer%3Dbzh:COMMUNES_BZH%26filter%3DPOP_MUN_17%3E7000%20AND%20DENSITE%20%3E500%26bbox%3D2.318017,48.907152,2.350675,48.918123%26service%3Dhttps://my.map.server.fr/geoserver&qtype=features

**Syntaxe**

.. code-block:: xml
       :linenos:

	<urlparams fill="" stroke="">
           <qtype name="" url="" />           
       </urlparams>

.. warning::
    Le paramètre URL n'est pas obligatoire pour les types suivants: features.


**Attributs**

* ``url``: URL du service utilisé : BAN https://api-adresse.data.gouv.fr/search/ ou CADASTRE pour les parcelles cadastrales  https://apicarto.ign.fr/api/cadastre/parcelle
* ``name``: Type de service utilisé cadastre ou ban
* ``fill``: Couleur de l'intérieur d'un polygon (e.g code rgba)
* ``stroke``: Couleur du contours (e.g code rgba)

**Exemple**

.. code-block:: xml
       :linenos:

       <urlparams fill="" stroke="rgba(232, 19, 232,0.6)" >
              <qtype name="ban" url="https://api-adresse.data.gouv.fr/search/" />
              <qtype name="cadastre" url="https://apicarto.ign.fr/api/cadastre/parcelle" />
              <qtype name="admin" url="https://geo.api.gouv.fr" />
              <qtype name="features" url="https://a.map.server.fr" />
       </urlparams>


Pour bien fonctionner, le qtype indiqué dans l'URL doit être présent dans le XML de la carte.

Par exemple, si l'URL appel un qtype=cadastre mais que le XML ne contient pas à minima cette configuration, cela ne fonctionnera pas :

.. code-block:: xml
       :linenos:

       <urlparams fill="" stroke="rgba(232, 19, 232,0.6)" >
              <qtype name="cadastre" url="https://apicarto.ign.fr/api/cadastre/parcelle" />
       </urlparams>


Ajouter une nouvelle API
------------------------

Les APIs ne retournent pas les objets géographiques (e.g GeoJSON) de la même façon. Ainsi, seules ces 3 APIs sont utilisables pour le moment.
Il est toutefois possible de rajouter facilement une API supplémentaire mais cela nécessite une contribution.

Voici le code source relatif :

https://github.com/mviewer/mviewer/tree/develop/js/urlParams

Si vous souhaitez contribuer et proposer une autre API vous devez créer un nouveau fichier pour cette API dans le répertoire mis en lien au-dessus avec le code qui convient.
Ensuite, vous devrez prévoir un nom dédié utilisable dans la balise `qtype` du XML (e.g la `BAN` utilise `name="ban"`, l'API `geo.api.gouv.fr` utilise `name="admin"`).

L'URL et la valeur de la propriété `name` seront réutilisée pour réaliser l'appel correspondant (selon le fichier ajouté dans `js/urlParams` et mviewer.js) ;

https://github.com/mviewer/mviewer/blob/develop/js/mviewer.js#L118

https://github.com/mviewer/mviewer/blob/develop/js/urlParams/urlParams.js#L8

Spécificité pour le type : admin
--------------------------------

Les paramètres d'appel sont conservé tels que saisie dans l'URL.

Les champs service et fields (avec la valeur contours) sont obligatoires et permettent de récupérer la géométrie et de savoir quel service utiliser (communes, epci...) selon les services disponibles : 

https://geo.api.gouv.fr/decoupage-administratif

Exemple pour rechercher une commune par son code insee :

* &q=service%3Dcommunes%26code%3D35238%26fields%3Dcontour&qtype=admin

Exemple pour rechercher une commune par son code postal :

* &q=service%3Dcommunes%26codePostal%3D35400%26fields%3Dcontour&qtype=admin

Exemple pour rechercher une EPCI par nom :

* &q=service%3Depcis%26nom%3DNan%26fields%3Dcontour&qtype=admin

Exemple pour rechercher une EPCI par code :

* &q=service%3Depcis%26code%3D244400404%26fields%3Dcontour&qtype=admin


Spécificité pour le type : features
-----------------------------------

Ce type utilise un service OGC API Feature et la capacité de filtrer :

https://portal.ogc.org/files/96288


Vous pouvez tout configurer dans l'URL et ajouter des filtres et opprateurs compatibles via le paramètre `filter=`.

.. warning::
    N'oubliez pas que les paramètres d'URL doivent être encodés !

Voici un exemple de filtre sur les champ POP et DENSITE avec l'opérateur AND :

`filter%3DPOP%3E7000%20AND%20DENSITE`

Pour filtrer les entités selon une bbox, utilisez le paramètre `bbox=` tel que :

`bbox%3D2.318017,48.907152,2.350675,48.918123`


.. warning::
    Nous ne détaillerons pas les capacités offertes par le filtre OGC API Feature puisque cette section n'est pas un tutoriel plus complet devrait jouer ce rôle.
    
    Vous pouvez aller plus loins via ces liens : 
    
    https://geoserver.geosolutionsgroup.com/edu/en/ogcapi/features/filtering-extracting.html


Les paramètres layer est obligatoire est n'est pas lié à l'OGC API Feature mais il permet de saisir le nom de couche concerné par la requête :

`&q=layer%3Dbzh:COMMUNES_BZH`

Le paramètre `service` permet d'indiquer quel est le serveur à utiliser (ici un geoserver) : 

`%26service%3Dhttps://my.map.server.fr/geoserver`

Ce dernier paramètre peut être renseigner dans la configuration XML via le paramètre `url` (propriété de la balise `qtype`) ou bien dans l'URL via le paramètre `service`.

Avec ce fonctionnement, vous pouvez tout renseigner dans les paramètres d'URL et utiliser l'ensemble des paramètres OGC API Feature dans le paramètre `q`!


Réutilisation dans mviewer
--------------------------

Vous pouvez appeler les méthodes d'appel des différents types via `mviewer.urlParams`.

Par exemple pour le `qtype=features` :

.. code-block:: xml
       :linenos:

       const parameters = new URLSearchParams(API.q);
       const servicesUrl = "https://my.map.server.fr"
       mviewer.urlParams.getFeatures(parameters, servicesUrl);
