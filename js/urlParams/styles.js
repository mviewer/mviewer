// polygon style
export const polygonStyle = (text) => {
  let config = configuration.getConfiguration();

  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 5,
      color: config?.urlparams?.stroke || "rgba(27, 73, 196, 0.8)",
    }),
    fill: new ol.style.Fill({
      color: config?.urlparams?.fill || "rgba(235, 237, 242, 0.0)",
    }),
    text: new ol.style.Text({
      font: "12px Arial",
      fill: new ol.style.Fill({
        color: "#ffffff",
      }),
      text: text,
      placement: "center",
    }),
  });
};
