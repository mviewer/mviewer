import { defaultBlocksInfos } from "../const";
import { getQrCodeImg } from "../utils/controls";

const defaultTemplate = ({
  id,
  title,
  type,
  placeHolder,
  row,
  col,
  style,
  classNames,
}) => {
  const rowGrid = row ? `grid-row:${row}` : "";
  const colGrid = row ? `grid-column:${col}` : "";

  let divByType = "";
  switch (type) {
    case "text":
      divByType = `<textarea>${placeHolder || ""}</textarea>`;
      break;
    case "qrcode":
      divByType = getQrCodeImg();
      break;
    default:
      divByType = placeHolder || "";
  }

  const titleDiv = title ? `<div class="badge">${title || ""}</div>` : "";
  const typeDiv = type
    ? `<div class="${type} ${classNames || ""}" style="${style || ""}">${divByType}</div>`
    : "";

  const html = `<div class="blockImpress" id="print-${id}" style="${rowGrid} ${
    (rowGrid ? "; " : "") + colGrid
  }">
        ${titleDiv}
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
