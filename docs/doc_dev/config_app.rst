.. Authors : 
.. mviewer team

.. _configapp:

Configurer - Application
=========================


Personnalisation de l'application

**Syntaxe**

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
        coordinates=""
		statsurl=""/>

**Paramètres**

* ``title``: paramètre optionnel de type texte qui définit le titre de l'application. Valeur par défaut **mviewer**.
* ``logo``: paramètre optionnel de type url qui définit l'emplacement du logo de l'application. Valeur par défaut **img/logo/earth-globe.svg**.
* ``help``: paramètre optionnel de type url qui définit l'emplacement du fichier html de l'aide.
* ``showhelp``: paramètre optionnel de type booléen (true/false) précisant si l'aide est affichée en popup au démarrage de la'application. Valeur par défaut **false**.
* ``style``: paramètre optionnel de type url précisant la feuille de style à utiliser afin de modifier l'apparence de l'application (couleurs, polices...). Valeur par défaut **css/themes/default.css**. Voir : ":ref:`configcss`".
* ``exportpng``: paramètre optionnel de type booléen (true/false) activant l'export de la carte en png. Valeur par défaut **false**. Attention l'export ne fonctionne qu'avec des couches locales (même origine) ou avec des couches servies avec  `CORS <https://enable-cors.org/>`_ activé.
* ``measuretools``: paramètre optionnel de type booléen (true/false) activant les outils de mesure. Valeur par défaut **false**.
* ``stats``: paramètre optionnel de type booléen (true/false) activant l'envoi de stats d'utilisation l'application. Valeur par défaut **false**.
* ``coordinates``: paramètre optionnel de type booléen (true/false) activant l'affichage des coordonnées GPS lors de l'interrogation. Valeur par défaut **false**.
* ``statsurl``: paramètre optionnel de type url précisant l'url du service reccueillant les données d'utilisation de l'application (ip, application title, date). Ce service n'est pas proposé dans mviewer.
