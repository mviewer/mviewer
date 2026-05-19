import { createPointStyleOptions } from "./olPointFromJson.js";

/**
 * Resolve either a static numeric value or an interpolation definition.
 * @param {number|Object|undefined} definition - Static value or interpolation object.
 * @param {number} value - Input value used to evaluate the interpolation.
 * @param {string} [definition.type] - Interpolation type. Only "interpolate" is supported.
 * @param {Array<Array<number>>} [definition.stops] - Ordered [input, output] interpolation stops.
 * @returns {number|undefined} Resolved numeric value.
 */
const interpolateValue = (definition, value) => {
  if (!definition || typeof definition !== "object") {
    return definition;
  }
  if (definition.type !== "interpolate" || !Array.isArray(definition.stops)) {
    return definition;
  }

  const stops = definition.stops;
  if (stops.length === 0) {
    return undefined;
  }
  if (value <= stops[0][0]) {
    return stops[0][1];
  }

  for (let i = 1; i < stops.length; i++) {
    const previous = stops[i - 1];
    const current = stops[i];
    if (value <= current[0]) {
      const ratio = (value - previous[0]) / (current[0] - previous[0]);
      return previous[1] + (current[1] - previous[1]) * ratio;
    }
  }

  return stops[stops.length - 1][1];
};

/**
 * Resolve dynamic cluster circle properties against a cluster feature count.
 * @param {Object|undefined} definition - Cluster style definition.
 * @param {Object} [definition.circle] - Circle style definition.
 * @param {number|Object} [definition.circle.radius] - Static radius or interpolation definition.
 * @param {number} count - Number of features in the cluster.
 * @returns {Object|undefined} Cluster style definition with resolved circle values.
 */
const resolveCircleDefinition = (definition, count) => {
  if (!definition?.circle) {
    return definition;
  }
  return {
    ...definition,
    circle: {
      ...definition.circle,
      radius: interpolateValue(definition.circle.radius, count),
    },
  };
};

/**
 * Create the text style displayed inside or around a cluster symbol.
 * @param {Object} definition - Cluster style definition.
 * @param {Object} [definition.text] - Cluster text style definition.
 * @param {Object} [definition.label] - Alternative cluster label style definition.
 * @param {number} count - Number of features in the cluster.
 * @param {{createFill: function, createStroke: function}} helpers - Shared style helpers.
 * @returns {ol.style.Text|undefined} OpenLayers text style.
 */
const createClusterText = (definition, count, helpers) => {
  const textDefinition = definition.text || definition.label;
  if (!textDefinition) {
    return undefined;
  }

  return new ol.style.Text({
    text: String(textDefinition.field === "count" ? count : textDefinition.text || count),
    font: textDefinition.font,
    fill: helpers.createFill({ color: textDefinition.color }),
    stroke: helpers.createStroke(
      textDefinition.stroke || {
        color: textDefinition.haloColor,
        width: textDefinition.haloWidth,
      }
    ),
    offsetX: textDefinition.offsetX,
    offsetY: textDefinition.offsetY,
    textAlign: textDefinition.textAlign,
    textBaseline: textDefinition.textBaseline,
  });
};

/**
 * Create an OpenLayers style function for cluster features.
 * @param {Object} definition - Cluster JSON style definition.
 * @param {Object} [definition.single] - Point style used when a cluster contains only one feature.
 * @param {Object} [definition.cluster] - Style used when a cluster contains several features.
 * @param {{createFill: function, createStroke: function, createText: function}} helpers - Shared style helpers.
 * @returns {function(ol.Feature): ol.style.Style} OpenLayers style function.
 */
const createClusterStyle = (definition, helpers) => {
  return (feature) => {
    const features = feature.get("features") || [];
    const count = features.length;

    if (count <= 1) {
      return new ol.style.Style(
        createPointStyleOptions(definition.single || { type: "point" }, features[0] || feature, helpers)
      );
    }

    const clusterDefinition = resolveCircleDefinition(definition.cluster, count);
    const options = createPointStyleOptions(clusterDefinition, feature, {
      ...helpers,
      createText: () => createClusterText(clusterDefinition, count, helpers),
    });

    return new ol.style.Style(options);
  };
};

/**
 * Replace a vector layer source with an OpenLayers cluster source.
 * @param {ol.layer.Vector} layer - Vector layer to configure.
 * @param {Object} definition - Cluster JSON style definition.
 * @param {number} [definition.distance=20] - Pixel distance within which features are clustered together.
 * @param {number} [definition.minDistance=0] - Minimum pixel distance between rendered clusters.
 * @returns {void}
 */
const applyClusterSource = (layer, definition) => {
  const source = layer.getSource();
  if (source instanceof ol.source.Cluster) {
    source.setDistance(definition.distance || 20);
    if (definition.minDistance && source.setMinDistance) {
      source.setMinDistance(definition.minDistance);
    }
    return;
  }

  layer.setSource(
    new ol.source.Cluster({
      distance: definition.distance || 20,
      minDistance: definition.minDistance || 0,
      source,
    })
  );
};

export { applyClusterSource, createClusterStyle };
