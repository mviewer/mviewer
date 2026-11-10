/**
 * Combines symbols and labels, preserving filters and scale limits.
 * @param {object} geoStylerStyle Parsed GeoStyler style.
 * @param {number} [metersPerUnit=1] Map projection conversion used for SLD scale limits.
 * @returns {Promise<ol.style.StyleFunction>} Layer style callback.
 */
export const createStyleWithLabels = async (geoStylerStyle, metersPerUnit = 1) => {
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

  /** Evaluates parser output while preserving feature filters and resolution. */
  const evaluate = (style, feature, resolution) => {
    const result = typeof style === "function" ? style(feature, resolution) : style;
    return result ? (Array.isArray(result) ? result : [result]) : [];
  };

  if (!hasLabels) {
    const style = await convertStyle(geoStylerStyle);
    // Parser styles may use another OL module instance; callbacks avoid instanceof checks.
    return (feature, resolution) => evaluate(style, feature, resolution);
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
  const labelRules = selectSymbolizers(true).rules;
  const labelStyles = await Promise.all(
    labelRules
      .filter((rule) => rule.symbolizers.length)
      .map(async (rule) => {
        const style = await convertStyle({
          ...geoStylerStyle,
          rules: labelRules.map((candidate) => {
            const { scaleDenominator, ...properties } = candidate;
            return {
              ...properties,
              symbolizers: candidate === rule ? candidate.symbolizers : [],
            };
          }),
        });
        return { style, scale: rule.scaleDenominator || {} };
      })
  );

  const singletonLabels = new WeakMap();

  /**
   * Exposes source attributes to singleton labels without modifying either feature.
   * @param {ol.Feature} feature Rendered feature, possibly an OpenLayers cluster.
   * @returns {ol.Feature} Label feature retaining cluster count and rendered geometry.
   */
  const getLabelFeature = (feature) => {
    const members = feature.get("features");
    if (!Array.isArray(members) || members.length !== 1) return feature;
    const sourceFeature = members[0];
    const revision = sourceFeature.getRevision();
    const clusterRevision = feature.getRevision();
    const cached = singletonLabels.get(feature);
    if (
      cached &&
      cached.revision === revision &&
      cached.clusterRevision === clusterRevision
    ) {
      return cached.feature;
    }
    const labelFeature = new ol.Feature({
      ...feature.getProperties(),
      ...sourceFeature.getProperties(),
      geometry: feature.getGeometry(),
      features: members,
      count: 1,
    });
    singletonLabels.set(feature, { revision, clusterRevision, feature: labelFeature });
    return labelFeature;
  };

  return (feature, resolution) => {
    const labelFeature = getLabelFeature(feature);
    // SLD uses a 0.28 mm reference pixel; apply text scales independently of symbol scales.
    const scale = (resolution * metersPerUnit) / 0.00028;
    const labels = labelStyles.flatMap((entry) => {
      if (entry.scale.min !== undefined && scale < entry.scale.min) return [];
      if (entry.scale.max !== undefined && scale >= entry.scale.max) return [];
      return evaluate(entry.style, labelFeature, resolution);
    });
    return [...evaluate(symbolStyle, feature, resolution), ...labels];
  };
};
