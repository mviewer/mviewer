.. Authors :
.. mviewer team

.. _config_environmentvar:

Définir des variables d’environnement
=====================================

Pour quoi faire ?
-----------------

Lorsque l'on réalise des cartes dans certains environnements, et que l’on utilise le processus suivant :

#. Développement de la carte en local ==> ``localhost:xxxx/mviewer``
#. Passage sur un environnement de test type recette / pré-pod ==> ``https://map.recette.fr/mviewer``
#. Déploiement final vers l'environnement de production ===> ``https://map.fr/mviewer``

Pour chacun de ces environnements, l'URL change. On doit donc modifier à chaque étape les chemins et URLs des couches dans les XML, customlayers, extensions, customcontrol, etc...

La modification est manuelle et il y a souvent des erreurs. C'est aussi clairement fastidieux pour une carte contenant beaucoup de ressources ou alors lorsque le nombre d’applications à migrer est important.

Concept
-------

Pour faciliter cette transition, un système basé sur un/des fichier(s) ``.json`` permet de définir des **variables d’environnement**. 

A noter que par défaut, un fichier ``apps/settings.json`` est fourni.

Les variables d’environnement qui peuvent être contenues dans ce type de fichier sont principalement des liens pour accéder aux ressources des couches. Ils sont donc propres à chaque environnement.

Exemple de variable définie dans ``apps/settings.json``  sur un environnement de recette : 
::

    {
        "fqdn": "map.recette.fr"
    }

La même variable définie dans ``apps/settings.json``  sur un environnement de production : 
::

    {
        "fqdn": "map.fr"
    }

Ainsi en définissant des variables communes aux différents environnements mais dont seule la valeur change d’un environnement à l’autre, **il n'est plus nécessaire de changer l'URL** des ressources à la main lors du passage d'un fichier de la préproduction à la production.

Comment faire ?
---------------

**1. Créer un fichier définissant les variables**

**Variables globales**

Dans le répertoire ``/apps``, modifiez (ou créer si inexistant) le fichier ``settings.json`` et définissez une ou plusieurs variable(s) comme ci-dessous : 
::

    {
        "fqdn": https://map.recette.fr
    }


.. Note::
    Les variables définies dans le fichier ``.json`` pourront être appelées dans l’ensemble des applications disponibles dans le répertoire ``/apps``. 

**Variables spécifiques à une application**

Si l’on souhaite définir des variables pour une **application spécifique** nommée ``MaCarte.xml``, il est possible de créer un fichier d’environnement dédié à cette application. 
Ainsi, dans le même répertoire que l’application, créez un nouveau fichier nommé ``MaCarte.json`` (le fichier d’environnement doit avoir le même nom que le fichier de configuration .XML).

Dans ce fichier, définissez une ou plusieurs variable(s) comme ci-dessous comme on le ferez avec le fichier ``apps/settings.json``:
::

    {
        "fqdnMaCarte": https://MaCarte.recette.fr 
    }

.. warning::
    Les variables définies dans ce fichier ne pourront être utilisées **que dans l’application associée**, ici ``MaCarte.xml``

**Comportement des fichiers d’environnement**

-	On utilise les variables par défaut du fichier ``apps/setings.json``.
-	Si aucun fichier ``.json`` n'existe, alors le système actuel et classique fonctionnera afin de lire simplement le XML sans chercher à remplacer des URLs.
-	Si le code détecte un fichier ``.json`` du même nom que la config (et au même endroit) alors le fichier ``apps/settings.json`` est surchargé par le fichier ``.json`` qui accompagne la config (donc ``maConfig.json`` surchage et remplace les valeurs communes de ``apps/settings.json``).
-	On peut utiliser l'URL pour préciser le fichier ``.json`` à utiliser (``e.g &env=apps/test/test.json``) afin de remplacer le fichier ``apps/settings.json`` par le fichier passé dans l'URL.
-	Les ``.json`` sont ignorés par git via le ``.gitignore`` pour ne pas écraser les fichiers selon les environnements et ne pas avoir à le réécrire à chaque mise à jour de son projet Git.


**2. Mobiliser les variables d’environnement dans le fichier de configuration**

Pour appeler les variables dans le fichier de configuration .XML, on utilise la syntaxe Mustache en configurant une couche comme ci-dessous :

.. code-block:: XML
  :linenos:
  
  <layer  url="{{fqdn}}/geoserver/rb/wms"/> 


Lors de l'appel du XML au chargement de la carte, le code remplacera l'expression ``{{fqdn}}`` par ``https://ma.recette.fr`` pour obtenir un XML avec les URLs correctes. On aura alors pour notre ``<layer>`` dans le XML final :

.. code-block:: XML
  :linenos:

  <layer url="https://ma.recette.fr/geoserver/rb/wms" />

Cette syntaxe peut être utilisée pour l’ensemble des ressources mobilisées dans le fichier de configuration .XML telles que des styles, des images, des templates, etc … 

**3. Mobiliser les variables d’environnement dans un customlayer**

Il est également possible d’appeler les variables d’environnement dans un fichier du type customlayer en configurant votre fichier ``moncustomlayer.js`` comme ci-dessous :

.. code-block:: javascript    
    :caption: moncustomlayer.js
    :linenos:

    const url = `https://${mviewer.env?.fqdn}/geoserver/rb/wfs...`;

    let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            })
    });


.. warning::
    Pour que cette syntaxe fonctionne, vous devez utiliser des **littéraux de gabarits** ` ` (accent grave au lieu des apostrophes doubles ou simples) pour délimiter l’url.


Cas d’usage
-----------

**Exemple 1**

J'ai une application sur une préprod qui a le domaine : ``map.recette.fr``
Ma carte mviewer utilise un flux WMS de préprod et un customLayer avec un flux WFS de préprod.
Je souhaite pouvoir changer facilement vers une plateforme de production qui a le domaine : ``map.fr``

Alors je saisis sur ma recette ``apps/settings.json`` une variable aléatoire que j'appelle ``fqdn`` :
::

    {
        "fqdn": "map.recette.fr"
    }

et je saisis sur mon serveur de production dans ``apps/settings.json`` la même variable avec la valeur qui convient :
::

    {
        "fqdn": "map.fr"
    }

Dans mon config XML, j'utilise alors pour mon WMS la syntaxe Mustache ``{{fqdn}}``:

.. code-block:: XML
  :linenos:

   <layer  url="{{fqdn}}/geoserver/rb/wms"/> 

Dans mon customLayer, je peux par ailleurs appeler directement l'URL WFS via :

.. code-block:: javascript    
    :linenos:

    const url = `https://${mviewer.env?.fqdn}/geoserver/rb/wfs...`;


**Exemple 2**

Prenons ces 3 fichiers et le contenu associé :

- ``apps/settings.json``

::

    {
        "version": "3.8.1-snapshot"
    }

- ``demo/test/test.json``

::

    {
        "fqdn": "https://fqdn.com"
    }

- ``demo/test/test.xml``

En chargeant la carte mviewer pour la configuration ``demo/test/test.xml``, je peux déjà ouvrir la console et voir mes variables et valeurs associées en saisissant en JavaScript ``mviewer.env`` afin de les consulter : 
::

    {
        "fqdn": "https://fqdn.com",
        "version": "3.8.1-snapshot"
    }

On comprend là que ``mviewer.env`` permet d'accéder aux variables depuis un customlayer, le coeur mviewer ou une extension.

Si je souhaite à présent remplacer la valeur de la variable ``version`` fournie dans mon fichier ``apps/settings.json`` par défaut, je n'aurais qu'à l'ajouter avec la nouvelle valeur (ex. : ``inconnu``) dans le fichier ``demo/test/test.json``:
::

    {
        "fqdn": "https://fqdn.com",
        "version": "inconnu"
    }

On pourra ici encore obtenir via la console du navigateur la liste des variables et les valeurs avec le code JavaScript ``mviewer.env`` : 
::

    {
        "fqdn": "https://fqdn.com",
        "version": "inconnu"
    }
