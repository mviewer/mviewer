import { createClusterStyle } from "./olclusterFromJson.js";
import { createPointStyleOptions } from "./olPointFromJson.js";
import { createPolygonStyleOptions } from "./olPolygonFromJson.js";
import { createLineStyleOptions } from "./olLineFromJson.js";

/**
 * Wrap style options into an OpenLayers style instance for mviewer vector legends.
 * @param {Object} options - OpenLayers style constructor options.
 * @returns {ol.style.Style} OpenLayers style instance.
 */
const createLegendStyle = (options) => new ol.style.Style(options);

/**
 * Create a lightweight feature-like object used only to build legend styles.
 * @param {string} geometryType - OpenLayers geometry type used by the legend item.
 * @param {Object} [properties={}] - Feature properties used by dynamic style definitions.
 * @returns {{get: function(string): *, getGeometry: function(): {getType: function(): string}}} Feature-like object.
 */
const createLegendFeature = (geometryType, properties = {}) => ({
  get: (key) => properties[key],
  getGeometry: () => ({
    getType: () => geometryType,
  }),
});

/**
 * Create a lightweight cluster feature-like object for cluster legend rendering.
 * @param {number} count - Number of features represented by the cluster legend item.
 * @returns {{get: function(string): Array|undefined}} Cluster feature-like object.
 */
const createClusterFeature = (count) => ({
  get: (key) => {
    if (key === "features") {
      return Array.from({ length: count }, () => createLegendFeature("Point"));
    }
    return undefined;
  },
});

/**
 * Resolve the sample feature count used to draw the cluster legend item.
 * @param {Object} definition - Cluster JSON style definition.
 * @returns {number} Cluster count used for legend rendering.
 */
const getClusterLegendCount = (definition) => {
  const firstStop = definition.cluster?.circle?.radius?.stops?.[0]?.[0];
  return firstStop || 2;
};

/**
 * Default legend metadata by normalized geometry type.
 * @type {Object<string, {geometry: string, label: string}>}
 */
const legendDefinitionByType = {
  line: {
    geometry: "LineString",
    label: "Ligne",
  },
  linestring: {
    geometry: "LineString",
    label: "Ligne",
  },
  point: {
    geometry: "Point",
    label: "Point",
  },
  polygon: {
    geometry: "Polygon",
    label: "Polygone",
  },
};

/**
 * Create vector legend items from a JSON style definition.
 * @param {Object} definition - JSON style definition.
 * @param {{createFill: function, createStroke: function, createText: function}} helpers - Shared style helpers.
 * @returns {Array<{styles: ol.style.Style[], label: string, geometry: string}>} Vector legend items.
 */
const createLegendItems = (definition, helpers) => {
  const type = definition.type?.toLowerCase();

  if (type === "cluster") {
    const singleOptions = createPointStyleOptions(
      definition.single || { type: "point" },
      createLegendFeature("Point"),
      helpers
    );
    const clusterStyle = createClusterStyle(definition, helpers)(
      createClusterFeature(getClusterLegendCount(definition))
    );

    return [
      {
        styles: [createLegendStyle(singleOptions)],
        label: definition.single?.legendLabel || "Objet",
        geometry: "Point",
      },
      {
        styles: [clusterStyle],
        label: definition.cluster?.legendLabel || "Groupe",
        geometry: "Point",
      },
    ];
  }

  const legendDefinition = legendDefinitionByType[type] || legendDefinitionByType.point;
  const feature = createLegendFeature(legendDefinition.geometry);
  const optionsByType = {
    line: createLineStyleOptions,
    linestring: createLineStyleOptions,
    point: createPointStyleOptions,
    polygon: createPolygonStyleOptions,
  };
  const createOptions = optionsByType[type] || createPointStyleOptions;

  return [
    {
      styles: [createLegendStyle(createOptions(definition, feature, helpers))],
      label: definition.legendLabel || legendDefinition.label,
      geometry: legendDefinition.geometry,
    },
  ];
};

export { createLegendItems };
