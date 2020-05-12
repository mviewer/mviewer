.. Authors :
.. mviewer team

.. _configcustomcontrol:

Configurer - Custom control
===========================


Un custom control est une interface permettant à l'utilisateur d'interagir avec une couche. Le customcontrol est affiché dans le bloc de légende associée à la couche concernée.
Un custom control est associé à une seule couche et est constitué de deux fichiers **html** + **javascript**. Ces deux fichiers doivent obligatoirement être nommé comme l' ``id`` de la couche associée.

Exemples

- J'ai besoin d'une liste déroulante pour filtrer ma couche.
- J'ai besoin d'une zone de saisie pour filtrer ma couche

**Syntaxe**

.. code-block:: XML
	:emphasize-lines: 2,3

	<layer id="moncustom"
		customcontrol="true"
		customcontrolpath="chemin_vers_fichiers">
	</layer>


**Paramètres custom control**

* ``customcontrol``: paramètre qui indique si mviewer doit charger un customcontrol. valeurs : true || false. Défaut = false.
* ``customcontrolpath``: paramètre qui indique où mviewer doit charger le customcontrol. Si ce paramètre n'est pas renseigné, le customcontrol est recherché dans le répertoire racine **customcontrols**.




**Exemple**

.. code-block:: XML
    :caption: config.xml
    :emphasize-lines: 7-8

	<layer id="heatmap"
        name="Earthquakes Heatmap"
        visible="true"
        url="demo/heatmap/customlayer.js"
        queryable="true"
        type="customlayer"
        customcontrol="true"
        customcontrolpath="demo/heatmap/control"
        legendurl="demo/heatmap/legend.png"
        opacity="1"
        expanded="true"
        attribution=""
        metadata=""
        metadata-csw="">
    </layer>



.. Note::
    Apprendre par l'exemple :

    - :ref:`customcontrol`