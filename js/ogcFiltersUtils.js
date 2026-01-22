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

const WMS_SERVER_TYPES = {
  qgis: "qgis",
  geoserver: "geoserver",
  ogc: "ogc",
};

/**
 * Normalize server type value.
 * @param {string} value
 * @returns {string}
 */
function normalizeServerType(value) {
  const normalized = (value || "").toString().trim().toLowerCase();
  return WMS_SERVER_TYPES[normalized] || "";
}

/**
 * Escape single quotes for filter literals.
 * @param {string} value
 * @returns {string}
 */
function escapeFilterLiteral(value) {
  return value.toString().replace(/'/g, "''");
}

/**
 * Format field name for CQL.
 * @param {string} fieldName
 * @returns {string}
 */
function formatCqlFieldName(fieldName) {
  return fieldName || "";
}

/**
 * Format field name for QGIS expressions.
 * @param {string} fieldName
 * @returns {string}
 */
function formatQgisFieldName(fieldName) {
  if (!fieldName) return "";
  if (/^\".*\"$/.test(fieldName)) {
    return fieldName;
  }
  return `"${fieldName.replace(/\"/g, '""')}"`;
}

/**
 * Format literal for filter expressions.
 * @param {string|number|boolean} value
 * @returns {string}
 */
function formatFilterLiteral(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  return "'" + escapeFilterLiteral(value) + "'";
}

/**
 * Build a filter expression for QGIS/CQL from a definition.
 * @param {Object} definition
 * @param {string} serverType
 * @returns {string}
 */
function buildFilterExpression(definition, serverType) {
  if (!definition) return "";
  const operator = normalizeOgcOperator(definition.operator);
  const propertyName =
    definition.field || definition.propertyName || definition.property;
  const matchCase =
    definition.matchCase === undefined ? false : definition.matchCase;
  const fieldName =
    serverType === WMS_SERVER_TYPES.qgis
      ? formatQgisFieldName(propertyName)
      : formatCqlFieldName(propertyName);

  switch (operator) {
    case "or": {
      const filters = (definition.filters || [])
        .map((filter) => buildFilterExpression(filter, serverType))
        .filter(Boolean);
      if (!filters.length) return "";
      return filters.length === 1 ? filters[0] : filters.join(" OR ");
    }
    case "and": {
      const filters = (definition.filters || [])
        .map((filter) => buildFilterExpression(filter, serverType))
        .filter(Boolean);
      if (!filters.length) return "";
      return filters.length === 1 ? filters[0] : filters.join(" AND ");
    }
    case "not": {
      const inner = buildFilterExpression(
        definition.filter || (definition.filters && definition.filters[0]),
        serverType
      );
      return inner ? "NOT (" + inner + ")" : "";
    }
    case "bbox": {
      const extent = definition.extent || definition.bbox;
      if (!fieldName || !extent) return "";
      const srsName = definition.srsName || "";
      if (serverType === WMS_SERVER_TYPES.qgis) {
        const bboxArgs = extent.join(", ");
        const srsArg = srsName ? ", '" + escapeFilterLiteral(srsName) + "'" : "";
        return "intersects(" + fieldName + ", make_bbox(" + bboxArgs + srsArg + "))";
      }
      const srsSuffix = srsName ? ", '" + escapeFilterLiteral(srsName) + "'" : "";
      return (
        "BBOX(" +
        fieldName +
        ", " +
        extent.join(", ") +
        srsSuffix +
        ")"
      );
    }
    case "islike": {
      if (!fieldName) return "";
      const pattern =
        definition.pattern !== undefined ? definition.pattern : definition.value;
      if (pattern === undefined) return "";
      const likeOperator = matchCase ? "LIKE" : "ILIKE";
      return fieldName + " " + likeOperator + " " + formatFilterLiteral(pattern);
    }
    case "isnull": {
      if (!fieldName) return "";
      return fieldName + " IS NULL";
    }
    case "equalto": {
      if (!fieldName) return "";
      return fieldName + " = " + formatFilterLiteral(definition.value);
    }
    case "notequalto": {
      if (!fieldName) return "";
      return fieldName + " <> " + formatFilterLiteral(definition.value);
    }
    case "lessthan": {
      if (!fieldName) return "";
      return fieldName + " < " + formatFilterLiteral(definition.value);
    }
    case "greatherthan":
    case "greaterthan": {
      if (!fieldName) return "";
      return fieldName + " > " + formatFilterLiteral(definition.value);
    }
    case "lessthanorequalto": {
      if (!fieldName) return "";
      return fieldName + " <= " + formatFilterLiteral(definition.value);
    }
    case "greaterthanorequalto": {
      if (!fieldName) return "";
      return fieldName + " >= " + formatFilterLiteral(definition.value);
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
      if (!fieldName || lower === undefined || upper === undefined) {
        return "";
      }
      return (
        fieldName +
        " BETWEEN " +
        formatFilterLiteral(lower) +
        " AND " +
        formatFilterLiteral(upper)
      );
    }
    default:
      return "";
  }
}

/**
 * Attach a definition to an OpenLayers filter for later serialization.
 * @param {ol.format.filter.Filter} filter
 * @param {Object} definition
 * @returns {ol.format.filter.Filter}
 */
function attachFilterDefinition(filter, definition) {
  if (filter && definition) {
    filter.__mviewerDefinition = definition;
  }
  return filter;
}

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
      const filter =
        filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
      return attachFilterDefinition(filter, definition);
    }
    case "not": {
      const inner = buildOgcFilter(
        definition.filter || (definition.filters && definition.filters[0])
      );
      return inner
        ? attachFilterDefinition(ol.format.filter.not(inner), definition)
        : null;
    }
    case "bbox": {
      const extent = definition.extent || definition.bbox;
      if (!propertyName || !extent) return null;
      return attachFilterDefinition(
        ol.format.filter.bbox(propertyName, extent, definition.srsName),
        definition
      );
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
      return attachFilterDefinition(
        ol.format.filter.like(
          propertyName,
          pattern,
          wildCard,
          singleChar,
          escapeChar,
          matchCase
        ),
        definition
      );
    }
    case "isnull": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.isNull(propertyName),
        definition
      );
    }
    case "equalto": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.equalTo(propertyName, definition.value, matchCase),
        definition
      );
    }
    case "notequalto": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.notEqualTo(propertyName, definition.value, matchCase),
        definition
      );
    }
    case "lessthan": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.lessThan(propertyName, definition.value, matchCase),
        definition
      );
    }
    case "greatherthan":
    case "greaterthan": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.greaterThan(propertyName, definition.value, matchCase),
        definition
      );
    }
    case "lessthanorequalto": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.lessThanOrEqualTo(
          propertyName,
          definition.value,
          matchCase
        ),
        definition
      );
    }
    case "greaterthanorequalto": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.greaterThanOrEqualTo(
          propertyName,
          definition.value,
          matchCase
        ),
        definition
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
      return attachFilterDefinition(
        ol.format.filter.between(propertyName, lower, upper, matchCase),
        definition
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
    const filter =
      filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
    return attachFilterDefinition(filter, { operator: "or", filters: definitions });
  }
  const filter =
    filters.length === 1 ? filters[0] : ol.format.filter.and(...filters);
  return attachFilterDefinition(filter, { operator: "and", filters: definitions });
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
 * Chooses FILTER or CQL_FILTER based on the server type.
 * @param {{operator: 'AND'|'OR', filters: Array}} ogcFilter
 * @param {ol.source.TileWMS|ol.source.ImageWMS} source
 */
function updateOgcSourceWithFilter(filter, source) {
  if (!source) return;

  const params = source.getParams?.();
  const format = ol.format.WFS;
  const serverType = normalizeServerType(source.get?.("servertype"));
  const filterDefinition = filter && filter.__mviewerDefinition;
  const shouldClearCql =
    serverType === WMS_SERVER_TYPES.geoserver || serverType === "";
  const shouldClearFilter = true;

  if (!filter) {
    const clearParams = {};
    if (shouldClearFilter) {
      clearParams.FILTER = null;
    }
    if (shouldClearCql) {
      clearParams.CQL_FILTER = null;
    }
    source.updateParams(clearParams);
    return;
  }

  if (shouldClearCql && params?.CQL_FILTER) {
    source.updateParams({ CQL_FILTER: null });
  }

  if (shouldClearFilter && params?.FILTER) {
    source.updateParams({ FILTER: null });
  }

  if (
    (serverType === WMS_SERVER_TYPES.geoserver ||
      serverType === WMS_SERVER_TYPES.qgis) &&
    filterDefinition
  ) {
    const expression = buildFilterExpression(filterDefinition, serverType);
    if (expression) {
      if (serverType === WMS_SERVER_TYPES.geoserver) {
        source.updateParams({ CQL_FILTER: expression });
      } else {
        source.updateParams({ FILTER: expression });
      }
      return;
    }
  }

  let finalFilter = filter;

  const xmlNode = format.writeFilter(finalFilter);
  const xml = new XMLSerializer().serializeToString(xmlNode);

  source.updateParams({ FILTER: xml });
}
