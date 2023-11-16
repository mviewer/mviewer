/**
 * PDF options.
 *
 * To use more options:
 * https://ekoopmans.github.io/html2pdf.js/#options
 *
 * To list available formats or possibility:
 * https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html
 * */
const defaultOptions = {
  filename: "mviewerMap.pdf",
  // See official doc for more type and quality options :
  // https://ekoopmans.github.io/html2pdf.js/#image-type-and-quality
  image: { type: "jpeg", quality: 1 },
  html2canvas: { scale: 4, useCORS: true },
  // format could be string as "A4"
  // or an array with custom values [595.28, 841.89] in unit specified
  jsPDF: { unit: "mm", format: "A4", orientation: "landscape" },
};

const preparePrintElement = (options) => {
  var element = document.getElementById("printGridContainer");
  element.classList.add("print");
  if (options.jsPDF.format == "A4" && options.jsPDF.orientation == "landscape") {
    element.classList.add("a4-landscape");
  }
  if (options.jsPDF.format == "A4" && options.jsPDF.orientation != "landscape") {
    element.classList.add("a4-portrait");
  }
  mviewer.customComponents.print.printmap.updateSize();
  document.getElementById("mapPrint").style.width = "100%";
  return element;
};

export const downloadPDF = (options) => {
  const finalOptions = { ...defaultOptions, ...options };
  const element = preparePrintElement(finalOptions);

  html2pdf()
    .set(finalOptions)
    .from(element)
    .save()
    .then(function () {
      element.classList.remove("print");
    });
};

export const displayPDF = (options) => {
  const finalOptions = { ...defaultOptions, ...options };
  const element = preparePrintElement(finalOptions);
  html2pdf()
    .set(finalOptions)
    .from(element)
    .toPdf()
    .get("pdf")
    .then(function (pdf) {
      window.open(pdf.output("bloburl"), "_blank");
      element.classList.remove("print");
      element.classList.remove("a4-portrait");
      element.classList.remove("a4-landscape");
    });
};
