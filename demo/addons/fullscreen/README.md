## Créer d'un bouton dont la fonction est d'afficher la carte en mode "plein écran" en utilisant l'API html 5 ``requestFullScreen``.

#### 4 ressources dans cet exemples

 - **fullscreen.html** qui contient le code html du bouton (icône fontawesome).
 - **fullscreen.js** qui contient le code javascript permettant d'initialiser le bouton et d'y associer une méthode au clic.
 - **style.css** qui permet de définir le style du bouton.
 - **config.json** - C'est le fichier qui est appelé par mviewer pour construire ce composant.

 Pour que ce composant s'affiche dans mviewer, il faut depuis un **config.xml** ajouter cette section :

 ````
 <extensions>
    <extension type="component" id="fullscreen" path="demo/addons" />
</extensions>
 ````