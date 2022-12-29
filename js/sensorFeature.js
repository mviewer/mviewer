class SensorFeature {
  constructor(feature, layer) {
    this.layer = layer;
    this.config = layer.sensorthings.config;
    this.feature = feature;
    this.thing = {};
    this.observations = {};
    this.datastreams = [];
    this.multidatastreams = [];
    this.selectedStreams = [];
  }

  setSelectedStreams(streams) {
    this.selectedStreams = streams || [];
  }

  startSensorProcess() {
    return new Promise(resolveProcess =>
      this.getThing(this.feature).then((thingResponse) => {
      let streamsSource = !_.isEmpty(thingResponse.value)
        ? { ...thingResponse, feature: this.feature }
        : null;
      // get datastreams
      this.getStreams(streamsSource);
      
      Promise.all(this.getObservations()).then(responses => {
        this.feature.setProperties({
          sensorthings: {
            observations: responses,
            thing: thingResponse,
            datastreams: this.datastreams,
            multidatastreams: this.multidatastreams
          }
        })
        resolveProcess(this.feature);
      });
    })
    )
  };
  
  
  getThing(feature) {
    return new Promise((resolve, reject) => {
      // selector
      let selector = this.config.selector;
      selector = (selector && `$select=${ selector }`) || "";
      // selector datastreams
      let datastreamsfilter = this.config.datastreamsfilter;
      datastreamsfilter =
        datastreamsfilter && `Datastreams($select=${ datastreamsfilter })`;
      // selector multidatastreams
      let multidatastreamsfilter = this.config.multidatastreamsfilter;
      multidatastreamsfilter =
        multidatastreamsfilter && `MultiDatastreams($select=${ multidatastreamsfilter })`;
      // join request URL
      let fullStreamsfilter = [datastreamsfilter, multidatastreamsfilter].join(",");

      fullStreamsfilter = fullStreamsfilter && `&$expand=${ fullStreamsfilter }`;
      return fetch(
        `${ feature.getProperties()["Things@iot.navigationLink"]
        }?${ selector }${ fullStreamsfilter }`
      )
        .then((r) => r.json())
        .then((r) => resolve(r))
        .catch((r) => {
          reject();
          console.log(
            "Fail to request thing whith [" + feature.getProperties().mviewerid + "] layer"
          );
          return null;
        });
    });
  }

  getStreams({ value }) {
    let clickedStreams = value[0];
    const dataStreams = (clickedStreams && clickedStreams?.Datastreams) || null;
    const multiDataStreams = (clickedStreams && clickedStreams?.MultiDatastreams) || null;
    this.datastreams = this.createStreams(dataStreams);
    this.multidatastreams = this.createStreams(multiDataStreams);
  }

  getConfigValue(value) {
    return this.config[value];
  }

  createStreams(streams) {
    return streams.map((x) => ({
      ...x,
      id: x["@iot.id"],
      url: this.getConfigValue("url")
    }));
  }

  getObservations() {
    if (_.isEmpty(this.selectedStreams)) {
      let streams = !_.isEmpty(this.datastreams) ? this.datastreams[0] : null;
      streams = streams ? streams : !_.isEmpty(this.multidatastreams) ? this.multidatastreams[0] : null;
      
      this.setSelectedStreams([streams]);
    }
    let fetchPromises = this.selectedStreams
      .map((stream) => {
        const dataStreamInfos = this.datastreams.filter((x) => x.id == stream.id || x.name == stream.name)[0];
        const multiDataStreamsInfos = this.multidatastreams.filter(
          (x) => x.id == stream.id || x.name == stream.name
        )[0];
        if (dataStreamInfos) {
          return fetch(
            `${ dataStreamInfos.url }/Datastreams(${ stream.id })/Observations${ this.layer.top ? `?$top=${ layer.top }` : ""
            }`
          )
            .then((r) => r.json())
            .then((r) => ({ ...dataStreamInfos, result: r.value }));
        }
        if (multiDataStreamsInfos) {
          return fetch(
            `${ multiDataStreamsInfos.url }/MultiDatastreams(${ stream.id })/Observations${ this.layer.top ? `?$top=${ this.layer.top }` : ""
            }`
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
