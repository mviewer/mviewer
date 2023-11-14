const dateString = new Date().toLocaleDateString();
export const defaultBlocksInfos = {
  informations: {
    title: "Informations",
    col: "1 / 2",
    placeHolder: `Carte réalisée avec mviewer le ${dateString}`,
    type: "text",
  },
  mapPrint: { row: "2 / 6", col: "1 / 2", placeHolder: "" },
  comments: {
    title: "Commentaires",
    col: "2 / 7",
    placeHolder: "Aucun commentaire",
    type: "text",
  },
  legend: { title: "Légende", row: "2 / 6", col: "5 / 7", placeHolder: "" },
  title: { title: "Titre", row: "1 / 2", col: "1 / 7", placeHolder: "", type: "text" },
};
