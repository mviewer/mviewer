class CustomLayer {
  constructor(id, layer, legend, handle = false) {
    this.id = id;
    this.layer = layer;
    /* for vector Layer only */
    /* legend : only used if vectorlegend parameter set to true in config file*/
    this.legend = legend;
    /* handle : replace native click handler on features*/
    this.handle = handle;
    /* Load customlayer in mviewer.customLayers */
    if (mviewer.customLayers && !mviewer.customLayers[id]) {
        mviewer.customLayers[id] = this
    } else {
        console.log(`${this.id} customLayer is not loaded because  ${this.id} is already in use !`);
    }
  }
}