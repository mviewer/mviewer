.. Authors :
.. mviewer team

.. _translation:

Configurer - Traduction
=========================

Cette page vous servira à comprendre et mettre en place les éléments pour traduire le mviewer.

`Démonstration d'application multilingue <http://kartenn.region-bretagne.fr/kartoviz/?config=demo/lang.xml&lang=fr>`_.

Les dépendances utilisées pour cette démo (exemples de fichier de traduction, ficher de documentation et fichiers templates .mst) sont stockées dans le répertoire /demo/lang.

Toutes les illustrations mentionnées dans la documentation sont issues de cet exemple.


Fonctionnement technique
========================

**Librairies**
Le mviewer utilise la libraire `i18n.js <https://i18njs.com/>`_ pour traduire l'interface vers le langage de votre choix.

**Principe**

La traduction s'appuie sur un dictionnaire de traduction (fichier `mviewer i18n json <https://github.com/mviewer/mviewer/blob/develop/docs/doc_tech/config_translate.rst>`_).
Tous les éléments html disposant d'un attribut i18n seront traduits si une correspondance est trouvée dans le dictionnaire::

    <span i18n="une.cle.a.traduire"> une valeur par défaut </span>


Le fichier mviewer.i18n.json est structuré pour utiliser plusieurs langues de traduction::

    {
        "fr": {
            "une.cle.a.traduire": "une valeur en français",
            "une.autre.cle": "une autre valeur en français"
        },
        "en": {
            "une.cle.a.traduire": "a value",
            "une autre cle": "another value"
        }
    }


Pour trouver la valeur à traduire, le système recherchera donc la clé contenue dans l'attribut "i18n" de notre élément de la page dans la langue sélectionnée::

    <span i18n="search.adresse"> une valeur par défaut </span>

    // donnera pour le français
    "une.cle.a.traduire": "une valeur en français"

La valeur traduite sera ensuite appliquée sur l'élément de la page à la place de la valeur par défaut.

Le texte affiché pour notre élément de la page (<span>) sera alors::

    "une valeur en français"

Traduction de l'interface
=========================

**Paramètre de configuration à utiliser**

Il vous faudra ajouter dans votre fichier de configuration les propriétés suivantes comme décrit dans  la `page mviewer <https://github.com/mviewer/mviewer>`_: 

- lang

Langue à utiliser pour l'interface. Si plusieurs langues sont spécifiées, un menu additionnel sera créé afin de permettre à l'utilisateur de choisir sa langue. La première langue de la liste saisie sera alors utilisée par défaut. Par défaut, lang n'est pas activé.

Exemple de configurations pour une application en français, allemand et anglais :

.. code-block:: xml
    
    lang= "fr,de,en"

Fichier de traduction associé: `./mviewer.i18n.json <https://github.com/mviewer/mviewer/blob/master/mviewer.i18n.json>`_


Traduction des éléments propres à votre application mviewer
===========================================================

**Paramètre de configuration à utiliser**

- langfile

URL du fichier de traduction supplémentaire, spécifique à l'application, à utiliser en complément de *mviewer.i18n.json* (fichier de traduction générique, qui concerne l'interface).
Ce fichier peut être un fichier distant (URL classique type https://) ou bien un fichier localisé n'importe où dans votre serveur web.

**Action à faire dans le fichier xml**

Il est nécessaire de rajouter le paramètre *langfile* dans le fichier xml de l'application pour que le dictionnaire spécifique à celle-ci soit pris en compte. Pour rappel, ce paramètre est saisi en complément du paramètre *lang* qui permet de définir les différents langages disponibles pour l'application.

Grâce à ce paramètre, l'application va identifier l'emplacement du dictionnaire de l'application *nom_de_l’applicaction.i18n.json*. La description de ce fichier est disponible dans le dernier paragraphe de cette documentation.

Voici un exemple de configuration à rajouter dans les paramètres de l'application (fichier xml) ::

    langfile="/demo/lang/lang.i18n.json"

Par ailleurs, si vous souhaitez utiliser un template *mustache* multilingue associé à une donnée, il est important de le renseigner dans le fichier xml selon les règles mentionnées ci-dessous pour qu'il soit opérationnel dans chaque langue.

**Actions à faire pour les templates mustache (.mst)**

Si vous souhaitez obtenir des templates différents selon les langues pour l'interrogation de vos couches, il faudra réaliser autant de templates que de langues proposées.

Grâce à une convention de nommage, l'application reconnaitra le fichier adapté et proposera aux utilisateurs le template correspondant à la langue choisie.

Le nommage des fichiers se fera de la façon suivante :

    nom-du-template\_ **codelangue** .mst

Le code langue correspond à celui utilisé dans le paramètre *lang* du fichier xml. Il est composé de deux caractères et correspond à la norme ISO-639-1. Par exemple, pour un fichier template en français, nous utiliserons le suffixe 'fr'.

•	Dans le fichier xml (en complément des paramètres *lang* et *langfile*), il s'agira de spécifier l'emplacement du template et de le renseigner sans le suffixe avec le code langue :
    
.. code-block:: xml
    
    <template url=demo/lang/customcontrols/exemple_couche_1></template>

•	Dans le répertoire où les templates sont stockés :

::

    demo/lang/customcontrols/
    ├── exemple_couche_1_fr.mst
    ├── exemple_couche_1_de.mst
    ├── exemple_couche_1_en.mst
    └── ...

**Traductions avec des templates distants**

Si vous utilisez des templates distants (apis, liens externes,...) au lieu de fichiers sur votre serveur, mviewer fera appel à votre template distant en ajoutant le suffixe de la langue choisie comme paramètre.

Par exemple, pour *lang='en,fr,de'*, 3 requêtes seront envoyées :

    - https://votre_url/exemple_couche_1?lang=en
    - https://votre_url/exemple_couche_1?lang=fr
    - https://votre_url/exemple_couche_1?lang=de

**Traductions de la documentation**

Les éléments figurant dans le fichier html de la documentation peuvent également être traduit dans le dictionnaire de l'application ( *lang.i18n.json* dans la démonstration). Pour cela, il faut que les textes que l'on souhaite traduire soit directement à l'intérieur d'une balise portant l'attribut i18n. Ensuite, cette même balise doit être mentionnée dans le dictionnaire de l'application.

Exemple de fichier de documentation :

.. code-block:: html
    
    <div>
        <h3 class="title-feature" i18n="titre_documentation">Titre de la documentation</h3>     
        <p class="text-feature" i18n="texte_documentation_1">
            Ceci est un exemple de texte présent dans la documentation. 
        </p>
        <p class="text-feature_credit" i18n="texte_documentation_2">
            Mviewer est un Visualiseur géographique basé sur OpenLayers 6.3.1 et Bootstrap 3.3.6.
        </p>
    </div>

**Dictionnaire de l'application (nom_de_l'applicaction.i18n.json)**

C'est le fichier central de traduction de tous les éléments traduits en dehors de l'interface. Il recense les valeurs et leurs traductions des textes propres à l'application (titre, thèmes, couches, éléments de légendes) et ceux présents dans la documentation.

Exemple issu de l'application démo du multilingue (lang.i18n.json) :

.. code-block:: json
    
    {
        "fr": {
            "loader.title" : "Titre en français lors du chargement de l'application", 
            "map_title" : "Démonstration d'une application mulitinlingue",
            "themes.bonnes_pratiques" : "Nom du premier thème",
            "layers.adaptation_changement_climatique" : "Nom de la couche 1",
            "adaptation_changement_climatique.legend.title" : "Titre de la couche 1 dans la légende",
            "adaptation_changement_climatique.legend.attribution" : "Source de la couche 1",
            "themes.context":"Nom du deuxième thème",
            "layers.zone_interreg_RS":"Nom de la couche 2",
            "zone_interreg_RS.legend.title" : "Titre de la couche 2 dans la légende",
            "zone_interreg_RS.legend.attribution" : "Source de la couche 2",
            "layers.limites_communales":"Nom de la couche 3",
            "limites_communales.legend.title" : "Titre de la couche 3 dans la légende",
            "limites_communales.legend.attribution" : "Source de la couche 3",
            "titre_documentation":"Titre de la documentation",
            "texte_documentation_1":"Ceci est un exemple de texte présent dans la documentation. ",
            "texte_documentation_2":"Mviewer est un Visualiseur géographique basé sur OpenLayers 6.3.1 et Bootstrap 3.3.6."
        },
        "de": {
            "loader.title" : "Deutscher Titel beim Laden der App",
            "map_title" : "Demo einer mehrsprachigen App",
            "themes.bonnes_pratiques" : "Name des ersten Themas",
            "layers.adaptation_changement_climatique" : "Name der Ebene 1",
            "adaptation_changement_climatique.legend.title" : "Titel der Ebene 1 in der Legende",
            "adaptation_changement_climatique.legend.attribution" : "Quelle von Ebene 1",
            "themes.context":"Name des zweiten Themas",
            "layers.zone_interreg_RS":"Name der Ebene 2",
            "zone_interreg_RS.legend.title" : "Titel von Ebene 2 in der Legende",
            "zone_interreg_RS.legend.attribution" : "Quelle von Ebene 2",
            "layers.limites_communales":"Name der dritten Ebene",
            "limites_communales.legend.title" : "Titel von Ebene 3 in der Legende",
            "limites_communales.legend.attribution" : "Quelle von Ebene 3",
            "titre_documentation":"Titel der Dokumentation",
            "texte_documentation_1":"Dies ist ein Beispiel für Text, der in der Dokumentation vorkommt.",
            "texte_documentation_2":"Mviewer ist ein geografischer Viewer, der auf OpenLayers 6.3.1 et Bootstrap 3.3.6 basiert."
        },
        "en": {
            "loader.title" : "Title in English when the application loads",
            "map_title" : "Demonstration of a multilingual application",
            "themes.bonnes_pratiques" : "Name of the first theme",
            "layers.adaptation_changement_climatique" : "Name of the layer 1",
            "adaptation_changement_climatique.legend.title" : "Title of the layer 1 in the legend",
            "adaptation_changement_climatique.legend.attribution" : "Source of layer 1",
            "themes.context":"Name of the second theme",
            "layers.zone_interreg_RS":"Name of the layer 2",
            "zone_interreg_RS.legend.title" : "Title of the layer 2 in the legend",
            "zone_interreg_RS.legend.attribution" : "Source of layer 2",
            "layers.limites_communales":"Name of the layer 3",
            "limites_communales.legend.title" : "Title of the layer 3 in the legend",
            "limites_communales.legend.attribution" : "Source of layer 3",
            "titre_documentation":"Title of the documentation",
            "texte_documentation_1":"This is an example of text that appears in the documentation.",
            "texte_documentation_2":"Mviewer is a geographic viewer based on OpenLayers 6.3.1 and Bootstrap 3.3.6."
        }
    }

A noter que si vous voulez identifier une *clé i18n* à renseigner dans le dictionnaire, vous pouvez utiliser le paramètre **&debug_translation=true** dans l'url de votre application. Alors, les valeurs des clés i18n s'afficheront sur l'interface de l'application.

Enfin, il est important aussi de souligner qu'en rajoutant le paramètre **&lang=en** (par exemple), vous pouvez forcer une langue via l'url (ici l'anglais) sans passer par le bouton sélecteur de langue.