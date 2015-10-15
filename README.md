MVIEWER
=============

Visualiseur géographique [Kartenn](http://kartenn.region-bretagne.fr/mviewer/) basé sur OpenLayers 3.0.0 et Jquery mobile 1.4.0 inspiré d'un travail réalisé par Metz Métropole.

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
    <application title="" logo="" help="" exportpng="" measuretools="" legend"" />
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

    <olscompletion url="http://api-adresse.data.gouv.fr/search/" type="ban"/>     
    <elasticsearch url="http://ows.region-bretagne.fr/kartenn/_search" geometryfield="geometry" linkid="search_id" querymode="fussy_like_this"/>
    <searchparameters bbox="true" localities="false" features="true"/>

    <themes> 
        <theme name="Inventaire du patrimoine"  collapsed="true" id="patrimoine">           
			<layer id="inventaire_patrimoine" name="Patrimoine régional" scalemin="0" scalemax="50000000" visible="false" tiled="true" namespace="rb"
				queryable="true" fields="denominati,titre,url" aliases="Nom,Description,Glad"
                useproxy="false"
                infoformat="text/html" featurecount="1"
				style="" 
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

	 <application title="" logo=""  help="" exportpng="" measuretools=""/>

####Attributs 

* **title**: Titre de l'application || Kartenn.
* **logo**: Url du logo || img/logo/bandeau_region.png.
* **help**: Url du fichier d'aide || aide_kartenn.pdf.
* **exportpng**: Enables map export as png file  true/false || false. Export is possible only with local layers (same origin) or with layers served with CORS.
* **legend**: Add button to show legend panel : true || false.
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
* **fromcapacity**: Attribut spécifique pour les fonds de plan WMTS. Permet la construction de layers à partir des capactiy. (**A IMPLEMENTER **)
* **attribution**: Imagette de copyright.
* **style** : Style de la couche
* **matrixset** : option spécifique au flux WMTS
* **maxzoom**: zoom maximum pour la couche.



###Proxy 

Lien vers votre proxy permmettant l'interrogation des couches.

####Prototype

 
	<proxy url="" />
 

####Attributs

* **url**: Url vers votre proxy 


###olscompletion

Liens vers service d'autocomplétion et de géocodage.

####Prototype


	<olscompletion url="" [type=""] />
 

####Attributs

* **url**: Url du service d'autocomplétion d'adresse
* **type**: Optional - Type de service utilisé geoportail ou ban - defaut = geoportail

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
    useproxy=""
	infoformat="" featurecount=""
	style=""
    legendurl=""
	url=""
	attribution=""
	metadata=""
	metadata-csw="" />
	</theme> 

#######Attributs

* **id**: Id de la couche
* **name**: Nom de la couche
* **scalemin**: Echelle minimum de la couche
* **scalemax**: Echelle maximum de la couche
* **visible**:  Booléen stipulant est ce que la couche est actuellement visible
* **tiled**: Booléen stipluant est ce que la couche est tuilée
* **namespace**: Namespace où est située la couche
* **queryable**: Booléen stipulant est ce que la couche est intérrogeable via un GetFeatureInfo
* **useproxy**: Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de de crossOrigin lorsque CORS n'est pas activé sur le serveur distant.
* **fields**: Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à parser pour générer la vignette
* **aliases**: Si les informations retournées par l'interrogation est au format GML, aliasess représente le renommage des fields parsés.
* **infoformat**: Format du GetFeatureInfo.
* **featurecount**: Nombre d'élèments retournés lors de l'intérrogation
* **style**: Style de la couche
* **legendurl**: url premettant de récupérer la légende. Si non défini, c'est un getFeatureLegend qui est effectué.
* **url**: URL de la couche
* **attribution**: Copyright de la couche.
* **metadata**: Lien vers la fiche de metadonnées complète
* **metadata-csw**: Requête CSW pour l'affiche dans la popup du détail de la couche.


