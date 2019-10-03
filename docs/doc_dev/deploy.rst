.. Authors : 
.. mviewer team
.. Gwendall PETIT (Lab-STICC - CNRS UMR 6285 / DECIDE Team)

.. _deploy:

Prérequis
===========
Serveur Web (Apache)

Déployer
===========

Le déploiement de **mviewer** se passe en trois étapes : 

1. `Cloner`_
2. `Publier`_
3. `Configurer`_

Cloner
---------------------

Cloner le projet dans le dossier de votre choix. Pour cela, vous avez deux options :

* télécharger ce fichier zip_ présent sur la page d'accueil du dépôt mviewer sur GitHub : https://github.com/geobretagne/mviewer
* dans un terminal, après vous être placé dans le dossier de votre choix, exécuter la commande git suivante

.. code-block:: bash
	
	git clone https://github.com/geobretagne/mviewer.git

Publier
---------------------

Publier **mviewer** en copiant le dossier précédemment cloné dans le dossier **/var/www/** *(ou autres dossiers de déploiement Apache)*. 

.. image:: ../_images/dev/deploy/mviewer_master.png
              :alt: Zip folder
              :align: center

En lançant le fichier **index.html**, vous avez maintenant un visualiseur géographique fonctionnel avec les couches de la Région Bretagne *(configuration par défaut)*.

.. image:: ../_images/dev/deploy/mviewer_index_html.png
              :alt: Launch mviewer
              :align: center

Configurer
---------------------

Si vous souhaitez publier vos propres couches/thèmes ou bien ajouter/supprimer certaines fonctionnalités, veuillez consulter la page ":ref:`configxml`".

.. _zip: https://github.com/geobretagne/mviewer/archive/master.zip
