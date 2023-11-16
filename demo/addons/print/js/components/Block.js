import { defaultBlocksInfos } from "../const.js";
import { getQrCodeImg } from "../utils/controls.js";

import { Legend } from "./Legend.js";

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
    <img src=${pluginsOption?.ownerLogo || ""}/>
    <div/>
  `;

  let divByType = "";
  switch (type) {
    case "text":
      divByType = `<textarea>${placeHolder || ""}</textarea>`;
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
      null;
  }

  const titleDiv = `<div class="badge">${title || ""}</div>`;
  const typeDiv = type
    ? `<div class="${type} ${classNames || ""}" style="${style || ""}">${divByType}</div>`
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

export const updateBlock = ({ id, row, col }) => {
  const divId = `print-${id}`;
  const el = document.getElementById(divId);
  el.style["grid-row"] = row;
  el.style["grid-column"] = col;
};

export const deleteBlocksById = (id) => {
  const divId = `print-${id}`;
  const el = document.getElementById(divId);
  if (el) {
    document.getElementById(divId).remove();
  }
};

export const deleteUselessBlocks = (itemsToDisplay) => {
  // const divId = `print-${id}`;
  const els = document.getElementsByClassName("blockImpress");
  const filtered = [...els].filter((x) => !itemsToDisplay.includes(x.id));
  filtered.forEach((x) => x.remove());
};

export const createBlock = (customInfos) => {
  let infos = defaultBlocksInfos[customInfos.id] || {};
  return defaultTemplate({ ...infos, ...customInfos, classNames: customInfos.class });
};

export const getOptions = () => {
  const mviewerId = configuration.getConfiguration().application.id;
  const options = mviewer.customComponents.print.config.options;
  return options.mviewer[mviewerId];
};
