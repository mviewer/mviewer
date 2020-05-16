.. Authors :
.. mviewer team
.. Sébastien FOUCHEUR

.. _customlayerdev:

Appronfondir - Custom Layer
===========================

Les **Customs Layers** permettent de personnaliser la représentation et les interactions que l'on a avec les layers de façon plus avancée que ce que l'on peut faire avec le fichier de configuration XML.

Dans chacune des deux méthodes présentées dans la suite de cette page les customs layers ont pour base commune la classe ``CustomLayer`` présente dans le fichier ``custom.js``.

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

Cette solution permet de rapidement mettre en place un custom layer mais ne permet pas de travailler avec des variables ou des méthodes privées.

.. code-block:: javascript
  :linenos:

    // Définition de la couche représentant le custom layer
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

Tous les paramètres de la classe ``CustomLayer`` ne sont pas nécessaires seul **l'ID** et **la couche (layer)** sont indispensables.

Ajouter des fonctions et des variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fonction privée ne sera pas accessible en dehors du code de la classe alors qu'une fonction publique sera accessible depuis n'importe où ce qui peut entrainer des conflits avec d'autres fonctions
de l'application si l'on ne fait pas attention.

Pour les variables et fonctions de classe publique
**************************************************

Il faut définir un nouvel attribut pour la classe ``CustomControl`` de la manière suivante :

.. code-block:: javascript
  :linenos:

    ...
    // Initialiser l'objet avec les fonctions init() et destroy() et l'id de couche "monLayer".
    var monLayer = new CustomLayer("monLayer",aerial);

    // Une fois créé on peut ajouter des propriétés (une propriété peut être une fonction ou une variable)

    // Ajouter une fonction
    monLayer.maNouvelleFonction = function(){
        // Votre Code ici
        ...
    }

    // Ajouter une variable
    monLayer.maNouvelleVariable = "je suis un exemple";


Ces attributs seront alors publics et accessibles depuis l'extérieur.

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
    // Classe qui étend la classe 'CustomLayer' et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {

        // Initialiser le custom layer
        constructor(id, layer, legend, handle = false) {

            // Initialiser les attributs de la classe parent
            super(id, layer, legend, handle);

        }
    }
    // Créer le Custom Layer
    new MonCustomLayer("monCustomLayer",aerial);

La classe ``MonCustomLayer`` hérite de la classe ``CustomLayer`` et doit donc utiliser le ``constructor()`` parent pour créer un objet en spécifiant au minimum **l'ID** et **la layer**.

Ajouter des fonctions et des variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bugs on peut ajouter à la classe ``MonCustomLayer`` (vue dans la partie précédente) des fonctions privées ou publiques.

Une fonction privée ne sera pas accessible en dehors du code de la classe alors qu'une fonction publique sera accessible depuis n'importe où ce qui peut entraîner des conflits avec d'autres fonctions
de l'application si l'on ne fait pas attention.

Pour les variables et fonctions de classe publique
**************************************************

Directement en ajoutant dans le code de la classe ``MonCustomLayer`` :

.. code-block:: javascript
  :linenos:

    // Classe qui étend la classe et décrit le custom Layer
    class MonCustomLayer extends CustomLayer {
         constructor(id, layer, legend, handle = false, nouvelleVariable) {

            // Initialiser les attributs de la classe parent
            super(id, layer, legend, handle);

            // Ajout d'une variable publique qui prend en valeur le paramètre de constructor "nouvelleVariable"
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

Une fonction privée est définie en dehors du code de la classe ``MonCustomLayer`` et déclarée comme une ``constante`` :

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

            // Initialiser les attributs de la classe parent
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

            // Initialiser les attributs de la classe parent
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
    // Initialiser un objet avec la chaîne de caractères "maVariablePrivee" dans la variable de classe privée #maVariablePrivee et l'id de couche "monLayer".
    new MonCustomLayer("monLayer",aerial);

Interactions customLayer et mviewer
-----------------------------------

Depuis le customLayer il est possible de communiquer et d'interagir avec la carte et d'une façon plus générale avec mviewer.
Vous pouvez ainsi mobiliser toutes les méthodes publiques dans votre développement.
Pour en savoir plus, consultez, dans la documentation développeur, la partie ":ref:`publicfonctions`".
