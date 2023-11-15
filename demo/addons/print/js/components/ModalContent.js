import { createBlock, updateBlock, deleteUselessBlocks } from "./Block.js";

const parentModalId = "blockViewImpress";

const createAndAddBlocs = (items, refresh = false) => {
  const modalGridContainer = document.getElementById("anchor");

  // start by delete if necessary
  deleteUselessBlocks(Object.keys(items).map((name) => `print-${name}`));

  // update size or create block for each layout item
  Object.keys(items).forEach((item) => {
    const divId = `print-${item}`;
    if (document.getElementById(divId) && !refresh) {
      // update
      updateBlock({ ...items[item], id: item });
    } else {
      // create
      const block = createBlock({ ...items[item], id: item });
      modalGridContainer.insertAdjacentHTML("afterend", block);
    }
  });
};

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
  console.log("modalContent");
  if (!document.getElementById(parentModalId)) return;
  // create blocks

  createAndAddBlocs(layoutJson.items);
  setSize(layoutJson.format, layoutJson.landscape);
  if (mviewer.customComponents.print.printmap) {
    mviewer.customComponents.print.printmap.updateSize();
  }
};
