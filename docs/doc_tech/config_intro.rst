.. Authors :
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _configxml:

Configurer - Principe
=========================

Le visualiseur cartographique mviewer consomme des données et des services servis par le web (flux OGC WMS/WFS/WMTS, services de géocodage...) La connexion et le paramétrage de ces services se fait dans un fichier de configuration pivot qui permet en outre de personnaliser l'application (titre, logo, feuille de style...).

Si aucune configuration n'est indiquée dans l'URL, c'est la configuration par défaut qui s'applique ( **apps/default.xml**).

Il est possible de créer n fichiers de configuration (config1.xml, config2.xml...) de façon à  créer plusieurs applications thématiques à  partir d'une seule instance mviewer. Pour appeler une configuration particulière, il suffit alors de rajouter le paramètre **config** dans l'url, exemple `?config=demo/geobretagne.xml <http://kartenn.region-bretagne.fr/kartoviz/?config=demo/geobretagne.xml>`_ .
Pour d'autres exemples, consulter la page : `démos <http://kartenn.region-bretagne.fr/kartoviz/demo/>`_.

Structure du fichier de configuration
--------------------------------------

.. code-block:: xml
       :linenos:

        <?xml version="1.0" encoding="UTF-8"?>
        <config>
            <application />
            <extensions>
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


Paramètres d'URL
-----------------

Il est possible d'instancier un mviewer avec des **paramètres** de configuration transmis par URL

* ``config`` : Fichier de configuration à charger ex: ``mviewer/?config=apps/mon_appli.xml``.
* ``#`` : Il s'agit d'un raccourci pour appeler une config présente dans le dossier apps. ex: ``mviewer/#mon_appli``.
* ``theme`` : Theme css à utiliser ex: ?theme=geobretagne pour charger le theme doit être dans css/themes/geobretagne.css.
* ``wmc`` : liste des contextes OGC WMC (séparés par des virgules) à charger afin d'alimenter le panel de gauche ex : ``mviewer/?wmc=demo/hydro.wmc``
* ``popup`` : true ou false. Si true, Une popup s'affiche sur la carte afin d'afficher le résultat de l'interrogation de couches.
* ``lang`` : Langue à utiliser pour l'interface. Passer exemple "?lang=en".
* ``mode`` : Mode d'affichage à utiliser (d - default, s - simplifié, u - ultrasimplifié). Le mode simplifié ne dispose pas du panneau des thématiques et le mode ultra simplifié ne dispose pas de la barre de navigation.
* ``title`` : Titre à utiliser. Seulement exploité en mode défault et simplifié.
* ``topics`` : Thèmes à filtrer.

Paramètres d'URL utilisés pour les permaliens
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
* ``x`` : Coordonnées x du centre de la carte dans le système de projection utilisé par l'application.
* ``y`` : Coordonnées y du centre de la carte dans le système de projection utilisé par l'application.
* ``z`` : Zoom de la carte (1 à 20).
* ``lb`` : Identifiant de la couche de fond affichée.

Sections de configurations
----------------------------

- Configurer l'application ":ref:`configapp`".
- Configurer les extensions ":ref:`configextensions`
- Configurer la carte ":ref:`configmap`".
- Configurer les couches de fonds ":ref:`configbaselayers`".
- Configurer les couches thématiques ":ref:`configlayers`".
- Configurer la recherche ":ref:`configsearch`".
- Configurer le proxy ":ref:`configproxy`".
