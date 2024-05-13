class SensorFeature {
  constructor(feature, layer) {
    this.layer = layer;
    this.config = layer.sensorthings.config;
    this.feature = feature;
    this.sensorInstance = this.layer.sensorthings;
    this.thing = {};
    this.observations = {};
    this.datastreams = [];
    this.multidatastreams = [];
    this.selectedStreams = this.layer.sensorthings.selectedStreams || [];
  }

  setSelectedStreams(streams) {
    this.selectedStreams = streams || [];
  }

  /**
   * On queyrMap, will manage  things, streams, observations request in cascade
   * @returns Promise
   */
  startSensorProcess() {
    return new Promise((resolveProcess) =>
      this.getThing(this.feature).then((thingResponse) => {
        let streamsSource = !_.isEmpty(thingResponse.value)
          ? { ...thingResponse, feature: this.feature }
          : null;
        // get datastreams
        this.getStreams(streamsSource);
        this.currentControlStreams = [
          ...document.querySelectorAll(
            `#sensorthings-list-${this.config.id} .datastreams span`
          ),
        ].map((x) => x.getAttribute("name"));
        let forceUpdate = !_.isEmpty(this.compareStreams());

        this.sensorInstance.changeStreams(
          this.datastreams,
          this.multidatastreams,
          forceUpdate
        );

        Promise.all(this.getObservations()).then((responses) => {
          this.feature.setProperties({
            sensorthings: {
              observations: responses,
              thing: thingResponse,
              datastreams: this.datastreams,
              multidatastreams: this.multidatastreams,
            },
          });
          resolveProcess(this.feature);
        });
      })
    );
  }

  /**
   * Usefull to detect if Datastreams changes.
   * @param {string} comparator as attribute name
   * @returns Array of difference
   */
  compareStreams(comparator = "name") {
    let newStreams = [
      ...this.datastreams.map((x) => x[comparator]),
      ...this.multidatastreams.map((x) => x[comparator]),
    ];
    let streams = [
      ...document.querySelectorAll(
        `#sensorthings-list-${this.config.id} .datastreams span`
      ),
    ].map((x) => x.getAttribute(comparator));
    return _.difference(newStreams, streams).concat(_.difference(streams, newStreams));
  }

  /**
   * Request thing from query map
   * @param {ol.feature} feature clicked
   * @returns
   */
  getThing(feature) {
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
          feature.getProperties()["Things@iot.navigationLink"]
        }?${selector}${fullStreamsfilter}`
      )
        .then((r) => r.json())
        .then((r) => resolve(r))
        .catch((r) => {
          reject();
          console.log(
            "Fail to request thing whith [" +
              feature.getProperties().mviewerid +
              "] layer"
          );
          return null;
        });
    });
  }

  /**
   * Get streams from selection
   * @param {any} object that contain value key as clicked stream
   */
  getStreams({ value }) {
    let clickedStreams = value[0];
    const dataStreams = (clickedStreams && clickedStreams?.Datastreams) || null;
    const multiDataStreams = (clickedStreams && clickedStreams?.MultiDatastreams) || null;
    this.datastreams = this.createStreams(dataStreams);
    this.multidatastreams = this.createStreams(multiDataStreams);
  }

  /**
   * Get value config for a given key.
   * @param {any} value
   * @returns key's value
   */
  getConfigValue(value) {
    return this.config[value];
  }

  /**
   * Return streams object list
   * @param {Array} streams as Datastreams or MultiDatastreams
   * @returns
   */
  createStreams(streams) {
    return streams.map((x) => ({
      ...x,
      id: x["@iot.id"],
      url: this.getConfigValue("url"),
    }));
  }

  /**
   * Get observations from selected Datastreams
   * @returns request as Promise
   */
  getObservations() {
    let fetchPromises = this.sensorInstance
      .getCheckedStreams()
      .map((stream) => {
        const dataStreamInfos = this.datastreams.filter(
          (x) => x.id == stream || x.name == stream
        )[0];
        const multiDataStreamsInfos = this.multidatastreams.filter(
          (x) => x.id == stream || x.name == stream
        )[0];
        if (dataStreamInfos) {
          return fetch(
            `${dataStreamInfos.url}/Datastreams(${dataStreamInfos.id})/Observations${
              this.config.top ? `?$top=${this.config.top}` : ""
            }`
          )
            .then((r) => r.json())
            .then((r) => ({ ...dataStreamInfos, result: r.value }));
        }
        if (multiDataStreamsInfos) {
          return fetch(
            `${multiDataStreamsInfos.url}/MultiDatastreams(${
              multiDataStreamsInfos.id
            })/Observations${this.config.top ? `?$top=${this.config.top}` : ""}`
          )
            .then((r) => r.json())
            .then((r) => ({ ...multiDataStreamsInfos, result: r.value }));
        }
        return null;
      })
      .filter((x) => x);
    return fetchPromises;
  }
}
