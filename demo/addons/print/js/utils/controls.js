const ID_SCALE_CHECKBOX = "#print-scale-checkbox";
const ID_NORTH_CHECKBOX = "#print-north-checkbox";
const ID_QRCODE_CHECKBOX = "#print-qrcode-checkbox";
const NORTH_DIV_SELECTOR = "#northArrow-mapPrint img";
const QRCODE_DIV_SELECTOR = ".qrcode";

export const getQrCodeImg = () => {
  mviewer.setPermalink();
  const printQrCodeDiv = document.querySelector("#share img").cloneNode();
  return printQrCodeDiv.outerHTML;
};

export const filterCheckBox = (layoutToUse = {}) => {
  const northParent = document.querySelector(ID_NORTH_CHECKBOX).parentElement;
  const qrParent = document.querySelector(ID_QRCODE_CHECKBOX).parentElement;
  if (!layoutToUse.hasOwnProperty("northUrl")) {
    northParent.classList.add("hide");
    document.querySelector(ID_NORTH_CHECKBOX).checked = false;
    displayNorth(false);
  } else {
    northParent.classList.remove("hide");
    document.querySelector(ID_NORTH_CHECKBOX).checked = true;
    displayNorth(true);
  }
  if (!layoutToUse?.items?.qrcode) {
    qrParent.classList.add("hide");
    document.querySelector(ID_QRCODE_CHECKBOX).checked = false;
    displayQrCode(false);
  } else {
    qrParent.classList.remove("hide");
    document.querySelector(ID_QRCODE_CHECKBOX).checked = true;
    displayQrCode(true);
  }
};

export const iniCheckBox = () => {
  document.querySelector(ID_SCALE_CHECKBOX).addEventListener("change", displayScale);
  document.querySelector(ID_NORTH_CHECKBOX).addEventListener("change", displayNorth);
  document.querySelector(ID_QRCODE_CHECKBOX).addEventListener("change", displayQrCode);
};

export const displayScale = (value = undefined) => {
  const checked =
    value != undefined ? value : document.querySelector(ID_SCALE_CHECKBOX).checked;
  const mapPrint = mviewer.customComponents.print.printmap;
  const scale = mapPrint.getScale();
  checked ? mapPrint.addControl(scale) : mapPrint.removeControl(scale);
};

export const displayNorth = (value = undefined) => {
  const checked =
    value != undefined ? value : document.querySelector(ID_NORTH_CHECKBOX).checked;
  const northArrowDiv = document.querySelector(NORTH_DIV_SELECTOR);
  const classList = northArrowDiv.classList;
  checked ? classList.remove("hide") : classList.add("hide");
};

export const displayQrCode = (value = undefined) => {
  const checked =
    value != undefined ? value : document.querySelector(ID_QRCODE_CHECKBOX).checked;
  const qrCodeDiv = document.querySelector(QRCODE_DIV_SELECTOR);
  if (!qrCodeDiv) return;
  const classList = qrCodeDiv.classList;
  checked ? classList.remove("hide") : classList.add("hide");
};
