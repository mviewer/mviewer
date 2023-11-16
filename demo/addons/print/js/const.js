const dateString = new Date().toLocaleDateString();
export const defaultBlocksInfos = {
  title: {
    title: "Titre",
    row: "1 / 2",
    col: "1 / 6",
    placeHolder: document.querySelector(".mv-title").innerHTML,
    type: "text",
    zindex: 6,
  },
  qrcode: {
    col: "6/7",
    row: "1/2",
    type: "qrcode",
    title: "Partage",
    placeholder: "",
    style: "background-color: white",
  },
  informations: {
    title: "Informations",
    row: "1/6",
    col: "1/2",
    placeHolder: `Carte réalisée avec mviewer le ${dateString}`,
    type: "informations",
    zindex: 4,
  },
  comments: {
    title: "Commentaires",
    col: "2 / 7",
    placeHolder: "Aucun commentaire",
    type: "text",
    zindex: 3,
  },
  legend: {
    type: "legend",
    title: "Légende",
    row: "2 / 6",
    col: "5 / 7",
    placeHolder: "",
    zindex: 2,
  },
  mapPrint: { row: "2 / 6", col: "1 / 2", placeHolder: "", title: "Carte", zindex: 1 },
};
