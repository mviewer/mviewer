import { ID } from "./const.js";
import { createOrRemoveLayerBadge } from "./badge.js";

/**
 * Get component options by mviewer application id
 * @returns 
 */
export const getOptions = () => {
    const mviewerId = configuration.getConfiguration().application.id;
    const options = mviewer.customComponents?.[ID]?.config.options;
    return options[mviewerId];
};


/**
 * Init drag & drop behavior
 */
export const initDraggable = () => {
    // Add draggable on panel
    $(`#seasonPanel`).easyDrag({
        handle: ".seasonPanelHeader",
        container: $("#map"),
        stop: panelDragPosControl
    });
}

/**
 * This function avoid to losse panel under navbar
 */
export const panelDragPosControl = () => {
    const navBarClientInfos = document.querySelector("#mv-navbar").getBoundingClientRect();
    const panelDragClientInfos = document.querySelector("#seasonPanel").getBoundingClientRect();
    let minYNavBar = navBarClientInfos.height + navBarClientInfos.top;
    let isUnderNavbar = panelDragClientInfos.top < minYNavBar;
    if (isUnderNavbar) {
        document.querySelector("#seasonPanel").style.top = (minYNavBar + 5) + "px";
    }
}

/**
 * Create and dispatch custom event
 * @param {string} name event name to listen
 * @param {object} body to pass inside event
 */
export const createDispatchEvent = (name, body) => {
    const customEvt = new CustomEvent(name, {
        detail: body,
    });
    document.dispatchEvent(customEvt)
}

/**
 * Set shared properties object
 * @param {object} props 
 */
export const setComponentProps = (props) => {
    const defaultProps = mviewer.customComponents["seasons-selector"].props;
    // new props override old props
    mviewer.customComponents["seasons-selector"].props = { ...defaultProps, ...props };
}

/**
 * Get properties object for this component
 * @returns 
 */
export const getComponentProps = () => {
    return mviewer.customComponents["seasons-selector"].props;
}

/**
 * Get component shared property by key
 * @param {string} name to return props by key name
 * @returns 
 */
export const getComponentProp = (name) => {
    return mviewer.customComponents["seasons-selector"].props[name];
}


/**
 * update time and badge on layer visibility change
 */
export const manageOnLayerVisibilityChange = () => {
    // display or hide badge on layer visibility change
mviewer.getMap().getLayers().getArray().forEach(layer => {
  const mviewerid = layer.get("mviewerid");
  if(mviewerid  && getOptions().layersId.includes(mviewerid)) {
    layer.on("change:visible", (onChange) => {
        // add or update badge
        createOrRemoveLayerBadge(onChange.target);
        // change TIME param
        createDispatchEvent("seasonYearChange", getComponentProps());
    })
  };
});
}