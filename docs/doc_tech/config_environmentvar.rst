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

Pour faciliter cette transition, un système basé sur un/des fichier(s) ``.env`` permet de définir des **variables d’environnement**. 

Les variables d’environnement sont principalement des liens pour accéder aux ressources des couches. Ils sont donc propres à chaque environnement.

Variable définie dans ``apps/.env``  sur un environnement de recette : 
::

    {
        "fqdn": "map.recette.fr"
    }

La même variable définie dans ``apps/.env``  sur un environnement de production : 
::

    {
        "fqdn": "map.fr"
    }

Ainsi en définissant des variables communes aux différents environnements mais dont seule la valeur change d’un environnement à l’autre, **il n'est plus nécessaire de changer l'URL** des ressources à la main lors du passage d'un fichier de la préproduction à la production.


Comment faire ?
---------------
**1. Créer un fichier définissant les variables**

**Variables globales**

Dans le répertoire ``/apps``, créez un nouveau fichier nommé ``.env`` et définissez une ou plusieurs variable(s) comme ci-dessous : 
::

    {
        "fqdn": https://map.recette.fr
    }


.. Note::
    Les variables définies dans le fichier ``.env`` pourront être appelées dans l’ensemble des applications disponible dans le répertoire ``/apps``. 

**Variables spécifiques à une application**

Si l’on souhaite définir des variables pour une **application spécifique** nommée ``MaCarte.xml``, il est possible de créer un fichier d’environnement dédié à cette application. 
Dans le même répertoire que l’application, créez un nouveau fichier nommé ``MaCarte.env`` (le fichier d’environnement doit avoir le même nom que le fichier de configuration .XML). Dans ce fichier, définissez une ou plusieurs variable(s) comme ci-dessous :
::

    {
        "fqdnMaCarte": https://MaCarte.recette.fr 
    }

.. warning::
    Les variables définies dans ce fichier ne pourront être utilisées **que dans l’application associée**, ici ``MaCarte.xml``

**Comportement des fichiers d’environnement**

-	On utilise les variables par défaut du fichier ``apps/.env``
-	Si aucun fichier ``.env`` n'existe, alors le système actuel et classique fonctionnera afin de lire simplement le XML sans chercher à remplacer des URLs.
-	Si le code détecte un fichier ``.env`` du même nom que la config (et au même endroit) alors le fichier ``apps/.env`` est surchargé par le fichier ``.env`` qui accompagne la config
-	On peut utiliser l'URL pour préciser le fichier ``.env`` à utiliser (``e.g &env=apps/test/test.env``) afin de remplacer le fichier ``apps/.env`` par le fichier passé dans l'URL
-	Les ``.env`` sont ignorés par git via le ``.gitignore`` pour ne pas écraser les fichiers selon les environnement


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

Alors je saisi sur ma recette ``apps/.env`` une variable aléatoire que j'appel ``fqdn`` :
::

    {
        "fqdn": "map.recette.fr"
    }

et je saisi sur ma prod dans ``apps/.env`` la même variable avec la valeur qui convient :
::

    {
        "fqdn": "map.fr"
    }

Dans mon config XML j'utilise alors pour mon WMS la syntaxe Mustache ``{{fqdn}}``:

.. code-block:: XML
  :linenos:

   <layer  url="{{fqdn}}/geoserver/rb/wms"/> 

Dans mon customLayer je peux par ailleurs appeler directement l'url WFS via :

.. code-block:: javascript    
    :linenos:

    const url = `https://${mviewer.env?.fqdn}/geoserver/rb/wfs...`;


**Exemple 2**

J'ai 3 fichiers :

- ``apps/.env``

::

    {
        "version": "3.8.1-snapshot"
    }

- ``demo/test/test.env``

::

    {
        "fqdn": "https://fqdn.com"
    }

- ``demo/test/test.xml``

Je peux ouvrir la console et voir le contenu de ``mviewer.env`` : 
::

    {
        "fqdn": "https://fqdn.com",
        "version": "3.8.1-snapshot"
    }

Je souhaite remplacer une variable de ``.env`` par défaut (dans cet exemple la variable ``version``) en écrasant celle-ci dans ``demo/test/test.env`` : 
::

    {
        "fqdn": "https://fqdn.com",
        "version": "inconnu"
    }

Pour obtenir au chargement et via la console du navigateur avec ``mviewer.env`` : 
::

    {
        "fqdn": "https://fqdn.com",
        "version": "inconnu"
    }
