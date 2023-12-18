import ToolbarButton from "./components/ToolbarButton.js";

import { initOptions } from "./utils/printOptions.js";

import { filterCheckBox, iniCheckBox } from "./utils/controls.js";

import { downloadPDF, displayPDF, displayAsPng } from "./utils/pdf.js";
import { downloadLayouts, getSelectedLayout } from "./utils/layout.js";
import { defaultLayout } from "./utils/defaultLayout.js";
import ModalContent from "./components/ModalContent.js";

import { getOptions } from "./components/Block.js";

const initWithLayout = (layout) => {
  $("#printModal").on("shown.bs.modal", function () {
    // supprime et recréer la carte seulement et non toute la modal
    $("#mapBlock").remove();
    $("#printModal").modal("show");
    // init options
    initOptions(layout);
    // init modal
    const layoutToUse = getSelectedLayout(layout);
    ModalContent(layoutToUse);
    // manage checkbox display
    filterCheckBox(layoutToUse);
    // init checbox check event
    iniCheckBox();
    document.querySelector(".print-reset-btn").addEventListener("click", () => {
      // init modal
      const layoutSelected = getSelectedLayout(layout);
      ModalContent(layoutSelected);
    });
  });
  // preview PDF button listener
  document.querySelectorAll(".print-preview-btn").forEach((z) =>
    z.addEventListener("click", (evt) => {
      const isLandscape =
        document.getElementById("print-select-orientation").value == "true";
      displayPDF({
        jsPDF: {
          unit: "mm",
          format: "A4",
          orientation: isLandscape ? "landscape" : "portrait",
        },
      });
    })
  );
  // download PNG button listener
  document.querySelector(".print-png-btn").addEventListener("click", (evt) => {
    const isLandscape =
      document.getElementById("print-select-orientation").value == "true";
    displayAsPng({
      jsPDF: {
        unit: "mm",
        format: "A4",
        orientation: isLandscape ? "landscape" : "portrait",
      },
    });
  });
  // download PDF button listener
  document.querySelectorAll(".print-download-btn").forEach((z) =>
    z.addEventListener("click", (evt) => {
      const isLandscape =
        document.getElementById("print-select-orientation").value == "true";
      downloadPDF({
        jsPDF: {
          unit: "mm",
          format: "A4",
          orientation: isLandscape ? "landscape" : "portrait",
        },
      });
    })
  );
};

const init = () => {
  // call json template file to render layout
  downloadLayouts(getOptions().printLayouts)
    .then((jsonLayout) => initWithLayout(jsonLayout))
    .catch((err) => {
      initWithLayout(defaultLayout);
      console.log(err);
    });
  return ToolbarButton();
};

new CustomComponent("print", init);
