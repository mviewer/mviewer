import { autumnIcon, springIcon, summerIcon, winterIcon } from "./const.js";
import { createDispatchEvent, getComponentProp, getComponentProps, getOptions, setComponentProps } from "./utils.js";

/**
 * Allow to get icon by season id number.
 * @param {number} id 
 * @returns string
 */
const getIconBySeasonId = (id) => {
    let icon = "";
    switch (id) {
        case 0:
            icon = winterIcon;
            break;
        case 1:
            icon = springIcon;
            break;
        case 2:
            icon = summerIcon;
            break;
        case 3:
            icon = autumnIcon;
            break;
        default:
            icon = ""
    }
    return icon;
}

/**
 * Reset all button state
 */
export const resetAllBtn = () => {
    document.querySelectorAll(".seasonSelector").forEach(x => {
        x.setAttribute("selected", false);
    });
}

/**
 * Create one button by available season.
 * An available season can be detected from getCapabilities (see fromCapabilities plugin's param).
 * @param {object[]} seasons 
 * @returns string
 */
export const createButtons = (seasons) => {
    const buttons = seasons.map(season => {
        let icon = season?.icon || getIconBySeasonId(season.id);
        const btnHtml =
            `<button 
                type="button"
                id="sb-${season.value}"
                class="seasonButton seasonSelector btn"
                value="${season.value}"
            >
                ${icon}
                ${season.label}
            </button>`
        return btnHtml;
    });
    return buttons;
}

/**
 * Read season returned by getCapabilities to only show available buttons
 * @returns 
 */
export const initCapaSeasonButton = () => {
    const seasonsFromProps = getComponentProp("seasons");
    let seasonsConfig = getOptions()?.seasons;
    // only keep season existing in getCapabilities response
    return seasonsConfig.filter(season => seasonsFromProps.includes(season.value));

}

/**
 * To set button according to props or func param
 * @param {string} season 
 */
export const setDefaultSeason = (season) => {
    const seasons = getComponentProp("seasons");
    const defaultSeasonValue = season || getComponentProp("season") || _.last(seasons).value;
    const defaultBtn = document.querySelector(`.seasonSelector[value='${defaultSeasonValue}']`);
    onButtonClick(defaultBtn);
}

/**
 * Create panel seasons buttons.
 * @param {object[]} seasons
 */
export const initSeasonsButtons = (seasons) => {
    // clean existing buttons
    const buttonPanel = document.querySelector("#seasonPanelContent");
    buttonPanel.querySelectorAll(".seasonSelector").forEach(s => s.remove());
    // create and insert button into panel
    const buttons = createButtons(seasons);
    buttonPanel.insertAdjacentHTML("beforeend", buttons.join(""));

    // deafault button activate
    const defaultSeason = getOptions()?.default?.season ||  _.last(seasons).value;
    setDefaultSeason(defaultSeason);
}

/**
 * On button click behavior
 * @param {any} btn HTML Node
 */
const onButtonClick = (btn) => {
    const isSelected = btn.getAttribute("selected") == "true";
    resetAllBtn();
    if (!isSelected) {
        setComponentProps({ "season": btn.value });
        btn.setAttribute("selected", true);
        createDispatchEvent("seasonYearChange", getComponentProps());
    }
}

/**
 * Create click behavior for each available buttons.
 */
export const initButtonClick = () => {
    document.querySelectorAll(".seasonSelector").forEach(btn => {
        btn.addEventListener("click", ({ target }) => onButtonClick(target));
        btn.querySelector("svg").addEventListener("click", ({ target }) => {
            onButtonClick(target.parentNode)
        });
    })
}