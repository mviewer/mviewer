var configuration = (function () {
  /**
   * Property: _options
   * XML. The application configuration
   */
  /* INTERNAL */
  var _configuration = null;

  // Mviewer version a saisir manuellement

  var VERSION = "4.2-snapshot";

  var _showhelp_startup = false;

  var _defaultBaseLayer = "";

  var _captureCoordinates = false;

  var _typecoordinate = "";

  var _lang = false;

  var _languages = [];

  /**
   * Property: _crossorigin
   * The crossOrigin attribute for loaded images. Note that you must provide a crossOrigin value
   * if you want to access pixel data with the Canvas renderer for export png for example.
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
   */

  var _crossorigin = null;

  /**
   * Property: _authentification
   * Its possible behind georchestra security-proxy.
   * allows working with protected layers
   */

  var _authentification = { enabled: false };

  /* EXTERNAL */

  /**
   * Property: _themes
   * {object} hash of all overlay Layers (for each sub theme) - static.
   * from mviewer.js
   */

  var _themes = null;

  /**
   * Property: _proxy
   * Ajax proxy to use for crossdomain requests
   * It could be georchestra security-proxy
   */
  var _proxy = "";

  const _blankSrc =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  const vectorLayerType = ["csv", "geojson", "kml"];
  /**
   * Usefull to decode string encoded hex code
   * @param {string} str
   * @returns decoded string
   */
  var _decodeString = (str) => {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
  };

  var _parseXML = function (xml) {
    const _conf = utils.xmlToJson(xml);
    // transtype baselayer, theme, group, layer
    //those types should be array
    //if type is object, push it into new Array
    if (!Array.isArray(_conf.baselayers.baselayer)) {
      _conf.baselayers.baselayer = [_conf.baselayers.baselayer];
    }
    _conf.baselayers = _conf.baselayers;
    if (!Array.isArray(_conf.themes.theme)) {
      if (_conf.themes.theme) {
        _conf.themes.theme = [_conf.themes.theme];
      } else {
        _conf.themes.theme = [];
      }
    }
    if (_conf.themes.theme !== undefined) {
      _conf.themes.theme.forEach(function (theme) {
        if (theme.group) {
          if (!Array.isArray(theme.group)) {
            theme.group = [theme.group];
          }
        } else {
          theme.group = [];
        }
        theme.group
          .filter((gp) => gp?.layer)
          .forEach(function (group) {
            if (!Array.isArray(group.layer)) {
              group.layer = [group.layer];
            }
          });
        if (theme.layer) {
          if (!Array.isArray(theme.layer)) {
            theme.layer = [theme.layer];
          }
        }
      });
    }

    return _conf;
  };

  function loadExtensionScript(src) {
    return new Promise(function (resolve, reject) {
      let script = document.createElement("script");
      script.src = mviewer.ajaxURL(src, false);
      script.onload = () => resolve(script);
      script.onerror = (err) => {
        alert("error extension");
        reject(err);
      };
      document.head.appendChild(script);
    });
  }

  var _getExtensions = function (xmlConf) {
    // load javascript extensions and trigger applicationExtended when all is done
    const extensions = Array.from(
      xmlConf.querySelectorAll("extension[type='javascript']")
    );

    const requests = extensions.map(function (extension) {
      const src = extension.getAttribute("src");
      return loadExtensionScript(src);
    });

    // Lorsque toutes les ressources externes sont récupérées,
    // on déclanche le trigger applicationExtended
    Promise.allSettled(requests).then(function () {
      document.dispatchEvent(
        new CustomEvent("applicationExtended", {
          detail: { xml: xmlConf },
        })
      );
    });

    //load components
    //each component is rendered in Component constructor;
    //When all is done, trigger componentLoaded event
    document.addEventListener("ready-for-component", () => {
      const components = Array.from(
        xmlConf.querySelectorAll("extension[type='component']")
      );
      components.forEach(function (component) {
        const id = component.getAttribute("id");
        const path = component.getAttribute("path");
        if (path && id) {
          mviewer.customComponents[id] = new Component(id, path);
        }
      });
    });
  };

  var _complete = function (conf) {
    /*
     * Des thèmes externes (présents dans d'autres configuration peuvent être automatiquement chargés
     * par référence au fichier xml utilisé (url=) et à l'id de la thématique (id=).
     * Attention si la configuration externe est sur un autre domaine, il faut alors utiliser un proxy Ajax
     * ou alors s'assurer que CORS est activé sur le serveur distant.
     * Les thématiques externes peuvent utiliser des ressources particulières (templates, customLayer, sld...)
     * si les URLs de ces ressources sont absolues et accessibles.
     */

    //Recherche des thématiques externes
    const extraConf = Array.from(conf.querySelectorAll("theme")).filter((theme) => {
      const url = theme.getAttribute("url");
      return theme.getAttribute("id") && url && url.indexOf("http") > -1;
    });

    const requests = Array.from(extraConf).map(function (theme) {
      const url = theme.getAttribute("url");
      const id = theme.getAttribute("id");
      const external_overwrite = {
        name: theme.getAttribute("name"),
        layersvisibility: theme.getAttribute("layersvisibility") || "default",
      };
      let proxy = false;
      const proxyUrl = conf.querySelector("proxy")?.getAttribute("url");
      if (proxyUrl) {
        proxy = proxyUrl;
      }

      return fetch(mviewer.ajaxURL(url, proxy))
        .then((response) => {
          if (!response.ok) throw new Error(`${url} non accessible`);
          return response.text();
        })
        .then((text) => {
          const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
          const node = xmlDoc.querySelector(`theme#${id}`);
          if (node) {
            // overwrite theme name
            node.setAttribute("name", external_overwrite.name);
            // overwrite layers visibility
            if (external_overwrite.layersvisibility === "all") {
              node
                .querySelectorAll("layer")
                .forEach((l) => l.setAttribute("visible", "true"));
            } else if (external_overwrite.layersvisibility === "none") {
              node
                .querySelectorAll("layer")
                .forEach((l) => l.setAttribute("visible", "false"));
            }
            conf.querySelector(`theme#${id}`)?.replaceWith(node);
          } else {
            conf.querySelector(`theme#${id}`)?.remove();
            console.log(`La thématique ${id} n'a pu être trouvée dans ${url}`);
          }
        })
        .catch(() => {
          console.log(`${url} n'est pas accessible. La thématique n'a pu être chargée`);
          conf.querySelector(`theme#${id}`)?.remove();
        });
    });

    Promise.allSettled(requests).then(function () {
      // Lorsque toutes les thématiques externes sont récupérées,
      // on initialise le chargement de l'application avec le trigger configurationCompleted
      document.dispatchEvent(
        new CustomEvent("configurationCompleted", { detail: { xml: conf } })
      );
    });
  };
  /**
   *
   * @param {string} file path
   * @returns Promise
   */
  const _callJsonFile = (file) =>
    fetch(file)
      .then((r) => r)
      .then((r) => r.json());
  /**
   * Set mviewer env values
   * @param {any} d
   */
  const _dispatchCustomEvent = (d) => {
    const envDataReady = new CustomEvent("environementInfosAvailable", { detail: d });
    document.dispatchEvent(envDataReady);
  };
  /**
   * Get env values from file.
   * Default file is located in apps/settings.json and could be overload by [config_name].json file with same name as config.xml file.
   * Default env file could be given by URL like ?env=apps/myApp/myApp.json
   * @param {string} file path
   */
  const _getEnvData = (appsEnvfile, defaultFile) => {
    _callJsonFile(defaultFile)
      .then((defaultEnv) =>
        // if apps env file exists wi overload default apps/settings.json file with .json file with same xml name
        // ex: demo.xml => demo.json
        {
          return (
            _callJsonFile(appsEnvfile)
              .then((appsEnv) => {
                return _dispatchCustomEvent({ ...defaultEnv, ...appsEnv });
              })
              // else finally load only apps/settings.json file is loaded
              .catch((e) => _dispatchCustomEvent(defaultEnv))
          );
        }
      )
      .catch((e) => {
        console.log("Error with default file");
        // if no apps/settings.json file exists we search specific .json file for this context
        _callJsonFile(appsEnvfile)
          .then((appsEnv) => _dispatchCustomEvent(appsEnv))
          .catch((e) => {
            // else, finally load with any env values
            _dispatchCustomEvent({});
          });
      });
  };

  /**
   * From env. file, Get templated string path rendered by Mustache
   * ...and decoded
   * @param {string} str
   * @returns full templated string decoded
   */
  var _renderEnvPath = (str) => {
    if (!str || !mviewer?.env) return;
    return _decodeString(Mustache.render(str, mviewer?.env));
  };

  var _load = function (conf) {
    console.log(`Mviewer version ${VERSION}`);

    // set infos bar text
    document.querySelector("#mviewerinfosbar")?.append(VERSION);

    _configuration = conf;
    utils.testConfiguration(conf);
    //apply application customization
    if (conf.application.lang) {
      // default lang from config file
      var languages = conf.application.lang.split(",");
      if (languages.length > 1) {
        _languages = languages;
      }
      _lang = languages[0];
    }
    if (API.lang && API.lang.length > 0) {
      // apply lang set in URL as param
      _lang = API.lang;
    }
    if (conf.application.title || API.title) {
      var title = API.title || conf.application.title;
      document.title = title;
      title = conf.application.htmltitle || title;
      document.querySelectorAll(".mv-title").forEach((element) => {
        element.replaceChildren();
        element.insertAdjacentHTML("afterbegin", title);
      });
    }
    if (conf.application.stats === "true" && conf.application.statsurl) {
      fetch(`${conf.application.statsurl}?app=${document.title}`);
    }
    if (conf.application.logo) {
      document.querySelectorAll(".mv-logo").forEach((element) => {
        element.setAttribute("src", conf.application.logo);
      });
    }
    if (conf.application.nologo === "true") {
      document.querySelector(".mv-logo").remove();
    }
    if (location.hash && !location.search) {
      document.querySelectorAll(".mv-title, .navbar-brand").forEach((element) => {
        element.setAttribute("href", location.hash);
      });
    }
    if (conf.application.showhelp === "true" && conf.application.help) {
      _showhelp_startup = true;
    }
    if (API.popup) {
      _showhelp_startup = API.popup && API.popup === "true" ? true : false;
      if (API.popup === "true") {
        _showhelp_startup = true;
      } else if (API.popup === "false") {
        _showhelp_startup = false;
      }
    }
    if (!conf.application.help) {
      document.querySelector("#iconhelp")?.remove();
      document.querySelector("#btnHelpMob")?.remove();
    }
    if (conf.application.titlehelp) {
      const helpTitle = document.querySelector("#help h5.modal-title");
      if (helpTitle) helpTitle.textContent = conf.application.titlehelp;
    }
    if (conf.application.iconhelp) {
      document
        .querySelector("#iconhelp i")
        ?.setAttribute("class", conf.application.iconhelp);
    }
    if (conf.application.coordinates === "true") {
      _captureCoordinates = true;
      _typecoordinate = conf.application.coordinatestype || "xy";
    }
    if (conf.application.togglealllayersfromtheme === "true") {
      _toggleAllLayersFromTheme = true;
    }
    if (conf.application.exportpng === "true") {
      _crossorigin = "anonymous";
      document.querySelector("#exportpng")?.style.setProperty("display", "");
    } else {
      document.querySelector("#exportpng")?.remove();
    }
    if (!conf.application.mouseposition || conf.application.mouseposition === "false") {
      document.querySelector("#mouse-position")?.style.setProperty("display", "none");
    }
    if (!conf.application.geoloc || !(conf.application.geoloc === "true")) {
      document.querySelector("#geolocbtn")?.remove();
    }
    if (!conf.application.studio || conf.application.studio === "false") {
      document.querySelector("#studiolink")?.remove();
    }
    if (!conf.application.mapprint || conf.application.mapprint === "false") {
      document.querySelector("#mapprint")?.remove();
    }
    if (conf.application.home) {
      document.querySelectorAll(".mv-logo").forEach((logo) => {
        logo.parentElement?.setAttribute("href", conf.application.home);
      });
    }

    //map options
    _map = mviewer.initMap(conf.mapoptions);

    if (conf.proxy && conf.proxy.url) {
      _proxy = conf.proxy.url;
    }
    if (conf.authentification && conf.authentification.enabled) {
      _authentification.enabled = conf.authentification.enabled === "true" ? true : false;
    }
    if (_authentification.enabled) {
      _authentification.url = conf.authentification.url;
      _authentification.loginurl = conf.authentification.loginurl;
      _authentification.logouturl = conf.authentification.logouturl;
      fetch(_authentification.url, {
        headers: { Accept: "application/json, text/javascript, */*; q=0.01" },
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          return response.json();
        })
        .then(function (response) {
          //test georchestra proxy
          if (response.proxy == "true") {
            document.querySelector("#login-box")?.style.setProperty("display", "");
            document.querySelector("#login-box-mob")?.style.setProperty("display", "");
            let title = mviewer.lang ? mviewer.tr("tbar.right.logout") : "Se déconnecter";
            if (response.user != "") {
              document
                .querySelector("#login")
                ?.setAttribute("href", _authentification.logouturl);
              document
                .querySelector("#login-box-mob")
                ?.setAttribute("href", _authentification.logouturl);
              document.querySelector("#login")?.setAttribute("title", title);
              document.querySelector("#login-box-mob")?.setAttribute("title", title);
              const loginIcon = document.querySelector("#login i");
              if (loginIcon) loginIcon.className = "ri-lock-fill";
              const mobileLoginIcon = document.querySelector("#login-box-mob i");
              if (mobileLoginIcon) mobileLoginIcon.className = "ri-lock-fill";
              const loginUser = document.querySelector("#login-box > span");
              if (loginUser) loginUser.textContent = response.user;
            } else {
              var url = "";
              if (location.search == "") {
                url = _authentification.loginurl;
              } else {
                url = location.href + _authentification.loginurl.replace("?", "&");
              }
              document.querySelector("#login")?.setAttribute("href", url);
              document.querySelector("#login-box-mob")?.setAttribute("href", url);
            }
          } else {
            console.log(
              [
                "mviewer n'a pas détecté la présence du security-proxy georChestra.",
                "L'accès aux couches protégées et à l'authentification n'est donc pas possible",
              ].join("\n")
            );
          }
        })
        .catch((error) => console.error(error));
    }

    //baselayertoolbar
    var baselayerControlStyle = conf.baselayers.style;
    if (baselayerControlStyle === "gallery") {
      document.querySelector("#backgroundlayerstoolbar-default")?.remove();
    } else {
      document.querySelector("#backgroundlayerstoolbar-gallery")?.remove();
    }
    conf.baselayers.baselayer.forEach(function (bl) {
      if (bl.visible === "true") {
        _defaultBaseLayer = bl.id;
      }
      mviewer.createBaseLayer(bl);
      if (baselayerControlStyle === "gallery") {
        document
          .querySelector("#basemapslist")
          ?.insertAdjacentHTML(
            "beforeend",
            Mustache.render(mviewer.templates.backgroundLayerControlGallery, bl)
          );
      }
    });
    if (baselayerControlStyle === "gallery") {
      document.querySelectorAll("#basemapslist li").forEach((element) => {
        new bootstrap.Tooltip(element, {
          placement: "left",
          trigger: "hover",
          html: true,
          container: "body",
          template: mviewer.templates.tooltip,
        });
      });
    }

    _themes = {};
    var themeLayers = {};
    if (API.wmc) {
      var reg = new RegExp("[,]+", "g");
      var wmcs = API.wmc.split(reg);
      var processedWMC = 0;
      var nbOverLayers = 0;

      var requests = [];
      // Récupération des thématiques externes avant de signaler la fin du chargement.
      wmcs.forEach(function (url, idx) {
        var wmcid = `wmc${idx}`;
        requests.push(
          fetch(mviewer.ajaxURL(url, _proxy), {
            headers: { Accept: "application/xml, text/xml, */*; q=0.01" },
          })
            .then((response) => {
              if (!response.ok)
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
              return response.text();
            })
            .then((text) => {
              const xml = new DOMParser().parseFromString(text, "text/xml");
              if (xml.querySelector("parsererror"))
                throw new Error("Invalid XML response");
              return xml;
            })
            .then(function (response) {
              var wmc = mviewer.parseWMCResponse(response, wmcid);
              wmc.layers.forEach(function (layer) {
                mviewer.processLayer(layer, layer.layer);
              });
              processedWMC += 1;
              _themes[wmcid] = {};
              _themes[wmcid].collapsed = false;
              _themes[wmcid].id = wmcid;
              _themes[wmcid].name = wmc.title;
              _themes[wmcid].layers = {};
              _themes[wmcid].icon = "fas fa-chevron-circle-right";
              _map.getView().fit(wmc.extent, {
                size: _map.getSize(),
                padding: [
                  0,
                  document.querySelector("#sidebar-wrapper").offsetWidth,
                  0,
                  0,
                ],
              });
              _themes[wmcid].layers = wmc.layers;
              _themes[wmcid].name = wmc.title;
              nbOverLayers += Object.keys(wmc.layers).length;
            })
            .catch(function (error) {
              console.log(`WMC ${mviewer.ajaxURL(url, _proxy)} not found`);
            })
        );
      });

      Promise.allSettled(requests).then(function () {
        mviewer.events().overLayersTotal = nbOverLayers;
        mviewer.events().confLoaded = true;
      });
    } else if (conf.themes.theme !== undefined) {
      var themes = conf.themes.theme;
      var nbOverLayers = 0;
      themes.forEach(function (theme) {
        if (theme.layer) {
          nbOverLayers += theme.layer.length;
        }
        if (theme.group.length > 0) {
          theme.group.forEach(function (group) {
            if (group.layer && group.layer.length > 0) {
              nbOverLayers += group.layer.length;
            }
          });
        }
      });
      mviewer.events().overLayersTotal = nbOverLayers;
      var layerRank = 0;
      var doublons = {};
      conf.themes.theme.reverse().forEach(function (theme) {
        var themeid = theme.id;
        //test icon value
        // with fontawesome 4.6.3 "school" parameter becomes css classes "fa fa-school"
        // in fontawesome 5.6.3 fa fa-school is deprecated. Use "fas fa-school" instead.
        // to preserve compatibility with fontawesome ol notation, it is necessary to test this value.
        var test = (theme.icon || "fas fa-globe").trim();
        var icon = "";
        if (test.indexOf(".") === 0) {
          // use custom css class to render svg icon for example
          icon = test.substring(1);
        } else if (test.indexOf(" ") > 0) {
          // use 5.6.3 notation eg. "fas fa-school"
          icon = test;
        } else {
          // use 4.6.3 notation eg. "fa fa-school". deprecated.
          icon = `fa fa-${test}`;
        }
        _themes[themeid] = {};
        _themes[themeid].id = themeid;
        _themes[themeid].icon = icon;
        _themes[themeid].name = theme.name;
        _themes[themeid].groups = false;
        // test group
        if (theme.group.length > 0) {
          _themes[themeid].groups = {};
          theme.group.forEach(function (group) {
            _themes[themeid].groups[group.id] = { name: group.name, layers: {} };
          });
        }
        _themes[themeid].layers = {};
        var layers = [];
        if (theme.layer) {
          layers = theme.layer;
        }
        if (theme.group.length > 0) {
          theme.group.forEach(function (group) {
            if (group.layer) {
              group.layer.forEach(function (layer) {
                if (layer) {
                  layer.group = group.id;
                }
              });
              layers = layers.concat(group.layer);
            }
          });
        }
        layers.reverse().forEach(function (layerConfig) {
          const templateData = () => {
            return typeof layerConfig.template === "string"
              ? layerConfig.template
              : {
                  ...layerConfig.template,
                  url: _renderEnvPath(layerConfig.template.url),
                };
          };
          const layer = mviewer?.env
            ? {
                ...layerConfig,
                url: _renderEnvPath(layerConfig.url),
                legendurl: _renderEnvPath(layerConfig.legendurl),
                metadata_csw: _renderEnvPath(layerConfig.metadata_csw),
                metadata: _renderEnvPath(layerConfig.metadata),
                sld:
                  layerConfig.sld &&
                  layerConfig.sld
                    .split(",")
                    .map((sld) => _renderEnvPath(sld))
                    .join(","),
                template: layerConfig.template ? templateData() : "",
              }
            : layerConfig;

          if (!mviewer?.env) {
            console.log("Les variables d'environnement ne peuvent être chargées !");
          }

          if (layer) {
            /* to escape group without layer */
            layerRank += 1;
            var layerId = layer.id;
            if (layer.url) {
              var getCapRequestUrl = getCapUrl(layer.url);
              var secureLayer =
                layer.secure === "true" || layer.secure == "global" ? true : false;
              if (secureLayer) {
                fetch(mviewer.ajaxURL(getCapRequestUrl), {
                  headers: { Accept: "application/xml, text/xml, */*; q=0.01" },
                })
                  .then((response) => {
                    if (!response.ok)
                      throw new Error(`HTTP ${response.status} ${response.statusText}`);
                    return response.text();
                  })
                  .then((text) => {
                    const xml = new DOMParser().parseFromString(text, "text/xml");
                    if (xml.querySelector("parsererror"))
                      throw new Error("Invalid XML response");
                    return xml;
                  })
                  .then(function (result) {
                    //Find layer in capabilities
                    var name = layerId;
                    const layer = Array.from(
                      result.querySelectorAll("Layer > Name")
                    ).find((element) => element.textContent === name);
                    if (!layer) {
                      //remove this layer from map and panel
                      mviewer.deleteLayer(layerId);
                    }
                  })
                  .catch((error) => console.error(error));
              }
            }
            var mvid;
            var oLayer = {};
            Object.assign(oLayer, layer);
            var clean_ident = layerId.replace(/:|,| |\./g, "");
            var _overLayers = mviewer.getLayers();
            if (_overLayers[clean_ident]) {
              doublons[clean_ident] += 1;
              mvid = `${clean_ident}dbl${doublons[clean_ident]}`;
            } else {
              mvid = clean_ident;
              doublons[clean_ident] = 0;
            }
            oLayer.id = mvid;
            oLayer.icon = icon;
            oLayer.layername = layerId;
            oLayer.type = layer.type || "wms";
            if (layer.servertype) {
              const serverType = layer.servertype.toString().trim().toLowerCase();
              if (["qgis", "geoserver", "ogc"].includes(serverType)) {
                oLayer.servertype = serverType;
              }
            }
            oLayer.theme = themeid;
            oLayer.rank = layerRank;
            oLayer.index = layer.index ? parseFloat(layer.index) : null;
            oLayer.title = layer.name;
            oLayer.layerid = mvid;
            oLayer.infospanel = layer.infopanel || "right-panel";
            //styles
            if (layer.style && layer.style !== "") {
              var styles = layer.style.split(",");
              oLayer.style = styles[0];
              if (styles.length > 1) {
                oLayer.styles = styles.toString();
              }
            } else {
              oLayer.style = "";
            }
            oLayer.sld = layer.sld || null;
            //slds
            if (oLayer.sld) {
              var styles = layer.sld.split(",");
              //default style is the first
              oLayer.sld = styles[0];
              // test if multi styles
              if (styles.length > 1) {
                oLayer.styles = styles.toString();
              }
            }
            if (layer.stylesalias && layer.stylesalias !== "") {
              oLayer.stylesalias = layer.stylesalias;
            } else {
              if (oLayer.styles) {
                if (oLayer.styles.search("http") >= 0) {
                  var sldaliases = [];
                  var regex = /[^/]+$/i;
                  oLayer.styles.split(",").forEach(function (sld, i) {
                    sldaliases.push(regex.exec(sld)[0].split("@")[0]);
                  });
                  oLayer.stylesalias = sldaliases.join(",");
                } else {
                  oLayer.stylesalias = oLayer.styles;
                }
              }
            }
            oLayer.toplayer = layer.toplayer === "true" ? true : false;
            oLayer.draggable = true;
            if (oLayer.toplayer) {
              mviewer.setTopLayer(oLayer.id);
              oLayer.draggable = false;
            }
            oLayer.opacity = parseFloat(layer.opacity || "1");
            oLayer.maxzoom = parseInt(layer.maxzoom);
            oLayer.minzoom = parseInt(layer.minzoom);
            oLayer.tooltip = layer.tooltip === "true" ? true : false;
            oLayer.tooltipenabled = layer.tooltipenabled === "true" ? true : false;
            oLayer.tooltipcontent = layer.tooltipcontent ? layer.tooltipcontent : "";
            oLayer.expanded = layer.expanded === "true" ? true : false;
            oLayer.timefilter =
              layer.timefilter && layer.timefilter === "true" ? true : false;
            if (oLayer.timefilter && layer.timeinterval) {
              oLayer.timeinterval = layer.timeinterval || "day";
            }
            oLayer.timecontrol = layer.timecontrol || "calendar";
            oLayer.timeshowavailable = layer.timeshowavailable === "true";
            if (layer.timevalues && layer.timevalues.search(",")) {
              oLayer.timevalues = layer.timevalues.split(",");
            }
            oLayer.timemin = layer.timemin || new Date().getFullYear() - 5;
            oLayer.timemax = layer.timemax || new Date().getFullYear();

            oLayer.attributefilter =
              layer.attributefilter && layer.attributefilter === "true" ? true : false;
            oLayer.attributeoperator = layer.attributeoperator || "=";
            oLayer.wildcardpattern = layer.wildcardpattern || "%value%";
            if (layer.attributevalues && layer.attributevalues.search(",")) {
              oLayer.attributevalues = layer.attributevalues.split(",");
            }
            oLayer.attributestylesync =
              layer.attributestylesync && layer.attributestylesync === "true"
                ? true
                : false;
            oLayer.attributefilterenabled =
              layer.attributefilterenabled && layer.attributefilterenabled === "true"
                ? true
                : false;
            if (
              oLayer.attributestylesync &&
              oLayer.attributefilterenabled &&
              oLayer.attributevalues
            ) {
              if (oLayer.style) {
                oLayer.style = [
                  oLayer.style.split("@")[0],
                  "@",
                  oLayer.attributevalues[0].sansAccent().toLowerCase(),
                ].join("");
              } else if (oLayer.sld) {
                oLayer.sld = [
                  oLayer.sld.split("@")[0],
                  "@",
                  oLayer.attributevalues[0].sansAccent().toLowerCase(),
                  ".sld",
                ].join("");
              }
            }
            oLayer.customcontrol = layer.customcontrol === "true" ? true : false;
            oLayer.customcontrolpath = layer.customcontrolpath || "demo/customcontrols";
            oLayer.metadatacsw = layer["metadata_csw"];
            if (oLayer.metadata) {
              oLayer.summary =
                '<a href="' + oLayer.metadata + '" target="_blank">En savoir plus</a>';
            }
            //Mustache template
            if (layer.template && layer.template.url) {
              /* if there are multiple languages, the user then has 2 possibilities:
                    a - provide a template local file for each language,
                        + ie: directory/template_fr.mst, directory/template_en.mst
                        + the given url will be directory/template
                        + ie: directory/template?lang=fr
                        + the given url will be directory/template
                */

              /* to implement this i will add template_{lang} field to the layer object
                in any case, the system will try to find all the templates and save them in the layer properties
                */

              const languages = configuration.getLanguages();

              // used jquery validator's url regex
              const isUrl = (str) =>
                str.match(
                  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                ) !== null;
              const uniqLang = configuration.getLang().length === 1;
              if (uniqLang || layer.template.url.endsWith(".mst")) {
                //NORMAL CASE, conditions: [mst extension at the end of the url]"
                fetch(mviewer.ajaxURL(layer.template.url, _proxy))
                  .then((response) => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.text();
                  })
                  .then((template) => {
                    oLayer.template = template;
                  });
              } else {
                languages.forEach(function (lang) {
                  let correctUrl = isUrl(layer.template.url);
                  var template_url_field_name = `template_${lang}`;
                  let template_url = utils.getTemplateUrl(lang, layer, correctUrl);
                  fetch(mviewer.ajaxURL(template_url, _proxy))
                    .then((response) => {
                      if (!response.ok) throw new Error(response.statusText);
                      return response.text();
                    })
                    .then((template) => {
                      oLayer[template_url_field_name] = template;
                    })
                    .catch(() => {
                      const msg = correctUrl
                        ? `failed to load ${lang} template through api`
                        : `failed to load ${lang} template through filesystem`;
                      console.log(msg);
                    });
                });
              }
            } else {
              oLayer.template = layer?.template || false;
            }
            oLayer.queryable = layer.queryable === "true" ? true : false;
            oLayer.exclusive = layer.exclusive === "true" ? true : false;
            oLayer.searchable = layer.searchable === "true" ? true : false;
            if (oLayer.searchable) {
              oLayer = search.configSearchableLayer(oLayer, layer);
            }
            // ->- sensorthings params
            oLayer.top = layer?.top;
            oLayer.defaultSensor = layer?.defaultSensor;
            oLayer.selector = layer.selector;
            oLayer.datastreamsfilter = layer.datastreamsfilter;
            oLayer.multidatastreamsfilter = layer.multidatastreamsfilter;
            // -X- sensorthings params
            oLayer.checked = layer.visible === "true" ? true : false;
            oLayer.visiblebydefault = oLayer.checked ? true : false;
            oLayer.tiled = layer.tiled === "true" ? true : false;
            oLayer.xyz = layer.xyz === "true" ? true : false;
            oLayer.dynamiclegend = layer.dynamiclegend === "true" ? true : false;
            oLayer.vectorlegend = layer.vectorlegend === "true" ? true : false;
            oLayer.nohighlight =
              layer.type === "sensorthings"
                ? "false"
                : layer.nohighlight === "true"
                  ? true
                  : false;
            oLayer.infohighlight =
              layer.type === "sensorthings" || layer.infohighlight === "false"
                ? false
                : true;
            oLayer.showintoc =
              layer.showintoc && layer.showintoc === "false" ? false : true;
            oLayer.legendurl = layer.legendurl
              ? layer.legendurl
              : mviewer.getLegendUrl(oLayer);
            if (oLayer.legendurl === "false") {
              oLayer.legendurl = "";
            }
            oLayer.useproxy = layer.useproxy === "true" ? true : false;
            if (layer.fields) {
              oLayer.fields = layer.fields.split(",");
              if (layer.aliases) {
                oLayer.aliases = layer.aliases.split(",");
              } else {
                oLayer.aliases = layer.fields.split(",");
              }
            }

            if (layer.jsonfields) {
              oLayer.jsonfields = layer.jsonfields.split(",");
            } else {
              oLayer.jsonfields = [];
            }

            if (layer.scalemin || layer.scalemax) {
              oLayer.scale = {};
              if (layer.scalemin) {
                oLayer.scale.min = parseInt(layer.scalemin);
              }
              if (layer.scalemax) {
                oLayer.scale.max = parseInt(layer.scalemax);
              }
            }
            oLayer.secure = layer.secure || "public";

            oLayer.authentification = layer.authentification === "true" ? true : false;
            if (layer.authorization) {
              sessionStorage.removeItem(oLayer.url);
              if (layer.authorization != "")
                sessionStorage.setItem(oLayer.url, layer.authorization);
            }

            if (oLayer.customcontrol) {
              var customcontrolpath = oLayer.customcontrolpath;
              fetch(`${customcontrolpath}/${oLayer.id}.js`)
                .then((response) => {
                  if (!response.ok)
                    throw new Error(`HTTP ${response.status} ${response.statusText}`);
                  return response.text();
                })
                .then((source) => {
                  const script = document.createElement("script");
                  script.textContent = source;
                  document.head.appendChild(script);
                  script.remove();
                })
                .then(function () {
                  fetch(`${customcontrolpath}/${oLayer.id}.html`)
                    .then((response) => {
                      if (!response.ok)
                        throw new Error(`HTTP ${response.status} ${response.statusText}`);
                      return response.text();
                    })
                    .then(function (html) {
                      mviewer.customControls[oLayer.id].form = html;
                      const layerDetails = document.querySelector(
                        `.mv-layer-details[data-layerid="${oLayer.id}"]`
                      );
                      if (layerDetails) {
                        //append the existing mv-layers-details panel
                        layerDetails
                          .querySelector(".mv-custom-controls")
                          ?.insertAdjacentHTML("beforeend", html);
                        mviewer.customControls[oLayer.id].init();
                      }
                    })
                    .catch((error) => console.error(error));
                })
                .catch(function (error) {
                  alert("error customControl");
                });
            }

            themeLayers[oLayer.id] = oLayer;
            var l = null;
            if (oLayer.type === "vector-tms") {
              let defaultZoom = {};
              if (oLayer.maxzoom) {
                defaultZoom.maxZoom = oLayer.maxzoom;
              }
              if (oLayer.minzoom) {
                defaultZoom.minZoom = oLayer.minzoom;
              }
              let vecLayer = new ol.layer.VectorTile({
                opacity: oLayer.opacity,
                title: layer.name,
                source: new ol.source.VectorTile({
                  url: oLayer.url,
                  format: new ol.format.MVT(),
                  ...defaultZoom,
                }),
                declutter: configurationUtils.normalizeDeclutter(oLayer.declutter, false),
              });
              l = vecLayer;

              if (oLayer.styleurl) {
                fetch(oLayer.styleurl).then(function (response) {
                  response.json().then(function (glStyle) {
                    let filter = layer.filterstyle ? layer.filterstyle.split(",") : [];
                    let newStyles = {
                      ...glStyle,
                      layers: glStyle.layers.filter(
                        (lyr) => !filter.includes(lyr["source-layer"])
                      ),
                    };
                    olms.applyStyle(vecLayer, newStyles, layerConfig.style);
                  });
                });
              }
              mviewer.processLayer(oLayer, vecLayer);
            }
            if (oLayer.type === "wms") {
              _processWmsLayer(oLayer);
            } //end wms
            if (oLayer.type === "geojson" || (oLayer.type === "csv" && Papa?.parse)) {
              let geoJsonVectorOptions = {
                url: layer.url,
                format: new ol.format.GeoJSON(),
              };
              // if CSV type, we need to parse it and convert to GeoJSON
              if (oLayer.type === "csv") {
                geoJsonVectorOptions = {
                  loader: function (extent, resolution, projection) {
                    const fetchOptions = {};
                    if (layer.secure === "apikey") {
                      const apiKey = sessionStorage.getItem(`${layer.url}:api-key`);
                      if (apiKey)
                        fetchOptions.headers = { Authorization: `Bearer ${apiKey}` };
                    }
                    let requestUrl = layer.url;
                    const proxyUrl =
                      layer.proxyurl || (layer.useproxy === "true" ? _proxy : "");
                    if (proxyUrl) {
                      const externalUrl = new URL(layer.url);
                      requestUrl = `${proxyUrl.replace(/\/$/, "")}${externalUrl.pathname}${externalUrl.search}`;
                    }
                    fetch(requestUrl, fetchOptions)
                      .then((response) => {
                        if (!response.ok) {
                          const error = new Error(`HTTP ${response.status}`);
                          error.status = response.status;
                          throw error;
                        }
                        if (!layer.encoding) {
                          // default fetch UTF-8 encoding
                          return response.text();
                        }
                        return response
                          .arrayBuffer()
                          .then((buffer) =>
                            new TextDecoder(layer.encoding).decode(buffer)
                          );
                      })
                      .then((csv) => {
                        if (!csv.trim()) {
                          const error = new Error("Empty CSV");
                          error.code = "empty-csv";
                          throw error;
                        }
                        Papa.parse(csv, {
                          header: true,
                          skipEmptyLines: true,

                          complete: (result) => {
                            const geoJSON = new ol.format.GeoJSON();
                            const wkt = new ol.format.WKT();
                            const features = [];
                            const dataProjection = oLayer.srs || "EPSG:4326";
                            result.data.forEach((row) => {
                              let geometry;
                              if (!layer.geojsonField) {
                                const lon = parseFloat(row[layer.xfield || "longitude"]);
                                const lat = parseFloat(row[layer.yfield || "latitude"]);
                                if (Number.isFinite(lon) && Number.isFinite(lat)) {
                                  geometry = new ol.geom.Point(
                                    ol.proj.transform(
                                      [lon, lat],
                                      dataProjection,
                                      projection
                                    )
                                  );
                                }
                              } else {
                                // Read geometry from a GeoJSON or WKT field
                                const geomField = row[layer.geojsonField];
                                if (geomField) {
                                  try {
                                    // automatic geojson ok WKT format detection from field content
                                    geometry = geomField.trim().startsWith("{")
                                      ? geoJSON.readGeometry(geomField, {
                                          dataProjection: dataProjection,
                                          featureProjection: projection,
                                        })
                                      : wkt.readGeometry(geomField, {
                                          dataProjection: dataProjection,
                                          featureProjection: projection,
                                        });
                                  } catch (error) {
                                    console.warn("Unable to read CSV geometry", error);
                                  }
                                }
                              }
                              // create feature only if geometry is valid
                              if (geometry) {
                                const properties = { ...row };
                                // reserved openLayers field name
                                delete properties.geometry;
                                const feature = new ol.Feature(properties);
                                feature.setGeometry(geometry);
                                features.push(feature);
                              }
                            });
                            if (features.length === 0) {
                              mviewer.toast(
                                "<i class='fas fa-exclamation-triangle'></i> " +
                                  mviewer.tr("layer.csv.error.empty.title"),
                                mviewer.tr("layer.csv.error.empty.message") +
                                  ` <strong>${oLayer.id}</strong>`,
                                "text-bg-warning"
                              );
                              return;
                            }
                            // add features to the vector source
                            this.addFeatures(features);
                          },
                        });
                      })
                      .catch((error) => {
                        console.error("Error occurred while fetching CSV data:", error);
                        if (error.status === 404) {
                          mviewer.toast(
                            "<i class='fas fa-exclamation-triangle'></i> " +
                              mviewer.tr("layer.csv.error.not_found.title"),
                            mviewer.tr("layer.csv.error.not_found.message") +
                              ` <strong>${oLayer.id}</strong>`,
                            "text-bg-warning"
                          );
                          return;
                        } else if (error.code === "empty-csv") {
                          mviewer.toast(
                            "<i class='fas fa-exclamation-triangle'></i> " +
                              mviewer.tr("layer.csv.error.empty.title"),
                            mviewer.tr("layer.csv.error.empty.message") +
                              ` <strong>${oLayer.id}</strong>`,
                            "text-bg-warning"
                          );
                          return;
                        } else if (error.status === 403) {
                          mviewer.toast(
                            "<i class='fas fa-ban'></i> " +
                              mviewer.tr("layer.csv.error.access.title"),
                            mviewer.tr("layer.csv.error.access.message") +
                              ` <strong>${oLayer.id}</strong>`,
                            "text-bg-danger"
                          );
                          return;
                        } else if (!error.status && error instanceof TypeError) {
                          mviewer.toast(
                            "<i class='fas fa-exclamation-triangle'></i> " +
                              mviewer.tr("layer.csv.error.cors.title"),
                            mviewer.tr("layer.csv.error.cors.message") +
                              ` <strong>${oLayer.id}</strong>`,
                            "text-bg-danger"
                          );
                        } else {
                          mviewer.toast(
                            "<i class='fas fa-exclamation-triangle'></i> " +
                              mviewer.tr("layer.csv.error.title"),
                            mviewer.tr("layer.csv.error.message") +
                              ` <strong>${oLayer.id}</strong>`,
                            "text-bg-warning"
                          );
                        }
                      });
                  },
                };
              }
              // create vector layer with geojson source
              l = new ol.layer.Vector({
                source: new ol.source.Vector(geoJsonVectorOptions),
                declutter: configurationUtils.normalizeDeclutter(oLayer.declutter, false),
              });
              // set default style if defined in configuration
              if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                l.setStyle(mviewer.featureStyles[oLayer.style]);
              }
              mviewer.processLayer(oLayer, l);
              if (vectorLayerType.includes(oLayer.type) && oLayer.sld) {
                oLayer.sldStylePromise = utils.sldFile2VectorLayer(oLayer.sld, oLayer.id);
                oLayer.sldStylePromise.catch((error) => {
                  console.error(
                    `Unable to apply SLD style for layer ${oLayer.id}:`,
                    error
                  );
                });
              }
            } // end geojson
            // ->- sensortings layer
            if (oLayer.type === "sensorthings") {
              l = new Sensorthings(oLayer);
            }
            // -X- sensortings layer
            if (oLayer.type === "kml") {
              l = new ol.layer.Vector({
                source: new ol.source.Vector({
                  url: layer.url,
                  format: new ol.format.KML(),
                }),
                declutter: configurationUtils.normalizeDeclutter(oLayer.declutter, false),
              });
              mviewer.processLayer(oLayer, l);
              if (oLayer.sld) {
                oLayer.sldStylePromise = utils.sldFile2VectorLayer(oLayer.sld, oLayer.id);
                oLayer.sldStylePromise.catch((error) => {
                  console.error(
                    `Unable to apply SLD style for layer ${oLayer.id}:`,
                    error
                  );
                });
              }
            } // end kml

            if (oLayer.type === "import") {
              l = _createVectorLayer(oLayer, layer);
            } // end import

            if (oLayer.type === "customlayer") {
              var hook_url = `demo/customlayers/${oLayer.id}.js`;
              if (oLayer.url && oLayer.url.slice(-3) === ".js") {
                hook_url = oLayer.url;
              }
              fetch(mviewer.ajaxURL(hook_url))
                .then((response) => {
                  if (!response.ok)
                    throw new Error(`HTTP ${response.status} ${response.statusText}`);
                  return response.text();
                })
                .then((source) => {
                  const script = document.createElement("script");
                  script.textContent = source;
                  document.head.appendChild(script);
                  script.remove();
                })
                .then(function () {
                  if (mviewer.customLayers[oLayer.id].layer) {
                    var l = mviewer.customLayers[oLayer.id].layer;
                    if (oLayer.style && mviewer.featureStyles[oLayer.style]) {
                      l.setStyle(mviewer.featureStyles[oLayer.style]);
                    }
                    mviewer.processLayer(oLayer, l);
                  }
                })
                .catch(function (error) {
                  console.log(`error with custom Layer ${oLayer.id} : ${error}`);
                });
            }
            if (layer.group) {
              _themes[themeid].groups[layer.group].layers[oLayer.id] = oLayer;
            } else {
              _themes[themeid].layers[oLayer.id] = oLayer;
            }
          }
        }); //fin each layer
      }); // fin each theme
    } // fin de else

    //Export PNG
    if (conf.application.exportpng === "true" && document.getElementById("exportpng")) {
      var exportPNGElement = document.getElementById("exportpng");
      if ("download" in exportPNGElement) {
        var exportPngReady = false;
        exportPNGElement.addEventListener(
          "click",
          function (e) {
            if (exportPngReady) {
              exportPngReady = false;
              return;
            }

            e.preventDefault();
            _map.once("rendercomplete", function () {
              try {
                var mapCanvas = document.createElement("canvas");
                var size = _map.getSize();
                mapCanvas.width = size[0];
                mapCanvas.height = size[1];
                var mapContext = mapCanvas.getContext("2d");
                Array.prototype.forEach.call(
                  document.querySelectorAll(".ol-layer canvas"),
                  function (canvas) {
                    if (canvas.width > 0) {
                      mapContext.globalAlpha = 1;
                      var transform = canvas.style.transform;
                      // Get the transform parameters from the style's transform matrix
                      var matrix = transform
                        ? transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(",")
                            .map(Number)
                        : [1, 0, 0, 1, 0, 0];
                      // Apply the transform to the export map context
                      CanvasRenderingContext2D.prototype.setTransform.apply(
                        mapContext,
                        matrix
                      );
                      mapContext.drawImage(canvas, 0, 0);
                    }
                  }
                );
                exportPNGElement.href = mapCanvas.toDataURL("image/png");
                exportPngReady = true;
                exportPNGElement.click();
              } catch (err) {
                mviewer.alert(err, "alert-info");
              }
            });
            _map.render();
          },
          false
        );
      } else {
        document.querySelector("#exportpng")?.style.setProperty("display", "none");
      }
    } else {
      document.querySelector("#exportpng")?.style.setProperty("display", "none");
    }

    // Infos de connexion pour les couches à accès restreint
    document.querySelector("#savelogin").addEventListener("click", function () {
      var _service_url = document.querySelector("#service-url").value;
      var _layer_id = document.querySelector("#layer-id").value;
      sessionStorage.removeItem(_service_url);
      if (mviewer.getLayers()[_layer_id].secure === "apikey") {
        const apiKey = document.querySelector("#api-key").value;
        const apiKeyStorageKey = `${_service_url}:api-key`;
        sessionStorage.removeItem(apiKeyStorageKey);
        if (apiKey) sessionStorage.setItem(apiKeyStorageKey, apiKey);
      } else {
        const user = document.querySelector("#user").value;
        const password = document.querySelector("#pass").value;
        if (user != "" && password != "")
          sessionStorage.setItem(_service_url, `${user}:${password}`);
      }

      bootstrap.Modal.getOrCreateInstance(document.querySelector("#loginpanel")).hide();
      // Refresh du layer
      _map.getLayers().forEach(function (lyr) {
        if (_layer_id == lyr.get("mviewerid")) {
          lyr.getSource().refresh();
        }
      });
    });

    //mviewer.init();
    if (!API.wmc && nbOverLayers === 0) {
      mviewer.init();
      mviewer.setBaseLayer(_defaultBaseLayer);
    }

    if (_showhelp_startup && localStorage.getItem("helpCheckBox") !== "true") {
      bootstrap.Modal.getOrCreateInstance(document.querySelector("#help")).show();
    }

    if (!API.wmc) {
      mviewer.events().confLoaded = true;
    }
  };

  var _processWmsLayer = function (oLayer) {
    var wms_params = {
      LAYERS: oLayer.layername,
      STYLES: oLayer.style ? oLayer.style : "",
      FORMAT: "image/png",
      TRANSPARENT: true,
    };
    var source;
    var attributeOgcFilter = null;
    if (oLayer.filter) {
      mviewer.setWmsFilterParam(oLayer, wms_params, oLayer.filter);
    }
    if (
      oLayer.attributefilter &&
      oLayer.attributefilterenabled &&
      oLayer.attributevalues.length > 1
    ) {
      var attributeValue = oLayer.attributevalues[0];
      if (attributeValue !== "all") {
        var operator = oLayer.attributeoperator;
        var ogcOperator = null;
        if (operator == "=") {
          ogcOperator = "EqualTo";
        } else if (operator == "like") {
          ogcOperator = "isLike";
        } else if (operator == "<") {
          ogcOperator = "lessThan";
        } else if (operator == ">") {
          ogcOperator = "GreatherThan";
        } else if (operator == "<=") {
          ogcOperator = "LessThanOrEqualTo";
        } else if (operator == ">=") {
          ogcOperator = "GreaterThanOrEqualTo";
        } else if (operator == "!=" || operator == "<>") {
          ogcOperator = "NotEqualTo";
        }
        if (ogcOperator) {
          var filterDefinition = {
            operator: ogcOperator,
            field: oLayer.attributefield,
            value: attributeValue,
          };
          if (ogcOperator === "isLike") {
            var pattern = oLayer.wildcardpattern || "%value%";
            filterDefinition.pattern = pattern.replace("value", attributeValue);
          }
          attributeOgcFilter = buildOgcFilter(filterDefinition);
        }
      }
    }
    if (oLayer.sld) {
      wms_params["SLD"] = oLayer.sld;
    }

    // Use owsoptions to overload default Getmap params
    Object.assign(wms_params, getParamsFromOwsOptionsString(oLayer.owsoptions));

    function customWmsImageLoader(image, src) {
      if (oLayer.useproxy) {
        src = _proxy + encodeURIComponent(src);
      }

      // S'il existe des idenfiants d'accès pour ce layer, on les injecte
      var _ba_ident = sessionStorage.getItem(oLayer.url);
      if (_ba_ident && _ba_ident != "") {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open("GET", src);

        xhr.setRequestHeader("Authorization", `Basic ${window.btoa(_ba_ident)}`);
        xhr.addEventListener("loadend", function (evt) {
          var data = this.response;
          if (this.status == "401") {
            image.getImage().src = _blankSrc;
          } else if (data && data !== undefined) {
            image.getImage().src = URL.createObjectURL(data);
          }
        });
        xhr.onload = function () {
          image.getImage().src = src;
        };
        xhr.send();
      } else {
        image.getImage().src = src;
      }
    }

    function customXyzTileLoader(tile, src) {
      if (oLayer.useproxy) {
        src = _proxy + encodeURIComponent(src);
      }

      var _ba_ident = sessionStorage.getItem(oLayer.url);
      if (_ba_ident && _ba_ident != "") {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open("GET", src);

        xhr.setRequestHeader("Authorization", `Basic ${window.btoa(_ba_ident)}`);
        xhr.addEventListener("loadend", function () {
          var data = this.response;
          if (this.status == "401") {
            tile.getImage().src = _blankSrc;
          } else if (data && data !== undefined) {
            tile.getImage().src = URL.createObjectURL(data);
          }
        });
        xhr.onload = function () {
          tile.getImage().src = src;
        };
        xhr.send();
      } else {
        tile.getImage().src = src;
      }
    }

    if (oLayer.xyz) {
      source = new ol.source.XYZ({
        url: oLayer.url,
        crossOrigin: _crossorigin,
        tileLoadFunction: customXyzTileLoader,
      });
      l = new ol.layer.Tile({
        source: source,
      });
      oLayer.queryable = false;
    } else {
      switch (oLayer.tiled) {
        case true:
          wms_params["TILED"] = true;
          source = new ol.source.TileWMS({
            url: oLayer.url,
            crossOrigin: _crossorigin,
            tileLoadFunction: customWmsImageLoader,
            params: wms_params,
          });
          if (oLayer.servertype) {
            source.set("servertype", oLayer.servertype);
          }

          l = new ol.layer.Tile({
            source: source,
          });
          break;

        case false:
          source = new ol.source.ImageWMS({
            url: oLayer.url,
            crossOrigin: _crossorigin,
            imageLoadFunction: customWmsImageLoader,
            params: wms_params,
          });
          if (oLayer.servertype) {
            source.set("servertype", oLayer.servertype);
          }

          l = new ol.layer.Image({
            source: source,
          });
          break;
      }
    }

    if (attributeOgcFilter && !oLayer.xyz) {
      updateOgcSourceWithFilter(attributeOgcFilter, source);
    }

    source.set("layerid", oLayer.layerid);
    source.on("imageloadstart", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "");
    });

    source.on("imageloadend", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "none");
    });

    source.on("imageloaderror", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "none");
    });
    source.on("tileloadstart", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "");
    });

    source.on("tileloadend", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "none");
    });

    source.on("tileloaderror", function (event) {
      document
        .querySelector(`#loading-${event.target.get("layerid")}`)
        ?.style.setProperty("display", "none");
    });
    mviewer.processLayer(oLayer, l);
  };

  const _createVectorLayer = (oLayer, layer) => {
    console.log(oLayer);
    const conf = configuration.getConfiguration();
    const vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      declutter: configurationUtils.normalizeDeclutter(oLayer.declutter, false),
    });
    if (layer.projections) {
      oLayer.projections = layer.projections;
    }
    if (layer.geocodingfields) {
      oLayer.geocodingfields = layer.geocodingfields.split(",");
    }
    oLayer.geocoder = layer.geocoder || false;
    oLayer.geocoderurl = layer.geocoderurl || false;

    // allow transformation to mapProjection before map is initialized
    oLayer.mapProjection = conf.mapoptions.projection;
    mviewer.processLayer(oLayer, vectorLayer);
    return vectorLayer;
  };

  return {
    parseOwsOptions: getParamsFromOwsOptionsString,
    parseXML: _parseXML,
    getExtensions: _getExtensions,
    load: _load,
    complete: _complete,
    processWmsLayer: _processWmsLayer,
    getThemes: function () {
      return _themes;
    },
    getDefaultBaseLayer: function () {
      return _defaultBaseLayer;
    },
    getProxy: function () {
      return _proxy;
    },
    getCrossorigin: function () {
      return _crossorigin;
    },
    getCaptureCoordinates: function () {
      return _captureCoordinates;
    },
    getTypeCoordinates: function () {
      return _typecoordinate;
    },
    getConfiguration: function () {
      return _configuration;
    },
    getLang: function () {
      return _lang;
    },
    getLanguages: function () {
      return _languages;
    },
    setLang: function (lang) {
      _lang = lang;
      mviewer.lang.lang = lang;
    },
    getEnvData: _getEnvData,
    renderEnvPath: _renderEnvPath,
    createVectorLayer: _createVectorLayer,
  };
})();
