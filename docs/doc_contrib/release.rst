.. Authors :
.. mviewer team

.. _contribdoc:

Faire une release de Mviewer & MviewerStudio
=========================

Les versions des projets Mviewer et MviewerStudio sont liées. Il faut donc faire une release des deux applications.

Il n'y a pas de système de build pour ces applications qui se veulent simples de mise en place. Il n'y a donc pas de commande permettant de faire la release simplement.

Vous devez avoir des droits spécifiques sur le repository pour pouvoir faire la release

Release Mviewer
---------------------

Commencez par faire une pull request entre la branche develop et la master a un moment stabilisé.
Validez cette pull request et testez le fonctionnement de l'application avec la branche master

Pour plus d'information sur les branches, Mviewer suit ce type de modèle : https://nvie.com/posts/a-successful-git-branching-model/

Puis avant la release modifier le numéro de version
https://github.com/geobretagne/mviewer/blob/master/js/configuration.js#L11

Vérifiez que toutes les issues et PR "closed" depuis la dernière release sont bien liées à un milestone
Créé un nouveau milestone pour la future version et déplacé toutes les issues souhaités et non "closed" dedans.
https://github.com/geobretagne/mviewer/milestones

Puis fermez le milestone de la version releasée.

Créez la release en allant sur :
https://github.com/geobretagne/mviewer/releases

en suivant les indications suivantes :
https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository

Après la release, retournez modifier le numéro de version pour augmenter d'une version et ajouter -snapshot à la fin.

Il faudra aussi mettre à jour la branche develop avec ce changement de version via git
git checkout develop
git merge --no--ff master

Release MviewerStudio
---------------------

La marche à suivre devrait être la même, mais pour l'instant la branche develop n'est pas forcement à jour.
A ce jour un travail est encore à faire.

Modifiez le numéro de version
https://github.com/geobretagne/mviewerstudio/blob/master/js/mviewerstudio.js#L3

Vérifiez que toutes les issues et PR "closed" depuis la dernière release sont bien liées à un milestone

Créé un nouveau milestone pour la future version et déplacé toutes les issues souhaités dedans.
https://github.com/geobretagne/mviewerstudio/milestones

Puis fermez le milestone de la version releasée.

Créez la release en allant sur :
https://github.com/geobretagne/mviewerstudio/releases

et en suivant les indications suivantes :
https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository

Après la release, retournez modifier le numéro de version pour augmenter d'une version et ajouter -snapshot à la fin.

Il faudra aussi mettre à jour la branche develop avec ce changement de version via git
git checkout develop
git merge --no--ff master

Il n'y a pas de versionning de la documentation actuellement, c'est un élement dont il faudrait discuter
