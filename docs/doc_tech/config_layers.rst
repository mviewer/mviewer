.. Authors :
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _configlayers:

Configurer - Les couches
########################


**Syntaxe** ``<layer>``
***************************

Élément enfant de ``<theme>`` ou ``<group>``

.. code-block:: xml
       :linenos:

	   <layer   
                id=""
                name=""
                scalemin=""
                scalemax=""
                visible=""
                owsoptions=""
                owslegendoptions=""
                tiled=""
                queryable=""
                fields=""
                aliases=""
                jsonfields=""
                type=""
                filter=""
                filterstyle=""
                searchable=""
                searchid=""
                fusesearchkeys=""
                fusesearchresult=""
                useproxy=""
                secure=""
                authentification=""
                authorization=""
                toplayer=""
                exclusive=""
                infoformat=""
                infohighlight=""
                featurecount=""
                style=""
                styleurl=""
                styletitle=""
                stylesalias=""
                timefilter=""
                timeinterval=""
                timecontrol=""
                timevalues=""
                timemin=""
                timemax=""
                attributefilter=""
                attributefield=""
                attributevalues=""
                attributeoperator=""
                attributestylesync=""
                attributelabel=""
                attributefilterenabled=""
                opacity=""
                legendurl=""
                dynamiclegend=""
                vectorlegend=""
                nohighlight=""
                url=""
                attribution=""
                tooltip=""
                tooltipcontent=""
                tooltipenabled=""
                showintoc=""
                expanded=""
                metadata=""
                metadata-csw=""
                infopanel=""
                index=""
		minzoom=""
		maxzoom=""
                top=""
                defaultSensor=""
                selector=""
                datastreamsfilter=""
                multidatastreamsfilter="">
                <template url=""></template>
        </layer>

Paramètres obligatoires pour une configuration minimaliste
=================================================

* ``name`` :guilabel:`studio` : paramètre de type texte qui précise le nom de la couche.
* ``url`` :guilabel:`studio` : paramètre de type URL (URL du service web).
* ``id`` :guilabel:`studio` : paramètre de type texte qui renseigne l'identifiant technique de la couche côté serveur WMS ou WFS.


Paramètres pour gérer l'affichage de la couche
===================================================

* ``visible`` :guilabel:`studio` :  Booléen stipulant si la couche est visible par défaut.
* ``opacity`` :guilabel:`studio` : Opacité de la couche (1 par défaut).
* ``tiled`` :guilabel:`studio` : Booléen stipulant si on désire un affichage tuilé de la couche. Très utile pour affichage de grosses couches.
* ``style`` :guilabel:`studio` : Style(s) de la couche. Si plusieurs styles , utiliser la virgule comme séparateur. Si la couche est de type wms, il faut faire référence à un style sld. Si la couche est de type geojson, il faut faire référence à un style définit dans lib/featurestyles.js. Si la couche est de type vector-tms, le style correspond à la valeur indiquée en tant que première clé de la propriété "sources" du fichier de style au format JSON. Si la couche est de type customlayer, le style n'est pas défini ici.
* ``styleurl`` :guilabel:`studio` : pour les couches de type vector-tms uniquement, il indique l'URL vers le fichier de style au format JSON.
* ``styletitle`` :guilabel:`studio` : Titres à utiliser pour la liste des styles associés.
* ``stylesalias`` :guilabel:`studio` : Titres à utiliser pour chaques style. Utiliser la virgule comme séparateur si plusieurs styles.
* ``sld`` :guilabel:`studio` : Lien vers un SLD stocké sur le web. Dans ce fichier SLD, la balise sld:Name contenue dans sld:NamedLayer doit être égale au nom de la couche sans mention du namespace. Exemple <sld:Name>aeroports</sld:Name>. Si plusieurs styles , utiliser la virgule comme séparateur. S'applique uniquement aux layers WMS. Il faut indiquer l'URL résolvable par le serveur WMS du ou des sld.
* ``index`` :guilabel:`studio` : Ordre d'affichage de la couche sur la carte et dans la légende au démarrage. Les couches avec ce paramètre seront visibles sous les toplayers. Les couches sans ce paramètre ni toplayer seront affichées dans l'ordre d'écriture dans le XML.
* ``scalemin`` :guilabel:`studio` : Échelle minimum de la couche.
* ``scalemax`` :guilabel:`studio` : Échelle maximum de la couche.
* ``dynamiclegend`` :guilabel:`studio` : Booléen précisant si la légende est liée à l'échelle de la carte et si elle nécessite d'être actualisée à chaque changement d'échelle de la carte.
* ``exclusive`` :guilabel:`studio` :  Booléen stipulant si la couche est exclusive. Si la valeur est "true", l'affichage de cette couche masquera automatiquement toutes les autres couches ayant ce paramètre activé.
* ``legendurl`` :guilabel:`studio` : Url permettant de récupérer la légende. Si non défini, c'est un GetLegendGraphic qui est effectué.
* ``filter`` :guilabel:`studio` : Expression CQL permettant de filtrer la couche ex: insee=35000 Ou INTERSECT(the_geom, POINT (-74.817265 40.5296504)) (http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html#cql-tutorial).
* ``filterstyle`` :guilabel:`studio` : pour les couches de type vector-tms uniquement. Il permet de ne pas conserver, dans le style, la représentation de certaines couches. Cela permet donc de ne pas représenter un type de données présent dans le flux tuilé vectoriel. Il faut indiquer ici le nom d'une ou de plusieurs couches référencées dans la propriété "source-layer" du fichier de style au format JSON. Lorsque plusieurs couches sont à ajouter, le séparateur est la virgule et sans espace.
* ``toplayer`` :guilabel:`studio` : Booléan stipulant si la couche est affichée au premier plan sur la carte. La valeur par défaut est false. Si plusieurs couches sont en toplayer, elles seront affichées dans l’ordre d’écriture du XML.
* ``expanded`` :guilabel:`studio` : Booléan précisant si le panneau de la couche est agrandi au démarrage. La valeur par défaut est false.
* ``showintoc`` :guilabel:`studio` :  Booléen stipulant si la couche est affichée dans la légende. La valeur par défaut est true.
* ``minzoom`` :  pour les couches de type vector-tms, la valeur correspond au niveau de zoom minimal de visibilité de la couche. Par défaut, la valeur est récupérée à partir du fichier de style au format JSON. Pour plus de détail, voir la `documentation Openlayers <https://openlayers.org/en/latest/apidoc/module-ol_layer_VectorTile-VectorTileLayer.html>`_.
* ``maxzoom`` :  pour les couches de type vector-tms, la valeur correpond au niveau de zoom maximal de visibilité de la couche. Par défaut, la valeur est récupérée à partir du fichier de style au format JSON. Pour plus de détail, voir la `documentation Openlayers <https://openlayers.org/en/latest/apidoc/module-ol_layer_VectorTile-VectorTileLayer.html>`_.

Paramètres pour gérer attributions et métadonnées
=====================================================

* ``attribution`` :guilabel:`studio` : Copyright de la couche affiché sous la légende. Le mot-clé "metadata" permet de récupérer cette information depuis des métadonnées compliantes au Dublin Core (champs "source").
* ``metadata`` :guilabel:`studio` : Lien vers la fiche de metadonnées complète.
* ``metadata-csw`` :guilabel:`studio` : Requête CSW pour l'affiche dans la popup du détail de la couche. Mviewer récupère également la date de création ou dernière mise à jour si cela est en Dublin Core.

Paramètres pour gérer l'interrogation et la mise en forme de la fiche d'interrogation de la couche
===================================================================================================

* ``queryable`` :guilabel:`studio` : Booléen stipulant est ce que la couche est intérrogeable via un GetFeatureInfo.
* ``infoformat`` :guilabel:`studio` : Format du GetFeatureInfo. 2 formats sont supportés : text/html et application/vnd.ogc.gml. Le format application/vnd.ogc.gml est demandé pour l'utilisation de templates.
* ``infohighlight`` : Booléen précisant si les features de la couche sont mises en surbrillance en interrogeant leurs informations, défaut = true. Si false un markeur est affiché. Les styles utilisés pour la mise en surbrillance peuvent être configurés (voir ":ref:`configstyles`").
* ``featurecount`` :guilabel:`studio` : Nombre d'éléments maximun retournés lors de l'interrogation.
* ``fields`` :guilabel:`studio` :  Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à parser pour générer la vignette.
* ``aliases`` :guilabel:`studio` : Si les informations retournées par l'interrogation est au format GML, aliases représente le renommage des champs parsés.
* ``jsonfields`` : Liste des champs de type json. Avec ce paramètre, mviewer parse le contenu des champs spécifiés en JSON, ce qui permet ensuite d'exploiter ces valeurs dans des boucles de templates mustache  pour afficher une liste, un tableau...

Paramètres pour gérer la recherche
======================================

* ``searchable``: Booléen précisant si la couche est interrogeable via la barre de recherche.
* ``searchengine``: Moteur de recherche utilisé entre elasticsearch et fuse. Défault=elasticsearch.
* ``searchid``: Nom du champ à utiliser côté WMS afin de faire le lien avec l'_id elasticsearch.
* ``iconsearch``: Lien vers l'image utilisée pour illustrer le résultat d'une recherche elasticsearch.
* ``fusesearchkeys``: Chaîne de caractères contenant la liste des champs de la couche à indexer pour la recherche. Les noms des champs doivent être séparés par des virgules. À n'utiliser que si searchengine = fuse.
* ``fusesearchresult``: Chaîne de caractères décrivant l'information à afficher dans les résultats de recherche. Cette chaîne contient soit le nom d'un champ de la couche soit un template Mustache combinant plusieurs noms de champs. Exemple : "{{name}} ({{city}})". A n'utiliser que si searchengine = fuse.

Paramètre pour le type de couche sensorthings
======================================

* ``url``: URI du service sensorthing.
* ``style``: Style à utiliser (sensorPolygon|sensorPoint) disponible dans le fichier ``js/featurestyles.js``.
* ``top``: Nombre d'observations à retourner. La limite est par défaut définie par les capacités du serveur publiant le service.
* ``defaultSensor``: Stream par défaut à afficher au clic. Valeur ``null`` par défaut.
* ``selector``: Query param ``select`` tel que ``Locations(33)/Things?$select=id,description`` pour filtrer les champs ``Things`` à retourner.
* ``datastreamsfilter``: Query param ``select`` tel que ``Datastreams($select=name,id)`` pour filtrer les champs ``Datastreams`` à retourner.
* ``multidatastreamsfilter``: Query param ``select`` tel que ``MultiDatastreams($select=name,id)`` pour filtrer les champs ``MultiDatastreams`` à retourner.

Plus d'informations sur le type de couche OGC SensorThings : 

.. Note::
        Documentation utile :
        `Spécifications OGC <https://www.ogc.org/standards/sensorthings>`_
        `Schéma SensorThings API <https://developers.sensorup.com/docs/#sensorthingsAPISensing>`_




Paramètres pour les couches non WMS
=======================================

* ``type``: Type de la couche (wms|geojson|kml|vector-tms|sensorthings|customlayer|import) default=wms. Si customlayer est défini, il faut instancier un Layer OpenLayers dans un fichier javascript ayant pour nom l'id de la couche (voir ":ref:`configfuse`"). Ce fichier js doit être placé dans le répertoire customlayers/. Pour le type import l'extension `fileimport` doit être activée.
* ``tooltip``: Pour les couches de type vecteur uniquement. Booléen précisant si les entités de la couche sont affichées sous forme d'infobulle au survol de la souris. (Les infobulles ne fonctionnent qu'avec une seule couche à la fois). Valeur par défaut = false.
* ``tooltipenabled``: Précise la couche prioritaire pour l'affichage des infobulles.
* ``tooltipcontent``: Chaîne de caractères décrivant l'information à afficher dans les infobulles. Cette chaîne contient soit le nom d'un champ de la couche soit un template Mustache (code html) combinant plusieurs noms de champs. Exemple : ``tooltipcontent="{{name}} - ({{city}})"``.

.. Note::
	Il est possible d'utiliser du code **HTML** pour mettre en forme la tooltip.
	Exemple : ``{{name}} </br> {{city}}``.
	En HTML, ``</br>`` permet d'effectuer un saut de ligne, ce qui nous permet ici d'avoir une tooltip sur 2 lignes. **Attention**, cette expression doit être convertie en une expression compatible XML, c'est à dire avec le code HTML échappé.
	Il existe des `outils en ligne <https://www.freeformatter.com/xml-escape.html>`_ pour cela.
	L'expression valide pour l'expression précédente est :
	``tooltipcontent="{name}} &lt;/br&gt; {{city}}"``

* ``vectorlegend`` : Booléen précisant si la légende pour les couches de type vecteur (customlayer ou import) est dynamiquement créée.
* ``nohighlight`` : Booléen précisant, pour les couches de type vecteur (customlayer, geojson ou import), si la mise en surbrillance du hover est désactivée.

Paramètres pour gérer la dimension temporelle des couches WMS
================================================================

* ``timefilter``: Booléen précisant si la dimension temporelle est activée pour cette couche. Voir (http://docs.geoserver.org/latest/en/user/services/wms/time.html)
* ``timeinterval``: Intervalle de temps day|month|year.
* ``timecontrol``: Type d'affichage de l'intervalle de temps calendar|slider|slider-range. Attention, le calendrier fonctionne correctement seulement avec des valeurs continues et régulières gérées par la données source.
* ``timevalues``: Valeurs temporelles séparées par des virgules. À utiliser avec le controle slider pour des valeurs non régulières ex (1950, 1976, 1980, 2004).
* ``timemin``: Date mini format : "yyyy-mm-dd".
* ``timemax``: Date maxi format : "yyyy-mm-dd".
* ``timeshowavailable``: Booléen pour n'afficher dans le calendrier que les dates disponibles fournies par le getCapabilities (à utiliser avec le type `calendar` uniquement)

Paramètres pour gérer le filtre attributaire (liste déroulante) des couches WMS
===================================================================================

* ``attributefilter`` :guilabel:`studio` :  Booléen précisant si on active la sélection attributaire par menu déroulant.
* ``attributefield`` :guilabel:`studio` : Nom du champ à utiliser avec le contrôle attributefilter.
* ``attributevalues`` :guilabel:`studio` : Valeurs de la sélection attributaire séparées par des virgules.
* ``attributelabel``:  Texte à afficher pour chaque atttribut de la liste déroulante associée.
* ``attributestylesync``: Booléen qui précise s'il convient d'appliquer un style (sld) spécifique lors du filtre attributaire. Dans ce cas la convention est la suivante : nom_style@attributevalue ou url_style_externe@attributevalue.sld.
* ``attributefilterenabled``: Booléen précisant si le filtre est activé par défaut (avec la première valeur de la liste attributevalues). Si cette option n'est pas activée, une valeur "Par défaut" apparaît dans la liste et ne filtre pas les données. Valeur par défaut = false.
* ``attributeoperator`` : Opérateur utilisé pour construire le filtre OGC (XML) : ``=``, ``like``, ``<``, ``>``, ``<=``, ``>=``, ``!=``. Defaut = ``=``. Par défaut, la comparaison est insensible à la casse.
* ``wildcardpattern`` : Pattern à utiliser pour les filtres utilisant l'opérateur ``like``. Defaut = ``%value%``. Autres possibilités : ``%value`` et ``value%``.

Si vous souhaitez effectuer un filtre sur plusieurs couches, voir :ref:`configcustomcontrol`

Autres paramètres
====================
* ``customlayer`` : Texte précisant le nom du fichier JavaScript permettant la création d'une couche ou bien l'url complète du fichier JavaScript.

        * ``URL renseignée``: le fichier JavaScript (.js) correspondant à l'URL est chargé
        * ``Nom du fichier renseigné``: l'URL est fabriquée automatiquement à partir de l'ID de la couche. Le fichier devra être dans le répertoire customLayers/layerid.js (ou layerid correspond à l'id de la couche)

* ``customcontrol`` : Booléen précisant si la couche dispose d'un addon html à intégrer. La valeur par défaut est false.

        * ``Valeur renseignée``: le fichier JavaScript (.js) correspondant à l'url est chargé
        * ``Valeur non renseignée``: l'url est fabriquée à partir de l'ID de la couche (ex: custom:ayers/layerid.js)

* ``customcontrolpath`` : Texte Précisant le répertoire hébergeant les fichiers nécessaires au contrôle. Dans ce pépertoire, il faut déposer un fichier js et un fichier html ayant pour nom l'id de la couche. La structure du js doit être la suivante : (../controls/epci.js). Valeur par défaut = customcontrols.
* ``secure`` :guilabel:`studio` : Texte précisant le niveau de protection de la couche Les valeurs possibles sont :
    * ``public`` : (ou paramètre absent), l'accès à la couche est public
    * ``global`` : l'accès à la couche est contrainte par le CAS geoserver. Un test est effectué pour savoir si la couche est accessible. Si ce n'est pas le cas, la couche est retirée du panneau et de la carte.
    * ``layer`` : l'accès à la couche nécessite une authentification sur le service (WMS). Un bouton "cadenas" est ajouté dans la légende pour cette couche. Au clic sur ce bouton, un formulaire est affiché permettant de saisir des identifiants d'accès qui seront envoyés à chaque appel au service.

* ``authorization`` : Permet d'indiquer des identifiants par défaut si secure est à "layer"
* ``useproxy`` :guilabel:`studio` : Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de crossOrigin lorsque CORS n'est pas activé sur le serveur distant.
* ``owsoptions`` : Pour une couche WMS, permet de forcer certains paramètres des requêtes GetMap. Exemple : "VERSION:1.1.1,EXCEPTIONS:application/vnd.ogc.se_inimage".
* ``owslegendoptions`` : Pour une couche WMS, Permet de personnaliser certains paramètres des requêtes GetLegend. Exemple Qgis serveur : "LAYERTITLE:false,ITEMFONTSIZE:15".
* ``infopanel`` : Permet d'indiquer quel panel d'interrogation utiliser parmis top-panel ou bottom-panel ou modal-panel. Exemple: `infopanel="bottom-panel"`.

Zoom sur le paramétrage de gestion de l'ordre d'affichage des couches
====================

.. code-block:: xml
       :linenos:

	   <layer   index="1" showintoc="true" toplayer="true"/>

Par défaut, les couches sont affichées sur la carte par ordre d'appararition dans le fichier de configuration XML.
L'utilisateur a la possibilité d'utiliser les paramètres suivants pour forcer l'affichage au démarrage de l'application :

* ``toplayer`` :guilabel:`studio` : Ce paramètre va forcer l'affichage de la couche au dessus des autres couches.
Si plusieurs toplayers sont renseignés dans le fichier de configuration, toutes les toplayers seront au dessus et selon l'ordre d'apparition dans la configuration XML.
Si une couche a un toplayer et un index de renseigné, l'index est ignoré.

* ``index`` :guilabel:`studio` : L'objectif de ce paramètre est donc d'afficher la légende de façon identique à l'affichage sur la carte à l'initialisation de la carte.

Ce paramètre va permettre de forcer l'affichage de la couche à une position pour un index souhaité.
Ce paramètre `index` correspond sur la carte au paramètre [zIndex](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html) d'une couche OpenLayers.
Une couche avec le paramètre `index="2"` va donc afficher cette couche en seconde position (zIndex 2) et en seconde position dans la légende (sauf cas spécifique).

Par défaut, les couches avec un index seront toujours au-dessus des couches sans index.
Si deux couches ont le même index dans un même fichier de configuration XML, parmis ces deux couches, la couche en seconde position dans l'ordre d'apparition du fichier de configuration XML sera considérée sans index (voir explications suivantes).

.. code-block:: xml
       :linenos:

	   <layer   index="1" />
           <layer   index="2" />

* ``showintoc`` :guilabel:`studio`

Avec ce paramètre renseigné, les paramètres index et toplayer sont également pris en compte pour l'affichage sur la carte.

.. code-block:: xml
       :linenos:

	   <layer   index="1" />
           <layer   index="2" toplayer="true" showintoc="true"/>
           <layer   index="3" />

* couches sans index, sans toplayer, sans showintoc


.. code-block:: xml
       :linenos:

	   <layer   index="1" />
           <layer   index="2" />
           <layer />
           <layer />

Pour le cas primaire où aucun paramètre n'est renseigné, c'est l'ordre d'apparition dans le fichier de configuration XML qui permet de définir l'ordre d'affichage des couches au démarrage.
Dans le cas où une configuration XML comprend des couches avec le paramètre `index` et / ou `toplayer` et des couches sans aucun de ces paramètres, alors les couches sans paramètre respectent ce principe.

On retrouvera donc en premier les toplayer, ensuite les couches avec index et enfin les couches sans index.
Pour rappel, les couches avec un index en doublon et placée en seconde position dans le XML sont considérée sans index et sont concernées par ce mécanisme d'affichage. Elles s'afficheront donc selon les autres couches sans paramètres dans l'ordre d'apparition dans XML.


**Syntaxe** ``<template>``
******************************

Elément enfant de ``<layer>``

Cet élément optionnel, permet d'associer un template type Mustache (https://github.com/janl/mustache.js) à la fiche d'information de la couche.
 Pour fonctionner, il faut que le paramètre  ``infoformat`` ait la valeur "application/vnd.ogc.gml".
 Le template peut être un fichier statique ex templates/template1.mst ou directement saisi dans le noeud <template> avec les balises <![CDATA[ ]]>.

.. code-block:: xml
       :linenos:

	   <template   url="" />

**Paramètres**

* ``url`` :guilabel:`studio` : paramètre obligatoire de type url qui indique l'emplacement du template à utiliser.

