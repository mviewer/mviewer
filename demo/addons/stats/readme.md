# Plugin - Statistiques sur les couches


**Un exemple d'application mviewer avec le plugin Stats est disponible dans `demo/stats`**. Retrouvez également les modèles de template dans cet exemple.

## Description détaillée

Ce module permet d'afficher un panneau au sein de la carte qui présente des indicateurs statistiques, basés sur des objets visibles dans la carte. Ces indicateurs s'adaptent en fonction de l'emprise et du niveau de zoom.

**Exemple :**
Si on a couche de zones d'activités avec un champ surface_disponible, on peut ajouter un indicateur qui affiche le nombre total de zones visibles dans la carte, ou la somme des surfaces disponibles dans chaque zone.

## Informations complémentaires

La valeur de l'indicateur statistique se met à jour en fonction :
*    du déplacement dans la carte
*    du zoom dans la carte
*    d'un éventuel filtrage via le custom component filter

## Configuration du plugin

Dans le fichier stats/config.json, indiquez les paramètres généraux du plugin : 

    "id_mviewer":{
        "title": "Titre du panel",
        "open": true, // Panel ouvert à défaut
        "style": {
          "border": "",
          "background": "white",
          "text": "#5f5f5f",
          "colorButton": "#333333"
        },
        "stats": [
          // Insérer ici les paramètres des indicateurs présentés ci-dessous
      ]
     }



Pour chaque indicateur, il est ensuite nécessaire de configurer les paramètres suivants :

    {
        "type": "stat",
        "layerId": "population_communes",
        "field": "",
        "template":"<span class='statValue'>{x} habitants</span></div>",
        "operator": "COUNT",
        "__operator": "SUM,MAX,MEAN,COUNT"
     }

* `type` : type d'indicateur, 1 seul type supporté pour le moment "stat" 
* `layerId`: identifiant de la couche concernée
* `field`: champ sur lequel calculer l'indicateur ( vide si c'est une opération `COUNT`)
* `template` : Code html indiquant la mise en forme de l'indicateur
* `operator`: type d'opération à réaliser parmi `COUNT` (nombre d'objets), `SUM` (somme des valeurs de l'attribut), `MIN`(valeur minimum de l'attribut), `MAX` (valeur maximum de l'attribut), `MEAN` (valeur moyenne de l'attribut)

 
## Exemple de configuration
![stast01](https://user-images.githubusercontent.com/22764056/182374049-bef810c2-7759-4b8f-8b7f-3a63bb1eec5b.JPG)

Exemple de configuration pour afficher le nombre de communes visibles sur la carte ainsi que la somme des habitants au sein de ces communes : 

```
{
	"type": "stat",
	"layerId": "population_communes",
	"field": "",
	"template":"<span>{x} Communes</span>",
	"operator": "COUNT",
	"__operator": "SUM,MAX,MEAN,COUNT"
},
{
	"type": "stat",
	"layerId": "population_communes",
	"field": "population",
	"template":"<span>{x} Habitants</span>",
	"operator": "SUM",
	"__operator": "SUM,MAX,MEAN,COUNT"
}
```

## Modèles de template

Grâce au système de template, l'affichage des indicateurs statistiques est totalement personnalisable tant sur la structure que sur le style. Plusieurs modèles de templates sont déjà pré-configurés dans ce plugin. Pour les réutiliser, il est nécessaire de reprendre les exemples ci-dessous en conservant les `class=""` des élements .html. Leurs styles étant définis dans la feuille de style `css/stats.css`

**Modèle 1 : Texte par défaut centré**  
![M1_stats](https://user-images.githubusercontent.com/22764056/182374119-57ecab9c-819a-4856-ac28-7b2892818fbc.JPG)

    "template":"<span>{x} Communes</span>"
 

**Modèle 2 : Texte sur 2 lignes avec mise en gras de la valeur**  
![image](https://user-images.githubusercontent.com/22764056/182374304-658a496a-2599-4d68-ad26-0b8e35a98d06.png)


    "template":"<div class='statContainer Default'><span class='statValue'>{x}</span><span class='statLabel'>Communes</span></div>"
   
 
**Modèle 3: Texte sur 2 lignes avec mise en couleur de la valeur**  
![image](https://user-images.githubusercontent.com/22764056/182374505-0e583015-46fc-4838-bebd-e0700a5c503e.png)

    "template":"<div class='statContainer Default'><span class='statValue' style='color: #ea6a65;'>{x} habitants</span><span class='statLabel'>Populations moyenne par commune</span></div>"
Dans la balise `style`, ajouter le code couleur `#HEX` pour l'affichage de la valeur.   


**Modèle 4 :  Texte sur 2 lignes avec un icône aligné à droite**  
![image](https://user-images.githubusercontent.com/22764056/182374639-b6e2c5d2-e369-4bba-a861-ada43172320b.png)

    "template":"<div class='statContainer Icon-start'><divclass='statsIcon'><img src='demo/stats/img/icon_site.svg'></div><divclass='statsText'><span class='statValue' style='color: #2a9aa9;'>{x}sites</span> </br><span class='statLabel'>pour l'aide économique et l'innovation</span> </div></div>"

Dans la balise `style`, ajouter le code couleur `#HEX` pour l'affichage de la valeur.  
Dans la balise `img`, ajouter l'url vers votre icône (`.png/.jpeg` ou `.svg`).  


**Modèle 5 :  Texte sur 2 lignes avec un icône aligné à gauche**  
![image](https://user-images.githubusercontent.com/22764056/182374730-efbd4761-cfb6-48df-90a9-bab0755e8b6a.png)

    "template":"<div class='statContainer Icon-end'><div class='statsIcon'><img src='demo/stats/img/icon_population.svg'></div><div class='statsText'><span class='statValue' style='color: #ea6a65;'>{x}</span> </br><span class='statLabel'>Habitants</span> </div></div>"

Dans la balise `style`, ajouter le code couleur `#HEX` pour l'affichage de la valeur.  
Dans la balise `img`, ajouter l'url vers votre icône (`.png/.jpeg` ou `.svg`).   


**Animation CSS**   
Pour ajouter une animation CSS au changement de valeur de votre indice statistiques, utiliser les modèles suivants.  

Un scroll de la valeur du haut vers le bas :

    "template":"<span><span class='statValue_Scroll'>{x}</span> Communes</span>"
Une transition de la valeur via un changement d'opacité :

    "template":"<span><span class='statValue_Fade'>{x}</span> Communes</span>",

  
**Pour aller plus loin**   
Il est possible de créer vos propres templates en ajoutant les propriétés de styles associées à vos élements `.html` dans le fichier `css/stats.css`
