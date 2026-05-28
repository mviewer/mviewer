.. Authors :
.. mviewer team

.. _configproxy:

Configurer - Le proxy
======================


.. sidebar:: CORS

       | **Cross-Origin Resource Sharing**
       | Il n'y a pas besoin d'utiliser de proxy pour les données servies par GeoBretagne par exemple car CORS est activé. `En savoir plus <http://enable-cors.org/server.html>`_.

Lien vers votre proxy permmettant l'interrogation CROSS DOMAIN des couches. L'usage du proxy peut être nécessaire pour visualiser une donnée provenant d'un autre domaine que celui hébergeant l'application mviewer. Mviewer n'est pas fourni avec un proxy Ajax. L'application peut fonctionner avec le proxy de **GeorChestra**. Un proxy cgi peut être utilisé. Plus de détail `ici <https://www.thecodeship.com/web-development/proxypy-cross-domain-javascript-requests-python>`_




**Syntaxe**

.. code-block:: xml
       :linenos:

	<proxy url="" />

**Attributs**

* ``url``: Url vers votre proxy. Exemple : <proxy url='https://geobretagne.fr/proxy/?url='/>


Pour que le proxy soit pris en compte au niveau d'une couche, il faut ajouter l'option useproxy="true" dans la balise <layer>.
