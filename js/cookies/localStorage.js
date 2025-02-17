/**
 * --------------------------------------------------
 * LocalStorage
 * This file is useful for using localStorage
 * --------------------------------------------------
 * Browser comptability:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * --------------------------------------------------
 */

/**
 * Utility func to control if LocalStorage is supported.
 * @returns boolean
 */
export const isLocalStorageSupported = () => {
  try {
    // control if supported
    return typeof Storage !== "undefined" && window.localStorage;
  } catch (e) {
    // not supported
    return false;
  }
};

/**
 * Void function.
 * Allows the help modal to be shown only once.
 */
export const ncShowHelpOnce = () => {
  const helpCheckBox = document.getElementById("showHelpOnce");
  const helpParentBloc = document.getElementById("showHelpOnceBloc");
  if (!helpCheckBox && !isLocalStorageSupported()) return;
  // init and manage browser issue
  try {
    const savedState = localStorage.getItem("helpCheckBox");
    helpCheckBox.checked = savedState === "true";
    // change lcoalStorage value on checkbox change
    helpCheckBox.addEventListener("change", function () {
      localStorage.setItem("helpCheckBox", helpCheckBox.checked);
    });
    // dispatch checkbox change event on parent to ease check action
    helpParentBloc.addEventListener("click", () => {
      const showNextTime = localStorage.getItem("helpCheckBox") == "true";
      helpCheckBox.checked = !showNextTime;
      const change = new Event("change");
      helpCheckBox.dispatchEvent(change);
    });
  } catch (e) {
    console.log("LocalStorage : Error", "alert-info");
  }
};
