import { Cluster } from "../cluster.js";

/**
 * Finds the first PointStacker transformation in xmlToJson output.
 * @param {*} node Parsed XML node, including repeated elements stored as arrays.
 * @returns {object|null} Matching transformation function, or null if absent.
 */
const findPointStacker = (node) => {
  if (!node || typeof node !== "object") return null;

  const functions = node.Transformation?.Function;
  const transformation = [functions]
    .flat()
    .find((fn) => fn?.name === "vec:PointStacker" || fn?.name === "gs:PointStacker");
  if (transformation) return transformation;

  // NamedLayer, UserStyle and FeatureTypeStyle can each contain repeated nodes.
  for (const child of Object.values(node)) {
    const result = findPointStacker(child);
    if (result) return result;
  }
  return null;
};

/**
 * Detects vec:PointStacker and its gs:PointStacker alias in parsed SLD JSON.
 * @param {object} sldAsJson Output of xmlToJson.
 * @returns {boolean} Whether the SLD contains a supported PointStacker transformation.
 */
export const detectPointStacker = (sldAsJson) => !!findPointStacker(sldAsJson);

/**
 * Creates a vector cluster, approximating PointStacker's cellSize with distance.
 * WMS sources remain handled by the server through their SLD request parameter.
 * The caller keeps the parsed SLD layer style; this function supplies a simple
 * default style and does not interpret SLD symbolizers or rendering expressions.
 * @param {object} sldAsJson Output of xmlToJson.
 * @param {ol.source.Source} source Existing source; only vector sources are converted.
 * @param {object} [options={}] Cluster distance and simple style overrides.
 * @param {number|string} [options.distance] Overrides the SLD cellSize in pixels.
 * @param {number|string} [options.minDistance=0] Minimum cluster spacing in pixels.
 * @param {number|string} [options.radius=10] Default circle radius in pixels.
 * @param {string} [options.strokeColor] Default circle outline color.
 * @param {string} [options.fillColor] Default circle fill color.
 * @param {string} [options.textFillColor] Default cluster count color.
 * @returns {Cluster|null} Cluster, or null for an absent transformation or unsupported source.
 * @throws {Error} If a distance or radius is not a finite, non-negative number.
 */
export const pointStackerToOlCluster = (sldAsJson, source, options = {}) => {
  const transformation = findPointStacker(sldAsJson);
  if (!transformation) return null;
  if (!(source instanceof ol.source.Vector)) return null;

  const parameters = [transformation.Function].flat();
  const cellSizeParameter = parameters.find(
    (parameter) =>
      parameter?.name === "parameter" && parameter.Literal?.[0] === "cellSize"
  );
  // A distance-based OpenLayers cluster approximates the server's grid cells.
  const cellSize = cellSizeParameter?.Literal?.[1];
  const distance = Number(options.distance ?? cellSize ?? 20);
  const minDistance = Number(options.minDistance ?? 0);
  const radius = Number(options.radius ?? 10);
  if (
    !Number.isFinite(distance) ||
    distance < 0 ||
    !Number.isFinite(minDistance) ||
    minDistance < 0 ||
    !Number.isFinite(radius) ||
    radius < 0
  ) {
    throw new Error(mviewer.tr("layer.cluster.error.options"));
  }

  const cluster = new Cluster(source, distance, minDistance, radius);
  cluster.setClusterStyle(options);
  return cluster;
};

/**
 * Converts the numeric expression subset used by PointStacker symbol sizes.
 * Expressions remain GeoStyler data objects; no JavaScript source is evaluated.
 * @param {Element} element SLD Size, Literal, PropertyName, Mul or sqrt element.
 * @returns {number|object} Numeric value or GeoStyler numeric function.
 * @throws {Error} If the size expression is unsupported or malformed.
 */
export const readPointStackerSize = (element) => {
  const children = Array.from(element.children);
  switch (element.localName) {
    case "Size":
      if (children.length === 1) return readPointStackerSize(children[0]);
      if (children.length) break;
    // A constant Size uses plain text rather than an OGC expression.
    case "Literal": {
      const text = element.textContent.trim();
      const number = Number(text);
      if (text && Number.isFinite(number)) return number;
      break;
    }
    case "PropertyName":
      if (element.textContent.trim() === "count") {
        return { name: "property", args: ["count"] };
      }
      break;
    case "Mul":
      if (children.length === 2) {
        return { name: "mul", args: children.map(readPointStackerSize) };
      }
      break;
    case "Function":
      if (element.getAttribute("name") === "sqrt" && children.length === 1) {
        return { name: "sqrt", args: children.map(readPointStackerSize) };
      }
      break;
  }
  throw new Error(mviewer.tr("layer.cluster.error.expression"));
};

/**
 * Reads SLD styles while adapting PointStacker geometry and numeric symbol sizes.
 * The supported size expressions are constants, count, multiplication and sqrt.
 * Other SLD rules and symbolizers are left to the existing GeoStyler parser.
 * @param {string} sldString SLD XML content.
 * @returns {Promise<object>} GeoStyler parser result, including output and errors.
 * @throws {Error} If a PointStacker size expression is unsupported.
 */
export const readSldWithPointStacker = async (sldString) => {
  const document = new DOMParser().parseFromString(sldString, "text/xml");
  const rules = Array.from(document.getElementsByTagNameNS("*", "Rule"));
  const sizes = [];
  let adapted = false;

  rules.forEach((rule, ruleIndex) => {
    const transformation = Array.from(rule.parentElement.children).find(
      (element) => element.localName === "Transformation"
    );
    const isPointStacker =
      transformation &&
      Array.from(transformation.children).some(
        (element) =>
          element.localName === "Function" &&
          ["vec:PointStacker", "gs:PointStacker"].includes(element.getAttribute("name"))
      );
    if (!isPointStacker) return;
    adapted = true;

    const symbolizers = Array.from(rule.children).filter((element) =>
      element.localName.endsWith("Symbolizer")
    );
    symbolizers.forEach((symbolizer, symbolizerIndex) => {
      const geometry = Array.from(symbolizer.children).find(
        (element) => element.localName === "Geometry"
      );
      // Server clusters use geom; client clusters use the default OL geometry.
      if (geometry?.textContent.trim() === "geom") geometry.remove();
      if (symbolizer.localName !== "PointSymbolizer") return;
      const size = symbolizer.getElementsByTagNameNS("*", "Size")[0];
      if (!size?.children.length) return;

      // SLD sizes are diameters; GeoStyler mark symbolizers use radii.
      sizes.push({
        ruleIndex,
        symbolizerIndex,
        radius: { name: "mul", args: [0.5, readPointStackerSize(size)] },
      });
      // Give the SLD parser a constant placeholder, then restore the expression.
      size.textContent = "1";
    });
  });

  const result = await new SldStyleParser().readStyle(
    adapted ? new XMLSerializer().serializeToString(document) : sldString
  );
  if (result.errors?.length || !result.output) return result;
  sizes.forEach(({ ruleIndex, symbolizerIndex, radius }) => {
    result.output.rules[ruleIndex].symbolizers[symbolizerIndex].radius = radius;
  });
  return result;
};
