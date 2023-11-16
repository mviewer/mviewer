import { createBlock, deleteUselessBlocks, deleteBlocksById } from "./Block.js";
import Map from "./Map.js";

const parentModalId = "blockViewImpress";

/**
 * Will create blocks for each items keys
 * @param {object} items from json layout file items key
 */
const createAndAddBlocs = (items) => {
  const modalGridContainer = document.getElementById("anchor");

  // start by delete if necessary
  deleteUselessBlocks(Object.keys(items).map((name) => `print-${name}`));

  // update size or create block for each layout item
  Object.keys(items).forEach((item) => {
    deleteBlocksById(item);
    // create
    const block = createBlock({ ...items[item], id: item });
    modalGridContainer.insertAdjacentHTML("afterend", block);
  });
};

/**
 * To force correct format size
 * @param {string} format
 * @param {boolean} landscape
 */
const setSize = (format = "A4", landscape) => {
  const viewDiv = document.getElementById(parentModalId);
  if (format == "A4" && landscape) {
    viewDiv.style.width = "297mm";
    viewDiv.style.height = "210mm";
  }

  if (format == "A4" && !landscape) {
    viewDiv.style.width = "210mm";
    viewDiv.style.height = "297mm";
  }
};

export default (layoutJson) => {
  printGridContainer.style.display = "grid";
  if (!document.getElementById(parentModalId)) return;
  // create blocks

  createAndAddBlocs(layoutJson.items);
  setSize(layoutJson.format, layoutJson.landscape);
  if (mviewer.customComponents.print.printmap) {
    mviewer.customComponents.print.printmap.updateSize();
  }

  // init drag action
  $(".blockImpress").easyDrag({ container: $("#printGridContainer"), handle: ".badge" });

  // init close action
  [...document.querySelectorAll(".print-panel-close")].forEach((x) => {
    x.addEventListener("click", (x) => {
      x.target.closest(".blockImpress ").remove();
    });
  });

  /**
   * Some trouble exists with default grid system.
   * To avoid them, we change from grid to simple absolute position.
   * This modification requires to get each block position to change CSS "position" rule and
   * set position calculated.
   */
  const positionsHtml = [...document.querySelectorAll(".blockImpress")].map((x) => ({
    position: x.getClientRects()[0],
    id: x.id,
  }));
  printGridContainer.style.display = "block";
  positionsHtml.forEach((x) => {
    const el = document.getElementById(x.id);
    el.style.position = "absolute";
    el.style.width = `${x.position.width}px`;
    el.style.height = `${x.position.height}px`;
    $(el).offset(x.position);
  });

  // init map
  Map(layoutJson.northUrl);

  // Will update map on each resize map event
  let timer;
  let observer = new ResizeObserver(function (mutations) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      mviewer.customComponents.print.printmap.updateSize();
    }, 110);
  });
  let child = document.querySelector("#print-mapPrint");
  observer.observe(child);
};
