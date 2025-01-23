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
 * Allows the help modal to be shown only once
 */
export const ncShowHelpOnce = () => {
  const helpCheckBox = document.getElementById("showHelpOnce");
  if (!helpCheckBox) return;
  // init
  try {
    const savedState = localStorage.getItem("helpCheckBox");
    helpCheckBox.checked = savedState === "true";
    // init on change
    helpCheckBox.addEventListener("change", function () {
      localStorage.setItem("helpCheckBox", helpCheckBox.checked);
    });
  } catch (e) {
    mviewer.alert("Problème avec le localStorage", "alert-info");
  }
};
