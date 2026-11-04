/**
 * Normalize a layer declutter setting to an OpenLayers-compatible value.
 *
 * Accepts booleans, common string flags, and explicit declutter modes.
 *
 * @param {boolean|string|null|undefined} value
 * @param {boolean|string} [defaultValue=false]
 * @returns {boolean|string}
 */
const normalizeDeclutter = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
    if (["declutter", "obstacle", "none"].includes(normalized)) {
      return normalized;
    }
  }

  return defaultValue;
};

window.configurationUtils = Object.assign(window.configurationUtils || {}, {
  normalizeDeclutter,
});
