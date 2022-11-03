.. Authors :
.. mviewer team

.. _configapp:

Configurer - Application
=========================


Personnalisation de l'application

Syntaxe
-----------------

.. code-block:: xml
       :linenos:

	<application
		id=""
		titlehtml=""
		title=""
		logo=""
		help=""
		showhelp=""
		titlehelp=""
		iconhelp=""
		style=""
		exportpng=""
		measuretools=""
		zoomtools=""
		initialextenttool=""
		stats=""
		statsurl=""
		coordinates=""
		geoloc=""
		mouseposition=""
		togglealllayersfromtheme=""
		templaterightinfopanel=""
		templatebottominfopanel=""
		studio=""
		home=""
		mapfishurl=""
		lang=""
		langfile=""
		favicon=""
        sortlayersinfopanel=""
        />

Paramètres principaux
-----------------

* ``title`` :guilabel:`studio` : paramètre optionnel de type texte qui définit le titre de l'application. Valeur par défaut **mviewer**.
* ``logo`` :guilabel:`studio` : paramètre optionnel de type url qui définit l'emplacement du logo de l'application. Valeur par défaut **img/logo/earth-globe.svg**.
* ``id`` : identifiant de l'application. Il est utilisé dans l'extension filtre pour faire référence à l'application.
* ``help`` :guilabel:`studio` : paramètre optionnel de type url qui définit l'emplacement du fichier html de l'aide.
* ``showhelp`` :guilabel:`studio` : paramètre optionnel de type booléen (true/false) précisant si l'aide est affichée en popup au démarrage de l'application. Valeur par défaut **false**.
* ``style`` :guilabel:`studio` : paramètre optionnel de type url précisant la feuille de style à utiliser afin de modifier l'apparence de l'application (couleurs, polices...). Valeur par défaut **css/themes/default.css**. Voir : ":ref:`configcss`".
* ``exportpng`` :guilabel:`studio` : paramètre optionnel de type booléen (true/false) activant l'export de la carte en png. Valeur par défaut **false**. Attention l'export ne fonctionne qu'avec des couches locales (même origine) ou avec des couches servies avec  `CORS <https://enable-cors.org/>`_ activé.
* ``measuretools`` :guilabel:`studio` : paramètre optionnel de type booléen (true/false) activant les outils de mesure. Valeur par défaut **false**.
* ``zoomtools`` : paramètre optionnel de type booléen (true/false) activant les outils de zoom +/-. Valeur par défaut **true**.
* ``initialextenttool`` : paramètre optionnel de type booléen (true/false) activant le bouton de retour à l'étendue initiale. Valeur par défaut **true**.

Paramètres secondaires
-----------------

* ``titlehtml`` :guilabel:`studio` : optionnel de type texte, il permet d'utiliser du HTML uniquement pour le titre de l'application. Utiliser **title** avec ce paramètre pour le titre de l'onglet et la page de chargement.
* ``titlehelp``: paramètre optionnel de type texte qui définit le titre de la popup d'aide. Valeur par défaut **Documentation**.
* ``iconhelp``: paramètre optionnel de type texte qui précise l'icône à utiliser afin d'illustrer la thématique. Les valeurs possibles sont à choisir parmi cette liste sur le site Fontawesome : https://fontawesome.com/v5/search?m=free
* ``stats``: paramètre optionnel de type booléen (true/false) activant l'envoi de stats d'utilisation l'application. Valeur par défaut **false**.
* ``statsurl``: paramètre optionnel de type url précisant l'url du service reccueillant les données d'utilisation de l'application (ip, application title, date). Ce service n'est pas proposé dans mviewer.
* ``coordinates`` :guilabel:`studio` : paramètre optionnel de type booléen (true/false) activant l'affichage des coordonnées GPS ( navbar) lors de l'interrogation. Valeur par défaut **false**.
* ``geoloc``: paramètre optionnel de type booléen (true/false) activant la géolocalisation. Nécessite une connection **https**. Valeur par défaut **false**.
* ``mouseposition``: paramètre optionnel de type booléen (true/false) activant l'affichage des coordonnées correspondant à la position de la souris. Les coordonnées sont affichées en bas à droite de la carte. Valeur par défaut **false**.
* ``togglealllayersfromtheme`` :guilabel:`studio` : Ajoute un bouton dans le panneau de gauche pour chaque thématique afin d'afficher/masquer toutes les couches de la thématique.Valeur : true/false. Valeur par défaut **false**.
* ``templaterightinfopanel``: Template à utiliser pour le rendu du panneau de droite. Valeur à choisir parmi les templates de mviewer.templates.featureInfo (default|brut|accordion|allintabs). Valeur par défaut **default**.
* ``templatebottominfopanel``: Template à utiliser pour le rendu du panneau du bas. Valeur à choisir parmi les templates de mviewer.templates.featureInfo (default|brut|accordion|allintabs). Valeur par défaut **default**.
* ``studio``: Lien vers le mviewerstudio pour modifier la carte en cours.
* ``home``: Lien vers le site parent de mviewer
* ``mapfishurl``: Lien permettant d'afficher les couches courantes visibles vers un mapfishapp (geOrchestra) cible
* ``hideprotectedlayers``: Indique si les couches protégées doivent être masquées dans l'arbre des thématiques lorsque l'utilisateur n'y a pas accès. Valeur : true/false (true par défaut).
* ``lang``: Langue à utiliser pour l'interface. Passer "?lang=en" dans l'url pour forcer la langue et ignorer la config. Par défaut, lang n'est pas activé. Le fichier mviewer.i18n.json contient les expressions à traduire dans différentes langues. Pour traduire le texte d'un élément html, il faut que cet élément dispose d'un attribut i18n=texte.a.traduire. En javascript la traduction s'appuie sur la méthode mviewer.tr("texte.a.traduire").
* ``langfile``: URL du fichier de traduction supplémentaire à utiliser en complément de mviewer.i18n.json.
* ``favicon``: URL du fichier image à utiliser comme favicon de l'application.
* ``sortlayersinfopanel``: mode de tri des couches dans le panneau d'information en suivant la légende qui suit l'ordre des couches de la map (valeur **default**) ou la toc (valeur **toc**). Valeur par défaut **default**.

Modes de templates
-----------------

Modes d'affichage des templates soit à droite (templaterightinfopanel), soit en bas (templatebottominfopanel).

* ``default``: Une entrée par couche avec un carroussel pour navigation par entités.

.. image:: ../_images/tech/default.png
              :alt: default
              :align: center   

* ``brut``: Affichage à la suite de toutes les entités avec encapsulation par couche.

.. image:: ../_images/tech/brut.png
              :alt: brut
              :align: center   

* ``accordion``: Affichage par couche avec carroussel et pliage/dépliage lors du changement de couche.

.. image:: ../_images/tech/accordion.png
              :alt: accordion
              :align: center   

* ``allintabs``: Affichage à la suite avec une entrée par entité.

.. image:: ../_images/tech/allintabs.png
              :alt: allintabs
              :align: center   

Exemple
-----------------

.. code-block:: xml
       :linenos:

	<application title="Exemple"
		logo="img/logo/g.png"
		help="help/aide.html"
		exportpng="false"
		measuretools="true"
		favicon="https://www.bretagne.bzh/app/themes/bretagne/dist/img/icons/favicon.ico"
		style="css/themes/blue.css"/>
