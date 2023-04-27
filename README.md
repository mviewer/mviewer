# MVIEWER

Visualiseur géographique [Kartenn](https://kartenn.region-bretagne.fr/demo/) basé sur OpenLayers 6.3.1 et Bootstrap 3.3.6

Liens utiles :

- [Site officiel](https://mviewer.netlify.com/)
- [Versions](https://github.com/geobretagne/mviewer/releases/)
- [Démos](http://kartenn.region-bretagne.fr/kartoviz/demo/)
- [Documentation](http://mviewerdoc.readthedocs.io/fr/stable/)
- [Générateur d'applications](https://github.com/geobretagne/mviewerstudio/)

## Feuille de route

La road map du projet est disponible à cette adresse : https://github.com/geobretagne/mviewer/projects/8

## Déploiement

Le déploiement se passe en trois étapes :

- Cloner le projet dans le dossier de votre choix
- Copier ce dossier dans le dossier /var/www/ ( ou autres dossiers de déploiement Apache)
  Vous avez maintenant un visualiseur géographique fonctionnel avec les couches de la Région Bretagne
- Si vous souhaitez publier vos propres couches/thèmes, modifiez le fichier `apps/default.xml`

## Déploiement avec Node.js

Mviewer peut également être publié via Node.js et NPM (testé avec v19.8.1).

**1. Install Node et npm**

Pour installer Node et Npm sous Linux / debian :

- Suivre ces instructions :

https://github.com/nodesource/distributions/blob/master/README.md

- ou utiliser NVM (conseillé) :

```
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install 19
nvm use 19
```

**2. Clone du code source**

```
git clone https://github.com/geobretagne/mviewer.git
cd mviewer
```

**3. Installation**

```
npm install
```

**4. Démo live**

Pour démarrer le serveur de développement `vite`:

`npm start`

Par défaut, mviewer est maintenant accessible à l'adresse **localhost:5000**

### Pour modifier les paramètres du serveur

Pour modifier le port our les options d'exécution...

Modifer la commande `start` dans le `package.json` avec par exemple :

`"start": "vite --port=8080 --cors=true"`

### Pour Réinstaller ou mettre à jour

```
rm -rf node_modules
rm -rf package-lock.json
npm install
```

## Docker

Si vous souhaitez faire tourner mviewer dans un conteneur docker, un `Dockerfile` est à votre disposition.

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

## Fichier apps/default.xml

Le fichier de configuration permet la personnalisation des thèmes/couches du visualiseur ; une configuration par
défaut est fournie dans `apps/default.xml`, vous pouvez le dupliquer et l'adapter à vos besoins en vous aidant de la [documentation.](http://mviewerdoc.readthedocs.io/fr/latest/)
