# Plugin - ZoomToArea

Ce plugin permet à l'utilisateur de zoomer sur une zone d'intérêt sélectionnée préalablement dans une liste déroulante située en haut à droite du header mviewer. 

> **Attention** Pour le moment, ce plugin fonctionne uniquement avec des entités du type `polygon`.

Les entités disponibles dans la liste peuvent provenir : 

 - soit d'un flux `wfs` issue d'un catalogue de données  
 - soit d'un fichier au format `.geojson` disponible dans le dossier de l'application `apps/monapp/data`

## Activation du plugin dans le fichier de configuration .xml

**1. Utiliser un ID par Mviewer**

Nous vous conseillons d'utiliser un identifiant respectif à votre Mviewer :

```
<application
    id="zoomtoarea"

```

À l'image de certains plugins existants (filter), cet ID permettra de lier une configuration (fichier `config.json`) à un seul mviewer. Ainsi, un seul dossier et un seul fichier `config.json` pourra être utilisé pour configurer le plugin. Ce qui évite de dupliquer le dossier principal du plugin par mviewer. 

**2. Importer le plugin**

Comme tous les plugins, vous devez ajouter dans le fichier de configuration de votre mviewer une balise permettant de charger le plugin :

```
<extensions>
        <extension type="component" id="zoomToArea" path="demo/addons"/>
</extensions>
```
## Configuration du plugin
La configuration du plugin est accessible dans le fichier `config.json` du répertoire `addon/zoomToArea`. Ce répertoire peut être localisé différemment selon votre organisation.

**1. Déclarer les paramètres du plugin pour votre carte**

Pour commencer, vous devez ajouter votre ID de Mviewer sous la propriété  `"mviewer"`  indiquant ainsi que le plugin est paramétré pour la carte associée à l'ID :
```
{
	"js": ["zoomToArea.js"],
	"css": "style.css",
	"html":"zoomToArea.html",
	"target": "page-content-wrapper",
	"options":
		{
			"mviewer":
			{
				"idApp1":
					{
					...
					}
			},
			{
				"idApp2":
					{
					...
					}
			}
		}
}
```

**2. Configurer les paramètres du plugin**

Pour fonctionner, le plugin a besoin des paramètres suivants : 
```
"zoomtoarea":
	{
		"dataUrl": "apps/monapp/data/featuresZoom.geojson",
		"dataEPSG": "EPSG:4326",
		"fieldNameAreas": "name_feature",
		"fieldIdAreas": "id_feature",
		"fieldSortBy":"name_feature",
		"bufferSize": 5000,
		"selectLabel":"Sélectionner un territoire"
	}
```

 - `dataUrl` : Lien vers la couche de données (flux wfs ou couche geojson)
 - `dataEPSG` : Projection des données sources 
 - `fieldNameAreas` : Nom du champs où se trouve le nom des entités
 - `fieldIdAreas` : Nom du champs où se trouve l'id des entités 
 - `fieldSortBy` : Nom du champs pour ordonner les entités dans la liste déroulante (ordre croissant) 
 - `bufferSize`:  Valeur numérique définissant la taille du buffer réalisé autour des entités (permet de régler le niveau de zoom),
 - `selectLabel` : Label de la liste déroulante

## Exemple
Vous pouvez retrouver un exemple complet dans les dossiers suivants :
-   Fichier de configuration du plugin : demo/addons/zoomToArea/config.json
-   Fichier de configuration de la carte : demo/zoomtoarea.xml

Visible également sur la page des démonstrations mviewer.

## Astuces

**Afficher les contours sur la carte**

Ce plugin ne permet pas d'afficher la couche de données sur la carte. 

Si vous souhaitez visualiser les contours des polygones, vous pouvez intégrer la couche de données en tant que `layer` comme une couche classique. 

Si vous ne voulez pas afficher cette couche dans le menu thématique et la légende (aucune action possible pour l'utilisateur), vous pouvez activer le paramètre suivant à votre `layer` :

```
showintoc="false"
```

**Filtrer les entités d'une couche** 

A l'heure actuelle, il n'est pas possible de filtrer les entités sur lesquelles zoomer depuis le plugin. Vous devez préalablement créer une couche avec vos entités filtrées et les importer dans votre application `apps/monapp/data` en privilégiant la projection `EPSG:4326` dans la mesure du possible.

Il est ensuite nécessaire de pointer le plugin vers cette couche comme présenté auparavant.
