# Configurer - Principe

Le visualiseur cartographique mviewer consomme des données et des
services servis par le web (flux OGC WMS/WFS/WMTS, services de
géocodage...). La connexion et le paramétrage de ces services se fait
dans un fichier de configuration pivot qui permet en outre de
personnaliser l'application (titre, logo, feuille de style...).

Si aucune configuration n'est indiquée dans l'URL, c'est la
configuration par défaut qui s'applique ( **apps/default.xml**).

Il est possible de créer n fichiers de configuration (config1.xml,
config2.xml...) de façon à créer plusieurs applications thématiques à
partir d'une seule instance mviewer. Pour appeler une configuration
particulière, il suffit alors de rajouter le paramètre **config** dans
l'url, exemple
[?config=demo/geobretagne.xml](http://kartenn.region-bretagne.fr/kartoviz/?config=demo/geobretagne.xml)
.

Pour voir des **exemples d'applications et de fichiers de configuration
XML**, rendez vous à cette page :
[démos](http://kartenn.region-bretagne.fr/kartoviz/demo/).

En cliquant sur **Code**, vous accèderez au fichier XML et le le bouton
**Démo** vous permet de visualisation l'application.

## Structure du fichier de configuration

``` xml
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
```

## Paramètres d'URL

Il est possible d'instancier un mviewer avec des **paramètres** de
configuration transmis par URL

-   `config` : Fichier de configuration à charger ex:
    `mviewer/?config=apps/mon_appli.xml`.
-   `#` : Il s'agit d'un raccourci pour appeler une config présente dans
    le dossier apps. ex: `mviewer/#mon_appli`.
-   `theme` : Thème css à utiliser ex: `?theme=geobretagne` pour charger
    le theme doit être dans css/themes/geobretagne.css.
-   `wmc` : liste des contextes OGC WMC (séparés par des virgules) à
    charger afin d'alimenter le panel de gauche ex :
    `mviewer/?wmc=demo/hydro.wmc`
-   `popup` : true ou false. Si true, la page d'aide configurée
    s'affiche.
-   `lang` : Langue à utiliser pour l'interface. Passer exemple
    `?lang=en`.
-   `mode` : Mode d'affichage à utiliser (d - default, s - simplifié,
    u - ultrasimplifié). Le mode simplifié ne dispose pas du panneau des
    thématiques et le mode ultra simplifié ne dispose pas de la barre de
    navigation.
-   `title` : Titre à utiliser. Seulement exploité en mode défault et
    simplifié.
-   `topics` : Thèmes à filtrer à partir du fichier XML.
-   `q` et `qtype`: Rechercher une localité. Exemple pour centrer au
    démarrage la carte sur une adresse en utilisant la BAN (base adresse
    nationale) : `mviewer/?q=71 rue dupont des loges Rennes&qtype=ban`
-   `addLayer` : pour ajouter une couche WMS à la carte. ce paramètre
    prends comme valeur un objet **JSON** contenant
    -   `url` : url du service
    -   `name` : nom de la couche (layername)
    -   `title` : label/titre à afficher dans mviewer

exemple pour le paramètre **addLayer** :
`&addLayer={\%22url\%22:\%22https://www.geo2france.fr/geoserver/hdf_common/ows\%22,\%22name\%22:\%22Antennes__HdF_EnService_Agreg\%22,\%22title\%22:\%22Antennes_test\%22}`

### Paramètres d'URL utilisés pour les permaliens

-   `x` : Coordonnées x du centre de la carte dans le système de
    projection utilisé par l'application.
-   `y` : Coordonnées y du centre de la carte dans le système de
    projection utilisé par l'application.
-   `z` : Zoom de la carte (1 à 20).
-   `lb` : Identifiant de la couche de fond affichée.
-   `c_[monparam]` : Où mon param est l'identifiant du composant
    personnalisé ou de la couche personalisée. La valeur du paramètre
    peut ensuite être utilisée par le composant ou la couche concernée.
    exemple c_mycustomlayer=red,blue,green
-   Plus d'informations sur les permaliens [Outils additionnels](../doc_user/other_tools.md) menu Partage
    de carte

## Sections de configurations

-   Configurer l'application [Configurer - Application](config_app.md).
-   Configurer les extensions [Configurer - Extensions](config_extensions.md)
-   Configurer la carte [Configurer - les options de la carte](config_map.md).
-   Configurer les couches de fonds [Configurer - Les fonds de carte](config_baselayers.md).
-   Configurer les couches thématiques [Configurer - Les couches](config_layers.md).
-   Configurer la recherche [Configurer - La recherche](config_search.md).
-   Configurer le proxy [Configurer - Le proxy](config_proxy.md).
-   Configurer les paramètres d'URL [Configurer - Les paramètres d'URL](config_urlparams.md).
