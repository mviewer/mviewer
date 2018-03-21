Version 3.0
===========

### Version majeure utilisant le framework Bootstrap à la place de jQuery Mobile

**Evolutions principales :**
 * Nouveau design de l'application
 * Support de la dimension temporelle pour les couches de type wms avec création d'un controle dédié
 * Ajout d'un nouveau sous-groupe dans le panneau des thématiques
 * Créations de contrôles dédiés (styles et filtres attributaires) pour les couches de type wms
 * Support du templating **Mustache** pour mettre en forme les fiches d'information
 * Ajout du paramètre tooltip pour les layers de type geojson
 * Ajout du paramètre expanded pour les layers
 * Ajout du paramètre stats pour l'application
 * Ajout du paramètre toplayer
 * Renommage de hook en customlayer
 * Suppression de l'identité Région Bretagne dans mviewer
 * Ajout de nouvelles démos
 * Nouveau paramètre coordinates
 * Nouveau paramètre toggleAllLayersFromTheme pour masquer/afficher toustes lescouches d'une thématique
 * nouveau paramètre dynamiclegend pour actualiser la légende en fonction du zoom
 * Mise à jour des reqûetes elasticsearch afin d'assurer la compatibilité avec la version courante
 * Ajout du paramètre FuseSearch pour les layers de type geojson & customlayers
 * Mise à jour d'openlayers vers la version 4.5
 * Support des templates Mustache pour les tooltips des entités
 * Nouveau contrôle "Mouse position"
 * Support de la géolocalisation et de la rotation
 * Support de GetFeatureInfo vers des service WMS ArcGIS Server


Version 2.5
===========

### Dernière version utilisant le framework jQuery Mobile

**Evolutions :**
 * Ajout du apramamètre filter pour les couche de type wms
 * Ajout du paramamètre style pour les couche de type wms
 * Ajout du paramamètre sld pour les couche de type wms
 * Ajout du paramamètre description pour l'application
 * Support des types geojson et hook pour les layers
 * Ajout d'une page de démo pour référencer des exemples de configuration
 * Support des couches sécurisées via le security-proxy de @georchestra
 * Support des capacités WMTS pour la configuration des baselayers


Version 2
=========

**Cette version apporte les évolutions suivantes :**
 * version 3.9 d'Openlayers,
 * Affichage/masquage de toutes les couches d'un thème en un clic,
 * Les couches non visibles à l'échelle courante sont grisées,
 * paramétrage du titre de l'application, du logo, du lien vers le fichier d'aide,
 * Paramétrage des options de recherche dans l'application


**Les autres évolutions optionnelles sont les suivantes :**
 * outils de mesures,
 * ajout de l'API BAN comme moteur de géocodage (localisation),
 * Possibilité d'afficher les interrogations de couches dans le Panel plutôt que dans une popup,
 * interrogation d'un index ElasticSearch permettant une recherche "à la Google" sur les couches de données",
 * affichage de la légende et des attributions,
 * Export de la carte et de la légende au format image/png.

