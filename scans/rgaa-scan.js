#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Static RGAA scanner for HTML files, templates and HTML fragments embedded in
 * JavaScript strings. The checks are intentionally conservative heuristics and
 * do not replace a manual RGAA audit.
 */

/**
 * @typedef {Object.<string, string|boolean>} CliArgs
 */

/**
 * @typedef {Object} Criterion
 * @property {string} id RGAA criterion identifier.
 * @property {string} thematique Criterion category.
 * @property {string} critere Criterion label from the CSV file.
 */

/**
 * @typedef {Object} Source
 * @property {"html"|"js-template"} type Source kind.
 * @property {string} path Repository-relative source path.
 * @property {string} content HTML content to scan.
 * @property {number} lineOffset Line offset when the source comes from a JS string.
 * @property {boolean} isDocument Whether the source is a full HTML document.
 */

/**
 * @typedef {Object} TagMatch
 * @property {string} tag Lowercase tag name.
 * @property {string} full Full matched HTML tag or element.
 * @property {string} attrsText Raw attribute text.
 * @property {string} inner Inner HTML for non-void matched elements.
 * @property {number} index Character index in the source content.
 * @property {Object.<string, string>} attrs Parsed lowercase attributes.
 */

/**
 * @typedef {Object} RgaaIssue
 * @property {string} criterion RGAA criterion identifier.
 * @property {string} file Repository-relative file path.
 * @property {number} line One-based line number.
 * @property {string} message Human-readable issue description.
 * @property {string} snippet Short HTML snippet.
 */

/**
 * @typedef {Object} Rule
 * @property {string} id RGAA criterion identifier.
 * @property {"oui"|"partiel"} automated Automation coverage level.
 * @property {string} description Fallback criterion description.
 * @property {(source: Source, ruleId: string) => RgaaIssue[]} check Rule implementation.
 * @property {boolean} [htmlDocumentsOnly] Whether the rule applies only to full HTML documents.
 */

const DEFAULT_EXTENSIONS = new Set([".html", ".htm", ".mst", ".tpl", ".mustache"]);
const JS_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);
const IGNORED_DIRS = new Set([
  ".git",
  ".github",
  ".tmp",
  "node_modules",
  "dist",
  "build",
  "_build",
  "coverage",
  "demo",
  "lib",
]);
const MAX_JS_FILE_SIZE = 512 * 1024;

const args = parseArgs(process.argv.slice(2));
const rootDir = path.resolve(args.root || process.cwd());
const csvFile = path.resolve(
  args.csv ||
    findUp(path.join("scans", "rgaa_criteres_ara.csv"), rootDir) ||
    findUp("rgaa_criteres_ara.csv", rootDir) ||
    path.join(rootDir, "scans", "rgaa_criteres_ara.csv"),
);
const outputFile = args.output ? path.resolve(args.output) : null;
const format = args.format || "text";
const failOnIssues = Boolean(args["fail-on-issues"]);

/** @type {Rule[]} */
const RULES = [
  {
    id: "1.1",
    automated: "partiel",
    description: "Images porteuses d'information avec alternative textuelle",
    check: checkImagesHaveAlt,
  },
  {
    id: "1.2",
    automated: "partiel",
    description: "Images décoratives ignorées par les technologies d'assistance",
    check: checkDecorativeImages,
  },
  {
    id: "2.1",
    automated: "oui",
    description: "Cadres avec titre",
    check: checkFramesHaveTitle,
  },
  {
    id: "4.7",
    automated: "partiel",
    description: "Médias clairement identifiables",
    check: checkMediaHaveAccessibleName,
  },
  {
    id: "5.4",
    automated: "partiel",
    description: "Tableaux avec titre correctement associé",
    check: checkTablesHaveCaption,
  },
  {
    id: "5.6",
    automated: "partiel",
    description: "En-têtes de tableaux déclarés",
    check: checkTableHeaders,
  },
  {
    id: "6.2",
    automated: "oui",
    description: "Liens avec intitulé",
    check: checkLinksHaveName,
  },
  {
    id: "8.1",
    automated: "oui",
    description: "Type de document",
    check: checkDoctype,
    htmlDocumentsOnly: true,
  },
  {
    id: "8.3",
    automated: "oui",
    description: "Langue par défaut",
    check: checkHtmlLang,
    htmlDocumentsOnly: true,
  },
  {
    id: "8.5",
    automated: "oui",
    description: "Titre de page",
    check: checkPageTitle,
    htmlDocumentsOnly: true,
  },
  {
    id: "9.1",
    automated: "partiel",
    description: "Présence d'une structure de titres",
    check: checkHeadingStructure,
  },
  {
    id: "9.3",
    automated: "partiel",
    description: "Listes correctement structurées",
    check: checkListStructure,
  },
  {
    id: "11.1",
    automated: "partiel",
    description: "Champs de formulaire avec étiquette",
    check: checkFormFieldsHaveLabel,
  },
  {
    id: "11.9",
    automated: "partiel",
    description: "Boutons avec intitulé",
    check: checkButtonsHaveName,
  },
  {
    id: "12.7",
    automated: "partiel",
    description: "Lien d'évitement ou accès rapide au contenu",
    check: checkSkipLink,
    htmlDocumentsOnly: true,
  },
  {
    id: "13.2",
    automated: "partiel",
    description: "Ouverture de nouvelle fenêtre annoncée",
    check: checkBlankLinksWarnUser,
  },
];

/**
 * Parses simple long-form CLI arguments.
 *
 * Supported forms are `--key value`, `--key=value` and boolean flags.
 *
 * @param {string[]} argv Command-line arguments without `node` and script path.
 * @returns {CliArgs} Parsed argument map.
 */
function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const [rawKey, inlineValue] = arg.slice(2).split("=");
    if (inlineValue !== undefined) {
      parsed[rawKey] = inlineValue;
    } else if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
      parsed[rawKey] = argv[index + 1];
      index += 1;
    } else {
      parsed[rawKey] = true;
    }
  }
  return parsed;
}

/**
 * Searches for a file while walking from a directory up to the filesystem root.
 *
 * @param {string} fileName File name or relative path to find.
 * @param {string} startDir Directory where the search starts.
 * @returns {string|null} Absolute path when found, otherwise null.
 */
function findUp(fileName, startDir) {
  let current = startDir;
  while (true) {
    const candidate = path.join(current, fileName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

/**
 * Parses the semicolon-separated RGAA criteria CSV.
 *
 * @param {string} content CSV file content.
 * @returns {Criterion[]} Parsed criteria rows.
 */
function parseCsv(content) {
  const rows = [];
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || "");

  lines.forEach((line) => {
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    rows.push(row);
  });

  return rows;
}

/**
 * Splits a semicolon-separated CSV line while preserving quoted semicolons.
 *
 * @param {string} line CSV line.
 * @returns {string[]} Parsed cell values.
 */
function splitCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ";" && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Recursively collects files that can contain HTML or HTML templates.
 *
 * @param {string} dir Directory to scan.
 * @param {string[]} [files] Accumulator used during recursion.
 * @returns {string[]} Absolute file paths.
 */
function walkFiles(dir, files = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkFiles(fullPath, files);
      }
      return;
    }

    if (!entry.isFile()) {
      return;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (DEFAULT_EXTENSIONS.has(extension) || (JS_EXTENSIONS.has(extension) && !entry.name.endsWith(".min.js"))) {
      files.push(fullPath);
    }
  });

  return files;
}

/**
 * Loads scan sources from files. JavaScript files are reduced to string
 * literals that look like HTML fragments.
 *
 * @param {string[]} files Absolute file paths.
 * @returns {Source[]} Sources ready for RGAA checks.
 */
function loadSources(files) {
  return files.flatMap((file) => {
    const extension = path.extname(file).toLowerCase();
    const stats = fs.statSync(file);
    if (JS_EXTENSIONS.has(extension) && stats.size > MAX_JS_FILE_SIZE) {
      return [];
    }

    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(rootDir, file).replace(/\\/g, "/");

    if (JS_EXTENSIONS.has(extension)) {
      return extractHtmlFragmentsFromJs(content, relativePath);
    }

    return [
      {
        type: "html",
        path: relativePath,
        content,
        lineOffset: 0,
        isDocument: extension === ".html" || extension === ".htm",
      },
    ];
  });
}

/**
 * Extracts HTML-looking string literals from a JavaScript file.
 *
 * @param {string} content JavaScript source content.
 * @param {string} relativePath Repository-relative JavaScript file path.
 * @returns {Source[]} HTML fragments found in string literals.
 */
function extractHtmlFragmentsFromJs(content, relativePath) {
  const fragments = [];
  const stringRegex = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let match;

  while ((match = stringRegex.exec(content))) {
    const decoded = match[2]
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");

    if (!/<[a-z][\s\S]*>/i.test(decoded)) {
      continue;
    }

    fragments.push({
      type: "js-template",
      path: relativePath,
      content: decoded,
      lineOffset: lineNumberAt(content, match.index) - 1,
      isDocument: false,
    });
  }

  return fragments;
}

/**
 * Computes a one-based line number at a character index.
 *
 * @param {string} content Source content.
 * @param {number} index Character index.
 * @returns {number} One-based line number.
 */
function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

/**
 * Computes a one-based source line number including fragment line offset.
 *
 * @param {Source} source Source being scanned.
 * @param {number} index Character index in source content.
 * @returns {number} One-based line number.
 */
function lineNumber(source, index) {
  return source.lineOffset + lineNumberAt(source.content, index);
}

/**
 * Finds HTML tags by name with a lightweight regular-expression parser.
 *
 * @param {Source} source Source being scanned.
 * @param {string} tagName HTML tag name.
 * @returns {TagMatch[]} Matched tags.
 */
function getTags(source, tagName) {
  const tags = [];
  const regex = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>|<${tagName}\\b([^>]*)\\/?>`, "gi");
  let match;

  while ((match = regex.exec(source.content))) {
    tags.push({
      tag: tagName.toLowerCase(),
      full: match[0],
      attrsText: match[1] || match[3] || "",
      inner: match[2] || "",
      index: match.index,
      attrs: parseAttributes(match[1] || match[3] || ""),
    });
  }

  return tags;
}

/**
 * Parses HTML attributes into a lowercase key/value map.
 *
 * @param {string} attrsText Raw attribute text.
 * @returns {Object.<string, string>} Parsed attributes.
 */
function parseAttributes(attrsText) {
  const attrs = {};
  const regex = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = regex.exec(attrsText))) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attrs;
}

/**
 * Checks if an attribute exists, including empty boolean attributes.
 *
 * @param {Object.<string, string>} attrs Parsed attributes.
 * @param {string} name Attribute name.
 * @returns {boolean} True when the attribute is present.
 */
function hasAttribute(attrs, name) {
  return Object.prototype.hasOwnProperty.call(attrs, name);
}

/**
 * Reads and trims an attribute value.
 *
 * @param {Object.<string, string>} attrs Parsed attributes.
 * @param {string} name Attribute name.
 * @returns {string} Trimmed attribute value or an empty string.
 */
function attrValue(attrs, name) {
  return (attrs[name] || "").trim();
}

/**
 * Removes HTML tags and normalizes whitespace.
 *
 * @param {string} value HTML or text value.
 * @returns {string} Text-only value.
 */
function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Determines if a tag exposes a detectable accessible name.
 *
 * @param {TagMatch} tag Parsed tag.
 * @returns {boolean} True when a text or ARIA/title/alt/value name exists.
 */
function hasAccessibleName(tag) {
  return Boolean(
    stripTags(tag.inner) ||
      attrValue(tag.attrs, "aria-label") ||
      attrValue(tag.attrs, "aria-labelledby") ||
      attrValue(tag.attrs, "title") ||
      attrValue(tag.attrs, "alt") ||
      attrValue(tag.attrs, "value"),
  );
}

/**
 * Builds a normalized issue object for a matched tag.
 *
 * @param {string} ruleId RGAA criterion identifier.
 * @param {Source} source Source containing the issue.
 * @param {TagMatch} tag Tag that triggered the issue.
 * @param {string} message Issue message.
 * @returns {RgaaIssue} Normalized issue.
 */
function issue(ruleId, source, tag, message) {
  return {
    criterion: ruleId,
    file: source.path,
    line: lineNumber(source, tag.index),
    message,
    snippet: tag.full.replace(/\s+/g, " ").slice(0, 180),
  };
}

/**
 * Checks RGAA 1.1 for images without an `alt` attribute.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkImagesHaveAlt(source, ruleId) {
  return getTags(source, "img")
    .filter((tag) => !hasAttribute(tag.attrs, "alt") && attrValue(tag.attrs, "role") !== "presentation")
    .map((tag) => issue(ruleId, source, tag, "Image sans attribut alt."));
}

/**
 * Checks RGAA 1.2 with a heuristic for likely decorative images.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkDecorativeImages(source, ruleId) {
  return getTags(source, "img")
    .filter((tag) => {
      const alt = attrValue(tag.attrs, "alt");
      const role = attrValue(tag.attrs, "role");
      const ariaHidden = attrValue(tag.attrs, "aria-hidden");
      const looksDecorative = /icon|picto|decor|logo|spinner|loader/i.test(
        `${attrValue(tag.attrs, "class")} ${attrValue(tag.attrs, "src")}`,
      );
      return looksDecorative && alt !== "" && role !== "presentation" && role !== "none" && ariaHidden !== "true";
    })
    .map((tag) =>
      issue(
        ruleId,
        source,
        tag,
        "Image probablement décorative non ignorée (alt vide, role=presentation/none ou aria-hidden=true attendu).",
      ),
    );
}

/**
 * Checks RGAA 2.1 for frames without a title.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkFramesHaveTitle(source, ruleId) {
  return [...getTags(source, "iframe"), ...getTags(source, "frame")]
    .filter((tag) => !attrValue(tag.attrs, "title"))
    .map((tag) => issue(ruleId, source, tag, "Cadre sans attribut title."));
}

/**
 * Checks RGAA 4.7 for media elements without a detectable accessible name.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkMediaHaveAccessibleName(source, ruleId) {
  return ["audio", "video", "object", "embed"]
    .flatMap((name) => getTags(source, name))
    .filter((tag) => !hasAccessibleName(tag))
    .map((tag) => issue(ruleId, source, tag, "Média sans nom accessible détectable."));
}

/**
 * Checks RGAA 5.4 for tables without a detectable associated title.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkTablesHaveCaption(source, ruleId) {
  return getTags(source, "table")
    .filter((tag) => !/<caption\b/i.test(tag.inner) && !attrValue(tag.attrs, "aria-label") && !attrValue(tag.attrs, "aria-labelledby"))
    .map((tag) => issue(ruleId, source, tag, "Tableau sans caption, aria-label ou aria-labelledby."));
}

/**
 * Checks RGAA 5.6 for table header cells without `scope` or `headers`.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkTableHeaders(source, ruleId) {
  return getTags(source, "table")
    .filter((tag) => {
      const hasHeaders = /<th\b/i.test(tag.inner);
      const hasScopeOrHeaders = /\s(scope|headers)\s*=/i.test(tag.inner);
      return hasHeaders && !hasScopeOrHeaders;
    })
    .map((tag) => issue(ruleId, source, tag, "Tableau avec en-têtes th sans scope ou headers détectable."));
}

/**
 * Checks RGAA 6.2 for links without a detectable accessible name.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkLinksHaveName(source, ruleId) {
  return getTags(source, "a")
    .filter((tag) => hasAttribute(tag.attrs, "href") && !hasAccessibleName(tag))
    .map((tag) => issue(ruleId, source, tag, "Lien sans intitulé accessible."));
}

/**
 * Checks RGAA 8.1 for a HTML doctype in full documents.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkDoctype(source, ruleId) {
  if (!source.isDocument || /^\s*<!doctype\s+html\b/i.test(source.content)) {
    return [];
  }
  return [
    {
      criterion: ruleId,
      file: source.path,
      line: 1,
      message: "Document HTML sans <!doctype html> en première déclaration.",
      snippet: source.content.slice(0, 180).replace(/\s+/g, " "),
    },
  ];
}

/**
 * Checks RGAA 8.3 for a default language on the `html` element.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkHtmlLang(source, ruleId) {
  const htmlTag = getTags(source, "html")[0];
  if (!source.isDocument || (htmlTag && attrValue(htmlTag.attrs, "lang"))) {
    return [];
  }
  return [
    {
      criterion: ruleId,
      file: source.path,
      line: htmlTag ? lineNumber(source, htmlTag.index) : 1,
      message: "Document HTML sans attribut lang sur la balise html.",
      snippet: htmlTag ? htmlTag.full.replace(/\s+/g, " ").slice(0, 180) : "",
    },
  ];
}

/**
 * Checks RGAA 8.5 for a non-empty page title in full documents.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkPageTitle(source, ruleId) {
  if (!source.isDocument || /<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title>/i.test(source.content)) {
    return [];
  }
  return [
    {
      criterion: ruleId,
      file: source.path,
      line: 1,
      message: "Document HTML sans titre de page non vide.",
      snippet: source.content.slice(0, 180).replace(/\s+/g, " "),
    },
  ];
}

/**
 * Checks RGAA 9.1 for the presence of at least one heading.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkHeadingStructure(source, ruleId) {
  const headings = source.content.match(/<h[1-6]\b[^>]*>/gi) || [];
  if (headings.length > 0) {
    return [];
  }
  return [
    {
      criterion: ruleId,
      file: source.path,
      line: 1,
      message: "Aucun titre h1-h6 détecté dans ce fragment.",
      snippet: source.content.slice(0, 180).replace(/\s+/g, " "),
    },
  ];
}

/**
 * Checks RGAA 9.3 for unexpected direct children in lists.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkListStructure(source, ruleId) {
  return ["ul", "ol"]
    .flatMap((name) => getTags(source, name))
    .filter((tag) => {
      const withoutAllowed = tag.inner
        .replace(/<li\b[\s\S]*?<\/li>/gi, "")
        .replace(/<script\b[\s\S]*?<\/script>/gi, "")
        .replace(/<template\b[\s\S]*?<\/template>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .trim();
      return /<[a-z][\w-]*\b/i.test(withoutAllowed);
    })
    .map((tag) => issue(ruleId, source, tag, "Liste ul/ol contenant un élément enfant direct différent de li."));
}

/**
 * Checks RGAA 11.1 for form fields without a detectable label.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkFormFieldsHaveLabel(source, ruleId) {
  const labelsFor = new Set(getTags(source, "label").map((tag) => attrValue(tag.attrs, "for")).filter(Boolean));
  return ["input", "select", "textarea"]
    .flatMap((name) => getTags(source, name))
    .filter((tag) => {
      const type = attrValue(tag.attrs, "type").toLowerCase();
      if (["hidden", "button", "submit", "reset", "image"].includes(type)) {
        return false;
      }
      const id = attrValue(tag.attrs, "id");
      return !(
        (id && labelsFor.has(id)) ||
        attrValue(tag.attrs, "aria-label") ||
        attrValue(tag.attrs, "aria-labelledby") ||
        attrValue(tag.attrs, "title")
      );
    })
    .map((tag) => issue(ruleId, source, tag, "Champ de formulaire sans étiquette détectable."));
}

/**
 * Checks RGAA 11.9 for buttons without a detectable accessible name.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkButtonsHaveName(source, ruleId) {
  const buttonIssues = getTags(source, "button")
    .filter((tag) => !hasAccessibleName(tag))
    .map((tag) => issue(ruleId, source, tag, "Bouton sans intitulé accessible."));

  const inputIssues = getTags(source, "input")
    .filter((tag) => ["button", "submit", "reset"].includes(attrValue(tag.attrs, "type").toLowerCase()))
    .filter((tag) => !attrValue(tag.attrs, "value") && !attrValue(tag.attrs, "aria-label") && !attrValue(tag.attrs, "title"))
    .map((tag) => issue(ruleId, source, tag, "Bouton input sans intitulé accessible."));

  return [...buttonIssues, ...inputIssues];
}

/**
 * Checks RGAA 12.7 for a skip link in full documents.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkSkipLink(source, ruleId) {
  if (!source.isDocument || /<a\b[^>]*href=["']#(?:main|content|contenu|page-content-wrapper)["'][^>]*>/i.test(source.content)) {
    return [];
  }
  return [
    {
      criterion: ruleId,
      file: source.path,
      line: 1,
      message: "Aucun lien d'évitement vers le contenu principal détecté.",
      snippet: source.content.slice(0, 180).replace(/\s+/g, " "),
    },
  ];
}

/**
 * Checks RGAA 13.2 for `_blank` links without visible or accessible warning.
 *
 * @param {Source} source Source being scanned.
 * @param {string} ruleId RGAA criterion identifier.
 * @returns {RgaaIssue[]} Detected issues.
 */
function checkBlankLinksWarnUser(source, ruleId) {
  return getTags(source, "a")
    .filter((tag) => attrValue(tag.attrs, "target").toLowerCase() === "_blank")
    .filter((tag) => !/nouvelle fenêtre|nouvel onglet|new window|new tab/i.test(`${stripTags(tag.inner)} ${attrValue(tag.attrs, "title")} ${attrValue(tag.attrs, "aria-label")}`))
    .map((tag) => issue(ruleId, source, tag, "Lien target=_blank sans avertissement détectable."));
}

/**
 * Runs all configured rules against all sources.
 *
 * @param {Criterion[]} criteria Criteria loaded from the CSV.
 * @param {Source[]} sources Sources to scan.
 * @returns {{id: string, thematique: string, critere: string, automated: string, issues: RgaaIssue[]}[]} Rule results.
 */
function runRules(criteria, sources) {
  const criteriaById = new Map(criteria.map((criterion) => [criterion.id, criterion]));

  return RULES.map((rule) => {
    const criterion = criteriaById.get(rule.id);
    const issues = sources.flatMap((source) => {
      if (rule.htmlDocumentsOnly && !source.isDocument) {
        return [];
      }
      return rule.check(source, rule.id);
    });

    return {
      id: rule.id,
      thematique: criterion?.thematique || "",
      critere: criterion?.critere || rule.description,
      automated: rule.automated,
      issues,
    };
  });
}

/**
 * Renders rule results as a text report.
 *
 * @param {{id: string, critere: string, automated: string, issues: RgaaIssue[]}[]} results Rule results.
 * @param {number} sourceCount Number of HTML fragments scanned.
 * @returns {string} Text report.
 */
function renderText(results, sourceCount) {
  const issueCount = results.reduce((total, result) => total + result.issues.length, 0);
  const lines = [
    "Scan RGAA statique",
    "===================",
    "",
    `Racine: ${rootDir}`,
    `CSV: ${csvFile}`,
    `Fragments HTML analysés: ${sourceCount}`,
    `Critères automatisés ou partiels: ${results.length}`,
    `Anomalies détectées: ${issueCount}`,
    "",
  ];

  results.forEach((result) => {
    lines.push(`${result.id} - ${result.critere}`);
    lines.push(`Automatisation: ${result.automated}`);

    if (result.issues.length === 0) {
      lines.push("- OK: aucune anomalie statique détectée");
    } else {
      result.issues.forEach((item) => {
        lines.push(`- ${item.file}:${item.line} - ${item.message}`);
        if (item.snippet) {
          lines.push(`  ${item.snippet}`);
        }
      });
    }

    lines.push("");
  });

  lines.push("Limite: ce script ne remplace pas un audit RGAA manuel. Les critères marqués partiels sont des heuristiques statiques.");
  return `${lines.join("\n")}\n`;
}

/**
 * Runs the scanner and writes the requested report format.
 *
 * @returns {void}
 */
function main() {
  if (!fs.existsSync(csvFile)) {
    throw new Error(`CSV introuvable: ${csvFile}`);
  }

  const criteria = parseCsv(fs.readFileSync(csvFile, "utf8"));
  const sources = loadSources(walkFiles(rootDir));
  const results = runRules(criteria, sources);
  const issueCount = results.reduce((total, result) => total + result.issues.length, 0);
  const report = format === "json" ? `${JSON.stringify({ rootDir, csvFile, results }, null, 2)}\n` : renderText(results, sources.length);

  if (outputFile) {
    fs.writeFileSync(outputFile, report, "utf8");
  } else {
    process.stdout.write(report);
  }

  if (failOnIssues && issueCount > 0) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
