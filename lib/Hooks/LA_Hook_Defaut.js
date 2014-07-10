/*
 *  Ce script a pour objectif de définir un Hook par défaut 
 *  pour les couches de données
 *  Lorsqu'une application fait référence à ce fichier
 *  Le comportement par defaut du mviewer est complètement inhibé :
 *  Le mviewer ne fait plus jamais d'appels GetFeatureInfo
 *  Même si aucun Hook spécifique n'est déini pour les couches affichées
 */
LorientAgglo_Hooks['defaut'] = function(coordinate, projection) {
  coordinate2 = coordinate;
  if (projection != 'EPGS:3948')
    coordinate2 = ol.proj.transform(coordinate, projection, 'EPSG:3948');

  $("#popup-content").html('Aucune action sp&eacute;cifique pour cette couche !');
  $('#popup').show();
  $.mobile.loading('hide');
};
