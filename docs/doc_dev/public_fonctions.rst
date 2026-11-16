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

.. _featureclick:

Interroger des entités vectorielles depuis JavaScript
-----------------------------------------------------

L’objet ``info`` permet de déclencher une interrogation depuis un contrôle, un résultat de recherche ou un autre script.
Utiliser cette API après l’initialisation de mviewer et le chargement des entités.
La couche doit être vectorielle, enregistrée dans mviewer et configurée avec ``queryable="true"``.
Les géométries fournies et la position de clic doivent utiliser la projection de la carte.

.. function:: info.queryFeatures(features, layer, options={})

    Ouvre les mêmes panneaux d’information qu’un clic sur les entités sélectionnées.

    :param features: Une entité OpenLayers, une entité cluster ou un tableau d’entités.
    :type features: ol.Feature ou Array<ol.Feature>
    :param layer: Identifiant de la couche mviewer ou objet OpenLayers portant cet identifiant dans sa propriété ``mviewerid``.
    :type layer: string ou ol.layer.BaseVector
    :param options: Objet optionnel contenant les paramètres du clic, vide par défaut.
    :type options: Object
    :param options.coordinate: Position optionnelle ``[x, y]`` exprimée dans la projection de la carte.
    :return: Une promesse résolue après le traitement de la sélection et la mise à jour des panneaux d’information.
    :rtype: Promise<void>
    :raises Error: Si la couche est introuvable ou n’est pas vectorielle, la promesse est rejetée avec un message traduit.

Sans ``options.coordinate``, la position est calculée au centre de l’emprise des géométries sélectionnées.
Si aucune géométrie n’est disponible, le centre de la carte est utilisé.
Une sélection vide ne déclenche aucune interrogation.
La méthode traite uniquement les entités fournies, sans recherche d’autres entités au même pixel ni requête WMS supplémentaire.

Exemples d’utilisation
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    // Open the information panel for one feature.
    await info.queryFeatures(feature, "points_csv");

    // Open one information entry for each member of a cluster.
    await info.queryFeatures(clusterFeature, "points_csv");

    // Query an explicit selection using the OpenLayers layer object.
    const layer = mviewer.getLayer("points_csv").layer;
    await info.queryFeatures([firstFeature, secondFeature], layer);

    // Set the click position using coordinates in the map projection.
    await info.queryFeatures(feature, "points_csv", {
        coordinate: mviewer.getMap().getView().getCenter()
    });

Comportement des clusters et des panneaux
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Les clusters standards sont dépliés à partir de ``feature.get("features")`` et chaque entité d’origine alimente sa propre fiche d’information.
Le compteur correspond au nombre d’entités sélectionnées et les références dupliquées ne sont affichées qu’une fois.
Un cluster contenant une seule entité produit une seule fiche.
Les attributs, les templates et les langues configurés pour la couche sont utilisés comme lors d’un clic sur la carte.
La mise en surbrillance respecte le paramètre ``infohighlight`` de la couche.
Le mode de panneau ``allintabs`` crée un onglet par entité.
Une couche dont ``queryable`` vaut ``false`` n’est pas interrogée.

Les custom layers et custom controls disposant d’un gestionnaire ``handle`` continuent à recevoir le cluster d’origine pour conserver leur traitement personnalisé.
La promesse attend également la fin du gestionnaire personnalisé si celui-ci est asynchrone.

Utilitaires au clique
~~~~~~~~~~~~~~~~~~~~~

Les utilitaires sont définis dans ``js/infos/featureClick.js`` et exposés sur l’objet ``utils`` par ``js/utils/main.js``.
Ils servent à préparer une sélection ou un contexte de clic ; ``info.queryFeatures`` réalise ensuite l’interrogation et l’affichage des informations.

.. function:: utils.getClickedFeatures(features, expandClusters=true)

    Normalise une sélection sous forme de tableau et supprime les références dupliquées.

    :param features: Une entité, un cluster ou un tableau d’entités OpenLayers.
    :param boolean expandClusters: Si ``true``, remplace chaque cluster par les membres de son tableau ``features`` ; si ``false``, conserve les entités cluster.
    :return: Tableau des entités sélectionnées, avec leurs références d’origine.
    :rtype: Array<ol.Feature>

.. code-block:: javascript

    const members = utils.getClickedFeatures(clusterFeature);
    const clusters = utils.getClickedFeatures([clusterFeature], false);

.. function:: utils.createFeatureClickEvent(features, map, coordinate)

    Construit un contexte de clic à partir des entités sélectionnées.

    :param features: Une entité, un cluster ou un tableau d’entités OpenLayers.
    :param map: Carte OpenLayers contenant la couche.
    :type map: ol.Map
    :param coordinate: Position optionnelle ``[x, y]`` dans la projection de la carte ; sans position explicite, utilise le centre de l’emprise des géométries, puis le centre de la carte si aucune géométrie n’est disponible.
    :return: Objet contenant ``type: "singleclick"``, ``coordinate`` et ``pixel``.
    :rtype: Object

.. code-block:: javascript

    const event = utils.createFeatureClickEvent(
        clusterFeature,
        mviewer.getMap()
    );
    await info.queryFeatures(clusterFeature, "points_csv", {
        coordinate: event.coordinate
    });

Consulter l’état de l’interrogation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Après avoir attendu ``info.queryFeatures(...)``, les méthodes suivantes permettent de consulter l’état de la dernière interrogation.

.. function:: info.getClickCoordinates()

    :return: Dernière position d’interrogation ``[x, y]`` dans la projection de la carte, ou ``null`` après réinitialisation de l’état.

.. function:: info.getQueriedFeatures()

    :return: Entités conservées pour la mise en surbrillance après l’interrogation ; les entités des couches avec ``infohighlight="false"`` ne sont pas incluses.

.. function:: info.hasQueryResult()

    :return: ``true`` si l’interrogation a produit des résultats pour les panneaux d’information, sinon ``false``.
    :rtype: boolean

.. function:: info.clearQueryState()

    Réinitialise les coordonnées de clic, les références des entités interrogées et l’indicateur de présence de résultats.
