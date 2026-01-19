# Seasons-selector

Cette extension a été financée par Hytech Imaging sur les spécifications d'un besoin spécifique.

Merci à eux pour cette réalisation et le partage.

https://hytech-imaging.fr/

<img width="400" height="101" alt="image" src="https://github.com/user-attachments/assets/f9f5c629-d071-4f8d-a070-8638b7760afe" />



## Compatibilité

Cette extension a été réalisée et testée avec mviewer 3.x (< à v4 donc).
Cette extension n'a pas été testéée avec mviewer 4, il est donc possible que vous constatiez des anomalies avec mviewer >= v4.

## Présentation 
Cette extension permet de sélectionner une année et une saison au sein d'une interface unique pour un ensemble de couches WMS d'une application mviewer.

Les couches concernées doivent disposer de la dimension temporelle.

![general](./img/general_capture.png)

## Installation


L'extension est directement accessible dans le dépôt mviewer-addons.

### Ajouter l'extension

Comme toutes les autres extensions, dans votre fichier de configuration, rajoutez ce bloc en adaptant la valeur de la propriété path selon l'emplacement du répertoire de l'extension (ici, l'extension est localisée sous `addons/seasonsSelector`) :

```
    <extensions>
        <extension type="component" id="seasonsSelector" path="addons"/>
    </extensions>
```


## Description des interfaces

### Panneau principal

Cette extension dispose d'une fenêtre déplaçable dans le cadre de la carte uniquement (objet `#map`).

Ce panneau contient :

* une liste de choix pour l'année
* Des boutons de choix de la saison
* Une croix pour fermer la fenêtre
* Un bouton qui permet de réinitialiser aux valeurs par défaut

![panel](./img/panel.png)

### Badges de couche

Lorsqu'une année et une saison sont choisies, un badge est visible sous le titre de la couche au sein de la légende.


## Paramétrage du plugin

> Rappel : Ici, le plugin est localisé dans le répertoire `addons/seasonsSelector`.

Ce plugin est facilement configurable via le fichier `addons/seasonSelector/config.json`.

Il est également possible d'avoir une configuration par application mviewer (voir ci-dessous)

### Configuration par application

Pour utiliser une configuration par application, il est nécessaire d'ajouter dans la balise <application> la propriété id (dans le fichier de configuration XML).

utilisez ensuite cette identifiant dans le fichier config.json.

**Exemple :**

* dans le fichier de configuration XML de l'application

```
<application id="littosat_1">
```

* dans le fichier config.json de l'extension

```
{
    ...
    "options": {
        "littosat_1": {},
        "littosat_2": {}
    }
}
```

### Paramètres disponibles

| Paramètre          | Type       | Obligatoire | Valeurs possibles                       | Valeur par défaut | Description / Notes                                                                                                                                                                                                                                             | Exemple                                        |
| ------------------ | ---------- | :---------: | --------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `default`          | `object`   |     Non     | `{ year: number, season: string }`      | `{}`              | Définit l’année et la saison sélectionnées par défaut.                                                                                                                                                                                                          | `{ "year": 2023, "season": "11" }`             |
| `fromCapabilities` | `boolean`  |     Non     | `true \| false`                         | `false`           | Si `true`, les années sont récupérées via les **getCapabilities** des services des couches. Les saisons sont filtrées en comparant les valeurs retournées avec la configuration `seasons`. Si `false`, années et saisons doivent venir de `years` et `seasons`. | `true`                                         |
| `separator`        | `string`   |     Non     | —                                       | `null`            | Séparateur utilisé par une RegEx pour identifier l’année depuis les valeurs `TIME` retournées par les **getCapabilities**. Fonctionne uniquement si le format `TIME` est identique pour toutes les couches.                                                     | Pour `TIME=2023-11`, séparateur = `"-"`        |
| `timePattern`      | `string`   |  Oui `(!)`  | —                                       | —                 | Permet de construire le paramètre `TIME` en fonction du positionnement de `{year}` et `{season}` lors du clic sur une année/saison. Peut utiliser `separator`.                                                                                                  | `"{year}{separator}{season}"` → `TIME=2023-05` |
| `seasons`          | `object[]` |  Oui `(!)`  | Liste d’objets `{ id, label, value }`   | —                 | Liste des saisons affichées sous forme de boutons. Chaque objet définit : **id** (lien avec l’icône), **label** (nom), **value** (valeur utilisée pour le filtre `TIME`). Si une saison n’est pas présente, son bouton n’est pas affiché.                       | Voir ci-dessous                                |
| `layersId`         | `string[]` |  Oui `(!)`  | Liste d’identifiants de couches mviewer | —                 | Liste des couches concernées par le changement de saison ou d’année.                                                                                                                                                                                            | `["layer_1", "layer_2", "layer_3"]`            |


**Rappel des IDs de saisons (liés aux SVG) :**

| ID | Saison        |
| -: | ------------- |
|  0 | SVG Hiver     |
|  1 | SVG Printemps |
|  2 | SVG Été       |
|  3 | SVG Automne   |

**Exemple seasons :**

```
"seasons": [
  {"id": 1, "label": "Printemps", "value": "05"},
  {"id": 2, "label": "Eté",       "value": "08"},
  {"id": 3, "label": "Automne",   "value": "11"}
]
```

**Exemple layersId :**

```
"layersId": ["layer_1", "layer_2", "layer_3"]
```

## Exemple de configuration complète : 

```
{
    "type": "module",
    "js": [
        "js/main.js", "lib/jquery.easyDrag.min.js"
    ],
    "css": ["css/main.css"],
    "html": "seasons-selector.html",
    "target": "page-content-wrapper",
    "options": {
        "littosat_1": {},
        "littosat_2": {
            "default": {
                "year": 2023,
                "season": "08"
            },
            "fromCapabilities": true,
            "separator": "-",
            "timePattern": "{year}{season}",
            "seasons": [
                {"id":1, "label":"Printemps", "value": "05"},
                {"id":2, "label": "Eté", "value": "08"},
                {"id":3, "label": "Automne", "value": "11"}
            ],
            "layersId": ["layer_1", "layer_2", "layer_3"]
        }
    }
}
```