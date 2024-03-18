import {
  loadEnvFile,
  getDefaultEnvPath,
  getDefaultTheme,
} from "./utils";

import { getDefaultConfigPath, loadXmlConfig } from "../utils/configuration";
import Configuration from "../classes/configuration";

const onEnvAvailable = (r) => {
  // set mviewer en from environment file
  mviewer.env = { ...r.detail };
  //get JSON conf from xml;
  var _conf = configuration.parseXML(eData.xml);
  var style = "css/themes/default.css";
  if (!theme && _conf.application.style && _conf.application.style.match("css")) {
    style = _conf.application.style;
  } else if (theme) {
    style = "css/themes/" + theme + ".css";
  }
  $("head").prepend('<link rel="stylesheet" href="' + style + '" type="text/css" />');
  var title = "";
  if (_conf.application.title) {
    title = _conf.application.title;
    $("#loader-subtitle").empty();
    $("#loader-subtitle").append(title);
  }
  if (_conf.application.favicon) {
    let ico = _conf.application.favicon;
    let favicon = document.querySelector('link[rel="icon"]');
    favicon.attributes.href.value = ico;
  }
  configuration.load(_conf);
  $(document).trigger("ready-for-component");
  setTimeout(function () {
    $("#loading-page").hide();
    $("#main").css("opacity", 1).hide();
    $("#main").fadeIn(1500);
    mviewer.getMap().updateSize();
    mviewer.initToolTip();
  }, 2000);
};

const init = async () => {
  const theme = getDefaultTheme();
  const configContent = await loadXmlConfig();
  const configEnv = await loadEnvFile(getDefaultConfigPath()?.replace(".xml", ".json"));
  const defaultEnv = await loadEnvFile(getDefaultEnvPath());

  const config = new Configuration(configContent);
  config.init();
  console.log(config);
  // $("#help").modal("show");

  document.addEventListener("layersLoaded", function (e) {
    mviewer.overLayersReady();
    mviewer.showLayersByAttrOrder(mviewer.getLayersAttribute("rank"));
    mviewer.orderLayerByIndex();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
