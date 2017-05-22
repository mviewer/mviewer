.. Authors : 
.. mviewer team

.. _configtpl:

Configurer - Templates
=========================


Personnalisation de la fiche d'information

Pour les couches de type vecteur et WMS, il est possible de définir un template afin de formater côté client, la fiche d'information des entités sélectionnées.
Le moteur de template (logic less) utilisé est Mustache : https://github.com/janl/mustache.js
La structure du template est la suivante  les éléments en rouge sont obligatoires:

.. code-block:: xml
       :emphasize-lines: 1,7
       :linenos:
       
       
        {{#features}}
            <li class="item">
                Exemple de formatage
                <b> Nom : {{name}} </b>
                Montant : {{prix}} €
            </li>	
        {{/features}}

Explications : ``{{#features}}{{/features}}`` est une boucle effectuée sur chaque entité présente dans la couche sélectionnée.
``<li class="item"></li>`` est une entrée de liste html utilisée par le mviewer. S'il y a plusieurs entrées de liste car plusieurs entités sélectionnées, le mviewer présentera les réponses sous la forme d'un carousel.

Ce qu'il faut savoir de Mustache. 
- On fait référence à la valeur d'un champ de cette façon : ``{{champ}}``.
Il est possible de gérer une absence de valeur ou une valeur false de cette façon : 

.. code-block:: xml
       :linenos:
       
        {{#champ2}}
            Ce texte s'affiche si champ2 contient une valeur ou est différent de false.
        {{/champ2}}

La finalité du template est ici de fabriquer un contenu formaté HTML. Il est tout à fait possible d'injecter dans le template des balises <STYLE> ou <SCRIPT>.