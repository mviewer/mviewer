.. Authors :
.. mviewer team
.. Sébastien FOUCHEUR

.. _customlayerdev:

Approfondir - Custom Layer
===========================

Les **Customs Layers** permettent de personnaliser la représentation et les interactions que l'on a avec les layers de façon plus avancée que ce que l'on peut faire avec le fichier de configuration XML.

Dans chacune des deux méthodes présentées dans la suite de cette page les customs layers ont pour base commune la classe ``CustomLayer`` présente dans le fichier ``custom.js``.

Les méthodes suivantes sont à utiliser dans le fichier  ``malayer.js`` qui est dans l'arborescence suivante : ::

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

Portée des exemples
--------------------

Les fichiers JavaScript des custom layers sont récupérés avec ``fetch``, puis exécutés dans une fonction créée automatiquement par ``configuration.js``. Le chargeur isole les variables et les classes de chaque fichier, sans IIFE à ajouter dans les custom layers. L'instance reste accessible depuis les autres scripts grâce à son enregistrement dans ``mviewer.customLayers``.

Les exemples sont des alternatives : choisissez celui qui correspond à votre besoin et adaptez l'identifiant de couche à votre configuration XML. Remplacez ``VOTRE_CLE_MAPTILER`` par votre clé MapTiler. Utilisez ``const`` pour les références non réaffectées et ``let`` pour l'état modifiable dans la portée locale du fichier.

Première méthode : définition simple
-------------------------------------

Cette solution crée directement une instance de ``CustomLayer``. La portée créée par le chargeur permet aussi de conserver des variables et des fonctions locales, accessibles aux méthodes de la couche personnalisée que vous définissez dans cette portée.

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    new CustomLayer("monLayer", aerial);


Seuls **l'identifiant** et **la couche OpenLayers** sont obligatoires dans le constructeur de ``CustomLayer``. Les paramètres ``legend`` et ``handle`` sont optionnels.

Ajouter des propriétés publiques
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ajoutez les propriétés à l'instance de ``CustomLayer``. La variable ``monLayer`` reste locale au fichier, mais ses propriétés publiques sont accessibles depuis un autre script via ``mviewer.customLayers["monLayer"]``.

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    const monLayer = new CustomLayer("monLayer", aerial);
    monLayer.maNouvelleFonction = function() {
        return this.maNouvelleVariable;
    };
    monLayer.maNouvelleVariable = "je suis un exemple";


Par exemple, ``mviewer.customLayers["monLayer"].maNouvelleFonction()`` renvoie la valeur de ``maNouvelleVariable``. Contrairement à ``CustomControl``, le constructeur de ``CustomLayer`` ne reçoit pas de méthodes ``init()`` et ``destroy()``.

Deuxième méthode : création d'une sous-classe
----------------------------------------------

Une sous-classe permet de structurer le code et d'ajouter des membres publics ou privés sans modifier la classe parent ``CustomLayer``. Le chargeur conserve aussi la classe dans la portée locale du fichier pour éviter les collisions de noms entre fichiers.

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    class MonCustomLayer extends CustomLayer {
        constructor(id, layer, legend, handle = false) {
            super(id, layer, legend, handle);
        }
    }

    new MonCustomLayer("monLayer", aerial);


Le constructeur de la sous-classe appelle ``super(...)`` avant d'utiliser ``this``. L'appel au constructeur parent enregistre l'instance dans ``mviewer.customLayers``.

Ajouter des membres publics
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Les propriétés et méthodes publiques appartiennent à l'instance. Elles restent accessibles via le registre, même si la classe et les variables restent locales au fichier.

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    class MonCustomLayer extends CustomLayer {
        constructor(id, layer, legend, handle = false, nouvelleVariable = "exemple") {
            super(id, layer, legend, handle);
            this.nouvelleVariable = nouvelleVariable;
        }

        maFonctionPublique() {
            return this.nouvelleVariable;
        }
    }

    new MonCustomLayer("monLayer", aerial);


Appelez la méthode avec ``mviewer.customLayers["monLayer"].maFonctionPublique()`` et accédez à la propriété avec ``mviewer.customLayers["monLayer"].nouvelleVariable``.

Conserver une fonction locale au fichier
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Déclarer une fonction avec ``const`` ne la rend pas privée. C'est la portée locale créée par le chargeur qui la rend inaccessible depuis les autres scripts. Les méthodes définies dans la même portée peuvent l'appeler grâce à la fermeture lexicale.

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    const maFonctionLocale = function() {
        return "résultat du calcul local";
    };

    class MonCustomLayer extends CustomLayer {
        maFonctionPublique() {
            return maFonctionLocale();
        }
    }

    new MonCustomLayer("monLayer", aerial);


La méthode ``mviewer.customLayers["monLayer"].maFonctionPublique()`` peut appeler ``maFonctionLocale()``, mais cette fonction locale n'est ni une variable globale ni une méthode publique de l'instance.

Définir un champ privé de classe
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Un champ préfixé par ``#`` est privé à la classe. Déclarez-le dans le corps de la classe et initialisez-le dans le constructeur. Pour autoriser sa lecture et sa modification depuis l'extérieur, exposez des méthodes publiques :

.. code-block:: javascript
    :linenos:

    const key = "VOTRE_CLE_MAPTILER";
    const aerial = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20
        })
    });

    class MonCustomLayer extends CustomLayer {
        #maVariablePrivee;

        constructor(id, layer, legend, handle = false, valeur = "valeurParDefaut") {
            super(id, layer, legend, handle);
            this.#maVariablePrivee = valeur;
        }

        getMaVariablePrivee() {
            return this.#maVariablePrivee;
        }

        setMaVariablePrivee(valeur) {
            this.#maVariablePrivee = valeur;
        }
    }

    new MonCustomLayer("monLayer", aerial);


Utilisez ``mviewer.customLayers["monLayer"].getMaVariablePrivee()`` pour lire la valeur et ``mviewer.customLayers["monLayer"].setMaVariablePrivee("nouvelle valeur")`` pour la modifier. Le champ ``#maVariablePrivee`` est accessible uniquement dans le corps de la classe.

Interactions customLayer et mviewer
-----------------------------------

Depuis un custom layer, vous pouvez utiliser les méthodes publiques de mviewer pour interagir avec la carte. Depuis un autre script, accédez à l'instance via ``mviewer.customLayers["monLayer"]`` et à sa couche OpenLayers via ``mviewer.customLayers["monLayer"].layer``. Pour en savoir plus, consultez :ref:`publicfonctions` et :ref:`customlayer`.
