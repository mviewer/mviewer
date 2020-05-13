MVIEWER
=============

Visualiseur géographique [Kartenn](http://kartenn.region-bretagne.fr/kartoviz/) basé sur OpenLayers 6.3.1 et Bootstrap 3.3.6

Liens utiles :
* [Site officiel](https://mviewer.netlify.com/)
* [Versions](https://github.com/geobretagne/mviewer/releases/)
* [Démos](http://kartenn.region-bretagne.fr/kartoviz/demo/)
* [Documentation](http://mviewerdoc.readthedocs.io/fr/latest/)
* [Générateur d'applications](https://github.com/geobretagne/mviewerstudio/)


Feuille de route
-----------
https://github.com/geobretagne/mviewer/wiki/Feuille-de-route

Déploiement
-----------

Le déploiement se passe en trois étapes :
    1. cloner le projet dans le dossier de votre choix
    2. copier ce dossier dans le dossier /var/www/ ( ou autres dossiers de déploiement Apache)
    Vous avez maintenant un visualiseur géographique fonctionnel avec les couches de la Région Bretagne
    3. Si vous souhaitez publier vos propres couches/thèmes, modifiez le fichier `apps/default.xml`

## Docker

Si vous souhaitez faire tourner mviewer dans un conteneur docker, un `Dockerfile` est a votre disposition.


```bash
# construire l'image docker (étape facultative, les images étant publiées sur [docker-hub](https://hub.docker.com/r/mviewer/mviewer))

docker build -t mviewer/mviewer .

# faire tourner le conteneur, et le rendre accessible sur le port 8080. A l'arret du
# conteneur celui-ci est supprimé (option `--rm`):

docker run --rm -p8080:80 -v$(pwd)/apps:/usr/share/nginx/html/apps mviewer/mviewer
```

Une fois le conteneur lancé, `mviewer` sera disponible sur `http://localhost:8080`.

Note: si vous disposez déjà d'un ensemble de fichiers de configuration pour
mviewer dans un répertoire existant, vous pouvez le monter à la place de celui
proposé par défaut par le dépot en utilisant l'option `-v` de docker comme suit:

```
docker run --rm -p8080:80 -v/chemin/vers/repertoire_de_configurations_xml:/usr/share/nginx/html/apps mviewer/mviewer
```

La seule contrainte étant que le chemin doit être indiqué à docker de manière absolue.

Par ailleurs, une composition docker est disponible dans le dépot git de
[mviewerstudio](https://github.com/geobretagne/mviewerstudio), incluant mviewer
et mviewerstudio.

Fichier apps/default.xml
------------------------

Le fichier de configuration permet la personnalisation des thèmes/couches du visualiseur ; une configuration par
défaut est fournie dans `apps/default.xml`, vous pouvez le dupliquer et l'adapter à vos besoins en vous aidant de la [documentation.](http://mviewerdoc.readthedocs.io/fr/latest/)
