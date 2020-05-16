.. Authors : 
.. mviewer team
.. Sébastien FOUCHEUR

.. _publicfonctions:

Les fonctions publiques de mviewer
==================================

Pour accéder à ces fonctions publiques il faut simplement utiliser l'objet ``mviewer`` et accéder à une fonction (``mviewer.nomDeLaFonction()``). 

Il existe déjà les fonctions suivantes :

.. object:: mviewer

    .. function:: getActiveBaseLayer()
    
        :return: L'id du baselayer  (couche de fond visible).

    .. function:: setBaseLayer(id)
    
        :param string id: Id du layer
            
        :return: Affiche le baselayer correspondant à l'id.

    .. function:: getLayer(layerid)
    
        :param string layerid: Id du layer
            
        :return:  La configuration du layer.

        .. attribute:: getLayer(layerid).layer

            :return:  Le layer (ol.Layer) du layerid.

    .. function:: getMap()
            
        :return: La map (ol.Map).
    
    .. function:: toggleLayer(layerid)
    
        :param string layerid: Id du layer
            
        :return: Affiche/masque le layer correspondant au layerid.
    
    .. function:: removeAllLayers()
            
        :return:  Masque toutes les couches.

    .. function:: showLocation(projection, x ,y)
    
        :param string projection: Projection de la carte
        :param float x: Coordonnée y
        :param float y: Coordonnée y
            
        :return: Affiche une punaise sur les coordonnées entrées.
        
    .. function:: tr()
            
        :return: Traduit dans la langue courante de mviewer une valeur de type ``machaine.a.traduire`` (cf :ref:`translation`) . 
    
    .. function:: zoomToLocation(x,y,zoom, querymap)
    
        :param float x: Coordonnée y
        :param float y: Coordonnée y
        :param int zoom: Zoom de la carte
        :param boolean querymap: Interrogation de la carte
            
        :return: Zoom aux coordonnées indiquées et en option interroge la carte à ces coordonnées.