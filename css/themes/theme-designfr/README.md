# Thème Design.fr

Dans le cadre d'un projet avec l'ARS Ile-de-France, un thème Mviewer a été développé, reprenant la nouvelle identité visuelle de l'état, [le Système de Design de l'état](https://www.systeme-de-design.gouv.fr/). Ce thème s'adresse aux développeurs et aux concepteurs, qu'ils soient agents publics ou prestataires pour des sites Internet de l'État (Ministères, Administrations centrales, Préfectures, Ambassades, etc.). Il permet d'apporter une cohérence graphique avec les sites institutionnels. 
![image](https://user-images.githubusercontent.com/22764056/192546099-ee1b3014-20d9-469a-a049-6cb753a07700.png)

Le thème reprend tous les codes et principes de la marque de l'Etat et recommandés par le système de Design (DSFR). Pour des raisons techniques, les composants d'interface n'ont pas été remplacé par ceux proposés par la librairie DSFR mais sont stylisés dans le même esprit. Toutefois, la librairie est intégrée au thème, il est donc possible de mobiliser des [élements d'interface](https://www.systeme-de-design.gouv.fr/elements-d-interface) dans la page d'accueil, les customcontrols ou dans les templates (voir ci-dessous).


## Intégration du thème dans une application
Pour mobiliser ce thème au sein d'une application mviewer, veuillez configurer le fichier .XML comme ci-dessous :

    <application
    logo="css/themes/theme-designfr/repfr-logo.png"
    favicon="css/themes/theme-designfr/dsfr-v1.6.0/dist/favicon/favicon.ico"
    style="css/themes/theme-designfr/theme_designfr.css"
    />

Les ressources du thème sont localisées dans le dossier `css/themes/theme-designfr`: 
 - `dsfr-v1.6.0/` : Librairie des composants DSFR *(fonts, favicon, css, js)* 
 - `repfr-logo.png` : Logo de la République Française
 - `theme_designfr.css` :  Feuille de style .css surchargeant le thème initial mviewer et permettant de styliser l'interface selon la marque de l'Etat.


**Attention : Il ne faut pas modifier les fichiers du thème.**

### Optionnel
Si vous souhaitez mobiliser des [éléments d'interface](https://www.systeme-de-design.gouv.fr/elements-d-interface) disponibles au sein de la librairie DSFR dans votre page d'accueil, templates ou customcontrols, veuillez insérer les scripts associés au sein de votre application sous forme d'extensions mviewer :


    <extensions>
    <extension  type="javascript"  src="css/themes/theme-designfr/dsfr-v1.6.0/dist/dsfr.module.min.js"/>
    <extension  type="javascript"  src="css/themes/theme-designfr/dsfr-v1.6.0/dist/dsfr.nomodule.min.js"/>
    </extensions>




