MVIEWER
=============

Visualiseur géographique [Kartenn](http://kartenn.region-bretagne.fr/mviewer/) basé sur OpenLayers 3.10.0 et Jquery mobile 1.4.0 inspiré d'un travail réalisé par Metz Métropole.

Déploiement 
-----------

Le déploiement se passe en trois étapes :
	1. cloner le projet dans le dossier de votre choix
	2. copier ce dossier dans le dossier /var/www/ ( ou autres dossiers de déploiement Apache)
	Vous avez maintenant un visualiseur géographique fonctionnel avec les couches de la Région Bretagne
	3. Si vous souhaitez publier vos propres couches/thèmes, modifiez le fichier config.xml

Fichier config.xml		
------------------
Le fichier de config permet la personnalisation des thèmes/couches du visualiseur.


###Exemple 

	<?xml version="1.0" encoding="UTF-8"?>
	<config>
    <application title="" logo="" help="" description"" style="" panelfooterimage="" panelfooterheight="" exportpng="" measuretools="" legend="" legendasimage=""/>
    <!--<mapoptions projection="EPSG:2154" extent="145518,6726671,372058,6868691"  />-->
    <mapoptions maxzoom="18" projection="EPSG:3857" center="-403013.39038929436,6128402.399153711" zoom="8" projextent="-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244" />
   
	<baselayers style="gallery"><!-- style="default"||gallery" -->            		
        <baselayer  type="WMTS" id="ortho1" label="Photo aérienne actuelle" title="GéoPortail" maxscale="1000" thumbgallery="img/basemap/ortho.jpg"
            url="../wmts" layers="ORTHOIMAGERY.ORTHOPHOTOS" format="image/jpeg" visible="false" fromcapacity="false"
            attribution="&lt;a href='http://www.geoportail.fr/' target='_blank'>&lt;img src='http://api.ign.fr/geoportail/api/js/latest/theme/geoportal/img/logo_gp.gif'>&lt;/a>" style="normal" matrixset="PM" maxzoom="22"/>
        <baselayer  type="WMS" id="photo2" label="Photo aérienne 1950" title="GéoBretagne" thumbgallery="img/basemap/ortho-ancien.jpg" 
			url="http://tile.geobretagne.fr/gwc02/service/wms" layers="satellite-ancien" format="image/jpeg" visible="false" 
			attribution="&lt;a href='http://applications.region-bretagne.fr/geosource/apps/search/?uuid=048622c5-b333-4c2b-94ec-40a41608dc06' target='_blank' >Partenaires GéoBretagne - IGN&lt;/a>"/>      
    </baselayers> 

    <proxy url="../proxy/?url="/>

    <olscompletion url="http://api-adresse.data.gouv.fr/search/" type="ban" attribution="API adresse.data.gouv.fr" />     
    <elasticsearch url="http://ows.region-bretagne.fr/kartenn/_search" geometryfield="geometry" linkid="search_id" querymode="fussy_like_this"/>
    <searchparameters bbox="true" localities="false" features="true"/>

    <themes> 
        <theme name="Inventaire du patrimoine"  collapsed="true" id="patrimoine">           
			<layer id="inventaire_patrimoine" name="Patrimoine régional" scalemin="0" scalemax="50000000" visible="false" tiled="true" namespace="rb"
				queryable="true" fields="denominati,titre,url" aliases="Nom,Description,Glad"
                useproxy="false"
                infoformat="text/html" featurecount="1"
				style=""
                filter=""
				url="http://ows.region-bretagne.fr/geoserver/rb/wms" 
				attribution="Service de l'inventaire : Région Bretagne" 
				metadata="http://applications.region-bretagne.fr/geosource/apps/search/?uuid=a7f46b47-42fc-49b7-9b49-c7c11aee0932"
				metadata-csw="http://applications.region-bretagne.fr/geosource/srv/fre/csw?SERVICE=CSW&amp;VERSION=2.0.2&amp;REQUEST=GetRecordById&amp;elementSetName=full&amp;ID=a7f46b47-42fc-49b7-9b49-c7c11aee0932"/>
			
        </theme>
    </themes>
	</config>









###Noeud application

Personnalisation de l'application (overriding)

####Prototype 

	 <application title="" logo=""  help="" panelfooterimage="" panelfooterheight="" exportpng="" measuretools="" legend="" legendasimage=""/>

####Attributs 

* **title**: Titre de l'application || Kartenn.
* **logo**: Url du logo || img/logo/bandeau_region.png.
* **description** : Description du panneau thématiques.
* **style**: style à utiliser || css/themes/default.css [ressource](https://themeroller.jquerymobile.com/)
* **help**: Url du fichier d'aide || aide_kartenn.pdf.
* **panelfooterimage**: Url du fichier image à utiliser en arrière plan du panel footer.
* **panelfooterheight**: Taille en pixels du footer du panel.
* **exportpng**: Enables map export as png file  true/false || false. Export is possible only with local layers (same origin) or with layers served with CORS.
* **legend**: Add button to show legend panel : true || false.
* **legendasimage**: if true, render the legend in canvas. By this way, it's possible export legend as png file : true/flase || false.
* **measuretools**: Enables measure tools and tools mode  true/false || false.

###Noeud mapoptions

Représente les configurations de base du visualiseur.

####Prototype 

	 <mapoptions maxzoom="" projection="" center="" zoom="" projextent="" />

####Attributs 

* **maxzoom**: Entier représentant le zoom maximum.
* **projection**: Projection EPSG des couches présentes sur le visualiseur.
* **zoom**: Zoom initial du visualiseur
* **projextent**: Etendue de la projection 

###Noeud baselayers

Représente la galerie des fonds de plan

####Prototype 

        <baselayers style="">

####Attributs 

* **style**: Soit gallery/default.



####Noeud(s) enfant(s) de  baselayer(s) 

Représente les fonds de plan.

#####Prototype 

	
	<baselayer type="" id="" label="" title="" maxscale="" thumbgallery="" url="" layers="" format="" visible="" fromcapacity="" 
	attribution="" style="" matrixset="" maxzoom=""/>


#####Attributs 

* **type**: Type de flux OGC (OSM/WMTS/WMS)
* **id**: Identifiant du fond de plan
* **label**: Titre du fond de plan
* **title**: Sous-titre du fond de plan
* **maxscale**: Echelle max du fond de plan
* **thumbgallery**: Imagette pour le fond de plan ( dans le cas du style gallery).
* **url**: Url du service ogc
* **layers**: Nom de la ressource ogc
* **format**: Format image du fond de plan 
* **visible**: Visibilité du fond de plan
* **fromcapacity**: Attribut spécifique pour les fonds de plan WMTS. Permet la construction de layers à partir des capactiy.
* **attribution**: Imagette de copyright.
* **style** : Style de la couche
* **matrixset** : option spécifique au flux WMTS
* **maxzoom**: zoom maximum pour la couche.



###Proxy 

Lien vers votre proxy permmettant l'interrogation CROSS DOMAIN des couches.
Il n'y a pas besoin d'utiliser de proxy pour les données servies par GéoBretagne car CORS est activé (http://enable-cors.org/server.html)
Mviewer n'est pas fourni avec un proxy Ajax. L'application peut fonctionner avec le proxy de GeorChestra.
Un proxy cgi peut être utilisé. Plus de détail ici : [proxy] (https://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#WhydoIneedaProxyHost)

####Prototype

 
	<proxy url="" />
 

####Attributs

* **url**: Url vers votre proxy 


###olscompletion

Liens vers service d'autocomplétion et de géocodage.

####Prototype


	<olscompletion url="" [type=""] attribution="" />
    

####Attributs

* **url**: Url du service d'autocomplétion d'adresse
* **type**: Optional - Type de service utilisé geoportail ou ban - defaut = geoportail
* **attribution**: Attribution du service de geocodage

###elasticsearch

Liens vers un index elasticsearch. Cette fonctionnalité permet d'interroger un index Elasticsearch à partir d'une saisie libre example
"Port de Brest". Le résultat retourné est une collection de documents disposant d'un champ commun avec les entités géographiques servies par l'instance
WMS/WFS. Par convention les types elasticsearch ont le même nom que les couches wms/wfs.

####Prototype

	<elasticsearch url="" geometryfield="" linkid="" [querymode=""] />

####Attributs

* **url**: Url de l'API Search
* **geometryfield**: Nom du champ utilisé par l'instance elasticsearch pour stocker la géométrie
* **linkid**: Nom du champ  à utiliser côté serveur wms/wfs pour faire le lien avec la propriété _id des documents elasticsearch.
* **querymode**: Optional - Query mode used by elasticsearch to find results : fuzzy_like_this ou term - default = fuzzy_like_this.

###searchparameters

Options liées à à la recherche d'adresse (olscompletion) et à la recherche d'entités (elasticsearch).

####Prototype

	<searchparameters [bbox=""] [localities=""] [features=""]/>

####Attributs

* **bbox**: Optional - Recherche d'adresse et/ou d'entités dans l'emprise de la carte : true ou false - defaut = false
* **localities**: Optional - Utilisation du service d'adresse olscompletion : true ou false - defaut = true
* **features**: Optional - Utilisation du service de recherche d'entités elasticsearch : true ou false - defaut = true.

###Noeud themes

Noeud regroupant les couches par thèmes.

####Prototype

	<themes>

####Noeud(s) enfant(s) theme

Noeud enfant décrivant un thème 

#####Prototype 

	<theme name="" id="" collapsed="">

#####Attributs
	
* **name**: Nom du thème
* **id**: Identifiant du thème

######Noeud(s) enfant(s) layer

Noeud enfant de theme décrivant une couche.

#######Prototype

	<layer id="" name="" scalemin="" scalemax="" visible="" tiled="" namespace=""
	queryable="" fields="" aliases=""
    type=""
    filter=""
    searchable=""
    searchid=""
    useproxy=""
    secure=""
	infoformat="" featurecount=""
	style=""
    stylesalias=""
    timefilter="" 
    timeinterval="" 
    timecontrol="" 
    timemin="" 
    timemax=""
    opacity=""
    legendurl=""
	url=""
	attribution=""
	metadata=""
	metadata-csw="" />
	</theme> 

#######Attributs

* **id**: Id de la couche
* **name**: Nom de la couche
* **type**: Type de la couche (wms|geojson|kml|hook) default=wms. Si hook est définit, il faut instancier un Layer OpenLayers dans un fichier javascript ayant pour nom l'id de la couche.
Ce fichier js doit être placé dans le répertoire hooks/
* **scalemin**: Echelle minimum de la couche
* **scalemax**: Echelle maximum de la couche
* **visible**:  Booléen stipulant est ce que la couche est actuellement visible
* **tiled**: Booléen stipluant est ce que la couche est tuilée
* **namespace**: Namespace où est située la couche
* **queryable**: Booléen stipulant est ce que la couche est intérrogeable via un GetFeatureInfo
* **filter**: Expression CQL permettant de filtrer la couche ex: insee=35000 Ou INTERSECT(the_geom, POINT (-74.817265 40.5296504)) [tutorial] (http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html#cql-tutorial)
* **searchable**: Booléen précisant si la couche est interrogeable via la barre de recherche
* **searchid**: Nom du champ à utiliser côté WMS afin de faire le lien avec l'_id elasticsearch
* **iconsearch**: Lien vers l'image utilisée pour illustrer le résultat d'une recherche ElasticSearch
* **useproxy**: Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de de crossOrigin lorsque CORS n'est pas activé sur le serveur distant.
* **fields**: Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à parser pour générer la vignette
* **aliases**: Si les informations retournées par l'interrogation est au format GML, aliases représente le renommage des champs parsés.
* **secure**: Précise si la couche est protégée ( méchanisme geoserver ) auquel cas un test est affectué pour savoir si la couche est accessible. SI ce n'est pas le cas, la couche est retirée du panneau et de la carte.
* **infoformat**: Format du GetFeatureInfo. 2 formats sont supportés : text/html et application/vnd.ogc.gml
* **featurecount**: Nombre d'éléments retournés lors de l'intérrogation
* **style**: Style(s) de la couche. Si plusieurs styles , utiliser la virgule comme séparateur.
Si la couche est de type wms, il faut faire référence à un style sld.
Si la couche est de type geojson, il faut faire référence à un style définit dans lib/featurestyles.js
Si la couche est de type hook, le style n'est pas défini ici.
* **stylealias**: Titres à utiliser pour chaques style. utiliser la virgule comme séparateur si plusieurs styles.
* **timefilter**: Booléen précisant si la dimension temporelle est activée pour cette couche. Voir (http://docs.geoserver.org/latest/en/user/services/wms/time.html)
* **timeinterval**: day|month|year
* **timecontrol**: calendar|slider 
* **timemin**: Date mini format : "yyyy-mm-dd" 
* **timemax**: Date mini format : "yyyy-mm-dd" 
* **customcontrols**: Booléen. Si actif, il faut déposer un fichier js et un fichier html ayant pour nom l'id de la couche dans le répertoire controls.
La structure du js doit être la suivante : (../controls/model.js)
Ce fichier js doit être placé dans le répertoire hooks/
* **opacity**: Opacité de la couche (1 par défaut)
* **legendurl**: url premettant de récupérer la légende. Si non défini, c'est un getFeatureLegend qui est effectué.
* **url**: URL de la couche
* **attribution**: Copyright de la couche.
* **metadata**: Lien vers la fiche de metadonnées complète
* **metadata-csw**: Requête CSW pour l'affiche dans la popup du détail de la couche.

Utilisation		
-----------

###Paramètres d'URL

Il est possible d'instancier un mviewer avec des paramètres transmis par URL

* **config**: Fichier de configuration à charger ex: mviewer/?config=demo/l93.xml
* **theme**: Theme css à utiliser ex: ?theme=geobretagne pour charger le theme doit être dans css/themes/geobretagne.css.
* **wmc**: liste des contextes OGC WMC (séparés par des virgules) à charger afin d'alimenter le panel de gauche ex: mviewer/?wmc=demo/hydro.wmc
* **popup**: true ou false. Si true, Une popup s'affiche sur la carte afin d'afficher le résultat de l'interrogation de couches.
