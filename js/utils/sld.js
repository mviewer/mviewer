/** @type {Map<string, Promise<string>>} */
var _localWmsSldRequests = new Map();

/**
 * Embeds loopback SLDs and resolves public SLD URLs for WMS requests.
 * @param {string} src WMS request URL.
 * @returns {Promise<string>} Resolved request URL.
 */
export const resolveLocalWmsSld = async function (src) {
  var requestUrl = new URL(src, window.location.href);
  var sld = requestUrl.searchParams.get("SLD") || requestUrl.searchParams.get("sld");
  if (!sld) return src;
  var sldUrl = new URL(sld, window.location.href);
  var hostname = sldUrl.hostname;
  var local =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^127\./.test(hostname) ||
    hostname === "[::1]";
  if (!local) {
    if (sld === sldUrl.href) return src;
    // Resolve paths against the viewer.
    requestUrl.searchParams.delete("sld");
    requestUrl.searchParams.set("SLD", sldUrl.href);
    return requestUrl.href;
  }

  var content = _localWmsSldRequests.get(sldUrl.href);
  if (!content) {
    // Share one fetch across concurrent requests.
    content = fetch(sldUrl.href).then(function (response) {
      if (!response.ok) throw new Error("Unable to read local SLD: " + response.status);
      return response.text();
    });
    _localWmsSldRequests.set(sldUrl.href, content);
  }
  try {
    requestUrl.searchParams.delete("SLD");
    requestUrl.searchParams.delete("sld");
    requestUrl.searchParams.set("sld_body", await content);
  } catch (error) {
    // Allow retries after a failed fetch.
    _localWmsSldRequests.delete(sldUrl.href);
    throw error;
  }
  return requestUrl.href;
};

/**
 * Checks configured SLD URLs without fetching them.
 * @param {Array<object>} layers Layer configurations.
 * @returns {number} 1 if valid, otherwise 0.
 */
export const testSld = function (layers) {
  var test = 1;
  layers.forEach(function (layer) {
    if (layer && layer.sld) {
      var name = layer.name;
      var slds = layer.sld.split(",");
      slds = slds.map((sld) => configuration.renderEnvPath(sld));
      slds.forEach(function (sld, i) {
        var validSld = false;
        try {
          var sldUrl = new URL(sld, window.location.href);
          // Ignore query parameters when checking the extension.
          validSld =
            ["http:", "https:"].includes(sldUrl.protocol) &&
            /\.sld$/i.test(sldUrl.pathname);
        } catch (error) {
          validSld = false;
        }
        if (!validSld) {
          test = 0;
          console.log(`sld ${sld}\nnon valide pour la couche ${name}`);
        }
      });
    }
  });
  return test;
};
