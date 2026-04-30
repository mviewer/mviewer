.. Authors :
.. mviewer team

.. _secruity_scan:

Scan de sécurité
================

Cette page décrit le scan de sécurité JavaScript intégré au dépôt.
Le scan repose sur `Retire.js <https://retirejs.github.io/retire.js/>`_ et sur
le script ``scans/security-audit.js``.

Objectif
--------

Le scan permet de :

- détecter les bibliothèques JavaScript connues par Retire.js ;
- identifier les versions détectées dans les fichiers du dépôt ;
- remonter les vulnérabilités connues, leur sévérité et les CVE associées lorsqu'elles existent ;
- générer un rapport texte exploitable en local et dans GitHub Actions.

Exécution locale
----------------

Prérequis :

- Node.js 24 ;
- les dépendances du projet installées.

Depuis la racine du dépôt ::

    npm ci
    npm run scan

La commande ``npm run scan`` exécute le script ``scans/security-audit.js``.

Fichiers générés
----------------

L'exécution locale produit deux fichiers à la racine du dépôt :

- ``retire-develop.json`` : sortie JSON brute de Retire.js ;
- ``security-report.txt`` : rapport texte généré à partir du JSON.

Le rapport contient notamment :

- un résumé exécutif ;
- un tableau détaillé avec le nom du composant, le fichier source, la version détectée,
  le statut de vulnérabilité, le niveau de risque, les CVE et l'action recommandée ;
- la liste des scripts HTML détectés ;
- des recommandations générales.

Workflow GitHub Actions
-----------------------

Le workflow ``.github/workflows/security-audit.yml`` exécute le même scan :

- sur chaque ``push`` vers la branche ``develop`` ;
- chaque lundi via une planification hebdomadaire.

Dans GitHub Actions :

- ``npm ci`` installe les dépendances ;
- ``npm run scan`` lance l'audit ;
- le rapport est généré avec un nom daté :
  ``security-report-YYYY-MM-DD.txt`` ;
- le rapport est publié comme artefact ``security-audit-report``.

Personnalisation
----------------

Le script accepte plusieurs variables d'environnement utiles :

- ``REPORT_DATE`` : date affichée dans le rapport ;
- ``REPORT_BASENAME`` : nom du fichier de rapport ;
- ``REPORT_FILE`` : chemin complet du rapport généré ;
- ``RETIRE_OUTPUT_FILE`` : chemin du JSON produit par Retire.js.

En local, le comportement par défaut est :

- ``security-report.txt`` pour le rapport ;
- ``retire-develop.json`` pour la sortie brute Retire.js.

Dans GitHub Actions, le workflow force un nom daté pour le rapport généré.

Limites
-------

Ce scan reste un audit automatisé de premier niveau.

- Retire.js ne couvre que les signatures et vulnérabilités qu'il connaît ;
- certaines vulnérabilités dépendent du contexte d'usage de la bibliothèque ;
- les bundles minifiés ou fortement transformés peuvent limiter la détection ;
- un résultat ``Non`` ne remplace pas une revue de sécurité manuelle.

Pour les cas ambigus, le fichier ``retire-develop.json`` doit être utilisé comme
source de vérité technique, puis complété si nécessaire par une analyse manuelle.

Scan RGAA statique
==================

Le dépôt contient également un scan RGAA statique destiné à détecter certains
problèmes d'accessibilité directement dans les fichiers HTML, les templates et
les fragments HTML générés dans le JavaScript.

Le scan repose sur :

- le fichier ``scans/rgaa_criteres_ara.csv`` ;
- le script ``scans/rgaa-scan.js`` ;
- la commande ``npm run scan:rgaa``.

Origine des critères
--------------------

Les critères listés dans ``scans/rgaa_criteres_ara.csv`` proviennent d'ARA,
l'outil d'audit rapide d'accessibilité porté par les services numériques de
l'État. Le CSV conserve les liens vers :

- le référentiel RGAA officiel :
  https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/ ;
- la source ARA utilisée pour qualifier les types d'audit :
  https://github.com/DISIC/Ara/blob/main/confiture-web-app/src/criteria.ts.

Le script n'automatise que les critères pouvant être vérifiés, totalement ou
partiellement, par une analyse statique du code source. Les autres critères RGAA
nécessitent une vérification manuelle.

Périmètre contrôlé
------------------

Le scan parcourt les fichiers pouvant contenir du HTML :

- les pages ``.html`` et ``.htm`` ;
- les templates ``.mst``, ``.tpl`` et ``.mustache`` ;
- les chaînes JavaScript qui contiennent des fragments HTML.

Certains répertoires sont ignorés par défaut, notamment ``demo``, ``lib``,
``node_modules``, ``dist``, ``build`` et ``coverage``.

Exécution locale
----------------

Depuis la racine du dépôt ::

    npm ci
    npm run scan:rgaa

Par défaut, le rapport est affiché au format texte dans la sortie standard.
Pour générer un rapport JSON ::

    npm run scan:rgaa -- --format json --output mviewer-rgaa-report.json

Options utiles :

- ``--format json`` : produit un rapport JSON ;
- ``--output <fichier>`` : écrit le rapport dans un fichier ;
- ``--root <répertoire>`` : limite le scan à un répertoire ;
- ``--csv <fichier>`` : utilise un fichier de critères spécifique ;
- ``--fail-on-issues`` : termine avec un code d'erreur si des anomalies sont détectées.

Workflow GitHub Actions
-----------------------

Le workflow ``.github/workflows/rgaa-scan.yml`` génère automatiquement le
rapport RGAA :

- sur les ``pull_request`` qui modifient les fichiers contrôlés ;
- sur les ``push`` vers ``develop`` ;
- manuellement via ``workflow_dispatch``.

Le workflow exécute ::

    npm run scan:rgaa -- --format json --output mviewer-rgaa-report.json

Le fichier ``mviewer-rgaa-report.json`` est publié comme artefact GitHub Actions
téléchargeable sous le nom ``mviewer-rgaa-report.json``.

Limites
-------

Ce scan RGAA est un outil d'aide à l'audit. Il ne remplace pas un audit RGAA
manuel.

- les critères marqués ``partiel`` reposent sur des heuristiques ;
- la pertinence d'un texte alternatif, d'un intitulé ou d'une structure ne peut
  pas toujours être validée automatiquement ;
- les contenus générés dynamiquement à l'exécution peuvent échapper au scan ;
- un rapport sans anomalie ne garantit pas la conformité RGAA complète.
