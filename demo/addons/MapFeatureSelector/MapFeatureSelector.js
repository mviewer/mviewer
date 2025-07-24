const COMPONENT_ID = "MapFeatureSelector";
const OPTIONS = mviewer.customComponents[COMPONENT_ID].config.options;

$(document).ready(function () {
  let customLayer = null;
  let selectionEnabled = true; // Sélection activée par défaut
  let drawEnabled = false;
  let selectedFeatures = [];
  let drawInteraction;

  // Style original des éléments
  const originalStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: "rgba(255, 255, 255, 0.1)" }),
    stroke: new ol.style.Stroke({ color: "rgb(255,255,255)", width: 0 }),
  });

  // Créer une couche personnalisée
  function createCustomLayer() {
    if (!customLayer) {
      customLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: OPTIONS.dallage_geojson_url,
          format: new ol.format.GeoJSON(),
        }),
        style: originalStyle,
      });
      mviewer.getMap().addLayer(customLayer);
    }
  }

  // Supprimer la couche personnalisée
  function removeCustomLayer() {
    if (customLayer) {
      mviewer.getMap().removeLayer(customLayer);
      customLayer = null;
    }
  }

  // Basculer la visibilité du panel
  function toggle() {
    const MapFeatureSelectorVisible = $("#MapFeatureSelector").is(":visible");
    $("#statsbtn").toggleClass("active", !MapFeatureSelectorVisible);
    $("#MapFeatureSelector").toggle(!MapFeatureSelectorVisible);
    MapFeatureSelectorVisible ? removeCustomLayer() : createCustomLayer();
  }

  // Mettre à jour le compteur de sélection
  function updateSelectionCount() {
    document.getElementById(
      "selectionCount"
    ).innerText = `Sélectionné(s): ${selectedFeatures.length}`;
  }

  // Appliquer le style à une fonctionnalité sélectionnée
  function applyStyle(feature, isSelected) {
    feature.setStyle(
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: isSelected ? "rgba(128, 128, 128, 0.5)" : "rgba(255, 255, 255, 0)",
        }),
        stroke: new ol.style.Stroke({ color: "#ffcc33", width: 2 }),
      })
    );
  }

  // Réinitialiser le style d'une fonctionnalité
  function resetStyle(feature) {
    feature.setStyle(originalStyle);
  }

  // Effacer la sélection
  function clearSelection() {
    selectedFeatures.forEach((feature) => resetStyle(feature));
    selectedFeatures = [];
    updateSelectionCount();
  }

  // Ajouter une interaction de dessin
  function addDrawInteraction() {
    drawInteraction = new ol.interaction.Draw({
      source: new ol.source.Vector(),
      type: "Polygon",
    });

    drawInteraction.on("drawend", function (event) {
      const polygon = event.feature.getGeometry();
      mviewer
        .getMap()
        .getLayers()
        .forEach((layer) => {
          const features = layer.getSource().getFeatures
            ? layer.getSource().getFeatures()
            : [];
          features.forEach((feature) => {
            if (polygon.intersectsExtent(feature.getGeometry().getExtent())) {
              if (!selectedFeatures.includes(feature)) {
                selectedFeatures.push(feature);
                applyStyle(feature, true);
              }
            }
          });
        });

      setTimeout(() => {
        selectedFeatures.pop(); // Remove the last element added by the draw interaction
        updateSelectionCount();
        //console.log("Selected features:", selectedFeatures);
      }, "100");
      toggleDrawing(false); // Arrêter le dessin après la fin
    });

    mviewer.getMap().addInteraction(drawInteraction);
  }

  // Basculer l'état du dessin
  function toggleDrawing(enable) {
    drawEnabled = enable;
    const startDrawingButton = document.getElementById("startDrawing");
    if (enable) {
      addDrawInteraction();
      startDrawingButton.classList.add("pressed");
    } else {
      mviewer.getMap().removeInteraction(drawInteraction);
      startDrawingButton.classList.remove("pressed");
    }
  }

  // Télécharger la sélection en CSV
  function downloadCSV() {
    const fields_arr = OPTIONS.fields.split(",");
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `${OPTIONS.fields}\n`; // Table headers
    selectedFeatures.forEach((feature) => {
      const properties = feature.getProperties();
      fields_arr.forEach((f) => {
        csvContent += properties[f];
        csvContent += ",";
      });
      csvContent = csvContent.slice(0, -1); // rm last comma
      csvContent += "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selection.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }

  // Créer et ajouter un bouton pour afficher le panel
  var _btn = document.createElement("button");
  _btn.className = "btn btn-light";
  _btn.title = "Sélection des entités";
  _btn.innerHTML = '<i class="ri-map-pin-range-line"></i>';
  _btn.addEventListener("click", toggle);
  document.getElementById("toolstoolbar").appendChild(_btn);

  setTimeout(function () {
    // Initialiser jquery.easyDrag sur le panneau des statistiques
    $("#MapFeatureSelector").easyDrag();

    // Rendre la zone d'en-tête de la fenêtre mobile
    $(".selectorHeader").css("cursor", "move").easyDrag({
      handle: ".selectorHeader",
    });

    // Ajouter des écouteurs d'événements aux boutons du panel
    document.getElementById("startDrawing").addEventListener("click", function () {
      if (drawEnabled) {
        toggleDrawing(false); // Cancel drawing if already enabled
      } else {
        toggleDrawing(true); // Start drawing if not enabled
      }
    });

    document.getElementById("downloadSelection").addEventListener("click", function () {
      downloadCSV();
    });

    document.getElementById("clearSelection").addEventListener("click", function () {
      clearSelection();
    });

    document
      .getElementById("closeMapFeatureSelector")
      .addEventListener("click", function () {
        $("#MapFeatureSelector").hide();
        removeCustomLayer(); // Supprimer la couche personnalisée lors de la fermeture du panneau
      });

    // Ajouter un événement de clic sur la carte pour sélectionner des fonctionnalités
    mviewer.getMap().on("click", function (evt) {
      if (!selectionEnabled || drawEnabled) return;

      const clickedFeature = mviewer
        .getMap()
        .forEachFeatureAtPixel(evt.pixel, (feature, layer) => ({ feature, layer }));
      if (clickedFeature && clickedFeature.feature) {
        const feature = clickedFeature.feature;
        const index = selectedFeatures.indexOf(feature);
        if (index === -1) {
          selectedFeatures.push(feature);
          applyStyle(feature, true);
        } else {
          selectedFeatures.splice(index, 1);
          resetStyle(feature);
        }
        updateSelectionCount();
      }
    });
  }, 3000);
});
