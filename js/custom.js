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
// Class abstraite
class CustomControl {
  constructor(id) {
    this.id = id;
    /* Load customControl in mviewer.customControls */
    if (mviewer.customControls && !mviewer.customControls[id]) {
        mviewer.customControls[id] = this
    } else {
        console.log(`${this.id} customControl is not loaded because  ${this.id} is already in use !`);
    }
  }
  init(){
    throw new Error('You must implement the \'init\' function');
  }
  destroy(){
    throw new Error('You must implement the \'destroy\' function');
  }
}