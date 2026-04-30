const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

/**
 * Runs the Retire.js scan and generates the plain-text security report
 * used by the npm `scan` script and the GitHub Actions workflow.
 */
const reportDate = process.env.REPORT_DATE || new Date().toISOString().slice(0, 10);
const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
const reportBasename = process.env.REPORT_BASENAME || "security-report.txt";
const reportFile = process.env.REPORT_FILE || path.join(workspace, reportBasename);
const retireJsonFile = process.env.RETIRE_OUTPUT_FILE || path.join(process.cwd(), "retire-develop.json");

function runRetireScan() {
  const retire = process.platform === "win32" ? "retire.cmd" : "retire";
  const result = spawnSync(retire, ["--path", ".", "--outputformat", "json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  if (result.error) {
    throw new Error(`Unable to execute Retire.js: ${result.error.message}`);
  }

  fs.writeFileSync(retireJsonFile, result.stdout || "", "utf8");

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

function loadRetireJson() {
  try {
    return JSON.parse(fs.readFileSync(retireJsonFile, "utf8") || "{}");
  } catch (error) {
    console.warn("Impossible de parser retire-develop.json:", error.message);
    return { data: [] };
  }
}

function collectRows(json) {
  const issues = Array.isArray(json.data)
    ? json.data
    : Array.isArray(json.results)
      ? json.results
      : [];
  const rows = [];
  const seen = new Set();

  issues.forEach((item) => {
    const file = item.file || item.fileName || "unknown";
    const results = Array.isArray(item.results) && item.results.length > 0 ? item.results : [item];

    results.forEach((result) => {
      const pkg = result.package || result.component || result.componentName || path.basename(file);
      const version = result.version || result.componentVersion || "inconnue";
      const vulns = Array.isArray(result.vulnerabilities)
        ? result.vulnerabilities
        : Array.isArray(result.vulns)
          ? result.vulns
          : [];
      const vulnKnown = vulns.length > 0 ? "Oui" : "Non";
      const severity = vulns.map((vuln) => (vuln.severity || "").toLowerCase());
      const risk =
        vulnKnown === "Oui"
          ? severity.includes("high")
            ? "Critique"
            : severity.includes("medium")
              ? "Élevé"
              : "Moyen"
          : "Faible";
      const action =
        vulnKnown === "Oui"
          ? "Mettre à jour ou remplacer la dépendance vulnérable"
          : "Aucune action urgente";
      const cves = Array.from(
        new Set(
          vulns.flatMap((vuln) => {
            const identifiers = vuln.identifiers || {};
            return Array.isArray(identifiers.CVE) ? identifiers.CVE : [];
          }),
        ),
      );
      const cveList = cves.length > 0 ? cves.join(", ") : "Aucune";
      const key = `${pkg}|${file}|${version}|${risk}|${cveList}`;

      if (!seen.has(key)) {
        seen.add(key);
        rows.push({ pkg, file, version, vulnKnown, risk, cveList, action });
      }
    });
  });

  return rows;
}

function collectScriptLines(dir = ".") {
  const scriptLines = [];

  const walk = (currentDir) => {
    fs.readdirSync(currentDir, { withFileTypes: true }).forEach((entry) => {
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === ".git" || entry.name === "node_modules") {
          return;
        }
        walk(full);
        return;
      }

      if (!entry.isFile() || !full.endsWith(".html")) {
        return;
      }

      const content = fs.readFileSync(full, "utf8");
      const regexp = /<script\s+[^>]*src=['"]([^'"]+)['"][^>]*>/gi;
      let match;
      while ((match = regexp.exec(content))) {
        const relativePath = path.relative(process.cwd(), full).replace(/\\/g, "/");
        scriptLines.push(`- \`${relativePath}\`: \`${match[1]}\``);
      }
    });
  };

  walk(dir);
  return scriptLines;
}

function writeReport(rows, scriptLines) {
  const vulnCount = rows.filter((row) => row.vulnKnown === "Oui").length;
  let report = "";
  report += "Mviewer - Rapport d'audit sécurité JavaScript\n";
  report += "=============================================\n\n";
  report += `Date: ${reportDate}\n`;
  report += "Périmètre: branche develop\n\n";
  report += "Résumé exécutif\n";
  report += "----------------\n";
  report += "- Scan Retire.js exécuté sur develop\n";
  report += `- Dépendances vulnérables détectées: ${vulnCount}\n`;
  report += "- Rapport généré au format texte\n\n";
  report += "Tableau détaillé\n";
  report += "---------------\n\n";
  report += "Script / Librairie | Source | Version | Vuln connue | Risque | CVE | Action recommandée\n";
  report += "-------------------|--------|---------|--------------|--------|-----|--------------------\n";

  if (rows.length === 0) {
    report += "- Aucun résultat enregistré | develop | - | Non | Faible | Aucune | Aucune action urgente\n";
  } else {
    rows.forEach((row) => {
      report += `- ${row.pkg} | ${row.file} | ${row.version} | ${row.vulnKnown} | ${row.risk} | ${row.cveList} | ${row.action}\n`;
    });
  }

  report += "\nScripts HTML détectés\n";
  report += "---------------------\n";
  report += scriptLines.length === 0 ? "- Aucun script HTML détecté\n" : `${scriptLines.join("\n")}\n`;
  report += "\nRecommandations\n";
  report += "---------------\n";
  report += "- Corriger les vulnérabilités identifiées par Retire.js.\n";
  report += "- Mettre à jour les dépendances vulnérables et anciennes.\n";
  report += "- Ajouter SRI pour les scripts distants.\n";

  fs.writeFileSync(reportFile, report, "utf8");
}

function main() {
  runRetireScan();
  const json = loadRetireJson();
  const rows = collectRows(json);
  const scriptLines = collectScriptLines(".");
  writeReport(rows, scriptLines);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report-file=${reportFile}\n`, "utf8");
  }

  console.log(`Generated report at ${reportFile}`);
}

main();
