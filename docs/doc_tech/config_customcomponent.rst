.. Authors :
.. mviewer team

.. _configcustomcomponent:

Configurer - Custom Component
=============================

Pour quoi faire ?
-----------------

On utilise les composants personnalisés pour modifier l'apparence de mviewer, ajouter des fonctionnalités, rajouter des librairies sans modifier le coeur de Mviewer. De cette façon, le Mviewer est ainsi plus facile à maintenir.

Il est ainsi possible de créer un composant très simple pour :

- afficher un logo dans une zone particulière
- ajouter un nouveau bouton dans la barre de navigation mviewer
- Créer un sélecteur temporel qui répercutera la sélection à l'ensemble des couches...

Les composants apportent donc plus de souplesse pour personnaliser vos Mviewer selon vos besoins.


Qui peut réaliser un composant ?
--------------------------------
Tout le monde peut réaliser un composant à condition d'être un petit peu familier avec la configuration mviewer et d'avoir des notions en JavaScript.
Une fois votre premier composant réaliser, il vous sera très facile d'en réaliser de nouveaux.


Comment faire ?
---------------

Un composant personnalisé - **customComponent** - est un dossier physique disposant d'un fichier obligatoire ``config.json`` qui identifie toutes les ressources à charger. Les ressources sont de 3 types :

- ``html`` --> html à charger
- ``css`` --> feuille de style à charger
- ``js`` --> liste de fichiers javascripts à charger

Exemple d'arborescence : ::

    /demo
            ├── components
            │   ├── 3d
            │   │   ├── js
            │   │   │   ├── lib.js
            │   │   │   └── main.js
            │   │   │
            │   │   ├── config.json
            │   │   ├── component.html
            │   │   ├── style.css
            │   │
            │   ├── autre_customComponent



Exemple de fichier config.json :

.. code-block:: JSON
  :linenos:

    {
      "js": [
          "js/lib.js",
          "js/main.js"
      ],
      "css": "style.css",
      "html": "component.html",
      "target": "map",
      "options": {
          "title": "3D",
          "position": 0,
      }
    }

Le composant sera alors créé dans une **div** mviewer existante ciblée par le paramètre **target**.
Par défaut le composant est ajouté comme dernier noeud enfant du **target** dans le DOM. 
Le paramètre optionnel **position** permet de changer cette position et ajouter le composant comme enfant **n** du **target**.

extrait de configuration xml :

.. code-block:: XML
  :linenos:

    <config>
        <extensions>
            <extension type="component" id="3d" path="demo/components"/>
        </extensions>
    </config>


.. Note::
    Apprendre par l'exemple :

    - :ref:`customcomponent`
