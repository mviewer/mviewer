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
  constructor(id, path) {
    this.id = id;
    this.path = `${path}/${this.id}/`;
    this.config = {};
    this.load();
  }

  async load() {
    const that = this;

    const handleErrors = function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    };

    const getConfig = function (path) {
      return fetch(path + "config.json")
        .then(handleErrors)
        .then((response) => response.json())
        .catch(function (error) {
          console.log(error);
        });
    };

    const setConfig = function (config) {
      return new Promise((resolve, reject) => {
        that.config = config;
        resolve(that.config);
      });
    };

    const getScripts = function (config) {
      if (config && config.js) {
        const requests = config.js.map((url) =>
          loadScript(that.path + url, config?.type)
        );
        return Promise.allSettled(requests).then((results) => {
          const failed = results
            .map((result, index) => ({
              index,
              status: result.status,
              reason: result.reason,
              url: config.js[index],
            }))
            .filter((r) => r.status === "rejected");

          if (failed.length === 1) {
            mviewer.toast(
              "Erreur",
              `Le script <b>${failed[0].url}</b> n'a pas pu être chargé pour le composant ${that.id} :<br />
              <i>${failed[0].reason}</i>`
            );
          } else if (failed.length > 1) {
            mviewer.toast(
              "Erreur",
              `${failed.length} scripts n'ont pu être chargés pour le composant ${that.id} :
              <i>${failed.map((f) => `<i><br />${f.url} - ${f.reason}</i>`)}`
            );
          }
          return results;
        });
      }
    };

    const loadScript = function (src, type = "text/javascript") {
      const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        document.body.appendChild(script);
        script.type = type;
        script.onload = resolve;
        script.onerror = () => {
          reject(new Error(`Failed to load script: ${src}`));
        };
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

    try {
      /* get config.json file */
      const json = await getConfig(this.path);
      /* store json body in config variable */
      const config = await setConfig(json);
      /* download all scripts from config.js array */
      await getScripts(config);
      /* download html file from config.html */
      const text = await getHTML();
      /* store html body in config variable */
      const html = await setHTML(text);
      /* render html body in target element from config.target */
      const target = await render(html);
      /* dispatch componentLoaded event */
      const event = await dispatch();
      if (event) {
        console.log(`${that.id} is successfully loaded`);
      } else {
        console.log(`Error : ${that.id} is not loaded`);
      }
    } catch (e) {
      console.error(`Error loading component ${that.id}:`, e);
    }
  }
}

// this class is necessary to link custom init function to the componentLoaded event
class CustomComponent {
  constructor(id, init) {
    document.addEventListener(`${id}-componentLoaded`, init);
  }
}
