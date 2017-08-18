.. Authors : 
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _configxml:

Configurer - Principe
=========================

Le visualiseur cartographique mviewer consomme des données et des services servis par le web (flux OGC WMS/WFS/WMTS, services de géocodage...) La connexion et le paramétrage de ces services se fait dans un fichier de configuration pivot qui permet en outre de personnaliser l'application (titre, logo, feuille de style...).

La configuration de **mviewer** se fait par défaut dans le fichier de configuration **config.xml** *(présent à la racine)*. 

Il est possible de créer n fichiers de configuration (config1.xml, config2.xml...) de façon à  créer plusieurs applications thématiques à  partir d'une seule instance mviewer. Pour appeler une configuration particulière, il suffit alors de rajouter le paramètre **config** dans l'url, exemple `?config=demo/geobretagne.xml <http://kartenn.region-bretagne.fr/kartoviz/?config=demo/geobretagne.xml>`_ .
Pour d'autres exemples, consulter la page : `démos <http://kartenn.region-bretagne.fr/kartoviz/demo/>`_.

Structure du fichier de configuration
--------------------------------------

.. code-block:: xml
       :linenos:

        <?xml version="1.0" encoding="UTF-8"?>
        <config>
            <application /> 
            <mapoptions />
            <baselayers>
                <baselayer />
            </baselayers> 
            <proxy />
            <olscompletion />
            <elasticsearch />
            <searchparameters />
            <themes>
                <theme>
                    <layer />         
                </theme>
            </themes>
        </config>


Sections de configurations
----------------------------

- Configurer l'application ":ref:`configapp`".
- Configurer la carte ":ref:`configmap`".
- Configurer les couches de fonds ":ref:`configbaselayers`".
- Configurer les couches thématiques ":ref:`configlayers`".
- Configurer la recherche ":ref:`configsearch`".
- Configurer le proxy ":ref:`configproxy`".
