/**
 * Create an OpenLayers circle image style.
 * @param {{radius?: number, fill?: Object, stroke?: Object, fillColor?: string, strokeColor?: string, strokeWidth?: number}} definition - Circle style definition.
 * @param {{createFill: function, createStroke: function}} helpers - Shared style helpers.
 * @returns {ol.style.Circle} OpenLayers circle image style.
 */
const createCircleStyle = (definition, helpers) => {
  const fillDefinition = {
    ...definition,
    ...definition.fill,
  };
  const strokeDefinition = {
    ...definition,
    ...definition.stroke,
  };

  return new ol.style.Circle({
    radius: definition.radius || 5,
    fill: helpers.createFill(fillDefinition),
    stroke: helpers.createStroke(strokeDefinition),
  });
};

/**
 * Create an OpenLayers icon image style.
 * @param {Object} definition - Icon style definition.
 * @param {string} definition.src - Icon image URL.
 * @param {number} [definition.scale] - Icon scale.
 * @param {number[]} [definition.anchor] - Icon anchor.
 * @param {string} [definition.anchorOrigin] - Icon anchor origin.
 * @param {string} [definition.anchorXUnits] - Icon anchor X units.
 * @param {string} [definition.anchorYUnits] - Icon anchor Y units.
 * @param {number} [definition.opacity] - Icon opacity.
 * @param {number} [definition.rotation] - Icon rotation.
 * @returns {ol.style.Icon|undefined} OpenLayers icon image style.
 */
const createIconStyle = (definition) => {
  if (!definition?.src) {
    return undefined;
  }

  return new ol.style.Icon({
    src: definition.src,
    scale: definition.scale,
    anchor: definition.anchor,
    anchorOrigin: definition.anchorOrigin,
    anchorXUnits: definition.anchorXUnits,
    anchorYUnits: definition.anchorYUnits,
    opacity: definition.opacity,
    rotation: definition.rotation,
  });
};

/**
 * Create OpenLayers style options for point geometries.
 * @param {Object} definition - JSON style definition.
 * @param {ol.Feature} feature - Feature used to resolve dynamic label values.
 * @param {{createFill: function, createStroke: function, createText: function}} helpers - Shared style helpers.
 * @returns {Object} OpenLayers style options.
 */
const createPointStyleOptions = (definition, feature, helpers) => {
  const image = definition.image || definition.point;

  if (definition.icon) {
    return {
      image: createIconStyle(definition.icon),
      text: helpers.createText(definition, feature),
    };
  }

  if (definition.circle) {
    return {
      image: createCircleStyle(definition.circle, helpers),
      text: helpers.createText(definition, feature),
    };
  }

  if (image?.type && image.type !== "circle") {
    console.warn(`Unsupported GeoJSON style image type: ${image.type}`);
    return {
      text: helpers.createText(definition, feature),
    };
  }

  return {
    image: image ? createCircleStyle(image, helpers) : undefined,
    text: helpers.createText(definition, feature),
  };
};

export { createPointStyleOptions };
