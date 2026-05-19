import { applyClusterSource, createClusterStyle } from "./olclusterFromJson.js";
import { createLegendItems } from "./legendFromJson.js";
import { createLineStyleOptions } from "./olLineFromJson.js";
import { createPointStyleOptions } from "./olPointFromJson.js";
import { createPolygonStyleOptions } from "./olPolygonFromJson.js";

/**
 * Get a normalized OpenLayers geometry type from a feature.
 * @param {ol.Feature} feature - OpenLayers feature to inspect.
 * @returns {string|null} Lowercase geometry type without the Multi prefix, or null.
 */
const getGeometryType = (feature) => {
  const geometry = feature.getGeometry();
  if (!geometry) {
    return null;
  }
  return geometry.getType().replace("Multi", "").toLowerCase();
};

/**
 * Create an OpenLayers fill from a JSON fill definition.
 * @param {{color?: string, fillColor?: string}|undefined} definition - Fill style definition.
 * @returns {ol.style.Fill|undefined} OpenLayers fill instance.
 */
const createFill = (definition) => {
  const color = definition?.color || definition?.fillColor;
  if (!color) {
    return undefined;
  }
  return new ol.style.Fill({ color });
};

/**
 * Create an OpenLayers stroke from a JSON stroke definition.
 * @param {{color?: string, strokeColor?: string, width?: number, strokeWidth?: number, lineDash?: number[]}|undefined} definition - Stroke style definition.
 * @returns {ol.style.Stroke|undefined} OpenLayers stroke instance.
 */
const createStroke = (definition) => {
  const color = definition?.color || definition?.strokeColor;
  if (!color) {
    return undefined;
  }
  return new ol.style.Stroke({
    color,
    width: definition.width || definition.strokeWidth,
    lineDash: definition.lineDash,
  });
};

/**
 * Create an OpenLayers text style from a JSON label definition.
 * @param {Object} definition - Complete JSON style definition.
 * @param {ol.Feature} feature - Feature used to resolve dynamic label values.
 * @returns {ol.style.Text|undefined} OpenLayers text style.
 */
const createText = (definition, feature) => {
  const label = definition.label;
  if (!label) {
    return undefined;
  }

  const text = label.field ? feature.get(label.field) : label.text;
  if (text === undefined || text === null) {
    return undefined;
  }

  return new ol.style.Text({
    text: String(text),
    font: label.font,
    fill: createFill({ color: label.color }),
    stroke: createStroke(
      label.stroke || {
        color: label.haloColor,
        width: label.haloWidth,
      }
    ),
    offsetX: label.offsetX,
    offsetY: label.offsetY,
    textAlign: label.textAlign,
    textBaseline: label.textBaseline,
  });
};

const styleHelpers = {
  createFill,
  createStroke,
  createText,
};

const styleOptionsByGeometryType = {
  cluster: null,
  line: createLineStyleOptions,
  linestring: createLineStyleOptions,
  point: createPointStyleOptions,
  polygon: createPolygonStyleOptions,
};

/**
 * Convert a JSON style definition into an OpenLayers style function.
 * @param {Object} definition - JSON style definition.
 * @param {string} [definition.type] - Optional geometry type constraint: point, line, polygon.
 * @returns {function(ol.Feature): ol.style.Style} OpenLayers style function.
 */
const createStyle = (definition) => {
  if (definition.type === "cluster") {
    return createClusterStyle(definition, styleHelpers);
  }

  return (feature) => {
    const geometryType = getGeometryType(feature);
    const styleType = definition.type && definition.type.toLowerCase();
    const targetType = styleType || geometryType;
    const createOptions = styleOptionsByGeometryType[targetType];

    if (styleType && styleType !== geometryType) {
      return new ol.style.Style({
        text: createText(definition, feature),
      });
    }

    return new ol.style.Style(
      createOptions
        ? createOptions(definition, feature, styleHelpers)
        : { text: createText(definition, feature) }
    );
  };
};

/**
 * Apply a JSON style definition to an OpenLayers vector layer.
 * @param {ol.layer.Vector} layer - Layer to style.
 * @param {Object} definition - JSON style definition.
 */
const applyLayer = (layer, definition) => {
  if (definition.type === "cluster") {
    applyClusterSource(layer, definition);
  }
  layer.setStyle(createStyle(definition));
};

/**
 * Create a mviewer vector legend from a JSON style definition.
 * @param {Object} definition - JSON style definition.
 * @returns {{items: Array}} mviewer vector legend definition.
 */
const createLegend = (definition) => {
  return {
    items: createLegendItems(definition, styleHelpers),
  };
};

/**
 * Load a JSON style definition from an URL and convert it into an OpenLayers style function.
 * @param {string} url - URL of the JSON style definition.
 * @returns {Promise<function(ol.Feature): ol.style.Style>} Promise resolving to an OpenLayers style function.
 */
const load = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(createStyle);
};

/**
 * Load a JSON style definition from an URL and apply it to an OpenLayers vector layer.
 * @param {ol.layer.Vector} layer - Layer to style.
 * @param {string} url - URL of the JSON style definition.
 * @returns {Promise<Object>} Promise resolving to the loaded JSON style definition.
 */
const loadAndApply = (layer, url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((definition) => {
      applyLayer(layer, definition);
      return definition;
    });
};

/**
 * Global access point for non-module scripts.
 * @type {{createStyle: function(Object): function(ol.Feature): ol.style.Style, load: function(string): Promise<function(ol.Feature): ol.style.Style>}}
 */
window.layerStyleJson = {
  applyLayer,
  createLegend,
  createStyle,
  load,
  loadAndApply,
};

export { applyLayer, createLegend, createStyle, load, loadAndApply };
