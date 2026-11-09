/**
 * Combines symbols and labels, preserving filters and scale limits.
 * @param {object} geoStylerStyle Parsed GeoStyler style.
 * @returns {Promise<ol.style.Style|ol.style.Style[]|Function>} Layer style.
 */
export const createStyleWithLabels = async (geoStylerStyle) => {
  const hasLabels = geoStylerStyle.rules.some((rule) =>
    rule.symbolizers.some((symbolizer) => symbolizer.kind === "Text")
  );

  /** Converts a style and propagates parser errors. */
  const convertStyle = async (style) => {
    const { output, errors } = await new OpenLayersParser().writeStyle(style);
    if (errors?.length) {
      throw errors[0];
    }
    if (!output) {
      throw new Error("Unable to convert GeoStyler style to OpenLayers.");
    }
    return output;
  };

  if (!hasLabels) {
    return convertStyle(geoStylerStyle);
  }

  /** Selects text or non-text symbolizers without removing rules. */
  const selectSymbolizers = (labels) => ({
    ...geoStylerStyle,
    // Keep empty rules for ElseFilter.
    rules: geoStylerStyle.rules.map((rule) => ({
      ...rule,
      symbolizers: rule.symbolizers.filter(
        (symbolizer) => (symbolizer.kind === "Text") === labels
      ),
    })),
  });

  const symbolStyle = await convertStyle(selectSymbolizers(false));
  const labelStyle = await convertStyle(selectSymbolizers(true));

  /** Evaluates the style and returns an array. */
  const evaluate = (style, feature, resolution) => {
    const result = typeof style === "function" ? style(feature, resolution) : style;
    return result ? (Array.isArray(result) ? result : [result]) : [];
  };

  return (feature, resolution) => [
    ...evaluate(symbolStyle, feature, resolution),
    ...evaluate(labelStyle, feature, resolution),
  ];
};
