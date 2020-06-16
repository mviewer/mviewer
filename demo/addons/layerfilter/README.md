## Filtre des couches

Cette extension permet de filtrer les thèmes, groupes et couches présents dans mviewer via la saisie de recherche ci dessus. Le résultat retourne les thèmes, groupes (et leurs contenus) ainsi que les couches où le terme recherché fait partie du titre.

#### 4 ressources dans cette extension

 - **layerfilter.html** contient une saisie de texte ainsi qu'un bouton pour effacer le filtre
 - **layerfilter.css** définit l'affichage du composant
 - **layerfilter.js** - contient la fonction du filtre qui est appliquée sur les thèmes, groupes et couches ainsi qu'une fonction pour effacer le filtre
 - **config.json** - indique les trois fichiers précédents à mviewer ainsi que la **div** où le composant doit s'afficher (**target**). 
 Pour afficher le filtre comme premier élément enfant du **target** l'attribut optionnel **position = 0** est renseigné.

````
{
  "js": ["layerfilter.js"],
  "css": "layerfilter.css",
  "html": "layerfilter.html",
  "target": "menu",
  "options": {
    "position": 0
  }
}
````

 Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

 ````
 <extensions>
    <extension type="component" id="layerfilter" path="demo/addons" />
</extensions>
 ````

 Plus d'info sous : https://mviewerdoc.readthedocs.io/fr/latest/doc_tech/config_customcomponent.html