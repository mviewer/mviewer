.. Authors :
.. mviewer team

.. _configtpl:

Configurer - Templates
=========================


Personnalisation de la fiche d'information

Pour les couches de type vecteur et WMS, il est possible de définir un template afin de formater côté client, la fiche d'information des entités sélectionnées.
Le moteur de template (logic less) utilisé est Mustache : https://github.com/janl/mustache.js

Exemple de template structuré
--------------------------------

.. code-block:: xml
       :emphasize-lines: 1,13,15,47
       :linenos:


        {{#features}}
            <li class="item">
                Exemple de formatage
                <h3 class="title-feature">{{nom}}</h3>
                <img src="{{image}}" class="img-responsive" style="margin-top:5%;" /><br/>
                <p class="text-feature">
                     <b> Surface : </b> {{surface}} ha <br/>
                </p>
                <a href="{{url}}" target="_blank" title="Lien site internet" class="but-link">
                     <span class="fa fa-globe" aria-hidden="true"></span> <b>Site Web</b>
                </a>
            </li>
        {{/features}}

        <style>
            .title-feature {
                color: #BA88A4;
                font-family:"Trebuchet MS";
                font-size:20px;
                margin-bottom:3%;
                line-height:1;
            }
            .text-feature{
                font-family:"Trebuchet MS";
                color:#555;
                font-size:13px;
                margin-top:2%;
                margin-bottom:2%;
            }
            .but-link, .but-link:focus, .but-link:hover{
                display:inline-block;
                padding:0.5em 1em;
                margin:0 0.3em 0.3em 0;
                border-radius:0.3em;
                box-sizing: border-box;
                text-decoration:none;
                font-family:'Trebuchet MS';
                font-weight:300;
                color:#FFFFFF;
                background-color:#BA88A4;
                text-align:center;
                transition: all 0.2s;
            }
            .but-link:hover{
                background-color:#b0006b;
            }
        </style>

Les éléments en rouge sont obligatoires.

Explications : ``{{#features}}{{/features}}`` est une boucle effectuée sur chaque entité présente dans la couche sélectionnée.
``<li class="item"></li>`` est une entrée de liste html utilisée par le mviewer. S'il y a plusieurs entrées de liste car plusieurs entités sélectionnées, le mviewer présentera les réponses sous la forme d'un carousel.

Ce qu'il faut savoir de Mustache
--------------------------------

- On fait référence à la valeur d'un champ de cette façon : ``{{champ}}``.
- Il est possible de gérer une absence de valeur ou une valeur false de cette façon :

.. code-block:: xml
       :linenos:

        {{#champ2}}
            Ce texte s'affiche si champ2 contient une valeur ou est différent de false.
        {{/champ2}}

La finalité du template est ici de fabriquer un contenu formaté HTML. L'ajout des balises <style> permet de personnaliser l'affichage du champ via du CSS. Exemple ici sur le formatage du texte et d'un bouton pour clic.

Pour aller plus loin sur la personnalisation, consulter les différentes documentation sur HTML et CSS.

Nous avons la possibilité d'injecter du code via la balise <script>.

Résultat de l'exemple ci-dessus
--------------------------------

.. image:: ../_images/dev/config_tpl/exemple_template.png
              :width: 400
              :alt: Exemple de template
              :align: center

Itérer sur les champs disponibles
---------------------------------

En plus d'afficher la valeur d'un champ comme expliqué précédemment, il est aussi possible de lire et parcourir l'ensemble des champs disponibles avec  ``{{#fields_kv}}...{{/fields_kv}}``.

Pour chaque champ listé, on peut accéder :

- au nom du champ via ``{{key}}``
- à la valeur via ``{{value}}``

Par exemple, ce code :

.. code-block:: xml
       :linenos:

       {{#features}}
         <li class="item" style="width:238px;">
             <ul>
               {{#fields_kv}}
                 <li>{{key}} : {{value}}</li>
               {{/fields_kv}}
             </ul>
         </li>
       {{/features}}

affichera la liste des champs avec leur nom suivi de leur valeur sans avoir à connaître les noms des champs à l'avance.

Dans le même ordre d'idée, un autre "champ virtuel", ``{{serialized}}``, permet de récupérer l'ensemble des champs sous forme sérialisée, prête à être passée en paramètre dans une URL. Par exemple, dans une iframe:

.. code-block:: xml
       :linenos:

       <iframe class="iframe_bottom"src="apps/myapp/presentation/en/pages/mylayer_charts.html?data={{serialized}}"></iframe>

Vous pourrez ensuite le désérialiser de façon standard. Par exemple, en javascript dans le fichier mylayer_charts.html (cf. exemple ci-dessus) :
::

    <script>
      var url = new URL(location.href);
      var data = url.searchParams.get("data");

      if(data) {
        var obj = JSON.parse(data)
        keys = Object.keys(obj);
        for ( i=0 ; i<keys.length ; i++ ) {
          key=keys[i];
          console.log(key + ': '+obj[key]);
        }
        ...
      }
    </script>

Les champs ``{{#fields_kv}}`` et ``{{serialized}}`` sont tous les deux virtuels : ils sont créés grâce à une fonctionnalité de Mustache permettant de `définir des champs comme des fonctions <https://github.com/janl/mustache.js#functions>`_.
S'ils ne sont pas utilisés, ils ne consomment pas de ressource.
Ils ont été `ajoutés aux champs simples <https://github.com/geobretagne/mviewer/pull/206/files>`_ afin de faciliter certains flux de traitement des données.

Appel depuis le XML
--------------------------------

Le template sera enregistré au format mst. Pour l'appeler dans la configuration mviewer au niveau de la layer, il faut le bon format ``infoformat="application/vnd.ogc.gml"`` et ajouter un appel au mst via une balise template au sein du layer ``<template url=""/>``.
