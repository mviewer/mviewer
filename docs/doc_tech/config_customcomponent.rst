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
- ``css`` --> feuille(s) de style à charger, optionnelle. Cette propriété peut être
  une chaîne (``"style.css"``) ou une liste de fichiers CSS.
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

Voici un extrait de la configuration xml :

.. code-block:: XML
  :linenos:

    <config>
        <extensions>
            <extension type="component" id="3d" path="addons"/>
        </extensions>
    </config>


Configurer un composant depuis le XML ou l'URL
------------------------------------------------

Les possibilités de configuration sont les suivantes :

- **Choisir le fichier de configuration.**

Par défaut, mviewer charge ``{path}/{id}/config.json``. L'attribut optionnel ``config`` permet de désigner un autre fichier, relatif à l'application ou sous la forme d'une URL absolue :

  .. code-block:: XML

      <extension
          type="component"
          id="print"
          path="addons"
          config="demo/print-config.json"/>

  Les ressources déclarées dans ce fichier (``js``, ``css`` et ``html``) restent relatives au dossier du composant défini par ``path`` et ``id``.

- **Définir des options dans le XML.**

Elles permettent d'adapter un composant à une application sans modifier son fichier ``config.json`` :

  .. code-block:: XML

      <extension type="component" id="print" path="addons">
          <config>
              <options>
                  <option name="printLayouts" value="addons/print/layouts/standard.json"/>
                  <option name="ownerInfos" value="Cette carte a été réalisée pour mon organisation"/>
              </options>
          </config>
      </extension>

- **Surcharger les options depuis l'URL.**

Les options résolues sont exposées aux scripts du composant dans ``mviewer.customComponents["mon-composant"].options``. Elles sont fusionnées dans l'ordre de priorité suivant :

  #. paramètres de l'URL ;
  #. options déclarées dans le XML ;
  #. options du ``config.json``.

  Les paramètres d'URL sont préfixés par l'identifiant du composant afin d'éviter les collisions. Par exemple, pour l'addon ``isochroneAddon`` :

  .. code-block:: text

      https://monsite.fr/mviewer/?config=demo/ign.xml&isochroneAddon.isoTitle=foobar&isochroneAddon.isochroneUrl=https%3A%2F%2Fdata.geopf.fr%2Fnavigation%2Fisochrone

  Les valeurs peuvent être des chaînes ou des valeurs JSON encodées. Elles ne sont jamais exécutées comme du JavaScript.
  Pour transmettre une URL comme valeur, encodez-la avec ``encodeURIComponent`` : ``https://data.geopf.fr/navigation/isochrone`` devient ``https%3A%2F%2Fdata.geopf.fr%2Fnavigation%2Fisochrone``. Cet encodage est indispensable si l'URL contient des caractères réservés, notamment ``?``, ``&`` ou ``#``.


Exemples
--------

Afin de mieux comprendre ce que fait un composant et pour vous en inspirer, voici des exemples de niveau simple et avancé.

- Ajouter un logo.

`Ce composant <https://kartenn.region-bretagne.fr/kartoviz/?config=demo/logo.xml#>`_ permet d'ajouter un logo dans votre Mviewer.
Pour vous approprier facilement les composant, vous pouvez commencer par observer et reproduire ce premier composant avec votre propre composant.


- Réaliser un graphique en 3D

`Ce composant <https://kartenn.region-bretagne.fr/kartoviz/?config=demo/customcomponent.xml>`_ permet de créer un graphique en 3D avec des boutons et iterfaces de contrôle. Ce composant montre que l'on peut vraiment importer des librairies externes et afficher ce que l'on souhaite dans l'interface Mviewer.

- Filtrer les données dans une fenêtre flottante

`Ce composant <https://www.pigma.org/public/visualiseur/mviewer/?config=apps/donneesplages/donneesplages.xml>`_ permet de créer une fenêtre qui contiendra des filtres sur la couche de votre choix.
Ici, nous utilisons une librairie externes pour ajouter une fenêtre flottante qui n'existe pas nativement dans le Mviewer.

Ce composant permet ainsi de rajouter une fonctionnalité de filtre sur les données qui n'existe pas nativement dans le Mviewer.

.. Note::
    Apprendre par l'exemple :

    - :ref:`customcomponent`
