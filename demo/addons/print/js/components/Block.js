import { defaultBlocksInfos } from "../const.js";
import { getQrCodeImg } from "../utils/controls.js";

import { Legend } from "./Legend.js";

/**
 * Will create default template HTML string
 * @param {*} settings from items for a given key (e.g legend, mapPrint....)
 * @returns
 */
const defaultTemplate = ({
  id,
  title,
  type,
  placeHolder,
  row,
  col,
  style,
  classNames,
  zindex,
}) => {
  const rowGrid = row ? `grid-row:${row}` : "";
  const colGrid = row ? `grid-column:${col}` : "";

  const pluginsOption = getOptions();

  const ownerInfos = `
    <div>
    <p class="small">${pluginsOption?.ownerInfos || ""}</p>
    <img src="${pluginsOption?.ownerLogo || ""}"/>
    <div/>
  `;

  let divByType = "";
  switch (type) {
    case "text":
      divByType = placeHolder;
      break;
    case "qrcode":
      divByType = getQrCodeImg();
      break;
    case "legend":
      divByType = Legend();
      break;
    case "informations":
      divByType = ownerInfos;
      break;
    default:
      `<div>${placeHolder}</div>`;
  }

  const titleDiv = `<div class="badge">${title || ""}</div>`;
  const typeDiv = type
    ? `<div ${type === "text" ? "contentEditable" : ""} class="${type} ${
        classNames || ""
      }" style="${style || ""}">${divByType}</div>`
    : "";

  const html = `<div class="blockImpress" id="print-${id}" style="${rowGrid} ${
    (rowGrid ? "; " : "") + colGrid
  }; z-index:${zindex}">
        ${titleDiv}
        <button type="button" class="close print-panel-close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ${typeDiv}
    </div>`;
  return html;
};

/**
 * Update existing block
 * @param {object} block settings
 */
export const updateBlock = ({ id, row, col }) => {
  const divId = `print-${id}`;
  const el = document.getElementById(divId);
  el.style["grid-row"] = row;
  el.style["grid-column"] = col;
};

/**
 * Delete a block by ID. ID is key from items config.
 * @param {string} id block item ID
 */
export const deleteBlocksById = (id) => {
  const divId = `print-${id}`;
  const el = document.getElementById(divId);
  if (el) {
    document.getElementById(divId).remove();
  }
};

/**
 * Allow to filter items according to selected layout.
 * Usefull if some items are not available in Landscape and available in Portrait.
 * @param {array} itemsToDisplay list of items to display (keys items from json file)
 */
export const deleteUselessBlocks = (itemsToDisplay) => {
  // const divId = `print-${id}`;
  const els = document.getElementsByClassName("blockImpress");
  const filtered = [...els].filter((x) => !itemsToDisplay.includes(x.id));
  filtered.forEach((x) => x.remove());
};

/**
 * Create a block from JSON key (e.g mapPrint, legend...)
 * @param {object} customInfos from JSON layout file
 * @returns
 */
export const createBlock = (customInfos) => {
  let infos = defaultBlocksInfos[customInfos.id] || {};
  return defaultTemplate({ ...infos, ...customInfos, classNames: customInfos.class });
};

/**
 *
 * @returns options according to mviewer id
 */
export const getOptions = () => {
  const mviewerId = configuration.getConfiguration().application.id;
  const options = mviewer.customComponents.print.config.options;
  return options.mviewer[mviewerId];
};
