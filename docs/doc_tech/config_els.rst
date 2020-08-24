.. Authors :
.. mviewer team

.. _configels:

Configurer - Une recherche basée sur un index Elasticsearch
===========================================================

Permettre d'interroger un index Elasticsearch à  partir d'une saisie libre (exemple "Port de Brest"). Le résultat retourné est une collection de documents disposant d'un champ commun avec les entités géographiques servies par l'instance WMS/WFS. Par convention les types **elasticsearch** ont le même nom que les couches WMS/WFS.


Prérequis
-----------

Installer une instance Elasticsearch `<https://www.elastic.co/fr/downloads/elasticsearch>`_.

Création d'un index
--------------------

créer un index nommé **mviewer** avec un champ de type **geo_shape nommé** geometry et un champ de type **keyword** nommé id.

Pour celà, depuis le serveur hôte hébergeant l'instance Elasticsearch, lancer la commande **CURL** suivante :

.. code-block:: bash

   $ curl -XPUT 'localhost:9200/mviewer?pretty' -d '{
        "template": "mviewer",
        "settings": {
        "number_of_shards": 1
        },
          "mappings": {
            "_default_": {
              "properties": {
                "geometry": {
                    "type": "geo_shape",
                    "tree": "quadtree",
                    "precision": "10m"
                },
                "id": {
                    "type":  "keyword"
                }
              }
            }
          }
        }'


Alimenter l'index avec des données
------------------------------------

Il existe plusieurs mode d'alimentation. Un des plus connus consiste en l'utilisation de logstash `<https://www.elastic.co/downloads/logstash>`_. et du plugin jdbc `<https://www.elastic.co/guide/en/logstash/current/plugins-inputs-jdbc.html>`_. permettant d'indexer des données provenant de bases de données.

Une autre méthode consiste à utiliser l'API d'indexation d'Elasticsearch `<https://www.elastic.co/guide/en/elasticsearch/reference/5.6/docs-bulk.html>`_. via une commande CURL et un fichier contenant les instructions et données d'indexation et les données. Le fichier démo lycee permet de rapidement alimenter un index avec les données des lycées bretons.

Télécharger le fichier lycee `<http://kartenn.region-bretagne.fr/doc/lycee.bulk.json>`_. et exécuter la commande suivante.


.. code-block:: bash

     $ curl -s -H "Content-Type: application/x-ndjson" -XPOST 'http://localhost:9200/_bulk' --data-binary "@lycee.bulk.json"


Tester l'index
--------------

Si tout s'est bien déroulé, la commande suivante doit renvoyer deux lycées :

.. code-block:: bash

   $ curl -XGET 'localhost:9200/mviewer?q=zola&pretty'


Connecter mviewer à cet index Elasticsearch
--------------------------------------------

Il est conseillé de n'exposer que l'API de recherche (_search) sur le web. Imaginons qu'une configuration serveur expose sur le web 'localhost:9200/mviewer/_search' en 'http://monserveur/els/_search'

En partant de la démo Elasticsearch : http://kartenn.region-bretagne.fr/kartoviz/demo/els.xml, modifier le fichier de configuration pour que l'application pointe sur l'index Elasticsearch précédemment créé.

**Syntaxe**

.. code-block:: xml
       :linenos:

	   <elasticsearch url="http://monserveur/els/_search" geometryfield="geometry" linkid="search_id" querymode="match"/>

**Attributs**

* ``url``: Url de l'API Search
* ``geometryfield``: Nom du champ utilisé par l'instance elasticsearch pour stocker la géométrie
* ``linkid``: Nom du champ à  utiliser côté serveur wms/wfs pour faire le lien avec la propriété _id des documents elasticsearch
* ``querymode`` *(optionnel)* : Query mode used by elasticsearch to find results : match ou term ou phrase - default = match. Le mode match convient pour la recherche libre et naturelle. Le mode phrase permet de faire des recherches sur une phrase et le mode terme permet de faire une recherche sur un terme exact. Il est à noter que l'utilisateur peut activer le mode terme en préfixant sa recherche de # et activer le mode phrase en encadrant sa recherche de "".
* ``doctypes`` *(optionnel)* : types des documents elasticsearch à  requêter systématiquement, indépendamment des couches affichées
* ``version`` *(optionnel)* : version de l'instance elasticsearch (exemple = 5.3)

Tester en Lançant  http://monserveur/mviewer/?config=demo/els.xml et saisir zola dans la barre de recherche.