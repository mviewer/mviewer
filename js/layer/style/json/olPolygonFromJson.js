/**
 * Create OpenLayers style options for polygon geometries.
 * @param {Object} definition - JSON style definition.
 * @param {ol.Feature} feature - Feature used to resolve dynamic label values.
 * @param {{createFill: function, createStroke: function, createText: function}} helpers - Shared style helpers.
 * @returns {Object} OpenLayers style options.
 */
const createPolygonStyleOptions = (definition, feature, helpers) => {
  return {
    fill: helpers.createFill(definition.fill),
    stroke: helpers.createStroke(definition.stroke),
    text: helpers.createText(definition, feature),
  };
};

export { createPolygonStyleOptions };
