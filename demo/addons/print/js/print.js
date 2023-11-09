import ToolbarButton from "./components/toolbarButton";
import Map from "./components/map";
import { downloadPDF, displayPDF } from "./utils/print";

const init = () => {
  $(window).on("shown.bs.modal", function () {
    // supprime et recréer la carte seulement et non toute la modal
    $("#mapBlock").remove();
    $("#printModal").modal("show");
    Map();
  });
  printMapBtn.addEventListener("click", downloadPDF);
  previewPrintMapBtn.addEventListener("click", displayPDF);
  return ToolbarButton();
};

new CustomComponent("print", init);
