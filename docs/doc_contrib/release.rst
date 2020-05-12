.. Authors :
.. mviewer team

.. _contribdoc:

Faire une release de Mviewer & MviewerStudio
============================================

Les versions des projets Mviewer et MviewerStudio sont liées. Il faut donc faire une release des deux applications.

Il n'y a pas de système de build pour ces applications qui se veulent simples de mise en place. Il n'y a donc pas de commande permettant de faire la release simplement.

Vous devez avoir des droits spécifiques sur le repository pour pouvoir faire la release.

Release Mviewer
---------------------

Commencez par vérifiez que toutes les issues et PR "closed" depuis la dernière release sont bien liées à un `milestone <https://help.github.com/en/enterprise/2.15/user/articles/creating-and-editing-milestones-for-issues-and-pull-requests>`_.

Créez ensuite un nouveau milestone pour la future version et déplacez toutes les issues souhaitées et non "closed" à l'intérieur.
https://github.com/geobretagne/mviewer/milestones

Puis fermez le milestone de la version releasée.

Modifiez la version de l'application sur la branch developp dans le fichier (en supprimant -snapshot) :
https://github.com/geobretagne/mviewer/blob/develop/js/configuration.js#L11

Puis faire une pull request entre la branche develop et la master a un moment stabilisé.
Testez le fonctionnement de l'application avec la PR et validez cette pull request.

Pour plus d'informations sur les branches, Mviewer suit ce type de modèle : 
https://nvie.com/posts/a-successful-git-branching-model/

Il vous faudra ensuite suivre `ces indications <https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository>`_ pour créer 
la nouvelle release `sur la page de release Mviewer <https://github.com/geobretagne/mviewer/releases>`_.

Après la release,dans la branche developp, retournez modifier le numéro de version pour augmenter d'une version et ajouter -snapshot à la fin.

Release MviewerStudio
---------------------

La marche à suivre devrait être la même, mais pour l'instant la branche develop n'est pas forcement à jour.
A ce jour un travail est encore à faire.

Modifiez le numéro de version sur la branch master directement :
https://github.com/geobretagne/mviewerstudio/blob/master/js/mviewerstudio.js#L3

Vérifiez que toutes les issues et PR "closed" depuis la dernière release sont bien liées à un `milestone <https://help.github.com/en/enterprise/2.15/user/articles/creating-and-editing-milestones-for-issues-and-pull-requests>`_.

Créez ensuite un nouveau milestone pour la future version et déplacez toutes les issues souhaitées à l'intérieur :
https://github.com/geobretagne/mviewerstudio/milestones

Puis fermez le milestone de la version releasée.

Il vous faudra ensuite suivre `ces indications <https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository>`_ pour créer la nouvelle 
release `sur la page de release Mviewer Studio <https://github.com/geobretagne/mviewerstudio/releases>`_.

Après la release retournez modifier le numéro de version pour augmenter d'une version et ajouter -snapshot à la fin.

Il n'y a pas de versionning de la documentation actuellement, c'est un élement dont il faudrait discuter.
