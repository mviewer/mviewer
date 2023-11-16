const ID_SCALE_CHECKBOX = "#print-scale-checkbox";
const ID_NORTH_CHECKBOX = "#print-north-checkbox";
const ID_QRCODE_CHECKBOX = "#print-qrcode-checkbox";
const NORTH_DIV_SELECTOR = "#northArrow-mapPrint img";
const QRCODE_DIV_SELECTOR = "#print-qrcode";

/**
 * Get and clone QRCode from mviewer
 * @returns string HTML
 */
export const getQrCodeImg = () => {
  mviewer.setPermalink();
  const printQrCodeDiv = document.querySelector("#share img").cloneNode();
  return printQrCodeDiv.outerHTML;
};

/**
 * To display necessary checkbox according to global JSON layout settings
 * @param {*} layoutToUse
 */
export const filterCheckBox = (layoutToUse = {}) => {
  const northParent = document.querySelector(ID_NORTH_CHECKBOX).parentElement;
  const qrParent = document.querySelector(ID_QRCODE_CHECKBOX).parentElement;
  // if JSON config doesn't contain north entry or north URL we hide this checkbox
  if (!layoutToUse.hasOwnProperty("northUrl")) {
    northParent.classList.add("hide");
    document.querySelector(ID_NORTH_CHECKBOX).checked = false;
    displayNorth();
  } else {
    northParent.classList.remove("hide");
    document.querySelector(ID_NORTH_CHECKBOX).checked = true;
    displayNorth();
  }
  // if JSON config items doesn't contain qrcode entry, we hide checkbock
  if (!layoutToUse?.items?.qrcode) {
    qrParent.classList.add("hide");
    document.querySelector(ID_QRCODE_CHECKBOX).checked = false;
    displayQrCode();
  } else {
    qrParent.classList.remove("hide");
    document.querySelector(ID_QRCODE_CHECKBOX).checked = true;
    displayQrCode();
  }
};

/**
 * Will init each checkbox event on change
 */
export const iniCheckBox = () => {
  document.querySelector(ID_SCALE_CHECKBOX).addEventListener("change", displayScale);
  document.querySelector(ID_NORTH_CHECKBOX).addEventListener("change", displayNorth);
  document.querySelector(ID_QRCODE_CHECKBOX).addEventListener("change", displayQrCode);
};

/**
 * Display scale according to checkbox value
 */
export const displayScale = () => {
  const checked = document.querySelector(ID_SCALE_CHECKBOX).checked;
  const mapPrint = mviewer.customComponents.print.printmap;
  const scale = mapPrint.getScale();
  checked ? mapPrint.addControl(scale) : mapPrint.removeControl(scale);
};

/**
 * Display north arrow according to checkbox value
 */
export const displayNorth = () => {
  const checked = document.querySelector(ID_NORTH_CHECKBOX).checked;
  const northArrowDiv = document.querySelector(NORTH_DIV_SELECTOR);
  const classList = northArrowDiv.classList;
  checked ? classList.remove("hide") : classList.add("hide");
};

/**
 * Display QR Code block according to checkbox value
 */
export const displayQrCode = () => {
  const checked = document.querySelector(ID_QRCODE_CHECKBOX).checked;
  const qrCodeDiv = document.querySelector(QRCODE_DIV_SELECTOR);
  if (!qrCodeDiv) return;
  const classList = qrCodeDiv.classList;
  checked ? classList.remove("hide") : classList.add("hide");
};
