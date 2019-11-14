.. Authors : 
.. mviewer team

.. _pratiques:


Bien commencer avec mviewer
===========================

Récupérer les sources (fork)
----------------------------

Pour bien débuter, nous vous recommandons de réaliser un fork vers votre espace GitHub.

**Prérequis**

- Disposer d'un compte GitHub
- Avoir les droits de création sur ce compte
- Être connecté sur GitHub

**Procédure**

Sur la page https://github.com/geobretagne/mviewer cliquer sur "Fork" en haut à droite.

Choisissez ensuite le compte vers lequel réaliser votre fork.

Vous détenez maintenant un fork disponible à l'adresse (où MON_ORG est le nom de votre compte ou organisation): https://github.com/MON_ORG/mviewer

Vous pourrez créer des nouvelles branches et modifer le code sans impacter le code natif et le repository inital (`geobretagne/mviewer <https://github.com/geobretagne/mviewer>`_).

Vous obtiendrez également les mêmes branche à l'identique, dont la brance **master**.

Travailler avec un fork
------------------------

**Règle générale** : Ne jamais modifier la branche MASTER.

La branche master est une branche "mirroir" de la branche master du code initial (`geobretagne/mviewer <https://github.com/geobretagne/mviewer>`_).

C'est votre point de départ pour tout nouveau travail et tout nouveau travail doit repartir d'une base à jour et propre.

Nous recommandons de créer une branche à partir de la branche master à jour pour chaque nouveau travail. 


Créer une branche

------------------
Vous pouvez créer une branche sur GitHub directement ou avec Git.

Pour créer une branche su GitHub.
- Cliquer sur le bouton de la liste Branch:(nom de branche)
- Choisissez la branche de départ (master) dans la liste des branches disponibles
- Cliquer à nouveau sur le bouton de la liste Branch:(nom de branche)
- Dans le champ de recherche, saisir le nom de votre nouvelle branche*
- Cliquer ensuite sur "Create Branch: (nom de votre branche)"

Vous avez maintenant une nouvelle branche.

Pour récupérer cette nouvelle brache dans votre dépôt Git, suivez la pricédure qui suit:

- Positionnez-vous dans votre dossier mviewer (le dossier crée par la commande 'git clone').

.. code-block::pull
        :linenos:
        
        git pull

Pour changer de branche:

.. code-block::checkout
        :linenos:

        git checkout NOM_DE_MA_BRANCHE

*Attention : Choisissez un nom permettant d'itentifier rapidement cette branche pour vous et votre équipe.*

Vous travaillereai maintenant sur cette branche. 
Chaque nouvelle mise à jour de la branche master de votre fork devra être reportée sur cette branche aussi souvent que possible.




Définir un upstream
-------------------

Pour mettre à jour la branche master depuis le code de GéoBretagne, vous devrez indiquer quelle est la "source" distante (upstream). 
Votre "origin" sera votre branche de travail sur votre repository mviewer.

Voici la manipulation.

Vous devrez installer Git sur votre environnement de travail (ordinateur ou serveur). Il vous permettra de réaliser les commandes qui suivent.

- Télécharger `Git <https://git-scm.com/book/fr/v1/D%C3%A9marrage-rapide-Installation-de-Git>`_.

- Réaliser un clone (copie) du code mviewer sur votre ordinateur::

        git clone https://github.com/MON_ORG/mviewer.git

*Pour récupérer l'URL du clone, aller sur le repository mviewer GitHub et cliquez sur "clone or download". Copier/coller ensuite l'URL dans la commande.*

- Définir un upstream::
        
        git remote add upstream https://github.com/geobretagne/mviewer

- Observer que vous avez bien un upstream::
    
        git remote -v
        > origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
        > origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
        > upstream  https://github.com/geobretagne/mviewer.git (fetch)
        > upstream  https://github.com/geobretagne/mviewer.git (push)


Maintons maintenant à jour votre branche master.

Mettre à jour votre fork - master
----------------------------------

Vous devrez mettre à jour votre branche master au sein de votre fork.

Avec Git Bash  ou votre terminal de commande, positionnez-vous dans votre dossier mviewer.

C'est ce dossier qui a été récupéré à l'aide du clone réalisé précédemment::
        
        cd /chemin/vers/clone/mon/mviewer

- Vérifiez que vous avez bien un upstream qui pointe vers https://github.com/geobretagne/mviewer.git (voir étape précédente).

- Positionnez vous sur la branche master::
        
        git checkout origin/master

- Synchronisez::
        
        git fetch upstream

- Remplacer votre branche master (origin) par celle de géoBretagne (upstream)::
        
        git fetch upstream
        git reset --hard upstream/master

- Poussez ensuite ce code récupéré depuis géoBretagne (upstream) vers votre branche master (origin)::
        
        git push origin master --force

Organisation des fichiers de carte
----------------------------------

**Rgèle générale**

Ne **JAMAIS** modifier les fichiers du coeur.

Nous vous recommandons d'intégrer cette structure afin de simplifier vos manipulations de fichiers :

- Créer un répertoire "apps" à la racine du mviewer.

- Positionner tous les fichiers de configuration XML à la racine du répertoire apps (ex : /apps/ma_carte_urbaine.xml)

- Créer un dossier par fichier de configuration que nous appellerons "dossiers de carte"

- Pour chaque dossier de carte, vous devrez créer les dossiers : templates, customcontrols, customlayers, data, sld, css, img.

Pour un fichier de config "aide-droit-carte.xml", nous aurons donc cette structure::

    /apps
    ├── aide-droit-carte.xml
    └── aide-droit-carte
        ├── customcontrols
        ├── customlayers
        ├── data
        ├── css
        ├── sld
        ├── img
        └── templates

Vous placerez dans ces dossiers les données (geojson), les customcontrols (js), les cunstomlayers (js) ainsi que les template mustache (js).
Vous prendrez en compte la localisation de ces fichiers dans le fichier de configuration XML en donnant les bons chemins d'accès.

Organisation des autres fichiers
---------------------------------

- Créer un répertoire "common" à la racine du répertoire "apps" (/apps/common/)
- Créer un dossier js, css, img, lib
- Créer un dossier basemaps, logo, legend, credit dans /img (/apps/common/img/)

On obtiendra donc cette structure::

    /apps    
    ├── common
        └── js/
        ├── css/
        ├── lib/
        └── img/
            ├── legend/
            ├── logo/
            ├── credit/
            └── basemap/
    ├── aide-droit-carte.xml
    └── aide-droit-carte
        ├── customcontrols
        ├── customlayers
        ├── data
        └── templates


Vous placerez tous les fichiers que vous avez créez ou modifier dans ces dossiers au sein de /apps/common.
Vous prendrez en compte la localisation de ces fichiers dans le fichier de configuration XML en donnant les bons chemins d'accès.


URL de carte
------------

Il vous faudra prendre en compte le dossier "apps" dans vos urls de carte ainsi:: 

        http://kartenn.region-bretagne.fr/kartoviz/?config=apps/aide-droit-carte.xml



Addons
------

Si vous souhaitez enrichir vos cartes de fonctionnalités (isochrones, recherches, filtres temporels, ...) vous pouve duppliquer cet addon dans tous les dossiers de carte.

Vous pouvez aussi créer un dossier "addons" dans le répertoire common et y ajouter la structure nécessaires (customlayers, customcontrols) pour être réexploitable par toutes les cartes :

Voici exemple d'organisation de fichier avec un addon "Isochrone"::

    /apps    
    ├── common
        └── js/
        ├── css/
        ├── lib/
        ├── addons/
            └── isochrone
                ├── customlayers
                ├── customcontrols
        └── img/
            ├── legend/
            ├── logo/
            ├── credit/
            └── basemap/

Le dossier "apps" étant votre dossier de travail, vous pouvez l'organiser selon vos besoins.

