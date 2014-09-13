/*
 * Fonctions pour afficher les jours de collecte en un point
 */
Layers_Hooks['Collecte Poubelle'] = function(coordinate, projection, layer) {
  /*
   * Récupération des coordonnées du clic
   *     reprojection si nécessaire
   *     arrondi au centiometre
   */
  coordinate2 = coordinate;
  if (projection != 'EPGS:3948')
    coordinate2 = ol.proj.transform(coordinate, projection, 'EPSG:3948');
  coordinate2[0] = (coordinate2[0]*10.0) / 10.0;
  coordinate2[1] = (coordinate2[1]*10.0) / 10.0;

  /*
   *  Action sur la position pour la couche en question
   */
  var resultat = '{x:1215041,y:7188167,distance:32.1930402091373,adresse:"8 IMP CHARCOT",emb:"LU",bio:"VE",dmr:"ME"}';
  $("#popup-content").html(afficher_jours_collecte(resultat, coordinate2));
  $('#popup').show();

  /*
   * Dans la vraie vie je vais chercher un webservice en ajax ...
   *
  var requete = $.ajax({
    url: "UNE URL",
    type: "POST",
    data: "module=collecte&x="+coordinate2[0]+"&y="+coordinate2[1],
    success: function(msg){
      if(requete.responseText == "false") {
        $("#popup-content").html('<b>Erreur !!!</b>');
      }
      else {
        $("#popup-content").html(afficher_jours_collecte(msg.trim(),coordinate2));
      }
      $('#popup').show();
      return true;
    }
  });
  */

  return true;
};

/* Je recopie ce même comportement pour plusieurs couches */
Layers_Hooks['Collecte Poubelle Verte'] = Layers_Hooks['Collecte Poubelle'];
Layers_Hooks['Collecte Poubelle Jaune'] = Layers_Hooks['Collecte Poubelle'];
Layers_Hooks['Collecte Poubelle Bleue'] = Layers_Hooks['Collecte Poubelle'];

function afficher_jours_collecte(valeur, coordinate)
{
  var jours_collecte = eval('('+valeur+')');
  var texte = '';          /* Contenu de la fenetre d'information */
  var texte_maj = '';      /* Contenu du formulaire de mise à jour */

  texte += '<table width="360px" border="0" cellspacing="0" cellpadding="0">';
  texte += '<tr><td colspan=3>'+jours_collecte.adresse+'<br></td></tr>';
  texte += '<tr><td colspan=3><small>L&eacute;gende :</small><br><img src="img/applis/legende_collecte.png"></td></tr>';
  texte += '<tr><td>Biod&eacute;chets</td><td align="center" valign="top">'+formatJour(jours_collecte.bio)+'</td><td bgcolor="'+formatCouleur(jours_collecte.bio)+'">&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>';
  texte += '<tr><td>Emballage</td><td align="center" valign="top">'+formatJour(jours_collecte.emb)+'</td><td bgcolor="'+formatCouleur(jours_collecte.emb)+'">&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>';
  texte += '<tr><td>Autres d&eacute;chets</td><td align="center" valign="top">'+formatJour(jours_collecte.dmr)+'</td><td bgcolor="'+formatCouleur(jours_collecte.dmr)+'">&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>';
  texte += '</table>';

  texte_maj += '<br>Rappel des informations actuelles :<br>'+texte;
  texte += '<br><a href=# onclick=\'$("#popup").hide();$("#updatePopup").popup("open",{positionTo: "window"});\'>Proposer une mise &agrave; jour des informations pour ce point</a><br>';

  /*
   * On prépare un formulaire de mise à jour
   */
  texte_maj += '<br>Votre proposition de mise &agrave; jour :<br>';
  texte_maj += '<table width="360px" border="0" cellspacing="0" cellpadding="0"><tr><td>';
  texte_maj += "<small>Attention : grace a ce formulaire vous faites une <b><u>proposition</u></b> de mise a jour. Les services de Lorient Agglomeration effectueront une validation avant que cette proposition ne modifie directement les données du référentiel.</small>";
  texte_maj += '</td></tr></table>';

  texte_maj += '<table>';
  texte_maj += '<tr><td>mail du demandeur</td><td align="center" valign="top"><input type=text name=email style="width:100%"></td></tr>';
  texte_maj += '<tr><td>Biod&eacute;chets</td><td align="center" valign="top">'+listeOptionJoursCollecte('bio', jours_collecte.bio)+'</td></tr>';
  texte_maj += '<tr><td>Emballage</td><td align="center" valign="top">'+listeOptionJoursCollecte('emb',jours_collecte.emb)+'</td></tr>';
  texte_maj += '<tr><td>Autres d&eacute;chets</td><td align="center" valign="top">'+listeOptionJoursCollecte('dmr',jours_collecte.dmr)+'</td></tr>';
  texte_maj += '<tr><td colspan=2><input type=submit value= "Envoyer" style="width:100%" onclick=\'alert("A programmer !")\'></td></tr>';
  texte_maj += '</table>';
  
  $("#update-title").text('Mise à jour info collecte');
  $("#update-content").html(texte_maj);

  return texte;
}

function listeOptionJoursCollecte(champ, valeur)
{
  var texte = '';
  texte += '<select name="'+champ+'">';
  texte += ' <option value="LU">Lundi</option> ';
  texte += ' <option value="MA">Mardi</option> ';
  texte += ' <option value="ME">Mercredi</option> ';
  texte += ' <option value="JE">Jeudi</option> ';
  texte += ' <option value="VE">Vendredi</option> ';
  texte += ' <option value="MA-VE">Mardi et Vendredi</option> ';

  texte += ' <option value="LU S1">Lundi (semaines impaires)</option> ';
  texte += ' <option value="MA S1">Mardi (semaines impaires)</option> ';
  texte += ' <option value="ME S1">Mercredi (semaines impaires)</option> ';
  texte += ' <option value="JE S1">Jeudi (semaines impaires)</option> ';
  texte += ' <option value="VE S1">Vendredi (semaines impaires)</option> ';

  texte += ' <option value="LU S2">Lundi (semaines paires)</option> ';
  texte += ' <option value="MA S2">Mardi (semaines paires)</option> ';
  texte += ' <option value="ME S2">Mercredi (semaines paires)</option> ';
  texte += ' <option value="JE S2">Jeudi (semaines paires)</option> ';
  texte += ' <option value="VE S2">Vendredi (semaines paires)</option> ';

  texte += '</select>'; 
  return texte;
}

function formatCouleur(code)
{
  testval = code.replace(' ISOLE','');
  retcode = 'grey';

  switch(testval.trim())
  {
    case 'LU'   :
    case 'LU S1':
    case 'LU S2':
      retcode= 'red';
      break;
    case 'MA'   :
    case 'MA S1':
    case 'MA S2':
      etcode= 'green';
      break;
    case 'ME'   :
    case 'ME S1':
    case 'ME S2':
      retcode= 'blue';
      break;
    case 'JE'   :
    case 'JE S1':
    case 'JE S2':
      retcode= 'yellow';
      break;
    case 'VE'   :
    case 'VE S1':
    case 'VE S2':
      retcode= 'purple';
      break;
    case 'MA-VE' :
      retcode= 'marroon';
      break;
  }
  return retcode;
}

function formatJour(code)
{
  testval = code.replace(' ISOLE','');
  retcode = code;

  switch(testval.trim())
  {
    case 'LU' :
      retcode= 'Lundi';
      break;
    case 'MA' :
      etcode= 'Mardi';
      break;
    case 'ME' :
      retcode= 'Mercredi';
      break;
    case 'JE' :
      retcode= 'Jeudi';
      break;
    case 'VE' :
      retcode= 'Vendredi';
      break;

    case 'LU S1' :
      retcode= 'Lundi (semaines impaires)';
      break;
    case 'MA S1' :
      retcode= 'Mardi (semaines impaires)';
      break;
    case 'ME S1' :
      retcode= 'Mercredi (semaines impaires)';
      break;
    case 'JE S1' :
      retcode= 'Jeudi (semaines impaires)';
      break;
    case 'VE S1' :
      retcode= 'Vendredi (semaines impaires)';
      break;

    case 'LU S2' :
      retcode= 'Lundi (semaines paires)';
      break;
    case 'MA S2' :
      retcode= 'Mardi (semaines paires)';
      break;
    case 'ME S2' :
      retcode= 'Mercredi (semaines paires)';
      break;
    case 'JE S2' :
      retcode= 'Jeudi (semaines paires)';
      break;
    case 'VE S2' :
      retcode= 'Vendredi (semaines paires)';
      break;
    case 'MA-VE' :
      retcode= 'Mardi et Vendredi';
      break;
  }

  if (code.indexOf('ISOLE') > -1) retcode += '<font color=red style="font-size:x-small">&agrave; confirmer</font>';

  return retcode;
}


