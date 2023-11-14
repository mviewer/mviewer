import ModalContent from "../components/ModalContent";

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

export const layoutToBlocks = (layoutToUse) => {
  ModalContent(layoutToUse);
};
