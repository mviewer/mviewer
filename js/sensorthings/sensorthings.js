class Sensorthings {
  constructor(config) {
    this.config = config;
    this.template = mviewer.templates.ctrlSensor;
    this.customControl = document.querySelector(`#sensorthings-list-${config.id}`);
    this.processId = null;

    this.lastQuery = [];
    this.initialized = false;
    this.streamEvent = `${this.config.id}-select-stream`;
    this.onClickEvent = null;
    this.srs = config.srs || "4326";
    // usefull to create and update custom control list
    this.selectedStreams = [];
    this.datastreams = [];
    this.multidatastreams = [];
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

  /**
   * Get a value by key from config
   * @param {string} value as key's config name
   * @returns <any> key's value
   */
  getConfigValue(value) {
    return this.config[value];
  }

  /**
   * Click on selected or default streams that exists in custom control streams list
   * @returns no
   */
  getCustomControlValue() {
    if (document.getElementsByClassName("datastreams-checked").length) return;
    let defaultSelected = [...document.getElementsByClassName("datastreams")].filter(
      (x) => x.querySelector("a").innerText === this.config.defaultSensor
    )[0];
    defaultSelected =
      defaultSelected || document.getElementsByClassName("datastreams")[0];
    defaultSelected.click();
  }

  /**
   * Return default Datastreams list from custom control
   * @param {*} newStreams
   * @returns list of span as clickable Datastreams
   */
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
      idLayer:
        this?.layer?.get?.("mviewerid") ||
        this?.getConfigValue?.("layer")?.get?.("mviewerid"),
    };
    // create list from template
    var rendered = Mustache.render(mviewer.templates.ctrlSensor, templateInfos);
    targetDOMCtrl.innerHTML = rendered;
  };

  /**
   * Populate custom control from Datastreams
   */
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

  /**
   * Query service on each stream checked change
   * @param {any} e as event callback element
   */
  query(e) {
    this.changeStreamChecked(e.querySelector("span"));
    this.selectedStreams = this.getCheckedStreams();
    info.queryMap(this.lastQuery);
  }

  /**
   * Manage custom control checkbox state and panel if no value checked
   * @param {any} span html element
   * @returns
   */
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

  /**
   * Change all custom control checkbox states
   * @param {any} spans list of spans from custom control Datastreams
   */
  changedStreamsChecked(spans) {
    spans.forEach((s) => this.changeStreamChecked(s));
  }

  /**
   * Trigger on Datastream checkbox clicked
   * @param {any} e callback event element
   */
  onCustomControlClick(e) {
    this.changeStreamChecked(e.querySelector("span"));
  }

  /**
   * Get Datastreams checked
   * @returns <Array:string> of Datastreams name
   */
  getCheckedStreams() {
    const checkedCollection = document.querySelectorAll(
      `#sensorthings-list-${this.config.id} .datastreams-checked`
    );
    return [...checkedCollection].map((i) => i.getAttribute("name"));
  }

  /**
   * Will update custom control list from Things repsonse
   * @param {*} datastreams
   * @param {*} multidatastreams
   * @param {*} force
   * @returns no
   */
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
