# 🚀 Custom Component - MViewer Integration

[![forthebadge](https://forthebadge.com/images/badges/built-with-swag.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)](https://forthebadge.com)

Bienvenue dans le Custom Component MViewer 🎉 ! Ce composant est conçu pour ajouter une interaction transparente entre votre tableau de bord Apache Superset et MViewer. Il permet d'envoyer des filtres depuis Superset vers MViewer via l'URL. Simple et efficace ! 😎

**DEMO** : [Tableau de bord de la consommation ENAF à partir d'OCS2D](https://www.geo2france.fr/superset/superset/dashboard/conso-enaf/)

# Gestion des Entités Géographiques sur une Carte

## 🚀 Description Générale

Ce projet implémente une solution pour afficher des entités géographiques (SCoT, EPCI, communes) sur une carte interactive en se basant sur des paramètres passés dans l'URL. Il utilise la bibliothèque OpenLayers pour gérer les données géographiques et manipuler les couches affichées sur la carte.

---

## 🧰 Fonctionnalités Principales

1. **Chargement des entités géographiques** depuis des sources WFS.
2. **Application de styles personnalisés** pour chaque type d'entité.
3. **Filtrage dynamique des entités géographiques** basé sur des paramètres d'URL.
4. **Affichage et surbrillance des entités sélectionnées** pour améliorer l'expérience utilisateur.

---

## 🛠️ Fonctionnement Technique

### **1. Sources de Données**

Les données géographiques sont récupérées à partir de services Web WFS (`Web Feature Service`). Ces services permettent de fournir des entités géographiques en format GeoJSON.

Les sources de données configurées sont :

- **EPCI** : Entités publiques intercommunales.
- **Communes** : Municipalités locales.
- **SCOT** : Schémas de cohérence territoriale.

Chaque source inclut :

- Une URL WFS.
- Un attribut utilisé pour filtrer les données.
- Un style spécifique défini via OpenLayers.

### **2. Gestion des Styles**

Chaque type d'entité a un style par défaut :

- Trait noir de 3 pixels de largeur.
- Styles personnalisables en modifiant les constantes.

### **3. Filtrage des Entités : Côté Client vs. Côté Serveur**

#### **Côté Client pour QGIS Server**

Pour certaines entités (par ex., SCOT), les données complètes sont récupérées en une fois depuis le serveur, puis filtrées localement dans le navigateur. Cette méthode est utilisée lorsqu'il n'est pas possible d'appliquer un filtre directement à la requête serveur.

#### **Côté Serveur pour GeoServer**

Pour les autres entités (par ex., communes, EPCI), les filtres sont appliqués directement à la requête envoyée au serveur en utilisant le paramètre `CQL_FILTER`. Ce filtre réduit les données récupérées à ce qui est strictement nécessaire.

> [!CAUTION]
>Le filtrage CQL pour les SCOTs ne fonctionnent pas car c'est un flux QGIS Server, il faut donc filtrer côté client.
---

### **4. Chargement et Filtrage des Données**

La fonction principale `loadAndFilterFeatures` :

1. Récupère les données d'une source WFS.
2. Applique un filtre :
   - **Côté serveur** : Utilisation d'une requête enrichie avec un filtre CQL.
   - **Côté client** : Filtrage des entités après récupération complète des données.
3. Affiche les entités filtrées sur la carte.

---

### **5. Gestion des Clés à partir de l'URL**

La fonction `getKeysFromUrl` permet d'extraire les valeurs de paramètres d'URL. Par exemple :

- `?communes=12345,67890` filtre les communes avec les codes 12345 et 67890.

Des règles spécifiques sont appliquées :

- Un maximum de deux clés est autorisé pour éviter des affichages trop complexes.

---

### **6. Surbrillance des Zones**

La fonction `highlightZone` ajoute une surbrillance sur la première entité récupérée :

- Elle crée un polygone avec un "trou" représentant la zone sélectionnée.
- Ajuste la vue de la carte pour centrer la géométrie sur l'écran.

---

## 📂 Structure du Code

- **`defaultStyles`** : Définition des styles par défaut des entités.
- **`dataSources`** : Configuration des sources de données WFS.
- **`fetchJson(url)`** : Fonction générique pour récupérer et parser des données JSON depuis une URL.
- **`highlightZone(zoneGeometry)`** : Ajoute une surbrillance à une zone spécifique.
- **`loadAndFilterFeatures(keys, config)`** : Filtre les entités et les affiche sur la carte.
- **`getKeysFromUrl(param)`** : Extrait les valeurs d'un paramètre d'URL.
- **`handleDataFromUrl()`** : Gère le flux principal pour charger et afficher les entités en fonction des paramètres d'URL.

---

## 🔗 Exemple d'Usage

Supposons que vous souhaitez afficher des communes spécifiques :

```url
https://votreapplication.com/?communes=12345
```

Le code :

1. Extrait les valeurs `12345` de l'URL.
2. Récupère les entités correspondantes depuis la source WFS des communes.
3. Affiche ces entités sur la carte avec les styles prédéfinis.

---

# Installation

## 🚧 Prérequis

Avant de commencer la configuration, assurez-vous d'avoir  :

- 🐍Apache Superset (version 4.0 ou supérieure)
- 🗺️ Mviewer (version 3.10 ou supérieure)

## 🛠️ 1. Configuration du code

Au début du fichier [cc_superset_ocs2d.js](./cc_superset_ocs2d.js) vous pouvez modifier librement la configuration de vos styles ou de vos différents flux wfs.

## 🛠️ 2. Configuration Mviewer

### 📍 Ajouter le Custom Component à MViewer

1. Copiez le dossier dans le dossier apps de votre projet MViewer. 📂

2. Ajoutez cette ligne à la fin du fichier de configuration de MViewer (`default.xml`) :

```xml
<extension type="component" id="cc_superset_ocs2d" path="./apps"/>
```

L'id correspond au nom du dossier

3. Vérifiez dans la console du navigateur (F12) si l'extension est bien chargée. Vous devriez voir :

```text
cc_superset_ocs2d is successfully loaded ✅
```

> ✔️ Bravo vous venez de rajouter votre Custom Component à MViewer

## 🖥️ 3. Configuration de Superset

### 🗺️ Intégration HandleBar pour Superset

Pour afficher une carte MViewer dans un tableau de bord Superset, créez un chart de type HandleBar :

1. Limitez les dimensions à etat_eolie et epci.

2. Dans l'onglet Personnaliser, ajoutez ce code HTML pour intégrer une carte MViewer dynamique :

```html
  <iframe width="800" height="500" style="border:none;" src="{https://{LIEN-CARTE}}/?epci={{#each data}}{{#if @last}}{{epci}}{{else}}{{epci}},{{/if}}{{/each}}&communes={{#each data}}{{#if @last}}{{codgeo}}{{else}}{{codgeo}},{{/if}}{{/each}}&scot={{#each data}}{{#if @last}}{{scot_synth}}{{else}}{{scot_synth}},{{/if}}{{/each}}&x=719675&y=7012000&z=8&l=ocs2d_com_hdf_2005_2010_2015_2021*ocs2d_cs_niv3_com&lb=osmgp1&config=apps/ocs2d_test.xml&mode=u"></iframe>
  ```

Cette iframe affiche votre carte MViewer avec les filtres appliqués en fonction des données sélectionnées dans le tableau de bord.

- Les `{{#each data}}` permettent de parcourir chaque element.
- Les `{{if}}` permettent de séparer chaque élément par des virgules.

> ✔️ Vous êtes désormais prêt à ajouter des cartes Mviewer à vos tableaux de bord.

<img align="center" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTQ3YmE2ZjdjMzZkODU3YTM0ODRkMjY1NmJiNjQ3YTFmZDk2ZWIyZCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/VbnUQpnihPSIgIXuZv/giphy.gif" width="auto" height="75" />
