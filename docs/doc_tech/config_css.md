# Configurer - Apparence

Pour configurer l'apparence de mviewer, vous avez la possibilité de
changer le style présent dans un fichier .css.

Par défaut, une liste de .css est fournie dans le dossier
**/css/themes/**

<img src="../_images/dev/config_css/config_css.png" class="align-center"
alt="Configurer le css" />

## Changer l'apparence

Pour changer l'apparence *(et donc le .css associé)* de mviewer, il vous
suffit d'éditer le fichier **index.html** et de modifier l'adresse du
fichier .css à la ligne suivante (n°49).

``` xml
var style = "css/themes/default.css";
```

Par défaut, le fichier associé est **css/themes/default.css**.

<img src="../_images/dev/config_css/config_css_index.png"
class="align-center" alt="Configurer le css" />

### Remarque

À noter qu'un fichier
[themes_css_kartenn.pdf](http://kartenn.region-bretagne.fr/kartoviz/css/themes/themes_css_kartenn.pdf)
permet de visualiser à l'avance le rendu de chacun des thèmes proposés.
