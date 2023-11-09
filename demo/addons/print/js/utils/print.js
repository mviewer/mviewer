const defaultOptions = {
  filename: "mviewerMap.pdf",
  image: { type: "jpeg", quality: 0.95 },
  html2canvas: { scale: 3 },
  jsPDF: { unit: "mm", format: "A4", orientation: "landscape" },
};

const preparePrintElement = () => {
  $("#printModal").modal("hide");
  var element = document.getElementById("myLandscapeA4");
  element.classList.add("print");
  document.getElementById("mapPrint").style.width = "100%";
  return element;
};

export const downloadPDF = () => {
  const element = preparePrintElement();
  html2pdf()
    .set(defaultOptions)
    .from(element)
    .save()
    .then(function () {
      element.classList.remove("print");
    });
};

export const displayPDF = () => {
  const element = preparePrintElement();
  html2pdf()
    .set(defaultOptions)
    .from(element)
    .toPdf()
    .get("pdf")
    .then(function (pdf) {
      window.open(pdf.output("bloburl"), "_blank");
      element.classList.remove("print");
    });
};
