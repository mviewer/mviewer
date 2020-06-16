const layerfilter = (function() {

  let _input;
  let _clearbutton;
  let _layerfilter = function (e) {
      const term = $("#layerfilter-field").val().toLowerCase().trim();
      _clearbutton.style.display = term === "" ? "none" : "block";
      $("#menu li").hide().filter(function() {
        // display decision for currently filtered theme, group or layer 
        const occurs = $(this).children("a").text().toLowerCase().trim().indexOf(term) !== -1;
        if (term === ""){
          $(this).removeClass("opened");
          $(this).children("ul").hide();
        } else if (occurs) {
          // display and open themes and groups if filtered layer matches
          $(this).parents().show();
          $(this).parents("li").addClass("opened");
          // display and open groups and layers if filtered theme or group matches
          if ($(this).parent("#menu").length === 1 || $(this).parent().parent().parent("#menu").length === 1) {
            $(this).children("ul").show();
            $(this).children().children("li").show();
            $(this).children().children().children("ul").show();
            $(this).children().children().children().children("li").show();
          }
        }
        return occurs;
      }).show();
  };

  let _clearfilter = function (e) {
    $("#layerfilter-field").val("");
    _layerfilter();
  }

  return {
      init : function () {
          _input = document.getElementById("layerfilter-field");
          _input.addEventListener('keyup', _layerfilter);
          _clearbutton = document.getElementById("layerfilter-clear");
          _clearbutton.addEventListener('click', _clearfilter);
      }
  };

})();

new CustomComponent("layerfilter", layerfilter.init);