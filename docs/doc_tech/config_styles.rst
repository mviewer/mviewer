.. Authors :
.. mviewer team

.. _configstyles:

Configurer - Les styles utilisés pour la mise en surbrillance des entités sélectionnées
=======================================================================================

Principe
--------

Les styles sont définis par défaut dans l'application. Il existe un style pour la **sélection** et un style pour la **sous-sélection**.
Chaque style définit la répresentation sur la carte des entités de type **point**, **ligne** et **polygone**

Afin de personnaliser ces styles, il faut ajouter un noeud ``styles`` au même niveau que les noeuds ``application``, ``baselayers``...

**Exemple de configuration complète**

.. code-block:: xml
       :linenos:

	<styles>
            <selectionstyle>
                <point radius="7" fillcolor="26, 188, 156" opacity="0.5" strokecolor="26, 188, 156" strokewidth="4" />
                <line opacity="0.5" strokecolor="26, 188, 156" strokewidth="4" />
                <polygon fillcolor="26, 188, 156" opacity="0" strokecolor="26, 188, 156" strokewidth="4" />
            </selectionstyle>
            <subselectionstyle>
                <point radius="7" fillcolor="175, 122, 197" opacity="0.5" strokecolor="175, 122, 197" strokewidth="2" />
                <line opacity="0.5" strokecolor="175, 122, 197"  strokewidth="2" />
                <polygon fillcolor="175, 122, 197" opacity="0" strokecolor="175, 122, 197" strokewidth="8" />
            </subselectionstyle>
        </styles>


**Exemple de configuration plus légère**

.. code-block:: xml
       :linenos:

	<styles>
            <selectionstyle>
                <polygon opacity="0" strokewidth="4" />
            </selectionstyle>
            <subselectionstyle>
                <polygon opacity="0" strokewidth="8" />
            </subselectionstyle>
        </styles>
