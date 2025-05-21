.. Authors : 
.. mviewer team
.. Sébastien FOUCHEUR

.. _publicfonctions:

Les fonctions publiques de mviewer
==================================

Pour accéder à ces fonctions publiques, il faut simplement utiliser l'objet ``mviewer`` et accéder à une fonction (``mviewer.nomDeLaFonction()``). 

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
        :param float x: Coordonnée x
        :param float y: Coordonnée y
            
        :return: Affiche une punaise sur les coordonnées entrées.
        
    .. function:: tr()
            
        :return: Traduit dans la langue courante de mviewer une valeur de type ``machaine.a.traduire`` (cf :ref:`translation`) . 
    
    .. deprecated:: 3.15
       Cette fonction est obsolète et ne devrait plus être utilisée. 
       Veuillez utiliser :func:`animateToFeature` à la place.
    .. function:: zoomToLocation(x,y,zoom, querymap)
    
        :param float x: Coordonnée x
        :param float y: Coordonnée y
        :param int zoom: Zoom de la carte
        :param boolean querymap: Interrogation de la carte
            
        :return: Zoom aux coordonnées indiquées et en option interroge la carte à ces coordonnées.

    .. function:: animateToFeature(coordinates, zoom, center, querymap, hideleftpanel)

        :param array coordinates: Coordonnées [x, y] du point cible
        :param int zoom: Niveau de zoom de la carte
        :param boolean center: Centre la carte sur les coordonnées
        :param boolean querymap: Interroge la carte à ces coordonnées
        :param boolean hideleftpanel: Masque le panneau de gauche au moment du zoom - valeur par défaut : false
            
        :return: Zoom aux coordonnées indiquées, avec en option l'interrogation de la carte à ces coordonnées et la possibilité de masquer le panneau de gauche.

    .. function:: getLayersAttribute(attribute)
    
        :param string attribute: Attribut recherché dans les couches Mviewer
            
        :return: Un objet contenant les couches et la valeur de l'attribut recherchée du type {id1: value, id2: null}.

    .. function:: orderLegendByMap()
              
        :return: Réordonne la légende selon l'affichage des couches sur la carte.

    .. function:: orderLegendByMap()
              
        :return: Réordonne la légende en respectant l'affichage des couches sur la carte.

    .. function:: reorderLayer(layer, index)
              
        :param Object layer: Couche OpenLayers depuis la carte (e.g depuis mviewer.getLayer(id)).
        :param int index: Nouvel index de la couche sur la carte.

        :return: Permet de changer l'affichage d'une couche sur la carte (voir openLayers zindex).

    .. function:: showLayersByAttrOrder(layers, reverse)
              
        :param Object layer: Dictionnaire des couches avec le zindex pour chacune (ex. {id1:1, id2:2,,,})
        :param boolean reverse: reverse == true pour lire les couches dans le sens inverse de l'ordre de l'objet.

        :return: Permet de modifier l'ordre complet des couches de la carte, réordonnera les topLayer et la légende ensuite.

    .. function:: setLegendLayerPos(id, position)
              
        :param string id: Identifiant de la couche. Correspond à l'attribut data-layerid d'un élement de la légende.
        :param int position: Nouvelle position de l'élément de légende ciblé dans la légende.

        :return: Permet de modifier l'ordre d'affichage d'un élément de la légende sans impacter l'ordre d'affichage sur la carte.

    .. function:: orderLayerByIndex()

        :return: Ordonne les éléments en respectant le paramètre index. Les couches sans index seront listées dans l'ordre d'écriture  dans le XML. Cela n'impacte pas l'affichage dans la légende.

    .. function:: orderTopLayer()

        :return: Ordonne les/la couches avec le paramètre toplayer. Cela n'impacte pas l'affichage dans la légende.
		
    .. function:: clickedCoordinates ()

        :return: Les coordonnées latitude / longitude du point cliqué sur la carte.