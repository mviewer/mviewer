.. Authors :
.. mviewer team

.. _configcustomcomponent:

Configurer - Custom Component
=============================

Pour quoi faire ?
-----------------

On utilise les composants personnalisés pour modifier l'apparence de mviewer, ajouter des fonctionnalités sans modifier le coeur de mviewer.
Il est ainsi possible de créer un composant très simple  pour :

- afficher un logo dans une zone particulière
- ajouter un nouveau bouton dans la barre de navigation mviewer
- Créer un sélecteur temporel qui répercutera la sélection à l'ensemble des couches...

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
