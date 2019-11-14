.. Authors :
.. mviewer team

.. _filesystem:

Organisation des fichiers
=========================

Cette partie permet de comprendre et d'organiser vos fichiers et vos cartes afin de ne pas empêcher la mise à jour et la maintenance du mviewer.

Règle générale
--------------

Vous ne devez **JAMAIS** toucher aux fichiers mviewer à moins de vouloir proposer sur Github une modification de ces fichiers (contribution).

Présentation générale
---------------------

Après un déploiement, le mviewer permet nativement d'obtenir une carte fonctionnelle.

- Vous souhaitez cependant créer vos propres cartes, vos propres fonctionnalités et apporter vos propres styles. 
- Vous vous sentez probablement un peu perdu entre les dossiers et fichiers à modifier.

Vous trouverez ici une présentation et des recommandations pour créer vos cartes et vos fonctionnalités sans modifier le coeur (ou presque).
Vous obtiendrez un mviewer maintenable et vous n'aurez plus l'appréhension de toucher aux mauvais fichiers.

Le coeur mviewer
----------------

**Qu'est-ce que c'est ?**

C'est l'ensemble des fichiers et dossiers présents en l'état natif présent sur la page `Github mviewer <https://github.com/geobretagne/mviewer>`_.

**Que puis-je modifier ?**

En théorie : **RIEN !**

Vous ne devez rien toucher qui touche aux fichiers natifs du mviewer. Vous aurez cependant un jour de bonnes raisons de modifier le coeur.


**Quand modifier le coeur ?**

Les raisons sont multiples et doivent être justifiées par une issue sur GitHub: 

- Vous détectez un bogue ou un comportement suspect et vous le corrigez
- Vous créez une évolution sur le coeur (une nouvelle fonctionnalité)
- Vous créez une amélioration du code existant

**Comment le modifier ?**

#. Créer une issue sur Github en suivant la page :ref:`issue`
#. Faire un fork du code (si ce n'est pas encore fait)
#. Créer une branche portant le numéro de l'issue (ex: issue-2287)
#. Apporter vos modifications sur cette branche
#. Partager cette branche via l'issue pour que les autres puisse tester et donner un avis
#. Réaliser une pull request via GitHub

La pull request permettra d'importer votre modification dans le code natif. Vous diposerez alors de votre modification de manière native sans vous en préoccupez ultérieurement.

Ajouter des fichiers
---------------------

**Où mettre mes fichiers ? **

Vous devrez commencer par créer un répertoire "apps" à la racine du mviewer.

Vous n'aurez que deux répertoire à mofidier:

- répertoire /css
- répertoire /apps

