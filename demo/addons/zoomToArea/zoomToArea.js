const zoomToArea = function () {
  /**
   * Plugin's config
   */
  const getId = () => configuration.getConfiguration()?.application["id"];
  const getAppEPSG = () => mviewer.getMap().getView().getProjection().getCode();
  let config = () => mviewer.customComponents.zoomToArea.config;
  let options = () => config()?.options?.mviewer[getId()];

  // Add loader during loading data
  $(".navbar-right").prepend(
    `<li><div id="loadingIndicator-zoomToArea">
        <div class="loader">Loading...</div>
    </div></li>`
  );

  /**
   * Create options to selectorAreas
   * @param {Array} areasData as data features areas
   * @param {string} nameArea as field name of area name
   * @param {string} idArea as field name of area id
   */
  function createSelectorArea(areasData, nameArea, idArea) {
    // Init select
    $(".navbar-right").prepend(
      `<li><select class="form-select" name="zoomAreaSelector" id="zoomAreaSelector">
          <option value="">
          ${options().selectLabel}
          </option>
        </select></li>`
    );
    // Add areas options to select
    const selector = document.getElementById("zoomAreaSelector");
    for (const area of areasData) {
      var opt = document.createElement("option");
      opt.textContent = area.properties[nameArea];
      opt.value = area.properties[idArea];
      selector.appendChild(opt);
    }
  }

  /**
   * Zoom to select area extend
   * @param {Array} data as data json
   * @param {string} idArea as field name of area id
   * @param {string} valueAreaSelected as option value of the selected area
   */
  function zoomToGeomArea(data, idArea, valueAreaSelected) {
    let features = new ol.format.GeoJSON({
      dataProjection: options()?.dataEPSG,
      featureProjection: getAppEPSG(),
    }).readFeatures(data);
    let areaSelected = features.filter(
      (e) => e.getProperties()[idArea] == valueAreaSelected
    );
    let geometry = areaSelected[0].getGeometry().getExtent();
    // Create buffer
    let extendBuffer = new ol.extent.buffer(geometry, options()?.bufferSize);
    mviewer.getMap().getView().fit(extendBuffer, {
      duration: 3000,
    });
  }

  /**
   * Get data and start plugin
   * @param {string} dataUrl as link to geojson data of areas
   */

  fetch(options()?.dataUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Data success
      const areasData = data.features;
      // Sort data by attribute
      let sortAreasData = _.sortBy(areasData, [
        function (feature) {
          return feature.properties[options()?.fieldSortBy];
        },
      ]);
      createSelectorArea(
        sortAreasData,
        options()?.fieldNameAreas,
        options()?.fieldIdAreas
      );
      document.getElementById("loadingIndicator-zoomToArea").style.display = "none";
      // Select Event
      const selectArea = document.getElementById("zoomAreaSelector");
      selectArea.addEventListener("change", (event) => {
        if (event.target.value != "") {
          zoomToGeomArea(data, options()?.fieldIdAreas, event.target.value);
        }
      });
    })
    .catch((error) => console.log("Error no areas data"));
};

new CustomComponent("zoomToArea", zoomToArea);
