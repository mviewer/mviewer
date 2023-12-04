/**
 * Create legend according to visible mviewer map layers
 * @returns string HTML
 */
export const Legend = () => {
  const layerDetails = [...document.querySelectorAll(".mv-layer-details")];
  const TitleAndLegend = layerDetails.map((detail, i) => {
    let legend = detail.querySelector(".mv-legend");
    if (legend) {
      // legend from WMS
      legend = detail.querySelector(".mv-legend").cloneNode();
      legend.id = _.uniqueId("print-lgnd-img-");
    } else {
      // vector legend
      let newId = detail.getAttribute("data-layerid");
      let canvas = detail.querySelector(".vector-legend");
      let canvasToImg = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      legend = `<img class="mv-legend" id="legend-${newId}" src="${canvasToImg}" alt="Légende non disponible" onload="mviewer &amp;&amp;" onerror="this.onerror=null;this.src='img/nolegend.png';">`;
    }
    return `
        <div class="print-legend-img">
            <p>${detail.getAttribute("data-title")}</p>
            ${legend?.outerHTML || legend}
        </div>
        `;
  });
  return TitleAndLegend.join("");
};
