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
      mviewer.customLayers[id] = this;
      this.map = mviewer.getMap();
      this.config = {};
    } else {
      console.log(
        `${this.id} customLayer is not loaded because  ${this.id} is already in use !`
      );
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
      mviewer.customControls[id] = this;
    } else {
      console.log(
        `${this.id} customControl is not loaded because  ${this.id} is already in use !`
      );
    }
  }
}

// Class abstraite
class AdvancedCustomControl {
  constructor(id) {
    this.id = id;
    /* Load customControl in mviewer.customControls */
    if (mviewer.customControls && !mviewer.customControls[id]) {
      mviewer.customControls[id] = this;
    } else {
      console.log(
        `${this.id} customControl is not loaded because  ${this.id} is already in use !`
      );
    }
  }
  init() {
    throw new Error("You must implement the 'init' function");
  }
  destroy() {
    throw new Error("You must implement the 'destroy' function");
  }
}

class Component {
  constructor(id, path, properties = {}, configPath = "") {
    this.id = id;
    this.path = `${path}/${this.id}/`;
    this.configPath = configPath || `${this.path}config.json`;
    this.properties = properties;
    this.urlProperties = this.getUrlProperties();
    this.config = {};
    this.options = {};
    this.load();
  }

  /**
   * Get URL options declared as `<component-id>.<property>`.
   * For example: `?print.ownerInfos=Ma%20carte`.
   *
   * @returns {object}
   */
  getUrlProperties() {
    const prefix = `${this.id}.`;
    const searchParams = new URLSearchParams(window.location.search);

    return Array.from(searchParams).reduce((properties, [name, value]) => {
      if (name.startsWith(prefix)) {
        properties[name.slice(prefix.length)] = this.parseUrlValue(value);
      }
      return properties;
    }, {});
  }

  /**
   * Parse JSON URL values while preserving regular strings.
   *
   * @param {string} value URL parameter value.
   * @returns {*} Parsed JSON value, or the original string.
   */
  parseUrlValue(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  /**
   * Resolve addon options for the current application.
   *
   * @param {object} options Options from config.json.
   * @returns {object}
   */
  getApplicationOptions(options = {}) {
    const applicationId = configuration.getConfiguration()?.application?.id;
    const mviewerOptions = options.mviewer?.[applicationId];
    const mviewersOptions = options.mviewers?.[applicationId];
    const applicationOptions = options[applicationId];

    if (mviewerOptions && typeof mviewerOptions === "object") {
      return mviewerOptions;
    }
    if (mviewersOptions && typeof mviewersOptions === "object") {
      return mviewersOptions;
    }
    if (applicationOptions && typeof applicationOptions === "object") {
      return applicationOptions;
    }
    return options;
  }

  /**
   * Merge addon options with URL > XML > config.json precedence.
   *
   * Unprefixed URL parameters are accepted only when their name is already
   * defined by the addon configuration or the XML extension declaration.
   *
   * @param {object} options Options from config.json.
   * @returns {object}
   */
  getOptions(options = {}) {
    const configuredOptions = this.getApplicationOptions(options);
    const urlProperties = Object.fromEntries(
      Array.from(new URLSearchParams(window.location.search))
        .filter(([name]) =>
          Object.prototype.hasOwnProperty.call(configuredOptions, name) ||
          Object.prototype.hasOwnProperty.call(this.properties, name)
        )
        .map(([name, value]) => [name, this.parseUrlValue(value)])
    );

    return {
      ...configuredOptions,
      ...this.properties,
      ...urlProperties,
      ...this.urlProperties,
    };
  }

  load() {
    const that = this;

    const handleErrors = function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    };

    const getConfig = function (url) {
      return fetch(url)
        .then(handleErrors)
        .then((response) => response.json())
        .catch(function (error) {
          console.log(error);
        });
    };

    const setConfig = function (config) {
      return new Promise((resolve, reject) => {
        that.config = config || {};
        that.options = that.getOptions(that.config.options);
        that.config.options = that.options;
        resolve(that.config);
      });
    };

    const getScripts = function (config) {
      if (config) {
        const requests = config.js.map((url) =>
          loadScript(that.path + url, config?.type)
        );
        return Promise.all(requests);
      }
    };

    const loadScript = function (src, type = "text/javascript") {
      const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        document.body.appendChild(script);
        script.type = type;
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = src;
      });
      return scriptPromise;
    };

    const getHTML = function () {
      if (that.path && that.config && that.config.html) {
        let url = that.path + that.config.html;
        return fetch(url).then((response) => response.text());
      }
    };

    const setHTML = function (html) {
      return new Promise((resolve, reject) => {
        if (html) {
          that.html = html;
          resolve(that.html);
        } else {
          reject("error");
        }
      });
    };

    const render = function (html) {
      return new Promise((resolve, reject) => {
        if (html && that.config && that.config.target) {
          let _html = [];
          let target = document.getElementById(that.config.target);
          let component = document.createElement("div");
          component.classList.add("customComponent");
          component.id = `${that.id}-custom-component`;
          if (that.config.options && that.config.options.title) {
            component.title = that.config.options.title;
          }
          // use url as string or urls as array from config
          if (that.config.css && typeof that.config.css === "string") {
            _html.push(
              '<link href="' + that.path + that.config.css + '" rel="stylesheet">'
            );
          } else if (that.config.css) {
            let cssSheets = that.config.css.map(
              (s) => `<link href="${that.path + s}" rel="stylesheet">`
            );
            _html = _html.concat(cssSheets);
          }
          _html.push(html);
          component.innerHTML = _html.join("");
          if (
            that.config.options &&
            typeof that.config.options.position == "number" &&
            target.hasChildNodes() &&
            target.childNodes[that.config.options.position]
          ) {
            target.insertBefore(
              component,
              target.childNodes[that.config.options.position]
            );
          } else {
            target.appendChild(component);
          }
          resolve(target);
        } else {
          reject("error");
        }
      });
    };

    const dispatch = function () {
      return new Promise((resolve, reject) => {
        if (that.config) {
          let event = new CustomEvent(`${that.id}-componentLoaded`, { detail: that.id });
          document.dispatchEvent(event);
          resolve(event);
        } else {
          reject("error");
        }
      });
    };

    getConfig(this.configPath) /* get configured config.json file */
      .then((json) => setConfig(json)) /* store json body in config variable */
      .then((config) =>
        getScripts(config)
      ) /* download all scripts from config.js array */
      .then((loadEvents) => getHTML()) /* download html file from config.html */
      .then((text) => setHTML(text))
      .catch((e) => console.log(e)) /* store html body in config variable */
      .then((html) => render(html))
      .catch((e) =>
        console.log(e)
      ) /* render html body in target element from config.target */
      .then((target) => dispatch())
      .catch((e) => console.log(e)) /* dispatch componentLoaded event */
      .then((event) => {
        if (event) {
          console.log(`${that.id} is successfully loaded`);
        } else {
          console.log(`Error : ${that.id} is not loaded`);
        }
      });
  }
}

// this class is necessary to link custom init function to the componentLoaded event
class CustomComponent {
  constructor(id, init) {
    document.addEventListener(`${id}-componentLoaded`, init);
  }
}
