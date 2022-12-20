/**
 * Utils to create Fuse instance
 */
var search = (function () {
  /**
   * Create Fuse instance
   * @param {JSON} file
   */
  function _init(file) {
    // create Fuse instance
    return new Fuse(file.data, _getOptions(file));
  }

  /**
   * Get options needed by Fuse instance
   * @param {Object} file from parsed JSON file
   * @return {Object} to pass to Fuse as Fuse options
   */
  function _getOptions(file) {
    // return options as object
    const options = {
      isCaseSensitive: false,
      findAllMatches: false,
      includeMatches: false,
      includeScore: false,
      useExtendedSearch: false,
      minMatchCharLength: 1,
      shouldSort: true,
      threshold: file.config.searchFlexibility || 0.5,
      location: 0,
      distance: 100,
      keys: file.config.searchKeys,
    };
    return options;
  }
  return {
    init: _init,
  };
})();
