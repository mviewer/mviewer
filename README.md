MVIEWER
=============

Visualiseur géographique [Kartenn](http://kartenn.region-bretagne.fr/kartoviz/) basé sur OpenLayers 5.3.0 et Bootstrap 3.3.6

[Versions] (https://github.com/geobretagne/mviewer/releases/)

[Démos] (http://kartenn.region-bretagne.fr/kartoviz/demo/)

[Documentation] (http://mviewerdoc.readthedocs.io/fr/latest/)

[Générateur d'applications] (https://github.com/geobretagne/mviewerstudio/)


Feuille de route
-----------
https://github.com/geobretagne/mviewer/wiki/Feuille-de-route

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

### Exemple

    <?xml version="1.0" encoding="UTF-8"?>
    <config>
    <application title="" logo="" help="" showhelp="" style="" exportpng="" measuretools="" legend="" stats="" statsurl="" coordinates=""/>
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
    <searchparameters bbox="true" localities="false" features="true" static="layer1"/>

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



### Nœud application

Personnalisation de l'application (overriding)

#### Prototype

     <application title="" logo=""  help="" showhelp="" titlehelp="" iconhelp="" style="" exportpng="" measuretools="" stats="" statsurl="" coordinates=""/>

#### Attributs

* **title**: Titre de l'application || Kartenn.
* **logo**: Url du logo || img/logo/bandeau_region.png.
* **help**: Url vers l'aide (fichier html).
* **showhelp**: Affiche l'aide au démarrage  true/false || false.
* **titlehelp**: Titre de la fenêtre modale aide || Documentation.
* **iconhelp**: Icône du bouton de la fenêtre modale aide (les valeurs possibles sont disponibles sur https://fontawesome.com/icons)  || ?.
* **style**: style à utiliser || css/themes/default.css [ressource](https://themeroller.jquerymobile.com/)
* **exportpng**: Enables map export as png file  true/false || false. Export is possible only with local layers (same origin) or with layers served with CORS.
* **geoloc**: Enables map geolocation true/false || false. Need https connection.
* **measuretools**: Enables measure tools and tools mode  true/false || false.
* **stats**: Enables stats mode  true/false || false.
* **statsurl**: url to send stats activity eg (login, ip, application title, date).
* **coordinates**: Affiche les coordonnées GPS lors de l'interrogation true/false || false.
* **togglealllayersfromtheme**: Ajoute un bouton dans le panneau de gauche pour chaque thématique afin d'afficher/masquer toutes les couches de la thématique. Valeur : true/false || false.
* **studio**: Lien vers le mviewerstudio pour modifier la carte en cours
* **home**: Lien vers le portail de l'éditeur de la carte
* **mapfishurl**: Lien permettant d'afficher les couches courantes visibles vers un mapfishapp cible
* **hideprotectedlayers**: Indique si les couches protégées doivent être masquées dans l'arbre des thématiques lorsque l'utilisateur n'y a pas accès. Valeur : true/false (true par défaut).
* **lang**: Langue à utiliser pour l'interface. Passer "?lang=en" dans l'url pour forcer la langue et ignorer la config. Par défaut, lang n'est pas activé. Le fichier [mviewer.i18n.json](mviewer.i18n.json) contient les expressions à traduire dans différentes langues. Pour traduire le texte d'un élément html, il faut que cet élément dispose d'un attribut i18n=`texte.a.traduire`. En javascript la traduction s'appuie sur la méthode `mviewer.tr("texte.a.traduire")`.
* **langfile**: URL du fichier de traduction supplémentaire à utiliser en complément de mviewer.i18n.json.

### Nœud mapoptions

Représente les configurations de base du visualiseur.

#### Prototype

     <mapoptions maxzoom="" projection="" center="" zoom="" projextent="" />

#### Attributs

* **maxzoom**: Entier représentant le zoom maximum.
* **projection**: Projection EPSG des couches présentes sur le visualiseur.
* **zoom**: Zoom initial du visualiseur
* **rotation**: Active la possibilité de rotation de la carte (par defaut false). Si activé ajout du bouton Nord.
* **projextent**: Etendue de la projection

### Nœud baselayers

Représente la galerie des fonds de plan

#### Prototype

        <baselayers style="">

#### Attributs

* **style**: Soit gallery/default.



#### Nœud(s) enfant(s) de  baselayer(s)

Représente les fonds de plan.

##### Prototype


    <baselayer type="" id="" label="" title="" maxscale="" thumbgallery="" url="" layers="" format="" visible="" fromcapacity=""
    attribution="" style="" matrixset="" maxzoom=""/>


##### Attributs

* **type**: Type de flux OGC (OSM/WMTS/WMS/fake)
* **id**: Identifiant du fond de plan
* **label**: Titre du fond de plan
* **title**: Sous-titre du fond de plan
* **maxscale**: Echelle max du fond de plan
* **thumbgallery**: Imagette pour le fond de plan (dans le cas du style gallery).
* **url**: Url du service ogc
* **tiled**: Indique si le paramètre "TILED=true" doit être inséré dans les requêtes WMS (pour des couches disponibles en WMS-C). Valeur par défaut : true.
* **layers**: Nom de la ressource ogc
* **format**: Format image du fond de plan
* **visible**: Visibilité du fond de plan
* **fromcapacity**: Attribut spécifique pour les fonds de plan WMTS. Permet la construction de layers à partir des capactiy.
* **attribution**: Imagette de copyright.
* **style** : Style de la couche
* **matrixset** : option spécifique au flux WMTS
* **maxzoom**: zoom maximum pour la couche.



### Proxy

Lien vers votre proxy permmettant l'interrogation CROSS DOMAIN des couches.
Il n'y a pas besoin d'utiliser de proxy pour les données servies par GéoBretagne car CORS est activé (http://enable-cors.org/server.html)
Mviewer n'est pas fourni avec un proxy Ajax. L'application peut fonctionner avec le proxy de GeorChestra.
Un proxy cgi peut être utilisé. Plus de détail ici : [proxy] (https://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#WhydoIneedaProxyHost)

#### Prototype


    <proxy url="" />


#### Attributs

* **url**: Url vers votre proxy


### olscompletion

Liens vers service d'autocomplétion et de géocodage.

#### Prototype


    <olscompletion url="" [type=""] attribution="" />


#### Attributs

* **url**: Url du service d'autocomplétion d'adresse
* **type**: Optional - Type de service utilisé geoportail ou ban - defaut = geoportail
* **attribution**: Attribution du service de geocodage

### elasticsearch

Liens vers un index Elasticsearch. Cette fonctionnalité permet d'interroger un index Elasticsearch à partir d'une saisie libre example
"Port de Brest". Le résultat retourné est une collection de documents disposant d'un champ commun avec les entités géographiques servies par l'instance
WMS/WFS. Par convention les types Elasticsearch ont le même nom que les couches wms/wfs.

La recherche basée sur Elasticsearch n'est active que pour les couches dont les attributs "searchable" et "searchengine"
valent respectivement "true" et "elasticsearch". Cette recherche n'est active qu'avec au moins l'une des 2 options de
recherche suivantes active : "features" et "static".

#### Prototype

    <elasticsearch url="" geometryfield="" linkid="" [querymode=""] [doctypes=""] [version=""]/>

#### Attributs

* **url**: Url de l'API Search
* **geometryfield**: Nom du champ utilisé par l'instance Elasticsearch pour stocker la géométrie
* **linkid**: Nom du champ  à utiliser côté serveur wms/wfs pour faire le lien avec la propriété _id des documents Elasticsearch.
* **querymode**: Optional - Query mode used by Elasticsearch to find results : match ou term ou phrase - default = match.
* **doctypes**: Optional - types des documents Elasticsearch à requêter systématiquement, indépendamment des couches affichées.
* **version**: version de l'instance Elasticsearch. current||1.4 . Défault = "current".

### fuse

Fuse est une bibliothèque javascript utilisée par mviewer pour indexer le contenu de couches de données vecteur légères
(cf. http://fusejs.io/). Elle donne une alternative plus simple et économique que la mise en œuvre d'index
Elasticsearch. Contrairement à ce dernier, le paramétrage de Fuse ne fait pas l'objet d'un nœud spécifique. Son
paramétrage est réalisé directement au niveau des nœuds des couches concernées à l'aide des attributs "searchable",
"searchengine", "fusesearchkeys" et "fusesearchresult".

La recherche basée sur Fuse n'est active que pour les couches dont les attributs "searchable" et "searchengine"
valent respectivement "true" et "fuse". Cette recherche n'est active que lorsque l'option de recherche suivante est
active : "features".

### searchparameters

Options liées à la recherche d'adresse (olscompletion) et à la recherche d'entités (elasticsearch ou fuse).

#### Prototype

    <searchparameters [bbox=""] [inputlabel=""] [localities=""] [features=""] [static=""] [querymaponclick=""] [closeafterclick=""]/>

#### Attributs

* **bbox**: Optional - Recherche d'adresse et/ou d'entités dans l'emprise de la carte : true ou false - defaut = false.
Cette option ne fonctionne pas actuellement avec la recherche "fuse" (aucun filtre géographique n'est pour l'instant
appliquer à ce type de recherche) ni avec la recherche BAN (cette option donne un poids plus important aux localités à
proximité du centre de la carte mais n'applique pas réellement de filtre géographique).
* **inputlabel**: Texte à utiliser pour le placeholder de la zone de saisie de la barre de recherche. default = "Rechercher".
* **localities**: Optional - Utilisation du service d'adresse olscompletion : true ou false - defaut = true
* **querymaponclick**: Optional - Interroge la carte après sélection d'un résultat : true ou false - defaut = false
* **closeafterclick**: Optional - Ferme la liste des résultats de recherche après avoir sélectionné un item : true ou false - defaut = false
* **features**: Optional - Utilisation du service de recherche d'entités (recherches s'appuyant sur Elasticsearch ou
Fuse) : true ou false - defaut = true.
* **static**: Optional - En lien avec le paramètre **doctypes**. Active ou désactive la recherche associée à des
documents requêtés systématiquement, indépendamment des couches affichées : true ou false - defaut = false.

### Nœud themes et sous thèmes

Nœud regroupant les couches par thèmes et sous-thèmes.

#### Prototype

    <themes mini="">

#### Attributs

* **mini**: Booléen qui précise si le panneau de gauche est réduit à l'ouverture de l'application. Défaut = false.

### Nœud(s) enfant(s) theme

Nœud enfant décrivant un thème

#### Prototype

    <theme name="" id="" collapsed="" icon="" url="">

#### Attributs

* **name**: Nom du thème
* **id**: Identifiant du thème
* **url**: URL de la thématique. Des thèmes externes (présents dans d'autres configuration peuvent être automatiquement chargés par référence au fichier xml utilisé (url=) et à l'id de la thématique (id=). Attention si la configuration externe est sur un autre domaine, il faut alors utiliser un proxy Ajax ou alors s'assurer que CORS est activé sur le serveur distant. Les thématiques externes peuvent utiliser des ressources particulières (templates, customLayer, sld...) si les URLs de ces ressources sont absolues et accessibles.
* **icon*: "icone à utiliser pour symbolyser la thématique. Les icônes "free" de fontawesome peuvent être utilisée. Il faut alors utiliser la classe de l'icône exemple "fas fa-scholl". https://fontawesome.com/icons/school?style=solid. Une autre possibilité est d'uliser une classe css personnelle mobilisant une image. Il faut alors mettre la classe précédée d'un point comme valeur. exemple ".monicon-svg"
* **colapsed**:  La thématique est condensée dans le panneau de gauche true ou false - defaut = true. Une seule thématique peut avoir la valeur false.


### Nœud(s) enfant(s) group

Nœud enfant de theme décrivant un sous-groupe.

#### Prototype

    <group id="" name="">

### Nœud(s) enfant(s) layer

Nœud enfant de theme ou group décrivant une couche.

#### Prototype

    <layer id="" name="" scalemin="" scalemax="" visible="" tiled=""
    queryable="" fields="" aliases=""
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
    infoformat="" featurecount=""
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
    opacity=""
    legendurl=""
    dynamiclegend=""
    vectorlegend=""
    url=""
    attribution=""
    tooltip=""
    tooltipenabled=""
    expanded=""
    metadata=""
    metadata-csw="" />
    <template url=""/>
    </theme>

#### Attributs

* **id**: Id de la couche.
* **name**: Nom de la couche.
* **type**: Type de la couche (wms|geojson|kml|customlayer|csv) default=wms. Si customlayer est défini, il faut instancier
un Layer OpenLayers dans un fichier javascript ayant pour nom l'id de la couche.
Ce fichier js doit être placé dans le répertoire customlayers.
* **scalemin**: Echelle minimum de la couche.
* **scalemax**: Echelle maximum de la couche.
* **visible**:  Booléen stipulant si la couche est actuellement visible.
* **tiled**: Booléen stipluant si la couche est tuilée.
* **queryable**: Booléen stipulant si la couche est intérrogeable via un GetFeatureInfo.
* **filter**: Expression CQL permettant de filtrer la couche.
Exemple : insee=35000 ou INTERSECTS(the_geom, POINT (-74.817265 40.5296504))
[tutorial] (http://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html#cql-tutorial).
* **searchable**: Booléen précisant si la couche est interrogeable via la barre de recherche.
* **searchengine**: elasticsearch|fuse. Défault=elasticsearch.
* **searchid**: Nom du champ à utiliser côté WMS afin de faire le lien avec l'_id elasticsearch.
* **fusesearchkeys**: Chaîne de caractères contenant le liste des champs de la couche à indexer pour la
recherche. Les noms des champs doivent être séparés par des virgules. A n'utiliser que si searchengine = fuse.
* **fusesearchresult**: Chaîne de caractères décrivant l'information à afficher dans les résultats de recherche.
Cette chaîne contient soit le nom d'un champ de la couche soit un template Mustache combinant plusieurs noms de champs.
Exemple : "{{name}} ({{city}})". A n'utiliser que si searchengine = fuse.
* **iconsearch**: Lien vers l'image utilisée pour illustrer le résultat d'une recherche ElasticSearch.
* **useproxy**: Booléen précisant s'il faut passer par le proxy ajax (nécessaire pour fixer les erreurs de crossOrigin
lorsque CORS n'est pas activé sur le serveur distant.
* **fields**: Si les informations retournées par l'interrogation est au format GML, fields représente les attributs à
parser pour générer la vignette.
* **aliases**: Si les informations retournées par l'interrogation est au format GML, aliases représente le renommage
des champs parsés.
* **tooltip**: Pour les couches de type vecteur uniquement. Booléen précisant si les entités de la couche sont
affichées sous forme d'infobulle au survol de la souris. Les infobulles ne fonctionnent qu'avec une seule couche à la
fois. Valeur par défaut = false.
* **tooltipenabled**: Précise la couche prioritaire pour l'affichage des infobulles.
* **tooltipcontent**: Chaîne de caractères décrivant l'information à afficher dans les infobulles.
Cette chaîne contient soit le nom d'un champ de la couche soit un template Mustache combinant plusieurs noms de champs.
Exemple : "{{name}} ({{city}})". A n'utiliser que si les infobulles sont activées sur cette couche
(cf. paramètre tooltip)). Paramètre optionnel.
* **secure**: Précise si la couche est protégée : public|global|layer
- public (ou paramètre absent), l'accès à la couche est public
- global, l'accès à la couche est contrainte par le CAS geoserver. Un test est affectué pour savoir
si la couche est accessible. Si ce n'est pas le cas, la couche est retirée du panneau et de la carte.
- layer : l'accès à la couche nécessite une authentification sur le service (WMS).
Un bouton "cadenas" est ajouté dans la légende pour cette couche. Au clic sur ce bouton, un formulaire
est affiché permettant de saisir des identifiants d'accès qui seront envoyés à chaque appel au service.
* **authorization**: Permet d'indiquer des identifiants par défaut si secure est à "layer"
* **toplayer**: Précise si la couche demeure figée". Booléen. Défaut = true.
* **exclusive**:  Si ce paramètre à la valeur true, l'affichage de la couche exclusive entrainera automatiquement le masquage de toute autre couche ayant également le paramètre exclusive. Booléen. Défaut = false.
* **infoformat**: Format du GetFeatureInfo. 2 formats sont supportés : text/html, application/vnd.ogc.gml (pour
GeoServer et MapServer), application/vnd.esri.wms_raw_xml ou application/vnd.esri.wms_featureinfo_xml (pour ArcGIS
Server).
* **featurecount**: Nombre d'éléments retournés lors de l'interrogation.
* **style**: Style(s) de la couche. Si plusieurs styles , utiliser la virgule comme séparateur.
Si la couche est de type wms, il faut faire référence à un ou plusieurs styles sld internes (Présents dans les capacités de la couche).
Si la couche est de type geojson, il faut faire référence à un style défini dans lib/featurestyles.js.
Si la couche est de type customlayer, le style n'est pas défini ici.
* **sld**: Style(s) externes de la couche. Si plusieurs styles , utiliser la virgule comme séparateur. S'applique uniquement aux layers WMS. Il faut indiquer l'URL résolvable par le serveur WMS du ou des sld.
* **stylesalias**: Titres à utiliser pour chaque style. Utiliser la virgule comme séparateur si plusieurs styles. Valable aussi pour les sld.
* **timefilter**: Booléen précisant si la dimension temporelle est activée pour cette couche. Voir
(http://docs.geoserver.org/latest/en/user/services/wms/time.html).
* **timeinterval**: day|month|year
* **timecontrol**: calendar|slider|slider-range
* **timevalues**: Valeurs séparées par des virgules. A utiliser avec le controle slider pour des valeurs non
régulières ex (1950, 1976, 1980, 2004).
* **timemin**: Date mini format : "yyyy-mm-dd"
* **timemax**: Date mini format : "yyyy-mm-dd"
* **attributefilter**: Booléen précisant si on active la sélection attributaire par menu déroulant.
* **attributefield**: Nom du champ à utiliser avec le contrôle attributefilter.
* **attributevalues**: Valeurs séparées par des virgules.
* **attributeoperator**: Opérateur utilisé pour construire le filtre. (=|like). Defaut = "=". Attention dans le cas de like, le wildcard est harcodé : %
* **attributelabel**:  Texte à afficher pour la liste déroulante associée.
* **attributestylesync**: Booléen qui précise s'il convient d'appliquer un style (sld) spécifique lors du filtrage
attributaire. Dans ce cas la convention est la suivante pour le nommage des styles à utiliser : nom_style@attributevalue ou url_style_externe@attributevalue.sld
* **attributefilterenabled**: Booléen précisant si le filtre est activé par défaut (avec la première valeur de la liste
attributevalues).
* **customcontrol**: Booléen précisant si la couche dispose d'un addon html à intégrer. La valeur par défaut est false.
* **customcontrolpath**: Texte Précisant le répertoire hébergeant les fichiers nécessaires au contrôle. Dans ce
répertoire, il faut déposer un fichier js et un fichier html ayant pour nom l'id de la couche.
La structure du js doit être la suivante : (../controls/epci.js). Valeur par défaut = customcontrols.
* **opacity**: Opacité de la couche (1 par défaut).
* **legendurl**: url premettant de récupérer la légende. Si non défini, c'est un getFeatureLegend qui est effectué.
* **dynamiclegend**: Booléen précisant si la légende est liée à l'échelle de la carte et si elle nécessite d'être
actualisée à chaque changement d'échelle de la carte.
* **vectorlegend**: Booléen précisant si la légende pour les couches de type vecteur (customlayer ou csv) est dynamiquement créée
* **nohighlight**: Booléen précisant, pour les couches de type vecteur (customlayer, geojson ou csv), si la mise en surbrillance est désactivée
* **url**: URL de la couche.
* **attribution**: Copyright de la couche.
* **expanded** : Booléan précisant si le panneau de la couche est agrandi au démarrage. La valeur par défaut est false.
* **metadata**: Lien vers la fiche de metadonnées complète.
* **metadata-csw**: Requête CSW pour l'affiche dans la popup du détail de la couche.
* **geocoder**: pour les couches de type csv, précise l'API de géocodage à utiliser (ban).
* **geocodingfields**: pour les couches de type csv, précise les champs utilisables pour le géocodage.
* **xfield**: pour les couches de type csv, précise le champ à utiliser pour la longitude.
* **yfield**: pour les couches de type csv, précise le champ à utiliser pour la latitude.


#### Nœud enfant template

Nœud enfant de layer décrivant un template Mustache.

* **template**: contient le template type Mustache (https://github.com/janl/mustache.js) à appliquer à la fiche
d'information. Pour fonctionner, il faut que le paramètre **infoformat** ait la valeur "application/vnd.ogc.gml" (pour
GeoServer et MapServer), voire "application/vnd.esri.wms_raw_xml" ou "application/vnd.esri.wms_featureinfo_xml" (pour
ArcGIS Server). Le template peut être un fichier statique ex templates/template1.mst ou directement saisi dans le nœud
<template> avec les balises <![CDATA[ ]]>.


Utilisation
-----------

### Paramètres d'URL

Il est possible d'instancier un mviewer avec des paramètres transmis par URL

* **config**: Fichier de configuration à charger ex: mviewer/?config=demo/l93.xml
* **theme**: Theme css à utiliser ex: ?theme=geobretagne pour charger le theme doit être dans
css/themes/geobretagne.css.
* **wmc**: liste des contextes OGC WMC (séparés par des virgules) à charger afin d'alimenter le panel de gauche ex :
mviewer/?wmc=demo/hydro.wmc
* **popup**: true ou false. Si true, Une popup s'affiche sur la carte afin d'afficher le résultat de l'interrogation de
couches.
* **lang**: Langue à utiliser pour l'interface. Passer exemple "?lang=en".
* **mode**: Mode d'affichage à utiliser (d - default, s - simplifié, u - ultrasimplifié). Le mode simplifié ne dispose pas du panneau des thématiques et le mode ultra simplifié ne dispose pas de la barre de navigation.
* **title**: Titre à utiliser. Seulement exploité en mode défault et simplifié.
* **topics**: Thèmes à filtrer.