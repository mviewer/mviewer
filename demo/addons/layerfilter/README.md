## Filtre des couches

Cette extension permet de filtrer les thèmes, groupes et couches présents dans mviewer via la saisie de recherche ci dessus. Le résultat retourne les thèmes, groupes (et leurs contenus) ainsi que les couches où le terme recherché fait partie du titre.

#### 4 ressources dans cette extension

 - **layerfilter.html** contient une saisie de texte ainsi qu'un bouton pour effacer le filtre
 - **layerfilter.css** définit l'affichage du composant
 - **layerfilter.js** - contient la fonction du filtre qui est appliquée sur les thèmes, groupes et couches ainsi qu'une fonction pour effacer le filtre
 - **config.json** - indique les trois fichiers précédents à mviewer ainsi que la **div** où le composant doit s'afficher (**target**). 
 Pour afficher le filtre comme premier élément enfant du **target** l'attribut optionnel **position = 0** est renseigné.
 
 Le contenu du paramètre **fuseOptions** est un objet qui permet de personnaliser les options de la recherche ([voir ici les options Fuse disponibles](https://fusejs.io/api/options.html))

````
{
  "js": ["layerfilter.js"],
  "css": "layerfilter.css",
  "html": "layerfilter.html",
  "target": "menu",
  "options": {
    "position": 0,
    "fuseOptions": {
      "threshold": 0.3,
      "distance": 500
    }
  }
}
````

- **threshold**: Indique à quel moment l'algorithme de recherche abandonne. 0.0 nécessite une correspondance parfaite, 1.0 correspond à n'importe quoi.

- **distance**: Nombre de caractères de correspondance entre la recherche et le mot recherché.

D'autres options sont disponibles. La documentation Fuse vous donnera la liste des paramètres disponibles (à rajouter comme `threshold` ou `distance`) :

- https://www.fusejs.io/api/options.html#location


Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

 ````
 <extensions>
    <extension type="component" id="layerfilter" path="demo/addons" />
</extensions>
 ````

Plus d'informations ici :

https://mviewerdoc.readthedocs.io/fr/latest/doc_tech/config_customcomponent.html
