.. Authors :
.. mviewer team

.. _contrib:

Contribuer
=========================

Cette partie permet de donner des clés pour contribuer aux mviewer.


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

Les autres fichiers
-------------------

Pour vos modifications et l'organisation de vos fichiers, nous recommandons de suivre la page ":ref:`orgfiles`".


.. _ask:

Proposer une modification
---------------------------

Pour proposer une correction d'anomalie ou une évolution, vous devez suivre ces étapes :

- Créer une issue sur Github en suivant la page :ref:`issue`
- Faire un fork du code (si ce n'est pas encore fait) en suivant la page :ref:`fork`
- Créer une branche portant le numéro de l'issue (ex: issue-2287) 
- Apporter vos modifications sur cette branche
- Partager cette branche via l'issue pour que les autres puisse tester et obtenir des conseils ou des avis
- Réaliser une pull request via GitHub en suivant la page :ref:`pr`

La pull request permettra d'importer votre modification dans le code natif. Vous diposerez alors de votre modification de manière native sans vous en préoccupez ultérieurement.



Documentation
--------------

Pour mieux contribuer :

#. `Première contribution <https://github.com/firstcontributions/first-contributions/blob/master/translations/README.fr.md>`_
#. `Comment contribuer <https://opensource.guide/how-to-contribute/>`_