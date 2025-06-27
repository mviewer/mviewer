//------------------- CONSTANTES ET UTILITAIRES -----------------
// 🎨 Styles par défaut appliqués aux entités géographiques (EPCI, communes, SCOT).
// Chaque style est défini par une couleur et une largeur de trait.
const defaultStyles = {
  epci: new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "black", width: 3 }),
  }),
  communes: new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "black", width: 3 }),
  }),
  scot: new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "black", width: 3 }),
  }),
};

// 🌐 Configuration des sources de données WFS
const dataSources = {
  epci: {
    url: "https://www.geo2france.fr/geoserver/spld/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=epci&outputFormat=application/json&srsname=EPSG:3857",
    property: "code_epci",
    style: defaultStyles.epci,
  },
  communes: {
    url: "https://www.geo2france.fr/geoserver/spld/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=communes&outputFormat=application/json&srsname=EPSG:3857",
    property: "insee_com",
    style: defaultStyles.communes,
  },
  scot: {
    url: "https://qgisserver.hautsdefrance.fr/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/data/qgis/applications/sraddet_2024_11.qgz&service=WFS&version=1.0.0&request=GetFeature&typeName=scot_synth_2024_11&outputFormat=application/json&srsname=EPSG:3857",
    property: "idurba_scot_synth",
    style: defaultStyles.scot,
  },
};

// 🛠️ Fonction pour récupérer des données JSON à partir d'une URL
async function fetchJson(url) {
  console.log("📡 Récupération des données depuis:", url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`❌ Erreur réseau: ${response.statusText} (${response.status})`);
    }
    const data = await response.json();
    console.log("✅ Données récupérées avec succès:", data);
    return data;
  } catch (error) {
    console.error("⚠️ Erreur lors de la récupération des données:", error);
    throw error;
  }
}

// 🖌️ Fonction pour ajouter une surbrillance sur une zone spécifique
function highlightZone(zoneGeometry) {
  const mapExtent = ol.proj.get('EPSG:3857').getExtent();
  const outerRing = ol.geom.Polygon.fromExtent(mapExtent);

  let innerRingCoordinates;

  // Vérification du type de géométrie
  if (zoneGeometry.getType() === 'Polygon') {
    innerRingCoordinates = zoneGeometry.getCoordinates()[0]; // Premier anneau
  } else if (zoneGeometry.getType() === 'MultiPolygon') {
    // Extraction du premier polygone dans un MultiPolygon
    innerRingCoordinates = zoneGeometry.getCoordinates()[0][0];
  } else {
    console.error('❌ Type de géométrie non supporté pour la surbrillance :', zoneGeometry.getType());
    return;
  }

  // Ajout d’un trou correspondant à la géométrie sélectionnée
  const highlightPolygon = new ol.geom.Polygon(outerRing.getCoordinates());
  highlightPolygon.appendLinearRing(new ol.geom.LinearRing(innerRingCoordinates));

  const highlightSource = new ol.source.Vector({
    features: [new ol.Feature({ geometry: highlightPolygon })],
  });

  const highlightLayer = new ol.layer.Vector({
    source: highlightSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.5)', // Blanc semi-transparent
      }),
    }),
  });

  mviewer.getMap().addLayer(highlightLayer);

  mviewer.getMap().getView().fit(zoneGeometry.getExtent(), {
    size: mviewer.getMap().getSize(),
    maxZoom: 16,
    duration: 1000,
  });
}

// 📦 Fonction pour charger des entités depuis une source, appliquer un filtre et les afficher sur la carte
async function loadAndFilterFeatures(keys, config) {
  const { url, property, style } = config;
  console.log("⚙️ Chargement des données avec configuration:", config);

  try {
    let features;

    if (property === "idurba_scot_synth") {
      console.log("🟢 Filtrage côté client pour QGIS Server");
      const data = await fetchJson(url);
      const allFeatures = new ol.format.GeoJSON().readFeatures(data);
      features = allFeatures.filter((feature) =>
        keys.includes(feature.get(property))
      );
    } else {
      console.log("🔵 Filtrage côté serveur pour GeoServer");
      const cqlFilter = keys.map((key) => `${property}='${key}'`).join(' OR ');
      const filteredUrl = `${url}&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;
      const data = await fetchJson(filteredUrl);
      features = new ol.format.GeoJSON().readFeatures(data);
    }

    if (features.length === 0) {
      console.warn(`⚠️ Aucun élément trouvé pour les clés fournies (${keys.join(", ")}).`);
      return;
    }

    const filteredSource = new ol.source.Vector({ features });
    const customLayer = new ol.layer.Vector({ source: filteredSource, style });
    mviewer.getMap().addLayer(customLayer);

    const extent = ol.extent.createEmpty();
    features.forEach((feature) =>
      ol.extent.extend(extent, feature.getGeometry().getExtent())
    );

    // Mise en surbrillance de la première géométrie
    highlightZone(features[0].getGeometry());
  } catch (error) {
    console.error(`❌ Erreur lors du chargement et du filtrage des entités:`, error);
  }
}

// 🔗 Fonction pour extraire et parser les valeurs d'un paramètre spécifique depuis l'URL
function getKeysFromUrl(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValues = urlParams.get(param);
  if (!paramValues) return [];
  const keys = [...new Set(paramValues.split(",").map((key) => key.trim()))];
  if (keys.length > 1) {
    console.warn(
      `⚠️ Le nombre de clés dépasse la limite autorisée (2). Aucun élément ne sera affiché.`
    );
    return [];
  }
  console.log(`🔑 Clés récupérées pour le paramètre ${param}:`, keys);
  return keys;
}

// 🔄 Fonction principale pour gérer les données en fonction des paramètres d'URL.
function handleDataFromUrl() {
  const keys = {
    communes: getKeysFromUrl("communes"),
    epci: getKeysFromUrl("epci"),
    scot: getKeysFromUrl("scot"),
  };

  if (keys.communes.length > 0) {
    console.log("🔵 Priorité aux communes.");
    loadAndFilterFeatures(keys.communes, dataSources.communes);
    return;
  }

  if (keys.epci.length > 0) {
    console.log("🟢 Priorité aux EPCI.");
    loadAndFilterFeatures(keys.epci, dataSources.epci);
    return;
  }

  if (keys.scot.length > 0) {
    console.log("🟣 Chargement des SCOT.");
    loadAndFilterFeatures(keys.scot, dataSources.scot);
  }
}

// 🚀 Point d'entrée principal : initialisation de la logique d'affichage.
handleDataFromUrl();
