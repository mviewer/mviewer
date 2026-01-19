import { getSeasonInfoByValue } from "./request-utils.js";
import {getComponentProp, getOptions} from "./utils.js";

/**
 * Create a badge as HTML Node ready to insert
 * @param {string} value 
 * @returns HTML node
 */
const badgeHtml = (value) => {
    const row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("rowBadges");
    row.insertAdjacentHTML("beforeend",
    `<div class="col-md-12">
        <span class="badge seasonBadge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path
                    d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z">
                </path>
            </svg>
            ${value}
        </span>
    </div>`);

    return row;
}


/**
 * Remove all badges
 */
export const removeAllBadges = () => {
    document.querySelectorAll(".rowBadges").forEach(r => r.remove());
}
    

/**
 * Create badge by layer
 * @param {string} value 
 * @param {string} layerId 
 */
export const createBadgeByLayer = (value, layerId) => {
    const legendLayerBloc = document.querySelector(`li.list-group-item[data-layerid="${layerId}"]`);
    if(legendLayerBloc) {
        const legendLayerTitleNode = legendLayerBloc.querySelector('.layerdisplay-title');
        const badge = badgeHtml(value);
        legendLayerTitleNode.after(badge);
    }
}

/**
 * Create badge for each visible layers
 * @param {string} value 
 */
export const createBadges = (value) => {
    removeAllBadges();
    const layersId = getOptions().layersId;
    layersId.forEach(layerId => {
        if(mviewer.getLayer(layerId)?.layer?.getVisible?.()) {
            createBadgeByLayer(value, layerId);
        }
    })
}

/**
 * Get badge value according to selected year and season
 * @returns string
 */
export const getBadgeValue = () => {
    const year = getComponentProp("year");
    const season = getComponentProp("season");
    if(!year || !season) return "";
    return `${year} - ${getSeasonInfoByValue(season)?.label}`;
}

export const createOrRemoveLayerBadge = (layer) => {
    let layerId = layer.get("mviewerid");
    let layerBadge = document.querySelector(`li.list-group-item[data-layerid="${layerId}"] > .rowBadges`);
    let value = getBadgeValue();
    if(layerBadge) layerBadge.remove();
    if(layer.getVisible() && value) {
        createBadgeByLayer(getBadgeValue(), layerId);
        let groupClassList = document.querySelector(`#${layerId}-layer-timefilter`).closest(".form-group-timer").classList;
        groupClassList.add("form-group-seasons-timer");
    }
}

