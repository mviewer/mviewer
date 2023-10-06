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

Proposer une modification
-------------------------

Pour proposer une correction d'anomalie ou une évolution, vous devez suivre ces étapes :

- Créer une issue sur Github en suivant la page :ref:`issue`.
- Faire un fork du code (si ce n'est pas encore fait) en suivant la page :ref:`fork`.
- Créer une branche portant le numéro de l'issue (ex: issue-2287).
- Apporter vos modifications sur cette branche.
- Partager cette branche via l'issue pour que les autres puissent tester et obtenir des conseils ou des avis.
- Réaliser une pull request via GitHub en suivant la page :ref:`pr`.

La pull request permettra d'importer votre modification dans le code natif. Vous diposerez alors de votre modification de manière native sans vous en préoccuper ultérieurement.


Documentation
-------------

Pour mieux contribuer :

#. `Première contribution <https://github.com/firstcontributions/first-contributions/blob/master/translations/README.fr.md>`_
#. `Comment contribuer <https://opensource.guide/how-to-contribute/>`_