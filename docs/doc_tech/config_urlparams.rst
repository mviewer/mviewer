.. Authors :
.. mviewer team

.. _configurlparams:

Configurer - Les paramètres d'URL
=================================

Centrer la carte à l'ouverture grâce à deux paramètres d'URL sur une adresse ou une parcelle
--------------------------------------------------------------------------------------------

L'application peut s'ouvrir en centrant la carte sur une localité particulière (adresse ou parcelle)
Ce paramétrage dynamique est rendu possible en ajoutant à l'URL mviewer les paramètres suivants : 

* ?q=21 rue dupont des loges Rennes&qtype=ban
* ?q=code_insee%3D35238%26section%3DAB%26numero%3D0001&qtype=cadastre

**Syntaxe**

.. code-block:: xml
       :linenos:

	<urlparams>
           <qtype name="" url="" />           
       </urlparams>

**Attributs**

* ``url``: URL du service utilisé : BAN https://api-adresse.data.gouv.fr/search/ ou CADASTRE pour les parcelles cadastrales  https://apicarto.ign.fr/api/cadastre/parcelle
* ``name``: Type de service utilisé cadastre ou ban

**Exemple**

.. code-block:: xml
       :linenos:

       <urlparams>
           <qtype name="ban" url="https://api-adresse.data.gouv.fr/search/" />
           <qtype name="cadastre" url="https://apicarto.ign.fr/api/cadastre/parcelle" />
       </urlparams>


