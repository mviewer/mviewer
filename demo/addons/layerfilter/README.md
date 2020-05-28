## Recherche des couches

Cette extension permet de filtrer les themes, groupes et couches présents dans mviewer via une saisie de recherche ci dessus.

#### 4 ressources dans cette extension

 - **layerfilter.html** qui contient le code html du formulaire
 - **layerfilter.css** qui permet de définir la taille, la position du composant ...
 - **layerfilter.js** - le filtre qui est appliqué sur les themes, groupes et couches
 - **config.json** - contient un nouveau attribut "position" qui permet de définir la position du noeud sous le target **div**

 Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

 ````
 <extensions>
    <extension type="component" id="layerfilter" path="demo/addons" />
</extensions>
 ````