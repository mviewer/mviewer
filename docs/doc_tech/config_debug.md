# Débug erreurs courantes

Dans cette page nous mettrons des exemples de bug récurrents dans le
mviewer et la façon de les résoudre.

-   **Légende non disponible**

<img src="../_images/dev/config_debug/legende_non_disponible.png"
class="align-left" alt="Légende non disponible" />

S'affiche pour une donnée non WMS si legendurl ou vectorlegend non
renseignés.

-   **Je n'arrive pas à interroger ma couche**

Ce problème peut venir de plusieurs facteurs.

Bien vérifier le infoformat. Pour rappel, 2 possibilités :

-   text/html : fichiers FTL GeoServer
-   application/vnd.ogc.gml : fichiers mustache ou utilisations de
    fields et aliasfields

Vérifier sur votre serveur carto (GeoServer, MapServer...) que votre
couche est interrogeable.

-   **Je ne vois pas mon thème**

L'identifiant unique de mon thème n'est pas unique. Pour corriger,
changer l'identifiant du thème invisible. Même principe pour un groupe
de couche.
