.. Authors : 
.. mviewer team

.. _configapp:

Configurer - Application
=========================


Personnalisation de l'application

**Prototype**

.. code-block:: xml
       :linenos:
	
	<application title="" 
		logo=""
		help=""		
		showhelp=""
		style=""
		exportpng="" 
		measuretools=""	
		stats=""
		statsurl=""/>

**Paramètres**

* ``title``: paramètre optionel de type texte qui définit le titre de l'application. Valeur par défaut **mviewer**.
* ``logo``: paramètre optionel de type url qui définit l'emplacement du logo de l'application. Valeur par défaut **img/logo/earth-globe.svg**.
* ``help``: paramètre optionel de type url qui définit l'emplacement du fichier html de l'aide.
* ``showhelp``: paramètre optionel de type booléen (true/false) précisant si l'aide est affichée en popup au démarrage de la'application. Valeur par défaut **false**.
* ``style``: paramètre optionel de type url précisant la feuille de style à utiliser afin de modifier l'apparence de l'application (couleurs, polices...). Valeur par défaut **css/themes/default.css**. Voir : ":ref:`configcss`".
* ``exportpng``: paramètre optionel de type booléen (true/false) activant l'export de la carte en png. Valeur par défaut **false**. Attention l'export ne fonctionne qu'avec des couches locales (même origine) ou avec des couches servies avec  `CORS <https://enable-cors.org/>`_ activé.
* ``measuretools``: paramètre optionel de type booléen (true/false) activant les outils de mesure. Valeur par défaut **false**.
* ``stats``: paramètre optionel de type booléen (true/false) activant l'envoi de stats d'utilisation l'application. Valeur par défaut **false**.
* ``statsurl``: paramètre optionel de type url précisant l'url du service reccueillant les données d'utilisation de l'application (ip, application title, date). Ce service n'est pas proposé dans mviewer.
