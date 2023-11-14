import ToolbarButton from "./components/ToolbarButton";
import Map from "./components/Map";

import { initOptions } from "./utils/printOptions";

import { filterCheckBox, iniCheckBox } from "./utils/controls";

import { downloadPDF, displayPDF } from "./utils/pdf";
import { downloadLayouts, layoutToBlocks, getSelectedLayout } from "./utils/layout";
import { defaultLayout } from "./utils/defaultLayout";

const thisMviewerConfig = mviewer.customComponents.print.config.options.mviewer["print"];

const initWithLayout = (layout) => {
  $(window).on("shown.bs.modal", function () {
    // supprime et recréer la carte seulement et non toute la modal
    $("#mapBlock").remove();
    $("#printModal").modal("show");
    // init options
    initOptions(layout);
    // init modal
    const layoutToUse = getSelectedLayout(layout);
    layoutToBlocks(layoutToUse);
    // init map
    Map(layout.northUrl);
    // manage checkbox display
    filterCheckBox(layoutToUse);
    // init checbox check event
    iniCheckBox();
  });
  printMapBtn.addEventListener("click", downloadPDF);
  previewPrintMapBtn.addEventListener("click", displayPDF);
};

const init = () => {
  downloadLayouts(thisMviewerConfig.printLayouts)
    .then((jsonLayout) => initWithLayout(jsonLayout))
    .catch((err) => {
      initWithLayout(defaultLayout);
      console.log(err);
    });
  return ToolbarButton();
};

new CustomComponent("print", init);
