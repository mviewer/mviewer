class SensorLayer extends Sensorthings {
  constructor(config) {
    super(config);
    // layer
    this.layer = new ol.layer.Vector({});
    this.features = {};
    this.customstyle = config.customstyle ? JSON.parse(config.customstyle) : "";
  }

  setCustomStyle(style) {
    if (style) {
      this.layer.setStyle(style);
    }
  }

  /**
   *
   * @param {Object} style from stringify layer.customstyle param
   */
  setPersonnalStyle(style) {
    const rules = style || this.customstyle;
    const type = Object.keys(rules)[0];
    let olStyle;
    const rulesOl = {
      stroke: _.get(rules[type], "stroke"),
      fill: _.get(rules[type], "fill"),
      radius: _.get(rules[type], "radius"),
    };
    if (type == "point") {
      olStyle = () => mviewer.featureStyles.sensorPoint(rulesOl);
      this.layer.setStyle(olStyle);
    } else if (type == "polygon") {
      olStyle = () => mviewer.featureStyles.sensorPolygon(rulesOl);
      this.layer.setStyle(olStyle);
    }
  }

  /**
   * Use a style from existing mviewer style to display things features.
   * @param {string} styleName to use as layer style
   */
  setMviewerStyle(styleName) {
    if (styleName && mviewer.featureStyles[this.config.style]) {
      this.layer.setStyle(mviewer.featureStyles[this.config.style]);
    }
  }

  /**
   * Set features from thing response.See this.getSensorFeatures method.
   * @param {Array} features list of ol.feature
   */
  setVectorSource(features = []) {
    this.layer.setSource(
      new ol.source.Vector({
        features: features,
      })
    );
  }

  /**
   * Return features from layer source
   * @returns <Array> of ol.feature
   */
  getFeatures() {
    return this.layer.getSource().getFeatures();
  }

  /**
   * Return geojson features from layer service URI
   * Will populate vector layer
   * @param {any} oLayer mviewer layer as config object
   * @param {*} vecLayer ol.vector.layer
   */
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
          dataProjection: `EPSG:${this.srs}`,
          featureProjection: mviewer.getMap().getView().getProjection().getCode(),
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
    if (this.config.style) {
      this.setMviewerStyle(this.config.style, this.customstyle);
    }
    if (this.customstyle) {
      this.setPersonnalStyle();
    }
    mviewer.processLayer(this.config, this.layer);
    this.getSensorFeatures(this.config, this.layer);
    this.layer.sensorthings = this;
  }
}
