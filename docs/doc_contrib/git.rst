.. Authors :
.. mviewer team

.. _git:

Travailler avec Git et GitHub
=============================

Entrenez votre mviewer et facilitez vos contributions en travaillant avec les outils Git et Github.

Présentation générale
----------------------

Github est incontournable pour contribuer et découvrir la communauté mviewer. 
C'est là où vous proposerez vos idées, obtiendrez des informations et les dernières versions mviewer.

Grâce à Git vous pourrez réaliser vos contributions ou obtenir le code source dans votre environnement de travail.

Git propose une multitude d'action pour s'interfacer avec Github. Ces actions vous seront plus qu'utiles pour contribuer et maintenir votre mviewer à jour.
Nous expliquerons ici l'utilité et les manipulations utiles telles qu'un fork, rebase, commit, pull.


Présentation GitHub
--------------------------

GitHub est une plate-forme en ligne de contrôle de version et de collaboration pour le développement.
GitHub facilite le travail en équipe via une interface web qui permet d'accéder au dépôt de code Git. 
GitHub fournit des outils de gestion pour la collaboration. 


Présentation Git
--------------------------

Git est un outil libre de gestion de version décentralisé pour tout type de projet. Il permet de réaliser des développements sur votre propre dépôt (dépôt = répertoire). 
Git facilite ensuite la mise en commun du code entre les différents dépôt.

Documentations utiles
--------------------------
 
    .. [#] `OpenClassrooms <https://openclassrooms.com/fr/courses/2342361-gerez-votre-code-avec-git-et-github>`_
    .. [#] `Débuter avec Git <https://carlchenet.com/category/debuter-avec-git/>`_
    .. [#] `Mémo Git <http://rogerdudler.github.io/git-guide/files/git_cheat_sheet.pdf>`_


Fork et Pull
------------------------------

Nous avons déjà montré l'utilité et l'utilisation d'un **fork** et d'un **pull** sur la page ":ref:`practices`".

 - Le fork est décrit à la section ":ref:`fork`"
 - Le pull  est utilisé à la section ":ref:`pull`"


Rebase
------------------------------

Lorsque vous faites des modifications via des commits sur votre branche de travail d'autres contributeurs modifient le code mviewer avec de nouveaux commits.

Le code du mviewer dans le GitHub géoBretagne n'a pas connaissance de vos modifications. 
Tans que vous n'avez pas mis à jour votre branche, votre code ne contient pas les modifications faites sur le GitHub mviewer géoBretagne (upstream).

Les deux codes ont donc des nouveautés. Ont peut dire que les branches ont divergées.

Vous devez alors intégrer les nouveautés du mviewer dans votre branche mviewer.

Pour cela, nous allons reprendre tous les nouveaux commits du mviewer natif (géoBretagne) en mettant à jour votre fork, puis en les plaçant dans l'arbre de commits de votre branche de travail via un **rebase**.

**Mise à jour du fork**

Reprenez dans l'ordre les étapes ":ref:`setupstream`" et ":ref:`updatefork`".

Réalisez ensuite la procédure suivante.


**Que fait un Rebase ?**

- Git va reprendre le commit commun le plus proche de votre branche
- Git replacera ensuite vos commit et les commits du mviewer natif (geobretagne/mviewer) dans l'ordre chronologique

Vous disposerez donc des nouveaux commits et de vos propres commits non partagés.


** Comment faire ?**

- Faites une copie de votre branche (optionnel mais conseillé) en créant une nouvelle branche à partir de votre branche de travail
- Si votre branche s'appelle par exemple "dev", lancez la commande de rebase de la branche master (fork à jour) vers votre branche à mettre à jour (dev) : ::
    
    git rebase origin/master dev

- Vous verrez la liste des commits déroulée les messages des commits un à un

- Vous aurez probablement un conflit. Le processus sera donc stoppé mais pas abandonné

- Si vous souhaitez abandonner lancer la commande(*) ::

    git rebase --abort

- Si vous souhaitez ignorer le conflit (déconseillé!)::

    git rebase --skip

- Nous conseillons de résoudre le conflit. Git vous indique un nom de fichier en conflit. C'est qu'il n'a pas réussi tout seul à intégrer les modifications sans perdre votre code actuel.

- Ouvrez ce fichier avec un éditeur classique. Vous observerai que git a inséré des caractères spéciaux pour nous permettre d'identifier les lignes en conflit::

    // voici ma couleur
    var type = "Pomme"
    <<< HEAD
    // nouveau code
    var test = "je suis rouge";
    ==========
    // code actuel
    var test = "je suis verte";
    var taille = 12;
    >>>>>
    var region = "Normandie";

- Vous pouvez garder le nouveau code entrant entre <<< HEAD et ===  ou bien garder le code actuel entre ==== et >>> ou bien garder les deux.

- Pour cela, vous allez modifier à la main le fichier en supprimant les caractères <<< HEAD et ==== et >>>> ainsi que les lignes indésirables.

- Nous avons maintenant ce contenu::

    // voici ma couleur
    var type = "Pomme"
    var test = "je suis rouge";
    var taille = 12;
    var region = "Normandie";

- Sauvegardez votre fichier

- Indiquez à Git que vous avez géré le conflit::

    git add /chemin/vers/le/fichier.js

- On contrôle que le fichier est marqué comme "modified" avec la commande::

    git status

- Indiquez à git de poursuivre le rebase::

    git rebase --continue

- Vous verrez d'autres commits listés et vous aurez probablement d'autres conflits. Répétez les opération précédentes pour bien tous les gérer.

- Lorsque le rebase est terminé vous n’aurez pas de message spécifique qui vous l’indiquera. Vous pourrez cependant voir que les derniers commits ont bien été appliqués.

** Vérifier le résultat du rebase**

Nous devons absolument vérifier que le rebase a pris encompte les commits du mviewer natif et vos commits de travail.

- Aller sur la page GitHub `geobretagne/mviewer <https://github.com/geobretagne/mviewer>`_
- Ouvrez `la page des commits <https://github.com/geobretagne/mviewer/commits/master>`_
- Vérifier dans la liste déroulante que vous êtes bien sur la branche master
- Observer les derniers commits, la date et le titre

Nous allons maintenant vérifier que ces commits sont biens dans notre historique de commits après le rebase.

- Affichez l'historique des commits dans le terminal Git::

    git logs

- Chercher dans la liste les commits vu sur `la page des commits <https://github.com/geobretagne/mviewer/commits/master>`_

- Vous devez les trouvez dans la liste des commits avec vos commits de travail

- En cas de doute sur la gestion de certains conflits, vérifiez les fichiers visuellement et réalisez des tests dans vos applications

- Si tout vous semble bon, nous avons bien récupéré les modifications et votre arbre de commit est à jour (ainsi que votre code)

- Lancez la commande suivante pour transmettre le travail du rebase à la branche distante (en ligne et visible sur GitHub) (**)::

    git push -f

*Attention : -f indique un push forcé afin de réécrire en force sur la branche distante. Il vaut mieux maîtriser ce que l'on pousse et contrôler votre code en local avant.**

- Ouvrez `la page des commits de votre branche de travail (ex: dev) <https://github.com/org/mviewer/commits/dev>`_ et vérifier le succès de l'opération

- Supprimer ensuite la branche de sauvegarde si tout vous semble bon

(*) Avec --abort Il faudra tout reprendre tout le rebase depuis le début si vous arrêter et décidez de recommencer.


Pull Request
------------------------------
Une pull request ou "demande de tirage" réalise une demande pour que les modifications d'une branche intègre une autre branche.

Vous devez créer une pull request pour apporter une contribution de votre branche au sein de votre repository mviewer vers le repository `geobretagne/mviewer <https://github.com/geobretagne/mviewer>`_.

Pour réaliser une pull request, dirigez-vous sur votre fork GitHub : 

- Sélectionnez votre branche qui contient vos modifications à apporter en contribution
- Cliquez sur "New pull request"
- Ajouter un titre simple mais distinctif et parlant
- Ajouter un explicatif, avec de préférence le lien vers l'issue concernée
- Cliquez sur "Create pull request"
- Vous pourrez accéder à la pull request et discuter via le `volet "pull request"<https://github.com/geobretagne/mviewer.doc/pulls>`_ du repository geobretagne/mviewer

Votre pull request sera revue et vous aurai un retour pour réaliser des modifications ou bien vous noitifier que votre demande est acceptée.

N'hésitez-pas à laisser un message dans la pull request pour relancer la communauté si personne ne réagit à votre pull request.