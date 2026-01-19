import { resetAllBtn, setDefaultSeason } from "./buttons.js";
import { initYearsList, setDefaultYear } from "./list.js";
import { getOptions, setComponentProps } from "./utils.js";

/**
 * Reset panel to default state
 */
export const resetPanel = () => {
    resetAllBtn();
    initYearsList(getOptions().years);
    setComponentProps({ "season": null });
    setComponentProps({ "year": null });
    setDefaultSeason(getOptions()?.default?.season);
    setDefaultYear(getOptions()?.default?.year);
}

/**
 * Change panel visibility
 */
export const changePanelVisibility = () => {
    const panel = document.getElementById("seasonPanel");
    panel.style.display = ["", "block"].includes(panel.style.display) ? "none" : "";
}

/**
 * Init panel listeners
 */
export const initPanel = () => {
    document.querySelector(".closeSeasonPanel").addEventListener("click", resetPanel);
    document.querySelector("#resetSeasonPanel").addEventListener("click", resetPanel)

}