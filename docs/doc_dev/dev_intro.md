# Développer avec mviewer

<div class="note">

<div class="title">

Note

</div>

Mviewer est développé en `javascript` et utilise les librairies
suivantes :

-   [Openlayers](https://openlayers.org/) version 8.2
-   [Fuse](https://fusejs.io/) version 5.1.0
-   [I18njs](http://i18njs.com/) no version
-   [Bootstrap](https://getbootstrap.com/docs/3.3/) version 5.3.3
-   [jQuery](https://jquery.com/) version 1.10.2
-   [Sortable](https://github.com/SortableJS/Sortable) version 1.4.2
-   [Mustache](https://github.com/janl/mustache.js/) version 2.3.0

</div>

## Chapitres abordés

-   Intro : [Les grands principes de
    mviewer](#les-grands-principes-de-mviewer)
-   Partie 1 : [Développer ses propres composants](custom.md).
-   Partie 2 : Découvrir [Les fonctions publiques de mviewer](public_fonctions.md).

### Les grands principes de mviewer

**MVIEWER** s'appuie sur les 2 principes suivants :

#### Chargements à la demande

mviewer s'initialise avec un fichier de configuration - **config.xml**.
Ce fichier contient les paramétrages nécessaires à l'application ainsi
que les ressources utiles à charger :

<div class="sidebar">

**Astuce**

Pour visualiser dans votre navigateur tous les flux mviewer, activez la
console - touche `F12` avant le démarrage de l'application.

</div>

-   résumé des fiches de métadonnées - .xml
-   templates de couche personnalisés - .mst
-   fichier d'aide personnalisé - .html
-   feuille de style personnalisée - .css
-   données - (formats multiples)
-   extensions - .js
-   composants personnalisés ( .js .css .html )

#### Tout est personnalisable

Si mviewer est avant tout une application aux nombreux paramétrages
possibles, il peut être nécessaire de personnaliser l'interface voire de
créer des couches personnalisées avec leurs propres contrôles (liste
déroulante, slider, calendrier...). Les couches personnalisées sont par
exemple nécessaires pour appliquer une analyse thématique sur une source
de données de type vecteur ou développer un nouveau type d'intéraction
entre l'utilisateur et une source de données (mise à jour par exemple).

##### Sans développement

-   La mise en forme de la fiche d'information des données [Configurer - Templates](../doc_tech/config_tpl.md)
-   La représentation des données servies par WMS - SLD

##### Avec développement

-   couche personnalisée - JavaScript
-   contrôle personnalisé - JavaScript + HTML
-   composant personnalisé - JavaScript + HTML + CSS
