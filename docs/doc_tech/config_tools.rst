.. Authors :
.. mviewer team

.. _tools:

Présentation
============

Cette page vous servira à comprendre comment utiliser les outils disponibles.
Les outils sont intégrées dans le coeur mviewer et utilisés selon la configuration du XML. Le fichier est chargé dans tous les cas.

La différence avec les extensions est qu'une extension (et ses fichiers) est chargée au besoin et selon qu'elle est utilisée ou non dans la configuration XML.

Les outils concerne ici : 

- l'outil de dessin

D'autres outils viendront compléter cette liste.

Les outils sont localisés dans la balise <tools> de la configuration XML.

.. code-block:: xml
       :linenos:
       
        <application/>
        
            <tools>
                ... outils
            </tools>

            ....reste de la configuration XML

Les outils sont présentés dans les sections qui suivent. 

Outil de dessin
---------------

L'outil de dessin permet de : 

- dessiner un point
- dessiner un polygon
- dessiner une ligne
- donner un nom à une forme
- exporter le dessin en GeoJSON
- afficher des informations de mesure
- dessiner selon une couche d'accroche WFS (snapping)

Pour activer l'outil, vous devez le rajouter dans la balise ``<tools>`` :

.. code-block:: xml
       :linenos:

        <tools>
            <draw geometryTypes="Polygon" snapLayerId="geom_parcelle_2023" ... />
        </tools>

** Paramètres **

* ``geometryTypes`` : (string) - List des géométries à dessiner.
* ``snapLayerId`` : (string) - Un ID de couche WFS déjà utilisé dans la configuration XML (e.g custom layer)
* ``snapLayerUrl`` : (string) - URL complète d'une couche WFS (le format doit être en ``application/json`` )
* ``snapLimitZoom`` : (int) - Limite l'activation du snapping par niveau de zoom. Cela permet de limiter le chargement d'entités WFS. Le snapping sera actif si le zoom de la carte est supérieur à cette valeur.
* ``help`` : (boolean) - Utilsier l'aide
* ``nbPixelsToClosePolygon`` : (int) - Distance en pixels pour fermer automatiquement la forme et créer un polygone.
* ``singleDraw`` : (boolen) - True pour dessiner uniquement une forme à la fois.
* ``snapTolerance`` : (int) - Tolérence du snapping en pixel (c.fg pixelTolerance ol > v8.0)

