.. Authors :
.. mviewer team

.. _translation:

Configurer - Traduction
=========================

Cette parge vous servira à comprendre et mettre en place les éléments pour traduire le mviewer.

`Démonstration kartenn <http://kartenn.region-bretagne.fr/kartoviz/?config=demo/lang.xml&lang=fr>`_.


Fonctionnement technique
------------------------

**Librairies**
Le mviewer utilise la libraire `i18n.js <https://i18njs.com/>`_ pour traduire l'interface vers le langage de votre choix.

**Principe**

La traduction s'appuie sur un dictionnaire de traduction (fichier mviewer.i18n.json).
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

Quels sont les paramètres de configuration utilisés ?
-----------------------------------------------------

Il vous faudra ajouter dans votre fichier de configuration les propriétés suivantes comme décrit dans  la `page mviewer <https://github.com/geobretagne/mviewer>`_: 

- lang

*Langue à utiliser pour l'interface. Si plusieurs langues sont spécifiées, un menu additionnel sera créé afin de permettre à l'utilisateur de choisir sa langue a première langue de la liste saisie sera alors utilisée par défaut. Par défaut, lang n'est pas activé.*

- langfile

*URL du fichier de traduction supplémentaire à utiliser en complément de mviewer.i18n.json. 
Ce fichier peut être un fichier distant (URL classique type https://)  ou bien un fichier localisé n'importe où dans votre serveur web.*


Voici un exemple::

    <?xml version="1.0" encoding="UTF-8"?>
    <config>
    <application title="Une belle carte" langfile="./custommviewer.i18n.js" lang="en,fr"></>

Vous pouvez donc changer de langue via l'URL directement. Essayez en premier avec cette url:

    http://kartenn.region-bretagne.fr/kartoviz/?config=demo/lang.xml

Maintenant rajoutez ::
    
    lang=fr

http://kartenn.region-bretagne.fr/kartoviz/?config=demo/lang.xml&lang=fr


Interface de changement de langue
---------------------------------

**Sélecteur de langue**

Selon votre paramètre *lang* le mviewer vous permettra de sélectionner parmis les valeurs de traduction disponibles.

Avec "lang=fr" ou aucun paramètre "lang" vous n'ajouterez pas cette interface. Avec *lang=en,fr* vous pourrez modifier la langue dans l'interface du mviewer.

**Affichage du sélecteur**

Deux types d'affichage existent: 

- Une liste de sélection::

    <application lang="en,fr" langfile="demo/demo.i18n.json"/>

    
    .. image:: ../_images/dev/config_translate/list_lang.png
              :alt: lang selector
              :align: center

Dans cette configuration, la liste de sélection sera remplacée par une popup pour les petits écrans (mobiles et tablettes). 

    .. image:: ../_images/dev/config_translate/mobile_lang.png
              :alt: mobile translation selector
              :align: center

Cette fenêtre sera accessible via la barre de navigation en haut.

    .. image:: ../_images/dev/config_translate/lang_modal.png
              :alt: lang modal as popup
              :align: center

- Dans la fenêtre d'aide en ajoutant le paramètre *showhelp="true"* dans la configuration de l'application::

    <application lang="en,fr" langfile="demo/demo.i18n.json" help="demo/demo_lang_help.html" showhelp="true"/>

Les langues seront visibles ainsi : 

    .. image:: ../_images/dev/config_translate/lang_showhelp.png
              :alt: lang modal into showhelm
              :align: center


Comment insérer vos traductions ?
---------------------------------

1 - Créez un fichier de traduction au format JSON ou compléter le fichier mviewer.i18n.json déjà disponible

Nous recommandons de créer un nouveau fichier. Le fichier mviewer.i18n.js sera ainsi surchargé (= complété) par votre fichier de traduction.

2 - Insérez les traductions dans le fichier en respectant ce formalisme::

    {
        "fr": {
            "popup.help.title": "Bienvenu"
        },
        "en": {
            "popup.help.title": "Welcome"
        },
        "bzh": {
            "popup.help.title": "Degemer mat"
        }
    }

3 - Pour du nouveau contenu HTML, rajoutez l'attribut *i18n='popup.help.title'* pour que le contenu soit traduit et 
rajoutez les nouvelles clés dans votre fichier de traduction::

    <span i18n="search.adresse"> une valeur par défaut </span>

4 - Ajoutez les paramètres *lang='en,fr,bzh'* et *langfile='./chemin/fichier/traduction'*

5 - Eventuellement, choissisez d'afficher le sélecteur de langue dans la popup d'aide avec le paramètre *showhelp='true'*

6 - Testez
