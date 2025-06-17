# Visualisation réelle de coordonnées - Street View

Cette extension permet à l'utilisateur d'ouvrir **Google Street View** centré sur les dernières coordonnées cliquées sur la carte.

L'objectif est de visualiser immédiatement l'environnement réel du point sélectionné.

## Configuration du fichier XML

Pour intégrer cette extension à votre **application**, ajoutez simplement le code ci-dessous :

``` xml
<extensions>
    <extension type="component" id="streetview" path="demo/addons"/>
</extensions>
```

Une fois la configuration effectuée, un nouveau bouton **Street View** apparaît dans la barre d'outils se situant à droite de l'application.

## Guide d'utilisation

- 1 - Cliquez n'importe où sur la carte pour sauvegarder des coordonnées

- 2 - Cliquez ensuite sur le bouton `Street View` dans la barre d'outils (à droite de l'application)

> Cela ouvrira une nouvelle fenêtre affichant **Google Street View** centrée sur les dernières coordonnées enregistrées.