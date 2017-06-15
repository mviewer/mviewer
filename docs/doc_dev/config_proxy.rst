.. Authors : 
.. mviewer team

.. _configproxy:

Configurer - Le proxy
======================


Lien vers votre proxy permmettant l'interrogation CROSS DOMAIN des couches. Il n'y a pas besoin d'utiliser de proxy pour les donnéees servies par GeoBretagne car CORS est activé (http://enable-cors.org/server.html) Mviewer n'est pas fourni avec un proxy Ajax. L'application peut fonctionner avec le proxy de GeorChestra. Un proxy cgi peut être utilisé. Plus de détail ici : [proxy] (https://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#WhydoIneedaProxyHost)


**Syntaxe**

.. code-block:: xml
       :linenos:
	
	<proxy url="" />

**Attributs**

* ``url``: Url vers votre proxy
