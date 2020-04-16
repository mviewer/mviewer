## Affichage d'un composant personnalisé

Cet exemple est utile pour appréhender la gestion de la création d'un CustomComponent, mais ne présente pas d'intérêt particulier quant à l'usage de mviewer.

#### Objectif

A partir d'une librairie **javascript** disponible sur internet, je souhaite créer mon composant 3D.
Je souhaite que mon composant s'affiche dans la partie inférieure droite de mviewer.

#### 4 ressources dans cet exemples

 - **3d.html** qui contient le code html composant (div)
 - **style.css** qui permet de définir la taille, la position du composant ...
 - **vis-graph3.min.js** - Librairie javascript nécessaire pour développer mon composant
 - **main.js** - mon code javascript avec notamment cette instruction importante qui permet d'exécuter le code ``graph3d.init`` une fois que le composant est correctement chargé par mviewer.
 ````
new CustomComponent("graph3d", graph3d.init);
 ````
 - **config.json** - C'est le fichier qui est appelé par mviewer pour construire ce composant et qui identifie toutes les ressources à charger ainsi que la **div** existante mviewer qui hébergera ce composant.

 Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

 ````
 <extensions>
    <extension type="component" id="graph3d" path="demo/addons" />
</extensions>
 ````