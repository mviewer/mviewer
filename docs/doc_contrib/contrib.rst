.. Authors :
.. mviewer team

.. _contrib:

Contribuer
=========================

Cette partie permet de donner des clés pour contribuer à mviewer.


Présentation générale
---------------------

Après un déploiement, mviewer permet nativement d'obtenir une carte fonctionnelle.

Cependant vous pouvez ressentir le besoin de modifier mviewer pour créer vos propres cartes, vos propres fonctionnalités et apporter vos propres styles. Pour y arriver vous vous sentez probablement un peu perdu dans cet ensemble de dossiers et fichiers dont vous ne savez pas lesquels il est pertinent de modifier.

Vous trouverez ici une présentation et des recommandations pour créer vos cartes et vos fonctionnalités sans modifier le cœur (ou presque).
Vous obtiendrez un mviewer maintenable et vous n'aurez plus l'appréhension de toucher aux mauvais fichiers.

.. warning::
    Une contribution doit toujours cibler la branche develop.
    Pensez à prendre connaissance du worflow Git suivi par mviewer pour les explications.



Code style
---------------------

.. warning::
    Ne jamais modifier les fichiers présentés ci-dessous, sauf si la modification des règles de style est demandées par la communauté !

Cette section vous permettra de connaître les règles à utiliser lors de l'écriture du code dans mviewer.
Ces règles permettent d'assurer que les contributions sont uniformes (e.g indentations, longueur de lignes, etc.) et le code de meilleur qualité.

Les règles de style permettent également d'adopter les bonnes règles pour tous afin de faciliter la comparaison des fichiers et les contributions.

**1. Formattage dans VS Code**

Dans VS Code, vous trouverez un fichier `.vscode/settings.json`.

Ce fichier contient des règles de paramétrage de VS Code qui peuvent être réutilisées par défaut par tous les développeur qui utilisent VS Code avec mviewer.

Ce fichier `settings.json` permet de définir le formatter par défaut par type de language.

Il permet aussi d'utiliser le formattage automatique à la sauvegarde : 

::

    "editor.formatOnSave": false

Dans VS Code, si vous n'utilisez pas ce fichier, vous pouvez formatter à la sauvegarde automatiquement via les préférences VS Code décrites plus bas. 

**2. Prettier**

Mviewer utilise `Prettier <https://prettier.io/>`_.


Vous pouvez utiliser Prettier en ligne si vous ne vous voulez pas utiliser node.js en suivant les actions définies `ici <https://github.com/mviewer/mviewer/issues/739>`_


Vous pouvez également utiliser l'éditeur Visual Studio Code et son plugin `Prettier - Code formatter <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>`_ (npm obligatoire).


* Installation

Via `npm` (voir `ici <https://github.com/mviewer/mviewer#d%C3%A9ploiement-avec-nodejs>`_ pour installer `npm`):

::

    npm install

A l'ouverture du projet mviewer avec VS Code, le plugin détectera automatiquement les fichiers `.prettierrc` et `.prettierignore`.
Les règles seront donc automatiquement détectées et vous pourrez alors utiliser `Prettier` pour appliquer les règles de style au code mviewer.

* Fichier .prettierrc

C'est le fichier de configuration de Prettier (format JSON).
Il contient toutes les règles à utiliser par Prettier.

Ce fichier situé à la racine contient les règles que toute la communauté utilise.

Pour plus d'informations sur la configuration :

https://prettier.io/docs/en/configuration.html

* Fichier .prettierignore

Ce fichier permet d'ignorer certains fichiers ou dossier du code mviewer.

::

    # Ignore artifacts:
    build
    coverage

    # Ignore all HTML files:
    *.html

    # Ignore folders :
    **/lib

Pour plus d'informations, sur ce fichier :

https://prettier.io/docs/en/ignore.html

**3. Formatter vos fichiers avec Prettier**

Avec VS Code, le formattage peut être réalisé à la sauvegarde ou à la demande.

- Formattage à la sauvegarde

Vous devez paramétrer votre éditeur pour formatter à la sauvegarde ou utiliser le fichier `.vscode` décrit plus haut.

Avec VS Code, aller dans Fichier > Préférences > Paramètres et rechercher `format on save`.
Cocher alors `Editor:Format on save` pour activer le formattage à la sauvegarde.

- Formattage à la demande

Avec VS Code, réaliser un clic droit dans le fichier et cliquer sur `mettre en forme le document avec... `.
Sélectionner alors `Prettier` dans la liste .

- Fromattage via `npm`

Le fichier `/mviewer/package.json` contient une commande `pretty`.
Cette commande va effectuer un formattage sur les fichiers `.js` et `.json` des répertoires `/js`, `/demo`, `/customcontrols`, `/customlayers`.

::

    "pretty": "prettier --write \"./mviewer.i18n.json\" \"./js/**/*.{js,json}\" \"./demo/**/*.{js,json}\" \"./customcontrols/*.{js,json}\" \"./customlayers/*.{js,json}\""

Elle s'exécute dans le répertoire `/mviewer` comme ceci :

:: 

    npm install
    npm run pretty

Le cœur de mviewer
------------------

**Qu'est-ce que c'est ?**

C'est l'ensemble des fichiers et dossiers présents nativement sur la page `GitHub mviewer <https://github.com/mviewer/mviewer>`_.

**Quand puis-je le modifier ?**

Vous devez éviter de modifier les fichiers natifs du mviewer. En effet, modifier ces fichiers vous empêchera de mettre à jour facilement votre déploiement de mviewer pour prendre en compte une nouvelle version officielle.

Néanmoins, vous pouvez être amené à modifier ces fichiers principalement pour contribuer au développement de l'outil :

- Vous détectez un bogue ou un comportement suspect et vous le corrigez.
- Vous créez une évolution sur le cœur (une nouvelle fonctionnalité).
- Vous créez une amélioration du code existant.

Dans chacune de ces situations l'intervention sur le cœur de mviewer doit être justifiée par une issue sur GitHub.


Les autres fichiers
-------------------

Pour vos modifications et l'organisation de vos fichiers, nous recommandons de suivre la page ":ref:`orgfiles`".


.. _ask:

Processus type d'une modification
----------------------------------

Avant de modifier le code, identifiez le ou les dépôts à toucher :

- **Correctif ou amélioration du cœur seulement** : dépôt ``mviewer`` uniquement ; clone minimal (sans sous-dépôts) suffisant.
- **Nouvelle fonctionnalité avec démonstration** : dépôt ``mviewer`` + sous-dépôt ``demo`` (``git submodule update --init demo``) pour ajouter ou mettre à jour la démo associée.
- **Nouvel addon** : dépôt ``mviewer-addons`` (``git submodule update --init addons``) et, si besoin, ``demo`` pour publier un exemple d'usage.

Pour proposer une correction d'anomalie ou une évolution, suivez ensuite ces étapes :

#. Créer une issue sur Github en suivant la page :ref:`issue`.
#. Faire un fork du code (si ce n'est pas encore fait) en suivant la page :ref:`fork`.
#. Créer une branche portant le numéro de l'issue (ex: ``issue-2287``) à partir de la branche ``develop`` (à jour !)
#. Apporter vos modifications sur cette branche en incluant :
   - le code du cœur dans ``mviewer`` ;
   - la démonstration dans le dépôt ``mviewer-demo`` si nécessaire (branche nommée de la même manière) ;
   - la documentation dans ``docs/`` pour décrire la modification et son paramétrage ;
   - le nouvel addon dans le dépôt ``mviewer-addons`` avec un ``README.md`` dédié le cas échéant.
#. Partager vos problématiques rencontrés ou vos propositions dans l'issue directement pour que les autres puissent tester et donner des avis. Vous pouvez auss epxpliquer la solution proposée dans le pull request.
#. Réaliser une ou plusieurs pull requests via GitHub en suivant la page :ref:`pr` :
   - une PR ciblera toujours la branche ``develop``
   - une PR par dépôt (``mviewer``, ``mviewer-demo``, ``mviewer-addons``) si plusieurs dépôts sont concernés
   - indiquez dans chaque PR les liens vers les autres PR associées pour faciliter la revue

La pull request (ciblant ``develop``) permettra d'importer votre modification dans le code natif et dans les sous-dépôts concernés. Vous disposerez alors de votre modification de manière native sans vous en préoccuper ultérieurement.

Contribuer avec les sous-dépôts (mviewer ≥ 4)
--------------------------------------------

Depuis mviewer 4, les répertoires ``demo`` et ``addons`` sont des sous-dépôts Git indépendants (`mviewer-demo <https://github.com/mviewer/mviewer-demo>`_ et `mviewer-addons <https://github.com/mviewer/mviewer-addons>`_).
Ils sont facultatifs : vous pouvez utiliser mviewer sans les initialiser ou les initialiser au cas par cas pour alléger vos déploiements.
Quand vous préparez une contribution, choisissez les dépôts concernés en fonction des éléments modifiés.

Commandes utiles pour cloner et récupérer les sous-dépôts
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- **Clone minimal (sans sous-dépôts)** :

  .. code-block:: bash

     git clone https://github.com/mviewer/mviewer.git --branch develop

- **Clone complet (cœur + ``demo`` + ``addons``)** :

  .. code-block:: bash

     git clone https://github.com/mviewer/mviewer.git --branch develop --recurse-submodules

- **Initialiser les sous-dépôts après un clone existant** :

  .. code-block:: bash

     git submodule update --init --recursive

- **N'initialiser qu'un seul sous-dépôt** (exemple : uniquement ``demo`` pour préparer une démonstration) :

  .. code-block:: bash

     git submodule update --init demo

- **Mettre à jour les sous-dépôts existants** (après un ``git pull``) :

  .. code-block:: bash

     git submodule update --recursive

Exemple de contributions
^^^^^^^^^^^^^^^^^^^^^^^

- **Corriger un bug dans le cœur mviewer uniquement**

  - Travaillez dans le dépôt principal ``mviewer`` (pas de modification des sous-dépôts).
  - Un clone minimal suffit (``git clone ... --branch develop``) ; vous n'avez pas besoin d'initialiser les sous-dépôts.
  - Ouvrez une issue décrivant le correctif, développez la correction sur une branche dédiée, puis proposez une pull request.
  - Si une note de version ou une documentation est nécessaire, mettez-la à jour dans ce même dépôt.

- **Ajouter une nouvelle fonctionnalité du cœur mviewer avec démonstration**

  - Travaillez dans ``mviewer`` pour implémenter la fonctionnalité (exemple : un nouveau paramètre de configuration).
  - Initialisez le sous-dépôt ``demo`` pour préparer ou mettre à jour une démonstration : ``git submodule update --init demo``.
  - Créez ou mettez à jour une démo dans ``mviewer-demo`` pour montrer le fonctionnement.
  - Mettez la documentation à jour dans le dépôt ``mviewer`` (par exemple dans ``docs/``) pour décrire la nouveauté et le paramétrage associé.
  - Ouvrez deux pull requests synchronisées : une pour ``mviewer`` et une pour ``mviewer-demo`` afin que la démo soit disponible dès l'intégration.

- **Proposer un nouvel addon**

  - Développez l'addon dans ``mviewer-addons`` dans un dossier dédié (exemple : ``mviewer-addons/myaddon``) et ajoutez-y un ``README.md`` décrivant son usage, ses paramètres et les prérequis éventuels.
  - Initialisez le sous-dépôt ``addons`` (``git submodule update --init addons``) et le sous-dépôt ``demo`` si vous publiez une démonstration (``git submodule update --init demo``).
  - Ajoutez une démonstration de l'addon dans ``mviewer-demo`` pour faciliter les tests et l'illustration de l'intégration.
  - Soumettez une pull request dans ``mviewer-addons`` pour l'addon, et une autre dans ``mviewer-demo`` pour la démo correspondante.
  - Si nécessaire, complétez la documentation dans ``mviewer`` pour référencer l'addon ou son intégration.

Ces recommandations vous permettront de structurer vos apports entre le cœur et les sous-dépôts et d'éviter d'introduire des régressions sur l'ensemble de l'écosystème mviewer.

Documentation
-------------

Pour mieux contribuer :

#. `Première contribution <https://github.com/firstcontributions/first-contributions/blob/master/translations/README.fr.md>`_
#. `Comment contribuer <https://opensource.guide/how-to-contribute/>`_
