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
        this.map = mviewer.getMap();
        this.config = {};
    } else {
        console.log(`${this.id} customLayer is not loaded because  ${this.id} is already in use !`);
    }
  }
}

// Custom Control Simple

class CustomControl {
  constructor(id, init = function () {}, destroy = function () {}) {
    this.id = id;
    this.init = init;
    this.destroy = destroy;
    /* Load customControl in mviewer.customControls */
    if (mviewer.customControls && !mviewer.customControls[id]) {
        mviewer.customControls[id] = this
    } else {
        console.log(`${this.id} customControl is not loaded because  ${this.id} is already in use !`);
    }
  }
}

// Class abstraite
class AdvancedCustomControl {
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


class Component {
  constructor(id, path) {
    this.id = id;
    this.path = path  + "/" + this.id + "/";
    this.config = {};
    this.load();
  }

  load () {

    const that = this;

    const handleErrors = function (response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    }

    const getConfig = function (path) {
      return fetch(path + "config.json")
      .then(handleErrors)
      .then(response => response.json())
      .catch(function(error) {
        console.log(error);
      })
    }

    const setConfig = function (config) {
      return new Promise ((resolve, reject) => {
        that.config = config;
        resolve(that.config);
      })
    }

    const getScripts = function (config) {
      if (config) {
        const requests = config.js.map(url => loadScript(that.path + url));
        return Promise.all(requests);
      }
    }

    const loadScript = function (src) {
      const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.type = 'text/javascript';
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = src;
      });
      return scriptPromise;

    }

    const getHTML = function () {
      if (that.path && that.config && that.config.html) {
        let url = that.path + that.config.html;
        return fetch(url)
        .then(response => response.text())
      }
    }

    const setHTML = function (html) {
      return new Promise ((resolve, reject) => {
        if (html) {
          that.html = html;
          resolve(that.html);
        } else {
          reject("error");
        }
      })
    }

    const render = function (html) {
      return new Promise ((resolve, reject) => {
        if (html && that.config && that.config.target) {
          let _html = [];
          let target = document.getElementById(that.config.target);
          let component = document.createElement('div');
          component.classList.add('customComponent');
          component.id = `${that.id}-custom-component`;
          if (that.config.options && that.config.options.title) {
            component.title = that.config.options.title;
          }
          if (that.config.css) {
            _html.push('<link href="'+ that.path + that.config.css +'" rel="stylesheet" >');
          }
          _html.push(html);
          component.innerHTML = _html.join("");
          target.appendChild(component);
          resolve(target);
        } else {
          reject("error");
        }
      })
    }

    const dispatch = function() {
      return new Promise ((resolve, reject) => {
        if (that.config) {
          let event = new CustomEvent(`${that.id}-componentLoaded`, { 'detail': that.id });
          document.dispatchEvent(event);
          resolve(event);
        } else {
          reject("error");
        }

      })
    }

    getConfig(this.path) /* get config.json file */
    .then(json => setConfig(json)) /* store json body in config variable */
    .then(config => getScripts(config)) /* download all scripts from config.js array */
    .then(loadEvents => getHTML()) /* download html file from config.html */
    .then(text => setHTML(text)).catch(e => console.log(e)) /* store html body in config variable */
    .then(html => render(html)).catch(e => console.log(e)) /* render html body in target element from config.target */
    .then(target => dispatch()).catch(e => console.log(e)) /* dispatch componentLoaded event */
    .then(event => { if (event) {
      console.log(`${that.id} is successfully loaded`);
    } else {
      console.log(`Error : ${that.id} is not loaded`);
    }
  })
  }

}

// this class is necessary to link custom init function to the componentLoaded event
class CustomComponent {
  constructor(id, init) {
    document.addEventListener(`${id}-componentLoaded`, init);
  }
}
