import { createStyleWithLabels } from "./geostylerLabels.js";

/**
 * Applies SLD symbols and labels to a vector layer.
 * @param {string} sldString SLD XML content.
 * @param {string} vectorLayerId Layer mviewer identifier.
 * @returns {Promise<ol.layer.Vector>} Styled layer.
 */
export const sld2VectorLayer = async (sldString, vectorLayerId) => {
  const vectorLayer = _map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("mviewerid") === vectorLayerId);

  if (!vectorLayer) {
    throw new Error(`Vector layer "${vectorLayerId}" was not found.`);
  }

  const { output: geoStylerStyle, errors } = await new SldStyleParser().readStyle(
    sldString
  );
  if (errors?.length) {
    throw errors[0];
  }

  const olStyle = await createStyleWithLabels(geoStylerStyle);
  // Let OpenLayers evaluate dynamic styles.
  vectorLayer.setStyle(olStyle);
  return vectorLayer;
};

/**
 * Loads an SLD and stores its content on the styled layer.
 * @param {string} sldPath SLD URL.
 * @param {string} vectorLayerId Layer mviewer identifier.
 * @returns {Promise<ol.layer.Vector>} Layer with `sldContent` set.
 */
export const sldFile2VectorLayer = async (sldPath, vectorLayerId) => {
  const response = await fetch(sldPath);
  if (!response.ok) {
    throw new Error(`Unable to load SLD file: ${sldPath}`);
  }
  const sldString = await response.text();
  const vectorLayer = await sld2VectorLayer(sldString, vectorLayerId);
  vectorLayer.set("sldContent", sldString);
  return vectorLayer;
};
