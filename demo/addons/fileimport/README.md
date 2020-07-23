## Import de fichier

Cette extension permet d'importer des fichiers.

#### 4 ressources dans cette extension

 - **fileimport.html** contient un bouton qui est affiché dans la `toolstolsbar` sur la carte par défaut
 - **fileimport.css** définit l'affichage du bouton
 - **fileimport.js** - contient la logique de l'import
 - **config.json** - indique les trois fichiers précédents à mviewer ainsi que la **div** où le composant doit s'afficher (**target**),
 par défaut `toolstoolbar`.
 
Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

````
<extensions>
    <extension type="component" id="fileimport" path="demo/addons" />
</extensions>
 ````

Plus d'info sous : https://mviewerdoc.readthedocs.io/fr/latest/doc_tech/config_customcomponent.html

L'extension a également besoin de la définiton d'une couche du `type="import"` dans la **config.xml**.
Cette définition ne doit pas contenir l'attribut `url` pour provoquer l'ouverture d'un dialog modal.

Exemple :

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

La fonctionnalité de cette extension peut être utilisée par son composant ou directement via l'arbre des couches.
