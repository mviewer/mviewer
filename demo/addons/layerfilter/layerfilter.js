const layerfilter = (function () {
  let _input;
  let _clearbutton;
  let _fuseMotor;

  const defaultFuseOptions = {
    threshold: 0.3,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
  };

  /**
   * Create a fuse instance from menu list text
   * @param {string} term - input by user to filter layers
   */
  let createFuseMotor = (term) => {
    if (!$("#menu li").children("a").length || _fuseMotor) return;
    const list = [];
    const menuLi = $("#menu li");

    menuLi.children("a").each((i, el) => list.push(el.text));
    // options by default or from addon config.json file
    _fuseMotor = new Fuse(list, {
      ...defaultFuseOptions,
      ...mviewer.customComponents["layerfilter"].config.options.fuseOptions,
    });
  };

  /**
   * Event callback to filter TOC layers from string
   *
   * TODO : empty term will display original TOC template
   * Actually, removed string display totally closed layers group
   *
   * @param {object} e - event object
   * @returns  {boolean}
   */
  let _layerfilter = function (e) {
    const term = $("#layerfilter-field").val().toLowerCase().trim();
    _clearbutton.style.display = term === "" ? "none" : "block";
    // init fuse only if if not exists
    createFuseMotor();
    // search term with fuse
    const result = _fuseMotor.search($("#layerfilter-field").val().toLowerCase().trim());
    $("#menu li")
      .hide()
      .filter(function () {
        // display decision for currently filtered theme, group or layer
        let toOpen = result.map((e) => e.item).includes($(this).children("a").text());
        if (term === "") {
          $(this).removeClass("opened");
          $(this).children("ul").hide();
        } else if (toOpen) {
          // display and open themes and groups if filtered layer matches
          $(this).parents().show();
          $(this).parents("li").addClass("opened");
          // display and open groups and layers if filtered theme or group matches
          if (
            $(this).parent("#menu").length === 1 ||
            $(this).parent().parent().parent("#menu").length === 1
          ) {
            $(this).children("ul").show();
            $(this).children().children("li").show();
            $(this).children().children().children("ul").show();
            $(this).children().children().children().children("li").show();
          }
        }
        return !term ? true : toOpen;
      })
      .show();
  };

  let _clearfilter = function (e) {
    $("#layerfilter-field").val("");
    _layerfilter();
  };

  return {
    init: function () {
      _input = document.getElementById("layerfilter-field");
      _input.addEventListener("keyup", _layerfilter);
      _clearbutton = document.getElementById("layerfilter-clear");
      _clearbutton.addEventListener("click", _clearfilter);
    },
  };
})();

new CustomComponent("layerfilter", layerfilter.init);
