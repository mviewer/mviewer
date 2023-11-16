export const Legend = () => {
  const layerDetails = [...document.querySelectorAll(".mv-layer-details")];
  const TitleAndLegend = layerDetails.map((detail) => {
    let legend = detail.querySelector(".mv-legend");
    if (legend) {
      legend = detail.querySelector(".mv-legend").cloneNode();
      legend.id = _.uniqueId("print-lgnd-img-");
    }
    return `
        <div class="print-legend-img">
            <p>${detail.getAttribute("data-title")}</p>
            ${legend.outerHTML}
        </div>
        `;
  });
  return TitleAndLegend.join("");
};
