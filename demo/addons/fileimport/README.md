## Import de fichier

Cette extension permet d'importer des fichiers de façon temporaire (en local) des fichiers au format `csv` ou `shp`. 
Les données importées ne sont pas sauvegardées et seront perdues à la fermeture du navigateur.
Dans le cas du Shapefile, le fichier `.shp` doit se trouver compressé dans un fichier `.zip` qui inclut également 
un fichier `.dbf` encodé en UTF-8 (pour les attributs) et `.prj` (pour permettre l'interprétation du SRS à l'extension).
En cas d'absence du fichier `.prj` l'utilisateur est sollicité d'indiquer le SRS.

#### 4 ressources dans cette extension

 - **fileimport.html** contient un bouton qui est affiché dans la `toolstolsbar` sur la carte par défaut et peut-être placé dans un autre endroit de choix via la **config.json**
 - **fileimport.css** définit l'affichage du bouton
 - **fileimport.js** - contient la logique de l'import
 - **config.json** - indique les trois fichiers précédents à mviewer ainsi que la **div** où le composant du bouton doit s'afficher (**target**),
 par défaut `toolstoolbar`.

### Déclaration de l'extension dans config.xml

Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

````
<extensions>
    <extension type="component" id="fileimport" path="demo/addons" />
</extensions>
 ````

Plus d'info sous : https://mviewerdoc.readthedocs.io/fr/latest/doc_tech/config_customcomponent.html

### Déclaration d'une couche 'import' dans config.xml

L'extension a également besoin de la déclaration d'une couche du `type="import"` dans la **config.xml**.
Pour rendre l'import disponible dans l'IHM de mviewer il faut laisser l'attribut `url` dans la déclaration de la couche vide.
Si l'attribut `url` est présent le fichier est directement importé (seulement possible pour le format CSV avec une adresse).

Les attributs (et l'élément) suivant sont spécifiques à cette extension :

````
<layer
    ...
    geocoder=""
    geocodingfields=""
    xfield=""
    yfield=""
    ... >
    <projections>
        <projection proj4js=""/>
    </projections>
</layer>
````

Pour les couches csv (avec adresse, mais sans coordonnées) :
* ``geocoder`` : précise l’API de géocodage à utiliser (ban).
* ``geocoderurl`` (optionnel) : permet de overrider l'url par défaut du geocoder 
* ``geocodingfields`` : précise les champs utilisables pour le géocodage.
* ``xfield`` : précise le champ du service de géocodage à utiliser pour la longitude.
* ``yfield`` : précise le champ du service de géocodage à utiliser pour la latitude.

Pour les couches csv (avec coordonnées) :
* ``projections`` (élément) : précise les projections disponible pour une transformation des coordonnées.
La définition de chaque projection se fait dans un élément enfant ``<projection proj4js=""/>`` qui contient la chaîne de caractère proj4js comme attribut.
Par défaut le SCR WGS84 (EPSG:4326) est supporté. L'import d'un shapefile n'utilise pas cette définition, mais l'obtient directement du fichier `.prj`.

Exemple qui rend disponible l'IHM de l'extension, permettant l'import `shp` et `csv` (avec des coordonnées en `EPSG:4326`,`EPSG:3857` ou `EPSG:2154` 
ou avec adresse et sans coordonnées) :

````
<layer type="import" id="import_file" name="Importer un fichier"  visible="true"
    legendurl="img/blank.gif"
    queryable="true"
    vectorlegend="true"
    geocoder="ban"
    xfield="longitude"
    yfield="latitude"
    expanded="true">
    <projections>
        <projection proj4js="'EPSG:3857','+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'"/>
        <projection proj4js="'EPSG:2154','+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'"/>
    </projections>
</layer>
````

L'IHM de l'import peut être accédé par le bouton du composant custom ou directement via l'arbre des couches.
