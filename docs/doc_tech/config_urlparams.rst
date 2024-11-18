.. Authors :
.. mviewer team

.. _configurlparams:

Configurer - Les paramètres d'URL
=================================

Centrer la carte à l'ouverture sur une entité via une API
---------------------------------------------------------

L'application peut s'ouvrir en centrant la carte sur une localité particulière (e.g adresse, parcelle, contours d'entité administrative).

Ce paramétrage dynamique est rendu possible en ajoutant à l'URL mviewer les paramètres suivants et des compléments dans la configuration XML : 

* ?q=21 rue dupont des loges Rennes&qtype=ban
* ?q=code_insee%3D35238%26section%3DAB%26numero%3D0001&qtype=cadastre
* &q=service%3Depcis%26nom%3DNan%26fields%3Dcontour&qtype=admin

**Syntaxe**

.. code-block:: xml
       :linenos:

	<urlparams fill="" stroke="">
           <qtype name="" url="" />           
       </urlparams>

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

Spécificité : geo.api.gouv.fr
-----------------------------

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


