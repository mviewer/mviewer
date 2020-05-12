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


Le cœur de mviewer
------------------

**Qu'est-ce que c'est ?**

C'est l'ensemble des fichiers et dossiers présents nativement sur la page `GitHub mviewer <https://github.com/geobretagne/mviewer>`_.

**Quand puis-je le modifier ?**

Vous devez éviter de modifier les fichiers natifs du mviewer. En effet, modifier ces fichiers vous empêchera de mettre à jour facilement votre déploiement de mviewer pour prendre en compte une nouvelle version officielle.

Néanmoins, vous pouvez être amené à modifier ces fichiers principalement pour contribuer au développement de l'outil :

- Vous détectez un bogue ou un comportement suspect et vous le corrigez
- Vous créez une évolution sur le cœur (une nouvelle fonctionnalité)
- Vous créez une amélioration du code existant

Dans chacune de ces situations l'intervention sur le cœur de mviewer doit être justifiée par une issue sur GitHub.


Les autres fichiers
-------------------

Pour vos modifications et l'organisation de vos fichiers, nous recommandons de suivre la page ":ref:`orgfiles`".


.. _ask:

Proposer une modification
-------------------------

Pour proposer une correction d'anomalie ou une évolution, vous devez suivre ces étapes :

- Créer une issue sur Github en suivant la page :ref:`issue`
- Faire un fork du code (si ce n'est pas encore fait) en suivant la page :ref:`fork`
- Créer une branche portant le numéro de l'issue (ex: issue-2287)
- Apporter vos modifications sur cette branche
- Partager cette branche via l'issue pour que les autres puissent tester et obtenir des conseils ou des avis
- Réaliser une pull request via GitHub en suivant la page :ref:`pr`

La pull request permettra d'importer votre modification dans le code natif. Vous diposerez alors de votre modification de manière native sans vous en préoccuper ultérieurement.


Documentation
-------------

Pour mieux contribuer :

#. `Première contribution <https://github.com/firstcontributions/first-contributions/blob/master/translations/README.fr.md>`_
#. `Comment contribuer <https://opensource.guide/how-to-contribute/>`_