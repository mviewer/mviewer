# littosat-mviewer-seasons-selector

Cette démonstration a été partagée par Hytech Imaging sur les spécifications d'un besoin spécifique.

Merci à eux pour cette réalisation et le partage.

https://hytech-imaging.fr/

<img width="400" height="101" alt="image" src="https://github.com/user-attachments/assets/f9f5c629-d071-4f8d-a070-8638b7760afe" />

## Présentation 
Cette extension permet de sélectionner une année et une saison au sein d'une interface unique pour un ensemble de couches WMS d'une application mviewer.

Les couches concernées doivent disposer de la dimension temporelle.

![general](./img/general_capture.png)

## Installation


### Via un clone directement

Le plugin peut être ajouté dans le répertoire `/apps` directement :

> remplacer [directory_name] par un nom de répertoire si souhaité ou supprimer cette valeur

git clone https://gitlab.hytech-imaging.fr/products/littosat/littosat-mviewer-seasons-selector.git [directory_name]


### Via un clone et un lien symbolique

Il peut également être un lien symbolique suite à un clone :

```
cd /home/user/git
git clone https://gitlab.hytech-imaging.fr/products/littosat/littosat-mviewer-seasons-selector.git
ln -s /home/user/git/littosat-mviewer-seasons-selector /var/www/mviewer/demo/littosat
```

> Adaptez les droits sur le répertoire si nécessaire

Ainsi, le contenu du module littosat est disponible depuis l'URL de votre mviewer via :

https://mviewer/demo/littosat/

Cette méthode permet de pouvoir modifier / remplacer le mviewer sans devoir déplacer ou re cloner le répertoire littosat.

### Ajouter l'extension

Dans votre fichier de configuration, rajoutez ce bloc en adaptant la valeur de la propriété path selon l'emplacement du répertoire cloné :

```
    <extensions>
        <extension type="component" id="seasons-selector" path="demo/littosat/addons"/>
    </extensions>
```

Dans cet exemple, le répertoire `demo/littosat` est un lien symbolique :

`/var/www/mviewer/demo/littosat -> /home/user/git/littosat-mviewer-seasons-selector`


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

Le plugin est localisé dans le répertoire `addons/seasons-selector`.

Ce plugin est facilement configurable via le fichier `addons/seasons-selector/config.json`.

Il est également possible d'avoir une configuration par application mviewer (voir ci-dessous)

### Configuration par application

Pour utiliser une configuration par application, il est nécessaire d'ajouter dans la balise <application> la propriété id (dans le fichier de configuration XML).

utilisez ensuite cette identifiant dans le fichier config.json.

**Exemple :**

* dans le fichier de configuration XML de l'application

```
<application id="littosat_normandie">
```

* dans le fichier config.json de l'extension

```
{
    ...
    "options": {
        "littosat_bzh": {},
        "littosat_normandie": {}
    }
}
```

### Paramètres disponibles

**Tous les paramètre notés d'un `(!)` sont obligatoires.**

* **default <object>** 

> Valeurs possibles: `{year: number, season: string}` - défaut: `{}`

Permet de définir l'année et la saison sélectionnées par défaut.

* **fromCapabilities `<boolean>`**

> Valeurs possibles: `true|false` - défaut: `false`

Si `true`, les valeurs d'années sélectionnables seront récupérées des getCapabilities des services des couches à utiliser. Pour les saisons, les valeurs seront comparées avec la configuration seasons définies plus bas pour n'afficher que les saisons confiugrés et retournées via les appels getCapabilities.

Si `false`, les valeurs d'années et saisons doivent être lues depuis les paramètres `years` et `seasons` (voir plus bas pour ces deux paramètres).

* **separator `<string>`**

> Valeur par défaut: null

Ce séparateur est utilisé par une RegEx qui permet d'identifier l'année de la saison lors de la lecture des valeurs TIME retournées par les getCapabilities.
Ce paramètre ne fonctionne que si le format de la valeur TIME est identique à toutes les couches.

Exemple :

Pour une valeur TIME `2023-11`, le séparateur est `-`.

* **(!) timePattern `<string>`**

Permet d'identifier le positionnement de l'année et de la saison pour construire le paramètre TIME lors du clique sur une année ou une saison.

Exemple :

Avec la configuration `"timePattern": "{year}{season}"`, le paramètre envoyé avec une année 2023 et une saison automne (valeur 11) sera : *&TIME=2023-05*.

> Notez la présence d'un séparateur défini avec le paramètre `separator` défini plus haut.

* **(!) seasons `<object[]>`**

Ce paramètre est une liste d'objet qui representé un bouton. Il y aura autant de saisons sélectionnables que d'objet dans cette liste.

Un objet (donc une saison) se caractérise par : 

- Un id unique et fix qui représente une saison et qui permet le lien avec l'image :

| ID | Saison        |
|----|---------------|
| 0  | SVG Hiver     |
| 1  | SVG Printemps |
| 2  | SVG Ete       |
| 3  | SVG Automne   |

- Un label personnalisable permettant de définir le nom de la saison.

- Une valeur qui permet, selon le service TIME, de lier la saison et le bouton pour réaliser le filtre au clique sur une saison. Cette saisie est nécessaire car les valeurs peuvent être différentes d'une application à une autre.


Exemple : 

```
    "seasons": [
        {"id":1, "label":"Printemps", "value": "05"},
        {"id":2, "label": "Eté", "value": "08"},
        {"id":3, "label": "Automne", "value": "11"}
    ],
```

> Notez que la configuration des saisons ne contient pas l'hiver. Le bouton Hiver ne sera donc pas affiché.

* **(!) layersId `<string[]>`**

Ce paramètre est une liste d'identifiant de couche mviewer.
Il permet d'indiquer les couches concernées par le changement de saison ou d'année.

Exemple :

```
"layersId": ["high_tide", "high_tide_cir", "high_tide_ndvi", "low_tide", "low_tide_cir", "low_tide_ndvi", "low_tide_rbottom"]
```

### Exemple de configuration complète : 

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
        "littosat_bzh": {},
        "littosat_normandie": {
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
            "layersId": ["high_tide", "high_tide_cir", "high_tide_ndvi", "low_tide", "low_tide_cir", "low_tide_ndvi", "low_tide_rbottom"]
        }
    }
}
```
