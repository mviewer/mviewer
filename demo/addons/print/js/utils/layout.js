/**
 * Will request layout JSON file from URL
 * @param {string} url
 * @returns
 */
export const downloadLayouts = (url) => {
  return fetch(url)
    .then((r) => r.json())
    .then((content) => {
      const customEvt = new CustomEvent("printLayoutAvailable", {
        detail: {
          content: content,
        },
      });
      document.dispatchEvent(customEvt);
      return content;
    });
};

/**
 * Will get layout Portrait or Landscape according to selected format (only A4 for this version).
 *
 * @param {object} jsonLayout
 * @param {string} format always A4 for this first version
 * @returns
 */
export const getSelectedLayout = (jsonLayout, format = "A4") => {
  let formats = _.keys(jsonLayout).map((k) => jsonLayout[k]);
  let selectedFormats = formats.filter((f) => {
    if (typeof format === "string") {
      return f.format === format;
    } else if (typeof format === "object" && format.length > 1) {
      return f.format[0] == format[0] && f.format[1] == format[1];
    }
  });

  const isLandscape = document.getElementById("print-select-orientation").value == "true";
  return selectedFormats.filter((x) => (isLandscape ? x.landscape : !x.landscape))[0];
};
