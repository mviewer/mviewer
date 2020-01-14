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

Pour allez plus loin sur la personnalisation, consulter les différentes documentation sur HTML et CSS.

Nous avons la possibilité d'injecter du code via la balise <script>.

Résulat de l'exemple ci-dessus
--------------------------------

.. image:: ../_images/dev/config_tpl/exemple_template.png
              :width: 400
              :alt: Exemple de template
              :align: center


Appel depuis le XML
--------------------------------

Le template sera enregistré au format mst. Pour l'appeler dans la configuration mviewer au niveau de la layer, il faut le bon format ``infoformat="application/vnd.ogc.gml"`` et ajouter un appel au mst via une balise template au sein du layer ``<template url=""/>``.