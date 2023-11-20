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
  margin: [0, 4],
  filename: "mviewerMap.pdf",
  // See official doc for more type and quality options :
  // https://ekoopmans.github.io/html2pdf.js/#image-type-and-quality
  image: { type: "jpeg", quality: 1 },
  html2canvas: { scale: 1, useCORS: true },
  // format could be string as "A4"
  // or an array with custom values [595.28, 841.89] in unit specified
  jsPDF: { unit: "mm", format: "A4", orientation: "landscape" },
};

/**
 * Prepare divs and block to create a clean print document.
 * Required steps to hide badge, force size, update map etc...
 * @param {object} options
 * @returns
 */
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

/**
 * Download print as PDF
 * @param {object} options to override default options
 */
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

/**
 * Display print as PDF in new tab
 * @param {object} options to override default options
 */
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

/**
 * Download print as PNG
 * @param {object} options to override default options
 */
export const displayAsPng = (options) => {
  const finalOptions = { ...defaultOptions, ...options };
  const element = preparePrintElement(finalOptions);
  html2pdf()
    .set(finalOptions)
    .from(element)
    .toImg()
    .outputImg()
    .then(function (img) {
      console.log(img);
      // window.open(pdf.output("bloburl"), "_blank");
      var download = document.createElement("a");
      download.href = img.src;
      download.download = "mviewer-print.png";
      download.click();
      element.classList.remove("print");
      element.classList.remove("a4-portrait");
      element.classList.remove("a4-landscape");
    });
};
