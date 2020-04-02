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

Ce fichier définie une classe qui etend la classe ``CustomControl`` :

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
            console.log('initialized');
        }
        // Obligatoire - ce code est executer lors de la fermeture du panel
        destroy() {
            console.log('destroyed');
        }
    }

La classe ``CustomControl`` étant **abstraite** cela signifie qu'elle nous oblige a redefinir les fonctions ``init()`` et ``destroy()`` qui sont obligatoires sinon elle nous renvoie une erreur. De plus la fonction
``constructor(id)`` permet à l'objet d'être initialisé avec la valeur **id** lors de la création d'un **objet MonControl**.
Pour creer cet objet et le rendre disponible au reste de l'application il fau rajouter le code suivant :

.. code-block:: javascript
  :linenos:

    // Créer l'objet control avec l'id 'moncontrol' qui est le nom de la couche
    new MonControl("moncontrol");

----

Ajouter des fonctions
~~~~~~~~~~~~~~~~~~~~~



Ajouter des variables
~~~~~~~~~~~~~~~~~~~~~


Deuxième Méthode
----------------

Ajouter des fonctions
~~~~~~~~~~~~~~~~~~~~~

Ajouter des variables
~~~~~~~~~~~~~~~~~~~~~

