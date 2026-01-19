import { createBadges } from "./badge.js";
import { getComponentProp, getOptions, setComponentProps } from "./utils.js";

/**
 * Read values from getCapabilities
 * @param {string} xml from response
 * @returns 
 */
const readTimeValues = (xml) => {
    const parser = new ol.format.WMSCapabilities();
    const parsed = parser.read(xml);
    const capaLayers = parsed.Capability.Layer.Layer;
    const values = capaLayers.map(lyr => {
        if (!lyr.Dimension) return;
        return lyr.Dimension.filter(dim => dim.name === "time")[0].values;

    }).filter(x => x);
    return _.uniq(_.merge(values))[0];
}

/**
 * Apply RegEx on value to catch year and season
 * @param {string} value to match with regex
 * @returns 
 */
const readFromRegEx = (value) => {
    const regexStr = getComponentProp("regex");
    const regex = new RegExp(regexStr);
    const match = regex.exec(value);
    if (!match) return;
    // catch year
    const year = match[1];
    // catch season
    const season = match[2];
    return { year: year, season: season }
}

/**
 * Get capabilities informations for each layers concerned
 * @param {Function} process 
 */
export const getInfosFromCapaLayers = (process) => {
    const layers = getOptions().layersId;
    const capaUrls = layers.map(idLayer => {
        const url = mviewer.getLayer(idLayer).layer.getSource().getUrls()[0];
        return getCapUrl(url);
    });
    Promise.all(_.uniq(capaUrls).map(capaUrl => fetch(capaUrl).then(x => x.text()))).then(xml => {
        let values = [];
        setComponentProps({ years: [], seasons: [] });
        xml.forEach(x => {
            values = [...values, ...readTimeValues(x).split(",")];
        })
        values = _.uniq(values);
        values.forEach(val => {
            // get years and season number
            let { year, season } = readFromRegEx(val);
            setComponentProps({
                years: _.uniq([...getComponentProp("years"), year]),
                seasons: _.uniq([...getComponentProp("seasons"), season])
            })
        })
        if (process) process();
    })
}

/**
 * Match a season number with plugin's config season object
 * @returns object
 */
export const getSeasonInfoByValue = () => {
    const season = getComponentProp("season");
    const seasonConfig = getOptions().seasons.filter(s => s.value === season)[0];
    return seasonConfig;
}

/**
 * Change layers TIME params according to year and season
 * @param {string} value 
 */
export const changeTime = (value) => {
    const ids = getOptions().layersId;
    ids.filter(id => mviewer.getLayer(id)?.layer?.isVisible()).forEach(idLayer => {
        if (document.getElementById(`#${idLayer}-layer-timefilter`)) {
            // update slider
            const labels = document.querySelector(`#${idLayer}-layer-timefilter`).closest(".form-group-timer").querySelectorAll(".slider-tick-label");
            const sliderLabels = [...labels].map(x => x.innerHTML);
            const sliderIndexSelected = sliderLabels.indexOf(value);
            if (sliderIndexSelected > -1) {
                // use label position to identify wich tick position will be set
                $(`#${idLayer}-layer-timefilter`).slider("setValue", sliderIndexSelected, true, true)
            } else {
                mviewer.setLayerTime(idLayer, value);
            }
        } else {
            // or just update WMS layer TIME param
            mviewer.setLayerTime(idLayer, value);
        }
    });
    const year = getComponentProp("year");
    const season = getComponentProp("season");
    createBadges(`${year} - ${getSeasonInfoByValue(season).label}`);
}