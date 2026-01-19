import { getInfosFromCapaLayers } from "./request-utils.js";
import { createDispatchEvent, getComponentProp, getComponentProps, getOptions, setComponentProps } from "./utils.js";

/**
 * Set year on list selection
 * @param {number} year 
 */
const setYear = (year) => {
    setComponentProps({ "year": year });
    createDispatchEvent("seasonYearChange", getComponentProps());
    document.querySelector(".seasonYear").innerHTML = year;
}

/**
 * Behavior on li (year) clicked
 * @param {any} li HTML Node
 */
const onLiClicked = (li) => {
    if(!li) {
        return console.warn("HTML component is not ready !");
    }
    const yearInt = parseInt(li.getAttribute("value"));
    setYear(yearInt);
}

/**
 * To reset default year accoridng to props or config
 * @param {number} year 
 */
export const setDefaultYear = (year) => {
    const years = mviewer.customComponents["seasons-selector"].props.years;
    const defaultYear = year || getComponentProp("year") || _.first(years);
    let defaultLi = document.querySelector(`.seasonYearEL[value='${defaultYear}']`);
    onLiClicked(defaultLi);
}

/**
 * Will create years selectionnable list
 * @param {number[]} years to populate list
 */
export const createListFromYears = (years) => {
    
    const sortedYears = _.sortedUniq(years).reverse();
    document.querySelector("#seasonYearsUl").innerHTML = "";
    const yearsLi = sortedYears.map(year => `<li><a class="seasonYearEL" value="${year}">${year}</a></li>`);
    document.querySelector("#seasonYearsUl").insertAdjacentHTML("beforeend", yearsLi.join(""));


    const defaultYear = getOptions()?.default?.year || sortedYears[0];
    // default year value
    setYear(defaultYear);

    // event on year selection
    document.querySelectorAll(".seasonYearEL").forEach(s => {
        s.addEventListener("click", (e) => onLiClicked(e.target));
    });

    // init first value or default value
    if(getOptions()?.default?.year) {
        setDefaultYear(defaultYear);
    } else {
        setDefaultYear(years[0]);
    }
    
}

/**
 * Create list from options or getCapabilities
 * @param {string[]} years available
 * @param {string} target element
 * @returns string
 */
export const initYearsList = (years) => {
    if (getOptions().fromCapabilities) {
        const onProcessFinish = () => createListFromYears(getComponentProp("years"))
        getInfosFromCapaLayers(onProcessFinish);
    } else {
        createListFromYears(years);
    }
}