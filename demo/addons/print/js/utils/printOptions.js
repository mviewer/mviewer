import ModalContent from "../components/ModalContent.js";
import { filterCheckBox } from "./controls.js";
import { getSelectedLayout } from "./layout.js";

/**
 * Will create event on combobox orientation change.
 * On change, will create modal content according to selected layout and config.
 * @param {object} layoutJson from config
 * @returns
 */
const activeOrientationChangeAction = (layoutJson) => {
  const selectOrientation = document.getElementById("print-select-orientation");
  if (!selectOrientation) return;
  selectOrientation.addEventListener("change", () => {
    const layoutToUse = getSelectedLayout(layoutJson);
    ModalContent(layoutToUse);
    filterCheckBox(layoutToUse);
  });
};

/**
 * Read available orientations from config file.
 * @param {layout} json config from file
 */
export const readOrientationOptions = (json) => {
  let formats = Object.keys(json);
  let available = [];

  formats.forEach((format) => {
    json[format].hasOwnProperty("landscape")
      ? available.push(json[format].landscape)
      : null;
  });

  available = _.uniq(available).map(
    (a) => `<option value="${a}">${a ? "Paysage" : "Portrait"}</option>`
  );
  const list = document.getElementById("print-select-orientation");
  list.innerHTML = available.join("");
};

/**
 * Will create or populate options panels and use current theme style.
 * @param {object} jsonLayout from config file
 */
export const initOptions = (jsonLayout) => {
  readOrientationOptions(jsonLayout);
  activeOrientationChangeAction(jsonLayout);

  document.querySelectorAll("#blockOptionsImpress .panel-heading").forEach((x) => {
    x.style.backgroundColor = $("#mv-navbar").css("background-color");
    x.style.color = $(".mv-title").css("color");
  });
};
