import ModalContent from "../components/ModalContent.js";
import { filterCheckBox } from "./controls.js";
import { getSelectedLayout } from "./layout.js";

const activeOrientationChangeAction = (layoutJson) => {
  const selectOrientation = document.getElementById("print-select-orientation");
  if (!selectOrientation) return;
  selectOrientation.addEventListener("change", () => {
    const layoutToUse = getSelectedLayout(layoutJson);
    ModalContent(layoutToUse);
    filterCheckBox(layoutToUse);
  });
};

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

export const initOptions = (jsonLayout) => {
  readOrientationOptions(jsonLayout);
  activeOrientationChangeAction(jsonLayout);
  console.log(jsonLayout);
};
