import { getComponentProp, getOptions, initDraggable, setComponentProps } from "./utils.js";
import { ID } from "./const.js";
import { initButtonClick, initCapaSeasonButton, initSeasonsButtons } from "./buttons.js";
import { initYearsList } from "./list.js";
import { changeTime, getInfosFromCapaLayers } from "./request-utils.js";
import { changePanelVisibility, initPanel } from "./panel.js";
import { createToolbarButton } from "./toolbarBtn.js";
import { manageOnLayerVisibilityChange } from "./utils.js";


/**
 * Init list and buttons
 * @param {string[]} years 
 * @param {object} seasons 
 */
const initComponents = (years, seasons) => {
  // set default props year and season from config (if exists)
  setComponentProps({
    years: years,
    seasons: seasons
})
  setComponentProps(getOptions()?.default || {});
  // init list years
  initYearsList(years);
  // init buttons
  initSeasonsButtons(seasons);
  // init button clicked
  initButtonClick();
}

/**
 * Main INIT function use by mviewer on extension creation.
 */
const init = async () => {
  const options = getOptions(ID);
  const timePattern = options.timePattern;
  // easyDrag panel
  initDraggable()

  createToolbarButton();
  initPanel();

  // get separator regex
  setComponentProps({ "regex": `(\\d{4})${getOptions().separator}(\\d{2})` });
  if (getOptions().fromCapabilities) {
    const onProcessFinish = () => {
      initComponents(getComponentProp("years"), initCapaSeasonButton());
    }
    getInfosFromCapaLayers(onProcessFinish)
  } else {
    initComponents(options.years, options.seasons);
  }

  // manage panel visibility
  mviewer.customComponents["seasons-selector"].showPanel = changePanelVisibility;
  // init listener on time change
  document.addEventListener("seasonYearChange", (e) => {
    const componentProps = e.detail;
    if (!componentProps.season && componentProps.year) return;
    let value = timePattern.replace("{year}", componentProps.year);
    value = value.replace("{season}", componentProps.season);

    changeTime(value);
  });
  // manage badge on layer visibility change
  manageOnLayerVisibilityChange();
};


new CustomComponent(ID, init);