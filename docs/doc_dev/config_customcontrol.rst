.. Authors : 
.. mviewer team
.. Sébastien FOUCHEUR

.. _configcustomcontrol:

Configurer - Custom Control
===========================

Les **Customs Controls** permettent de personnaliser la représentation et les interactions que l'on a avec les layers de façon plus avancée que ce que l'on peut faire avec le fichier de configuration XML.

Première méthode : Création d'une sous-classe
---------------------------------------------

Cette méthode elle la plus complète des deux et permet de créer des customs controls plus poussés.

Tous les Custom Control ont une base commune dans le fichier ``custom.js`` où est définie la classe ``CustomControl`` :

.. code-block:: javascript
  :linenos:
    
    // Classe abstraite
    class CustomControl {
        constructor(id) {
            this.id = id;
            /* Load customControl in mviewer.customControls */
            if (mviewer.customControls && !mviewer.customControls[id]) {
                mviewer.customControls[id] = this
            } else {
                console.log(`${this.id} customControl is not loaded because  ${this.id} is already in use !`);
            }
        }
        init(){
            throw new Error('You must implement the \'init\' function');
        }
        destroy(){
            throw new Error('You must implement the \'destroy\' function');
        }
    }

Pour utiliser cette classe il faut modifier le fichier Javascript (dans cet exemple ``moncontrol.js``) présent dans l'arborescence suivante::

    /apps
        ├── ma_carte1
        │   ├── addons
        │   │   ├── couche1
        │   │   │   ├── control
        │   │   │   │   ├── moncontrol.html
        │   │   │   │   └── moncontrol.js
        │   │   │   └── layer
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

Ce fichier définit une classe qui étend (est un héritier de la classe) la classe ``CustomControl`` :

.. code-block:: javascript
  :linenos:
    
    //Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        constructor(id) {
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
        }
        // Obligatoire - ce code est exécuté lors de l'ouverture du panel
        init() {
            // Votre code ici
            ...
        }
        // Obligatoire - ce code est exécuté lors de la fermeture du panel
        destroy() {
            // Votre code ici
            ...
        }
    }

La classe ``CustomControl`` étant **abstraite** cela signifie qu'elle nous oblige à redéfinir les fonctions ``init()`` et ``destroy()`` qui sont obligatoires sinon elle nous renvoie une erreur. 

De plus la fonction ``constructor(id)`` permet à l'objet d'être initialisé avec la valeur **id (obligatoire)** lors de la création d'un **objet MonControl**.

Pour créer cet objet et le rendre disponible au reste de l'application il faut rajouter le code suivant :

.. code-block:: javascript
  :linenos:

    // Créer l'objet MonControl avec l'id 'monControl' qui est le nom de la couche
    new MonControl("monControl");

----

Ajouter des fonctions
~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bugs on peut ajouter à la classe ``MonControl`` (vue dans les parties précendentes) des fonctions privées ou publiques.

Une fonction privée ne sera pas accessible en dehors du code de la classe alors qu'une fonction publique sera accessible depuis n'importe où ce qui peut entrainer des conflits avec d'autres fonctions 
de l'application si l'on ne fait pas attention.

Pour une fonction publique
**************************

Directement en ajoutant dans le code de la classe ``MonControl`` :

.. code-block:: javascript
  :linenos:

    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        ...
        maFonctionPublique(){
            // Votre code ici
            ...
        }
    }
    // Créer l'objet control avec l'id 'monControl' qui est le nom de la couche
    new MonControl("monControl");

Cette fonction sera appelable grâce à ``monobjet.maFonctionPublique()`` et l'on peut bien sûr y passer des paramètres.

Pour une fonction privée
************************

En dehors du code de la classe ``MonControl`` et en la déclarant comme une ``constante`` :

.. code-block:: javascript
  :linenos:

    // Fonction privée non utilisable en dehors de ce code
    const maFonctionPrivée = function(){
        // Votre code ici
        ...
    }
    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        ...
        maFonctionPublique(){
            maFonctionPrivée();
            // Votre code ici
            ...
        }
    }
    // Créer l'objet control avec l'id 'monControl' qui est le nom de la couche
    new MonControl("monControl");

Cette fonction sera appelable grâce à ``maFonctionPrivée()`` seulement dans ce bout de code et donc on peut par exemple l'utiliser dans une fonction publique (ici ``maFonctionPublique()``).

Ajouter des variables
~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bugs on peut ajouter à la classe ``MonControl`` (vue dans les parties précendentes) des variables de classe privée ou publique.

Une variable de classe privée ne sera pas accessible en dehors du code de la classe alors qu'une variable de classe publique sera accessible depuis n'importe où ce qui peut entrainer des bugs (modification involontaire de celle-ci)
si l'on ne fait pas attention.

Pour une variable de classe publique
************************************

Pour ajouter une variable de classe publique il faut juste ajouter une propriété à l'objet :

.. code-block:: javascript
  :linenos:

    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        constructor(id,maVariablePublique){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            // Initialiser maVariablePublique
            this.maVariablePublique = maVariablePublique
            ...
        }
        ...
    }
    // Initialiser l'objet avec la chaine de caractères "maVariablePublique" dans la variable de classe publique maVariablePublique et l'id de couche "monControl".
    new MonControl("monControl","maVariablePublique");

Cette variable est accessible à partir du moment où l'on accède à l'objet (dans le navigateur par exemple). 

Si on ne souhaite pas forcément donner une valeur à ``maVariablePublique`` on peut déclarer une valeur par défaut en spécifiant une valeur dans les paramètres de la fonction ``constructor()`` : 

.. code-block:: javascript
  :linenos:

    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        // Fonction avec un paramètre ayant une valeur par défaut
        constructor(id,maVariablePublique = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            // Initialiser maVariablePublique
            this.maVariablePublique = maVariablePublique
            ...
        }
        ...
    }
    // Initialiser l'objet avec la chaine de caractères par défaut "valeurParDefaut" dans la variable de classe publique maVariablePublique et l'id de couche "monControl".
    new MonControl("monControl");

La valeur de ``maVariablePublique`` sera toujours **"valeurParDefaut"** tant que vous ne spécifiez pas d'autres valeurs.

Pour une variable de classe privée
**********************************

Pour ajouter une variable de classe privée il faut ajouter le **"#"** avant le nom de la variable et la déclarer avant la fonction ``constructor()`` :

::

    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        // Déclaration de la variable Privée
        #maVariablePrivee;
        constructor(id,maVariablePrivee = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            // Initialiser #maVariablePrivee
            this.#maVariablePrivee = maVariablePrivee
            ...
        }
        ...
    }
    // Initialiser un objet avec la chaine de caractères "maVariablePrivee" dans la variable de classe privée #maVariablePrivee et l'id de couche "monControl".
    new MonControl("monControl","maVariablePrivee");

Si vous voulez quand pouvoir accéder et modifier la valeur de cette variable en dehors de ce code mais de manière plus sécuriser il faut déclarer une fonction ``get()`` pour récupérer la valeur et une fonction
``set(valeur)`` pour la modifier :

::

    // Classe qui étend la classe abstraite et décrit le custom Control
    class MonControl extends CustomControl {
        // Déclaration de la variable Privée
        #maVariablePrivee;
        constructor(id,maVariablePrivee = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            // Initialiser #maVariablePrivee
            this.#maVaribalePrivée = maVariablePrivee
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
    // Initialiser un objet avec la chaine de caractères "maVariablePrivee" dans la variable de classe privée #maVariablePrivee et l'id de couche "monControl".
    new MonControl("monControl","maVariablePrivee");

Deuxième méthode : Définition Simple
------------------------------------

Cette méthode permet de créer des customs controls plus simples qu'avec la première méthode mais permet moins de personnalisation.

Dans ce cas précis la classe ``CustomControl`` dans le fichier ``custom.js`` est définie comme suit :

.. code-block:: javascript
  :linenos:

    class CustomControl {
        constructor(id, init = function () {}, destroy = function () {}) {
            this.id = id;
            this.init = init;
            this.destroy = destroy;
            /* Load customControl in mviewer.customControls */
            if (mviewer.customControls && !mviewer.customControls[id]) {
                mviewer.customControls[id] = this
            } else {
                console.log(`${this.id} customControl is not loaded because  ${this.id} is already in use !`);
            }
        }
    }

La classe possède une méthode ``constructor()`` qui prend en paramètre les méthodes ``init()`` et ``destroy()`` que l'on peut définir dans le fichier Javascript (dans cet exemple ``moncontrol.js``)
présent dans l'arborescence suivante::

    /apps
        ├── ma_carte1
        │   ├── addons
        │   │   ├── couche1
        │   │   │   ├── control
        │   │   │   │   ├── moncontrol.html
        │   │   │   │   └── moncontrol.js
        │   │   │   └── layer
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

Pour cela il faut donc définir les deux fonctions en les déclarant avec le mot-clé **const** pour les rendre inaccessibles depuis le reste de l'application indépendamment du custom control dans lequel elles 
sont définies, puis il faudra les donner en paramètre à la classe ``CustomControl`` vue plutôt.

.. code-block:: javascript
  :linenos:

    const init = function() {
    // Obligatoire - code exécuté quand le panel est ouvert
    // Votre code ici
    ...

    };

    const destroy =  function() {
        // Obligatoire - code exécuté quand le panel se ferme
        // Votre code ici
        ...
    }
    // Initialiser l'objet avec les fonctions init() et destroy() et l'id de couche "monControl".
    new CustomControl("monControl", init, destroy);

Ajouter des fonctions et des variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Cette méthode ne permet pas d'ajouter des nouvelles fonctions ou variables en modifiant uniquement votre dossier ``apps`` pour faire cela il faut modifier directement
la classe ``CustomControl`` dans le fichier ``custom.js`` en ajoutant des paramètres dans le ``constructor()`` puis en suivant le mode d'emploi de la partie précédente.




