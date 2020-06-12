.. Authors :
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _configlayers:

Configurer - Les couches
########################


**Syntaxe** ``<layer>``
***************************

Elément enfant de ``<theme>`` ou ``<group>``

.. code-block:: xml
       :linenos:

	   <layer   id=""
                name=""
                scalemin=""
                scalemax=""
                visible=""
                owsoptions=""
                tiled=""
                queryable=""
                fields=""
                aliases=""
                type=""
                filter=""
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
                featurecount=""
                style=""
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
                geocoder=""
                geocodingfields=""
                xfield=""
                yfield=""
                url=""
                attribution=""
                tooltip=""
                tooltipcontent=""
                tooltipenabled=""
                expanded=""
                metadata=""
                metadata-csw="" >
                <template url=""></template>
        </layer>

Paramètres pour une configuration minimaliste
=================================================

* ``name`` :guilabel:`studio` : paramètre obligatoire de type texte qui précise le nom de la couche.
* ``url`` :guilabel:`studio` : paramètre obligatoire de type URL (URL du service web).
* ``id`` :guilabel:`studio` : paramètre obligatoire de type texte qui renseigne l'identifiant technique de la couche côté serveur WMS ou WFS.


Paramètres pour gérer l'affichage de la couche
===================================================

* ``scalemin`` :guilabel:`studio` : Echelle minimum de la couche
* ``scalemax`` :guilabel:`studio` : Echelle maximum de la couche
* ``dynamiclegend`` : Booléen précisant si la légende est liée à l'échelle de la carte et si elle nécessite d'être actualisée à chaque changement d'échelle de la carte.
* ``visible`` :guilabel:`studio` :  Booléen stipulant est ce que la couche est actuellement visible
* ``exclusive``:  Booléen stipulant si la couche est exclusive. Si la valeur est "true", l'affichage de cette couche masquera automatiquement toutes les autres couches ayant ce paramètre activé.
* ``style`` :guilabel:`studio` : Style(s) de la couche. Si plusieurs styles , utiliser la virgule comme séparateur. Si la couche est de type wms, il faut faire référence à un style sld. Si la couche est de type geojson, il faut faire référence à un style définit dans lib/featurestyles.js. Si la couche est de type customlayer, le style n'est pas défini ici.
* ``stylesalias`` :guilabel:`studio` : Titres à utiliser pour chaques style. utiliser la virgule comme séparateur si plusieurs styles.
* ``sld`` :guilabel:`studio` : Lien vers un SLD stocké sur le web. Dans ce fichier SLD, la balise sld:Name contenue dans sld:NamedLayer doit être égale au nom de la couche. Si plusieurs styles , utiliser la virgule comme séparateur. S'applique uniquement aux layers WMS. Il faut indiquer l'URL résolvable par le serveur WMS du ou des sld.
* ``tiled`` :guilabel:`studio` : Booléen stipluant est ce que la couche est tuilée
* ``opacity`` :guilabel:`studio` : Opacité de la couche (1 par défaut)
* ``legendurl`` :guilabel:`studio` :: url premettant de récupérer la légende. Si non défini, c'est un getFeatureLegend qui est effectué.
* ``filter`` :guilabel:`studio` : Expression CQL permettant de filtrer la couche ex: insee=35000 Ou INTERSECT(the_geom, POINT (-74.817265 40.5296504)) [tutorial] (http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html#cql-tutorial)
* ``toplayer``: Précise si la couche demeure figée". Booléen. Défaut = true.
* ``expanded`` :guilabel:`studio` : Booléan précisant si le panneau de la couche est agrandi au démarrage. La valeur par défaut est false.


Paramètres pour gérer attributions et métadonnées
=====================================================

* ``attribution`` :guilabel:`studio` : Copyright de la couche.
* ``metadata`` :guilabel:`studio` : Lien vers la fiche de metadonnées complète
* ``metadata-csw`` :guilabel:`studio` : Requête CSW pour l'affiche dans la popup du détail de la couche.

Paramètres pour gérer l'interrogation et la mise en forme de la fiche d'interrogation de la couche
===================================================================================================

* ``queryable`` :guilabel:`studio` : Booléen stipulant est ce que la couche est intérrogeable via un GetFeatureInfo
* ``infoformat`` :guilabel:`studio` : Format du GetFeatureInfo. 2 formats sont supportés : text/html et application/vnd.ogc.gml
* ``featurecount`` :guilabel:`studio` : Nombre d'éléments retournés lors de l'intérrogation
* ``fields`` :guilabel:`studio` :  Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à parser pour générer la vignette
* ``aliases`` :guilabel:`studio` : Si les informations retournées par l'interrogation est au format GML, aliases représente le renommage des champs parsés.

Paramètres pour gérer la recherche
======================================

* ``searchable``: Booléen précisant si la couche est interrogeable via la barre de recherche
* ``searchengine``: elasticsearch|fuse. Défault=elasticsearch.
* ``searchid``: Nom du champ à utiliser côté WMS afin de faire le lien avec l'_id elasticsearch
* ``iconsearch``: Lien vers l'image utilisée pour illustrer le résultat d'une recherche ElasticSearch
* ``fusesearchkeys``: Chaîne de caractères contenant le liste des champs de la couche à indexer pour la recherche. Les noms des champs doivent être séparés par des virgules. A n'utiliser que si searchengine = fuse.
* ``fusesearchresult``: Chaîne de caractères décrivant l'information à afficher dans les résultats de recherche. Cette chaîne contient soit le nom d'un champ de la couche soit un template Mustache combinant plusieurs noms de champs. Exemple : "{{name}} ({{city}})". A n'utiliser que si searchengine = fuse


Paramètres pour les couches non WMS
=======================================

* ``type``: Type de la couche (wms|geojson|kml|customlayer|csv) default=wms. Si customlayer est défini, il faut instancier un Layer OpenLayers dans un fichier javascript ayant pour nom l'id de la couche (voir ":ref:`configfuse`"). Ce fichier js doit être placé dans le répertoire customlayers/
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

* ``vectorlegend`` : Booléen précisant si la légende pour les couches de type vecteur (customlayer ou csv) est dynamiquement créée
* ``nohighlight`` : Booléen précisant, pour les couches de type vecteur (customlayer, geojson ou csv), si la mise en surbrillance est désactivée

Paramètres pour gérer la dimension temporelle des couches WMS
================================================================

* ``timefilter``: Booléen précisant si la dimension temporelle est activée pour cette couche. Voir (http://docs.geoserver.org/latest/en/user/services/wms/time.html)
* ``timeinterval``: day|month|year
* ``timecontrol``: calendar|slider|slider-range
* ``timevalues``: valeurs séparées par des virgules - A utiliser avec le controle slider pour des valeurs non régulières ex (1950, 1976, 1980, 2004).
* ``timemin``: Date mini format : "yyyy-mm-dd"
* ``timemax``: Date mini format : "yyyy-mm-dd"

Paramètres pour gérer le filtre attributaire (liste déroulante) des couches WMS
===================================================================================

* ``attributefilter`` :guilabel:`studio` :  Booléen précisant si on active la sélection attributaire par menu déroulant
* ``attributefield`` :guilabel:`studio` : Nom du champ à utiliser avec le contrôle attributefilter.
* ``attributevalues`` :guilabel:`studio` : valeurs séparées par des virgules.
* ``attributelabel``:  Texte à afficher pour la liste déroulante associée.
* ``attributestylesync``: Booléen qui précise s'il convient d'appliquer un style (sld) spécifique lors du filtre attributaire. Dans ce cas la convention est la suivante : nom_style@attributevalue ou url_style_externe@attributevalue.sld.
* ``attributefilterenabled``: Booléen précisant si le filtre est activé par défaut (avec la première valeur de la liste attributevalues).
* ``attributeoperator`` : guilabel:`studio` : Opérateur utilisé pour construire le filtre. (= ou like). Defaut = "=". Attention dans le cas de like, le wildcard est harcodé : %

Autres paramètres
====================

* ``customcontrol`` : Booléen précisant si la couche dispose d'un addon html à intégrer. La valeur par défaut est false.
* ``customcontrolpath`` : Texte Précisant le répertoire hébergeant les fichiers nécessaires au contrôle. Dans ce pépertoire, il faut déposer un fichier js et un fichier html ayant pour nom l'id de la couche. La structure du js doit être la suivante : (../controls/epci.js). Valeur par défaut = customcontrols.
* ``secure`` :guilabel:`studio` : Texte précisant le niveau de protection de la couche Les valeurs possibles sont :

	* ``public`` : (ou paramètre absent), l'accès à la couche est public
	* ``global`` : l'accès à la couche est contrainte par le CAS geoserver. Un test est affectué pour savoir si la couche est accessible. Si ce n'est pas le cas, la couche est retirée du panneau et de la carte.
	* ``layer`` : l'accès à la couche nécessite une authentification sur le service (WMS). Un bouton "cadenas" est ajouté dans la légende pour cette couche. Au clic sur ce bouton, un formulaire est affiché permettant de saisir des identifiants d'accès qui seront envoyés à chaque appel au service.

* ``authorization`` : Permet d'indiquer des identifiants par défaut si secure est à "layer"
* ``useproxy`` :guilabel:`studio` : Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de de crossOrigin lorsque CORS n'est pas activé sur le serveur distant.
* ``geocoder`` : pour les couches de type csv, précise l'API de géocodage à utiliser (ban).
* ``geocodingfields`` : pour les couches de type csv, précise les champs utilisables pour le géocodage.
* ``xfield`` : pour les couches de type csv, précise le champ à utiliser pour la longitude.
* ``yfield`` : pour les couches de type csv, précise le champ à utiliser pour la latitude.
* ``owsoptions`` : Pour une couche WMS, permet de forcer certains paramètres des requêtes GetMap. Exemple : "VERSION:1.1.1,EXCEPTIONS:application/vnd.ogc.se_inimage".

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

* ``url``: paramètre optionnel de type url qui indique l'emplacement du template à utiliser.
