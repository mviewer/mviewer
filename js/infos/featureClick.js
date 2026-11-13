/**
 * Normalizes a feature selection and expands cluster members for information queries.
 * @param {ol.Feature|ol.Feature[]} features Selected features or cluster features.
 * @param {boolean} [expandClusters=true] False for handlers that expect cluster wrappers.
 * @returns {ol.Feature[]} Selected features, without duplicate references.
 */
export const getClickedFeatures = (features, expandClusters = true) => {
  const selection = Array.isArray(features) ? features : features ? [features] : [];
  const items = selection.flatMap((feature) => {
    const members = expandClusters ? feature.get("features") : undefined;
    return Array.isArray(members) ? members : [feature];
  });
  return [...new Set(items)];
};

/**
 * Builds a click context without hit-testing unrelated features at the same pixel.
 * Coordinates and geometries must use the map projection.
 * @param {ol.Feature|ol.Feature[]} features Selected features.
 * @param {ol.Map} map Map containing the selected layer.
 * @param {ol.coordinate.Coordinate} [coordinate] Optional click position.
 * @returns {object} Single-click context accepted by info.queryMap.
 */
export const createFeatureClickEvent = (features, map, coordinate) => {
  if (!coordinate) {
    const extent = ol.extent.createEmpty();
    getClickedFeatures(features).forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry) ol.extent.extend(extent, geometry.getExtent());
    });
    coordinate = ol.extent.isEmpty(extent)
      ? map.getView().getCenter()
      : ol.extent.getCenter(extent);
  }
  return {
    type: "singleclick",
    coordinate,
    pixel: map.getPixelFromCoordinate(coordinate),
  };
};
