/**
 * Create OpenLayers style options for line geometries.
 * @param {Object} definition - JSON style definition.
 * @param {ol.Feature} feature - Feature used to resolve dynamic label values.
 * @param {{createStroke: function, createText: function}} helpers - Shared style helpers.
 * @returns {Object} OpenLayers style options.
 */
const createLineStyleOptions = (definition, feature, helpers) => {
  return {
    stroke: helpers.createStroke(definition.stroke || definition.line),
    text: helpers.createText(definition, feature),
  };
};

export { createLineStyleOptions };
