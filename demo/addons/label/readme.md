# Afficher les étiquettes

Ce module permet d'afficher des étiquettes pour une couche du mviewer. Les étiquettes affichent la valeur d'un attribut de la couche ou bien affiche le résultat d'une fonction d'agrégation.

Les étiquettes sont ajoutées à la carte lorsque le bouton présent dans la légende est coché.

## Configuration du plugin

**1. Importer le plugin**

Comme tous les plugins, vous devez ajouter dans le fichier de configuration de votre Mviewer une balise qui permet de dire à votre Mviewer qu'il faut charger le plugin :

```
<extensions>
            <extension type="component" id="label" path="apps/addons" />
</extensions>
```

**2. Modifier le fichier de config**

La configuration du plugin est accessible dans le fichier `config.json` du répertoire `addon/label`. Il faut ajouter une config par mviewer.

### Configuration obligatoire

- Ajouter votre ID de Mviewer sous la propriété `"mviewer"` (exemple : "ssiad").
- Ajouter l'ID de la couche (exemple : "ssiad_paph_territoire") ainsi que le nom du champ (exemple "SSIAD_RS") sous la propriété `"layer"`.

On obtient la configruation suivante :

```
"mviewer": {
"ssiad": {                                          -> id de mviewer
    "layer": [
      {
        "layerId": "ssiad_paph_territoire",         -> id de la couche
        "field": "SSIAD_RS"                         -> nom du champ
      }
    ]
  }
}
```

Ceci est la configuration minimale et obligatoire du plugin.

### Configuration optionnelle

D'autres paramètres optionnels peuvent-être configurés. Ci-dessous tous les paramètres ainsi que les valeurs par défault des paramètrez soptionnels.

```
"mviewer": {
"ssiad": {
    "layer": [
      {
        "layerId": "ssiad_paph_territoire",
        "field": "SSIAD_RS",
        "font": "10px Calibri,sans-serif",
        "textColor": "black",
        "strokeColor": "white",
        "offsetX": 0,
        "offsetY": 0,
        "method": "count",
        "width": 6,
        "zoomThreshold": 13
      }
    ]
  }
}
```

font: "10px Calibri,sans-serif",
textColor: couleur du texte
strokeColor: couelur du contours du texte
offsetX: décalage du texte horizontalement
offsetY: décalage du texte verticalement
method: méthode d'agréagtion (uniquement pour les clusters)
width: largeur du contour du texte
zoomThreshold: zoom minimum auquel afficher les étiquettes

## Règles du plugin

Le plugin s'utilise uniquement avec une couche du mviewer.

Ce plugin fonctionne uniquement pour les couches vecteurs (WFS, geoJSON...) et cluster.

### Placement

Pour les multipolygones, l'étiquette est uniquement affichée pour polygone le plus grand.
Pour les multilignes, l'étiquette est uniquement affichée pour la ligne la plus longue.

### Cluster

Les couches de type cluster peuvent afficher la valeur d'un attribut ou le résultat d'une fonction d'agrégation.

#### Afficher la valeur d'une colonne

L'étiquette affiche la valeur de l'atribut défini dans `"field"`. Si la valeur de l'attribut diffère au sein des features du cluster, c'est la première trouvée qui est affichée.

#### Afficher le réusltat d'une aggrégation

L'étiquette affiche le résultat de la fonction d'agrégatoin défini dans `"method"` et appliqué sur l'attribu défini dans `"field"`. L'attribut doit être de type numérique.

La fonction count() n'utilse pas es valeur de l'attribu défini dans `"field"`. Elle compte le nombre de features total du cluster.

Ci dessous les fonctions d'agrégation dipsonibles:

"avg" : calculer la moyenne sur un ensemble d’enregistrement
"count" : compter le nombre de features d'un cluster
"max" : récupérer la valeur maximum du cluster
"min" : récupérer la valeur minimum du cluster
"sum" : calculer la somme du cluster
