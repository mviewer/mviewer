/**
 * Normalize operator names (case-insensitive).
 * @param {string} operator
 * @returns {string}
 */
function normalizeOgcOperator(operator) {
  return (operator || "").toString().trim().toLowerCase();
}

/**
 * Symbol for each supported operator.
 * @type {Object<string, string>}
 */
const OGC_OPERATOR_SYMBOLS = {
  or: "OR",
  not: "NOT",
  bbox: "BBOX",
  islike: "LIKE",
  isnull: "IS NULL",
  equalto: "=",
  lessthan: "<",
  isbetween: "BETWEEN",
  notequalto: "<>",
  greatherthan: ">",
  greaterthan: ">",
  lessthanorequalto: "<=",
  greaterthanorequalto: ">=",
};

/**
 * Get the symbol for an operator.
 * @param {string} operator
 * @returns {string|undefined}
 */
function getOgcOperatorSymbol(operator) {
  const normalized = normalizeOgcOperator(operator);
  return OGC_OPERATOR_SYMBOLS[normalized];
}

/**
 * Build a single OGC filter definition.
 * Supported operators: or, not, bbox, isLike, isNull, EqualTo, lessThan,
 * isBetween, NotEqualTo, GreatherThan, LessThanOrEqualTo, GreaterThanOrEqualTo.
 * @param {Object} definition
 * @returns {ol.format.filter.Filter|null}
 */
function buildOgcFilter(definition) {
  if (!definition) return null;

  const operator = normalizeOgcOperator(definition.operator);
  const propertyName =
    definition.field || definition.propertyName || definition.property;
  const matchCase =
    definition.matchCase === undefined ? false : definition.matchCase;

  switch (operator) {
    case "or": {
      const filters = (definition.filters || [])
        .map(buildOgcFilter)
        .filter(Boolean);
      if (!filters.length) return null;
      return filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
    }
    case "not": {
      const inner = buildOgcFilter(
        definition.filter || (definition.filters && definition.filters[0])
      );
      return inner ? ol.format.filter.not(inner) : null;
    }
    case "bbox": {
      const extent = definition.extent || definition.bbox;
      if (!propertyName || !extent) return null;
      return ol.format.filter.bbox(propertyName, extent, definition.srsName);
    }
    case "islike": {
      const pattern =
        definition.pattern !== undefined ? definition.pattern : definition.value;
      if (!propertyName || pattern === undefined) return null;
      const wildCard =
        definition.wildCard !== undefined ? definition.wildCard : "%";
      const singleChar =
        definition.singleChar !== undefined ? definition.singleChar : "_";
      const escapeChar =
        definition.escapeChar !== undefined ? definition.escapeChar : "\\";
      return ol.format.filter.like(
        propertyName,
        pattern,
        wildCard,
        singleChar,
        escapeChar,
        matchCase
      );
    }
    case "isnull": {
      if (!propertyName) return null;
      return ol.format.filter.isNull(propertyName);
    }
    case "equalto": {
      if (!propertyName) return null;
      return ol.format.filter.equalTo(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "notequalto": {
      if (!propertyName) return null;
      return ol.format.filter.notEqualTo(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "lessthan": {
      if (!propertyName) return null;
      return ol.format.filter.lessThan(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "greatherthan":
    case "greaterthan": {
      if (!propertyName) return null;
      return ol.format.filter.greaterThan(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "lessthanorequalto": {
      if (!propertyName) return null;
      return ol.format.filter.lessThanOrEqualTo(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "greaterthanorequalto": {
      if (!propertyName) return null;
      return ol.format.filter.greaterThanOrEqualTo(
        propertyName,
        definition.value,
        matchCase
      );
    }
    case "isbetween": {
      const lower =
        definition.lowerBoundary !== undefined
          ? definition.lowerBoundary
          : definition.lower;
      const upper =
        definition.upperBoundary !== undefined
          ? definition.upperBoundary
          : definition.upper;
      if (!propertyName || lower === undefined || upper === undefined) {
        return null;
      }
      return ol.format.filter.between(
        propertyName,
        lower,
        upper,
        matchCase
      );
    }
    default:
      return null;
  }
}

/**
 * Build a grouped OGC filter (defaults to AND).
 * @param {Array<Object>} definitions
 * @param {'and'|'or'} [operator='and']
 * @returns {ol.format.filter.Filter|null}
 */
function buildOgcFilters(definitions = [], operator = "and") {
  const filters = (definitions || []).map(buildOgcFilter).filter(Boolean);
  if (!filters.length) return null;
  const logical = normalizeOgcOperator(operator);
  if (logical === "or") {
    return filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
  }
  return filters.length === 1 ? filters[0] : ol.format.filter.and(...filters);
}

/**
 * Read the first ogc:Literal value from a filter XML string.
 * @param {string} filterXml
 * @param {string} [wildcardpattern]
 * @returns {string|null}
 */
function getOgcFilterLiteralValue(filterXml, wildcardpattern) {
  if (!filterXml || filterXml.trim().charAt(0) !== "<") {
    return null;
  }
  try {
    const doc = new DOMParser().parseFromString(filterXml, "text/xml");
    const literal =
      doc.getElementsByTagName("ogc:Literal")[0] ||
      doc.getElementsByTagName("Literal")[0];
    if (!literal) {
      return null;
    }
    let value = literal.textContent;
    if (value === null || value === undefined) {
      return null;
    }
    const pattern = wildcardpattern || "%value%";
    if (pattern.indexOf("value") === -1) {
      return value;
    }
    const parts = pattern.split("value");
    const prefix = parts[0];
    const suffix = parts[1] || "";
    if (prefix && value.indexOf(prefix) === 0) {
      value = value.slice(prefix.length);
    }
    if (suffix && value.lastIndexOf(suffix) === value.length - suffix.length) {
      value = value.slice(0, value.length - suffix.length);
    }
    return value;
  } catch (e) {
    return null;
  }
}

/**
 * Applies an OGC filter (AND / OR) to an OGC source.
 * Clears any CQL filter before setting the FILTER param.
 * @param {{operator: 'AND'|'OR', filters: Array}} ogcFilter
 * @param {ol.source.TileWMS|ol.source.ImageWMS} source
 */
function updateOgcSourceWithFilter(filter, source) {
  if (!source) return;

  const params = source.getParams?.();
  const format = ol.format.WFS;

  if (!filter) {
    source.updateParams({ FILTER: null });
    return;
  }

  if (params?.CQL_FILTER) {
    source.updateParams({ CQL_FILTER: null });
  }

  let finalFilter = filter;

  const xmlNode = format.writeFilter(finalFilter);
  const xml = new XMLSerializer().serializeToString(xmlNode);

  source.updateParams({ FILTER: xml });
}
