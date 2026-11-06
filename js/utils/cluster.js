/**
 * @typedef {object} ClusterStyleOptions
 * @property {number|string} [radius] Circle radius in pixels.
 * @property {string} [strokeColor] Circle outline color.
 * @property {string} [fillColor] Circle fill color.
 * @property {string} [textFillColor] Cluster count color.
 */

/** Wraps an OpenLayers cluster source and a cached count-based style function. */
export class Cluster {
  /**
   * Creates clusters from an existing vector source without changing its loader.
   * @param {ol.source.Vector} source Source containing the features to cluster.
   * @param {number|string} [distance=20] Clustering distance in pixels.
   * @param {number|string} [minDistance=0] Minimum cluster spacing in pixels.
   * @param {number|string} [radius=10] Circle radius in pixels.
   */
  constructor(source, distance = 20, minDistance = 0, radius = 10) {
    this._source = new ol.source.Cluster({
      source,
      distance: parseInt(distance, 10),
      minDistance: parseInt(minDistance, 10),
      // PointStacker SLD filters and labels refer to the count property.
      createCluster: (geometry, features) =>
        new ol.Feature({ geometry, features, count: features.length }),
    });
    /** @type {Map<number, ol.style.Style>} */
    this._styleCache = new Map();
    this._styleParams = {
      radius: Number(radius),
      strokeColor: "#fff",
      fillColor: "#3399CC",
      textFillColor: "#fff",
    };
    // Keep the callback bound when passed to an OpenLayers layer.
    this._style = (feature) => {
      const size = feature?.get("features")?.length;
      if (!size) return;
      if (!this._styleCache.has(size)) {
        const { radius, strokeColor, fillColor, textFillColor } = this._styleParams;
        this._styleCache.set(
          size,
          new ol.style.Style({
            image: new ol.style.Circle({
              radius,
              stroke: new ol.style.Stroke({ color: strokeColor }),
              fill: new ol.style.Fill({ color: fillColor }),
            }),
            text: new ol.style.Text({
              text: size.toString(),
              fill: new ol.style.Fill({ color: textFillColor }),
            }),
          })
        );
      }
      return this._styleCache.get(size);
    };
  }

  /** @returns {ol.source.Cluster} Cluster source for an OpenLayers layer. */
  get source() {
    return this._source;
  }

  /**
   * Replaces the underlying vector source while preserving clustering options.
   * @param {ol.source.Vector|null} source Replacement source, or null to detach it.
   */
  set source(source) {
    this._source.setSource(source);
  }

  /** @returns {ol.style.StyleFunction} Style callback for an OpenLayers layer. */
  get style() {
    return this._style;
  }

  /**
   * Updates circle and text colors or radius, preserving omitted options.
   * @param {ClusterStyleOptions} [options={}] Simple cluster style overrides.
   * @returns {void}
   */
  setClusterStyle({ radius, strokeColor, fillColor, textFillColor } = {}) {
    const updates = { radius, strokeColor, fillColor, textFillColor };
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        this._styleParams[key] = key === "radius" ? Number(value) : value;
      }
    });
    // Cached symbols contain the previous colors and radius; redraw after clearing.
    this._styleCache.clear();
    this._source.changed();
  }

  /**
   * Updates the distance within which points are grouped.
   * @param {number|string} distance Distance in pixels.
   */
  set distance(distance) {
    this._source.setDistance(parseInt(distance, 10));
  }

  /**
   * Updates cluster spacing, capped by OpenLayers at the clustering distance.
   * @param {number|string} minDistance Minimum spacing in pixels.
   */
  set minDistance(minDistance) {
    this._source.setMinDistance(parseInt(minDistance, 10));
  }

  /**
   * Updates the circle radius and invalidates cached styles.
   * @param {number|string} radius Circle radius in pixels.
   */
  set radius(radius) {
    this.setClusterStyle({ radius });
  }
}
