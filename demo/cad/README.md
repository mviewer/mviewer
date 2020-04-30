##Serveur WFS à utiliser :
https://geobretagne.fr/geoserver/cadastre/wfs


Paramètres communs à toutes les requêtes

{
    "SERVICE": "WFS",
    "VERSION": "2.0.0",
    "REQUEST": "GetFeature",
    "outputFormat": "application/json",
    "srsName": "EPSG:4326"
    
    
}

## requete pour récupérer liste des communes

paramètres communs à toutes les requetes



Paramètres spécifiques
{
    
    "TYPENAME": "CP.CadastralZoningLevel1",
    "PROPERTYNAME": "nom_commune,geo_commune,departement",
    
}

Exemple
https://geobretagne.fr/geoserver/cadastre/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=CP.CadastralZoningLevel1&PROPERTYNAME=nom_commune,geo_commune,departement&outputFormat=application/json&srsName=EPSG:4326

https://geobretagne.fr/geoserver/cadastre/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=CP.CadastralZoningLevel1&PROPERTYNAME=nom_commune,geo_commune,departement&CQL_FILTER=departement%3D%2735%27&outputFormat=application/json&srsName=EPSG:4326



##requete pour récupérer la liste des sections d'une commune 350120

Paramètres spécifiques
{
    
    "TYPENAME": "CP.CadastralZoning",
    "CQL_FILTER": "geo_commune='350120'"
    
}

Exemple 

https://geobretagne.fr/geoserver/cadastre/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=CP.CadastralZoning&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=geo_commune%3D%27350120%27


##requete pour récupérer la liste des parcelle d'une section (350120000AM)

Paramètres spécifiques
{
    
    "TYPENAME": "CP.CadastralParcel",
    "CQL_FILTER": "geo_section='350120000AM'"
    
}

Exemple 

https://geobretagne.fr/geoserver/cadastre/wfs?service=WFS&Version=2.0.0&request=GetFeature&typeName=cadastre:CP.CadastralParcel&count=5&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=geo_section%3D%27350120000AM%27


##requete pour télécharger une parcelle grace à son identifiant

Paramètres spécifiques
{
    
    "TYPENAME": "CP.CadastralParcel",
    "CQL_FILTER": "inspireid='FR35120000AM0165'"
    
}

Exemple

https://geobretagne.fr/geoserver/cadastre/wfs?service=WFS&Version=2.0.0&request=GetFeature&typeName=cadastre:CP.CadastralParcel&count=5&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=inspireid%3D%27FR35120000AM0165%27