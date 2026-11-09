(function () {
  /**
   * Opens an element with a vertical animation.
   *
   * @param {HTMLElement} element Element to open.
   * @param {number} [duration=300] Animation duration in milliseconds.
   * @returns {void}
   */
  function slideDown(element, duration = 300) {
    element.style.removeProperty("display");
    let display = getComputedStyle(element).display;
    if (display === "none") display = "block";
    element.style.display = display;

    const height = element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = "0";
    element.style.paddingTop = "0";
    element.style.paddingBottom = "0";
    element.style.marginTop = "0";
    element.style.marginBottom = "0";
    element.offsetHeight;

    element.style.transition = `all ${duration}ms ease`;
    element.style.removeProperty("padding-top");
    element.style.removeProperty("padding-bottom");
    element.style.removeProperty("margin-top");
    element.style.removeProperty("margin-bottom");
    element.style.height = `${height}px`;

    window.setTimeout(() => {
      element.style.removeProperty("height");
      element.style.removeProperty("overflow");
      element.style.removeProperty("transition");
    }, duration);
  }

  /**
   * Closes an element with a vertical animation.
   *
   * @param {HTMLElement} element Element to close.
   * @param {number} [duration=300] Animation duration in milliseconds.
   * @returns {void}
   */
  function slideUp(element, duration = 300) {
    element.style.transition = `all ${duration}ms ease`;
    element.style.height = `${element.offsetHeight}px`;
    element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = "0";
    element.style.paddingTop = "0";
    element.style.paddingBottom = "0";
    element.style.marginTop = "0";
    element.style.marginBottom = "0";

    window.setTimeout(() => {
      element.style.display = "none";
      element.style.removeProperty("height");
      element.style.removeProperty("padding-top");
      element.style.removeProperty("padding-bottom");
      element.style.removeProperty("margin-top");
      element.style.removeProperty("margin-bottom");
      element.style.removeProperty("overflow");
      element.style.removeProperty("transition");
    }, duration);
  }

  /**
   * Animates the vertical opening or closing of an element, similarly to
   * jQuery's `slideToggle` method.
   *
   * @param {HTMLElement} element Element to open or close.
   * @param {number} [duration=300] Animation duration in milliseconds.
   * @returns {void}
   */
  utils.slideToogle = function (element, duration = 300) {
    if (getComputedStyle(element).display === "none") {
      slideDown(element, duration);
    } else {
      slideUp(element, duration);
    }
  };
})();
