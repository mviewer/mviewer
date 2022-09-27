# Catalogue des démonstrations Mviewer

Le catalogue propose des exemples de fonctionnalités pouvant être mobilisées dans l'application mviewer. Il est possible de visualiser l'exemple en live *(Démo)* et de visualiser le fichier de configuration `.XML` *(Code)*. L'ensemble des exemples est disponible dans le dossier `mviewer/demo`. 

## 1. Fonctionnement du catalogue
Le catalogue est construit autour d'une page HTML `index.html` et d'un template MST  `demo/catalogue/template/catalogue.mst` pour la création des `cards` à la volée. Les informations des différents exemples sont indiquées dans le fichier `demo/catalogue/data.json`.
De plus, une barre de recherche a été ajoutée permettant de filtrer les exemples.

Les ressources du catalogue sont localisées dans les dossiers suivants : 
 - `catalogue/css/` : Dossier contenant les feuilles de style .css
 - `catalogue/img/` : Dossier contenant les images
 - `catalogue/js/` :  Dossier contenant les scripts javascript pour les fonctionnalités du catalogue (barre de recherche et génération des cards)
 - `catalogue/template/` : Dossier contenant le template .mst 


**Attention : Il ne faut pas modifier les fichiers `index.html` et `catalogue.mst`**


## 2. Ajouter un exemple de fonctionnalité

Pour ajouter une nouvelle démonstration, il faut renseigner les informations dans le fichier `data.json`: 

 1. Ouvrir `catalogue/data.json` dans un éditeur  
 2. A la suite des exemples existants, ajouter votre démonstration comme ci-dessous en
    respectant les champs indiqués :  
   {  
		"id":"1",  
		"title": "GéoBretagne",  
		"words": "flux, Géobretagne, WMS, flux",  
		"tags": "Géobretagne, WMS",  
		"description":"Exemple exploitant uniquement des flux GéoBretagne pour les fonds cartographiques et pour les thématiques.",  
		"level":"simple",  
		"url_source":"../demo/geobretagne.xml",  
		"url_demo":"../?config=demo/geobretagne.xml"  
	}  

`id` : identifiant unique pour les exemples   
`title` : Titre de l'exemple  
`words` : Mots clés à utiliser pour la recherche  
`tags` : Mots clés représentant la démonstration (technologies utilisées, concept)  
`description` : Texte de description de l'exemple  
`level `: Niveau de difficulté `simple` | `intermédiaire` | `avancé` *(veuillez respecter la casse et les accents)*  
`url_source` : lien vers le fichier de configuration .xml   
`url_demo` : lien vers l'application mviewer en ligne représentant l'exemple  


