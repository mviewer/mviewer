const dateString = new Date().toLocaleDateString();
export const defaultBlocksInfos = {
  title: {
    title: "Titre",
    row: "1 / 2",
    col: "1 / 7",
    placeHolder: "",
    type: "text",
    zindex: 6,
  },
  qrcode: {
    col: "6/6",
    row: "1/2",
    type: "qrcode",
    title: "Partage",
    placeholder: "",
    class: "text-center",
    zindex: 5,
  },
  informations: {
    title: "Informations",
    col: "1 / 2",
    placeHolder: `Carte réalisée avec mviewer le ${dateString}`,
    type: "text",
    zindex: 4,
  },
  comments: {
    title: "Commentaires",
    col: "2 / 7",
    placeHolder: "Aucun commentaire",
    type: "text",
    zindex: 3,
  },
  legend: { title: "Légende", row: "2 / 6", col: "5 / 7", placeHolder: "", zindex: 2 },
  mapPrint: { row: "2 / 6", col: "1 / 2", placeHolder: "", title: "Carte", zindex: 1 },
};
