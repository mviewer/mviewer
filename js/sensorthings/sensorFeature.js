class SensorFeature {
  constructor(feature, layer, thingUrl) {
    this.layer = layer;
    this.config = layer?.sensorthings?.config;
    this.feature = feature;
    this.sensorInstance = this.layer?.sensorthings;
    this.thing = {};
    this.observations = {};
    this.datastreams = [];
    this.multidatastreams = [];
    this.selectedStreams = this.layer?.sensorthings?.selectedStreams || [];
    this.thingsUrl = "";

    // thing url
    this.thingUrl = thingUrl || "";
    this.sensorServiceUrl = this.config.sensorserviceurl || this.config.url;
    if (this.config.sensorserviceurl && this.config.sensorthingsid) {
      const thingId = feature.get(this.config.sensorthingsid);
      this.thingUrl = thingUrl || `${this.config.sensorserviceurl}/Things(${thingId})`;
    }
  }

  dataStreamsFieldName = "Datastreams@iot.navigationLink";
  multiDataStreamsName = "MultiDatastreams@iot.navigationLink";

  setSelectedStreams(streams) {
    this.selectedStreams = streams || [];
  }

  changeStreams() {
    let forceUpdate = !_.isEmpty(this.compareStreams());
    this.sensorInstance.changeStreams(
      this.datastreams,
      this.multidatastreams,
      forceUpdate
    );
  }

  getThingStreams = (thing, callback, fields) => {
    // get datastreams
    this.getStreams(thing, fields);
    this.currentControlStreams = [
      ...document.querySelectorAll(
        `#sensorthings-list-${this.config.id} .datastreams span`
      ),
    ].map((x) => x.getAttribute("name"));

    if (this.sensorInstance) {
      this.changeStreams();
    }
    Promise.all(this.getObservations()).then((responses) => {
      this.feature.setProperties({
        sensorthings: {
          observations: responses,
          thing: thing,
          datastreams: this.datastreams,
          multidatastreams: this.multidatastreams,
        },
      });
      callback(this.feature);
    });
  };

  /**
   *
   * @param {*} things  {value: Array<{}>}
   * @param {*} callback
   */
  onLocationResponse(response, callback) {
    const things = response.value;
    this.getThingStreams(things[0], callback, {
      dsField: "Datastreams",
      mdsField: "MultiDatastreams",
    });
  }

  /**
   * On queyrMap, will manage  things, streams, observations request in cascade
   * @returns Promise
   */
  startSensorProcess() {
    return new Promise((resolveProcess) =>
      // call all things for this clicked location feature
      // response: {value: Array<{}>}
      this.getLocationThings(this.feature).then((thingsResponse) =>
        this.onLocationResponse(thingsResponse, resolveProcess)
      )
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

  requestThing = (url, resolve, reject) => {
    return fetch(url || this.thingUrl)
      .then((r) => r.json())
      .then((response) => {
        resolve(response);
      })
      .catch((r) => {
        reject ? reject() : null;
        console.log("Fail to get thing infos whith [" + url + "] url");
        return null;
      });
  };

  requestThings = (url, resolve, reject) => {
    return fetch(url || this.thingsUrl)
      .then((r) => r.json())
      .then((r) => {
        resolve(r);
      })
      .catch((r) => {
        reject();
        console.log(
          "Fail to get things whith [" + feature.getProperties().mviewerid + "] layer"
        );
        return null;
      });
  };

  getFilterUrl(url) {
    // selector
    let selector = this.config.selector;
    selector = (selector && `$select=${selector}`) || "";
    // selector datastreams
    let datastreamsfilter = this.config.datastreamsfilter;
    datastreamsfilter = datastreamsfilter && `Datastreams($select=${datastreamsfilter})`;
    // selector multidatastreams
    let multidatastreamsfilter = this.config.multidatastreamsfilter;
    multidatastreamsfilter =
      multidatastreamsfilter && `MultiDatastreams($select=${multidatastreamsfilter})`;
    // join request URL
    let fullStreamsfilter = [datastreamsfilter, multidatastreamsfilter].join(",");
    fullStreamsfilter = fullStreamsfilter && `&$expand=${fullStreamsfilter}`;

    let filteredUrl =
      selector || fullStreamsfilter ? `${url}?${selector}${fullStreamsfilter}` : url;

    return filteredUrl;
  }

  /**
   * Request Location's things from query map
   * @param {ol.feature} feature clicked
   * @returns
   */
  getLocationThings = (feature) => {
    return new Promise((resolve, reject) => {
      const thingsUrl = feature.getProperties()["Things@iot.navigationLink"];
      let filteredUrl = this.getFilterUrl(thingsUrl);
      this.thingUrl = filteredUrl;
      return this.requestThings(filteredUrl, resolve, reject);
    });
  };

  /**
   * Get streams from selection
   * @param {any} object that contain value key as clicked stream
   */
  getStreams(thing, { dsField, mdsField }) {
    const dsInfos = thing[dsField] || thing[this.dataStreamsFieldName];
    const msInfos = thing[mdsField] || thing[this.multiDataStreamsName];
    this.datastreams = this.createStreams(dsInfos);
    this.multidatastreams = this.createStreams(msInfos);
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
      url: this.sensorServiceUrl,
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

class SensorWmsFeature extends SensorFeature {
  constructor(feature, layerinfos, thingUrl) {
    super(feature, layerinfos.layer);
    this.thingUrl = thingUrl;
    this.config = layerinfos;
  }
  /**
   * @override
   */
  startSensorProcess = () => {
    let filteredUrl = this.getFilterUrl(this.thingUrl);
    this.thingUrl = filteredUrl;
    return new Promise((resolveProcess) =>
      this.requestThing(
        filteredUrl,
        (response) => {
          this.getThingStreams(response, (r) => resolveProcess(r), {
            dsField: "Datastreams",
            mdsField: "MultiDatastreams",
          });
        },
        (r) => {
          console.log(r);
        }
      )
    );
  };
}
