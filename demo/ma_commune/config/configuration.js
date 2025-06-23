// Ce fichier contient les variables d'environnement
// Pour déployer le mviewer,
//  * copier ce fichier dans le même dossier config,
//  * le renommber en "configuration.js"
//  * remplacer les variables par les valeurs de l'environnement

var URL_ADMINISTRATION =
  "https://ows.region-bretagne.fr/geoserver/rb/wfs?SERVICE=WFS&request=GetFeature&version=1.1.0&typeName=administration&outputFormat=application%2Fjson&srsName=EPSG:3857";
var URL_EDUCATION =
  "https://geobretagne.fr/geoserver/rectorat/wfs?SERVICE=WFS&request=GetFeature&version=1.1.0&typeName=etablissements_scolaire&outputFormat=application%2Fjson&srsName=EPSG:3857";
var URL_SPORT =
  "https://geobretagne.fr/geoserver/opendata/wfs?SERVICE=WFS&request=GetFeature&version=1.1.0&typeName=equipement_sportif&outputFormat=application%2Fjson&srsName=EPSG:4326";
var URL_CULTURE =
  "https://geobretagne.fr/geoserver/opendata/wfs?SERVICE=WFS&request=GetFeature&version=1.1.0&typeName=basilic&outputFormat=application%2Fjson&srsName=EPSG:3857";
var PROJECTION_API_COORD = "EPSG:4326";
