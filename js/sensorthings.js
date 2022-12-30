class Sensorthings {
  constructor(config) {
    this.config = config;
    this.layer = new ol.layer.Vector({});
    this.template = mviewer.templates.ctrlSensor;
    this.customControl = document.querySelector(`#sensorthings-list-${config.id}`);
    this.processId = null;
    this.features = {};
    this.lastQuery = [];
    this.initialized = false;
    this.streamEvent = `${this.config.id}-select-stream`;
    this.onClickEvent = null;
    // usefull to create and update custom control list
    this.selectedStreams = [];
    this.datastreams = [];
    this.multidatastreams = [];

    this.initLayer();
  }

  setLastQuery(lastQuery = []) {
    this.lastQuery = lastQuery;
  }

  getLastQuery() {
    return this.lastQuery;
  }

  setStreamEvent(e) {
    this.streamEvent = e;
  }

  getStreamEvent(e) {
    return this.streamEvent;
  }
  setClickEvent(e) {
    this.onClickEvent = e;
  }
  getClickEvent() {
    return this.onClickEvent;
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

  createDatastream(datastreams, feature) {
    return datastreams.map((x) => ({
      ...x,
      id: x["@iot.id"],
      url: this.getConfigValue("url"),
      feature: feature,
      idLayer: this.getConfigValue("id"),
    }));
  }

  createMultiDatastreams(multiDatastreams, feature) {
    return multiDatastreams.map((x) => ({
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

  getCustomControlValue() {
    if (document.getElementsByClassName("datastreams-checked").length) return;
    let defaultSelected = [...document.getElementsByClassName("datastreams")].filter(
      (x) => x.querySelector("a").innerText === this.config.defaultSensor
    )[0];
    defaultSelected =
      defaultSelected || document.getElementsByClassName("datastreams")[0];
    defaultSelected.click();
  }

  getDefaultStreams(newStreams) {
    let parentSelector = [
      ...document.querySelectorAll(`#sensorthings-list-${this.config.id} .datastreams`),
    ];
    if (this.config.defaultSensor && newStreams.includes(this.config.defaultSensor)) {
      return parentSelector.filter(
        (x) => x.querySelector("a").innerText === this.config.defaultSensor
      );
    } else {
      return [parentSelector[0].querySelector("span")];
    }
  }

  /**
   * Create selector in custom control to check sensor streams
   */
  updateCustomControl = (datastreams, multidatastreams) => {
    // nativ custom control
    const targetDOMCtrl = document.querySelector(
      `#sensorthings-list-${this.getConfigValue("id")}`
    );
    targetDOMCtrl.innerHTML = "";
    // create data to render in template
    const templateInfos = {
      top: this.getConfigValue("top"),
      datastreams: datastreams,
      multidatastreams: multidatastreams,
      id: this.getConfigValue("id"),
      idLayer: this.layer.get("mviewerid"),
    };
    // create list from template
    var rendered = Mustache.render(mviewer.templates.ctrlSensor, templateInfos);
    targetDOMCtrl.innerHTML = rendered;
  };

  initCustomControl() {
    if (!this.selectedStreams.length) {
      // init first value only if nothing was checked
      this.getCustomControlValue();
    } else {
      // else click on each to get observations data
      this.selectedStreams.forEach((name) => {
        this.onCustomControlClick(document.querySelector(`[name='${name}']`));
      });
    }
  }

  query(e) {
    this.changeStreamChecked(e.querySelector("span"));
    this.selectedStreams = this.getCheckedStreams();
    info.queryMap(this.lastQuery);
  }

  changeStreamChecked(span) {
    if (span.classList.contains("mv-unchecked")) {
      span.classList.remove("mv-unchecked");
      span.classList.add("mv-checked", "datastreams-checked");
    } else {
      span.classList.add("mv-unchecked");
      span.classList.remove("mv-checked", "datastreams-checked");
    }
    const checkedCollection = document.querySelectorAll(
      `#sensorthings-list-${this.config.id} .datastreams-checked`
    );
    // clean template panel if any checked
    if (!checkedCollection.length) return $(".popup-content").html("");
  }

  changedStreamsChecked(spans) {
    spans.forEach((s) => this.changeStreamChecked(s));
  }

  onCustomControlClick(e) {
    this.changeStreamChecked(e.querySelector("span"));
  }

  getCheckedStreams() {
    const checkedCollection = document.querySelectorAll(
      `#sensorthings-list-${this.config.id} .datastreams-checked`
    );
    return [...checkedCollection].map((i) =>
      //i.getAttribute("datastream-span-id")
      i.getAttribute("name")
    );
  }

  changeStreams(datastreams, multidatastreams, force) {
    if (this.initialized && !force) return;
    let streams = [
      ...datastreams.map((x) => x.name),
      ...multidatastreams.map((x) => x.name),
    ];
    this.updateCustomControl(datastreams, multidatastreams);
    // check default
    let defaultStreamsChecked = this.getDefaultStreams(streams);
    this.changedStreamsChecked(defaultStreamsChecked);
    this.selectedStreams = this.getCheckedStreams();
    this.initialized = true;
  }
}
