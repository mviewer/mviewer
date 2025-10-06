.. Authors :
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _deploy:

Installer MVIEWER
#################

Mviewer est une application web développée en HTML / CSS / JAVASCRIPT. Elle nécessite simplement d'être déployée sur un serveur WEB qui peut être APACHE, NGINX, TOMCAT...


Exemple avec un serveur web Apache
**********************************

.. WARNING:: Prérequis : disposer d'une instance **Apache**


Clonage des sources et déploiement
===================================

L'objectif est de copier les sources depuis github.com dans le répertoire web d'Apache.

Avec git
----------

Dans un terminal, après vous être placé dans le dossier web Apache, exécuter la commande **git** suivante pour récupérer toutes les sources (addons et démonstrations également).

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer.git --recurse-submodules


Sans git
----------

.. WARNING:: Avec cette méthode, vous devrez récupérer les addons et les démonstrations manuellement selon vos besoins

Télécharger ce `fichier zip <https://github.com/mviewer/mviewer/archive/master.zip>`_ présent sur la page d'accueil du dépôt mviewer sur GitHub : https://github.com/mviewer/mviewer

Dézipper le contenu du  zip dans le dossier web Apache **/var/www/** *(ou autres dossiers de déploiement Apache)*.

.. image:: ../_images/dev/deploy/mviewer_master.png
              :alt: Zip folder
              :align: center

Dans le répertoire obtenu, vous ne disposerez pas des répertoires /addons, ni du répertoire /demo.

Si ces répertoires vous intéresse, vous devez les récupérer manuellement. Nous décrivons ci-dessous les étapes à suivre.

Sans git - récupérer les demos
------------------------------

Télécharger ce `fichier zip <https://github.com/mviewer/mviewer-demo/archive/main.zip>`_ présent sur la page d'accueil du dépôt mviewer sur GitHub : https://github.com/mviewer/mviewer-demo

Dézipper le contenu du  zip dans le dossier web Apache **/var/www/mviewer** *(ou autres dossiers de déploiement Apache selon l'emplacement du mviewer)*.
Ce répertoire doit absolument se nommer **demo** et doit être accessible dans **mviewer/demo**.

Sans git - récupérer les addons
-------------------------------

Télécharger ce `fichier zip <https://github.com/mviewer/mviewer-addons/archive/main.zip>`_ présent sur la page d'accueil du dépôt mviewer sur GitHub : https://github.com/mviewer/mviewer-addons

Dézipper le contenu du  zip dans le dossier web Apache **/var/www/mviewer** *(ou autres dossiers de déploiement Apache selon l'emplacement du mviewer)*.
Ce répertoire doit absolument se nommer **addons** et doit être accessible dans **mviewer/addons**.

.. WARNING:: Prérequis : disposer d'une instance **Apache** Le dernier chapitre de cette page vous permettra d'avoir plus d'information sur ces versions complète ou légère du mviewer.


Test navigateur
=================

Une fois déployée, l'application est accessible dans le navigateur internet en saisissant l'URL http://nom_du_serveur/nom_du_mviewer/demo/

exemples :

 - http://localhost/mviewer/demo/
 - http://localhost/miewer-master/demo/index.html

En lançant l'application racine  **index.html**, vous avez maintenant un visualiseur géographique fonctionnel avec les couches de la Région Bretagne *(configuration par défaut disponible dans apps/default.xml)*.

.. image:: ../_images/dev/deploy/mviewer_index_html.png
              :alt: Launch mviewer
              :align: center



Avec Docker
***********

.. WARNING:: Prérequis : disposer de **docker**

mviewer en mode standalone
===================================

C'est la solution la plus simple. Il est ainsi possible de lancer mviewer et de visualiser toutes les démos disponibles dans l'application.
Ce mode ne convient pas pour effectuer ses propres applications mviewer.


.. code-block:: bash

    #Récupérer la dernière image buildée de mviewer
    docker pull mviewer/mviewer
    #Lancer le container docker mviewer
    docker run --rm -p8080:80 mviewer/mviewer


mviewer et un dossier d'applications
========================================

C'est la solution à privilégier pour créer ses propres applications. En parallèle de mviewer, un dossier web **apps** (volume) est monté. Ce dossier web contient vos applications mviewer ainsi que les ressources nécessaires.

.. code-block:: bash

    # Lancer le container mviewer + le répertoire web apps qui pointe vers
    # /chemin/vers/repertoire_de_configurations_xml
    docker run --rm -p8080:80 \
        -v/chemin/vers/repertoire_de_configurations_xml:/usr/share/nginx/html/apps \
        mviewer/mviewer


mviewer avec docker-compose
================================

Cette solution permet de mettre en place les mêmes possibilités que la méthode précédante (mviewer + volume d'applications) en utilisant docker-compose et deux fichiers de paramétrage

.. WARNING:: Prérequis : disposer de **docker** et **docker-compose**


1. Création du fichier environemment

.. code-block:: bash
    :caption: settings.json

    APPSPATH=/home/prod/mviewer-apps


2. Création du fichier de configuration

.. code-block:: yaml
    :caption: docker-compose.yml

    version: '3.2.1'
    services:
      mviewer:
        container_name: mviewer
        build: .
        ports:
          - "8080:80"
        image: mviewer/mviewer
        volumes:
          - '${APPSPATH}:/usr/share/nginx/html/apps'

3. Lancer mviewer

.. code-block:: bash

    docker pull mviewer/mviewer
    docker-compose up


Test navigateur
=================

Une fois déployée, l'application est accessible dans le navigateur internet en saisissant l'URL http://nom_du_serveur:8080/demo/

exemples :

 - http://localhost:8080/demo/
 - http://localhost:8080/index.html
 - http://localhost:8080/?config=apps/default.xml


Mettre à jour mon instance de mviewer
****************************

Lors d'une nouvelle release de mviewer, il est conseillé d'utiliser git pour mettre à jour son instance.

1. Tester la nouvelle version sur une version de test mviewer-dev

.. code-block:: bash

    cd /var/www/mviewer-dev
    git clone https://github.com/mviewer/mviewer.git

Puis, tester cette instance en pointant sur des applications en production. Exemple : https://localhost/mviewer-dev?config=prod/monappli.xml.
	
2. Mise à jour de la version de prod. On peut faire une sauvegarde de notre instance actuelle (ici avec le dossier mviewer-save)

.. code-block:: bash

    cd /var/www/
    cp -r mviewer mviewer-save
    cd mviewer
    git pull origin

Puis, tester cette instance. Exemple : https://localhost/mviewer?config=prod/monappli.xml.


Configuration et adaptations
****************************

Si vous souhaitez publier vos propres couches/thèmes ou bien ajouter/supprimer certaines fonctionnalités, veuillez consulter la page ":ref:`configxml`".

Déployer selon vos besoins
**************************

Mviewer dispose à présent de deux versions selon vos besoins : simple ou complette.

En effet, les répertoires **/demo** et **/addons** auparavant fournis par défaut sont maintenant séparés du code source via des sous-modules :

- https://github.com/mviewer/mviewer-demo
- https://github.com/mviewer/mviewer-addons


Objectif
========

Un premier objectif est de vous permettre d'installer un mviewer simple et fonctionnel sans fichiers superflux en vous laissant la possibilité d'installer une version complète mais plus lourde.

L'objectif est de pouvoir avoir un mviewer plus léger et donc moins gourmand en ressources.

Cette orientation est par ailleurs cohérente avec les bonnes pratiques du mviewer qui sont de placer vos cartes et vos ressources dans le répertoire **/apps**, indépendamment du fonctionnement du mviewer.

Vous pouvez donc uniquement installer mviewer sans ces sous-modules

Déployer une version simple
===========================

Vous pouvez suive les procédures décrites en haut de cette page avec ou sans Git.

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer.git

Déployer une version complète
=============================

Un mviewer complet est utile dans plusieurs cas de figure, pour les développements, pour tester les démonstrations ou bien disposer du catalogue présent dans le répertoire **/demo**.

Pour déployer une version complète, vous devez utiliser Git. Le téléchargement ne permet pas de récupérer les sous-modules dans le ZIP.

- Récupérer tous le code source avec les sous-modules

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer.git --recurse-submodules

- Récupérer unique le sous-module **/addons** et non les démonstrations

Cette commande est pratique si vous souhaitez obtenir tous les addons à la racine du /mviewer.

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer.git
    cd mviewer
    git submodule update --init -- addons

Déployer une version simple avec les addons utiles
==================================================

Vous pouvez n'avoir besoin que de deux ou trois addons.
Dans ce cas, nous vous conseillons de :

1. cloner une version simple sans /addons ni /demo

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer.git 

2. cloner dans un autre répertoire les addons 

.. code-block:: bash

	git clone https://github.com/mviewer/mviewer-addons.git 

3. Copier les addons de votre choix dans le répertoire **/mviewer/apps**


Ici, imaginons que nous souhaitions uniquement récupérer l'extension **Filter**.
Avec Linux, voici les commandes de copier/coller à suivre :

.. code-block:: bash

	cd [chemin_personnalise]/mviewer-addons
    cp -pr filter [chemin_personnalise]/mviewer/apps

L'extension **Filter** sera donc localisée dans **[chemin_personnalise]/mviewer/apps/Filter**.
Vous pourrez renseigner son répertoire **apps/filter** de manière habituelle dans le XML.

