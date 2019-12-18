.. Authors : 
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _configlayers:

Configurer - Les thématiques et les couches
===========================================

La configuration des couches qui seront visibles dans l'interface se fait dans le fichier **config.xml**.

Principe général
----------------------------------------

Ici, les couches sont organisées de la manière suivante :

* une **couche** (layer) est intégrée à un groupe ou à un thème,
* un **groupe** est intégré à un thème et peut contenir entre 1 et *n* couches,
* un **thème** est intégré au parent "themes" et peut contenir entre 1 et n groupes ainsi que 1 et *n* couches,
* le parent "**themes**" peut contenir entre 1 et *n* thème.

Ceci peut être résumé avec l'arborescence suivante :

.. code-block:: xml
       :linenos:

	<themes> 
	    	<theme>
	    		<layer> </layer>
		</theme>         
		<theme> 
			<group>
				<layer> </layer>
				<layer> </layer>
			</group>
		</theme>                    
	</themes>


Structure par défaut
----------------------------------------

Par défaut, le contenu suivant est proposé :

.. code-block:: xml
       :linenos:

	<themes> 
	    	<theme name="Population"  collapsed="false" id="habitant" icon="group">
	    		<layer id="rp_struct_pop_geom" name="Densité de population (hab/km²)" visible="false" tiled="false"
			searchable="false" queryable="false" attributefilter="true" attributefield="level" attributevalues="Commune,EPCI,Pays"  attributelabel="Échelle" attributestylesync="true" attributefilterenabled="true" infopanel="bottom-panel" infoformat="application/vnd.ogc.gml" featurecount="5" timefilter="true" timeinterval="year" timecontrol="slider" timemin="1999" timemax="2013" timevalues="1999,2008,2013" style="rphab_densite@commune" stylesalias="" url="http://ows.region-bretagne.fr/geoserver/rb/wms" attribution="Sources: INSEE (RP) - OpenStreetMap | Traitements: Région Bretagne - Service connaissance, observation, planification et prospective" metadata="http://kartenn.region-bretagne.fr/geonetwork/?uuid=26324529-e0b7-450c-9506-2dcdca608f5f" metadata-csw="http://kartenn.region-bretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=26324529-e0b7-450c-9506-2dcdca608f5f">
			</layer>
		</theme>         
	    	<theme name="Environnement"  collapsed="false" id="environnement" icon="leaf"> 
			<layer id="reserve_naturelle_regionale" name="Réserves naturelles régionales"  visible="false" tiled="false" searchable="false" queryable="true" fields="axe" aliases="axe" infoformat="application/vnd.ogc.gml" featurecount="20" sld="http://kartenn.region-bretagne.fr/styles/reserve_naturelle.sld" url="http://ows.region-bretagne.fr:80/geoserver/rb/wms" legendurl="http://kartenn.region-bretagne.fr/doc/icons_region/reserve_naturelle.svg" attribution="Source: Région Bretagne" metadata="https://geobretagne.fr/geonetwork/apps/georchestra/?uuid=77f8fc52-ae57-41d1-8f08-7b121b013f51" metadata-csw="https://geobretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=77f8fc52-ae57-41d1-8f08-7b121b013f51" >
			<template url="templates/global.reserve_naturelle_reg.mst"></template>
			</layer>                               
		</theme>
		<theme name="Éducation"  collapsed="false" id="education" icon="graduation-cap">  
			<layer id="lycee" name="Lycées"  visible="false" tiled="false" searchable="false" queryable="true" fields="axe" aliases="axe" attributefilter="true" attributefield="secteur_li" attributevalues="Public,Privé sous contrat avec l'éducation nationale"  attributelabel="Filtre" attributestylesync="false" attributefilterenabled="false" infoformat="application/vnd.ogc.gml" featurecount="20" sld="http://kartenn.region-bretagne.fr/styles/lycee_secteur.sld" url="http://ows.region-bretagne.fr/geoserver/rb/wms" attribution="Source: Région Bretagne" metadata="http://kartenn.region-bretagne.fr/geonetwork/?uuid=99e78163-ce9a-4eee-9ea0-36afc2a53d25" metadata-csw="http://kartenn.region-bretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=99e78163-ce9a-4eee-9ea0-36afc2a53d25" >	   
			<template url="templates/global.lycee.mst"></template> 
			</layer>                             
		</theme>
		<theme name="Transports"  collapsed="false" id="transport" icon="bus"> 
			<group name="Transport ferroviaire" id="grp1" >
				<layer id="troncon_ferroviaire" name="Lignes ferroviaires"  visible="false" tiled="false" searchable="false" queryable="true" fields="axe" aliases="axe" infoformat="application/vnd.ogc.gml" featurecount="20" style="ligne_ferroviaire_defaut" stylesalias="Par défaut" url="http://ows.region-bretagne.fr/geoserver/rb/wms" attribution="Source: Région Bretagne" metadata="http://kartenn.region-bretagne.fr/geonetwork/?uuid=0da27e88-4da6-423e-ba4c-dbcad9128cd2" metadata-csw="http://kartenn.region-bretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=0da27e88-4da6-423e-ba4c-dbcad9128cd2">
				<template url="templates/transport.ligne_ferroviaire.mst"></template>
				</layer>
				<layer id="arret_ferroviaire" name="Arrêts ferroviaires régionaux"  visible="false" tiled="false" searchable="true" queryable="true" fields="" aliases="" infoformat="application/vnd.ogc.gml" featurecount="20" style="arret_ferroviaire_defaut, arret_ferroviaire_nature" stylesalias="Par défaut,Nature des arrêts ferroviaires" legendurl="http://kartenn.region-bretagne.fr/doc/icons_region/gare_ter.svg" url="http://ows.region-bretagne.fr/geoserver/rb/wms" attribution="Source: Région Bretagne" metadata="http://kartenn.region-bretagne.fr/ geonetwork/?uuid=4a9d13f7-17be-4a98-9f8f-907cf223072f" metadata-csw="http://kartenn.region-bretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=4a9d13f7-17be-4a98-9f8f-907cf223072f" >
				<template url="templates/global.arret_ferroviaire.mst"></template>
				</layer>
			</group>
			<group name="Transport maritime" id="grp2" >	    
				<layer id="gare_maritime" name="Gares maritimes"  visible="false" tiled="false" searchable="false" queryable="true" fields="axe" aliases="axe" infoformat="application/vnd.ogc.gml" featurecount="20" sld="http://kartenn.region-bretagne.fr/styles/gare_maritime.sld" 
	             		url="https://geobretagne.fr/geoserver/dreal_b/ows" legendurl="http://kartenn.region-bretagne.fr/doc/icons_region/gare_maritime.svg" attribution="Source: DREAL Bretagne" 
	             		metadata="https://geobretagne.fr/geonetwork/apps/ georchestra/?uuid=ffcb4e72-a01b-44f0-8da3-95a5b13c6e42" metadata-csw="https://geobretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=ffcb4e72-a01b-44f0-8da3-95a5b13c6e42" >
				<template url="templates/global.gare_maritime.mst"></template>
				</layer>
				<layer id="port" name="Ports"  visible="false" tiled="false" searchable="false" queryable="true" fields="axe" aliases="axe" infoformat="application/vnd.ogc.gml" featurecount="20" sld="http://kartenn.region-bretagne.fr/styles/port.sld" url="http://ows.region-bretagne.fr:80/geoserver/rb/wms" legendurl="http://kartenn.region-bretagne.fr/doc/icons_region/port.svg" attribution="Source: Région Bretagne" metadata="https://geobretagne.fr/geonetwork/apps/georchestra/?uuid=c55c4fba-6a37-48ea-8754-a1bf770a684b" metadata-csw="https://geobretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=c55c4fba-6a37-48ea-8754-a1bf770a684b" >
				<template url="templates/global.port.mst"></template>
				</layer>	
			</group>
		</theme>                    
		<theme name="Découpages territoriaux"  collapsed="true" id="territoire" icon="globe"> 
			<layer id="commune" name="Commune" visible="false" queryable="false" fields="nom_geo" aliases="Nom" type="customlayer" style="" opacity="1" legendurl="img/legend/commune.png" url="customlayers/commune.js" tooltip="true" attribution="Source: GéoBretagne" metadata="https://geobretagne.fr/geonetwork/apps/ georchestra/?uuid=b08e6cb1-236c-49b7-88f9-42b500d274d5" metadata-csw="https://geobretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=b08e6cb1-236c-49b7-88f9-42b500d274d5"/>  
			<layer id="epci" name="Intercommunalité" visible="true" queryable="false" fields="nom_geo" aliases="Nom" customcontrol="true" type="customlayer" style="" opacity="1" legendurl="img/legend/epci.png" url="customlayers/epci.js" tooltip="true" tooltipenabled="true" attribution="Source: GéoBretagne" metadata="https://geobretagne.fr/geonetwork/apps/ georchestra/?uuid=2298d744-49cb-4fcb-9487-26f916fecdff" metadata-csw="https://geobretagne.fr/geonetwork/srv/eng/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=2298d744-49cb-4fcb-9487-26f916fecdff"/> 
		</theme>
	</themes>


Ici, ce code .xml peut être résumé à l'arborescence suivante :

.. code-block:: xml
       :linenos:

	<themes> 
	    	<theme name="Population">
	    		<layer name="Densité de population (hab/km²)"> </layer>
		</theme>         
	    	<theme name="Environnement"> 
			<layer name="Réserves naturelles régionales"> </layer>                               
		</theme>
		<theme name="Éducation">  
			<layer name="Lycées"> </layer>                             
		</theme>
		<theme name="Transports"> 
			<group name="Transport ferroviaire">
				<layer name="Lignes ferroviaires"> </layer>
				<layer name="Arrêts ferroviaires régionaux"> </layer>
			</group>
			<group name="Transport maritime">	    
				<layer name="Gares maritimes"> </layer>
				<layer name="Ports"> </layer>	
			</group>
		</theme>                    
		<theme name="Découpages territoriaux"> 
			<layer name="Commune"> </layer>
			<layer name="Intercommunalité"> </layer>
		</theme>
	</themes>

Ce qui donne visuellement ceci :

.. image:: ../_images/dev/config_layers/layer_tree.png
              :alt: Arborescence par défaut
              :align: center
              
Configuration de la liste des thèmes
-------------------------------------

**Syntaxe** ``<themes>``
***************************

.. code-block:: xml
       :linenos:
	
	<themes mini="" />

**Paramètres**

* ``mini``: paramètre optionnel de type booléen (true/false) qui précise si le panneau des thématique est ouvert ou fermé au démarrage de l'application. Valeur par défaut **false**.


**Syntaxe** ``<theme>``
***************************

Elément enfant de <themes>

.. code-block:: xml
       :linenos:
	
	<theme name=""  collapsed="" id="" icon="" />

**Paramètres**

* ``name``: paramètre obligatoire de type texte qui précise le nom de la thématique.
* ``id``: paramètre obligatoire de type texte qui affecte un identifiant unique interne à la thématique.
* ``collapsed``: paramètre optionnel de type booléen (true/false) qui précise si la thématique est fermée au démarrage de l'application. Pour que la thématique soit ouverte au démarrage, il faut choisir l'option **false**. Attention, il ne peut y avoir qu'une thématique ayant ce paramètre à false. Valeur par défaut **true**.
* ``icon``: paramètre optionnel de type texte qui précise l'icône à utiliser afin d'illustrer la thématique. Les valeurs possibles sont à choisir parmi cette liste : http://fontawesome.io/icons/


**Syntaxe** ``<group>``
***************************

Elément enfant de ``<theme>``

.. code-block:: xml
       :linenos:
	
	<group name="" />

**Paramètres**

* ``name``: paramètre obligatoire de type texte qui précise le nom du groupe.

Configuration des  couches
--------------------------

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
                tiled=""
                queryable="" 
                fields="" 
                aliases=""
                type=""
                filter=""
                searchable=""
                searchid=""
                useproxy=""
                secure=""
                toplayer=""
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
                opacity=""
                legendurl=""
                url=""
                attribution=""
                tooltip=""
                tooltipenabled=""
                expanded=""
                metadata=""    
                metadata-csw="" />
                <template url=""/>
        </layer> 

**Paramètres pour une configuration minimaliste**

* ``name``: paramètre obligatoire de type texte qui précise le nom de la couche.
* ``url``: paramètre obligatoire de type URL (URL du service web).
* ``id``: paramètre obligatoire de type texte qui renseigne l'identifiant technique de la couche côté serveur WMS ou WFS.


**Paramètres pour gérer l'affichage de la couche**

* ``scalemin``: Echelle minimum de la couche
* ``scalemax``: Echelle maximum de la couche
* ``visible``:  Booléen stipulant est ce que la couche est actuellement visible
* ``exclusive``:  Booléen stipulant si la couche est exclusive. Si la valeur est "true", l'affichage de cette couche masquera automatiquement toutes les autres couches ayant le paramètre ``exclusive``
* ``style``: Style(s) de la couche. Si plusieurs styles , utiliser la virgule comme séparateur. Si la couche est de type wms, il faut faire référence à un style sld. Si la couche est de type geojson, il faut faire référence à un style définit dans lib/featurestyles.js. Si la couche est de type customlayer, le style n'est pas défini ici.
* ``stylesalias``: Titres à utiliser pour chaques style. utiliser la virgule comme séparateur si plusieurs styles.
* ``sld``: Lien vers un SLD stocké sur le web. Dans ce fichier SLD, la balise sld:Name contenue dans sld:NamedLayer doit être égale au nom de la couche.
* ``tiled``: Booléen stipluant est ce que la couche est tuilée
* ``opacity``: Opacité de la couche (1 par défaut)
* ``legendurl``: url premettant de récupérer la légende. Si non défini, c'est un getFeatureLegend qui est effectué.
* ``filter``: Expression CQL permettant de filtrer la couche ex: insee=35000 Ou INTERSECT(the_geom, POINT (-74.817265 40.5296504)) [tutorial] (http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html#cql-tutorial)
* ``toplayer``: Précise si la couche demeure figée". Booléen. Défaut = true.
* ``expanded`` : Booléan précisant si le panneau de la couche est agrandi au démarrage. La valeur par défaut est false.

**Paramètres pour gérer attributions et métadonnées**

* ``attribution``: Copyright de la couche.
* ``metadata``: Lien vers la fiche de metadonnées complète
* ``metadata-csw``: Requête CSW pour l'affiche dans la popup du détail de la couche.

**Paramètres pour gérer l'interrogation et la mise en forme de la fiche d'interrogation de la couche**

* ``queryable``: Booléen stipulant est ce que la couche est intérrogeable via un GetFeatureInfo
* ``infoformat``: Format du GetFeatureInfo. 2 formats sont supportés : text/html et application/vnd.ogc.gml
* ``featurecount``: Nombre d'éléments retournés lors de l'intérrogation
* ``fields``: Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à parser pour générer la vignette
* ``aliases``: Si les informations retournées par l'interrogation est au format GML, aliases représente le renommage des champs parsés.

**Paramètres pour gérer la liaison de la couche avec un index ELK**

* ``searchable``: Booléen précisant si la couche est interrogeable via la barre de recherche
* ``searchid``: Nom du champ à utiliser côté WMS afin de faire le lien avec l'_id elasticsearch
* ``iconsearch``: Lien vers l'image utilisée pour illustrer le résultat d'une recherche ElasticSearch

**Paramètres pour les couches non WMS**

* ``type``: Type de la couche (wms|geojson|kml|customlayer) default=wms. Si customlayer est défini, il faut instancier un Layer OpenLayers dans un fichier javascript ayant pour nom l'id de la couche. Ce fichier js doit être placé dans le répertoire customlayers/
* ``tooltip``: Pour les couches de type vecteur uniquement. Booléen précisant si les entités de la couche sont affichées sous forme d'infobulle au survol de la souris. (Les infobulles ne fonctionnent qu'avec une seule couche à la fois). Valeur par défaut = false.
* ``tooltipenabled``: Précise la couche prioritaire pour l'affichage des infobulles.

**Paramètres pour gérer la dimension temporelle des couches WMS**

* ``timefilter``: Booléen précisant si la dimension temporelle est activée pour cette couche. Voir (http://docs.geoserver.org/latest/en/user/services/wms/time.html)
* ``timeinterval``: day|month|year
* ``timecontrol``: calendar|slider|slider-range
* ``timevalues``: valeurs séparées par des virgules - A utiliser avec le controle slider pour des valeurs non régulières ex (1950, 1976, 1980, 2004).
* ``timemin``: Date mini format : "yyyy-mm-dd" 
* ``timemax``: Date mini format : "yyyy-mm-dd"

**Paramètres pour gérer le filtre attributaire (liste déroulante) des couches WMS**

* ``attributefilter``:  Booléen précisant si on active la sélection attributaire par menu déroulant
* ``attributefield``: Nom du champ à utiliser avec le contrôle attributefilter.
* ``attributevalues``: valeurs séparées par des virgules.
* ``attributelabel``:  Texte à afficher pour la liste déroulante associée.
* ``attributestylesync``: Booléen qui précise s'il convient d'appliquer un style (sld) spécifique lors du filtre attributaire. Dans ce cas la convention est la suivante : nom_style_courant_attributevalue.
* ``attributefilterenabled``: Booléen précisant si le filtre est activé par défaut (avec la première valeur de la liste attributevalues).

**Autres paramètres**

* ``customcontrol``: Booléen précisant si la couche dispose d'un addon html à intégrer. La valeur par défaut est false.
* ``customcontrolpath``: Texte Précisant le répertoire hébergeant les fichiers nécessaires au contrôle. Dans ce pépertoire, il faut déposer un fichier js et un fichier html ayant pour nom l'id de la couche. La structure du js doit être la suivante : (../controls/epci.js). Valeur par défaut = customcontrols.
* ``secure``: Précise si la couche est protégée ( méchanisme geoserver ) auquel cas un test est affectué pour savoir si la couche est accessible. SI ce n'est pas le cas, la couche est retirée du panneau et de la carte.
* ``useproxy``: Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de de crossOrigin lorsque CORS n'est pas activé sur le serveur distant.

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
