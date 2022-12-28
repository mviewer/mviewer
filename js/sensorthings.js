class Sensorthings {
  constructor(config) {
    this.config = config;
    this.layer = new ol.layer.Vector({});
    this.template = mviewer.templates.ctrlSensor;
    this.customControl = document.querySelector(`#sensorthings-list-${config.id}`);
    this.selectedStreams = [];
    this.initLayer();
  }

  setTemplate(template) {
    this.template = template;
  }

  setConfig(values) {
    this.config = { ...this.config, ...values };
  }

  setSelectedStreams(ids) {
    this.selectedStreams = ids;
  }

  setCustomStyle(style) {
    if (style) {
      this.layer.setStyle(style);
    }
  }
  setMviewerStyle(styleName) {
    if (styleName && mviewer.featureStyles[this.config.style]) {
      this.layer.setStyle(mviewer.featureStyles[this.config.style]);
    }
  }
  setVectorSource(features = []) {
    this.layer.setSource(
      new ol.source.Vector({
        features: features,
      })
    );
  }

  getConfigValue(value) {
    return this.config[value];
  }

  getFeatures() {
    return this.layer.getSource().getFeatures();
  }

  setDatastream(datastreams, feature) {
    this.datastreams = datastreams.map((x) => ({
      ...x,
      id: x["@iot.id"],
      url: this.getConfigValue("url"),
      feature: feature,
      idLayer: this.getConfigValue("id"),
    }));
  }

  setMultiDatastreams(multiDatastreams, feature) {
    this.multiDatastreams = multiDatastreams.map((x) => ({
      ...x,
      id: x["@iot.id"],
      url: this.getConfigValue("url"),
      feature: feature,
      idLayer: this.getConfigValue("id"),
    }));
  }

  getSensorFeatures(oLayer, vecLayer) {
    // location : api URL from xml config layer infos
    let locationUrl = `${oLayer.url}/Locations`;
    // top : sensortings URL param
    locationUrl = oLayer?.top ? `${locationUrl}?$top=${oLayer.top}` : locationUrl;
    // call features
    fetch(locationUrl)
      .then((response) => response.json())
      .then((response) => {
        const data_dl = response?.value || [];
        // create GeoJSON feature for each item
        return data_dl.map((location_th) => ({
          type: "Feature",
          geometry: location_th.location.geometry || location_th.location,
          properties: location_th,
        }));
      })
      .then((features) => {
        // read openLayers features from previous formated GeoJSON
        const geojsonFeatures = new ol.format.GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures({
          type: "FeatureCollection",
          features: features,
        });
        // add features to mviewer vector layer
        vecLayer.getSource().addFeatures(geojsonFeatures);
        // refresh source override
        vecLayer.getSource().refresh = () => {
          vecLayer.getSource().clear();
          if (this.featureIdSelected) {
            this.featureIdSelected = null;
          }
          // call features again on each layer refresh
          this.getSensorFeatures(oLayer, vecLayer);
        };
      });
  }

  initLayer() {
    this.setVectorSource([]);
    this.setMviewerStyle(this.config.style);
    mviewer.processLayer(this.config, this.layer);
    this.getSensorFeatures(this.config, this.layer);
    this.layer.sensorthings = this;
  }

  initCustomControlValue() {
    if (document.getElementsByClassName("datastreams-checked").length) return;
    let defaultSelected = [...document.getElementsByClassName("datastreams")].filter(
      (x) => x.querySelector("a").innerText === this.config.defaultSensor
    )[0];
    defaultSelected =
      defaultSelected || document.getElementsByClassName("datastreams")[0];
    defaultSelected.click();
  }

  /**
   * Create selector in custom control to check sensor streams
   */
  updateCustomControl = () => {
    // nativ custom control
    const targetDOMCtrl = document.querySelector(
      `#sensorthings-list-${this.getConfigValue("id")}`
    );
    targetDOMCtrl.innerHTML = "";
    // create data to render in template
    const templateInfos = {
      id: this.getConfigValue("top"),
      datastreams: this.datastreams,
      multidatastreams: this.multiDatastreams,
      id: this.getConfigValue("id"),
    };
    // create list from template
    var rendered = Mustache.render(mviewer.templates.ctrlSensor, templateInfos);
    targetDOMCtrl.innerHTML = rendered;
    // init first value only if nothing was checked
    this.initCustomControlValue();
  };

  /**
   * Trigger when user click on map features (same as things)
   * @param {array} things array - clicked layer features
   */
  clickOnThings(things) {
    const thigsUrls = things.map((thing) => this.requestSelectedThing(thing));
    let i = 0;
    Promise.all(thigsUrls).then((responses) => {
      this.readStreams(
        responses[0]
          ? { ...responses[i], feature: things[i]}
          : null
      );
      i++;
    });
  }

  readStreams({ value, feature }) {
    console.log("stream");
    let clickedStreams = value[0];
    const dataStreams = (clickedStreams && clickedStreams?.Datastreams) || null;
    const multiDataStreams = (clickedStreams && clickedStreams?.MultiDatastreams) || null;
    this.setDatastream(dataStreams, feature);
    this.setMultiDatastreams(multiDataStreams, feature);
    this.updateCustomControl();
  }
  /**
   *
   * @param {ol.feature} thing to request
   * @returns Promise
   */
  requestSelectedThing(thing) {
    return new Promise((resolve, reject) => {
      // selector
      let selector = this.config.selector;
      selector = (selector && `$select=${selector}`) || "";
      // selector datastreams
      let datastreamsfilter = this.config.datastreamsfilter;
      datastreamsfilter =
        datastreamsfilter && `Datastreams($select=${datastreamsfilter})`;
      // selector multidatastreams
      let multidatastreamsfilter = this.config.multidatastreamsfilter;
      multidatastreamsfilter =
        multidatastreamsfilter && `MultiDatastreams($select=${multidatastreamsfilter})`;
      // join request URL
      let fullStreamsfilter = [datastreamsfilter, multidatastreamsfilter].join(",");

      fullStreamsfilter = fullStreamsfilter && `&$expand=${fullStreamsfilter}`;
      return fetch(
        `${
          thing.getProperties()["Things@iot.navigationLink"]
        }?${selector}${fullStreamsfilter}`
      )
        .then((r) => r.json())
        .then((r) => resolve(r))
        .catch((r) => {
          reject();
          console.log(
            "Fail to request thing whith [" + thing.getProperties().mviewerid + "] layer"
          );
          return null;
        });
    });
  }

  getUrlsObservation() {
    return this.selectedStreams
      .map((id) => {
        const dataStreamInfos = this.datastreams.filter(
          (x) => x.id == id
        )[0];
        const multiDataStreamsInfos = this.multiDatastreams.filter((x) => x.id == id)[0];
        if (dataStreamInfos) {
          return fetch(
            `${dataStreamInfos.url}/Datastreams(${id})/Observations${
              this.layer.top ? `?$top=${layer.top}` : ""
            }`
          )
            .then((r) => r.json())
            .then((r) => ({ ...dataStreamInfos, result: r.value }));
        }
        if (multiDataStreamsInfos) {
          layer = multiDataStreamsInfos.layer;
          return fetch(
            `${multiDataStreamsInfos.url}/MultiDatastreams(${id})/Observations${
              layer.top ? `?$top=${layer.top}` : ""
            }`
          )
            .then((r) => r.json())
            .then((r) => ({ ...multiDataStreamsInfos, result: r.value }));
        }
        return null;
      })
      .filter((x) => x);

  }

  onSelectStream() {
    const urlsObservations = this.getUrlsObservation();
    Promise.all(urlsObservations).then((values) => {
      let feature = {
        id: _.uniqueId(),
        streamsCount: this.selectedStreams.length,
        streamsNames: values.map((v) => v.name).join(", "),
        streamsIds: values.map((v) => v.id).join(", "),
        totalObservations: _.sum(values.map((v) => v.result.length)),
      };
      this.selectedStreams.forEach((id, idx) => {
        feature[id] = values[idx];
      });
      values[0].feature.setProperties({ observations: feature });
      this.featureIdSelected = values[0].feature.ol_uid;
      // PROCESS END
      mviewer.dispatchEvent(`${ this.config.id }-sensortings-features-ready`, {detail: values[0].feature});
    });
  }

  onCustomControlClick(e) {
    const spanEl = e.getElementsByTagName("span")[0];
    if (e.getElementsByClassName("mv-unchecked").length) {
      spanEl.classList.remove("mv-unchecked");
      spanEl.classList.add("mv-checked", "datastreams-checked");
    } else {
      spanEl.classList.add("mv-unchecked");
      spanEl.classList.remove("mv-checked", "datastreams-checked");
    }

    const checkedCollection = document.querySelectorAll(
      `#sensorthings-list-${this.config.id} .datastreams-checked`
    );
    // clean template panel if any checked
    if (!checkedCollection.length) return $(".popup-content").html("");
    // else request data by selected stream and display panel
    const selectedStreams = [...checkedCollection].map((i) =>
      i.getAttribute("datastream-span-id")
    );
    this.setSelectedStreams(selectedStreams);
    this.onSelectStream();
  }
}

var sensorthingsA = (function () {

  const _showSensorList = (idLayer) => {
    if (mviewer.sensorthings[idLayer]) {
      info.displaySensorList(idLayer);
      if (mviewer.sensorthings[idLayer]?.selected) {
        mviewer.sensorthings[idLayer]?.selected.forEach((id) => {
          // display list checked as previous state
          _sensorDataStreamSelected(
            document.querySelector(`[data-datastreamid='${id}']`),
            true,
            idLayer
          );
        });
      }
    }
  };

  return {};
})();
