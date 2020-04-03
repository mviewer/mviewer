.. Authors : 
.. mviewer team
.. Sébastien FOUCHEUR

.. _configcustomcontrol:

Configurer - Custom Control
===========================

Les **Customs Controls** permettent de personnaliser la représentation et les interactions que l'on a avec les layers de façon plus avancée que ce que l'on peut faire avec le fichier de configuration XML.

Première Méthode
----------------

Tous les Custom Control ont une base commune dans le fichier ``custom.js`` ou est définie la class ``CustomControl`` :

.. code-block:: javascript
  :linenos:
    
    // Class abstraite
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

Pour utiliser cette classe il faut modifier le fichier javascript (dans cette exemple ``moncontrol.js``) present dans l'arborescence suivante::

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

Ce fichier définie une classe qui etend (est un héritier de la classe) la classe ``CustomControl`` :

.. code-block:: javascript
  :linenos:
    
    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        constructor(id) {
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
        }
        // Obligatoire - ce code est executer lors de l'ouverture du panel
        init() {
            // Votre code ici
            ...
        }
        // Obligatoire - ce code est executer lors de la fermeture du panel
        destroy() {
            // Votre code ici
            ...
        }
    }

La classe ``CustomControl`` étant **abstraite** cela signifie qu'elle nous oblige a redefinir les fonctions ``init()`` et ``destroy()`` qui sont obligatoires sinon elle nous renvoie une erreur. 

De plus la fonction ``constructor(id)`` permet à l'objet d'être initialisé avec la valeur **id** lors de la création d'un **objet MonControl**.

Pour creer cet objet et le rendre disponible au reste de l'application il faut rajouter le code suivant :

.. code-block:: javascript
  :linenos:

    // Créer l'objet control avec l'id 'moncontrol' qui est le nom de la couche
    new MonControl("moncontrol");

----

Ajouter des fonctions
~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bug on peut ajouter a la classe ``MonControl`` (vue dans les partie précendente) des fonctions privées ou publics.

Une fonction privée ne sera pas accesible en dehors du code de la classe alors qu'une fonction publique sera accesible depuis n'importe où ce qui peut entrainer des conflits avec d'autres fonctions 
de l'application si l'on ne fait pas attention.

Pour une fonction publique
**************************

Directement en rajoutant dans le code de la classe ``MonControl`` :

.. code-block:: javascript
  :linenos:

    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        ...
        maFonctionPublique(){
            // Votre code ici
            ...
        }
    }
    new MonControl("moncontrol");

Cette fonction sera appelable grâce à ``monobjet.maFonctionPublique()`` et l'on peut bien sûre y passer des paramètres.

Pour une fonction privée
************************

En degors du code de la classe ``MonControl`` et en la decalrant comme une ``constante`` :

.. code-block:: javascript
  :linenos:

    // Fonction privée non utilisable en dehors de ce code
    const maFonctionPrivée = function(){
        // Votre code ici
        ...
    }
    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        ...
        maFonctionPublique(){
            maFonctionPrivée();
            // Votre code ici
            ...
        }
    }
    new MonControl("moncontrol");

Cette fonction sera appelable grâce à ``maFonctionPrivée()`` seulement dans ce bout de code et donc on peut par exemple l'utilisée dans une fonction public (ici ``maFonctionPublique()``).

Ajouter des variables
~~~~~~~~~~~~~~~~~~~~~

Pour empêcher de potentiels bug on peut ajouter a la classe ``MonControl`` (vue dans les partie précendente) des variables de classe privées ou publics.

Une variable de classe privée ne sera pas accesible en dehors du code de la classe alors qu'une variable de classe publique sera accesible depuis n'importe où ce qui peut entrainer des bugs (modification involontaire de celle ci)
si l'on ne fait pas attention.

Pour une variable de classe publique
************************************

Pour ajouter une variable de class publique il faut juste ajouter une propiété à l'objet :

.. code-block:: javascript
  :linenos:

    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        constructor(id,maVariablePublique){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            //Initialiser.maVariablePublique
            this.maVariablePublique = maVariablePublique
            ...
        }
        ...
    }
    // Initialiser l'objet avec la chaine de caractères "maVariablePublique" dans la variable de classe publique maVariablePublique
    new MonControl("maVariablePublique");

Cette variable est accesible à partir du moment où l'on accède à l'objet (dans le navigateur par exemple). 

Si on ne souhaite pas forcément donner une valeur a ``maVariablePublique`` on peut déclarer une valeur par defaut en specifiant une valeur dans les paramètres de la fonction constructor : 

.. code-block:: javascript
  :linenos:

    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        // Fonction avec un paramètre ayant une valeur par défaut
        constructor(id,maVariablePublique = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            //Initialiser.maVariablePublique
            this.maVariablePublique = maVariablePublique
            ...
        }
        ...
    }
    // Initialiser l'objet avec la chaine de caractères par defaut "valeurParDefaut" dans la variable de classe publique maVariablePublique
    new MonControl();

La valeur de ``maVariablePublique`` sera toujours **"valeurParDefaut"** tant que vous ne spécifiez pas d'autres valeur.

Pour une variable de classe privée
**********************************

Pour ajouter une variale de classe privée il faut rajouter le **"#"** avant le nom de la variable et la décalrer avant la fonction constructor :

::

    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        // Déclaration de la variable Privée
        #maVaribalePrivee;
        constructor(id,maVaribalePrivee = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            //Initialiser #maVaribalePrivee
            this.#maVaribalePrivee = maVaribalePrivee
            ...
        }
        ...
    }
    // Initialiser un objet avec la chaine de caractères par defaut "maVaribalePrivee" dans la variable de classe publique maVaribalePrivee
    new MonControl("maVaribalePrivee");

Si vous voulez quand pouvoir accéder et modifier la valeur de cette variable en dehors de ce code mais de manière plus sécuriser il faut declarer une fonction ``get()`` pour récupérer la valeur et une fonction
``set(valeur)`` pour la modifier :

::

    //Classe qui etend la classe abstraite et decris le custom Control
    class MonControl extends CustomControl {
        // Déclaration de la variable Privée
        #maVaribalePrivee;
        constructor(id,maVaribalePrivee = "valeurParDefaut"){
            // Initialise l'id de l'objet avec le constructeur parent 
            super(id);
            //Initialiser #maVaribalePrivee
            this.#maVaribalePrivée = maVaribalePrivee
            ...
        }
        // Fonction pour récuperer la valeur de #maVaribalePrivee
        getMaVaribalePrivee(){
            return this.#maVaribalePrivee;
        }
        // Fonction pour modifier la valeur de #maVaribalePrivee
        setMaVaribalePrivee(valeur){
            this.#maVaribalePrivee = valeur;
        }
    }
    // Initialiser un objet avec la chaine de caractères par defaut "maVaribalePrivee" dans la variable de classe publique maVaribalePrivee
    new MonControl("maVaribalePrivee");

Deuxième Méthode
----------------

Ajouter des fonctions
~~~~~~~~~~~~~~~~~~~~~

Ajouter des variables
~~~~~~~~~~~~~~~~~~~~~

