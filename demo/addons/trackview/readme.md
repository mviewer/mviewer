# Visualisation de différentes Tracks

Cette extension permet à l'utilisateur de pouvoir visualiser différents parcours au format `GPX`. 

Celle-ci ajoute également la possibilité d'interagir avec les données présentes de telle sorte à mieux comprendre l'environnement concerné. 

De plus, l'extension est entièrement configurable depuis le fichier de config `config.json` (voir ci-dessous), permettant ainsi une personnalisation bien précise en fonction des besoins.

## Configuration du fichier de carte XML

**1. Utiliser un ID unique pour un Mviewer**

Il est préférable d'utiliser un ID qui correspond à votre Mviewer : 

```xml
<config>
    <application id="parcours"
                 ...
    />
    ...
</config>
```

Cet ID va permettre de lier un fichier de configuration `config.json` avec un ***seul*** Mviewer. Dans ce cas, un seul dossier et un seul fichier de configuration seront utilisés.

**2. Importer le plugin**

L'étape suivante consiste à importer le plugin dans le fichier de configuration de votre Mviewer. En effet, c'est une étape qui est identique pour n'importe quel plugin que l'on souhaite ajouter à notre application. Pour ce faire, il faut se rendre dans le fichier `XML` dans lequel il est nécessaire d'ajouter la balise suivante :

```xml
<extensions>
    <extension type="component" id="trackview" path="demo/addons"/>
</extensions>
```

Une fois arrivé à ce stade de la configuration, le plugin est désormais importé dans votre application.

## Configuration du plugin

Comme nous avons déjà pu le voir précédemment, l'extension est entièrement configurable. Nous allons donc voir dans cette partie les différentes configuration disponibles.

