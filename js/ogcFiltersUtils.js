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
 * Check if a node is an element.
 * @param {Node} node
 * @returns {boolean}
 */
function isElementNode(node) {
  return !!node && node.nodeType === 1;
}

/**
 * Get element children for a node.
 * @param {Node} node
 * @returns {Element[]}
 */
function getElementChildren(node) {
  if (!node || !node.childNodes) return [];
  return Array.from(node.childNodes).filter(isElementNode);
}

/**
 * Read the first element child matching a localName.
 * @param {Element} node
 * @param {string[]} names
 * @returns {Element|null}
 */
function getFirstChildByLocalName(node, names) {
  if (!node) return null;
  const targets = names.map((name) => name.toLowerCase());
  const children = getElementChildren(node);
  for (const child of children) {
    const local = (child.localName || child.nodeName || "").toLowerCase();
    if (targets.includes(local)) {
      return child;
    }
  }
  return null;
}

/**
 * Parse a boolean attribute.
 * @param {string|null} value
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
function parseBooleanAttribute(value, defaultValue) {
  if (value === null || value === undefined) return defaultValue;
  const normalized = value.toString().trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return defaultValue;
}

/**
 * Parse an OGC XML filter string to a definition.
 * @param {string} filterXml
 * @returns {Object|null}
 */
function parseOgcFilterXmlToDefinition(filterXml) {
  if (!filterXml || filterXml.trim().charAt(0) !== "<") return null;
  let doc;
  try {
    doc = new DOMParser().parseFromString(filterXml, "text/xml");
  } catch (e) {
    return null;
  }
  if (!doc || !doc.documentElement) return null;
  let filterNode =
    doc.getElementsByTagName("ogc:Filter")[0] ||
    doc.getElementsByTagName("Filter")[0] ||
    doc.documentElement;
  if (!filterNode) return null;
  if ((filterNode.localName || filterNode.nodeName).toLowerCase() === "filter") {
    const inner = getElementChildren(filterNode)[0];
    if (inner) {
      filterNode = inner;
    }
  }
  return parseOgcFilterNode(filterNode);
}

/**
 * Parse an OGC filter node to a definition.
 * @param {Element} node
 * @returns {Object|null}
 */
function parseOgcFilterNode(node) {
  if (!node) return null;
  const local = (node.localName || node.nodeName || "").toLowerCase();
  switch (local) {
    case "and":
    case "or": {
      const operator = local;
      const filters = getElementChildren(node).map(parseOgcFilterNode).filter(Boolean);
      if (!filters.length) return null;
      return { operator, filters };
    }
    case "not": {
      const inner = getElementChildren(node)[0];
      if (!inner) return null;
      const definition = parseOgcFilterNode(inner);
      return definition ? { operator: "not", filter: definition } : null;
    }
    case "bbox": {
      const propertyNode = getFirstChildByLocalName(node, [
        "PropertyName",
        "ValueReference",
      ]);
      const field = propertyNode ? propertyNode.textContent.trim() : "";
      if (!field) return null;
      const srsName =
        node.getAttribute("srsName") ||
        (getFirstChildByLocalName(node, ["Envelope", "Box"]) || {}).getAttribute?.(
          "srsName"
        ) ||
        "";
      let extent = null;
      const envelope = getFirstChildByLocalName(node, ["Envelope", "Box"]);
      if (envelope) {
        const lower = getFirstChildByLocalName(envelope, ["lowerCorner"]);
        const upper = getFirstChildByLocalName(envelope, ["upperCorner"]);
        if (lower && upper) {
          const lowerVals = lower.textContent.trim().split(/\s+/).map(Number);
          const upperVals = upper.textContent.trim().split(/\s+/).map(Number);
          if (lowerVals.length >= 2 && upperVals.length >= 2) {
            extent = [lowerVals[0], lowerVals[1], upperVals[0], upperVals[1]];
          }
        } else {
          const coords = getFirstChildByLocalName(envelope, ["coordinates"]);
          if (coords) {
            const parts = coords.textContent
              .trim()
              .split(/\s+/)
              .map((pair) => pair.split(",").map(Number));
            if (parts.length >= 2) {
              extent = [parts[0][0], parts[0][1], parts[1][0], parts[1][1]];
            }
          }
        }
      }
      if (!extent) {
        const literals = getElementChildren(node).filter(
          (child) => (child.localName || child.nodeName).toLowerCase() === "literal"
        );
        if (literals.length >= 4) {
          extent = literals.slice(0, 4).map((literal) => Number(literal.textContent));
        }
      }
      if (!extent) return null;
      return {
        operator: "bbox",
        field,
        extent,
        srsName,
      };
    }
    case "propertyislike": {
      const propertyNode = getFirstChildByLocalName(node, [
        "PropertyName",
        "ValueReference",
      ]);
      const literalNode = getFirstChildByLocalName(node, ["Literal"]);
      const field = propertyNode ? propertyNode.textContent.trim() : "";
      if (!field || !literalNode) return null;
      const pattern = literalNode.textContent;
      return {
        operator: "isLike",
        field,
        pattern,
        wildCard: node.getAttribute("wildCard") || "%",
        singleChar: node.getAttribute("singleChar") || "_",
        escapeChar: node.getAttribute("escapeChar") || "\\",
        matchCase: parseBooleanAttribute(node.getAttribute("matchCase"), true),
      };
    }
    case "propertyisnull": {
      const propertyNode = getFirstChildByLocalName(node, [
        "PropertyName",
        "ValueReference",
      ]);
      const field = propertyNode ? propertyNode.textContent.trim() : "";
      return field ? { operator: "isNull", field } : null;
    }
    case "propertyisequalto":
    case "propertyisnotequalto":
    case "propertyislessthan":
    case "propertyisgreaterthan":
    case "propertyislessthanorequalto":
    case "propertyisgreaterthanorequalto": {
      const propertyNode = getFirstChildByLocalName(node, [
        "PropertyName",
        "ValueReference",
      ]);
      const literalNode = getFirstChildByLocalName(node, ["Literal"]);
      const field = propertyNode ? propertyNode.textContent.trim() : "";
      if (!field || !literalNode) return null;
      const value = literalNode.textContent;
      const operatorMap = {
        propertyisequalto: "EqualTo",
        propertyisnotequalto: "NotEqualTo",
        propertyislessthan: "lessThan",
        propertyisgreaterthan: "greaterThan",
        propertyislessthanorequalto: "LessThanOrEqualTo",
        propertyisgreaterthanorequalto: "GreaterThanOrEqualTo",
      };
      return { operator: operatorMap[local], field, value };
    }
    case "propertyisbetween": {
      const propertyNode = getFirstChildByLocalName(node, [
        "PropertyName",
        "ValueReference",
      ]);
      const lowerNode = getFirstChildByLocalName(node, ["LowerBoundary"]);
      const upperNode = getFirstChildByLocalName(node, ["UpperBoundary"]);
      const field = propertyNode ? propertyNode.textContent.trim() : "";
      const lowerLiteral = lowerNode && getFirstChildByLocalName(lowerNode, ["Literal"]);
      const upperLiteral = upperNode && getFirstChildByLocalName(upperNode, ["Literal"]);
      if (!field || !lowerLiteral || !upperLiteral) return null;
      return {
        operator: "isBetween",
        field,
        lower: lowerLiteral.textContent,
        upper: upperLiteral.textContent,
      };
    }
    default:
      return null;
  }
}

/**
 * Tokenize a CQL expression.
 * @param {string} input
 * @returns {Array}
 */
function tokenizeCql(input) {
  const tokens = [];
  let index = 0;
  const length = input.length;
  const isWhitespace = (ch) => /\s/.test(ch);
  const isIdentifierStart = (ch) => /[A-Za-z_]/.test(ch);
  const isIdentifierPart = (ch) => /[A-Za-z0-9_.:]/.test(ch);

  while (index < length) {
    const ch = input[index];
    if (isWhitespace(ch)) {
      index += 1;
      continue;
    }
    if (ch === "(" || ch === ")" || ch === ",") {
      tokens.push({ type: ch, value: ch });
      index += 1;
      continue;
    }
    const two = input.slice(index, index + 2);
    if (two === ">=" || two === "<=" || two === "<>" || two === "!=") {
      tokens.push({ type: "operator", value: two });
      index += 2;
      continue;
    }
    if (ch === "=" || ch === "<" || ch === ">") {
      tokens.push({ type: "operator", value: ch });
      index += 1;
      continue;
    }
    if (ch === "'") {
      let value = "";
      index += 1;
      while (index < length) {
        const current = input[index];
        if (current === "'") {
          const next = input[index + 1];
          if (next === "'") {
            value += "'";
            index += 2;
            continue;
          }
          index += 1;
          break;
        }
        value += current;
        index += 1;
      }
      tokens.push({ type: "string", value });
      continue;
    }
    if (ch === '"') {
      let value = "";
      index += 1;
      while (index < length) {
        const current = input[index];
        if (current === '"') {
          const next = input[index + 1];
          if (next === '"') {
            value += '"';
            index += 2;
            continue;
          }
          index += 1;
          break;
        }
        value += current;
        index += 1;
      }
      tokens.push({ type: "identifier", value });
      continue;
    }
    if (/[0-9.+-]/.test(ch)) {
      const start = index;
      let hasDot = false;
      if (ch === "+" || ch === "-") {
        index += 1;
      }
      while (index < length) {
        const current = input[index];
        if (current === ".") {
          if (hasDot) break;
          hasDot = true;
          index += 1;
          continue;
        }
        if (!/[0-9]/.test(current)) break;
        index += 1;
      }
      const raw = input.slice(start, index);
      if (/^[+-]?\d+(\.\d+)?$/.test(raw)) {
        tokens.push({ type: "number", value: Number(raw) });
        continue;
      }
      index = start;
    }
    if (isIdentifierStart(ch)) {
      let value = ch;
      index += 1;
      while (index < length && isIdentifierPart(input[index])) {
        value += input[index];
        index += 1;
      }
      tokens.push({ type: "identifier", value });
      continue;
    }
    index += 1;
  }
  return tokens;
}

/**
 * Parse a CQL expression into a filter definition.
 * @param {string} cql
 * @returns {Object|null}
 */
function parseCqlToDefinition(cql) {
  if (!cql || !cql.trim()) return null;
  const tokens = tokenizeCql(cql);
  let position = 0;

  const peek = () => tokens[position];
  const consume = () => tokens[position++];
  const matchKeyword = (value) => {
    const token = peek();
    if (!token || token.type !== "identifier") return false;
    return token.value.toLowerCase() === value;
  };
  const expect = (type, value) => {
    const token = consume();
    if (!token || token.type !== type || (value && token.value !== value)) {
      return null;
    }
    return token;
  };

  const parseExpression = () => parseOr();

  const parseOr = () => {
    let left = parseAnd();
    if (!left) return null;
    const filters = [left];
    while (matchKeyword("or")) {
      consume();
      const right = parseAnd();
      if (!right) return null;
      filters.push(right);
    }
    if (filters.length === 1) return left;
    return { operator: "or", filters };
  };

  const parseAnd = () => {
    let left = parseNot();
    if (!left) return null;
    const filters = [left];
    while (matchKeyword("and")) {
      consume();
      const right = parseNot();
      if (!right) return null;
      filters.push(right);
    }
    if (filters.length === 1) return left;
    return { operator: "and", filters };
  };

  const parseNot = () => {
    if (matchKeyword("not")) {
      consume();
      const inner = parseNot();
      if (!inner) return null;
      return { operator: "not", filter: inner };
    }
    return parsePrimary();
  };

  const parsePrimary = () => {
    const token = peek();
    if (!token) return null;
    if (token.type === "(") {
      consume();
      const expr = parseExpression();
      if (!expect(")", ")")) return null;
      return expr;
    }
    return parsePredicate();
  };

  const parsePredicate = () => {
    if (matchKeyword("bbox")) {
      consume();
      if (!expect("(", "(")) return null;
      const field = parseIdentifier();
      if (!field) return null;
      if (!expect(",", ",")) return null;
      const minx = parseLiteral();
      if (!expect(",", ",")) return null;
      const miny = parseLiteral();
      if (!expect(",", ",")) return null;
      const maxx = parseLiteral();
      if (!expect(",", ",")) return null;
      const maxy = parseLiteral();
      let srsName = "";
      if (peek() && peek().type === ",") {
        consume();
        const srs = parseLiteral();
        if (typeof srs === "string") {
          srsName = srs;
        }
      }
      if (!expect(")", ")")) return null;
      return {
        operator: "bbox",
        field,
        extent: [Number(minx), Number(miny), Number(maxx), Number(maxy)],
        srsName,
      };
    }
    const field = parseIdentifier();
    if (!field) return null;
    if (matchKeyword("is")) {
      consume();
      if (matchKeyword("null")) {
        consume();
        return { operator: "isNull", field };
      }
      return null;
    }
    if (matchKeyword("between")) {
      consume();
      const lower = parseLiteral();
      if (!matchKeyword("and")) return null;
      consume();
      const upper = parseLiteral();
      return { operator: "isBetween", field, lower, upper };
    }
    if (matchKeyword("like") || matchKeyword("ilike")) {
      const likeToken = consume();
      const pattern = parseLiteral();
      return {
        operator: "isLike",
        field,
        pattern,
        matchCase: likeToken.value.toLowerCase() === "like",
      };
    }
    const opToken = consume();
    if (!opToken || opToken.type !== "operator") return null;
    const value = parseLiteral();
    const operatorMap = {
      "=": "EqualTo",
      "!=": "NotEqualTo",
      "<>": "NotEqualTo",
      "<": "lessThan",
      "<=": "LessThanOrEqualTo",
      ">": "greaterThan",
      ">=": "GreaterThanOrEqualTo",
    };
    return { operator: operatorMap[opToken.value], field, value };
  };

  const parseIdentifier = () => {
    const token = consume();
    if (!token || token.type !== "identifier") return null;
    return token.value;
  };

  const parseLiteral = () => {
    const token = consume();
    if (!token) return null;
    if (token.type === "string") return token.value;
    if (token.type === "number") return token.value;
    if (token.type === "identifier") {
      const value = token.value.toLowerCase();
      if (value === "true") return true;
      if (value === "false") return false;
      if (value === "null") return null;
      return token.value;
    }
    return null;
  };

  const definition = parseExpression();
  if (!definition) return null;
  return definition;
}

/**
 * Serialize an OGC filter object to XML string.
 * @param {ol.format.filter.Filter} filter
 * @returns {string|null}
 */
function serializeOgcFilterToXml(filter) {
  if (!filter) return null;
  try {
    // const format = new ol.format.WFS();
    // const writeFilter =
    //   typeof format.writeFilter === "function"
    //     ? format.writeFilter.bind(format)
    //     : typeof ol.format.WFS.writeFilter === "function"
    //       ? ol.format.WFS.writeFilter
    //       : null;
    // if (!writeFilter) {
    //   return null;
    // }
    const xmlNode = ol.format.WFS.writeFilter(filter);
    return new XMLSerializer().serializeToString(xmlNode);
  } catch (e) {
    return null;
  }
}

/**
 * Convert a CQL filter string to an OGC filter object or string.
 * @param {string|ol.format.filter.Filter} cqlFilter
 * @param {boolean} [asStringBoolean=false]
 * @returns {ol.format.filter.Filter|string|null}
 */
function cqlToOGC(cqlFilter, asStringBoolean = false) {
  if (!cqlFilter) return null;
  if (typeof cqlFilter !== "string") {
    if (asStringBoolean) {
      return serializeOgcFilterToXml(cqlFilter);
    }
    return cqlFilter;
  }
  const trimmed = cqlFilter.trim();
  if (!trimmed) return null;
  if (trimmed.charAt(0) === "<") {
    if (asStringBoolean) {
      return trimmed;
    }
    try {
      const format = new ol.format.WFS();
      const doc = new DOMParser().parseFromString(trimmed, "text/xml");
      const readFilter =
        typeof format.readFilter === "function"
          ? format.readFilter.bind(format)
          : typeof ol.format.WFS.readFilter === "function"
          ? ol.format.WFS.readFilter
          : null;
      if (!readFilter) {
        return null;
      }
      const filter = readFilter(doc);
      return filter || null;
    } catch (e) {
      return null;
    }
  }
  const definition = parseCqlToDefinition(trimmed);
  if (!definition) return null;
  const filter = buildOgcFilter(definition);
  if (!filter) return null;
  if (asStringBoolean) {
    return serializeOgcFilterToXml(filter);
  }
  return filter;
}

/**
 * Convert an OGC filter (object or XML) to a CQL string.
 * @param {ol.format.filter.Filter|string} ogcFilter
 * @returns {string}
 */
function ogcToCql(ogcFilter) {
  if (!ogcFilter) return "";
  let definition = null;
  if (typeof ogcFilter === "string") {
    const trimmed = ogcFilter.trim();
    if (!trimmed) return "";
    if (trimmed.charAt(0) !== "<") {
      return trimmed;
    }
    definition = parseOgcFilterXmlToDefinition(trimmed);
  } else if (ogcFilter.__mviewerDefinition) {
    definition = ogcFilter.__mviewerDefinition;
  } else {
    try {
      const format = new ol.format.WFS();
      const xmlNode = ol.format.WFS.writeFilter(ogcFilter);
      const xml = new XMLSerializer().serializeToString(xmlNode);
      definition = parseOgcFilterXmlToDefinition(xml);
    } catch (e) {
      definition = null;
    }
  }
  if (!definition) return "";
  return buildFilterExpression(definition, WMS_SERVER_TYPES.geoserver);
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
  const propertyName = definition.field || definition.propertyName || definition.property;
  const matchCase = definition.matchCase === undefined ? false : definition.matchCase;
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
      return "BBOX(" + fieldName + ", " + extent.join(", ") + srsSuffix + ")";
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
  const propertyName = definition.field || definition.propertyName || definition.property;
  const matchCase = definition.matchCase === undefined ? false : definition.matchCase;

  switch (operator) {
    case "and": {
      const filters = (definition.filters || []).map(buildOgcFilter).filter(Boolean);
      if (!filters.length) return null;
      const filter = filters.length === 1 ? filters[0] : ol.format.filter.and(...filters);
      return attachFilterDefinition(filter, definition);
    }
    case "or": {
      const filters = (definition.filters || []).map(buildOgcFilter).filter(Boolean);
      if (!filters.length) return null;
      const filter = filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
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
      const wildCard = definition.wildCard !== undefined ? definition.wildCard : "%";
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
      return attachFilterDefinition(ol.format.filter.isNull(propertyName), definition);
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
        ol.format.filter.lessThanOrEqualTo(propertyName, definition.value, matchCase),
        definition
      );
    }
    case "greaterthanorequalto": {
      if (!propertyName) return null;
      return attachFilterDefinition(
        ol.format.filter.greaterThanOrEqualTo(propertyName, definition.value, matchCase),
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
    const filter = filters.length === 1 ? filters[0] : ol.format.filter.or(...filters);
    return attachFilterDefinition(filter, { operator: "or", filters: definitions });
  }
  const filter = filters.length === 1 ? filters[0] : ol.format.filter.and(...filters);
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
  const shouldClearCql = serverType === WMS_SERVER_TYPES.geoserver || serverType === "";
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
    (serverType === WMS_SERVER_TYPES.geoserver || serverType === WMS_SERVER_TYPES.qgis) &&
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
