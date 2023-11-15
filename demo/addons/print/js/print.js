import ToolbarButton from "./components/ToolbarButton.js";
import Map from "./components/Map.js";

import { initOptions } from "./utils/printOptions.js";

import { filterCheckBox, iniCheckBox } from "./utils/controls.js";

import { downloadPDF, displayPDF } from "./utils/pdf.js";
import { downloadLayouts, getSelectedLayout } from "./utils/layout.js";
import { defaultLayout } from "./utils/defaultLayout.js";
import ModalContent from "./components/ModalContent.js";

import { getOptions } from "./components/Block.js";

const initWithLayout = (layout) => {
  $(window).on("shown.bs.modal", function () {
    // supprime et recréer la carte seulement et non toute la modal
    $("#mapBlock").remove();
    $("#printModal").modal("show");
    // init options
    initOptions(layout);
    // init modal
    const layoutToUse = getSelectedLayout(layout);
    ModalContent(layoutToUse);
    // init map
    Map(layout.northUrl);
    // manage checkbox display
    filterCheckBox(layoutToUse);
    // init checbox check event
    iniCheckBox();
  });
  document
    .querySelectorAll(".print-preview-btn")
    .forEach((z) => z.addEventListener("click", displayPDF));
  document
    .querySelectorAll(".print-download-btn")
    .forEach((z) => z.addEventListener("click", downloadPDF));
};

const init = () => {
  downloadLayouts(getOptions().printLayouts)
    .then((jsonLayout) => initWithLayout(jsonLayout))
    .catch((err) => {
      initWithLayout(defaultLayout);
      console.log(err);
    });
  return ToolbarButton();
};

new CustomComponent("print", init);
