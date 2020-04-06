.. Authors : 
.. mviewer team
.. Sébastien FOUCHEUR

.. _configcustomlayer:

Configurer - Custom Layer
=========================
Les **Customs Layers** permettent de personnaliser la représentation et les interactions que l'on a avec les layers de façon plus avancée que ce que l'on peut faire avec le fichier de configuration XML.

Dans chacune des deux méthodes présentée dans la suite de cette page les customs layers ont pour base commune la classe ``CustomLayer`` present dans le fichier ``custom.js`` :

.. code-block:: javascript
  :linenos:

    class CustomLayer {
        // Initialiser l'objet avec un ID, une Layer (Couche), une Legende et un Handle (gère le click sur la carte)
        constructor(id, layer, legend, handle = false) {

            // Initialiser l'ID
            this.id = id;

            // Initialiser la couche
            this.layer = layer;

            /* for vector Layer only */
            /* Legende : utilisé seulement si le paramètre vectorlegend est égale à true dans le fichier de configuration XML*/
            this.legend = legend;

            /* handle : Remplace le click de base sur les features*/
            this.handle = handle;

            /* Load customlayer in mviewer.customLayers */
            if (mviewer.customLayers && !mviewer.customLayers[id]) {
                mviewer.customLayers[id] = this
            } else {
                console.log(`${this.id} customLayer is not loaded because  ${this.id} is already in use !`);
            }
        }
    }

Les méthodes suivantes sont à utiliser dans le fichier  ``maLayer.js`` qui est dans l'arborescence suivante : ::

    /apps
            ├── ma_carte1
            │   ├── addons
            │   │   ├── couche1
            │   │   │   ├── control
            │   │   │   └── layer
            │   │   │       └── malayer.js
            │   │   └── couche2
            │   │       ├── control
            │   │       └── layer
            │   ├── data
            │   ├── css
            │   ├── sld
            │   ├── img
            │   ├── templates
            │   └── ma_carte1.xml
            └── ma_carte2

Première Méthode : Définition Simple
------------------------------------

Cette solution permet de rapidement mettre en place un custom layer mais limite l'ajout de fonctions et variables privées 

.. code-block:: javascript
  :linenos:

    // Definition de la couche réprésentant le custom layer
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    // Votre code ici
    ...

    /* Créer le custom layer à partir du code ci-dessus */
    // Le custom layer aura pour id "monCustomLayer" et pour couche aerial définit dans l'exemple
    new CustomLayer("monCustomLayer", aerial);

Tous les paramètres de la classe ``CustomLayer`` ne sont pas nécessaire seul **l'ID** et **la couche (layer)** sont indispensables.

Ajouter des fonctions et des variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fonction privée ne sera pas accessible en dehors du code de la classe alors qu'une fonction publique sera accessible depuis n'importe où ce qui peut entrainer des conflits avec d'autres fonctions 
de l'application si l'on ne fait pas attention.

Pour les variables et fonctions de classe publique
**************************************************

Il faut définir un nouvelle attribut pour la classe ``CustomControl`` de la manière suivante :

.. code-block:: javascript
  :linenos:
    
    ...
    // Initialiser l'objet avec les fonctions init() et destroy() et l'id de couche "monControl".
    var monLayer = new CustomLayer("monLayer",aerial);

    // Une fois créer on peut ajouter des propriétés (une propriété peut être une fonction ou une variable)

    // Ajouter une fonction
    monLayer.maNouvelleFonction = function(){
        // Votre Code ici
        ...
    }

    // Ajouter une variable
    monLayer.maNouvelleVariable = "je suis un exemple";


Ces atributs seront alors publiques et accessibles depuis l'éxterieur.

Pour les variables et fonctions de classe privée
************************************************

Cette méthode ne permet pas d'ajouter des nouvelles fonctions ou variables privées en modifiant uniquement votre dossier ``apps`` pour faire cela il faut modifier directement
la classe ``CustomControl`` dans le fichier ``custom.js`` en ajoutant des paramètres dans le ``constructor()`` puis en suivant le mode d'emploi de la partie précédente.



Deuxième Méthode : Création d'une sous-classe
---------------------------------------------

La création d'une sous-classe permet de mieux structurer le code et de faciliter l'ajout de fonctions et variables privées sans avoir à modifier la classe parent ``CustomLayer``. Ell se présente comme suit :

.. code-block:: javascript
  :linenos:

    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });
    // Classe qui etend la classe 'CustomLayer' et decris le custom Layer
    class MonCustomLayer extends CustomLayer {

        // Initialiser le custom layer
        constructor(id, layer, legend, handle = false) {

            // Initialier les attributs de la classe parent
            super(id, layer, legend, handle);

        }
    }
    // Create The Custom Layer
    new MonCustomLayer("monCustomLayer",aerial);

La classe ``MonCustomLayer`` hérite de la classe ``CustomLayer`` et doit donc utilisé le ``constructor()`` parent pour créer un objet en spécifiant au minimum **l'ID** et **la layer**.

Ajouter des fonctions et des variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bugs on peut ajouter à la classe ``MonCustomLayer`` (vue dans la partie précendente) des fonctions privées ou publiques.

Une fonction privée ne sera pas accessible en dehors du code de la classe alors qu'une fonction publique sera accessible depuis n'importe où ce qui peut entrainer des conflits avec d'autres fonctions 
de l'application si l'on ne fait pas attention.

Pour les variables et fonctions de classe publique
**************************************************

Directement en ajoutant dans le code de la classe ``MonCustomLayer`` :

.. code-block:: javascript
  :linenos:

    // Classe qui étend la classe et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {
         constructor(id, layer, legend, handle = false, nouvelleVariable) {

            // Initialier les attributs de la classe parent
            super(id, layer, legend, handle);

            // Ajout d'une variable publique qui prend en valeur le paramètre de constructor nouvelleVariable
            this.nouvelleVariable = nouvelleVariable;

        }
        maFonctionPublique(){
            // Votre code ici
            ...
        }
    }
    // Créer l'objet layer avec l'id 'monLayer' qui est le nom de la couche
    new MonCustomLayer("monLayer",aerial);

Cette fonction sera appelable grâce à ``monobjet.maFonctionPublique()`` et l'on peut bien sûr y passer des paramètres. 

Concernant la variable elle est de la même façon accessible grâce à ``monobjet.nouvelleVariable``.

Pour les variables et fonctions de classe privée
************************************************

Une fonction privée est définit en dehors du code de la classe ``MonCustomLayer`` et déclarée comme une ``constante`` :

.. code-block:: javascript
  :linenos:

    // Fonction privée non utilisable en dehors de ce code
    const maFonctionPrivée = function(){
        // Votre code ici
        ...
    }
    // Classe qui étend la classe et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {
        ...
        maFonctionPublique(){
            maFonctionPrivée();
            // Votre code ici
            ...
        }
    }
    // Créer l'objet layer avec l'id 'monLayer' qui est le nom de la couche
    new MonCustomLayer("monLayer",aerial);

Cette fonction sera appelable grâce à ``maFonctionPrivée()`` seulement dans ce bout de code et donc on peut par exemple l'utiliser dans une fonction publique (ici ``maFonctionPublique()``).

----

Pour ajouter une variable de classe privée il faut ajouter le **"#"** avant le nom de la variable et la déclarer avant la fonction ``constructor()`` :

::

    ...
    // Classe qui étend la classe et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {
        // Déclaration de la variable Privée
        #maVariablePrivee;
        constructor(id, layer, legend, handle = false,maVariablePrivee = "valeurParDefaut") {

            // Initialier les attributs de la classe parent
            super(id, layer, legend, handle);

            // Initialiser #maVariablePrivee
            this.#maVariablePrivee = maVariablePrivee

            ...
        }
        ...
    }
    // Initialiser un objet avec la chaine de caractères "maVariablePrivee" dans la variable de classe privée #maVariablePrivee et l'id de couche "monLayer".
    new MonCustomLayer("monLayer",aerial);

Si vous voulez quand pouvoir accéder et modifier la valeur de cette variable en dehors de ce code mais de manière plus sécuriser il faut déclarer une fonction ``get()`` pour récupérer la valeur et une fonction
``set(valeur)`` pour la modifier :

::

    ...
    // Classe qui étend la classe et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {

        // Déclaration de la variable Privée
        #maVariablePrivee;

        constructor(id, layer, legend, handle = false,maVariablePrivee = "valeurParDefaut") {

            // Initialier les attributs de la classe parent
            super(id, layer, legend, handle);

            // Initialiser #maVariablePrivee
            this.#maVariablePrivee = maVariablePrivee

            ...
        }

        // Fonction pour récupérer la valeur de #maVariablePrivee
        getMaVariablePrivee(){
            return this.#maVariablePrivee;
        }

        // Fonction pour modifier la valeur de #maVariablePrivee
        setMaVariablePrivee(valeur){
            this.#maVariablePrivee = valeur;
        }
    }
    // Initialiser un objet avec la chaine de caractères "maVariablePrivee" dans la variable de classe privée #maVariablePrivee et l'id de couche "monLayer".
    new MonCustomLayer("monLayer",aerial);